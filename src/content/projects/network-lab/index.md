---
title: The network lab
world: lab
date: 2023-09-01
summary: A rack of Cisco routers and Catalyst switches — where I learned routing and switching on real hardware.
featured: false
cover: ./cover.jpg
coverAlt: A tall rack of Cisco routers and Catalyst switches, fully cabled
tags: ['homelab', 'networking', 'cisco']
draft: false
---

> Topology and tooling only — no addresses or configs.

Before the lab moved to virtualization, it was iron. This rack is where I learned networking the way it actually behaves.

## Routing and switching on real hardware

A multi-router, multi-switch Cisco topology — Catalyst switches and routers, fully cabled, with a console cable never far away. It's the kind of setup you can't really learn from a simulator: subnetting, routing protocols, VLANs and trunking, spanning-tree, PoE, all on hardware that fails the way real hardware fails.

## Why keep it around

It's the foundation everything else is built on. Understanding how a frame actually moves across a switch — or how a routing table converges — makes the virtual networking in the [current lab](/lab/home-lab-overview) feel like the same ideas at a different layer: bridges instead of trunk ports, an HA firewall pair instead of a single edge router.

The new lab is faster to change and easier to break safely. This one taught me what the abstractions are standing on.
