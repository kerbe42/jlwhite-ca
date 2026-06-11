---
title: Home lab overview
world: lab
date: 2026-06-01
summary: The network, the servers, and a rack of Cisco gear I use to learn networking on real hardware.
featured: true
cover: ./cover.jpg
coverAlt: A rack of Cisco routers and switches, fully cabled
tags: ['homelab', 'networking', 'cisco', 'docker']
draft: false
---

> Kept intentionally high-level — topology and tooling, not internal hostnames, addresses, or versions.

The lab is where I get to break real infrastructure safely.

## Networking on real iron

That rack up top is a stack of Cisco routers and Catalyst switches — the kind of multi-router, multi-switch topology you can't really learn from a simulator. Subnetting, routing protocols, VLANs, trunking, spanning-tree, the lot, on hardware that fails the way real hardware fails.

## What runs on it

Beyond the Cisco rack: a firewall and a DNS layer (the subject of the [DNS/DNSSEC writeup](/writeups/pihole-dnssec-tcp-fallback)), Docker hosts for the self-hosted services I actually use, and small electronics projects like [PicoPH](/builds/picoph). The lab doubles as the testbed for almost everything else on this site.

## Why

Reading about a system teaches you the happy path. Running it teaches you how it breaks — which is the part worth knowing.
