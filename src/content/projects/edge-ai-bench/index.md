---
title: Edge-AI and RF bench
world: lab
date: 2025-09-01
summary: A Raspberry Pi 5 with a Hailo-8 accelerator, software-defined radio, and a pile of sensors — a bench for learning edge inference and RF.
featured: false
cover: ./cover.png
coverAlt: Diagram of a Raspberry Pi 5 plus Hailo-8 board surrounded by SDR, microcontroller, GPS, audio, and sensor components
tags: ['edge-ai', 'raspberry-pi', 'sdr', 'electronics', 'mqtt']
draft: false
---

> A working bench, not a finished product — components and experiments, mid-progress.

A corner of the lab is given over to small hardware: somewhere to learn edge inference, software-defined radio, and sensor plumbing without a rack in sight.

## The core

A **Raspberry Pi 5** paired with a **Hailo-8 AI accelerator** (26 TOPS) on NVMe — enough to run real inference at the edge instead of shipping every frame back to a server.

## Around it

- **Software-defined radio** — a PlutoSDR and a LibreSDR, for poking at the RF spectrum and learning how radios actually work.
- **Microcontrollers** — ESP32 and Raspberry Pi Pico W nodes that publish over MQTT.
- **Sensing** — GPS, I²S audio, and the same pH / EC / water-level probes that feed the [hydroponics](/garden) side of the house.

## Why

It's the maker version of the security habit: take something you don't understand — a radio, a tensor accelerator, a noisy analog sensor — and keep poking until you do. Most of it talks MQTT back to the [home lab](/lab/home-lab-overview), which is where the data eventually lands.
