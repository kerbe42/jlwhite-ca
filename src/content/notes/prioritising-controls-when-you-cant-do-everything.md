---
title: 'Prioritising controls when you can''t do everything'
date: 2026-05-26
summary: 'You never have enough time, money, or people, so the whole job is sequencing. A practical, CIS-aligned way to decide what to do first, and what to deliberately leave for later.'
kind: playbook
tags: ['risk', 'security-program', 'governance', 'methodology']
draft: false
---

Every security program is under-resourced relative to its threat model. That's the permanent condition, not a failure. The skill that matters is sequencing the controls when you can only do a fraction this year, more than knowing them. Here is how I'd reason about it, kept generic.

## Start from the threats that apply to *you*

A generic top-ten list is a starting point, not an answer. Two organisations the same size can have completely different risk pictures depending on what they do, who'd want to hurt them, and how they'd get hurt. Before ranking controls, get honest about the handful of scenarios that would actually matter here (ransomware on the systems that run the operation, business-email compromise hitting finance, a third party breached into your environment) and prioritise against *those*, not against a poster.

## Use the CIS Implementation Groups as a floor

**CIS Controls v8** ships with Implementation Groups for exactly this problem. **IG1** is the basic hygiene that stops the most common, least-sophisticated attacks, the ones that make up the overwhelming bulk of what actually happens. Get IG1 genuinely covered everywhere before reaching for IG2/IG3 sophistication in one corner. "Basic, but everywhere" beats "advanced, but only here" almost every time, because attackers take the path you left open, not the one you hardened.

## Rank by incidents prevented, not by elegance

Risk is roughly likelihood times impact, but the tie-breaker that matters is how many real attack paths a control closes. The high-rank controls are boring and broad: multi-factor authentication, patching the exposed surface, tested backups, endpoint detection, least privilege, email filtering. Each one blocks a whole class of common incident. A narrow, expensive, exotic control that defends against a threat you're unlikely to face loses to a cheap one that closes a door attackers walk through every day.

## Prefer preventive, broad, and low-friction

When two controls are close, break the tie on three properties: does it **prevent** rather than just detect, does it protect **broadly** rather than one system, and is it **low-friction** enough to survive contact with the business. A control that's preventive, broad, and survivable will remove risk for years. One that's detective-only, narrow, and resented will be bypassed or ignored the first time it's inconvenient.

## Write down what you're *not* doing, and why

The other half of prioritisation is explicit deferral. For every "not this year," record the risk you're accepting and why, so it's a decision the organisation made with its eyes open, not a gap nobody owns. A roadmap that only shows what you're doing hides the part leadership most needs to sign off on: the risk you're choosing to carry.

## Revisit on a clock

Threats move, the business changes, last year's acceptable risk becomes this year's headline. Treat the prioritisation as a living thing you revisit on a regular cadence, not a plan you set once. The ranking that was right twelve months ago is wrong somewhere by now, and it's cheaper to find that yourself than to be shown by an incident.
