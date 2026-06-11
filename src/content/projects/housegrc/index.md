---
title: 'HouseGRC: a self-hosted, multi-tenant GRC platform, built solo'
world: work
date: 2026-06-11
summary: A solo-built, owner-controlled GRC platform that consolidates frameworks, risk, controls, audits, vendor risk, and resilience planning into one encrypted, multi-tenant app with central fail-closed tenant scoping and an AI copilot — paired with its outward-facing counterpart, DeepReview.
featured: true
cover: ./cover.png
coverAlt: A module map of the HouseGRC GRC platform — frameworks, controls, risk, audits, vendor risk, dashboards — over a Python/Reflex stack
tags: ['grc', 'compliance', 'security-engineering', 'reflex', 'ai', 'multi-tenant']
draft: false
---

## What it is

HouseGRC is a self-hosted, multi-tenant governance, risk, and compliance platform that I built solo and run myself. The sensitive part of GRC — your open risks, your control gaps, your incident playbooks — is exactly what you least want sitting in a SaaS you don't control. HouseGRC keeps that record in a single owner-controlled deployment, encrypted at rest: one app that consolidates an organization's compliance frameworks, risk register, controls and evidence, policies, audits, third-party/vendor risk, software and asset inventory, BIA/BCP/DR and incident-response planning, and executive reporting. You hold the keys and the data stays inside your boundary.

It is the inward half of a two-part idea. [DeepReview](/work/deepreview) — my outward-facing, authorized-use-only vendor-risk and reconnaissance counterpart — is the inverse: where HouseGRC manages your own posture, DeepReview profiles the third parties you depend on. The two are wired together with a signed, single-use SSO hand-off that maps a HouseGRC SuperAdmin to a DeepReview admin, and a completed DeepReview assessment can flow back into HouseGRC's vendor-risk register. They stand alone, but they're built as two ends of one workflow.

## Domain breadth

The hard part of GRC isn't the UI; it's the breadth of the domain and the relationships between its parts. HouseGRC ships with a broad seeded catalog spanning the major standards — the ISO 27000 family plus the privacy and AI extensions (27701, 42001), SOC 2, the NIST family (CSF, 800-53, 800-171, RMF, AI RMF), PCI DSS, HIPAA, HITRUST, CIS, CMMC, FedRAMP, CSA CCM, and a wide set of privacy and sector regimes (GDPR, CCPA/CPRA, PIPEDA, LGPD, POPIA, DORA, NIS2, the EU AI Act, OWASP LLM, and more). The point of seeding that many isn't the count; it's the controls library underneath them. A single control cross-maps across many standards, so satisfying one requirement credits every framework that depends on it instead of forcing you to re-document the same control N times.

On top of that catalog sit the working surfaces:

- **Risk register** — inherent vs. residual scoring, heat-maps, and the ability to promote a finding straight into a tracked risk.
- **Evidence** — scheduled connectors (cloud, source-control, and identity-provider integrations) that pull evidence on a cron rather than relying on someone remembering to screenshot a console, with automatic mapping of collected evidence to the overlapping controls it satisfies.
- **Policies** — a library of policy templates with a submit / approve / reject workflow.
- **Audit toolkit** — control sampling, finding workpapers, and exportable audit-project bundles you can hand to an external auditor.
- **Third-party / vendor risk** — vendor profiles, automated risk tiering whose reasoning is shown rather than hidden behind a single opaque number, a normalized trust score fed by the vendor's profile and assessment signals, and tokenized public security questionnaires a vendor can fill without an account.
- **Software & asset inventory** — paired with a vulnerability register fed by a CVE feed, scored with CVSS, and worked through a triage flow.
- **Resilience planning** — BIA, BCP, DR, and incident-response plans with phased, role-tagged steps so each phase records who does what.
- **Incident management** — with a regulatory-reporting rule engine that evaluates a breach's data class and jurisdiction (PII / PHI / payment data, by region) against thresholds and maps the combination to the specific reporting obligations and clocks it triggers, so an obligation in the wrong jurisdiction surfaces instead of slipping.
- **Architecture risk assessments** — document upload with AI extraction, plus automated security-control-assessment scoring with a graded result and a per-domain breakdown.
- **Executive dashboards** — Risk, Security, IT, an AI-impact board scored against the NIST AI RMF, and a predictive view.
- **The long tail of GRC hygiene** — exceptions, access reviews, a regulations register with change tracking, privacy DSAR handling and right-to-be-forgotten redaction, and retention.

It also exposes a REST API and supports enterprise SSO and multi-org operation, so a larger installation can integrate it with existing identity and provision multiple business units under one deployment.

## Architecture

HouseGRC is a Python full-stack application built on Reflex, which compiles a Python UI to React. State is server-authoritative: the browser holds a thin client, and user actions round-trip as events to event handlers on the server, which mutate state objects and stream back the minimal delta over a WebSocket. The upside is that one language and one type system span the whole app — there's no separate JavaScript codebase, and the back-end model objects the UI binds to are the same objects the services layer mutates. The cost is that the app is stateful and connection-oriented rather than a stateless request/response front end, which shapes how sessions and long-running work are handled.

Because some integrations genuinely want a conventional request/response surface — the REST API, SCIM, SAML — a FastAPI sub-app is mounted alongside the Reflex ASGI app and serves those endpoints directly, rather than trying to model webhook callbacks and machine-to-machine calls as UI events. Persistence is SQLAlchemy 2.0 with Alembic migrations. The default datastore is a SQLCipher-encrypted SQLite database, which keeps the whole deployment to a single owner-controlled, fully-encrypted-at-rest file; migrations and seeding run at boot against that encrypted database (the SQLCipher key is supplied at connect time, so Alembic operates on the decrypted handle like any other engine). Postgres is the supported backend when an installation outgrows the single-file model — the SQLAlchemy layer is the same either way, so the switch is a connection concern, not a rewrite. In-process scheduling uses APScheduler to drive the evidence connectors, CVE-feed pulls, and backup jobs on a cron without standing up a separate worker fleet. The whole thing ships as a single Docker image behind a standard reverse proxy / CDN of the operator's choice; the deliberately small footprint is what makes it realistic for one person to maintain and for an organization to self-host without a platform team behind it.

## Tenant isolation

For a system whose job is to hold an organization's compliance and risk record, the multi-tenant boundary is a feature surface, not a config flag. Rather than trusting every query to remember a `WHERE org_id = ?` clause, org scoping is enforced centrally and is designed to fail closed. The current org lives in a `ContextVar` set per authenticated request/task; a SQLAlchemy `do_orm_execute` listener intercepts ORM SELECTs and attaches a `with_loader_criteria` predicate scoped to that org context, and a complementary `before_flush` hook scopes writes, so the filter is injected below the service layer instead of being hand-written per query. When no org context is set, the default is to deny rather than return an unscoped result — a missing context yields nothing, not everything. Sub-org hierarchies are reconciled with the filter by scoping to the org subtree (resolved through a recursive query that's memoized per request to keep the cost down) rather than a single id, so a parent can see its children without the filter having to be turned off. I treat this layer as something to keep hardening rather than a solved invariant — central enforcement removes the most common class of cross-tenant bug from the surface area, but it's a boundary I keep testing, not one I assume is airtight.

## Defensive engineering

Layered on top of the tenant boundary:

- **Encryption** — column- and secret-level authenticated encryption (AES-GCM) for the most sensitive fields, on top of SQLCipher's full-database encryption at rest.
- **Authentication** — MFA via TOTP and WebAuthn/passkeys, role-based access control, geo/IP access controls, and new-IP sign-in alerts.
- **Auditability** — an append-only, hash-chained audit trail: each entry incorporates a hash of the prior entry, so editing or deleting any record breaks verification of everything downstream and makes silent tampering detectable.
- **Outbound safety** — outbound fetches go through a single SSRF-aware chokepoint that resolves and screens destinations against internal, link-local, and metadata IP ranges and restricts schemes, so connectors, webhooks, and document fetches can't be coerced into pivoting into internal networks.
- **LLM input safety** — untrusted text is run through a guardrail before it reaches a model: it's framed as data, not instructions, inside clearly delimited BEGIN/END markers with an explicit instruction-hierarchy reminder that wrapped content must never be treated as commands, invisible/control characters used by injection vectors are stripped, and a best-effort detector flags likely injection attempts. A GRC tool ingests exactly the attacker-influenced material — vendor questionnaires, uploaded architecture documents — that prompt injection targets, so that chokepoint is on the hot path, not optional.

## AI engineering

The chat copilot is read-only and data-aware: it can query your own GRC data and answer across it, but it cannot mutate anything — the tool surface exposed to the model is deliberately read-only, so "assist" can't become "act." Its data access runs through the same org-scoped filtering as everything else, which means read-only is also tenant-scoped — the copilot can't reach another org's rows any more than a service method can. AI risk and control suggestions, predictive analytics, AI-written executive summaries, and AI-governance scoring round out the assistive layer.

The most involved piece is the DeepReview review engine, which also powers the outward product. A run assembles subject context, then fans out to multiple focused "lens" analysts that each examine the subject through a single viewpoint and return structured findings rather than prose. Those findings feed an adversarial challenge pass that critiques the first draft — the pipeline red-teams its own conclusions before they're allowed to stand — and a synthesis pass then aggregates the surviving, scored sub-findings into a rating, a normalized score, and a prioritized action list. Constraining each stage to a structured schema is what makes the passes composable and the aggregation deterministic instead of a second model "summarizing vibes." Runs are kept in history, and any finding can be promoted into the risk register. Underneath sits a provider-agnostic LLM adapter with a single configuration and connection-test path: the same pipeline runs against Anthropic, OpenAI, or an operator-supplied custom endpoint, with the adapter normalizing model families, request shape, and JSON-wrapping quirks so the orchestration code doesn't care which provider is behind it. System prompts are editable rather than hard-coded, so analysis behavior can be tuned without touching code.

## Built solo

Building and running this alone is the constraint that shaped every choice above. A single encrypted file as the default datastore, one Docker image, in-process scheduling, and one language across the stack aren't minimalism for its own sake — they're the only way the operational surface stays small enough for one person to own while the compliance surface stays large. The interesting tension is that a GRC platform's whole value proposition is trustworthiness, and trustworthiness usually buys you a team, an audit budget, and a SOC. Without those, the trust has to come from the architecture instead: central fail-closed tenant scoping, layered encryption, a tamper-evident audit chain, and the SSRF and prompt-injection chokepoints are the things that let a one-person build credibly hold the data it holds. Working on it taught me to treat the security model as the product rather than a wrapper around it — and to be honest that "designed to fail closed" is a posture you keep earning, not a box you check once. It's the inward half of a pair: profile everyone you depend on in [DeepReview](/work/deepreview), manage your own posture here.
