---
title: 'Azure: Tapper — foothold and the managed identity'
date: 2026-06-02
summary: From an SSH foothold to an over-privileged VM managed identity that opens the Azure control plane — and lateral movement without ever guessing a password.
series: 'Azure: Tapper'
part: 1
room: 'Azure: Tapper'
platform: TryHackMe
difficulty: Hard
tags: ['azure', 'managed-identity', 'imds', 'cloud', 'lateral-movement']
draft: false
---

Tapper is an Azure-focused room where the interesting attack surface isn't the
operating system — it's the *identity* attached to it. This first part covers the
foothold and the realisation that the box's own cloud identity is the way in.

> Lab identifiers (tenant IDs, app IDs, usernames) are redacted or genericised
> throughout. The point is the technique and the defence, not a copy-paste key.

## TL;DR

A foothold on a Linux VM leads to its **managed identity**. That identity turns
out to hold Azure control-plane rights — enough to run commands on a *neighbouring*
VM. SSH passwords never enter the picture; the cloud identity is the credential.

## The foothold

The entry host (call it `firehose`) accepts SSH by **key, not password**. That's a
useful early signal: when an Azure box is built around key-based SSH and there's no
obvious password to spray, the designers usually intend the path to run through the
cloud identity plane, not through a credential-guessing OS exploit.

So the first question isn't "what's the password" — it's "what is this machine
*allowed to do in Azure*?"

## The managed identity

Azure VMs can carry a **managed identity**: a service principal Azure hands out
tokens for, with no secret stored on disk. Any process on the box can ask the
Instance Metadata Service (IMDS) for an access token:

```bash
curl -s -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/" \
  | jq -r .access_token
```

That token *is* the VM's Azure identity. The only question left is how much it can
do — and on Tapper, the answer is "more than it should."

## Lateral movement through the control plane

With an ARM token in hand, the managed identity had enough rights to enumerate
resources and — the key move — invoke **Run Command** on a *second* VM:

```bash
az vm run-command invoke \
  --resource-group <rg> --name <peer-vm> \
  --command-id RunShellScript --scripts "id; hostname"
```

Run Command executes as root/SYSTEM on the target and returns the output, so this
is remote code execution on a neighbour **without any SSH session, key, or password
on that box at all**. The foothold VM's over-scoped identity became a pivot across
the resource group.

## Detect and prevent

- **Scope managed identities to least privilege.** A web/app VM rarely needs
  `Microsoft.Compute/.../runCommand` over its peers. Grant resource-specific roles,
  not broad Contributor at the resource-group or subscription scope.
- **Alert on Run Command.** `VirtualMachines/runCommand/action` in Azure Activity
  logs is high-signal — legitimate use is rare and bursty; attacker use looks the
  same but from the wrong principal.
- **Treat IMDS as a credential endpoint.** Egress-filter `169.254.169.254` from
  workloads that don't need it, and watch for token requests from unexpected
  processes.

## Next

→ Part 2: turning an app-only Microsoft Graph token into tenant-wide account
takeover with a single, narrow-looking permission.
