import rss from '@astrojs/rss';
import { SITE } from '../consts.ts';
import { getWriteups } from '../lib/content.ts';

export async function GET(context) {
  const writeups = await getWriteups();
  return rss({
    title: `${SITE.title} — Writeups`,
    description: 'Security writeups, home-lab notes, and things I break for practice.',
    site: context.site ?? SITE.url,
    items: writeups.map((w) => ({
      title: w.data.title,
      description: w.data.summary,
      pubDate: w.data.date,
      link: w.href,
      categories: w.data.tags,
    })),
    customData: `<language>en-ca</language>`,
  });
}
