// One-off: generate Lab section cover art.
//  - network-lab/cover.jpg     : the old Cisco rack, web-optimized from the source photo
//  - home-lab-overview/cover.png : architecture diagram of the current lab (Fortinet edge + 4-node Proxmox cluster)
//  - edge-ai-bench/cover.png   : component diagram of the Raspberry Pi 5 + Hailo bench
// Diagrams use the warm-maker palette and are intentionally sanitized
// (no hostnames, addresses, or versions). Run: node scripts/_gen-lab-art.mjs
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
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
// (skipped when the source photo folder isn't on this machine)
if (existsSync(SRC)) {
  const dest = out('src/content/projects/network-lab/cover.jpg');
  const info = await sharp(`${SRC}/Justin_Cisco_Lab.jpg`)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

// --- 2. Home lab topology -> home-lab-overview/cover.png -------------------
// Both WAN links are cabled into both FortiGates; fibre is drawn over Starlink
// at the one crossing, with a paper-coloured halo so the crossing reads as a gap.
{
  const fibre = builds;
  const starlink = '#0f6e56';

  const wan = (x, w, colour, label) => `
    <rect x="${x}" y="156" width="${w}" height="48" rx="24" fill="${paper2}" stroke="${colour}" stroke-width="2"/>
    <circle cx="${x + 30}" cy="180" r="6" fill="${colour}"/>
    <text x="${x + w / 2 + 10}" y="187" text-anchor="middle" font-family="${sans}" font-size="21" fill="${ink}">${label}</text>`;

  const fortigate = (x, role, stroke, width) => `
    <rect x="${x}" y="262" width="300" height="72" rx="12" fill="#ffffff" stroke="${stroke}" stroke-width="${width}"/>
    <text x="${x + 22}" y="294" font-family="${serif}" font-size="22" fill="${ink}">FortiGate 60F</text>
    <text x="${x + 22}" y="318" font-family="${sans}" font-size="16" fill="${muted}">${role}</text>`;

  const box = (x, y, w, title, sub, size) => `
    <rect x="${x}" y="${y}" width="${w}" height="80" rx="10" fill="#ffffff" stroke="${lineStrong}" stroke-width="2"/>
    <text x="${x + 16}" y="${y + 34}" font-family="${serif}" font-size="${size}" fill="${ink}">${title}</text>
    <text x="${x + 16}" y="${y + 58}" font-family="${sans}" font-size="14" fill="${muted}">${sub}</text>`;

  const card = (y, label, text) => `
    <rect x="740" y="${y}" width="400" height="84" rx="12" fill="#ffffff" stroke="${line}" stroke-width="2"/>
    <text x="762" y="${y + 32}" font-family="${sans}" font-size="13" letter-spacing="1.2" fill="${lab}">${label}</text>
    <text x="762" y="${y + 60}" font-family="${sans}" font-size="18" fill="${ink}">${text}</text>`;

  const cardY = [188, 297, 406, 515, 624];
  const cards = [
    ['DNS', 'Redundant Pi-hole pair'],
    ['MEDIA', 'Plex · Audiobookshelf · Transmission'],
    ['MONITORING', 'Wazuh · Zabbix · Graylog'],
    ['AUTOMATION', 'Ansible · n8n LLM ops agent'],
    ['APPS', 'Self-hosted Docker services'],
  ];

  const svg = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="${paper}"/>
  <rect x="20" y="20" width="1160" height="760" rx="24" fill="none" stroke="${line}" stroke-width="2"/>

  <text x="60" y="92" font-family="${serif}" font-size="44" fill="${ink}">The home lab</text>
  <text x="62" y="128" font-family="${sans}" font-size="22" fill="${muted}">Dual WAN into a FortiGate HA pair · four-node Proxmox cluster</text>

  <!-- WAN: each link feeds both firewalls. Starlink first, fibre drawn over it. -->
  <path d="M560 204 V244 M300 262 V244 H640 V262" stroke="${starlink}" stroke-width="2.5" fill="none"/>
  <path d="M460 230 V258" stroke="${paper}" stroke-width="10" fill="none"/>
  <path d="M240 204 V226 M120 262 V226 H460 V262" stroke="${fibre}" stroke-width="2.5" fill="none"/>
  ${wan(160, 160, fibre, 'Fibre')}
  ${wan(480, 160, starlink, 'Starlink')}

  <!-- FortiGate HA pair -->
  ${fortigate(60, 'primary', lab, 2.5)}
  ${fortigate(400, 'secondary', lineStrong, 2)}
  <line x1="360" y1="298" x2="400" y2="298" stroke="${lab}" stroke-width="2.5" stroke-dasharray="5 4"/>
  <text x="380" y="288" text-anchor="middle" font-family="${sans}" font-size="14" fill="${lab}">HA</text>
  <text x="380" y="318" text-anchor="middle" font-family="${sans}" font-size="14" fill="${lab}">sync</text>

  <!-- both firewalls uplink to the switch; switch feeds Wi-Fi and the cluster -->
  <g stroke="${lineStrong}" stroke-width="2" fill="none">
    <path d="M210 334 V372"/>
    <path d="M550 334 V372"/>
    <path d="M150 420 V458"/>
    <path d="M485 420 V458"/>
  </g>
  <text x="380" y="358" text-anchor="middle" font-family="${sans}" font-size="14" fill="${faint}">LAN uplinks</text>
  <text x="495" y="444" font-family="${sans}" font-size="14" fill="${faint}">VLAN trunks</text>

  <!-- switch -->
  <rect x="60" y="372" width="640" height="48" rx="10" fill="${paper2}" stroke="${line}" stroke-width="2"/>
  <text x="82" y="403" font-family="${serif}" font-size="21" fill="${ink}">FortiSwitch 248E</text>
  <text x="272" y="402" font-family="${sans}" font-size="17" fill="${muted}">VLAN-segmented LAN</text>

  <!-- Wi-Fi -->
  <rect x="60" y="458" width="180" height="250" rx="16" fill="${tint}" stroke="${line}" stroke-width="2"/>
  <text x="78" y="494" font-family="${serif}" font-size="22" fill="${ink}">Wi-Fi 6</text>
  ${box(76, 510, 148, 'FortiAP 231F', 'access point 1', 18)}
  ${box(76, 614, 148, 'FortiAP 231F', 'access point 2', 18)}

  <!-- Proxmox cluster -->
  <rect x="270" y="458" width="430" height="250" rx="16" fill="${tint}" stroke="${line}" stroke-width="2"/>
  <text x="290" y="494" font-family="${serif}" font-size="22" fill="${ink}">Proxmox cluster</text>
  <text x="682" y="494" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">quorate</text>
  ${box(288, 510, 189, 'node 1', 'VMs · local storage', 20)}
  ${box(493, 510, 189, 'node 2', 'VMs · local storage', 20)}
  ${box(288, 614, 189, 'node 3', 'VMs · local storage', 20)}
  ${box(493, 614, 189, 'node 4', 'VMs · local storage', 20)}

  <!-- what the cluster runs -->
  <text x="740" y="170" font-family="${sans}" font-size="14" letter-spacing="1.5" fill="${faint}">RUNS ON THE CLUSTER</text>
  <g stroke="${lineStrong}" stroke-width="2" fill="none">
    <path d="M700 583 H720 M720 ${cardY[0] + 42} V${cardY[4] + 42}"/>
    ${cardY.map((y) => `<path d="M720 ${y + 42} H740"/>`).join('')}
  </g>
  ${cards.map(([label, text], i) => card(cardY[i], label, text)).join('')}

  <text x="60" y="744" font-family="${sans}" font-size="15" fill="${faint}">Topology only. No hostnames, addresses, or versions.</text>
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
  ${part(80, 213, 290, 'SDR: PlutoSDR / LibreSDR')}
  ${part(830, 213, 290, 'MCUs: ESP32 · Pico W')}
  ${part(80, 400, 250, 'GNSS: GPS')}
  ${part(870, 400, 250, 'Audio: I²S capture')}
  ${part(80, 588, 300, 'Sensors: pH · EC · level')}
  ${part(820, 588, 300, 'Telemetry: MQTT · MicroPython')}

  <text x="60" y="744" font-family="${sans}" font-size="15" fill="${faint}">A learning bench: components and experiments, work in progress.</text>
  <text x="1140" y="744" text-anchor="end" font-family="${sans}" font-size="15" fill="${faint}">jlwhite.ca</text>
</svg>`;

  const dest = out('src/content/projects/edge-ai-bench/cover.png');
  const info = await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

console.log('done');
