/**
 * Generates the legacy-URL 301 rules for vercel.json from src/data.ts
 * (product ids, slugs and legacySlugAliases) so that Vercel's static
 * hosting performs the same mappings as server.ts / findProductByIdentifier.
 *
 * Usage: npx tsx scripts/gen-redirects.ts
 *
 * The generated block is inserted before the generic wildcard rules and is
 * tracked in scripts/generated-redirect-sources.json so re-running is clean.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products, legacySlugAliases } from '../src/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const vercelPath = path.resolve(rootDir, 'vercel.json');
const sidecarPath = path.resolve(__dirname, 'generated-redirect-sources.json');

interface RedirectRule {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: unknown;
}

const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
const existing: RedirectRule[] = vercel.redirects || [];
const previouslyGenerated: string[] = fs.existsSync(sidecarPath)
  ? JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'))
  : [];

// ---- build generated rules -------------------------------------------------
const generated: RedirectRule[] = [];
const generatedSources = new Set<string>();

function add(source: string, destination: string) {
  if (source === destination) return;
  if (generatedSources.has(source)) return;
  generatedSources.add(source);
  generated.push({ source, destination, permanent: true });
}

for (const p of products as Array<{ id: string; slug: string }>) {
  if (!p.id || !p.slug || p.id === p.slug) continue;
  add(`/products/${p.id}`, `/blogs/news/${p.slug}`);
  add(`/product/${p.id}`, `/blogs/news/${p.slug}`);
  add(`/blogs/news/${p.id}`, `/blogs/news/${p.slug}`);
}

for (const [alias, target] of Object.entries(legacySlugAliases)) {
  add(`/blogs/news/${alias}`, `/blogs/news/${target}`);
  add(`/products/${alias}`, `/blogs/news/${target}`);
  add(`/product/${alias}`, `/blogs/news/${target}`);
}

// Legacy Shopify-style ids were "<id>-<long-suffix>" (e.g. /products/skill-21-financial-...).
// Named-wildcard rules catch every remaining legacy suffix. They are added
// AFTER the exact alias rules above so re-numbered ids (idea-13, idea-6, ...)
// keep their correct alias destination (first match wins on Vercel).
for (const p of products as Array<{ id: string; slug: string }>) {
  if (!p.id || !p.slug) continue;
  add(`/products/${p.id}-:legacy*`, `/blogs/news/${p.slug}`);
  add(`/product/${p.id}-:legacy*`, `/blogs/news/${p.slug}`);
  add(`/blogs/news/${p.id}-:legacy*`, `/blogs/news/${p.slug}`);
}

// Deleted legacy articles whose closest live destination is a collection page
add('/blogs/news/30-best-ways-to-earn-money-online-in-pakistan', '/collection/ideas');
add('/blogs/news/30-high-income-skills-to-master-in-2025', '/collection/skills');

// ---- merge into vercel.json --------------------------------------------------
const prevSet = new Set(previouslyGenerated);
const manual = existing.filter((r) => !generatedSources.has(r.source) && !prevSet.has(r.source));

// Order: host-canonicalisation rule first, then specific generated rules,
// then remaining manual rules (generic wildcards + trailing-slash last).
const hostRule = manual.find((r) => Array.isArray(r.has));
const rest = manual.filter((r) => !Array.isArray(r.has));
vercel.redirects = [...(hostRule ? [hostRule] : []), ...generated, ...rest];

fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf-8');
fs.writeFileSync(sidecarPath, JSON.stringify([...generatedSources], null, 2) + '\n', 'utf-8');

console.log(`✅ vercel.json: ${manual.length} manual + ${generated.length} generated redirects (total ${vercel.redirects.length})`);
