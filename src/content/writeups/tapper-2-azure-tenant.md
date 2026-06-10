---
title: 'Azure: Tapper — into the tenant'
date: 2026-06-03
summary: Using the foothold to reach an Azure tenant — identity, tokens, and the path to broader access.
series: 'Azure: Tapper'
part: 2
room: 'Azure: Tapper'
roomUrl: https://tryhackme.com/room/azuretapper
platform: TryHackMe
difficulty: Hard
tags: ['azure', 'entra-id', 'tokens', 'cloud']
draft: true
---

> Draft scaffold — to be written up from notes. Tenant identifiers, tokens, and
> flags will be redacted; the focus is the identity attack path and how to defend it.

## TL;DR

How the foothold from Part 1 turned into access to the Azure tenant.

## The identity angle

The credential or token that mattered, what it granted, and how that was discovered.

## Pivot into Azure

The path from a local context to the cloud control plane — roles, scopes, and what
each step unlocked.

## Impact

What full access would mean in a real environment, stated plainly.

## Detect &amp; prevent

Conditional access, token lifetimes, role hygiene, and the telemetry that would
have surfaced this.
