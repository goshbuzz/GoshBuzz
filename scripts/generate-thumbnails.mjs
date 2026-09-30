/**
 * Product / niche thumbnail pipeline.
 *
 *   npm i --no-save sharp lucide-static
 *   node scripts/generate-thumbnails.mjs [--ai <dir-with-raw-renders>] [--force]
 *
 * Output: public/thumbnails/<slug>.webp (800x800).
 *
 * 1. Every PNG/JPG in --ai <dir> named <slug>.png is converted to an optimised
 *    WebP (these are the AI-rendered, content-specific catalogue images).
 * 2. Every slug in THUMBS that still has no WebP gets a branded, content-
 *    specific fallback composed from Lucide icons in the same amber/indigo
 *    palette. Existing WebPs are never overwritten unless --force is passed,
 *    so AI renders always win over fallbacks (pass --ai again with --force to
 *    rebuild fallbacks without clobbering renders).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/thumbnails');
const ICONS = path.join(ROOT, 'node_modules/lucide-static/icons');
const SIZE = 800;

const args = process.argv.slice(2);
const aiDir = args.includes('--ai') ? path.resolve(args[args.indexOf('--ai') + 1]) : null;
const force = args.includes('--force');

/* slug -> [mainIcon, ...secondaryIcons], accent */
const THUMBS = {
  // 30 earning ideas
  'crypto-spot-trading-pakistan': [['bitcoin', 'candlestick-chart', 'coins', 'trending-up'], 'amber'],
  'blogging-adsense-blueprint': [['notebook-pen', 'laptop', 'coins', 'rss'], 'amber'],
  'ebay-dropshipping-guide': [['package', 'shopping-cart', 'truck', 'store'], 'amber'],
  'stock-market-investing-pakistan': [['trending-up', 'chart-column', 'landmark', 'piggy-bank'], 'emerald'],
  'print-on-demand-digital-products': [['shirt', 'palette', 'coffee', 'pen-tool'], 'rose'],
  'ai-chatbots-voice-bots': [['bot', 'headset', 'message-circle', 'audio-lines'], 'indigo'],
  'ad-management-agency': [['megaphone', 'target', 'chart-pie', 'mouse-pointer-click'], 'amber'],
  'faceless-youtube-automation': [['circle-play', 'clapperboard', 'mic-vocal', 'wand-sparkles'], 'rose'],
  'tool-websites': [['wrench', 'calculator', 'file-text', 'image'], 'indigo'],
  'freelancing-upwork': [['briefcase', 'laptop', 'star', 'globe'], 'emerald'],
  'amazon-va-services': [['package-search', 'headset', 'warehouse', 'search'], 'amber'],
  'daraz-affiliate-marketing': [['link', 'shopping-bag', 'smartphone', 'badge-percent'], 'rose'],
  'social-media-management': [['share-2', 'heart', 'calendar-days', 'thumbs-up'], 'indigo'],
  'online-course-creation': [['graduation-cap', 'video', 'book-open', 'presentation'], 'indigo'],
  'youtube-shorts-monetization': [['smartphone', 'circle-play', 'zap', 'coins'], 'rose'],
  'instagram-theme-pages': [['camera', 'heart', 'users-round', 'image'], 'rose'],
  'tiktok-creator-rewards': [['music-4', 'smartphone', 'gift', 'sparkles'], 'indigo'],
  'transcription-translation': [['languages', 'headphones', 'file-text', 'keyboard'], 'emerald'],
  'seo-services': [['search', 'map-pin', 'trending-up', 'globe'], 'emerald'],
  'canva-templates-etsy': [['layout-template', 'heart', 'palette', 'store'], 'rose'],
  'video-editing-freelance': [['film', 'scissors', 'monitor-play', 'sliders-horizontal'], 'indigo'],
  'youtube-thumbnail-design': [['image', 'mouse-pointer-click', 'brush', 'eye'], 'rose'],
  'ai-content-writing': [['pen-line', 'sparkles', 'file-text', 'brain'], 'indigo'],
  'amazon-kdp-publishing': [['book-open-text', 'book-heart', 'notebook-pen', 'coins'], 'amber'],
  'email-marketing-services': [['mail', 'send', 'users-round', 'chart-line'], 'indigo'],
  'wordpress-development': [['layout-dashboard', 'code-xml', 'monitor', 'blocks'], 'indigo'],
  'data-entry-lead-gen': [['table', 'database', 'keyboard', 'contact'], 'emerald'],
  'podcast-editing': [['podcast', 'audio-lines', 'headphones', 'mic'], 'rose'],
  'real-estate-cold-calling': [['phone-call', 'house', 'building-2', 'handshake'], 'amber'],
  'no-code-saas': [['blocks', 'rocket', 'repeat', 'credit-card'], 'indigo'],

  // 30 survival skills
  'sales-skill-mastery': [['handshake', 'trending-up', 'target', 'badge-dollar-sign'], 'amber'],
  'communication-skill-mastery': [['messages-square', 'mic', 'users-round', 'ear'], 'indigo'],
  'self-discipline-mastery': [['calendar-check', 'dumbbell', 'alarm-clock', 'flame'], 'rose'],
  'ai-fundamentals-mastery': [['brain-circuit', 'cpu', 'sparkles', 'bot'], 'indigo'],
  'crm-automation-mastery': [['workflow', 'users-round', 'zap', 'repeat'], 'emerald'],
  'quickbooks-financial-control': [['receipt', 'calculator', 'wallet', 'chart-pie'], 'emerald'],
  'excel-and-dashboards-mastery': [['sheet', 'chart-column', 'gauge', 'sigma'], 'emerald'],
  'data-analysis-mastery': [['chart-scatter', 'database', 'chart-pie', 'code-xml'], 'indigo'],
  'chatbot-voice-bot-development': [['bot-message-square', 'audio-waveform', 'message-circle', 'phone'], 'indigo'],
  'ai-powered-development': [['code-xml', 'sparkles', 'terminal', 'rocket'], 'indigo'],
  'copywriting-mastery': [['pen-tool', 'quote', 'mouse-pointer-click', 'mail'], 'amber'],
  'video-editing-mastery': [['clapperboard', 'film', 'palette', 'scissors'], 'rose'],
  'seo-keyword-research': [['search', 'key-round', 'link', 'trending-up'], 'emerald'],
  'graphic-design-mastery': [['palette', 'pen-tool', 'shapes', 'pipette'], 'rose'],
  'public-speaking-on-camera-confidence': [['mic-vocal', 'video', 'presentation', 'users-round'], 'amber'],
  'negotiation-tactics': [['handshake', 'scale', 'messages-square', 'badge-percent'], 'amber'],
  'email-marketing-mastery': [['mails', 'magnet', 'send', 'chart-line'], 'indigo'],
  'social-media-advertising': [['megaphone', 'target', 'smartphone', 'trending-up'], 'rose'],
  'content-strategy-mastery': [['calendar-range', 'lightbulb', 'layers', 'repeat'], 'amber'],
  'project-management-mastery': [['square-kanban', 'list-checks', 'users-round', 'calendar-days'], 'indigo'],
  'financial-literacy-freelancers': [['piggy-bank', 'wallet', 'trending-up', 'shield-check'], 'emerald'],
  'linkedin-networking-masterclass': [['network', 'user-round-check', 'briefcase', 'message-circle'], 'indigo'],
  'cold-outreach-mastery': [['send', 'mail-open', 'globe', 'reply'], 'amber'],
  'prompt-engineering-mastery': [['terminal-square', 'sparkles', 'brain', 'wand-sparkles'], 'indigo'],
  'web-scraping-mastery': [['bug', 'globe', 'database', 'download'], 'emerald'],
  'api-integration-mastery': [['plug', 'webhook', 'code-xml', 'credit-card'], 'indigo'],
  'ui-ux-design-principles': [['layout-panel-top', 'mouse-pointer-2', 'palette', 'smartphone'], 'rose'],
  'personal-branding-mastery': [['crown', 'user-round', 'star', 'megaphone'], 'amber'],
  'time-management-mastery': [['clock-4', 'calendar-clock', 'hourglass', 'list-checks'], 'amber'],
  'leadership-and-delegation-mastery': [['users-round', 'crown', 'git-fork', 'clipboard-list'], 'amber'],

  // Dropshipping niches (coming soon)
  'niche-flame-humidifier': [['flame', 'droplets', 'wind', 'sparkles'], 'amber'],
  'niche-magsafe-power-bank': [['battery-charging', 'magnet', 'smartphone', 'zap'], 'indigo'],
  'niche-mini-projector': [['projector', 'film', 'tv', 'sparkles'], 'indigo'],
  'niche-car-vacuum': [['car', 'wind', 'sparkles', 'battery-charging'], 'emerald'],
};

const ACCENTS = {
  amber: ['#fde68a', '#f59e0b', '#b45309'],
  indigo: ['#c7d2fe', '#818cf8', '#4338ca'],
  emerald: ['#a7f3d0', '#34d399', '#047857'],
  rose: ['#fecdd3', '#fb7185', '#be123c'],
};

function iconInner(name) {
  const file = path.join(ICONS, `${name}.svg`);
  if (!fs.existsSync(file)) throw new Error(`Missing lucide icon: ${name}`);
  const svg = fs.readFileSync(file, 'utf8');
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}

// deterministic pseudo random per slug
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

function tile({ x, y, size, icon, accent, stroke, id, main = false }) {
  const [light, mid, dark] = ACCENTS[accent];
  const r = size * 0.24;
  const iconSize = size * (main ? 0.52 : 0.5);
  const scale = iconSize / 24;
  const off = (size - iconSize) / 2;
  return `
  <g transform="translate(${x - size / 2} ${y - size / 2})">
    <rect x="${size * 0.04}" y="${size * 0.1}" width="${size}" height="${size}" rx="${r}" fill="#000" opacity="0.35" filter="url(#blur)"/>
    <rect width="${size}" height="${size}" rx="${r}" fill="url(#glass-${id})" stroke="url(#edge-${id})" stroke-width="${main ? 3 : 2}"/>
    <rect x="${size * 0.06}" y="${size * 0.05}" width="${size * 0.88}" height="${size * 0.38}" rx="${r * 0.8}" fill="#fff" opacity="0.07"/>
    <defs>
      <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${main ? dark : '#1e1b4b'}" stop-opacity="${main ? 0.95 : 0.9}"/>
        <stop offset="1" stop-color="#0b1020" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="edge-${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${light}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${mid}" stop-opacity="0.15"/>
      </linearGradient>
      <linearGradient id="ink-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="${light}"/>
      </linearGradient>
    </defs>
    <g transform="translate(${off} ${off}) scale(${scale})" fill="none" stroke="url(#ink-${id})"
       stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${accent})">
      ${iconInner(icon)}
    </g>
  </g>`;
}

function fallbackSvg(slug, icons, accent) {
  const rand = rng(slug);
  const [light, mid] = ACCENTS[accent];
  const S = 1024;
  let bokeh = '';
  for (let i = 0; i < 26; i++) {
    const cx = rand() * S, cy = rand() * S * 0.8, r = 4 + rand() * 38;
    const col = rand() > 0.45 ? '#fbbf24' : light;
    bokeh += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" opacity="${(0.06 + rand() * 0.22).toFixed(2)}"/>`;
  }
  const [main, a, b, c] = icons;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="bg" cx="0.18" cy="0.12" r="1.1">
      <stop offset="0" stop-color="#b7791f"/>
      <stop offset="0.35" stop-color="#4a2c5e"/>
      <stop offset="0.75" stop-color="#1e1b4b"/>
      <stop offset="1" stop-color="#0b1020"/>
    </radialGradient>
    <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${mid}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${mid}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    ${Object.keys(ACCENTS).map((k) => `<filter id="glow-${k}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="0.6" result="b"/><feFlood flood-color="${ACCENTS[k][1]}" flood-opacity="0.9"/>
      <feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`).join('')}
  </defs>
  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <g filter="url(#soft)">${bokeh}</g>
  <ellipse cx="512" cy="520" rx="420" ry="360" fill="url(#spot)"/>
  <rect y="${S * 0.62}" width="${S}" height="${S * 0.38}" fill="url(#floor)"/>
  <ellipse cx="512" cy="830" rx="330" ry="46" fill="#000" opacity="0.45" filter="url(#blur)"/>
  ${tile({ x: 215, y: 330, size: 190, icon: a, accent, stroke: 1.6, id: 'a' })}
  ${tile({ x: 815, y: 300, size: 170, icon: b, accent, stroke: 1.6, id: 'b' })}
  ${tile({ x: 800, y: 700, size: 200, icon: c, accent, stroke: 1.6, id: 'c' })}
  ${tile({ x: 480, y: 560, size: 400, icon: main, accent, stroke: 1.5, id: 'm', main: true })}
</svg>`;
}

fs.mkdirSync(OUT, { recursive: true });
let ai = 0, fb = 0, skipped = 0;
const fromAi = new Set();

if (aiDir && fs.existsSync(aiDir)) {
  for (const f of fs.readdirSync(aiDir)) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const slug = f.replace(/\.[^.]+$/, '');
    await sharp(path.join(aiDir, f)).resize(SIZE, SIZE, { fit: 'cover' }).webp({ quality: 78 }).toFile(path.join(OUT, `${slug}.webp`));
    fromAi.add(slug);
    ai++;
  }
}

for (const [slug, [icons, accent]] of Object.entries(THUMBS)) {
  const out = path.join(OUT, `${slug}.webp`);
  if (fromAi.has(slug) || (fs.existsSync(out) && !force)) { skipped++; continue; }
  const svg = fallbackSvg(slug, icons, accent);
  await sharp(Buffer.from(svg)).resize(SIZE, SIZE).webp({ quality: 82 }).toFile(out);
  fb++;
}

console.log(`thumbnails: ${ai} AI renders converted, ${fb} fallbacks generated, ${skipped} kept`);
