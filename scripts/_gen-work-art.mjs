// One-off: generate Work-section cover diagrams (sanitized; generic labels only).
//   housegrc-deepreview/cover.png  — the inward/outward mirror
//   gyst/cover.png                 — GYST + JARVIS radial
//   this-site/cover.png            — how this site is built (you + AI agent)
// Run: node scripts/_gen-work-art.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const paper = '#fbf7ef';
const paper2 = '#f3ecdd';
const line = '#e3dccb';
const lineStrong = '#d8cdb4';
const ink = '#2c2c2a';
const muted = '#5f5e5a';
const faint = '#8a8780';
const work = '#3E6B8B';
const serif = "Georgia, 'Times New Roman', serif";
const sans = 'Arial, Helvetica, sans-serif';

const out = (dest) => { mkdirSync(dirname(dest), { recursive: true }); return dest; };
const write = async (dest, svg) => {
  const info = await sharp(Buffer.from(svg)).png().toFile(out(dest));
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
};
const frame = `<rect width="1200" height="800" fill="${paper}"/><rect x="20" y="20" width="1160" height="760" rx="24" fill="none" stroke="${line}" stroke-width="2"/>`;

// --- 1. HouseGRC + DeepReview mirror -------------------------------------
{
  const chip = (x, y, w, label) => `
    <rect x="${x}" y="${y}" width="${w}" height="52" rx="10" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="${x + 24}" cy="${y + 26}" r="5" fill="${work}"/>
    <text x="${x + 42}" y="${y + 33}" font-family="${sans}" font-size="18" fill="${ink}">${label}</text>`;
  const leftChips = ['35+ compliance frameworks', 'Risk register + heat-maps', 'Controls, evidence, audits', 'Policies + approval workflow', 'Vendor / third-party risk', 'SSO · SCIM · RBAC · MFA'];
  const rightChips = ['40+ passive OSINT sources', 'Hash-deduped evidence store', 'Multi-lens LLM synthesis', 'Adversarial verify-every-finding', 'A–F scorecard + sub-scores', 'Executive breach-risk profile'];
  const stack = (chips, x, w) => chips.map((c, i) => chip(x, 270 + i * 66, w, c)).join('');
  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  ${frame}
  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">HouseGRC + DeepReview</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Inward GRC, outward OSINT — two halves of one idea</text>

  <rect x="60" y="170" width="500" height="566" rx="16" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="84" y="214" font-family="${serif}" font-size="26" fill="${ink}">HouseGRC</text>
  <text x="84" y="244" font-family="${sans}" font-size="17" fill="${work}">inward · your own posture</text>
  ${stack(leftChips, 84, 452)}

  <rect x="640" y="170" width="500" height="566" rx="16" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="664" y="214" font-family="${serif}" font-size="26" fill="${ink}">DeepReview</text>
  <text x="664" y="244" font-family="${sans}" font-size="17" fill="${work}">outward · third parties</text>
  ${stack(rightChips, 664, 452)}

  <line x1="560" y1="450" x2="572" y2="450" stroke="${work}" stroke-width="2.5"/>
  <line x1="628" y1="450" x2="640" y2="450" stroke="${work}" stroke-width="2.5"/>
  <rect x="568" y="424" width="64" height="52" rx="12" fill="#ffffff" stroke="${work}" stroke-width="2.5"/>
  <text x="600" y="456" text-anchor="middle" font-family="${sans}" font-size="16" font-weight="bold" fill="${work}">SSO</text>

  <text x="60" y="768" font-family="${sans}" font-size="15" fill="${faint}">Capabilities and architecture only — no addresses, credentials, or live data.</text>
  <text x="1140" y="768" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;
  await write('src/content/projects/housegrc-deepreview/cover.png', svg);
}

// --- 2. GYST + JARVIS radial ---------------------------------------------
{
  const part = (x, y, w, label) => `
    <rect x="${x}" y="${y}" width="${w}" height="62" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="${x + 26}" cy="${y + 31}" r="6" fill="${work}"/>
    <text x="${x + 46}" y="${y + 39}" font-family="${sans}" font-size="19" fill="${ink}">${label}</text>`;
  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  ${frame}
  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">GYST</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">A household running on a 40-tool AI butler</text>

  <g stroke="${lineStrong}" stroke-width="2" fill="none">
    <path d="M335 241 C 420 256, 470 320, 478 372"/>
    <path d="M865 241 C 780 256, 730 320, 722 372"/>
    <path d="M340 423 H 430"/>
    <path d="M860 423 H 770"/>
    <path d="M335 605 C 420 590, 470 526, 478 474"/>
    <path d="M865 605 C 780 590, 730 526, 722 474"/>
  </g>

  <rect x="430" y="336" width="340" height="174" rx="16" fill="#ffffff" stroke="${work}" stroke-width="3"/>
  <text x="600" y="392" text-anchor="middle" font-family="${serif}" font-size="30" fill="${ink}">JARVIS</text>
  <text x="600" y="428" text-anchor="middle" font-family="${sans}" font-size="20" fill="${muted}">Claude / OpenAI · 40+ tools</text>
  <text x="600" y="462" text-anchor="middle" font-family="${sans}" font-size="17" fill="${faint}">text · omnibox · voice in and out</text>

  ${part(80, 210, 300, 'Inventory — photo + barcode')}
  ${part(830, 210, 290, 'Chores and tasks')}
  ${part(80, 392, 270, 'Food — pantry + meals')}
  ${part(870, 392, 250, 'Notes + dictation')}
  ${part(80, 574, 300, 'Appointments + iCal')}
  ${part(840, 574, 280, 'PWA + push')}

  <text x="60" y="768" font-family="${sans}" font-size="15" fill="${faint}">Self-hosted, single container. Public repo, built for one household.</text>
  <text x="1140" y="768" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;
  await write('src/content/projects/gyst/cover.png', svg);
}

// --- 3. This site (you + AI agent) ---------------------------------------
{
  const step = (x, head, l1, l2) => `
    <rect x="${x}" y="300" width="300" height="150" rx="14" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <text x="${x + 24}" y="346" font-family="${serif}" font-size="24" fill="${ink}">${head}</text>
    <text x="${x + 24}" y="382" font-family="${sans}" font-size="18" fill="${muted}">${l1}</text>
    <text x="${x + 24}" y="410" font-family="${sans}" font-size="18" fill="${muted}">${l2}</text>`;
  const arrow = (x) => `
    <line x1="${x}" y1="375" x2="${x + 38}" y2="375" stroke="${work}" stroke-width="2.5"/>
    <path d="M${x + 38} 369 L ${x + 50} 375 L ${x + 38} 381 Z" fill="${work}"/>`;
  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  ${frame}
  <text x="60" y="100" font-family="${serif}" font-size="48" fill="${ink}">jlwhite.ca</text>
  <text x="62" y="138" font-family="${sans}" font-size="22" fill="${muted}">How this site is built — and who built it</text>

  ${step(70, 'You', 'direction · scope', 'voice · boundaries · facts')}
  ${arrow(382)}
  ${step(450, 'AI agent', 'scaffold · write · optimize', 'review · ship')}
  ${arrow(762)}
  ${step(830, 'Astro', 'static site', 'Cloudflare Pages')}

  <rect x="70" y="500" width="1060" height="56" rx="12" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="600" y="535" text-anchor="middle" font-family="${sans}" font-size="18" fill="${ink}">DNS + DNSSEC · Workspace email · content collections · OG cards · RSS · tags · dark mode</text>

  <text x="60" y="768" font-family="${sans}" font-size="15" fill="${faint}">A workshop notebook, built with the same kind of AI it studies.</text>
  <text x="1140" y="768" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;
  await write('src/content/projects/this-site/cover.png', svg);
}

console.log('done');
