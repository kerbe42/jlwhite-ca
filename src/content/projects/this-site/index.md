---
title: Building this site with an AI coding agent
world: work
date: 2026-06-09
summary: A short, honest account of how jlwhite.ca is built — an Astro site on Cloudflare Pages — and how it was built collaboratively with an AI coding agent under human direction.
featured: false
cover: ./cover.png
coverAlt: A flow diagram — you set direction and boundaries, an AI agent scaffolds and writes, output is an Astro site on Cloudflare Pages
tags: ['astro', 'cloudflare', 'ai-assisted', 'meta']
draft: false
---

## The site

This is an Astro static site. The writeups live in content collections, so each piece is a Markdown file with typed frontmatter and the routing falls out of the directory. Images go through Astro's image pipeline (sharp) and come out as optimized webp. There's a dynamic endpoint that generates an OG card per page, an RSS feed, tag pages, and a dark-mode toggle in a warm palette.

It deploys to Cloudflare Pages: git push, build, live. DNS, DNSSEC, and email auth (SPF/DKIM/DMARC over Google Workspace) all sit on Cloudflare too. There's no server to run, which for a site that publishes a few case studies and the occasional security note is the right amount of infrastructure.

A static site generator on a CDN is the boring, correct choice, and I picked it for the same reason I pick boring tools everywhere else: I'd rather spend the attention on what the pages say than on keeping a host alive.

## How it was built

I built this with an AI coding agent, and the agent did most of the building.

The split was deliberate. I set the direction, the scope, the voice, and — this being a public surface for a person whose other projects are live in production — the publishing boundaries: what's safe to say about each project and what stays out. I supplied the real facts and the real photos. I made the calls. The agent did the building: it scaffolded the Astro project and wrote the code, including the OG endpoint, the image pipeline, and the feed, then turned my notes and corrections into prose.

The writeups went through a small pipeline rather than a single pass. The agent drafted, then a separate adversarial step re-read each draft against the source facts to catch anything invented, overstated, or quietly leaking a detail it shouldn't, and only then finalized. The same fan-out approach ran a code review across the projects I describe here. That structure is the same discipline I apply to the AI features inside HouseGRC and DeepReview: don't trust a single model pass, ground claims in evidence, and put an adversarial check between the draft and the published artifact.

It's worth being precise about what the agent did not get to decide. It didn't decide what was true, what was in scope, or what crossed a line. When a draft drifted — a metric I never measured, a capability stated more confidently than the code supports, a line that read like marketing — I cut it. The boundaries on these pages are mine, and I read every word before it shipped. The agent is fast and frequently wrong; I'm the one accountable for what ships.

## Why write it down

I run security for a living and I build software with AI for the rest of it, and those two things are converging whether anyone is ready or not. The honest version of "AI-assisted" isn't a magic button, and it isn't a junior engineer you can ignore either. It's a capable, confident collaborator that needs the same governance you'd put around any other untrusted-but-useful input: clear scope, grounded facts, a verification step, and a human who owns the result. This site is the smallest instance of that arrangement I run, and it works the same way the larger ones do.
