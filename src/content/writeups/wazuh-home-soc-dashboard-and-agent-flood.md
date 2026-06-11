---
title: 'Running Wazuh at home: a dead dashboard and a flooded agent'
date: 2026-06-11
summary: Two failures from a home SIEM during a week of Proxmox and firewall rework — a TLS cert/key path mismatch that quietly took the whole dashboard down, and a level-12 "agent buffer flooded" alert that looked alarming and was actually the pipeline working.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['wazuh', 'siem', 'detection-engineering', 'homelab', 'tls']
draft: false
---

The lab runs its own SIEM. [Wazuh](https://wazuh.com) — manager, indexer, and dashboard — with agents pushed out to the VMs, the hosts, and the workstations, so the network has somewhere to send its logs and somewhere to ask "did anything weird just happen?" It's the defensive mirror of the offensive [writeups](/writeups): the same systems, watched from the other side.

Running detection tooling at home teaches you something the documentation doesn't: most of what a SIEM tells you isn't an attack. It's the SIEM telling you about *itself*. Two failures from one week of [Proxmox](/lab/home-lab-overview) and firewall rework make the point — one that hid, and one that announced itself loudly and turned out to be good news.

## Incident one: the dashboard that quietly died

After a round of certificate and firewall changes on the cluster, the Wazuh web console stopped loading. No dashboard, no UI, nothing to look at — which is a bad place to be, because the tool you'd use to investigate an outage is the tool that's down.

The reflex is to assume the whole stack fell over. It hadn't. Checking the services directly:

```bash
admin@wazuh$ systemctl status wazuh-manager wazuh-indexer wazuh-dashboard
```

The **manager** was running. The **indexer** was running. Only the **dashboard** was dead — which is the useful clue, because it narrows the problem from "Wazuh is broken" to "the web front end won't start." Events were still being collected and indexed the whole time; only the window into them was gone.

The dashboard logs its own startup crash, so that's where the answer was. The cause was mundane and total: a **TLS cert/key path mismatch**. The dashboard's TLS config — `server.ssl.certificate` and `server.ssl.key` in `opensearch_dashboards.yml` — still pointed at a key file by a name that no longer existed after the cert rework. The dashboard couldn't read the key it was told to use, so it refused to start and took the console down with it. Nothing was compromised, nothing was corrupted; one stale path killed the whole service.

Fixing the path so the config matched the keys actually on disk brought the dashboard straight back. Manager, indexer, dashboard all green; console reachable again.

The lesson is the unglamorous kind worth writing down: **"everything is technically fine but one path kills the whole service" is a real and common failure mode**, and you diagnose it by chasing the crash log of the *specific* component that's down, not by assuming the whole system failed. And the moment you have a known-good state back, you capture it — this is exactly what VM snapshots are for:

```bash
root@pve$ qm snapshot <wazuh-vmid> post-cert-fix-dashboard-working
```

One stale config line cost an evening once. A snapshot makes the next one a one-click recovery.

## Incident two: a level-12 alert that was actually a good sign

With the console back, it had a high-severity alert waiting. **Rule 204, level 12** — Wazuh's scale runs to 15, so 12 is firmly in "pay attention" territory:

```text
Rule ID:     204
Rule Level:  12 (High)
Description: Agent event queue is flooded. Check the agent configuration.
Groups:      wazuh, agent_flooding
Agent:       STORM (192.168.1.182)
Full Log:    wazuh: Agent buffer: 'flooded'
```

A high-severity alert naming a specific host looks like the start of an incident. It wasn't. This is a **telemetry-health alert, not a security one**. It means the Wazuh agent on that host generated log events faster than it could ship them to the manager, so its internal send buffer filled up and the agent raised the flag itself.

That distinction — *severity* versus *meaning* — is the whole skill. The triage:

| Question | Answer |
| --- | --- |
| Is it malicious? | No |
| Does it mean compromise? | No |
| Is it important? | Yes — log integrity was briefly at risk |
| Should you ignore it? | No |

It's tagged **PCI-DSS 10.6.1** (failures in log monitoring must be detected) for exactly that reason: a flooded buffer is a window where events could have been dropped, and you're supposed to notice. Given the agent was on a box living through the same week of network blips, service restarts, and firewall changes as everything else, the cause was almost certainly a temporary disruption — the agent briefly couldn't reach the manager, events backed up, the buffer filled. The other usual suspects are worth knowing because they're the ones that *recur*: Sysmon enabled without filtering, a file-integrity scan over a big directory during an update, or an auditd flood from a package install.

The immediate response is a two-minute health check on the agent — confirm it's running, restart it if it's been flapping, and read its own log:

```bash
admin@storm$ systemctl status wazuh-agent
admin@storm$ systemctl restart wazuh-agent
admin@storm$ tail -n 50 /var/ossec/logs/ossec.log
```

If a buffer flood is a **one-off** tied to a known disruption, that's the whole fix — acknowledge it and move on. If it **recurs**, the agent is genuinely out-running its buffer under normal load, and you tune the buffer rather than suppress the alert, in the agent's `ossec.conf`:

```xml
<client_buffer>
  <disable>no</disable>
  <queue_size>5000</queue_size>
  <events_per_second>500</events_per_second>
</client_buffer>
```

`queue_size` is how many events the agent will hold while it catches up; `events_per_second` throttles the send rate so a burst doesn't overwhelm the manager. The trap to avoid is the lazy one — disabling rule 204 because it's noisy. That doesn't fix the flood; it just blinds you to the next window where logs go missing.

The reframe is the part that matters. A level-12 alert firing correctly on a buffer flood is **the detection pipeline proving it works**: high-severity rules are evaluating, agent-health monitoring is live, buffer detection is functioning, and the alert reached a human. A SIEM that never tells you about itself isn't quiet — it's usually broken in a way you haven't noticed yet.

## Takeaways

- **Narrow before you panic.** "Wazuh is down" was really "only the dashboard is down." Check the components individually; the one that's actually dead is the one whose logs hold the answer.
- **A stale path is a total outage.** A cert/key mismatch after unrelated rework took the whole console offline with nothing compromised. Chase the crashing component's own log, and snapshot the known-good state the moment you have it back.
- **Severity is not meaning.** A level-12 `agent_flooding` alert is high-severity *and* benign — a telemetry-health signal, not an intrusion. Triaging "is this malicious?" separately from "is this important?" is the core SOC reflex, and it's the same at home as at scale.
- **Tune, don't suppress.** A recurring buffer flood gets fixed with `client_buffer` settings, not by muting the rule. Muting the alert just hides the next gap in your logs.
- **The SIEM watching itself is a feature.** The most common alert in a healthy deployment is the system reporting on its own plumbing. That's the signal you want — it's how you know the pipeline that would catch a real attack is actually running.
