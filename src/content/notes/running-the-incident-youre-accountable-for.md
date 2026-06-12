---
title: 'Running the incident you''re accountable for'
date: 2026-06-11
summary: 'When you own the incident, your job stops being the forensics and becomes deciding under uncertainty — with the technical recovery and the human one running on two clocks at once.'
kind: essay
tags: ['incident-response', 'leadership', 'csirt']
draft: false
---

The first time you're the person *accountable* for an incident rather than one of the people working it, the job changes shape under you. You are no longer the one reading the logs and pulling the artifacts — and the instinct to grab the keyboard is the first thing you have to put down. Your job is now to make decisions, with incomplete information, faster than you're comfortable with, and to be the person whose name is on the calls.

The thing nobody tells you is that an incident has **two clocks running at once.** One is technical: contain, eradicate, recover, understand. The other is human: executives who need to know what this means for the business, legal and insurance and possibly regulators who have their own timelines, customers and staff who'll fill any silence with rumour. The mistake is treating them as sequential — fix it first, talk about it after. They run simultaneously, and the communication track is not a distraction from the "real" work. For a leader, it **is** the real work; the technical team can run their clock if you keep the other one off their backs.

The first hour is about framing, not fixing. What do we actually know versus what are we assuming? What's the worst plausible case, and what's the most likely one? Who needs to be in the room, and — just as important — who doesn't yet, because a room that's too crowded makes no decisions. The pressure is to *do something visible*. The discipline is to spend the first hour making sure the somethings you do next are the right ones, because the expensive errors in an incident are almost always the rushed early moves: the system you wiped that you needed for evidence, the disclosure you made before you understood the scope.

The hardest calls are the irreversible ones. Pull the plug and you stop the bleeding and destroy the forensics. Isolate and watch and you keep your visibility and accept that it might spread. Notify early and you might be wrong; notify late and you might be liable. There's rarely a clean answer, and "wait for certainty" is itself a decision — usually the wrong one. You make the call you can defend with what you knew at the time, you write down *why*, and you move.

And you decide when it's over — which is not when the alert clears. It's over when you understand the root cause well enough to be confident the door you found is actually closed, and that there isn't a second one. The temptation, once the immediate fire is out and everyone is exhausted, is to declare victory and go home. The incidents that come back are the ones where someone did.

The part that compounds over a career is the honesty afterward. The post-incident review that protects egos protects nothing else; the one that says plainly "here is what we missed and why" is the only thing that makes the next incident smaller. Run enough of those honestly and you stop fearing incidents quite so much — not because they stop happening, but because you've built an organisation that gets a little better every time one does.
