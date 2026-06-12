---
title: 'Monitoring on a too-new Debian: the Zabbix-on-Trixie saga'
date: 2026-06-12
summary: "I wanted Zabbix watching the Proxmox nodes and the Cisco switch. The host was on Debian 13 (Trixie) before Zabbix shipped a Trixie repo, so apt had nothing, the build-from-source fallback went sideways, and PostgreSQL wasn't even installed where the guide assumed. A monitoring setup that fought back."
room: Home lab
platform: Home lab
difficulty: Info
tags: ['zabbix', 'monitoring', 'debian', 'postgresql', 'homelab']
draft: false
---

Running things on a too-new distro is a recurring home-lab tax: you get the shiny new base before the ecosystem on top of it has caught up, and routine installs turn into projects. This is the Zabbix-on-Trixie version of that story, with notes on where it stuck.

## The goal

Zabbix watching the [Proxmox cluster](/writeups/proxmox-cluster-and-its-bugs) (host metrics via the agent) and the Cisco switch (over SNMP). Ordinary home-lab observability, paired with the [Wazuh/Graylog](/writeups/wazuh-home-soc-dashboard-and-agent-flood) side that handles security telemetry.

## Problem one: there's no repo yet

The host was on **Debian 13 (Trixie)**. Zabbix publishes a repo per Debian release, and at the time there simply wasn't a Trixie one. apt knew nothing was installed:

```text
nope@zabbix:~$ systemctl status | grep zabbix
(nothing)
```

and grabbing the release package by its usual name just 404s, which then cascades into dpkg failing on a file that was never downloaded:

```text
2026-04-11 22:53:28 ERROR 404: Not Found.
dpkg: error: cannot access archive 'zabbix-release_latest_*.deb': No such file or directory
```

On a too-new distro there are two pragmatic moves: point at the *previous* release's repo (Bookworm) and trust the binaries to run, or build from source. I ended up doing both, one for the agent and one for the server.

## The agent: take the Bookworm repo

The Proxmox hosts only need the **agent**, and that's the easy path: `zabbix-agent2` from the Bookworm repo runs fine on Trixie. Install it, enable it, and confirm it's listening on its port:

```bash
sudo apt install -y zabbix-agent2
sudo systemctl enable --now zabbix-agent2
ss -tulnp | grep 10050        # agent2 listening on 10050?
```

Then prove it from the server side rather than assuming. Ask the agent a question and see if it answers:

```bash
zabbix_get -s <proxmox-ip> -k system.hostname
```

If that returns the node's hostname, the agent half is done.

## The server: building from source, and the postgres surprise

The **server** is where the time went. A from-source `./configure` in `~/zabbix` was cheerfully reporting that it was going to build almost nothing:

```text
Enable server:  no
Enable proxy:   no
Enable agent:   no
```

The real wall was the database. Zabbix wants PostgreSQL, and the host didn't have it the way the install scripts assumed:

```text
sudo: unknown user postgres
id: 'postgres': no such user
Unit postgresql.service could not be found.
```

That trio is unambiguous once you stop reading it as a permissions bug: there is **no `postgres` user and no `postgresql.service`** because PostgreSQL isn't installed at all. The Zabbix database-setup steps assume a packaged PostgreSQL that created the system user and the service unit for you. Skip that, or land on a distro where it didn't happen, and every `sudo -u postgres ...` in the guide collapses. The fix is install and start PostgreSQL first (it'll listen on `localhost:5432`), create the `zabbix` database and the `zabbix` role, then point the server at it. The bootstrap is straightforward, but the source build won't do it for you.

## The switch: SNMPv3, proven before the UI

The Cisco switch is monitored over SNMP with Zabbix's stock *Template Net Cisco SNMP*. The discipline that saves an afternoon here is to prove the credentials and crypto with a raw walk **before** wiring anything into the Zabbix UI. Query the device's own sysName OID and see if it answers with its hostname:

```bash
snmpwalk -v3 -l authPriv -u zabbix -a SHA -A '<auth-pass>' -x AES -X '<priv-pass>' \
    192.168.3.10 1.3.6.1.2.1.1.5.0
```

A hostname coming back means the SNMPv3 user, the auth (SHA) secret, and the priv (AES) secret all line up, so when Zabbix later says "no data," you already know it's a template or item problem and not a credentials one. (Real secrets redacted here; don't ship the placeholders.)

## Honest status

The agent side works and is useful. The full Zabbix server is "mostly stood up" rather than a finished dashboards-and-alerts deployment. The too-early Trixie timing turned a fifteen-minute apt install into a build-and-bootstrap project, and there's no polished NOC behind it yet.

## Takeaways

- **A too-new distro means owning the ecosystem gap.** Trixie before Zabbix's Trixie repo meant `apt` had nothing and the release `.deb` 404'd.
- **The previous release's repo is the pragmatic fallback for agents.** `zabbix-agent2` from Bookworm runs fine on Trixie.
- **`unknown user postgres` / `postgresql.service could not be found` is a missing dependency, not a config bug.** Install PostgreSQL first; the source build won't bootstrap the DB for you.
- **Prove SNMP with a `snmpwalk` of the sysName OID before opening the monitoring UI.** It cleanly separates "credentials/crypto wrong" from "template wrong."
