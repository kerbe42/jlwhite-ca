---
title: 'Two halves of one idea: HouseGRC and DeepReview'
world: work
date: 2026-06-11
summary: An inward GRC platform and its outward-facing OSINT mirror, built solo and wired together with SSO.
featured: true
cover: ./cover.png
coverAlt: A mirrored diagram — HouseGRC (inward, your own posture) and DeepReview (outward, third parties) linked by single sign-on
tags: ['grc', 'osint', 'ai', 'security-engineering', 'reflex']
draft: false
---

Most security work splits into two questions. How good is my own posture? And how good is the posture of everyone I depend on? I built a platform for each, and then I wired them together.

HouseGRC is the inward one: a self-hosted, multi-tenant GRC platform that documents and manages an organization's own governance, risk, and compliance posture. DeepReview is its deliberate inverse: a passive-OSINT intelligence platform that profiles the third parties you depend on. Same person, same design instincts, opposite direction — and they share a single sign-on, so the org you assess in one is the org you manage in the other.

## The inward side: HouseGRC

HouseGRC ships a catalog of 35-plus compliance frameworks — ISO 27001 and 42001, SOC 2, the NIST family (CSF, 800-53, AI RMF), PCI DSS, HIPAA, GDPR, DORA, the EU AI Act, and more — and lets you work across all of them at once through a controls library with cross-framework mappings, so one control maps across standards instead of being re-documented per framework.

On top of that catalog sits the working machinery of a GRC program. A risk register with inherent-versus-residual scoring and heat-maps. Evidence collection, including scheduled connectors that pull from AWS, GitHub, and Okta. Thirty-five-plus policy templates behind an approval workflow. An audit toolkit with control sampling, finding workpapers, and exportable audit bundles. Third-party and vendor risk — a trust index, automated tiering, and tokenized public security questionnaires. Software and asset inventory with vulnerability tracking. BIA, BCP, DR, and incident-response planning. Incident management that automatically flags when something crosses a regulatory-reporting threshold. Automated security-control-assessment scoring, and executive dashboards over all of it.

Underneath sits the enterprise plumbing: SAML and OIDC SSO, SCIM provisioning, a versioned REST API, group-based RBAC, MFA via TOTP and WebAuthn, an immutable hash-chained audit trail, fail-closed multi-tenant isolation, and encrypted in-app backups. It runs in production with a rapid release cadence.

## The outward side: DeepReview

DeepReview is built for one authorized purpose: red-team and CTF reconnaissance, and vendor-risk assessment of parties you have a legitimate relationship with. Within that boundary it profiles the organizations and individual consultants you rely on, using public information only. The edition I'll describe is passive OSINT — it collects and scores what's already public, with no active scanning.

For each subject it runs a multi-phase deep dive. First a fan-out: 40-plus public-source collectors feed a hash-deduplicated evidence store. Then per-domain LLM synthesis turns that raw evidence into findings. Then an adversarial pass re-checks every finding against the gathered evidence. It's a discovered-versus-verified model: a finding that doesn't survive the cross-check is marked unverified rather than quietly counted, so false positives stop dragging the grade down. What survives feeds a deterministic, weighted rollup into an A-through-F scorecard with eight sub-scores, and a capstone executive breach-risk profile that explains how the surviving weaknesses could chain together — the same reasoning a defender uses to prioritize.

Several properties keep it honest. Every finding traces back to a real public artifact; no claim floats free of its source. Change-detection across re-runs shows what moved since last time, and operator curation is sticky, so a human judgment call isn't erased by the next run. For people, a fail-closed identity-attribution gate means it never proceeds on a bare name match. It's wired to HouseGRC with real signed, single-use SSO, so an assessment flows straight into the vendor-risk side of your own program.

## The shared AI pipeline

Both apps lean on LLMs, and both treat the model as a component inside a disciplined pipeline rather than a chat box you trust. The shared lineage is a multi-lens, multi-pass review: several passes look at the same material from different angles, every conclusion is grounded in collected evidence, an adversarial pass critiques the model's own output, and a final synthesis pass reconciles it. The verify-every-finding step in DeepReview and the evidence-grounded review in HouseGRC are the same idea applied in two directions.

The plumbing under that is provider-agnostic. A single LLM adapter sits in front of Anthropic, OpenAI, Gemini, Cohere, Mistral, DeepSeek, or a custom endpoint, so the pipeline doesn't care which model answers. Before any untrusted text reaches a model, it's wrapped in anti-prompt-injection guardrails — which matters when your input is, by design, hostile public web content. And every model call goes through a logged cost-and-debug trail: there are no silent calls, so I can see what was sent, what it cost, and why a given answer came back.

## The security throughline

Across both projects, security is treated as a product feature, not a checklist. The outbound side is fenced: any fetch goes through SSRF chokepoints with allow-lists, so a tool that reads the public web within its authorized scope can't be talked into reaching somewhere it shouldn't. Data is encrypted at rest. Access is governed by group-based RBAC with MFA in front of it. Tenants are isolated fail-closed. And the audit trail is hash-chained, so tampering with history is detectable rather than silent. These aren't bolted on after a pen test; they're the same handful of decisions made consistently in both codebases.

## Built solo, in Python and Reflex

Both run on the same stack: Reflex — Python compiled to React — over SQLAlchemy, with the database encrypted via SQLCipher on the GRC side, and FastAPI with arq/Redis and Postgres on the OSINT side. One language end to end, which for a solo build is the difference between shipping and stalling.

I built both of these myself, with heavy AI pair-programming — the same agentic, evidence-grounded, adversarially-checked approach the apps themselves use, turned back on the work of writing them. I set the direction and the boundaries and made the calls; the model did much of the typing and a fair amount of the reviewing. The result is two platforms that mirror each other: one that documents and manages your own posture, one that checks whether the parties you depend on are trustworthy. The single sign-on between them isn't a flourish — it's the mechanism that lets an assessment in DeepReview land directly in HouseGRC's vendor-risk register, so the two questions resolve into one workflow.
