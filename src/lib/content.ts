import { getCollection, type CollectionEntry } from 'astro:content';

const isProd = import.meta.env.PROD;

// Strip a trailing "/index" so folder-per-project ids become clean slugs.
export function toSlug(id: string): string {
  return id.replace(/\/?index$/, '');
}

export type ProjectItem = {
  slug: string;
  data: CollectionEntry<'projects'>['data'];
  entry: CollectionEntry<'projects'>;
  href: string;
};

export async function getProjects(world?: 'builds' | 'garden' | 'lab'): Promise<ProjectItem[]> {
  const all = await getCollection('projects', ({ data }) => !isProd || !data.draft);
  return all
    .filter((e) => (world ? e.data.world === world : true))
    .map((entry) => {
      const slug = toSlug(entry.id);
      return { slug, data: entry.data, entry, href: `/${entry.data.world}/${slug}` };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getFeaturedProjects(limit = 4): Promise<ProjectItem[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.data.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export type WriteupItem = {
  slug: string;
  data: CollectionEntry<'writeups'>['data'];
  entry: CollectionEntry<'writeups'>;
  href: string;
};

export async function getWriteups(): Promise<WriteupItem[]> {
  const all = await getCollection('writeups', ({ data }) => !isProd || !data.draft);
  return all
    .map((entry) => {
      const slug = toSlug(entry.id);
      return { slug, data: entry.data, entry, href: `/writeups/${slug}` };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// Group writeups by series, preserving newest-first order of first appearance.
export function groupBySeries(items: WriteupItem[]): { series: string; items: WriteupItem[] }[] {
  const groups = new Map<string, WriteupItem[]>();
  for (const item of items) {
    const key = item.data.series ?? item.data.title;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return [...groups.entries()].map(([series, list]) => ({
    series,
    items: list.sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0)),
  }));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}
