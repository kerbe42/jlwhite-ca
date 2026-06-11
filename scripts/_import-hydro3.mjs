// One-off: more photos for the split makes — the tower's printed base flange,
// and tomatoes growing in the grow pods. Resize max 1600px, EXIF-rotate, q82.
// Run: node scripts/_import-hydro3.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'C:/Users/white/Downloads/OneDrive Jun 10 2026';

const jobs = [
  ['20240512_222357.jpg', 'src/content/projects/hydro-tower/basemount.jpg'],
  ['20250904_185422.jpg', 'src/content/projects/grow-pods/tomatoes.jpg'],
  ['20250904_185353.jpg', 'src/content/projects/grow-pods/canopy.jpg'],
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
