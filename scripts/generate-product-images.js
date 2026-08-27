import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, 'public/products');

/* ------------------------------------------------------------------ *
 * Brand tokens — mirrored from src/index.css / Tailwind v4 palette
 * ------------------------------------------------------------------ */
const C = {
  bg: '#030712',        // gray-950
  surface: '#0b1220',
  border: '#1f2937',    // gray-800
  amber: '#f59e0b',     // amber-500
  amberLight: '#fbbf24', // amber-400
  indigo: '#6366f1',    // indigo-500
  emerald: '#10b981',   // emerald-500
  white: '#ffffff',
  muted: '#9ca3af',     // gray-400
  dim: '#6b7280',       // gray-500
};

const FONT = "'Segoe UI', 'Inter', Arial, Helvetica, sans-serif";

/* ------------------------------------------------------------------ *
 * Text measurement + wrapping.
 * librsvg has no auto-wrap, so lines are broken here using a
 * per-character advance table (fractions of the em square).
 * ------------------------------------------------------------------ */
const NARROW = new Set([...`iljI|!.,;:'\`()[]{}/\\ft`]);
const WIDE = new Set([...'mwMW@']);

function charWidth(ch, weightBoost) {
  let w;
  if (NARROW.has(ch)) w = 0.3;
  else if (WIDE.has(ch)) w = 0.88;
  else if (ch === ' ') w = 0.27;
  else if (ch >= '0' && ch <= '9') w = 0.6;
  else if (ch >= 'A' && ch <= 'Z') w = 0.68;
  else w = 0.54;
  return w * weightBoost;
}

function measure(text, fontSize, bold = true) {
  const boost = bold ? 1.06 : 1;
  let total = 0;
  for (const ch of text) total += charWidth(ch, boost);
  return total * fontSize;
}

function wrap(text, fontSize, maxWidth, maxLines, bold = true) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate, fontSize, bold) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);

  // Ellipsize the final line if we ran out of room.
  if (lines.length === maxLines) {
    const consumed = lines.join(' ').split(/\s+/).length;
    if (consumed < words.length) {
      let last = lines[maxLines - 1];
      while (last && measure(`${last}…`, fontSize, bold) > maxWidth) {
        last = last.slice(0, -1).trimEnd();
      }
      lines[maxLines - 1] = `${last}…`;
    }
  }
  return lines;
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/* ------------------------------------------------------------------ *
 * Stat extraction — turns prose article fields into short chip values
 * ------------------------------------------------------------------ */
function shortenNumber(raw) {
  const n = Number(String(raw).replace(/[^\d]/g, ''));
  if (!Number.isFinite(n) || n === 0) return null;
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

function compactAmount(text, fallback) {
  if (!text) return fallback;
  const str = String(text);

  if (/^\s*(rs\.?\s*)?0\b/i.test(str) || /\bfree\b/i.test(str) || /\bzero\b/i.test(str)) {
    return 'Rs 0';
  }

  const hasCurrency = /\$|rs\.?/i.test(str);

  // Percentage-denominated values (e.g. "3% to 8% target returns") must keep
  // their unit, otherwise "3–8" reads as a currency range.
  if (!hasCurrency) {
    const percents = str.match(/([\d][\d,.]*)\s*%/g);
    if (percents) {
      const vals = percents.map((p) => p.replace(/[^\d.,]/g, ''));
      return vals.length > 1 ? `${vals[0]}–${vals[1]}%` : `${vals[0]}%`;
    }
  }

  const currency = /\$/.test(str) ? '$' : /rs\.?/i.test(str) ? 'Rs ' : '';
  const numbers = (str.match(/[\d][\d,]*/g) || [])
    .map(shortenNumber)
    .filter(Boolean);

  if (!numbers.length) return fallback;
  const plus = /\+/.test(str) ? '+' : '';
  if (numbers.length === 1) return `${currency}${numbers[0]}${plus}`;
  return `${currency}${numbers[0]}–${numbers[1]}${plus}`;
}

function compactTime(text) {
  if (!text) return null;
  const str = String(text);
  // Decimals must stay intact — "1.5 hours" is one value, not a 1–5 range.
  const nums = str.match(/\d+(?:\.\d+)?/g);
  if (!nums) return null;

  const plural = /hour|hr/i.test(str) ? 'hrs' : /week/i.test(str) ? 'wks' : /month|mo\b/i.test(str) ? 'mo' : 'hrs';
  const singular = plural === 'hrs' ? 'hr' : plural === 'wks' ? 'wk' : 'mo';
  const per = /daily|per day|\/day/i.test(str) ? '/day' : /weekly/i.test(str) ? '/wk' : '';

  const isRange = nums.length > 1;
  const span = isRange ? `${nums[0]}–${nums[1]}` : nums[0];
  const unit = !isRange && Number(nums[0]) === 1 ? singular : plural;
  return `${span} ${unit}${per}`;
}

function buildStats(article) {
  if (!article) return [];
  return [
    { label: 'Start Cost', value: compactAmount(article.capitalNeeded, '—') },
    { label: 'Earning Potential', value: compactAmount(article.earningPotential, 'Variable') },
    { label: 'Level', value: article.difficulty || 'Beginner' },
    { label: 'Time', value: compactTime(article.timeRequired) || '1–2 hrs/day' },
  ];
}

/* ------------------------------------------------------------------ *
 * SVG building blocks
 * ------------------------------------------------------------------ */
function defs(accent) {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.bg}"/>
      <stop offset="55%" stop-color="#060c1a"/>
      <stop offset="100%" stop-color="${C.bg}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.75">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.6">
      <stop offset="0%" stop-color="${C.indigo}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${C.indigo}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="${accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${C.border}" stroke-opacity="0.35" stroke-width="1"/>
    </pattern>
  </defs>`;
}

function backdrop(w, h) {
  return `
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#glow2)"/>`;
}

function badge(x, y, text, accent) {
  const fontSize = 21;
  const padX = 18;
  const w = measure(text, fontSize) + padX * 2;
  const h = 44;
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="${h / 2}"
          fill="${accent}" fill-opacity="0.16" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
    <text x="${(x + w / 2).toFixed(1)}" y="${y + h / 2 + 7.5}" text-anchor="middle"
          font-family="${FONT}" font-size="${fontSize}" font-weight="700"
          letter-spacing="1.6" fill="${accent}">${esc(text)}</text>
  </g>`;
}

function wordmark(xRight, y) {
  const size = 26;
  return `
  <text x="${xRight}" y="${y}" text-anchor="end" font-family="${FONT}"
        font-size="${size}" font-weight="800" letter-spacing="-0.3">
    <tspan fill="${C.white}">Gosh</tspan><tspan fill="${C.amber}">Buzz</tspan>
  </text>`;
}

function statChips(stats, x, y, totalWidth, accent) {
  const gap = 16;
  const count = stats.length;
  const w = (totalWidth - gap * (count - 1)) / count;
  const h = 104;

  return stats
    .map((s, i) => {
      const cx = x + i * (w + gap);
      const valueSize = measure(s.value, 30) > w - 32 ? 24 : 30;
      return `
  <g>
    <rect x="${cx.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="18"
          fill="${C.surface}" fill-opacity="0.85" stroke="${C.border}" stroke-width="1.5"/>
    <text x="${(cx + 20).toFixed(1)}" y="${y + 34}" font-family="${FONT}" font-size="15"
          font-weight="700" letter-spacing="1.3" fill="${C.dim}">${esc(s.label.toUpperCase())}</text>
    <text x="${(cx + 20).toFixed(1)}" y="${y + 76}" font-family="${FONT}" font-size="${valueSize}"
          font-weight="800" fill="${i === 1 ? accent : C.white}">${esc(s.value)}</text>
  </g>`;
    })
    .join('');
}

/* ------------------------------------------------------------------ *
 * Card renderers
 * ------------------------------------------------------------------ */
function landscapeSvg({ number, kind, category, title, description, stats, accent }) {
  const W = 1200;
  const H = 630;
  const PAD = 68;
  const inner = W - PAD * 2;

  const titleSize = title.length > 34 ? 62 : 72;
  const titleLines = wrap(title, titleSize, inner, 2);
  const descLines = wrap(description, 25, inner - 40, 2, false);

  let y = PAD + 44;
  const badgeRow = `${badge(PAD, PAD, `${kind} #${String(number).padStart(2, '0')}`, accent)}${wordmark(W - PAD, PAD + 30)}`;

  y = PAD + 108;
  const kicker = `
  <text x="${PAD}" y="${y}" font-family="${FONT}" font-size="19" font-weight="700"
        letter-spacing="3" fill="${accent}" fill-opacity="0.85">${esc(category.toUpperCase())}</text>`;

  y += 26;
  const titleBlock = titleLines
    .map((line, i) => {
      y += titleSize * (i === 0 ? 1.0 : 1.1);
      return `
  <text x="${PAD}" y="${y}" font-family="${FONT}" font-size="${titleSize}" font-weight="800"
        letter-spacing="-1.6" fill="${i === titleLines.length - 1 && titleLines.length > 1 ? accent : C.white}">${esc(line)}</text>`;
    })
    .join('');

  // Description is anchored up from the stat chips so 1- and 2-line titles
  // both keep a consistent gap above the chip row.
  const chipsY = H - PAD - 104 - 18;
  const descBottom = chipsY - 34;
  const descBlock = descLines
    .map((line, i) => {
      const ly = descBottom - (descLines.length - 1 - i) * 34;
      return `
  <text x="${PAD}" y="${ly}" font-family="${FONT}" font-size="25" font-weight="400"
        fill="${C.muted}">${esc(line)}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(accent)}
  ${backdrop(W, H)}
  <rect x="0" y="0" width="${W}" height="6" fill="url(#rule)"/>
  ${badgeRow}
  ${kicker}
  ${titleBlock}
  ${descBlock}
  ${statChips(stats.slice(0, 3), PAD, chipsY, inner, accent)}
  <rect x="${PAD}" y="${H - 30}" width="${inner}" height="2" fill="url(#rule)"/>
</svg>`;
}

function squareSvg({ number, kind, category, title, description, stats, highlights, accent }) {
  const W = 1200;
  const H = 1200;
  const PAD = 84;
  const inner = W - PAD * 2;

  const titleSize = title.length > 30 ? 84 : 96;
  const titleLines = wrap(title, titleSize, inner, 3);
  const descLines = wrap(description, 30, inner, 2, false);

  const badgeRow = `${badge(PAD, PAD, `${kind} #${String(number).padStart(2, '0')}`, accent)}${wordmark(W - PAD, PAD + 32)}`;

  let y = PAD + 150;
  const kicker = `
  <text x="${PAD}" y="${y}" font-family="${FONT}" font-size="23" font-weight="700"
        letter-spacing="3.6" fill="${accent}" fill-opacity="0.85">${esc(category.toUpperCase())}</text>`;

  y += 40;
  const titleBlock = titleLines
    .map((line, i) => {
      y += titleSize * (i === 0 ? 1.0 : 1.08);
      return `
  <text x="${PAD}" y="${y}" font-family="${FONT}" font-size="${titleSize}" font-weight="800"
        letter-spacing="-2.4" fill="${i === titleLines.length - 1 && titleLines.length > 1 ? accent : C.white}">${esc(line)}</text>`;
    })
    .join('');

  y += 60;
  const descBlock = descLines
    .map((line, i) => `
  <text x="${PAD}" y="${y + i * 42}" font-family="${FONT}" font-size="30" font-weight="400"
        fill="${C.muted}">${esc(line)}</text>`)
    .join('');
  y += (descLines.length - 1) * 42;

  const chipsY = H - PAD - 104 - 40;

  // "Inside this guide" fills the mid-card gap with real chapter titles.
  let insideBlock = '';
  if (highlights.length) {
    const startY = y + 124;
    const rowGap = 54;
    const rows = highlights.slice(0, Math.max(0, Math.floor((chipsY - startY - 40) / rowGap)));
    insideBlock = `
  <text x="${PAD}" y="${startY - 42}" font-family="${FONT}" font-size="20" font-weight="700"
        letter-spacing="3" fill="${C.dim}">INSIDE THIS GUIDE</text>
  ${rows
    .map((item, i) => {
      const ly = startY + i * rowGap;
      const text = wrap(item, 28, inner - 54, 1, false)[0] || '';
      return `
  <rect x="${PAD}" y="${ly - 16}" width="10" height="10" rx="2" fill="${accent}"/>
  <text x="${PAD + 34}" y="${ly - 4}" font-family="${FONT}" font-size="28" font-weight="500"
        fill="#d1d5db">${esc(text)}</text>`;
    })
    .join('')}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(accent)}
  ${backdrop(W, H)}
  <rect x="0" y="0" width="${W}" height="8" fill="url(#rule)"/>
  ${badgeRow}
  ${kicker}
  ${titleBlock}
  ${descBlock}
  ${insideBlock}
  ${statChips(stats.slice(0, 2), PAD, chipsY, inner, accent)}
  <rect x="${PAD}" y="${H - 44}" width="${inner}" height="2" fill="url(#rule)"/>
</svg>`;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */
async function main() {
  const onlyType = process.argv.includes('--skills')
    ? 'skill'
    : process.argv.includes('--ideas')
      ? 'idea'
      : null;

  const { products } = await import(`file://${path.resolve(rootDir, 'src/data.ts')}`);
  const { articles } = await import(`file://${path.resolve(rootDir, 'src/data/articles.ts')}`);

  fs.mkdirSync(outDir, { recursive: true });

  const targets = onlyType ? products.filter((p) => p.type === onlyType) : products;

  // --audit prints every derived chip value next to its source string so
  // bad extractions are caught without eyeballing 60 PNGs.
  if (process.argv.includes('--audit')) {
    for (const product of targets) {
      const article = articles[product.id];
      if (!article) {
        console.log(`${product.slug}\n  !! no article — stats will be empty`);
        continue;
      }
      const stats = buildStats(article);
      console.log(product.slug);
      console.log(`  cost   "${article.capitalNeeded}"  ->  ${stats[0].value}`);
      console.log(`  earn   "${article.earningPotential}"  ->  ${stats[1].value}`);
      console.log(`  time   "${article.timeRequired}"  ->  ${stats[3].value}`);
    }
    return;
  }

  let done = 0;
  const manifest = [];

  for (const product of targets) {
    const isIdea = product.type === 'idea';
    const accent = isIdea ? C.amber : C.indigo;
    const number = Number(String(product.id).split('-')[1]) || done + 1;
    const article = articles[product.id];

    const model = {
      number,
      kind: isIdea ? 'IDEA' : 'SKILL',
      category: product.category,
      title: product.title,
      description: product.description,
      stats: buildStats(article),
      highlights: (article?.steps || []).map((s) => s.title).filter(Boolean),
      accent,
    };

    const landscape = landscapeSvg(model);
    const square = squareSvg(model);

    await sharp(Buffer.from(landscape))
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(outDir, `${product.slug}-og.png`));

    await sharp(Buffer.from(square))
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(outDir, `${product.slug}-sq.png`));

    manifest.push({
      id: product.id,
      slug: product.slug,
      image: `/products/${product.slug}-og.png`,
      imageSquare: `/products/${product.slug}-sq.png`,
    });

    done += 1;
    process.stdout.write(`\r  generated ${done}/${targets.length} — ${product.slug}`.padEnd(76));
  }

  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  process.stdout.write('\n');
  console.log(`✅ ${done} products × 2 sizes → public/products/`);
}

main().catch((error) => {
  console.error('\n❌ Image generation failed:', error);
  process.exit(1);
});
