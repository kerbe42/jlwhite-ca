// One-off: import + web-optimize selected project photos from the OneDrive folder.
// Resizes to max 1600px, auto-rotates EXIF, JPEG q82. Run: node scripts/_import-photos.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'C:/Users/white/Downloads/OneDrive Jun 10 2026';

const jobs = [
  // Builds — 3D prints
  ['20240319_175747.jpg', 'src/content/projects/print-farm/cover.jpg'],
  ['20241130_095305.jpg', 'src/content/projects/print-farm/salmon.jpg'],
  ['1000001779.jpg', 'src/content/projects/print-farm/rocket.jpg'],
  // PicoPH — new build
  ['20241207_193057.jpg', 'src/content/projects/picoph/cover.jpg'],
  ['20241207_090934.jpg', 'src/content/projects/picoph/breadboard.jpg'],
  ['20241208_165257.jpg', 'src/content/projects/picoph/installed.jpg'],
  // Garden — hydroponics
  ['20241208_165059.jpg', 'src/content/projects/kratky-lettuce/cover.jpg'],
  ['20231219_174047.jpg', 'src/content/projects/kratky-lettuce/lettuce.jpg'],
  ['20230918_080232.jpg', 'src/content/projects/kratky-lettuce/tower.jpg'],
  ['20231211_184819.jpg', 'src/content/projects/kratky-lettuce/harvest.jpg'],
  // Lab — networking
  ['Justin_Cisco_Lab.jpg', 'src/content/projects/home-lab-overview/cover.jpg'],
];

for (const [src, dest] of jobs) {
  mkdirSync(dirname(dest), { recursive: true });
  const info = await sharp(`${SRC}/${src}`)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}
console.log('done');
