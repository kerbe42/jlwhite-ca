import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { getWriteups } from '../../lib/content';

export async function getStaticPaths() {
  const writeups = await getWriteups();
  return writeups.map((w) => ({
    params: { slug: w.slug },
    props: {
      title: w.data.title,
      room: w.data.room,
      platform: w.data.platform,
      difficulty: w.data.difficulty,
    },
  }));
}

function wrapText(text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const candidate = (cur + ' ' + word).trim();
    if (candidate.length > max && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ props }) => {
  const { title, room, platform, difficulty } = props as {
    title: string;
    room?: string;
    platform?: string;
    difficulty?: string;
  };

  const lines = wrapText(title, 24, 3);
  const fontSize = lines.length >= 3 ? 56 : lines.length === 2 ? 66 : 76;
  const blockH = lines.length * (fontSize + 14);
  const startY = 330 - blockH / 2 + fontSize;
  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="92" y="${Math.round(startY + i * (fontSize + 14))}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="#2c2c2a">${esc(l)}</text>`
    )
    .join('');

  const meta = [room ? `${platform ?? 'TryHackMe'}: ${room}` : platform, difficulty]
    .filter(Boolean)
    .join('   ·   ');

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf7ef" />
  <rect x="0" y="0" width="16" height="630" fill="#0f6e56" />
  <rect x="40" y="32" width="1128" height="566" rx="20" fill="none" stroke="#e3dccb" stroke-width="2" />
  <text x="92" y="128" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="3" fill="#0f6e56">WRITEUP</text>
  ${titleSvg}
  ${meta ? `<text x="92" y="512" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#5f5e5a">${esc(meta)}</text>` : ''}
  <rect x="92" y="540" width="64" height="64" rx="14" fill="#c0512a" />
  <text x="124" y="584" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" fill="#fbf7ef">JW</text>
  <text x="1128" y="128" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#888780">jlwhite.ca</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
