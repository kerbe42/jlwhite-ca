---
title: The home lab
world: lab
date: 2026-06-10
summary: A four-node Proxmox cluster running an HA firewall, redundant DNS, and the self-hosted services I actually use.
featured: true
cover: ./cover.png
coverAlt: Architecture diagram of a four-node Proxmox cluster with an active/passive pfSense pair, dual WAN, a VLAN-segmented LAN, and self-hosted services
tags: ['homelab', 'proxmox', 'pfsense', 'networking', 'docker', 'automation']
draft: false
---

> Kept intentionally high-level — architecture and tooling, not internal hostnames, addresses, or versions.

The lab is where I get to run real infrastructure and break it safely. These days the core isn't a rack of switches — it's a small Proxmox cluster doing the job a couple of rack-units of dedicated appliances used to.

## The cluster

Four Proxmox nodes, clustered and quorate. Each node keeps its workloads on local storage rather than a shared SAN, which keeps the failure domains simple: a node is self-contained, and anything that has to survive a host going down is handled explicitly rather than assumed.

## The edge

Two WAN links — fibre and Starlink — so the connection fails over instead of just failing. They terminate on a **pfSense firewall running as an active/passive HA pair** across two of the nodes, so a host can go down without taking the internet edge with it. Behind it sits a VLAN-segmented LAN. DNS is a **redundant Pi-hole pair** (the subject of the [DNS/DNSSEC writeup](/writeups/pihole-dnssec-tcp-fallback)), and wireless is a UniFi controller with a couple of access points.

## What runs on it

- **Media and self-hosting** — Plex and Audiobookshelf, plus the supporting services around them, in a mix of Docker and LXC.
- **Monitoring and detection** — Wazuh, Zabbix, and Graylog give the lab its own telemetry and somewhere to practise home-scale detection engineering: the defensive mirror of the [writeups](/writeups).
- **Automation** — an Ansible host for configuration, and an [n8n](https://n8n.io) workflow that hands each node to an LLM "ops agent" with tools to inspect cluster health, storage, and networking. Asking a language model *"is the cluster healthy?"* and having it actually go and look is a good way to learn where automation helps and where it bites.

## Old lab, new lab

The [Cisco rack](/lab/network-lab) is still where I learned routing and switching on real iron. The Proxmox cluster is the same curiosity one layer up — bridges and VLANs instead of trunk ports, VM and container lifecycle instead of patch cables, HA and quorum instead of a single box. Reading about a system teaches you the happy path; running it teaches you how it breaks, which is the part worth knowing.
