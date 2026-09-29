---
title: The home lab
world: lab
date: 2026-06-10
summary: A four-node Proxmox cluster behind a FortiGate HA pair, with Fortinet switching and Wi-Fi, redundant DNS, and the self-hosted services I actually use.
featured: true
cover: ./cover.png
coverAlt: Topology diagram. Fibre and Starlink each feed both FortiGate 60F firewalls in an HA pair. Both firewalls uplink to a FortiSwitch 248E, which serves two FortiAP 231F access points and a four-node Proxmox cluster running DNS, media, monitoring, automation, and self-hosted apps
tags: ['homelab', 'proxmox', 'fortinet', 'networking', 'docker', 'automation']
draft: false
---

The lab is where I get to run real infrastructure and break it safely. The compute is a small Proxmox cluster: four mini PCs doing the job of a rack of dedicated boxes. The network around it is Fortinet: an HA pair of firewalls at the edge, a managed switch, and Wi-Fi access points.

## The cluster

Four **Lenovo M900 Tiny** nodes (`PMX-CLUSTER1`), clustered over knet and quorate. Each node runs its VMs on local storage rather than a shared SAN, which keeps the failure domains simple. A node is self-contained, and anything that has to survive a host going down is handled explicitly rather than assumed. Standing the cluster up was the easy part. [The bugs that came after](/writeups/proxmox-cluster-and-its-bugs), a five-minute logout loop, version drift, and a Trixie repo gauntlet, were the education.

## The edge

Two WAN links, fibre and Starlink, so the connection fails over instead of just failing. They terminate on a **pair of FortiGate 60F firewalls running as an HA cluster**, and each link is cabled into both units, so either firewall can carry both WANs on its own. One unit can fail, or be taken down for a firmware upgrade, without taking the internet edge or either uplink with it. Behind them, a **FortiSwitch 248E** does the physical L2 and carries the VLAN-segmented LAN, and **two FortiAP 231F** Wi-Fi 6 access points handle wireless. DNS is a **redundant Pi-hole pair** (the subject of the [DNS/DNSSEC writeup](/writeups/pihole-dnssec-tcp-fallback)).

The edge used to be virtual: an active/passive pfSense pair running as VMs on two of the cluster nodes, with the WANs, the LAN, and the pair's CARP/pfsync heartbeat each handed to the firewalls on their own VLAN tag ([how and why](/writeups/pfsense-ha-proxmox), and [the VLAN plumbing](/writeups/home-network-vlan-segmentation)). It worked, and it taught me a lot, but it tied the internet edge to the hypervisor. With the firewall, switching, and wireless on dedicated Fortinet hardware, cluster maintenance and the network's uptime no longer depend on each other.

## What runs on it

- **Media and self-hosting**: Plex, Audiobookshelf, and Transmission, in VMs and Docker, with the bulk media on a NAS.
- **Monitoring and detection**: Wazuh, Zabbix, and Graylog give the lab its own telemetry and somewhere to practise home-scale detection engineering, the defensive mirror of the [writeups](/writeups). (Wazuh has its own [war story](/writeups/wazuh-home-soc-dashboard-and-agent-flood).)
- **Automation**: an Ansible host for configuration, and an [n8n](https://n8n.io) workflow that hands each node to an [LLM "ops agent"](/writeups/proxmox-llm-ops-agent). Four SSH-backed tools, one per host, gated so it can look freely but has to ask before it touches anything. Asking a language model *"is the cluster healthy?"* and having it actually go and look is a good way to learn where automation helps and where it bites.

## Old lab, new lab

The [Cisco rack](/lab/network-lab) is still where I learned routing and switching on real iron. The Proxmox cluster is the same curiosity one layer up: bridges and VLANs instead of trunk ports, VM and container lifecycle instead of patch cables, HA and quorum instead of a single box. The Fortinet edge brings it back down to hardware, with an HA firewall pair where the old rack had a single router. Reading about a system teaches you the happy path. Running it teaches you how it breaks.
