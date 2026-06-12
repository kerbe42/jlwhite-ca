---
title: HA pfSense on Proxmox, with dual-WAN failover
date: 2026-06-11
summary: Why I run pfSense as a virtualized active/passive CARP pair split across two Proxmox nodes, fronting a dual-WAN (fibre + Starlink) edge, and the firewall-virtualization gotchas that bite.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['pfsense', 'proxmox', 'high-availability', 'networking', 'homelab']
draft: false
---

The firewall is the one box in the lab that everything depends on and that nothing routes around. If it goes, the LAN goes, the WAN goes, DNS goes, and every self-hosted service behind it is unreachable no matter how healthy those services are. It's also the network I'd use to fix any of that. So it gets the redundancy budget first. This is how I run pfSense as an active/passive HA pair, virtualized across two nodes of the Proxmox cluster, in front of a dual-WAN (fibre + Starlink) connection.

## Why HA at the edge at all

A home lab has no SLA, but I treat the edge like it does, because the failure modes are the annoying kind: a hypervisor reboots for a kernel update, a host throws a hardware fault, or I fat-finger something during maintenance and lose the LAN while I'm three SSH hops deep. With a single firewall VM on a single host, every one of those is a full outage, and it takes out the very network I'd use to recover.

HA here decouples firewall availability from any one host's availability, so node maintenance becomes a non-event instead of a scheduled outage. Same instinct as redundant DNS and dual WAN, applied to the layer underneath all of it.

## What active/passive + CARP buys you

The model is two pfSense instances configured as a cluster: one active, one passive. They share a virtual IP via CARP (Common Address Redundancy Protocol), and that VIP (not either node's real interface address) is what the LAN uses as its gateway and what the WAN side presents. Clients never talk to "firewall A" or "firewall B"; they talk to the VIP, and whichever instance currently owns it answers.

CARP runs an election. The active node advertises ownership of the shared address and the passive node listens. If those advertisements stop, whether the active instance is down, isolated, or put into persistent CARP maintenance mode, the passive node wins the election and takes over the VIP. Failover is measured in seconds, and because the gateway IP never changes, clients don't relearn anything: ARP gets corrected, the VIP moves, traffic continues.

A few things make this work in practice:

- **A dedicated sync path.** The two instances want a separate interface to run CARP advertisements and synchronize state, and it shouldn't depend on the same uplink you're trying to protect.
- **VIPs on every segment that fails over together.** LAN, each VLAN, and the WAN-facing side where the topology allows it. The instances move as a unit.
- **State synchronization (pfsync).** This is what separates HA from a cold spare. With state sync the passive node already knows about in-flight connections, so existing sessions survive the cutover instead of every TCP connection resetting.

## Keeping the firewall off any single host

The whole exercise is pointless if both instances live on the same hypervisor: one host fault takes out the "redundant" pair together. So the two instances are pinned to separate Proxmox nodes. The cluster being clustered and quorate is what makes that manageable: do the maintenance on one node, watch the VIP fail over to the instance on the other, fail back, all without the LAN noticing.

Worth being honest about a constraint: I run local storage per node, not a shared SAN. That's fine for this design and arguably better: each instance has its own local disk, the two are independent, and HA is handled by pfSense's own clustering rather than hypervisor-level live migration. I rely on two independent firewalls and CARP rather than migrating a single firewall VM between hosts. Keeping the passive node's config current is a job for config sync, not shared storage.

The matching rule is anti-affinity: these two VMs never land on the same node. On a small cluster that's easy to enforce by hand, but it's the kind of invariant worth encoding so a future migration or HA-restart doesn't quietly violate it.

## The real gotchas of virtualizing a firewall

Virtualizing pfSense is well-trodden; the edge cases all sit at the boundary between the hypervisor's networking and the firewall's.

**Mapping physical interfaces into the VMs.** The firewall needs real, separate paths for WAN and LAN. Either bridge a physical NIC up through a Linux bridge and hand the VM a virtual NIC, or pass a NIC straight through (PCI passthrough / SR-IOV). Bridging is more flexible and migration-friendly; passthrough gets the hypervisor out of the data path but ties the VM to that host's specific NIC, which undercuts the "instances are interchangeable" story. For an HA pair, bridges are the friendlier default unless you have a throughput reason otherwise. Either way, the choice has to be made symmetrically on both nodes.

**VLANs: decide where tagging happens.** Either trunk a tagged uplink into the VM and let pfSense terminate the VLANs, or terminate them on a VLAN-aware Proxmox bridge and hand pfSense access ports. Pick one and apply it identically on both nodes. The classic self-inflicted outage is tagging one way on node A and the other on node B: it works until failover, then the segment that was tagged on one side shows up untagged on the other and disappears.

**The dual-WAN dimension.** With fibre + Starlink, both WANs have to reach both instances, or failover just relocates the single point of failure. That usually means separate NICs/ports per WAN, mirrored across the two hosts. That leaves two independent failovers in play: pfSense gateway failover between WANs, and CARP failover between instances. They're orthogonal, and you want to test them separately before testing them together.

**MAC and promiscuous behavior.** CARP relies on a shared virtual MAC for the VIP, and the bridge has to forward that rather than filter it as a spoof. If failover "works" but clients can't reach the VIP afterward, this is the usual suspect.

**Config sync vs. state sync.** Two separate things, both wanted. Config sync (XMLRPC) pushes rules, NAT, aliases, and certs from primary to secondary so you maintain one ruleset instead of two that drift. State sync (pfsync) keeps live connection state mirrored so failover is seamless.

**The failover test worth running.** Not "reboot the active node and see if the internet comes back," because reboots are graceful and forgiving. Run the ungraceful tests while something is watching: a continuous ping to an external host plus a long-lived download or SSH session across the cutover.

1. Put the active instance into CARP maintenance mode; confirm the passive takes the VIP and long-lived sessions survive (that's your state-sync proof).
2. Hard-stop the active VM (not a clean shutdown) and confirm the same. This is the failure you're insuring against, and it exercises the election timeout rather than a polite handoff.
3. Pull the active WAN and confirm gateway failover to the second WAN independently of CARP.
4. Fail back, and confirm it's clean in both directions. Failover that doesn't fail back cleanly only gets you halfway.

If a test only ever passes on a graceful reboot, all you've confirmed is that reboots work.

## Takeaways

- HA at the edge is about decoupling the firewall from any single host: node maintenance should be a non-event.
- CARP gives you a stable virtual gateway IP; pfsync state sync is what makes failover seamless rather than a connection-resetting cold spare.
- Pin the two instances to separate nodes and treat anti-affinity as a hard invariant; with local-only storage, rely on pfSense's clustering, not hypervisor migration.
- Make the hypervisor networking choices (bridge vs. passthrough, where VLAN tagging happens, how each WAN reaches each node) symmetrically on both hosts, or failover reveals the asymmetry at the worst time.
- Run config sync (one ruleset) and state sync (one session table); skip either and you throw away most of the benefit.
- Test the ungraceful failures with a ping and a live session running, and confirm clean failback. A reboot test proves almost nothing.
