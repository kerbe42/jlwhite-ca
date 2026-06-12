---
title: 'Plumbing two WANs and a segmented LAN into a virtual firewall'
date: 2026-06-12
summary: 'pfSense runs as a VM, so it has no physical ports to plug a fibre modem, a Starlink dish, and a LAN into. The answer is VLANs — four tags on one trunk that hand a virtualized HA firewall pair its two WANs, the LAN, and a private sync link. The network design behind the edge.'
room: Home lab
platform: Home lab
difficulty: Info
tags: ['networking', 'vlan', 'pfsense', 'proxmox', 'homelab']
draft: false
---

A physical firewall has ports: WAN here, LAN there, a sync cable to its partner. Mine doesn't — it's a pair of pfSense VMs running on two nodes of the [Proxmox cluster](/writeups/proxmox-cluster-and-its-bugs), and a VM has virtual NICs on a bridge, not RJ45 jacks. So the question that quietly decides the whole edge is: **how do you deliver two real internet uplinks, a segmented LAN, and a private HA heartbeat to a machine that has no physical ports?**

VLANs. The entire design rides on four tags.

## The VLAN map

| VLAN | Name | What it carries |
| --- | --- | --- |
| 10 | `WAN_FIBE` | the fibre uplink, presented to both firewalls |
| 20 | `WAN_STARLINK` | the Starlink uplink |
| 30 | `LAN` | the main internal network |
| 40 | `SYNC` | the firewall pair's private CARP / pfsync heartbeat |

Each one is just a tag on the trunk between the switch and the Proxmox hosts. pfSense gets one virtual NIC per VLAN, so to the firewall it *looks* like four separate physical interfaces — WAN1, WAN2, LAN, SYNC — when physically it's a single uplink carrying four tagged segments. That mapping, "one trunk in, four interfaces out," is the trick the rest of this builds on.

## Two WANs that aren't ports

The interesting half is the WANs, because handing a *physical* internet connection to a *virtual* machine on a specific cluster node is not obvious.

The fibre handoff lands on a switch **access port in VLAN 10**; the Starlink handoff on an **access port in VLAN 20**. The switch trunks those tags up to the Proxmox uplinks. On each node, `vmbr0` (on `eno1`) carries the tags, and each pfSense VM's WAN1/WAN2 interfaces sit on VLAN 10 and 20. The upshot: two physical uplinks reach two firewall VMs on two different hosts, and **neither WAN ever touches the LAN broadcast domain** — they're isolated by tag from the moment they enter the switch until the firewall routes them.

Failover is a pfSense gateway group: **Fibe as Tier 1, Starlink as Tier 2**. pfSense monitors the fibre gateway and rolls everything to Starlink when it stops answering, then back when it returns. Two ISPs, one virtual edge, no manual intervention when the fibre hiccups.

## The SYNC VLAN: a private wire for the heartbeat

VLAN 40 exists for one reason: the two firewalls need to talk to *each other* — CARP advertisements to elect the active node, pfsync to share state-table entries so a failover doesn't drop every connection, and XMLRPC to keep their configs identical. That conversation gets its own isolated segment, and the reason is operational, not aesthetic: **you never want the HA heartbeat sharing a broadcast domain with user traffic.** A chatty LAN, a broadcast storm, an IoT device gone feral — none of that should be able to delay a CARP advertisement and flap your firewall failover. So the heartbeat rides VLAN 40 and ideally never leaves the two hosts. The CARP virtual IPs that clients actually use live on WAN1/WAN2/LAN; the machinery that keeps them highly available hides on SYNC. (The firewall internals — the CARP pair itself and the virtualization gotchas — are in [the pfSense HA writeup](/writeups/pfsense-ha-proxmox).)

## Switching and wireless

The physical layer-2 is a Cisco switch — the survivor of the [old rack](/lab/network-lab), still earning its keep. The Proxmox uplinks are trunk ports carrying the tags; the two WAN handoffs are access ports in VLAN 10 and 20; the UniFi access points hang off trunk ports too, so an SSID can drop a wireless client onto whichever VLAN it belongs on. The switchport config for an AP is the boring, correct pattern:

```text
switchport mode trunk
switchport trunk allowed vlan 10,20,30
switchport trunk native vlan 10
spanning-tree portfast trunk
```

DNS sits on the LAN as a redundant [Pi-hole pair](/writeups/pihole-dnssec-tcp-fallback), so name resolution survives losing one of them.

## Why segment a home network at all

Most home networks are one flat `/24` where the smart TV, the laptop, the lab VMs, and the raw WAN all share a single broadcast domain and can all talk to each other directly. Segmenting changes the default from "everything can reach everything" to "the firewall is the only path between zones." That's the entire security argument for a firewall — it can only enforce policy on traffic that's actually forced to traverse it, and a flat network forces nothing. With the WANs isolated by tag and the LAN on its own segment, a compromised device can't quietly ARP its way across the whole house, and the two internet uplinks are kept off the internal network by construction rather than by hope. It's the same defense-in-depth I'd argue for at work, run at a scale where I own every cable and every tag.

## Takeaways

- **A virtual firewall has no ports — VLAN tags are its ports.** One trunk in, a virtual NIC per tag, four "interfaces" out.
- **Deliver each physical WAN as its own tagged VLAN** so it reaches the firewall VMs without ever touching the LAN.
- **Give the HA heartbeat its own VLAN.** User traffic should never be able to delay a CARP advertisement and flap your failover.
- **Segmentation is what makes the firewall meaningful** — it can only police traffic that's forced through it, and a flat network forces nothing through anything.
