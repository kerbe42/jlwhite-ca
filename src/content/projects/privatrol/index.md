---
title: 'Privatrol: where an organization keeps its data, and which laws apply'
world: work
date: 2026-06-11
summary: "A self-hosted OSINT tool that finds where an organization's data is kept, using public sources only, and checks each location against privacy and data-residency law for 91 jurisdictions. It also builds the wider outside view: domains, hosts, exposures, leaked credentials, people, corporate structure and suppliers, with an A to F grade and a cited source for every finding."
featured: true
featuredRank: 2
cover: ./cover.png
coverAlt: "The Privatrol mascot: a troll in silhouette dragging a club and shining a flashlight across a document and a globe"
tags: ['osint', 'privacy', 'data-residency', 'vendor-risk', 'mergers-and-acquisitions', 'fastapi']
draft: false
---

## What it is

Privatrol answers one question about an organization from the outside: is its data kept where the laws of the countries it operates in allow? It finds where each service keeps its data (mail, files, collaboration, mail filtering, web hosting, software-as-a-service), works out where the organization operates, and checks each location against law data for **91 jurisdictions and 119 laws**, every entry with its sources.

Every result is a *potential* issue found from outside. It names the law, the citation and the document to ask for, such as a transfer assessment, contract clauses or a data-region setting. An outside view cannot see contracts, and the tool says so.

It is one of the [MNA Tools](/work/mna-tools), where it is the outside view of an acquisition target before anyone signs: know where the target's data lives and which laws apply. The same view works for a supplier review. It is free, by invitation, for organizations with a legitimate interest in the company being assessed, and it installs on their own servers. More at [privatrol.com](https://privatrol.com) and on its [MNA Tools page](https://mnatools.com/privatrol). It was called DeepReview until November 2026.

## Where data lives

Each location carries a stated confidence: confirmed, strong, indicative, inferred or unknown.

- **Microsoft 365 mailboxes** are read from Microsoft's own routing and checked from two VPN exits in different Microsoft geographies. A mailbox counts only when both exits agree, because for an address that does not exist the service answers from a server near the caller. A tenant whose answers follow the caller is reported as undetermined, never guessed. Mailboxes in more than one geography are flagged.
- **SharePoint and OneDrive** are proved by the tenant's identifier, then read for farm group and data boundary. Multi-Geo satellites are found by name and proved the same way.
- **Teams** has no public location signal, so its location is inferred from the tenant's geography and labelled as inferred.
- **Mail gateways and senders** are read from the hostnames in the organization's mail records, where the provider's own naming states the region.
- **Cloud hosting regions** come from the providers' published address ranges. Content delivery networks are reported as edge networks with the origin not visible.
- **SaaS hostnames that name a region** are recorded with the pattern that matched.
- **Google Workspace** and anything else not observable from outside is shown as unknown, and judged only where a law requires in-country storage.

## Everything else it exposes

Every earlier capability stays. From one seed domain it follows what public sources say the organization owns:

- domains, subdomains and brands, including ones nobody listed;
- hosts, networks, hosting providers and countries;
- exposed services, certificate and TLS weaknesses, and known vulnerabilities ranked by exploitation evidence;
- leaked credentials in public breach and infostealer indexes;
- people exposure from public profiles, with derived email addresses labelled as derived;
- corporate structure and acquisitions, and the organization's own suppliers (fourth parties).

Findings roll up into an A to F grade from eight weighted sub-scores, a breach-risk profile with attack paths, and an executive report that saves as a PDF. Run again before closing, it shows what changed.

## Keeping it honest

- A finding has to cite evidence that exists, or it is dropped. Every address, domain or host a finding names must appear in the evidence.
- A separate check re-reads each finding's evidence. What it cannot confirm is marked unconfirmed and does not move the grade.
- A failed lookup is never a clean result. A source that was blocked or down is reported as such, and a data location it cannot observe is shown as unknown.
- Mentioning is not owning: only sources whose claim is ownership add to the footprint.
- Scraped pages and uploaded documents reach the model as marked data, never as instructions.

## How it works

It is passive by default. Collection reads public information: routing and address data published by the providers, certificate transparency logs, DNS, vulnerability catalogs, breach indexes, regulator filings and archived pages. When it touches the organization's own systems it does only what any visitor does. Every query leaves through a commercial VPN exit, and that rule fails closed: if the tunnel is down, the run stops before its first query.

An optional active tier exists for assessments the target has agreed to in writing. It is off by default, admin-only, and recorded in the audit log.

It runs as one Docker Compose project on your own server, with a FastAPI backend, Postgres and Redis for the job queue, and a React frontend. The model layer supports several hosted providers and custom endpoints. Updates are fetched only when you choose.

## Limits

- It sees only what is public. An internal network, a private cloud account or a contract nobody published is out of reach, and an absence is reported as unmeasured, not clean.
- The area scores are model judgements. The surrounding code constrains them but does not make them deterministic.
- Some sources need keys; a missing key shows as skipped in the run log, which is different from found nothing.
