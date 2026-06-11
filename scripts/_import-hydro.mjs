// One-off: import + web-optimize hydroponics photos (printed towers + plants).
// Resize to max 1600px, auto-rotate EXIF, JPEG q82. Run: node scripts/_import-hydro.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'C:/Users/white/Downloads/OneDrive Jun 10 2026';

const jobs = [
  // Builds — the 3D-printed hydroponic towers
  ['20240520_204819.jpg', 'src/content/projects/hydro-towers/cover.jpg'],
  ['20240520_204712.jpg', 'src/content/projects/hydro-towers/system.jpg'],
  ['20240520_204856.jpg', 'src/content/projects/hydro-towers/netpots.jpg'],
  // Garden — plants growing (added to the existing hydroponics project)
  ['20250904_185243.jpg', 'src/content/projects/kratky-lettuce/towers-full.jpg'],
  ['20250904_185717.jpg', 'src/content/projects/kratky-lettuce/peppers.jpg'],
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
