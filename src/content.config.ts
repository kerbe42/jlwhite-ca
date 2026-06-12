import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projects: one entry per build / garden / lab item.
// Files live at src/content/projects/<slug>/index.md with photos co-located.
const projects = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      world: z.enum(['builds', 'garden', 'lab', 'work']),
      date: z.coerce.date(),
      summary: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

// Writeups: security walkthroughs, grouped into series.
const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    series: z.string().optional(),
    part: z.number().optional(),
    room: z.string().optional(),
    roomUrl: z.string().url().optional(),
    platform: z.string().default('TryHackMe'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane', 'Info']).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Field Notes: leadership essays and methodology playbooks. No employer
// specifics — principles and method only.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    kind: z.enum(['essay', 'playbook']).default('essay'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writeups, notes };
