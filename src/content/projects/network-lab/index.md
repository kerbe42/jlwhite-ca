---
title: The network lab
world: lab
date: 2023-09-01
summary: A rack of Cisco routers and Catalyst switches where I learned routing and switching on real iron — most of it since passed on to others starting out.
featured: false
cover: ./cover.jpg
coverAlt: A tall rack of Cisco routers and Catalyst switches, fully cabled
tags: ['homelab', 'networking', 'cisco']
draft: false
---

Before the lab moved to virtualization, it was iron. This rack is where I learned networking the way it actually behaves.

## Routing and switching on real hardware

A multi-router, multi-switch Cisco topology — Catalyst switches and routers, fully cabled, with a console cable never far away. It's the kind of setup you can't really learn from a simulator: subnetting, routing protocols, VLANs and trunking, spanning-tree, PoE, all on hardware that fails the way real hardware fails.

It's also the bench that carried me through my CCNA and CCNP — labbing the exam topics on real gear instead of memorizing them, which is the only way they actually stuck.

## Where it went

Most of this gear has since moved on — I gave the bulk of the rack to people starting their own networking journey. Secondhand enterprise kit is how a lot of us learned, and it's worth more in someone else's hands than sitting dark in mine.

What it taught me stayed. Understanding how a frame actually moves across a switch — or how a routing table converges — makes the virtual networking in the [current lab](/lab/home-lab-overview) feel like the same ideas at a different layer: bridges instead of trunk ports, an HA firewall pair instead of a single edge router. This rack taught me what the abstractions are standing on, and now it's doing the same for someone else.
