// One-off: cover diagrams for the split HouseGRC and DeepReview case studies
// (sanitized; generic labels only). Run: node scripts/_gen-work-art2.mjs
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

// --- HouseGRC: module map (inward) ---------------------------------------
{
  const cols = [60, 435, 810];
  const rows = [175, 261, 347, 433];
  const modules = [
    'Frameworks · 35+', 'Controls', 'Risk register',
    'Evidence + connectors', 'Policies', 'Audits',
    'Vendor risk', 'Assets + vulns', 'BIA / BCP / DR / IR',
    'Incidents', 'ASCA scoring', 'Exec dashboards',
  ];
  const chip = (x, y, label) => `
    <rect x="${x}" y="${y}" width="330" height="72" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="${x + 24}" cy="${y + 36}" r="5" fill="${work}"/>
    <text x="${x + 44}" y="${y + 42}" font-family="${sans}" font-size="19" fill="${ink}">${label}</text>`;
  const grid = modules.map((m, i) => chip(cols[i % 3], rows[Math.floor(i / 3)], m)).join('');
  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  ${frame}
  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">HouseGRC</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Self-hosted GRC platform — manage your own posture</text>
  ${grid}
  <rect x="60" y="525" width="1080" height="64" rx="12" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="600" y="563" text-anchor="middle" font-family="${sans}" font-size="19" fill="${ink}">Python / Reflex · SQLCipher-encrypted · fail-closed multi-tenant · SSO · SCIM · MFA · REST API</text>
  <text x="60" y="640" font-family="${sans}" font-size="17" fill="${faint}">The inward half — paired with its outward OSINT inverse, DeepReview.</text>
  <text x="60" y="768" font-family="${sans}" font-size="15" fill="${faint}">Capabilities and architecture only — no addresses, credentials, or live data.</text>
  <text x="1140" y="768" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;
  await write('src/content/projects/housegrc/cover.png', svg);
}

// --- DeepReview: deep-dive pipeline (outward) ----------------------------
{
  const stages = [
    'Subject — a vendor or a person',
    '40+ OSINT collectors → evidence store',
    'Multi-lens LLM synthesis, cites evidence',
    'Adversarial verify — every finding',
    'Weighted rollup → A–F grade',
    'Executive breach-risk profile',
  ];
  const sy = [178, 250, 322, 394, 466, 538];
  const box = (y, label, last) => `
    <rect x="60" y="${y}" width="520" height="58" rx="12" fill="#ffffff" stroke="${work}" stroke-width="${last ? 2.5 : 2}"/>
    <text x="84" y="${y + 36}" font-family="${sans}" font-size="19" fill="${ink}">${label}</text>`;
  const arrow = (y) => `
    <line x1="320" y1="${y + 58}" x2="320" y2="${y + 68}" stroke="${lineStrong}" stroke-width="2"/>
    <path d="M314 ${y + 66} L320 ${y + 74} L326 ${y + 66} Z" fill="${lineStrong}"/>`;
  const flow = stages.map((s, i) => box(sy[i], s, i === stages.length - 1)).join('')
    + sy.slice(0, -1).map((y) => arrow(y)).join('');

  const subs = ['Attack surface', 'Vulnerabilities', 'Credential exposure', 'Web / TLS', 'Reputation', 'Compliance / certs', 'Data privacy', 'Business stability'];
  const subChip = (y, label) => `
    <rect x="640" y="${y}" width="500" height="40" rx="9" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="664" cy="${y + 20}" r="4.5" fill="${work}"/>
    <text x="682" y="${y + 26}" font-family="${sans}" font-size="18" fill="${ink}">${label}</text>`;
  const subList = subs.map((s, i) => subChip(232 + i * 50, s)).join('');

  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  ${frame}
  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">DeepReview</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Vendor security intelligence — passive OSINT, evidence-first</text>
  ${flow}
  <text x="640" y="200" font-family="${serif}" font-size="24" fill="${ink}">Eight sub-scores → one A–F grade</text>
  ${subList}
  <text x="60" y="768" font-family="${sans}" font-size="15" fill="${faint}">Passive OSINT — public information only, for authorized use.</text>
  <text x="1140" y="768" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;
  await write('src/content/projects/deepreview/cover.png', svg);
}

console.log('done');
