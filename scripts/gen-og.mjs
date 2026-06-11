// Generates public/og.png — the default social-share card.
// Run with: node scripts/gen-og.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;

const dot = (x, color, label) => `
  <circle cx="${x}" cy="498" r="11" fill="${color}" />
  <text x="${x + 22}" y="505" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#5f5e5a">${label}</text>`;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#fbf7ef" />
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="20" fill="none" stroke="#e3dccb" stroke-width="2" />

  <rect x="84" y="96" width="86" height="86" rx="18" fill="#c0512a" />
  <text x="127" y="156" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="46" fill="#fbf7ef">JW</text>

  <text x="84" y="320" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#2c2c2a">Justin White</text>
  <text x="88" y="384" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#5f5e5a">Things I build, grow &amp; break</text>

  ${dot(88, '#ba7517', 'Builds')}
  ${dot(300, '#639922', 'Garden')}
  ${dot(520, '#d85a30', 'Lab')}
  ${dot(700, '#0f6e56', 'Writeups')}

  <text x="${W - 84}" y="172" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#888780">jlwhite.ca</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('wrote public/og.png');
