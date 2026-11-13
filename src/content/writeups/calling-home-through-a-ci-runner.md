---
title: 'Locked out by a power cut: calling home through my own CI runner'
date: 2026-11-13
summary: 'After a power outage the cluster came back but the VM that is my only way in did not, and I was at work. One machine at home was still talking to the outside world: a self-hosted GitHub Actions runner. A throwaway workflow, an outbound tunnel to one SSH port, and my own key got me back in without handing a credential to anyone. Plus what it says about self-hosted runners.'
room: Home lab
platform: Home lab
difficulty: Info
tags: ['homelab', 'proxmox', 'github-actions', 'ssh', 'cloudflare', 'remote-access']
draft: false
---

The power went out at home for most of a day. When it came back, the [Proxmox cluster](/writeups/proxmox-cluster-and-its-bugs) booted, found quorum and started every VM that is set to start at boot. That turned out to be the problem: the small VM that runs my Tailscale exit node is not set to start at boot. I was at work, the exit node was down, and with it my only way into the lab. Worse, my laptop sends its traffic through that exit node, so turning Tailscale on with the node offline just cut the laptop off the internet.

So, no VPN, nobody at home, and a job I needed the lab for. What was still alive and talking to the outside?

## The one machine that calls out on its own

A self-hosted GitHub Actions runner. It lives in a small VM, holds an outbound HTTPS connection to GitHub, and runs whatever job a repository it serves hands it. Nothing listens on it from the internet; it asks GitHub for work. That is exactly the shape of a call-home channel, and it was already there.

What it is not: a remote shell. A job runs a script and you read the log when the step ends. And the runner holds no credentials for anything else in the lab, by design.

## Step 1: look around

To run my own script without setting off the repository's real CI, I pushed a throwaway **orphan branch** holding nothing but one workflow and one script. Its workflow is the only one on that branch, so it is the only one that runs:

```yaml
# throwaway branch only, never merged
name: home-ops
on:
  push:
    branches: [home-ops]
concurrency: home-ops
jobs:
  run:
    runs-on: [self-hosted, my-runner-label]
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - run: bash cmd.sh
```

The first `cmd.sh` only looked: which addresses answer, which ports are open, whether the runner has SSH keys, and its neighbour table. The answers:

- The runner has no keys, so it can't log in anywhere. Good.
- It can reach port 22 on my workstation VM, which is the machine I normally work from.
- It can't reach the hypervisors: their management interfaces are firewalled off from the guest network, which is how it should be.
- The neighbour table still had fresh entries for the hypervisors' network cards. The hosts were up. Only the VMs were off.

## Step 2: a tunnel, not a credential

The shortcut would have been to put an SSH key or the root password in a repository secret and let the job do the work. That leaves a credential that opens the whole lab sitting in a CI system, which is the opposite of what I want.

So the second `cmd.sh` opened an **outbound tunnel to one SSH port and nothing else**, and I connected through it from the laptop with the key that already lives there:

```bash
# on the runner: a Cloudflare quick tunnel to the workstation's SSH port only
curl -fsSL -o cloudflared \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared
./cloudflared tunnel --no-autoupdate --url ssh://10.0.0.10:22 > cf.log 2>&1 &
# wait for the random *.trycloudflare.com name, publish it, keep the job alive for 45 minutes
```

GitHub's web page streams a running job's log, but its API only hands the log over once the step has finished, and I wanted this scriptable. So the script pushed the tunnel's random hostname to a second throwaway branch, and I read it from there.

On the laptop, `cloudflared` is the SSH proxy:

```bash
ssh -o ProxyCommand="cloudflared access ssh --hostname %h" \
    -o HostKeyAlias=workstation \
    -i ~/.ssh/my_key me@random-words.trycloudflare.com
```

What makes this acceptable:

- **The key never leaves the laptop.** The runner only forwards bytes.
- **SSH is end to end.** Cloudflare carries an encrypted stream it can't read.
- **The host key is checked.** `HostKeyAlias` makes SSH compare the answer with the host key I already trust for the workstation. A wrong machine on the other end gets refused.
- **It's narrow and it ends.** One port on one machine, a random name nobody can guess, and the job stops itself after 45 minutes.

## Step 3: start the VM

From the workstation, the usual jump to the hypervisors works. One look at the cluster told the whole story:

```bash
pvesh get /cluster/resources --type vm
```

All four nodes were up and quorate. Every VM marked to start at boot was running, and every VM that wasn't stayed off. `qm start` on the exit-node VM, and it was answering pings within half a minute. Then I deleted both throwaway branches.

## What this says about self-hosted runners

The uncomfortable part: **a self-hosted runner is code execution inside your network for anyone who can get a workflow to run on it.** That is what made this rescue possible, and it is just as available to someone who gets push access to one of the repositories it serves. Things I'm tightening because of it:

- **Private repositories only.** GitHub says this too: on a public repository, a pull request from a fork can run code on your runner.
- **Fewer people and tokens with push access** to the repositories the runner serves, and branch rules that don't allow just anyone to add a workflow.
- **Runner groups**, so a runner only takes jobs from the repositories and workflows meant for it.
- **Its own network segment, with outbound traffic limited to what CI needs.** Mine could download a binary and reach a tunnel service. A tighter egress rule would have stopped this rescue, and it would stop an attacker doing the same thing. That's the right trade: the way back in should be a deliberate one (below), not a side effect of CI.
- **No credentials on the runner.** That's why this needed a tunnel and my laptop's key rather than a secret, and it's the part I'd keep exactly as it is.
- **Watch for it.** A new branch that adds a workflow, or a job running at an odd hour, belongs in an alert.

## What the outage taught me

- **Start at boot isn't just for services.** Whatever you need to get back in, the exit node and the jump host, should start on its own, ideally first.
- **A way in shouldn't depend on one VM.** My second path was an accident of having a CI runner. Next time it will be a deliberate one that doesn't live on the cluster.
- **An exit node is a single point of failure for every device that routes through it.** When it is gone, those devices lose more than the lab.
