---
title: 'Building a security program from zero'
date: 2026-06-10
summary: 'How I''d stand up a security function where there isn''t one: visibility before controls, a framework as a shared map, and sequencing by risk reduced per unit of effort rather than by what''s interesting.'
kind: playbook
tags: ['security-program', 'leadership', 'governance', 'methodology']
draft: false
---

I've done this job more than once: walk into an organisation that grew up as an operational business, not a software shop, and stand up a security function where there wasn't really one. No specifics here, just the order of operations I'd repeat.

## 1. Visibility before controls

You cannot protect what you can't see, and almost every immature organisation is flying blind on three things: what assets exist, where the important data lives, and what's actually exposed. So the first work is an inventory rather than a control: assets, data, identities, internet-facing surface, and the handful of "if this stops, the business stops" systems. It's unglamorous and it's the foundation. Every later decision is a guess until you have it.

## 2. Pick a framework as scaffolding, not as a religion

Adopt a recognised framework early. Use **CIS Controls v8** for the practical "what do we actually do" layer, **NIST CSF 2.0** for the "how do we talk about it to leadership" layer. This isn't about compliance theatre. A framework gives you a shared map, a way to say where you are, where you're going, and what's deliberately not done yet, in language an auditor, an insurer, and a board all already speak. Building without one means re-litigating scope in every meeting.

## 3. Sequence by risk reduced per unit of effort

The interesting work is tempting, but the discipline is doing the *high-leverage* work first, and the boring controls win that contest almost every time. Multi-factor authentication, reliable backups you've actually tested, patching the internet-facing things, and centralised logging will stop or limit more real incidents than anything fashionable. Rank the backlog by "how much risk does this remove for how much effort," do the top of that list, and resist the pull toward the shiny.

## 4. Make every control survivable

A control the business routes around is worse than no control. It gives you false assurance and teaches people your judgment is optional. So the test for anything you roll out has two parts: "is it strong" and "can this operation run with it." Design for the night shift, the plant that can't take a window, the worker who isn't at a desk. Spend your scarce "we do this the hard way" capital on the few places risk demands it, and make everything else fit how people already work. (I've written about [that tension](/notes/security-a-247-operation-can-live-with) on its own.)

## 5. Measure a few things that matter

Pick a small number of metrics that track real risk reduction, like coverage of MFA and EDR, time to patch the exposed surface, backup-restore success, and mean time to detect. Report them honestly, including the bad ones. A dashboard of green lies is how programs lose the trust they need to keep going.

## 6. Maturity is a direction, not a finish line

You will never be "done," and a program that claims to be is either lying or about to be surprised. The goal is a function that's a little more mature each quarter, that the business has started to absorb as "how we do things," and that survives the arrival of pressure, whether a deadline, an outage, or a cost cut, because by then the controls belong to the business and not just to you. Build for that, and the program outlasts you.
