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

The lab is where I get to run real infrastructure and break it safely. These days the core isn't a rack of switches. It's a small Proxmox cluster doing the job a couple of rack-units of dedicated appliances used to.

## The cluster

Four **Lenovo M900 Tiny** nodes (`PMX-CLUSTER1`), clustered over knet and quorate. Each node keeps its workloads on local storage rather than a shared SAN, which keeps the failure domains simple. A node is self-contained, and anything that has to survive a host going down is handled explicitly rather than assumed. Standing the cluster up was the easy part. [The bugs that came after](/writeups/proxmox-cluster-and-its-bugs), a five-minute logout loop, version drift, and a Trixie repo gauntlet, were the education.

## The edge

Two WAN links, fibre and Starlink, so the connection fails over instead of just failing. They terminate on a **pfSense firewall running as an active/passive HA pair** across two of the nodes ([how and why](/writeups/pfsense-ha-proxmox)), so a host can go down without taking the internet edge with it. The segmentation is VLAN-based: the two WANs each presented to pfSense on their own tag, the LAN on another, and a dedicated **SYNC** VLAN carrying the firewall pair's CARP and pfsync heartbeat. DNS is a **redundant Pi-hole pair** (the subject of the [DNS/DNSSEC writeup](/writeups/pihole-dnssec-tcp-fallback)), wireless is a UniFi controller with a couple of access points, and a Cisco switch still does the physical L2.

## What runs on it

- **Media and self-hosting**: Plex, Audiobookshelf, and Transmission, in a mix of Docker and LXC, with the bulk media on a NAS.
- **Monitoring and detection**: Wazuh, Zabbix, and Graylog give the lab its own telemetry and somewhere to practise home-scale detection engineering, the defensive mirror of the [writeups](/writeups). (Wazuh has its own [war story](/writeups/wazuh-home-soc-dashboard-and-agent-flood).)
- **Automation**: an Ansible host for configuration, and an [n8n](https://n8n.io) workflow that hands each node to an [LLM "ops agent"](/writeups/proxmox-llm-ops-agent). Four SSH-backed tools, one per host, gated so it can look freely but has to ask before it touches anything. Asking a language model *"is the cluster healthy?"* and having it actually go and look is a good way to learn where automation helps and where it bites.

## Old lab, new lab

The [Cisco rack](/lab/network-lab) is still where I learned routing and switching on real iron. The Proxmox cluster is the same curiosity one layer up: bridges and VLANs instead of trunk ports, VM and container lifecycle instead of patch cables, HA and quorum instead of a single box. Reading about a system teaches you the happy path. Running it teaches you how it breaks.
