---
title: 'A LibreSDR + Hailo signal lab on a Pi 5: the half that fought back'
date: 2026-06-12
summary: A Raspberry Pi 5, a 26-TOPS Hailo accelerator, and a Pluto-class LibreSDR, meant to be a self-contained RF signal-analysis box. The radio enumerates and reports its AD9361 config over IIO, and then the open-source SDR toolchain and the vendor ML stack both fight to a standstill. An honest bring-up log.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['sdr', 'rf', 'raspberry-pi', 'hailo', 'gnu-radio', 'homelab']
draft: false
---

This project is unfinished, and I'm writing the bring-up the way it actually went, walls included, because on this one the walls are where the work is. If you're looking for a tidy "and then it detected drones" ending, it isn't here yet. What's here is how far a Pluto-class SDR and an edge-AI accelerator got on a Raspberry Pi 5, and the exact points where each one stuck.

## The idea

A Pi 5 + a Hailo accelerator + a software-defined radio, as one self-contained box for **RF signal analysis**. Radio, not another camera/object-detection demo. The applications I'm building toward, none of them finished: band identification, rogue/anomaly device detection, drone-signal detection, jamming and interference detection, and RF device fingerprinting. The passive RF situational-awareness a security person wants on a shelf.

So far the radio talks to the Pi, and almost nothing downstream of "the radio talks to the Pi" works yet. Here's how far it got.

## The hardware

- **Raspberry Pi 5**, 8GB (the CanaKit "Quick-Start AI Kit"), booting off NVMe.
- **Hailo-8 AI Hat, 26 TOPS**, the accelerator that's supposed to run signal classification on-device.
- **LibreSDR Rev.5**, a Pluto-class SDR: a Xilinx Zynq-7020 FPGA paired with an Analog Devices AD9361 transceiver, the same chip family as the ADALM-PLUTO, tuning 70 MHz to 6 GHz, transmit-capable. (I also have an ADALM-PLUTO; the LibreSDR is the wider, higher-sample-rate cousin.)

Why a Pluto-class SDR and not a cheap RTL dongle: the AD9361 is a real transceiver, with wide tuning, real bandwidth, and it *transmits*, and it presents itself over Analog Devices' **IIO** framework rather than as a simple USB device. That framework turns out to be the whole story.

## Getting the radio to talk

A LibreSDR doesn't just show up as `/dev/something`. It's a small Linux device in its own right that exposes the AD9361 over libiio, either as a USB gadget or over Ethernet. The defaults:

- **USB gadget:** the SDR is `192.168.2.1`, the host takes `192.168.2.10/24`.
- **Ethernet:** the SDR is `192.168.1.10`, the host `192.168.1.11/24`.

I wanted it wired directly to the Pi, no wireless anywhere in the path. Changing the device's IP is supposed to be a matter of editing a file on the mass-storage gadget it presents, except the mass-storage gadget wasn't showing up. The fallbacks are the usual embedded-Linux ones: drop to the serial console (`tio /dev/ttyUSB0 115200`, or `screen` at the same baud), `fw_setenv usb_msc_enable 1` to bring the gadget back, or hold the BOOT button to revert to defaults. The network config itself lives in `/opt/config.txt`:

```ini
[NETWORK]
ipaddr_eth = 192.168.1.10
netmask_eth = 255.255.255.0
gateway_eth =

[USB_ETHERNET]
```

The payoff, and the one unambiguous win in this entire writeup, is the radio enumerating over IIO:

```text
turtle@leonardo:~$ iio_info -u ip:10.0.0.1
IIO context: libiio 0.25 (network backend)
  LibreSDR Rev.5   fw v0.38-dirty
  iio:device0: ad9361-phy
    rx_lo:               2.4 GHz
    tx_lo:               2.45 GHz
    sampling_frequency:  30720000
    rf_bandwidth:        18000000
    gain_control_mode:   slow_attack
    hardwaregain (rx):   71 dB
  cf-ad9361-lpc: (buffer capable)
```

That's the AD9361, alive, reporting its registers: a 30.72 MSPS sample rate, 18 MHz of bandwidth, RX tuned to 2.4 GHz, AGC in slow-attack. A few attributes refuse to read:

```text
fastlock_recall   ERROR: Invalid argument (22)
dcxo_tune_coarse  ERROR: No such device (19)
multichip_sync    ERROR: Permission denied (13)
```

Which is fine; those are calibration and multi-chip-sync features this firmware doesn't expose. The caveat that matters is easy to skip past: `data_available: 0` on the capture devices. The radio is enumerated and configured, but not streaming, and that distinction is the line that everything after this fails to cross.

## Wall one: the GNU Radio bridge won't build

To pull IQ samples and see a spectrum, you need the chain from the AD9361 up into GNU Radio: libiio → libad9361 → **gr-iio** (the PlutoSDR Source block) → a flowgraph. On Raspberry Pi OS (Bookworm), that chain is a build-from-source minefield, and the guides have rotted.

The apt route gets you partway and then lies to you. `volk2-dev` is actually `libvolk2-dev` on Bookworm; `libad9361-iio-utils` and `libad9361-iio-dev` aren't in stable at all, so those have to come from GitHub. Building libiio from source then walks you down a chain of missing dependencies (`libzstd`, `avahi-common`/`avahi-client`, `libaio`, `flex`, `bison`), each one a failed CMake run until you install the next (`sudo apt install libzstd-dev libavahi-client-dev libavahi-common-dev`, and onward). That part *does* eventually work: the `libiio 0.25` in the `iio_info` output above is the proof.

`gr-iio` is where it stops. The clone is fine; the version isn't:

```text
turtle@leonardo:~$ git checkout maint-3.10
error: pathspec 'maint-3.10' did not match any file(s) known to git
```

The branch every walkthrough points at is gone. Building from `main` instead, CMake can't find the AD9361 library it depends on:

```text
AD9361_INCLUDE_DIRS-NOTFOUND
ad9361.h: No such file or directory
```

And underneath that, the module still ships a Python-2 `print "..."` in `attr_updater.py` that a Python-3 build chokes on, plus Boost `shared_ptr` conversion errors from a GNU Radio API that's moved on since the code was written. So: libiio works, the device enumerates, and the block that's supposed to turn that into samples won't compile.

The other path, running a SoapySDR server on the radio and reaching it over the network with SoapyRemote, gets a different flavour of nothing:

```text
turtle@leonardo:~$ SoapySDRUtil --verbose --find="driver=remote,server=192.168.4.102"
No devices found
```

The Pi pings the host fine. There's just no SoapyRemote server answering on the far end (it listens on 55132), and no `SoapySDRServer` binary on the box to start one, which is another from-source build waiting its turn in the queue.

## Wall two: the Hailo is gated behind an old Python

The whole reason for the Hailo is to run signal classification **on-device**: turn a capture into a spectrogram, infer the modulation or the emitter, at the edge, without shipping IQ anywhere. The accelerator is a 26-TOPS Hailo-8. The blocker is mundane and total: the vendor runtime pins Python.

```text
(libresdr-env) turtle@leonardo:~$ hailortcli -v
hailortcli: command not found
turtle@leonardo:~$ sudo apt install hailo-all
E: Unable to locate package hailo-all
```

HailoRT's Python bindings support 3.8 through 3.11. The Pi was on **3.12**, which is too new for it. So: build Python 3.10 from source, make a `hailo-env` virtualenv, install into that. The runtime *appears*:

```text
(hailo-env) $ pip list | grep -i hailo
hailort   4.21.0
```

And then the imports still don't line up. My `rf_classifier.py` dies on `ModuleNotFoundError: No module named 'iio'` (the libiio Python binding didn't follow me into the 3.10 venv, and `pip install pylibiio` didn't fix it). `import hailo` fails too: the installed package exposes `hailo_platform`, not `hailo`, so every example that opens with `import hailo` is wrong for this version. The venv's site-packages has `hailo_platform` and an `iio.py`, but no `hailo` / `hailort` / `pyhailort` module to import. Even the path forward, converting a `signal_classifier.onnx` to a Hailo `.hef` and running it through `hailo_platform`, sits behind a toolchain I haven't stood up yet.

I got far enough to seriously weigh switching the whole base OS to get out from under it (Ubuntu 24.04 Server, Armbian, even Arch Linux ARM with a 16K-page kernel), which tells you how deep this particular yak stack goes. As of now the Hailo path is unresolved.

## What actually works

Two things, stated honestly:

- **The radio enumerates and reports its full AD9361 configuration over IIO.** That proves the FPGA image, the firmware, the libiio chain, and the network transport are all good. It's the foundation, short of actual reception.
- **The sensor half of the bench works.** The [PicoPH](/builds/picoph) side, a Pico W publishing pH and voltage over MQTT, was always the easy, finished part. Useful as a reality check: the distance between "a microcontroller posts a number" and "an SDR feeds an edge-ML signal classifier" is enormous, and almost all of that distance is toolchain, not radio.

## Where it's headed: a passive drone-detection node

The north star for this box is **passive drone detection**: the defensive, situational-awareness kind, nothing that touches a drone. The design on paper is a multi-sensor correlation node, and it's the reason the parts bin has the contents it does:

- **RF capture** across the bands consumer drones actually use: 2.4 GHz (DJI and WiFi-based control), 5.8 GHz (FPV video links), and sub-GHz (LoRa-style long-range control). That's the SDR's job, and the reason a wideband AD9361 radio matters more here than an RTL dongle.
- **BLE scanning**, a few Bluetooth radios watching for the controllers and handsets that travel with a drone, so an RF hit can be corroborated by a nearby device instead of standing on its own.
- **GPS**, three modules, less for navigation than for **time-synchronisation and rough triangulation**: synchronised timestamps across nodes are what let you start to localise *where* an emitter is, not just that it exists.
- **The Hailo**, doing the part that makes it more than a spectrum analyzer: classifying a capture as *drone vs WiFi vs noise* on-device, because the signal you care about is buried in everything else sharing 2.4 GHz.

The engineering caveat, and the reason the AI layer is load-bearing rather than decorative, is that detection gets you a flag, not an identification. Consumer drones frequency-hop and encrypt their links, so you're not reading a DJI control packet off the air. What you can do is learn the shape of the emission and flag it, the kind of pattern problem an edge accelerator is for. None of this is built; it's the architecture the bring-up above is trying to earn its way toward.

## What's still ahead (and not claimed)

None of the actual RF analysis exists yet: no captured IQ, no live waterfall, no decoded ADS-B or FM or anything else pulled off the air, no trained classifier, no Hailo-accelerated inference, no drone or rogue-device or jamming detection. Those are the goal, not the status. The next real milestone is unglamorous: get **one** clean stream of samples out of the AD9361 and onto a screen, whether that's a fixed gr-iio, a from-source SoapyRemote, or `pyadi-iio` talking to the device directly and skipping GNU Radio entirely.

## Takeaways

- **A Pluto-class SDR is a small Linux device, closer to an embedded board than a dongle.** It speaks Analog Devices' IIO framework; "plug it in and open GQRX" is not how this hardware works. Standing up the IIO toolchain is most of the work.
- **`iio_info` enumerating the device is the wrong success to celebrate.** Enumerated, configured, and *streaming* are three different states, and `data_available: 0` is the tell that you're only in the first two.
- **The ADI SDR stack on ARM/Bookworm is build-from-source, and the docs have aged out.** Renamed packages (`libvolk2-dev`), packages missing from stable, a `gr-iio` whose `maint-3.10` branch is gone and whose `main` won't compile. Budget real time for it.
- **Vendor edge-ML runtimes pin old Python and fight modern distros.** HailoRT wanting 3.8 through 3.11 on a 3.12 Pi cost a from-source Python build and a venv and *still* didn't import cleanly. Check the supported-Python matrix before buying the accelerator, not after.
- **Write the unfinished ones down anyway.** A bring-up log that stops at a wall is more useful to the next person, and more honest, than a tidy success story that omits the six things that didn't work.
