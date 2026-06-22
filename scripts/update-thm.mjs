// Refreshes src/data/thm.json from the TryHackMe public profile.
//
// TryHackMe's JSON API sits behind a Vercel bot checkpoint, so a plain fetch
// gets a challenge page instead of data. We drive a real headless Chromium to
// the profile, which clears the checkpoint, and read the public-profile
// endpoint the profile app calls for itself.
//
// Fails loudly (non-zero exit) WITHOUT writing if anything looks wrong: a bad
// payload, a zero room count, or rooms/badges going backwards. A flaky scrape
// can never blank or regress the card, it just leaves the last good numbers in
// place and the GitHub Action goes red.

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const USER = 'kerbe42';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(SCRIPT_DIR, '..', 'src', 'data', 'thm.json');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function die(msg) {
  console.error('update-thm: ' + msg);
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
let data;
try {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const waitForProfile = page.waitForResponse(
    (r) => r.url().includes('/api/v2/public-profile?username=') && r.status() === 200,
    { timeout: 60000 },
  );
  await page.goto(`https://tryhackme.com/p/${USER}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const json = await (await waitForProfile).json();
  if (!json || json.status !== 'success' || !json.data) throw new Error('unexpected API payload');
  data = json.data;
} catch (e) {
  await browser.close().catch(() => {});
  die('scrape failed: ' + e.message);
}
await browser.close().catch(() => {});

const num = (v, name) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) die(`bad ${name}: ${v}`);
  return v;
};
const next = {
  rank: num(data.rank, 'rank'),
  topPercentage: num(data.topPercentage, 'topPercentage'),
  completedRooms: num(data.completedRoomsNumber, 'completedRooms'),
  badges: num(data.badgesNumber, 'badges'),
  streak: num(data.streak, 'streak'),
  level: num(data.level, 'level'),
  points: num(data.totalPoints, 'points'),
};
if (next.completedRooms <= 0) die('completedRooms is zero, refusing to publish');

let prev = null;
try {
  prev = JSON.parse(await readFile(OUT, 'utf8'));
} catch {
  /* first run, no prior file */
}

if (prev) {
  // Rooms and badges only ever climb; a drop means the source glitched.
  if (next.completedRooms < prev.completedRooms)
    die(`rooms regressed ${prev.completedRooms} -> ${next.completedRooms}, refusing`);
  if (next.badges < prev.badges) die(`badges regressed ${prev.badges} -> ${next.badges}, refusing`);

  const unchanged = ['rank', 'topPercentage', 'completedRooms', 'badges', 'streak', 'level', 'points'].every(
    (k) => prev[k] === next[k],
  );
  if (unchanged) {
    console.log('update-thm: no change.');
    process.exit(0);
  }
}

const out = { updatedAt: new Date().toISOString(), ...next };
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('update-thm: updated ->', JSON.stringify(next));
