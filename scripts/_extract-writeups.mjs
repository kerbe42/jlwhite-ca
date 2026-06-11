// One-off: extract the workflow-produced writeups into content files.
// Usage: node scripts/_extract-writeups.mjs <path-to-workflow-output.json>
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const byKey = Object.fromEntries((data.result || []).map((r) => [r.key, r]));

const writeups = {
  'md2pdf-ssrf': 'src/content/writeups/md2pdf-ssrf.md',
  'medbay-ai-xss-llm': 'src/content/writeups/medbay-ai-xss-llm.md',
};

for (const [key, path] of Object.entries(writeups)) {
  const item = byKey[key];
  if (!item) {
    console.error('MISSING', key);
    continue;
  }
  writeFileSync(path, item.content, 'utf8');
  console.log(`wrote ${path} (${item.content.length} chars)`);
}

// Print the CV content so it can be reviewed/embedded.
if (byKey['cv']) {
  console.log('\n===== CV CONTENT =====\n');
  console.log(byKey['cv'].content);
}
