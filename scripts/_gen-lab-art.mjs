// One-off: generate Lab section cover art.
//  - network-lab/cover.jpg     : the old Cisco rack, web-optimized from the source photo
//  - home-lab-overview/cover.png : architecture diagram of the current 4-node Proxmox cluster
//  - edge-ai-bench/cover.png   : component diagram of the Raspberry Pi 5 + Hailo bench
// Diagrams use the warm-maker palette and are intentionally sanitized
// (no hostnames, addresses, or versions). Run: node scripts/_gen-lab-art.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'C:/Users/white/Downloads/OneDrive Jun 10 2026';

// Palette
const paper = '#fbf7ef';
const paper2 = '#f3ecdd';
const tint = '#fbf3ea';
const line = '#e3dccb';
const lineStrong = '#d8cdb4';
const ink = '#2c2c2a';
const muted = '#5f5e5a';
const faint = '#8a8780';
const lab = '#d85a30';
const builds = '#ba7517';
const serif = "Georgia, 'Times New Roman', serif";
const sans = 'Arial, Helvetica, sans-serif';

const out = (dest) => {
  mkdirSync(dirname(dest), { recursive: true });
  return dest;
};

// --- 1. Cisco rack photo -> network-lab/cover.jpg --------------------------
{
  const dest = out('src/content/projects/network-lab/cover.jpg');
  const info = await sharp(`${SRC}/Justin_Cisco_Lab.jpg`)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

// --- 2. Proxmox cluster diagram -> home-lab-overview/cover.png --------------
{
  const chip = (y, label) => `
    <rect x="660" y="${y}" width="480" height="64" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="688" cy="${y + 32}" r="6" fill="${lab}"/>
    <text x="710" y="${y + 40}" font-family="${sans}" font-size="20" fill="${ink}">${label}</text>`;

  const node = (x, y, n) => `
    <rect x="${x}" y="${y}" width="245" height="88" rx="10" fill="#ffffff" stroke="${lineStrong}" stroke-width="2"/>
    <text x="${x + 18}" y="${y + 38}" font-family="${serif}" font-size="21" fill="${ink}">node ${n}</text>
    <text x="${x + 18}" y="${y + 66}" font-family="${sans}" font-size="15" fill="${muted}">VMs · LXC · local storage</text>`;

  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="${paper}"/>
  <rect x="20" y="20" width="1160" height="760" rx="24" fill="none" stroke="${line}" stroke-width="2"/>

  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">The home lab</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Four-node Proxmox cluster · HA firewall · dual WAN</text>

  <!-- connectors (drawn first, behind boxes) -->
  <g stroke="${lineStrong}" stroke-width="2" fill="none">
    <path d="M135 206 V250"/>
    <path d="M315 206 V228 H185 V250"/>
    <path d="M185 322 V360"/>
    <path d="M325 410 V448"/>
  </g>

  <!-- WAN -->
  <rect x="60" y="158" width="150" height="48" rx="24" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="135" y="188" text-anchor="middle" font-family="${sans}" font-size="21" fill="${ink}">Fibre</text>
  <rect x="240" y="158" width="170" height="48" rx="24" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="325" y="188" text-anchor="middle" font-family="${sans}" font-size="21" fill="${ink}">Starlink</text>
  <text x="430" y="188" font-family="${sans}" font-size="18" fill="${faint}">dual WAN · failover</text>

  <!-- pfSense HA pair -->
  <rect x="60" y="250" width="250" height="72" rx="12" fill="#ffffff" stroke="${lab}" stroke-width="2.5"/>
  <text x="82" y="286" font-family="${serif}" font-size="22" fill="${ink}">pfSense</text>
  <text x="82" y="310" font-family="${sans}" font-size="16" fill="${muted}">active</text>
  <rect x="340" y="250" width="250" height="72" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
  <text x="362" y="286" font-family="${serif}" font-size="22" fill="${ink}">pfSense</text>
  <text x="362" y="310" font-family="${sans}" font-size="16" fill="${muted}">passive</text>
  <line x1="310" y1="286" x2="340" y2="286" stroke="${lab}" stroke-width="2.5" stroke-dasharray="4 3"/>
  <text x="325" y="244" text-anchor="middle" font-family="${sans}" font-size="14" fill="${lab}">HA</text>

  <!-- switch -->
  <rect x="60" y="360" width="530" height="50" rx="10" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="82" y="391" font-family="${sans}" font-size="20" fill="${ink}">Managed switch · VLAN-segmented LAN</text>

  <!-- cluster -->
  <rect x="60" y="448" width="560" height="260" rx="16" fill="${tint}" stroke="${line}" stroke-width="2"/>
  <text x="82" y="484" font-family="${serif}" font-size="24" fill="${ink}">Proxmox cluster</text>
  <text x="290" y="484" font-family="${sans}" font-size="16" fill="${faint}">clustered · quorate</text>
  ${node(80, 500, 1)}
  ${node(343, 500, 2)}
  ${node(80, 604, 3)}
  ${node(343, 604, 4)}

  <!-- service chips -->
  ${chip(158, 'DNS — redundant Pi-hole pair')}
  ${chip(240, 'Wi-Fi — UniFi controller + APs')}
  ${chip(322, 'Media — Plex · Audiobookshelf')}
  ${chip(404, 'Monitoring — Wazuh · Zabbix · Graylog')}
  ${chip(486, 'Automation — n8n Proxmox AI agent')}
  ${chip(568, 'Self-hosted — Docker · Ansible')}

  <text x="60" y="744" font-family="${sans}" font-size="15" fill="${faint}">Topology only — no hostnames, addresses, or versions.</text>
  <text x="1140" y="744" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;

  const dest = out('src/content/projects/home-lab-overview/cover.png');
  const info = await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

// --- 3. Edge-AI bench diagram -> edge-ai-bench/cover.png --------------------
{
  const part = (x, y, w, label) => `
    <rect x="${x}" y="${y}" width="${w}" height="64" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <circle cx="${x + 26}" cy="${y + 32}" r="6" fill="${builds}"/>
    <text x="${x + 46}" y="${y + 40}" font-family="${sans}" font-size="19" fill="${ink}">${label}</text>`;

  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="${paper}"/>
  <rect x="20" y="20" width="1160" height="760" rx="24" fill="none" stroke="${line}" stroke-width="2"/>

  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">Edge-AI and RF bench</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Raspberry Pi 5 + Hailo-8 · software-defined radio · sensors</text>

  <!-- connectors from board to parts -->
  <g stroke="${lineStrong}" stroke-width="2" fill="none">
    <path d="M335 245 C 420 260, 460 320, 470 360"/>
    <path d="M865 245 C 780 260, 740 320, 730 360"/>
    <path d="M340 432 H 430"/>
    <path d="M860 432 H 770"/>
    <path d="M335 620 C 420 605, 460 540, 470 500"/>
    <path d="M865 620 C 780 605, 740 540, 730 500"/>
  </g>

  <!-- central board -->
  <rect x="430" y="345" width="340" height="170" rx="16" fill="#ffffff" stroke="${builds}" stroke-width="3"/>
  <text x="600" y="405" text-anchor="middle" font-family="${serif}" font-size="30" fill="${ink}">Raspberry Pi 5</text>
  <text x="600" y="440" text-anchor="middle" font-family="${sans}" font-size="21" fill="${muted}">+ Hailo-8 AI hat · 26 TOPS</text>
  <text x="600" y="476" text-anchor="middle" font-family="${sans}" font-size="17" fill="${faint}">NVMe · Ubuntu Server · MQTT</text>

  <!-- parts -->
  ${part(80, 213, 290, 'SDR — PlutoSDR / LibreSDR')}
  ${part(830, 213, 290, 'MCUs — ESP32 · Pico W')}
  ${part(80, 400, 250, 'GNSS — GPS')}
  ${part(870, 400, 250, 'Audio — I²S capture')}
  ${part(80, 588, 300, 'Sensors — pH · EC · level')}
  ${part(820, 588, 300, 'Telemetry — MQTT · MicroPython')}

  <text x="60" y="744" font-family="${sans}" font-size="15" fill="${faint}">A learning bench — components and experiments, work in progress.</text>
  <text x="1140" y="744" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;

  const dest = out('src/content/projects/edge-ai-bench/cover.png');
  const info = await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

console.log('done');
