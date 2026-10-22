---
title: 'DeepReview: passive-OSINT security profiles of vendors, consultants and acquisition targets'
world: work
date: 2026-06-11
summary: A self-hosted platform that builds an evidence-backed security profile of a third party (a vendor, an individual consultant, or a company you might buy) from public information. A long-running collect, enumerate, synthesize and verify pipeline produces eight area scores, an A-F grade, a breach-risk profile and an executive report, and every finding cites the public artifact behind it.
featured: true
featuredRank: 2
cover: ./cover.png
coverAlt: The DeepReview pipeline (a vendor or a person, 40+ OSINT collectors into an evidence store, LLM synthesis that cites its evidence, adversarial verification of every finding, a weighted rollup to an A–F grade, an executive breach-risk profile) beside the eight sub-scores that make up the grade
tags: ['osint', 'vendor-risk', 'security-intelligence', 'mergers-and-acquisitions', 'ai', 'fastapi', 'red-team']
draft: false
---

## What it is

DeepReview builds a security profile of a third party from public information. The subject can be a vendor, a supplier, a SaaS provider, an individual consultant, or a company you are thinking of buying. Each profile is a living scorecard: eight area scores, an overall A–F grade, the findings behind them, how those findings could chain into a breach, and a do-business recommendation. Every finding cites the public artifact it rests on, and the run log accounts for every source, including the ones that failed or never ran.

It is one of the [MNA Tools](/work/mna-tools), where it is the outside view of an acquisition target before anyone signs. It is free there, on request, for organizations with a legitimate interest in the company. It started as one app with [HouseGRC](/work/housegrc), the inward half of the same idea. The two now run as separate deployments, and nothing passes between them on its own: a DeepReview finding goes into a HouseGRC risk register when someone triages it.

It's at version 0.38 (October 2026), self-hosted on my home lab, and meant for authorized vendor-risk work and red-team reconnaissance.

## What a dive touches

A default dive works from public sources: certificate transparency logs, DNS and registration records, vulnerability catalogs, breach and infostealer indexes, regulator filings, corporate records, search results, archived pages, code hosts, job postings, and dark-web search over Tor. When it contacts the company's own systems, it does only what any visitor does. It looks up host names, including likely ones it guesses (vpn, webmail, autodiscover). It loads public web pages, reads certificates and security headers, and takes screenshots. It does not port-scan, probe for vulnerabilities, brute-force paths or log in to anything, and it never checks a guessed email address against the company's mail server.

The same build has an active tier: live-host probing, vulnerability templates, port and service scans, content discovery and a DNS wordlist sweep. It is off by default and admin-only. It is refused for a subject until an admin records that scanning that target is authorized, and that attestation goes in the audit log. The report says plainly whether a review included active scanning. There is also a separate sandbox for running a code sample in a disposable container. This page is about the passive dive.

All collection leaves through a commercial VPN, and that rule fails closed. If the tunnel is switched off, or the selected region fails a pre-flight check, the dive stops before its first query instead of falling back to the home connection. DNS lookups go through the tunnel too, and the tool runner refuses any tool that would reach the network without it (onion fetches go through Tor). When a site's bot protection blocks one VPN exit, the request is retried from another of 18 regions, and the run log lists every site fetched elsewhere.

## The pipeline

A dive is one background job with a time budget, six hours by default and at most. A large group uses most of it, mainly because every source is paced to its own rate limits. The phases run roughly in this order.

**1. Collect.** Every enabled connector runs concurrently into the evidence store, which deduplicates by content hash. There are 63 connectors: 45 keyless and 18 that need a key. Each one is switched on or off separately, and keys are encrypted at rest. By default, web search goes through a self-hosted metasearch engine rather than a paid search API. Documents you upload (a SOC 2 report, a security policy) are read in full, within the time limit, and become evidence like everything else. For a person, the person-scoped connectors run instead: breaches, sites an email address is registered on, a username across thousands of sites, code-hosting profiles, forum history and data-broker people search, all anchored to the identifiers you enter.

**2. Map the estate.** From the seed domain it gathers subdomains from certificate logs and passive DNS, resolves every host, generates and resolves likely variations, and flags dangling DNS that could be taken over. It then maps hosts to networks, hosting providers and locations, screenshots the live web hosts, and flags software past its end of support.

**3. Deepen.** The model reads what has been gathered and proposes new targets: a domain, an organization name, a product to check for CVEs. Those go back to the collectors. That's two rounds by default and four in Full OSINT mode.

**4. Work out what the company owns.** For an acquisitive group this is where the attack surface grows past the one domain you were given. It reads the company's corporate history, its parent and its siblings from Wikidata, its encyclopedia entry, securities filings (including the subsidiary list) and deal coverage. It asks the company's Microsoft 365 tenant for its own list of domains and adopts each one only on a matching tenant ID. It searches for subsidiaries' domains, which need a name match and live mail before they count. And it accepts a brand's own website as proof when that site links back to the company (or shares its analytics tag) and names it as the parent. Sibling companies in the same group are reported separately, never attributed to the subject and never scored.

**5. People.** It builds a roster of named employees from public profiles (up to 5,000), works out the company's email format from at least two real addresses, derives an address for each person and checks those against breach and infostealer data. A derived address is labelled as derived, never becomes a finding, and is never added to the count of confirmed ones. A predictable email format is reported as a finding in its own right, because it turns a public roster into a mailing list.

**6. Close the loop.** A closure pass repeats the per-domain steps for whatever turned up late, until a round finds nothing new, so one dive finishes what it finds instead of leaving it for the next.

**7. Correlate.** It infers the subject's own suppliers from what it already collected: identity provider, mail and DNS hosts, CDN, hosting, every service authorized to send mail as the company, and the tools its job postings name. CVEs are matched to software versions and ranked by known exploitation, exploitation probability (EPSS) and public exploits.

**8. Analyze.** The model writes cited findings for each security area, investigates the top findings in depth, and then the grounding, attribution and verification gates below run. The scores roll up into the grade, people and credential exposure are fused into a human attack surface, and a final pass chains the weaknesses into attack paths, names the data at risk, and gives a do-business verdict.

## How the grade works

The eight areas are attack surface, vulnerabilities, credential exposure, web and TLS, reputation, compliance and certifications, data privacy, and business stability. For each area the model reads that area's evidence, scores it from 0 to 100 and writes findings. Each finding has to cite evidence rows by ID, and a finding without a valid citation is dropped. Synthesis can use one chosen provider or all of them at once. With several, each scores the area independently, the scores are averaged and the findings pooled, and a separate consolidation step on the cheapest model merges the duplicates.

Code does the rest. The area scores combine under fixed weights (18, 18, 15, 12, 12, 10, 8 and 7 percent, renormalized over the areas that have a score) into an overall score out of 100. That maps to a grade: A from 90, then B, C and D in steps of ten, and F below 60. The report shows each area's real share of the grade.

The area scores are the model's judgement, so two dives can land differently on similar evidence. The code around the model is there to keep that drift small and visible. Confirmed exposure (a breached address, an infostealer infection, a breach notice filed with a regulator) becomes a finding straight from the evidence, whether or not the model mentioned it. A finding the verifier refutes stops counting against its area, but only for half the gap and never above 90, so a dive can't improve its grade by producing findings that don't hold up.

## Keeping it honest

The tool is only useful if it doesn't make things up, so honesty is built in at several layers.

- **Cited synthesis.** A finding has to point at evidence rows that exist, or it's dropped (above).
- **Grounding.** Every email, domain, host, IP and URL a finding names has to appear in the collected evidence, matched on its boundaries rather than as a loose substring, or it is stripped. That catches a model inventing a concrete-sounding identifier. The breach-risk profile's indicators get the same check, and an attack path that cites a CVE has to stay within the CVEs and hosts the correlation step found.
- **Attribution for people.** Profiling an individual is where OSINT most easily blames the wrong person, so each finding about a person must anchor to an identifier confirmed for them (an email, a handle, a domain, an employer). A bare name match is rejected, and suppressed leads are kept with the reason.
- **Verification against each finding's own evidence.** A verifier rereads the rows each finding cites, in full, and judges the claim against them. A finding it can't check is marked "couldn't verify" and leaves the grade alone. A refuted finding stays visible and clearly marked, and is left out of the action plan.
- **A failed lookup is never a clean result.** When a source is rate-limited, blocked or down, the run log says so and names the claim it is not making ("no breaches", "no certificates", "no adverse news"). A source that was never really asked is "unavailable", not "empty". A failed answer is never cached and served later as "nothing found".
- **Partial is not failed, and a cut is never silent.** A tool that runs out of time keeps what it already found and is marked incomplete. Wherever a limit cuts a list short, the list is ordered by what matters most, and the run log says what was left out.
- **Mentioning is not owning.** Only sources whose claim is ownership can add a domain, a network or an email domain to a subject's footprint. A link on the subject's website, an address in a search snippet, a hosting provider's network, or an app whose publisher shares a word with the subject's name is a lead, never an attribution.
- **Untrusted text stays data.** Scraped pages, dark-web results and uploaded documents reach the model inside marked evidence blocks, with standing instructions to treat them as data, not direction.
- **No silent model calls.** Every call is logged with its stage, model, tokens and latency, each dive shows its estimated cost and where its time went, and a model stage that never once succeeded is flagged.

## Running a dive

The job runs on a worker over a Redis queue, so the web app stays responsive while a dive takes hours, and the vendor page shows the phase timeline as it goes. Stop takes effect within minutes, because the long fan-outs check in after each item. At 96% of its budget a dive pauses rather than fails, keeping everything it gathered, and Continue finishes the analysis. A stopped or paused dive says which collection steps never ran.

Enumeration results (certificates, subdomains, registration and corporate records) are cached and reused across dives and subjects while they're fresh. A source that asserts a risk is always asked again, so a fixed issue really does close, and a "Fresh" option re-queries everything.

Between dives, findings keep their identity. The model words its findings differently every run, so each new finding is matched to the one it continues by its cited evidence, its assets and its wording, cautiously enough that findings about different hosts, CVEs or controls are never merged. What you marked as a false positive, accepted or edited stays that way. Evidence you excluded stays excluded when the same item is collected again, and anything removed from a subject's profile stays out.

## What you get

**The vendor page.** Every tab has its own URL: Overview (grade, verdict, area scores and the narrative), Findings, Attack paths, Inventory, Graph, Evidence, Run log, Activity, Profile and Ask. The inventory lists everything the dive found, with each subdomain mapped to its apex domain, and exports to CSV and JSON; the people export can be limited to confirmed addresses. The graph has five views (network, ownership hierarchy, impact map, source coverage, composition), and selecting a node runs the sources that apply to it and merges anything new into the current dive. Live check re-confirms one finding against the host as it is now. Ask is a chat about the subject's dive that can propose facts for you to confirm, but never saves them itself.

**The executive report.** Since version 0.30 the exported report is written for executives and saves as a PDF from the browser. It opens with a cover page: the score and grade, the recommendation, a plain-English bottom line and key messages. Then come charts (score by area, a likelihood-by-impact risk grid, findings by area, the score over time), every open finding explained as what was found, why it matters and what to do, how an attack could unfold, what is at stake, a prioritized action plan, what the review could not confirm, and a reading key with a glossary. The full technical record is an optional appendix, with findings numbered the same way in both parts.

**The plain-English brief.** The model writes those explanations from each finding's own text and isn't allowed to add facts. Its output is checked against what was sent. A finding it couldn't explain is shown in the analyst's wording, with a note saying so. Explanations are saved, so reopening a report costs nothing, and only a finding that has changed is explained again.

**Portfolio view.** Across all subjects, it shows which suppliers your vendors share, such as how many sign in through the same identity provider, counted only over the vendors that were measured.

## Monitoring and alerts

Every 30 minutes the worker runs a set of checks. It watches certificate transparency for new hostnames on monitored subjects' confirmed domains. It also checks its own infrastructure: the VPN tunnel and its exit address, the search exits and the tool runner. If anything is down, every page shows a red banner. Scheduled re-assessment exists but is off by default, so nothing re-runs against a subject unless you turn it on.

Alerts go to a webhook, by email, or both. They fire when a monitored subject changes materially or a new hostname appears, when a dive fails, and when the infrastructure goes down and comes back. Email alerts came in version 0.34, after a VPN outage went unnoticed for four days because no webhook had been set.

Web search had a similar weak point: search engines rate-limit each internet address, and a shared VPN exit runs out quickly. Since version 0.35 search runs through nine metasearch instances, each leaving through a different VPN region, and a degraded answer is asked again through another one.

## Models

The model layer doesn't depend on one provider. Seven hosted model providers are built in, plus any custom endpoint, each with its own encrypted key. An admin can edit the prompts, and every edit is audited. For single-seat personal use it can instead run every call through the operator's own AI subscription, using the provider's supported headless sign-in. In that mode the app refuses to start if a stray API key is present, so a call can't silently fall through to billed usage. A multi-user or hosted deployment must use API keys.

## Accounts and access

DeepReview has its own accounts: argon2-hashed passwords with a 12-character minimum, login rate limiting, sessions that a password change revokes, and a security audit log. Admins manage users, connectors, keys and prompts. Other users run dives and curate findings. A subject is private to whoever created it unless they share it, and admins can see everything.

## Stack and hosting

Python 3.12 throughout: **FastAPI**, **SQLAlchemy 2.0** and **asyncpg** over **Postgres 16**, **Pydantic v2**, and **arq** on **Redis 7** for the dive queue, with **argon2** and **Fernet** for passwords and stored secrets. The frontend is **React**, **Vite**, **TypeScript** and **Tailwind**, with **TanStack Query** and **Recharts**. Open-source recon tools run in their own tool-runner container, Tor in another, and each VPN region in its own.

The whole thing is one Docker Compose project on my home lab, behind a reverse proxy with an internal CA. Nothing is port-forwarded. From outside the house it's reachable only through an outbound tunnel with an identity check that admits my own email addresses. Deploys back up the database first and refuse to run while a dive is in progress. CI runs more than 2,000 backend tests plus the frontend tests and a type-checked build.

## Limits

- It sees only what is public. An internal network, a private cloud account or a policy nobody published is out of reach, and an absence is reported as unmeasured, not clean.
- The area scores are model judgements. The code constrains them but doesn't make them deterministic.
- Some sources need paid or free keys, and per-address breach checks need one. A missing key shows as "skipped" in the run log, which is a different fact from "found nothing".
- Coverage depends on search engines and bot protection treating VPN exits fairly. When they don't, the run log says so rather than hiding it.
- Derived email addresses are educated guesses, labelled as such. They help someone plan the next step, but they aren't evidence.
