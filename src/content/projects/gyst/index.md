---
title: 'GYST: a self-hosted household-ops PWA with an agentic assistant'
world: work
date: 2026-06-10
summary: A single-container household-operations app where you photograph a shelf to inventory it and a 40+-tool agentic loop can drive everything you can.
featured: false
cover: ./cover.png
coverAlt: A radial diagram of GYST, with a JARVIS assistant at the centre surrounded by inventory, chores, food, notes, appointments, and PWA tiles
tags: ['self-hosted', 'llm', 'pwa', 'reflex', 'ai-assistant', 'python']
draft: false
---

## What it is

GYST (short for "Get Your Stuff Together") is a self-hosted PWA for running a household. It pulls the usual scattered concerns into one installable app: a photo-based inventory, chores and tasks, food (pantry, shopping list, meal plan), notes, and appointments. It has a public repo and is licensed PolyForm Noncommercial, so it's meant to run on your own hardware for your own household, not as a product.

The original itch was that none of the household-tracking tools I tried were worth the friction of keeping them current. Inventory apps in particular die the moment data entry becomes a chore. So the design bet was to make capture cheap enough that the data stays current. Point a camera at the problem instead of typing.

## The capture pipeline

Photograph a shelf and a vision model catalogs each item it sees; an optional local object-detector handles counting. Point it at a bookshelf and it enumerates the individual titles. A receipt photo runs through OCR that pulls out the line-items along with the store, the date, and the total; the return-window reminder is computed from the purchase date. A barcode scan auto-populates the name, an image, and an estimated value, converting currency when needed.

None of these are perfect on their own, but that is fine. They get you to a draft you can correct in a few taps instead of a blank form you have to fill from scratch.

## JARVIS, the agentic assistant

The assistant, which I call JARVIS, is a Claude/OpenAI agentic tool-use loop with 40-plus tools. The design rule was full CRUD parity: anything you can do by clicking through the UI, the assistant has a tool for. The tools map directly onto the same mutations the UI calls, so there's no second-class command surface and no "the app can do this but the assistant can't." That parity is what makes it safe to delegate to. It works as another way to drive the same app rather than a chatbot bolted onto the side.

You reach it three ways: type at it, use an always-present omnibox, or talk to it with voice in and voice out. On top of the reactive loop there's a proactive layer: a scheduled "think" pass plus morning and evening briefings, throttled by cooldowns. It surfaces what needs attention without being asked.

## Self-hosting

GYST is built to be hosted by one person on one box. The stack is Reflex 0.9 (Python compiled to React, one language end to end), served by Granian. Storage is deliberately boring: one SQLite database per concern, so inventory, food, tasks, and the rest are isolated files you can back up or reason about independently. It ships its own Caddy for TLS and runs as a single container. As a PWA it installs to a phone home screen and behaves like a native app.

The whole thing is meant to come up with one container and a volume: no orchestration, no managed services, no external dependencies you have to keep alive.

## Security

It's a household app, but it touches a camera roll, outbound network fetches, and LLM API keys, so I treated security as a feature rather than an afterthought. There's a security-invariant test suite written against the standard library (no exotic dependencies) covering path traversal, upload size caps, a CSRF origin check, rate limiting, permission scrubbing, and header regressions. Outbound fetches go through SSRF allow-lists so the server can't be talked into hitting internal addresses. Uploaded images are re-encoded to strip EXIF (including GPS). Passwords are hashed with PBKDF2, there's per-module RBAC, and API keys are encrypted at rest.

None of that is exotic. These are the table-stakes controls that home projects routinely skip, which is how a "harmless" home app ends up the soft target on your network.

## Closing

GYST runs in production on my own hardware, holding the real state of a household. The commitments behind it run through the rest of my work too. An LLM assistant should have real parity with the app it lives in, capture friction is what kills self-hosted tools, and a home project still deserves real security controls. It was built solo with heavy AI pair-programming. Of all my projects it's the one with the lowest barrier to understanding. Open the repo, stand it up on one box, and the way I think about putting an agent to work is right there in the tool surface.
