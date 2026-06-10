# jlwhite.ca

Personal site for Justin White — builds, garden, home lab, and security writeups.
Built with [Astro](https://astro.build), deployed on Cloudflare Pages.

## Design at a glance

- **Audience:** both personal and professional, leaning professional.
- **Look:** "warm maker" — paper background, ink text, Fraunces (serif display) over
  Inter (body), photography-forward. Per-world accent colors:
  amber = builds, green = garden, coral = lab, teal = security.
- **Homepage:** featured work + recent writeups + a security/lab rail, above the fold.
- **Content:** Markdown in this repo. `git push` → Cloudflare Pages builds and deploys.

## Project structure

```
src/
  consts.ts            site name, nav, per-world accents, profile links
  content.config.ts    collection schemas (projects, writeups)
  content/
    projects/<slug>/index.md   one folder per build/garden/lab item (+ photos)
    writeups/<slug>.md         security walkthroughs
  components/          Header, Footer, ProjectCard, WriteupRow, WorldIndex, BaseHead
  layouts/Base.astro  page shell
  pages/              home, builds/garden/lab/writeups indexes, about, detail routes
  styles/global.css   theme tokens + base styles
public/favicon.svg
```

## Common tasks

**Run locally**

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist
npm run preview    # serve the built site
```

**Add a build / garden / lab project**

1. Create `src/content/projects/<slug>/index.md`.
2. Set frontmatter: `title`, `world` (`builds` | `garden` | `lab`), `date`,
   `summary`, `featured` (true to pin on the homepage), `tags`.
3. Drop photos in the same folder. Add a cover with `cover: ./cover.jpg` and
   reference inline images as `![alt](./photo.jpg)` — Astro optimizes them.

**Add a writeup**

1. Create `src/content/writeups/<slug>.md`.
2. Frontmatter: `title`, `date`, `summary`, optional `series` + `part`, `room`,
   `roomUrl`, `difficulty`. Set `draft: true` while it's unfinished — drafts show in
   `npm run dev` but are excluded from the production build.

**Set your profiles**

Edit `LINKS` in `src/consts.ts` (GitHub is set; add your TryHackMe profile URL to
light up the badge on the homepage and writeups page).

## Content notes

- The starter projects and the two `Azure: Tapper` writeups are **placeholder
  scaffolds** (`draft: true` on the Tapper posts) — replace with real content and
  photos. The Pi-hole/DNSSEC post is a complete example of the writeup format.
- Writeups redact flags and live credentials by design and lead with methodology +
  defensive takeaways.
- The lab section is intentionally high-level: topology and tooling, never internal
  hostnames, addresses, or version numbers.

## Deploy

Cloudflare Pages, connected to this repo:

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `jlwhite.ca` (replaces the Namecheap parking redirect)
