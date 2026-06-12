---
title: When UDP-only firewall rules quietly broke DNSSEC
date: 2026-06-09
summary: A home-lab outage where one protocol checkbox took down every .ai domain, and why DNS needs TCP.
room: Home lab
platform: Home lab
difficulty: Info
tags: ['dns', 'dnssec', 'pfsense', 'pi-hole', 'troubleshooting']
draft: false
---

A self-inflicted outage worth writing down, because the failure mode was so narrow
it looked like the internet was broken rather than my firewall.

## The symptom

Most of the internet resolved fine. But a handful of domains returned `SERVFAIL`:
every `.ai` domain, including the one I use most. It wasn't slow or blocked. The
resolver flatly refused to answer for one slice of the namespace while everything
else worked.

## The setup

Two Pi-hole resolvers handle DNS for the network, forwarding upstream with DNSSEC
validation enabled. A firewall rule governs their egress to the upstream resolvers
on port 53. The rule allowed `UDP` only.

That looks correct. DNS is "a UDP protocol", right?

## Why it broke

DNS is a UDP protocol *until the answer doesn't fit*. A response larger than the
UDP limit gets truncated, and the resolver retries the same query over `TCP/53`.
DNSSEC makes this common: signatures and keys bloat responses, so validated
lookups fall back to TCP far more often than plain ones.

The `.ai` zone's signed responses were large enough to need that TCP fallback. With
the firewall allowing UDP only, the retry was silently dropped. The resolver
could never complete validation, and returned `SERVFAIL`. Domains with smaller
signed responses squeaked under the UDP limit and kept working, which is exactly
what made it look like a per-TLD problem instead of a transport problem.

## The fix

Change the egress rule from UDP-only to `TCP/UDP` for port 53. The truncated-retry
path opened back up, validation completed, and `.ai` resolved immediately.

## Takeaways

- **DNS needs TCP.** Treat `TCP/53` as mandatory egress for any validating
  resolver, not an edge case.
- **DNSSEC raises the stakes.** Bigger responses make TCP fallback routine. A
  UDP-only path will bite you specifically on the secured zones.
- **A partial DNS outage is a transport clue.** When *some* names fail and most
  don't, suspect response size and fallback before you suspect the upstream.
