---
title: 'Running Wazuh at home: a dead dashboard and a flooded agent'
date: 2026-06-11
summary: Two failures from a home SIEM during a week of Proxmox and firewall rework. A TLS cert/key path mismatch that quietly took the whole dashboard down, and a level-12 "agent buffer flooded" alert that looked alarming but was actually the pipeline working.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['wazuh', 'siem', 'detection-engineering', 'homelab', 'tls']
draft: false
---

The lab runs its own SIEM. [Wazuh](https://wazuh.com), with its manager, indexer, and dashboard, has agents pushed out to the VMs, the hosts, and the workstations, so the network has somewhere to send its logs and somewhere to ask "did anything weird just happen?" It's the defensive mirror of the offensive [writeups](/writeups): the same systems, watched from the other side.

Running detection tooling at home teaches you something the documentation doesn't. Most of what a SIEM tells you isn't an attack; it's the SIEM telling you about *itself*. Two failures from one week of [Proxmox](/lab/home-lab-overview) and firewall rework make the point. One hid, and one announced itself loudly and turned out to be good news.

## Incident one: the dashboard that quietly died

After a round of certificate and firewall changes on the cluster, the Wazuh web console stopped loading. No dashboard, no UI, nothing to look at, which is a bad place to be, because the tool you'd use to investigate an outage is the tool that's down.

The reflex is to assume the whole stack fell over. It hadn't. Checking the services directly:

```bash
admin@wazuh$ systemctl status wazuh-manager wazuh-indexer wazuh-dashboard
```

The **manager** was running. The **indexer** was running. Only the **dashboard** was dead, which is the useful clue, because it narrows the problem from "Wazuh is broken" to "the web front end won't start." Events were still being collected and indexed the whole time; only the window into them was gone.

The dashboard logs its own startup crash, so that's where the answer was. The cause was mundane and total: a **TLS cert/key path mismatch**. The dashboard's TLS config, namely `server.ssl.certificate` and `server.ssl.key` in `opensearch_dashboards.yml`, still pointed at a key file by a name that no longer existed after the cert rework. The dashboard couldn't read the key it was told to use, so it refused to start and took the console down with it. Nothing was compromised, nothing was corrupted; one stale path killed the whole service.

Fixing the path so the config matched the keys actually on disk brought the dashboard straight back. Manager, indexer, dashboard all green; console reachable again.

The lesson is unglamorous and worth writing down. "Everything is technically fine but one path kills the whole service" is a real and common failure mode, and you diagnose it by chasing the crash log of the *specific* component that's down, not by assuming the whole system failed. And the moment you have a known-good state back, you capture it. This is what VM snapshots are for:

```bash
root@pve$ qm snapshot <wazuh-vmid> post-cert-fix-dashboard-working
```

One stale config line cost an evening once. A snapshot makes the next one a one-click recovery.

## Incident two: a level-12 alert that was actually a good sign

With the console back, it had a high-severity alert waiting. **Rule 204, level 12** (Wazuh's scale runs to 15, so 12 is firmly in "pay attention" territory):

```text
Rule ID:     204
Rule Level:  12 (High)
Description: Agent event queue is flooded. Check the agent configuration.
Groups:      wazuh, agent_flooding, gdpr_IV_35.7.d
Agent:       STORM (192.168.1.182)
Full Log:    wazuh: Agent buffer: 'flooded'
```

A high-severity alert naming a specific host looks like the start of an incident, but this one is a telemetry-health alert rather than a security one. It means the Wazuh agent on that host generated log events faster than it could ship them to the manager, so its internal send buffer filled up and the agent raised the flag itself.

Keeping *severity* separate from *meaning* is most of the skill here. The triage:

| Question | Answer |
| --- | --- |
| Is it malicious? | No |
| Does it mean compromise? | No |
| Is it important? | Yes, log integrity was briefly at risk |
| Should you ignore it? | No |

It carries a compliance tag for that reason (Wazuh maps rule 204 to **GDPR IV.35.7.d**): a flooded buffer is a window where events could have been dropped, and you're supposed to notice. Given the agent was on a box living through the same week of network blips, service restarts, and firewall changes as everything else, the cause was almost certainly a temporary disruption. The agent briefly couldn't reach the manager, events backed up, the buffer filled. The other usual suspects are worth knowing because they're the ones that *recur*: Sysmon enabled without filtering, a file-integrity scan over a big directory during an update, or an auditd flood from a package install.

The immediate response is a two-minute health check on the agent: confirm it's running, restart it if it's been flapping, and read its own log:

```bash
admin@storm$ systemctl status wazuh-agent
admin@storm$ systemctl restart wazuh-agent
admin@storm$ tail -n 50 /var/ossec/logs/ossec.log
```

If a buffer flood is a **one-off** tied to a known disruption, that's the whole fix: acknowledge it and move on. If it **recurs**, the agent is genuinely out-running its buffer under normal load, and you tune the buffer rather than suppress the alert, in the agent's `ossec.conf`:

```xml
<client_buffer>
  <disabled>no</disabled>
  <queue_size>5000</queue_size>
  <events_per_second>500</events_per_second>
</client_buffer>
```

`queue_size` is how many events the agent will hold while it catches up; `events_per_second` throttles the send rate so a burst doesn't overwhelm the manager. The trap to avoid is the lazy one of disabling rule 204 because it's noisy. That doesn't fix the flood; it just blinds you to the next window where logs go missing.

It's worth reframing what this alert actually shows. A level-12 alert firing correctly on a buffer flood is the detection pipeline proving it works. High-severity rules are evaluating, agent-health monitoring is live, buffer detection is functioning, and the alert reached a human. A SIEM that never tells you about itself usually isn't quiet, it's broken in a way you haven't noticed yet.

## Shipping the alerts onward: Wazuh to Graylog

Wazuh has its own dashboard, but I also feed its alerts into Graylog so the lab has one place to search across everything, not just Wazuh's own view. The decision that keeps this sane is to forward **only the alerts, not every raw log Wazuh ingests**. `/var/ossec/logs/alerts/alerts.json` is the stream you actually want, and shipping the full event firehose would just rebuild the flood from the last section one layer up the stack.

rsyslog does the forwarding: an `imfile` input tails the alerts JSON, and `omfwd` ships each line to Graylog over TCP, kept in its own config file so it's easy to find and not tangled in the default ruleset:

```text
# /etc/rsyslog.d/60-wazuh-graylog.conf: tail alerts.json, forward to Graylog:5555
```
```bash
admin@wazuh$ sudo systemctl restart rsyslog
```

On the Graylog side the lines land on a TCP input as raw syslog wrapping a JSON payload, so a pipeline rule pulls them apart, keyed on the cheapest reliable signal that a Wazuh alert is a JSON object:

```text
rule "parse_wazuh_alert_json"
when
  starts_with(to_string($message.message), "{")
then
  // parse the JSON body into fields
end
```

That `starts_with(..., "{")` condition is doing real work: it's how the pipeline distinguishes a structured Wazuh alert from ordinary syslog noise arriving on the same input, without running an expensive regex against every message that comes through.

## Takeaways

- **Narrow before you panic.** "Wazuh is down" was really "only the dashboard is down." Check the components individually; the one that's actually dead is the one whose logs hold the answer.
- **A stale path is a total outage.** A cert/key mismatch after unrelated rework took the whole console offline with nothing compromised. Chase the crashing component's own log, and snapshot the known-good state the moment you have it back.
- **Severity is not meaning.** A level-12 `agent_flooding` alert is high-severity *and* benign, a telemetry-health signal rather than an intrusion. Triaging "is this malicious?" separately from "is this important?" is the core SOC reflex, and it's the same at home as at scale.
- **Tune, don't suppress.** A recurring buffer flood gets fixed with `client_buffer` settings, not by muting the rule. Muting the alert just hides the next gap in your logs.
- **The SIEM watching itself is a feature.** The most common alert in a healthy deployment is the system reporting on its own plumbing. That's the signal you want: it's how you know the pipeline that would catch a real attack is actually running.
- **Forward alerts, not raw logs.** Shipping Wazuh's whole event stream to Graylog just relocates the flood; `alerts.json` is the stream worth shipping, and a `starts_with "{"` pipeline condition cheaply separates the JSON alerts from syslog noise.
