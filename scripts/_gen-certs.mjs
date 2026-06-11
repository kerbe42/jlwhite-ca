// One-off: pull the headline certification badges from the saved Credly JSON
// (_credly.json), optimize them to webp in public/certs/, and emit a manifest
// at src/data/certs.json for the CV badge grid. Run: node scripts/_gen-certs.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const d = JSON.parse(readFileSync('./_credly.json', 'utf8'));

// The headline certs (order = how they appear on the CV), matched by a unique
// substring of the Credly badge-template name.
const want = [
  { slug: 'cissp', label: 'CISSP', issuer: 'ISC2', match: 'CISSP' },
  { slug: 'cism', label: 'CISM', issuer: 'ISACA', match: '(CISM)' },
  { slug: 'aaism', label: 'AAISM', issuer: 'ISACA', match: 'AAISM' },
  { slug: 'security-plus', label: 'Security+', issuer: 'CompTIA', match: 'CompTIA Security+' },
  { slug: 'ccnp-security', label: 'CCNP Security', issuer: 'Cisco', match: 'CCNP Security' },
  { slug: 'ccnp-enterprise', label: 'CCNP Enterprise', issuer: 'Cisco', match: 'CCNP Enterprise' },
  { slug: 'ccdp', label: 'CCDP', issuer: 'Cisco', match: '(CCDP)' },
  { slug: 'jncis-sec', label: 'JNCIS-SEC', issuer: 'Juniper Networks', match: 'JNCIS-SEC' },
];

mkdirSync('public/certs', { recursive: true });
mkdirSync('src/data', { recursive: true });

const out = [];
for (const w of want) {
  const b = d.data.find((x) => x.badge_template.name.includes(w.match));
  if (!b) { console.log('MISSING', w.slug); continue; }
  const t = b.badge_template;
  const img = t.image_url || (t.image && t.image.url);
  const res = await fetch(img);
  if (!res.ok) { console.log('FETCH FAIL', w.slug, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = `public/certs/${w.slug}.webp`;
  const info = await sharp(buf)
    .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(dest);
  out.push({
    slug: w.slug,
    label: w.label,
    issuer: w.issuer,
    file: `/certs/${w.slug}.webp`,
    url: `https://www.credly.com/badges/${b.id}/public_url`,
  });
  console.log(w.slug, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

writeFileSync('src/data/certs.json', JSON.stringify(out, null, 2));
console.log('wrote src/data/certs.json with', out.length, 'badges');
