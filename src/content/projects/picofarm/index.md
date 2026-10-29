---
title: 'PicoFarm: a stand-alone controller that measures, doses and protects a hydroponic reservoir'
world: work
date: 2026-10-29
summary: "My hydroponics monitoring and control system. A controller with a 3.5\" touch screen, a knob and an AUTO/OFF/HAND switch per pump measures pH, EC, water temperature and level and runs seven pumps behind a hardware E-stop and a master relay, all on low-voltage DC. A home server keeps the history, sends push alerts and shows a process control screen; an Android app watches and controls it from the phone. Revision B is designed and reviewed; the bench build is next."
featured: false
cover: ./cover.png
coverAlt: "PicoFarm in four steps: the reservoir is measured (pH, EC, temperature, level and leak), an ESP32 acts (seven pumps, interlocks, automatic dosing), a home server records (MQTT broker, history, alerts, dashboard) and an Android app shows it at home or over a VPN; the safety logic runs on the controller and keeps working if the server is down"
tags: ['hydroponics', 'esp32', 'electronics', 'mqtt', 'fastapi', 'android', 'python', 'self-hosted']
draft: false
---

## What it is

PicoFarm is my hydroponics monitoring and control system. Each reservoir gets a controller that measures pH, EC (how strong the nutrient solution is), water temperature and level, and runs seven pumps: pH Up, pH Down, Nutrient A and Nutrient B for dosing, plus refill, circulation and drain. The controller is a stand-alone instrument: a 3.5" touch screen on the front panel shows the same values as the dashboard, a knob edits setpoints, a three-position switch under each pump sets it to AUTO, OFF or HAND, and a red E-stop button cuts the pumps' power by itself. A home server keeps the history, relays commands and sends push alerts, and an Android app shows everything and controls it from the phone. Whatever is changed in one place shows up in the others.

It grew out of [PicoPH](/builds/picoph), the Raspberry Pi Pico monitor that has been watching the [garden](/garden/hydroponic-garden). PicoPH told me the pH and EC, but every correction was still done by hand: measure, add a little, wait, measure again. PicoFarm does that loop itself, for the reservoirs that feed the [printed towers](/builds/hydro-tower). A system that pumps acid, nutrients and water in a room of the house needs to be careful above all, so most of the design is about what it must never do.

This page describes revision B of the controller. The firmware, the server with its process screen and the Android app are built and running against a simulated controller; the revision B circuit has been designed and reviewed, down to a hole-by-hole drawing of the first hand-wired unit, and the parts are ordered. The bench build is next. You can [try the process screen](https://picofarm.jlwhite.ca) in your browser against a simulated reservoir, and the [build instructions](/work/picofarm/build) are on their own page.

## How it fits together

![The PicoFarm architecture: ESP32 controllers, one per reservoir, connect over the home Wi-Fi to an MQTT broker on a home server, which also runs a FastAPI service, SQLite history, alert thresholds, a REST API, push alerts and a process control screen; the Android app connects at home or away over a VPN, alerts reach the phone, and the process screen opens in a browser. Interlocks, run limits, automatic dosing and the watchdog run on each controller.](./architecture.svg)

The controllers join the home Wi-Fi and talk MQTT to a broker on the home server. Each one publishes its readings every few seconds, plus events: a pump started or stopped, a command refused, an alarm raised or cleared, a setting changed on the front panel. Commands and settings flow the other way. Each controller only has access to its own topics, and if one drops off the network the broker tells the server, which raises an offline alert.

The most important choice is where the decisions live. **Every safety rule and all the automation run on the controller.** The server records, relays and alerts, but it never decides anything that matters for safety: if it goes down, or the Wi-Fi does, each controller keeps measuring, keeps dosing within its limits, enforces every interlock and can still be run from its own panel. A command from the app, the dashboard or the panel is a request. The controller checks it against its own rules and either runs it or answers with the reason it refused, such as "blocked: low water".

Settings are versioned. A controller applies a new configuration only if it is newer than the one it has, stores it, and runs on it from then on. Controllers also don't hold on to commands while they're offline: a "run the drain pump" sent while a controller was unreachable is dropped, not carried out hours later.

## The controller

![Eight screens of the front panel, rendered from the firmware’s own screen code: the Overview with the tank level, pH, EC and temperature, the K1 relay and E-stop state and the seven pumps with their AUTO, OFF or HAND state; the Pumps page; the Setpoints page; the pH target dialog edited with the knob; the pH trend over 24 hours; the Calibration page with its pH 7, pH 4, pH 10 and EC 1413 buttons; the Alarms page with ACK, CLEAR and RESTART; and the Overview after a panel E-stop, with the relay open and automation held](./panel-screens.png)

*The front-panel screens, rendered on a PC from the firmware's own screen code before the hardware exists.*

The controller is a box with a front panel and two circuit boards, running on 5 V DC from two ordinary USB chargers. Nothing in it runs on mains voltage.

**On the front panel:**

- A **3.5" IPS touch screen** (480 × 320, ST7796 over SPI, FT6336 touch over I²C) with seven pages: Overview, Trends, Pumps, Setpoints, Alarms, Calibration and Network. The software E-STOP sits at the top right of every page. The screen dims after 2 minutes without input; a touch or the knob wakes it, and that first input does nothing else, except a touch on E-STOP, which stops everything at the first touch.
- A **rotary knob** (EC11): turn to move between buttons or to change a value in a dialog, push to press, hold to cancel or go back to the Overview. Every button also works by touch.
- **Seven AUTO / OFF / HAND toggles**, one per pump, in the firmware's pump order: pH UP, pH DN, NUTR A, NUTR B, REFILL, CIRC, DRAIN.
- A **22 mm latching E-stop** with a normally closed contact, wired into the pumps' power, and a **buzzer** for critical alarms.

**Inside:**

- An **ESP32-S3** dev board (DevKitC-1 layout, with PSRAM for the display buffers). The design needs 27 GPIOs, which the classic ESP32 can't offer; the S3 also has a pull-up on every pin and no input-only pins.
- **Two ADS1115 16-bit converters**: one reads the pH, EC and analog level inputs; the other watches the power: the supply, the E-stop node, the pump rail and the logic 5 V. That is how the controller knows a fuse has tripped (`pump_power`) or the relay is stuck closed (`relay_fault`).
- An **MCP23017** port expander reads the 14 toggle contacts, drives the buzzer and resets the display.
- A **ULN2803A** driver sinks the six dosing, refill and drain pumps, plus the opto input of an isolated MOSFET module that runs the circulation pump.
- A **master relay K1** in the pump rail, driven by an S8050 transistor from one GPIO.
- A **main board** (130 × 110 mm) on the floor of the box with pluggable terminals on three edges (sensors on the left, pumps along the bottom, the supplies, E-stop and circulation module on the right), and a **panel board** (120 × 70 mm) behind the lid with the port expander, the knob's filters, the buzzer and the display header. A 26-way ribbon joins them.

![A render of the revision B main board from its design files: the ESP32-S3 dev board on sockets in the top left, the two ADS1115 modules in the middle, the ULN2803A, the relay K1 and the two 1000 µF capacitors on the right, the seven pump plugs along the bottom and the sensor plugs down the left edge](./main-board-render.png)

*A render of the printed main board from its design files. The first unit is hand-wired on protoboard; the printed boards follow once it passes its bench tests.*

The firmware is plain C++ with a control core that has no hardware calls, so the same code runs on the controller and on a PC, where more than 80 host tests exercise the interlocks, the E-stop, the hand-off-auto states, the dosing order, dilution, the limits, the calibration maths and alarms that survive a reboot. The front panel's screens are rendered on a PC from the same code and fonts, which is where the pictures above come from.

## The safety chain

![The revision B power and safety chain: the pump supply goes from PUMP IN through fuse F1 (2.5 A) to the PFUSE node, through the E-stop’s normally closed contact to the ESN node, through relay K1’s normally open contact to RAIL, through each toggle’s pole 1 to the pump and back through a ULN2803A output; D1 and C1 sit at PFUSE before the E-stop; K1’s coil runs from ESN through an S8050 driven by GPIO3; ESN is sensed by GPIO17 and the second ADS1115. The logic supply goes from LOGIC IN through fuse F2 (1.6 A), the D2 clamp and C2 to logic 5 V, then a Schottky diode into the ESP32-S3’s 5 V pin. Pump ground and logic ground meet at one star wire.](./safety-chain.svg)

The pumps' power runs through a chain of things that can each cut it on their own: a 2.5 A fuse, the E-stop button's normally closed contact, the master relay's contact, and each pump's own toggle. The E-stop is wired like an industrial safety circuit, not like a button the software reads:

| What happens | What cuts the pumps | What the controller does |
| --- | --- | --- |
| E-STOP pressed | the NC contact: the rail dies at once, whatever the firmware is doing; K1's coil, fed from the same node, also drops | sees the node go low, latches `estop` (source `hardware`) |
| E-STOP released | nothing restarts: K1 stays off until the firmware closes it | holds `estop` until RESTART from the panel, app or dashboard |
| software E-STOP (panel, app, dashboard) | the firmware drops K1 (a hardware cut) and every pump output | latches `estop` (source `panel`, `app` or `server`) |
| leak | the firmware drops K1 and every output | latches `leak` |
| firmware hang or crash | the 5 s watchdog resets the chip; the outputs and K1 drop, because the driver inputs and the relay transistor's base are pulled down | restarts with K1 off and automation held |
| power-up | K1 is off: its coil can't energize until the firmware drives its pin | turns K1 on only after the sensors start, with no latched `estop` or `leak` |
| fuse F1 trips or the pump cable is out | | the power monitor sees the supply low: alarm `pump_power` (no dosing counted) |
| K1 stuck closed | | rail present while K1 is commanded off: alarm `relay_fault`, critical |
| a supply wired backwards | a 3 A diode clamps the reversed voltage; the charger shuts down or the fuse trips | |

A few details carry most of the weight. The relay's coil is driven by its own transistor rather than a spare driver channel, so it gets the voltage it needs even from a weak charger. The driver chip's common pin returns each motor's switch-off energy to the node that feeds the pumps, through the E-stop, so a dead rail stays dead. On a software E-stop the firmware turns the pumps off first and drops the relay after them, so the relay never breaks a running motor's current. A diode across every pump protects the toggle and float contacts when they break a running motor. The big capacitor sits before the E-stop, so releasing the button doesn't slam an empty capacitor onto the charger. And the two supplies are two separate certified chargers, so a pump fault can't restart the controller and no ground loop runs through a charger.

## AUTO, OFF and HAND

Each pump has a two-pole, three-position toggle. One pole carries the pump's power: **OFF physically cuts that pump**, whatever the firmware does. The other pole tells the controller where the lever is.

| Position | What the controller does |
| --- | --- |
| AUTO | normal: automation, and manual runs from the panel, app and dashboard |
| OFF | the pump is disabled and shows OFF everywhere; runs are refused with the reason `switch_off`; a mode that needs it raises a `pump_off` notice |
| HAND | runs now, through the controller. Every interlock still applies (E-stop, leak, low water, high and emergency level for refill, pH Up and pH Down never together). It stops after the pump's maximum run time and raises `hand_timeout` until the switch leaves HAND; it counts toward the daily cap and holds automation for a mix period. Circulation in HAND runs with no timeout. |
| both contacts closed | a wiring fault: treated as OFF, alarm `switch_fault` |

The controller also keeps a budget: at most two of the driver chip's pumps run at once, which keeps the chip and the ribbon's rail conductors inside their ratings. A start that would be the third is refused with the reason `pump_budget`, and a HAND request waits for a free channel.

## Sensors and inputs

- **Analog sensors go through an ADS1115.** The ESP32's own converter is noisy, and the external one is accurate to 16 bits.
- **pH:** a pH-4502C board with a BNC probe. Its output swings up to 5 V, so a 10 k/20 k divider brings it under the converter's limit. No pH or EC sample is taken while a dosing, refill or drain pump runs, or for 2 seconds after, because a brushed motor in the water offsets the high-impedance probe; circulation is allowed, so the probes are calibrated with it running.
- **EC:** an analog conductivity board and probe. An EC probe drives current through the water, which skews a pH probe in the same reservoir, so the board is powered from a GPIO and only switched on while EC is being read.
- **Water temperature:** a waterproof DS18B20. EC readings need it for compensation, and the pH calculation uses it to correct the probe's slope; automatic EC dosing refuses to run without it.
- **Level:** an analog level sensor, or an ultrasonic JSN-SR04T looking down at the water from above, through a divider that keeps its 5 V echo under the GPIO's limit.
- **Level switches** for low, high and emergency water, and a **leak sensor** (two stainless pads) at the lowest point of the tray under the tank. The leak input is set to read wet at under about 70 kΩ, so plain tap water counts as well as nutrient solution.
- **A float switch** above the high level, wired in series with the refill pump's power. If the water ever lifts it, the refill pump stops, whatever the firmware is doing.

Every input has its protection: a small series diode and a capacitor on each level switch so the pin never sees the sensor's 5 V, a divider on the echo line, 100 Ω in the 3.3 V feed to the temperature probe and the leak cable so a wet or crushed cable can't short the logic supply, and the pump pins chosen so a reset can't twitch a pump.
