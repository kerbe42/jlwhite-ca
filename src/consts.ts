// Site-wide configuration and shared constants.

export const SITE = {
  title: 'Justin White',
  tagline: 'Security tinkerer, maker, home-lab operator',
  description:
    'Things I build, grow, and break — 3D printing, hydroponics, a home lab, and security writeups.',
  url: 'https://jlwhite.ca',
  email: 'justin@jlwhite.ca',
  author: 'Justin White',
  ogImage: '/og.png',
};

// Primary navigation, in order.
export const NAV = [
  { label: 'Builds', href: '/builds' },
  { label: 'Garden', href: '/garden' },
  { label: 'Lab', href: '/lab' },
  { label: 'Writeups', href: '/writeups' },
  { label: 'About', href: '/about' },
];

// The three "worlds" a project can belong to, each with its own accent.
// Accent hex values are drawn from the warm-maker palette.
export const WORLDS = {
  builds: { label: 'Builds', href: '/builds', accent: '#BA7517', blurb: '3D printing and physical things I make.' },
  garden: { label: 'Garden', href: '/garden', accent: '#639922', blurb: 'Hydroponics — growing food without soil.' },
  lab: { label: 'Lab', href: '/lab', accent: '#D85A30', blurb: 'The home lab and the tech that runs on it.' },
} as const;

export type World = keyof typeof WORLDS;

// Security section accent (TryHackMe + writeups).
export const SECURITY_ACCENT = '#0F6E56';

// External profile links. Leave blank to hide; the site renders each only when set.
export const LINKS = {
  github: 'https://github.com/kerbe42',
  linkedin: 'https://www.linkedin.com/in/justinwhitenb/',
  tryhackme: 'https://tryhackme.com/p/kerbe42',
};

// TryHackMe public badge image (rank/points). Blank to hide.
export const THM_BADGE = 'https://tryhackme-badges.s3.amazonaws.com/kerbe42.png';

// CV / credentials — formal entries. Empty arrays are simply omitted from the page,
// so nothing fabricated is published; fill these in when you're ready.
export const CV: {
  certifications: string[];
  experience: { role: string; org: string; period: string; note?: string }[];
  education: string[];
} = {
  certifications: [],
  experience: [],
  education: [],
};
