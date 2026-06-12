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
  { label: 'Notes', href: '/notes' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'CV', href: '/cv' },
];

// The three "worlds" a project can belong to, each with its own accent.
// Accent hex values are drawn from the warm-maker palette.
export const WORLDS = {
  builds: { label: 'Builds', href: '/builds', accent: '#A56310', blurb: '3D printing and physical things I make.' },
  garden: { label: 'Garden', href: '/garden', accent: '#527F1B', blurb: 'Hydroponics — growing food without soil.' },
  lab: { label: 'Lab', href: '/lab', accent: '#C44E26', blurb: 'The home lab and the tech that runs on it.' },
  work: { label: 'Work', href: '/work', accent: '#3E6B8B', blurb: 'Software I build — platforms, tools, and this site.' },
} as const;

export type World = keyof typeof WORLDS;

// Security section accent (TryHackMe + writeups).
export const SECURITY_ACCENT = '#0F6E56';

// External profile links. Leave blank to hide; the site renders each only when set.
export const LINKS = {
  github: 'https://github.com/kerbe42',
  linkedin: 'https://www.linkedin.com/in/justinwhitenb/',
  tryhackme: 'https://tryhackme.com/p/kerbe42',
  credly: 'https://www.credly.com/users/justin-white',
};

// TryHackMe profile. The auto-generated S3 badge went stale (it under-reported
// rank, badges, and streak), so these stats are kept by hand from the live
// profile and the card links out to it for the current numbers.
export const THM = {
  url: 'https://tryhackme.com/p/kerbe42',
  user: 'kerbe42',
  tier: 'Legend · top 1%',
  stats: [
    { label: 'Rooms', value: '252' },
    { label: 'Badges', value: '45' },
    { label: 'Day streak', value: '112' },
  ],
};

// CV / credentials — formal entries. Empty arrays are simply omitted from the page,
// so nothing fabricated is published; fill these in when you're ready.
export const CV: {
  certifications: string[];
  experience: { role: string; org: string; period: string; note?: string }[];
  education: string[];
} = {
  certifications: [
    'CISSP — Certified Information Systems Security Professional (ISC2)',
    'CISM — Certified Information Security Manager (ISACA)',
    'AAISM — Advanced in AI Security Management (ISACA)',
    'CompTIA Security+ (ce)',
    'CCNP Security (Cisco)',
    'CCNP Enterprise (Cisco)',
    'CCDP — Cisco Certified Design Professional',
    'JNCIS-SEC — Juniper Networks Certified Specialist, Security',
  ],
  experience: [
    {
      role: 'Director, Cybersecurity',
      org: 'Global seafood & aquaculture company',
      period: 'Oct 2025 – present',
      note: 'Accountable for the global cybersecurity posture across 17 countries and ~18,000 employees — security architecture, GRC, and security operations.',
    },
    {
      role: 'Senior Manager, IT Security',
      org: 'Global seafood & aquaculture company',
      period: 'Jan 2023 – Oct 2025',
      note: 'Built and operationalized the enterprise cybersecurity function spanning security architecture, GRC, and security operations.',
    },
    {
      role: 'Network & architecture roles',
      org: 'Global seafood & aquaculture company',
      period: 'Feb 2018 – Jan 2023',
      note: 'Senior IT Architect; Team Lead, Network Services; and Senior Network Analyst. Ran the enterprise network across 8 countries, built a disaster-recovery datacenter, handled secure network cutover for acquired companies, and replaced legacy wireless that couldn’t be secured.',
    },
    {
      role: 'Network Analyst → Senior Network Analyst',
      org: 'Diversified industrial conglomerate',
      period: '~2008 – Feb 2018',
      note: 'Led core and datacenter network redesign and segmentation, and served as network lead on security projects and major incident response.',
    },
  ],
  education: [],
};
