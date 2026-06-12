---
title: Edge-AI and RF bench
world: lab
date: 2025-09-01
summary: A Raspberry Pi 5 with a Hailo-8 accelerator, software-defined radio, and a pile of sensors. A bench for learning edge inference and RF.
featured: false
cover: ./cover.png
coverAlt: Diagram of a Raspberry Pi 5 plus Hailo-8 board surrounded by SDR, microcontroller, GPS, audio, and sensor components
tags: ['edge-ai', 'raspberry-pi', 'sdr', 'electronics', 'mqtt']
draft: false
---

A corner of the lab is given over to small hardware: somewhere to learn edge inference, software-defined radio, and sensor plumbing without a rack in sight.

## The core

A **Raspberry Pi 5** paired with a **Hailo-8 AI accelerator** (26 TOPS) on NVMe. It runs real inference at the edge instead of shipping every frame back to a server.

## Around it

- **Software-defined radio**: an ADALM-PLUTO and a Pluto-class LibreSDR (Zynq-7020 + AD9361), aimed at turning the Pi and the Hailo into an RF signal-analysis box. Getting the radio enumerating over IIO was the easy part; [the bring-up log](/writeups/libresdr-hailo-pi5-signal-lab) covers where the open-source SDR toolchain and the Hailo stack fought back.
- **Microcontrollers**: ESP32 and Raspberry Pi Pico W nodes that publish over MQTT.
- **Sensing**: GPS and I²S audio.

## Why

It's the maker version of the security habit: take something you don't understand (a radio, a tensor accelerator, a noisy analog sensor) and keep poking until you do. Most of it talks MQTT back to the [home lab](/lab/home-lab-overview), which is where the data eventually lands.
