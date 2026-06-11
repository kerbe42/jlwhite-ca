// One-off: import + web-optimize photos for the split hydroponic-print makes
// (the tower, and the grow pods). Resize max 1600px, EXIF-rotate, JPEG q82.
// Run: node scripts/_import-hydro2.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'C:/Users/white/Downloads/OneDrive Jun 10 2026';

const jobs = [
  // The tower
  ['20240520_204737.jpg', 'src/content/projects/hydro-tower/cover.jpg'],
  ['20240520_204720.jpg', 'src/content/projects/hydro-tower/installed.jpg'],
  ['20240520_204819.jpg', 'src/content/projects/hydro-tower/top.jpg'],
  ['20240520_204849.jpg', 'src/content/projects/hydro-tower/distributor.jpg'],
  // The grow pods
  ['20240520_204856.jpg', 'src/content/projects/grow-pods/cover.jpg'],
  ['20240520_204842.jpg', 'src/content/projects/grow-pods/detail.jpg'],
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
