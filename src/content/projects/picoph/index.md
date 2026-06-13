---
title: 'PicoPH: a Raspberry Pi Pico pH/EC monitor'
world: builds
date: 2024-12-08
summary: A DIY water-quality monitor for the hydroponic garden. A Pi Pico reading pH and EC probes through signal-conditioning boards, in a 3D-printed enclosure I designed by hand-sketch.
featured: true
cover: ./cover.jpg
coverAlt: A 3D-printed enclosure holding a Raspberry Pi Pico and sensor boards, beside the hand-drawn design sketch
tags: ['electronics', 'raspberry-pi-pico', 'hydroponics', '3D printing']
draft: false
---

Hydroponics lives and dies on water chemistry: pH and EC (how strong the nutrient solution is). Buying a commercial monitor is easy; building one teaches you what the numbers mean. So I built **PicoPH**.

![A Raspberry Pi Pico and two sensor boards on a breadboard, wired to pH and EC probes](./breadboard.jpg)

A Raspberry Pi Pico reads two analog probes, pH and EC, each through its own signal-conditioning board (the blue trimmers set offset and gain during calibration), with the BNC-terminated probes dropping into the reservoir.

The enclosure started as a hand sketch (board spacing, standoffs, cable-gland cut-outs), got modelled in Tinkercad, and became a printed box sized to the exact hardware (that's the sketch-and-box up top).

![The PicoPH enclosure modelled in Tinkercad, with internal standoffs for the Pico and sensor boards](./enclosure.jpg)

Then it went to work, watching the towers:

![The finished PicoPH unit installed beside the 3D-printed hydroponic grow towers](./installed.jpg)

It's the project that ties the three hobbies together: a bit of electronics, a bit of 3D printing, in service of the [garden](/garden/hydroponic-garden).
