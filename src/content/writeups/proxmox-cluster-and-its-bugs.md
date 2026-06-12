---
title: 'Four Lenovo Tinys, one Proxmox cluster, and the bug that logged me out every five minutes'
date: 2026-06-12
summary: PMX-CLUSTER1 is a four-node Proxmox cluster on Lenovo M900 Tinys with deliberately local-only storage. Standing it up was easy; the bugs taught me more. A maddening five-minute logout loop, version drift, a Trixie repo gauntlet, and stale NVMe references. The debugging is the interesting part.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['proxmox', 'homelab', 'clustering', 'debugging', 'linux']
draft: false
---

The compute core of the [home lab](/lab/home-lab-overview) is **PMX-CLUSTER1**: four Proxmox nodes, `PMX-HOST1` through `PMX-HOST4`, on `192.168.3.20` to `.23`, clustered over knet and quorate. The hardware is deliberately boring: four **Lenovo M900 Tiny** boxes, the kind that turn up cheap and sip power. That's the right call for a cluster whose job is to *run* infrastructure, not to be infrastructure.

Clustering four nodes is a fifteen-minute job. What took the time, and taught me the most, was everything that broke afterward.

## The shape of it, and the one deliberate choice

Four nodes, one bridge each (`vmbr0` on `eno1`), with VLAN subinterfaces hanging off it. `vmbr0.30` carries the main LAN on `192.168.3.0/24`, and there's a second tagged interface for a separate segment. Nothing exotic.

The one design decision worth defending is **local-only storage**: each node keeps its VM disks on its own disks, with nothing shared between nodes. That's the opposite of the textbook "stand up Ceph and live-migrate everything" answer, and it's intentional. Shared storage buys you frictionless live migration and pays for it with a shared failure domain, an operational tax, and a hardware bill. For a lab whose whole point is to break things safely, I'd rather keep the failure domains tiny and explicit: a node is self-contained, anything that has to survive a host going down is handled deliberately, and there's no clustered storage layer waiting to take the whole thing out at once. The trade is real. Migrations move the disk, not just the running state, so they're slower and not free. It's the trade I want.

## The bug that defined the build: a five-minute logout loop

The symptom was infuriating in its regularity. I'd log into the Proxmox web UI, work for a few minutes, and get bounced to the login screen. Every node. Roughly every five minutes. It started right after `PMX-HOST1` rejoined the cluster, and then spread to the others.

The obvious suspects are all about the *session*, so that's where I went first, and all of them were dead ends:

- **A reverse proxy or VPN mangling the cookie?** No. Same behaviour hitting a node's IP directly at `https://192.168.3.20:8006`, nothing in the path.
- **Clock skew?** This is the classic one. Proxmox tickets are time-stamped, and a node with the wrong time will reject everyone's session. But NTP was healthy and the clocks agreed across all four nodes.

When the session itself looks fine and the clock is right, the next thing to suspect is the cluster's own **trust material**. Proxmox signs the authentication ticket it hands your browser with a cluster-wide key, `/etc/pve/authkey.pub`, with `authkey.pub.old` kept around for rotation. When a node joins or rejoins, those keys get shuffled, and if their **timestamps** end up out of order or in the future, `pveproxy` decides the tickets it's issuing are already stale and throws you out the moment the previous one ages past a few minutes. The session was being invalidated because the cluster no longer trusted its own freshly-issued keys.

The fix is almost insultingly small once you know where to look. Normalise the key timestamps and restart the proxy and daemon:

```bash
root@pmx-host1:~$ touch /etc/pve/authkey*
root@pmx-host1:~$ systemctl restart pveproxy pvedaemon
```

The logout loop stopped immediately. When the session, the proxy, and the clock are all clean, suspect the cluster's internal trust artifacts. A distributed system has more "is this fresh and trusted?" checks than a single box, and a join event is the kind of thing that scrambles them.

## Version drift and the certificate dance

Running `pveversion` across the nodes turned up the thing that always happens to a cluster you upgrade a few nodes at a time: drift. `PMX-HOST1` was on `pve-manager/8.4.5` with kernel `6.8.12-9-pve`; `PMX-HOST2` was back on `8.4.1` with `6.8.12-11-pve`. A cluster will tolerate a surprising amount of that, but it's not a state to leave things in. Mismatched nodes give you subtle GUI and API weirdness that's miserable to diagnose later.

The cleanup is align, reboot, and then re-bless the cluster's certificates, because the version shuffle can leave the per-node certs inconsistent:

```bash
root@pmx-host2:~$ apt update && apt -y full-upgrade
root@pmx-host2:~$ reboot
# once it's back:
root@pmx-host2:~$ pvecm updatecerts --force
root@pmx-host2:~$ systemctl restart pveproxy pvedaemon
```

`proxmox-boot-tool kernel list` / `pin` / `refresh` is the companion toolkit here when you want a node to *stay* on a known-good kernel rather than rolling forward on the next reboot.

## The Trixie repository gauntlet

Moving a node toward the Debian Trixie / PVE 9 era turned `apt update` into a small obstacle course. First the new signing key wasn't there:

```text
Missing key 24B30F06ECC1836A4E5EFECBA7BCD1420BFE778E
```

That's just the release key for the new suite not being installed yet:

```bash
root@pmx:~$ wget https://enterprise.proxmox.com/debian/proxmox-release-trixie.gpg \
    -O /etc/apt/keyrings/proxmox-release-trixie.gpg
```

…with the matching `deb [signed-by=/etc/apt/keyrings/proxmox-release-trixie.gpg] http://download.proxmox.com/debian/pve trixie pve-no-subscription` source. Then `apt` got *angry in a different way*:

```text
E: Conflicting values set for option Signed-By
```

That one is self-inflicted: a leftover enterprise source and the new no-subscription source were both trying to define the signing key for the same repo, with different values. The fix is to stop having two opinions. Delete the duplicate `pve-enterprise.*` / `pve-no-subscription.*` entries and express it once, cleanly, as a single deb822 source with one `Signed-By`. Tedious, but a good reminder that Debian's move to deb822 sources makes "the same repo defined twice" a hard error instead of a silent override.

## Stale NVMe references

A drive that had been pulled left its ghost behind in `/etc/pve/storage.cfg`: storage entries (`nvme1`, `nvme2`) pointing at hardware that wasn't there anymore, which makes the GUI and the API unhappy every time they enumerate storage. Nothing dramatic to fix: drop the dead blocks from `storage.cfg`, then confirm nothing still references them:

```bash
root@pmx:~$ qm list   # any VM disks pointing at the dead storage?
root@pmx:~$ pct list   # any containers?
```

The only trap is deleting a storage entry that a stopped VM still has a disk on; the `qm list` / `pct list` pass is there to make sure the ghost is actually a ghost.

## Takeaways

- **Standing up the cluster is the easy 15 minutes; operating it is the rest.** Budget your attention for the after, not the install.
- **A join/rejoin event scrambles a cluster's internal state in non-obvious ways.** The five-minute logout came from the cluster distrusting its own auth keys after a node came back, which looked nothing like the session or clock bug I went hunting for first. When the usual suspects are clean, suspect the trust material.
- **Don't run a cluster with version drift any longer than you have to.** Align the nodes, reboot, `pvecm updatecerts --force`, and pin kernels you trust. Mismatched nodes fail in ways that are hard to attribute.
- **deb822 turns "defined twice" into a hard stop.** The `Conflicting values set for option Signed-By` error is Debian doing you a favour; express each repo once.
- **Local-only storage is a legitimate choice, not a compromise.** You trade frictionless live migration for tiny, explicit failure domains and a much simpler stack. For a lab built to break things, that's the right side of the trade.
