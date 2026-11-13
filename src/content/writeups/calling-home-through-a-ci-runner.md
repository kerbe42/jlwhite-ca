---
title: 'Locked out by a power cut, let back in by my own CI runner'
date: 2026-11-13
summary: 'A power outage left the one VM I use to get into my lab switched off while I was at work. The way back in was a self-hosted GitHub Actions runner, and what found it was the AI coding assistant I had open on my laptop. What it did, why that path exists, how to shut it, and the part that gave me pause: how much the assistant could do with the access I had already handed it.'
room: Home lab
platform: Home lab
difficulty: Info
tags: ['homelab', 'github-actions', 'ai', 'security', 'remote-access']
draft: false
---

We lost power at home for most of a day. When it came back, the [Proxmox cluster](/writeups/proxmox-cluster-and-its-bugs) did exactly what it was set up to do: it booted, found quorum and started every VM marked to start at boot. My Tailscale exit node isn't one of them. I found that out at my desk at work, when I couldn't get into the lab. My laptop also routes through that exit node, so turning Tailscale on just took the laptop offline.

I had Claude Code, an AI coding assistant, open on the laptop for an unrelated job that needed the lab. I asked it whether anything at home was still reachable, then told it to find a way in through whatever on my network still calls out. About twenty minutes later the exit node was running again.

The way back in is worth writing down, because the same path is a way in for someone who isn't me, and because the part that did the finding was an AI agent I had already given a shell.

## The path: a machine that calls out on its own

There is one box on my network that talks to the internet without being asked: a self-hosted GitHub Actions runner. It lives in a small VM, holds a connection open to GitHub, and runs whatever jobs the repositories it serves hand it. Nothing on the internet can connect *to* it. It doesn't need to be reachable, because it reaches out and fetches its own work.

That outbound-only shape is exactly why it's useful, and exactly why it's a back door. A firewall that blocks every inbound connection does nothing about a machine that dials out and asks for instructions. Whoever controls the instructions controls a process running **inside the network, behind the firewall, as the runner's user**. For me that was a rescue. For an attacker it's the whole game, and the only thing they need is the ability to get a job onto that runner.

## How it was leveraged

I'm keeping this to the shape of what happened, not a copy-and-paste recipe, because the point is the exposure, not the steps.

**It got a job to run.** A GitHub Actions runner runs the workflows in the repository it serves. Anyone who can land a workflow file on a branch that triggers a run can execute commands on it. That "anyone" is wider than it looks: people with push access, a token with repo scope that's leaked, or — on a public repo — a pull request from a stranger's fork. The assistant already had my GitHub CLI signed in as me with push rights, so it simply pushed a throwaway branch carrying a single workflow and nothing else, so the repo's real pipeline didn't fire.

**It looked before it touched.** The first job only reported: which hosts answered, which ports were open, whether the runner carried any credentials of its own. It carried none — that part of my setup held. It could reach SSH on the VM I normally work from, but not the hypervisors, which refuse management traffic from the guest network. The runner's neighbour table still listed the hypervisors' NICs, so the hosts were up and only the VMs were off.

**It turned an outbound channel into an inbound one.** A CI job's log can't be read while the step is still running, and the runner has no open port to SSH into. So the job opened an *outbound* tunnel from the runner to a tunnelling service and published the throwaway address it got back. From my laptop I connected through that tunnel to the one SSH port it exposed. Outbound-only, firewalled, no listening service — and still a full interactive shell, because the connection was built from the inside out.

**It used my key, not a stored secret.** The tunnel only forwarded bytes. The SSH session authenticated with the key already on my laptop, and I pinned the host key so a wrong machine on the far end would be refused. From that shell the normal jump to the hypervisors worked, I started the exit-node VM, and it answered within the minute. Then the throwaway branches came down.

The uncomfortable summary: a firewall that allows no inbound connections at all was no obstacle. One machine that dials out, plus the ability to tell it what to run, was enough to reach the inside.

## What shuts it

None of this is exotic, which is the point. The fixes aren't either.

- **Treat a self-hosted runner as untrusted code execution inside your network, because that is what it is.** Everything below follows from accepting that.
- **Private repositories only, and lock down who can push.** GitHub says as much: on a public repo a forked pull request can run on your runner. Fewer people and tokens with push access, branch protection so a new workflow can't just appear, and required review on workflow changes all narrow the "who can get a job to run."
- **Put the runner on its own segment with tight egress.** Mine could download a binary and reach a tunnelling service. An egress allow-list that only lets it talk to GitHub would have stopped my rescue cold — and stopped an attacker doing the identical thing. That's the right trade: the way back in should be a deliberate, documented one, not a side effect of CI.
- **No standing credentials on the runner, and nothing it reaches should trust it by default.** The reason this couldn't be worse is that the runner held no keys and the hypervisors wouldn't talk to it. Keep it that way: short-lived job tokens, secrets scoped per job, and management planes that refuse the guest network.
- **Watch it.** A branch that adds a workflow, a job at an odd hour, a runner making an outbound connection to somewhere that isn't GitHub — each belongs in an alert. I had none of those watching, and I should have.

## The part that gave me pause: the assistant

I didn't work any of that out. I asked a question, gave one instruction, and watched. So the honest subject of this post isn't the runner — it's how much an AI agent can do with the access you've already handed it, and how little of that access I had thought about as access.

The assistant wasn't clever about the runner because it knew a secret. It was effective because of what was sitting open on my laptop:

- **A shell.** It could run commands, read output, and decide the next command from it — the whole loop, without me in it.
- **My GitHub, signed in as me.** The CLI was authenticated with my push rights, so "push a branch that runs a job on the home network" was one command, not a locked door.
- **My SSH keys, on disk.** Once a path to a shell existed, the keys to use it were right there.
- **Reasoning across all of it.** The hard part of this wasn't any single step; it was noticing that an outbound CI runner plus a tunnel plus a local key add up to a route inside. That chaining is the thing these tools are now good at, and it compresses "I should look into that sometime" into twenty minutes.

I pointed it at my own network on purpose, and it did what I asked. But every capability it used would be just as available to an agent pointed at someone's network by somebody with bad intent — or to one that had gone off the rails on a vaguer instruction than mine. The agent doesn't need an exploit. It needs standing access, which is the thing we hand these assistants freely: the terminal, the signed-in CLIs, the keys in the usual place.

So the lesson I'm taking isn't only about CI runners. It's that an AI agent with a shell should be scoped like any other powerful account, because that's what it is:

- **Give it its own identity, not yours.** A separate GitHub login and a key that's its own, each scoped to what the task needs, so "signed in as me with push everywhere" stops being the default.
- **Keep the standing blast radius small.** It shouldn't have ambient reach to push to every repo, SSH anywhere, and touch production, just because I do and it's running as me.
- **Watch what it does, the same as the runner.** The commands an agent runs and the connections it opens deserve the same logging and alerting as any other account that can reach the inside.
- **Decide in advance what needs a human.** Reaching into the home network, publishing, spending, deleting — a confirmation step on those is cheap, and it's the difference between a tool that helped and one that acted on a misread.

## What the outage taught me

- **Start-at-boot isn't just for services.** Whatever you use to get back in — the exit node, the jump host — should come up on its own, ideally first.
- **A way in shouldn't depend on one VM.** My second path was an accident of owning a CI runner. The replacement will be a deliberate one that doesn't live on the cluster.
- **An exit node is a single point of failure for everything that routes through it.** When it's gone, those devices lose more than the lab.
- **The access you've already granted is the attack surface.** The runner was the route, but the thing that made the route trivial to walk was a laptop where the shell, the keys, and a signed-in CLI were all sitting open together. That's worth an audit on its own — mine's happening this week.
