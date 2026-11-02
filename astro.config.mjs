// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build — Cloudflare Pages serves the contents of ./dist
export default defineConfig({
  site: 'https://jlwhite.ca',
  output: 'static',
  trailingSlash: 'ignore',
  // Astro 7 changed the default to 'jsx', which drops whitespace between
  // inline elements and text; keep the Astro 5 behaviour.
  compressHTML: true,
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
