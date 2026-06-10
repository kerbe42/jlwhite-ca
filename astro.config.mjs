// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build — Cloudflare Pages serves the contents of ./dist
export default defineConfig({
  site: 'https://jlwhite.ca',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
