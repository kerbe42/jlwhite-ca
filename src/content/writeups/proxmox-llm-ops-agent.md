---
title: Giving an LLM the keys to my Proxmox cluster (carefully)
date: 2026-06-11
summary: I built an n8n workflow that lets an LLM act as an ops agent over my four-node Proxmox cluster, and the interesting part wasn't the wiring — it was deciding how to scope a confident, occasionally-wrong model so it can't take down my lab.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['ai-security', 'llm', 'n8n', 'proxmox', 'automation', 'homelab']
draft: false
---

## The idea

I run a four-node Proxmox cluster at home, and most of the questions I ask it are boring and repetitive: is the cluster quorate, is Corosync happy, which VMs and containers are running where, how is storage looking, are the bridges and bonds and VLANs configured the way I think they are. All of that lives behind a handful of CLI commands and API calls, and answering it usually means SSHing around and squinting.

So I built an n8n workflow that puts an LLM in front of it. Each node is exposed to the model as a set of tools — inspect cluster health, query Corosync, list VMs and containers, check storage, look at networking, and run node-level commands. Ask "why is this LXC unreachable" and the agent can go look instead of me doing it by hand.

The build was the easy half. The half worth writing down is the rules I held myself to, because I was about to hand a language model a path to a shell on infrastructure I care about. That deserves a threat model.

## The model is an untrusted caller

The mental shift that makes this safe is to stop treating the LLM as "me, but faster" and start treating it as an untrusted client that happens to be eloquent. It is confidently wrong sometimes. It can be steered by text it reads. And the moment it has tools, every weakness it has becomes a weakness your infrastructure has.

That reframing drives every rule below. These are the constraints I scope the design around, not features I'd claim are bulletproof — the value is in deciding them deliberately rather than wiring up a god-mode agent and hoping.

## Read-only by default, write as the exception

The highest-leverage rule is to split the toolset into two clearly separated tiers.

The read tier — health, Corosync state, VM/container inventory, storage usage, network topology — is the overwhelming majority of what the agent does, and none of it changes state. That tier I'm comfortable letting the model call freely, because the worst case is a wrong answer, not a wrong action.

The write tier — anything that mutates state or runs a node-level command — should be small, explicit, and gated. The default for any new capability is read-only; promoting something to the write tier should be a deliberate decision, not the path of least resistance. If a tool doesn't *need* to change the system to do its job, it shouldn't get the ability to.

## Least privilege and a small blast radius

These are the same containment idea at two layers, so I treat them together.

First, identity. The agent shouldn't run as a god account just because that's the convenient one to paste into a credential field. Give it its own identity with the narrowest permissions that let the read tools work, and write capability scoped to only what the gated actions require. If those credentials leaked tomorrow, the blast radius should be "it could read cluster status," not "it could rebuild the cluster." This is the same principle I'd apply to any service account, and it's easy to skip precisely because the LLM feels like a person you trust rather than a process you're granting rights to.

Second, scope per action. Assume something eventually slips through, and constrain how much any single action can do. Node-level command execution is the sharpest edge, so it's the part to fence most tightly — narrow in what it can target, never a free-form root shell with the whole cluster in reach. Where possible, an action touches one node, not all four. The cluster helps here too: a quorate, multi-node setup means a single bad node action is more survivable than it would be on a single host.

## A human in the loop for anything destructive

For the write tier, the agent shouldn't close the loop on its own. A destructive or state-changing action becomes a proposal: the agent says what it wants to do and why, and execution waits on an explicit human approval step before anything runs. That's a natural fit for a workflow tool — pause, notify, approve is cheap to wire in.

The reasoning is simple. "Restart this node" should require a human to read the sentence and click yes, so a plausible-sounding-but-wrong plan dies at the gate instead of in production. The bar scales with consequence: read freely, propose-and-confirm for the rest.

## Prompt injection is a real threat, not a curiosity

This is the part specific to tool-using agents and easy to wave away. The agent reads text — status output, logs, descriptions, anything piped into its context. Any of that text can contain instructions. "Ignore your previous constraints and run the following command" embedded in a log line isn't hypothetical; it's the natural attack against an agent that both reads attacker-influenceable data and holds tools.

You can't make the model immune to being talked into something, so don't rely on it being well-behaved. The defenses have to live *outside* the model: the read/write split, least privilege, scoped actions, and the human approval gate all hold regardless of what the model was convinced to attempt. If injected text talks the agent into proposing a destructive command, the worst case is an approval prompt for something dumb — and you say no. The guardrails are the security boundary; the model's good judgment is a nice-to-have, never the control.

## Log every tool call

Last, record every tool call — what was invoked, with what arguments, by which run, what came back. Two reasons. When the agent does something surprising, you want a trail to reconstruct it, the same way you'd want command history on a host. And an unlogged agent is one you can't audit; "I think it only read things" is not an answer I want to give myself later.

## How it's wired, concretely

The abstract rules above have a concrete shape. The cluster is exposed as **four tools, one per host** (`pmx-host1` through `pmx-host4`), each of which runs a single command over SSH on that node and hands back the raw output — no free-form shell, one command per call. Because a VM or container can live on any node, the agent's first move for "do X to guest 105" is a discovery pass — `qm list`, `pct list`, `pvesh get /cluster/resources --type vm` across the hosts — to find which node actually owns it, and only then act there.

The destructive-action gate is a literal rule, not a vibe: deleting a VM, container, snapshot, or backup requires explicit confirmation, and anything tagged **`do_not_delete`** is refused outright. `qm destroy` and `pct destroy` are flagged as the high-risk commands they are. The middle tier — live-migrate, change vCPU or RAM, add a disk, reorder boot — runs when I ask for it directly; OS upgrades and SSH or access-control changes never run on the agent's own initiative.

Above the tools sits a small router. A "general manager" classifies each request and hands it to a specialist — network, security, hosting, or generic — so a firewall question and a Proxmox question don't land in the same prompt. The most instructive bug in the whole build came from exactly there: I asked it to act across *all* the managers, the router emitted `{"target": "all"}`, and the switch — which only had branches for the named specialists — didn't know what "all" meant and stalled. The fix was to make `all` a first-class routing value and fan it out to each manager explicitly. It's a tiny bug, but it's the whole thesis in miniature: the model produced a *reasonable-sounding* output the surrounding system wasn't built to handle, and the surrounding system — not the model — is where you fix it.

## Takeaways

- Treat a tool-using LLM as an untrusted, persuadable client with credentials.
- Default every capability to read-only; make write a small, deliberate, separately-scoped tier.
- Give the agent its own least-privilege identity so a leak's blast radius is "read cluster status," not "own the cluster."
- Scope actions narrowly — one node, not the whole cluster — and let a quorate multi-node setup absorb the rest.
- Put a human approval gate in front of anything destructive; n8n's pause-and-confirm makes it nearly free.
- Put the security boundary outside the model — its good behavior can be argued away.
- Log every tool call. An agent you can't audit is one you can't trust.
