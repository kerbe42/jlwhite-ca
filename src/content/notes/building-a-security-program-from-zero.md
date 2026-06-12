---
title: 'Building a security program from zero'
date: 2026-06-10
summary: 'How I''d stand up a security function where there isn''t one: visibility before controls, a framework as a shared map, and sequencing by risk reduced per unit of effort rather than by what''s interesting.'
kind: playbook
tags: ['security-program', 'leadership', 'governance', 'methodology']
draft: false
---

This is the generic version of a job I've done more than once: walk into an organisation that grew up as an operational business, not a software shop, and stand up a security function where there wasn't really one. No specifics here — just the order of operations I'd repeat.

## 1. Visibility before controls

You cannot protect what you can't see, and almost every immature organisation is flying blind on three things: what assets exist, where the important data lives, and what's actually exposed. So the first work isn't a control, it's an inventory — assets, data, identities, internet-facing surface, and the handful of "if this stops, the business stops" systems. It's unglamorous and it's the foundation; every later decision is a guess until you have it.

## 2. Pick a framework as scaffolding, not as a religion

Adopt a recognised framework early — **CIS Controls v8** for the practical "what do we actually do" layer, **NIST CSF 2.0** for the "how do we talk about it to leadership" layer. The point isn't compliance theatre. It's that a framework gives you a shared map: a way to say where you are, where you're going, and what's deliberately not done yet, in language an auditor, an insurer, and a board all already speak. Building without one means re-litigating scope in every meeting.

## 3. Sequence by risk reduced per unit of effort

The trap is doing the interesting work first. The discipline is doing the *high-leverage* work first — and the boring controls win that contest almost every time. Multi-factor authentication, reliable backups you've actually tested, patching the internet-facing things, and centralised logging will stop or limit more real incidents than anything fashionable. Rank the backlog by "how much risk does this remove for how much effort," do the top of that list, and resist the pull toward the shiny.

## 4. Make every control survivable

A control the business routes around is worse than no control — it gives you false assurance and teaches people your judgment is optional. So the test for anything you roll out isn't just "is it strong," it's "can this operation actually run with it." Design for the night shift, the plant that can't take a window, the worker who isn't at a desk. Spend your scarce "we do this the hard way" capital on the few places risk genuinely demands it, and make everything else fit how people already work. (I've written about [that tension](/notes/security-a-247-operation-can-live-with) on its own.)

## 5. Measure a few things that matter

Pick a small number of metrics that track real risk reduction — coverage of MFA and EDR, time to patch the exposed surface, backup-restore success, mean time to detect — and report them honestly, including the bad ones. A dashboard of green lies is how programs lose the trust they need to keep going.

## 6. Maturity is a direction, not a finish line

You will never be "done," and a program that claims to be is either lying or about to be surprised. The goal is a function that's a little more mature each quarter, that the business has started to absorb as "how we do things," and that survives the arrival of pressure — a deadline, an outage, a cost cut — because by then the controls belong to the business and not just to you. Build for that, and the program outlasts you, which is the only real measure of having built one.
