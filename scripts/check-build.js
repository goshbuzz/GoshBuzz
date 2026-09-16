import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Check the actual publish directory, not dist/server or the source tree. A
// successful SSR render alone does not prove that its CSS/images were deployed.
export function checkBuild(clientDir) {
  const root = path.resolve(clientDir);
  const htmlFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) htmlFiles.push(file);
    }
  }
  assert.ok(fs.existsSync(path.join(root, 'index.html')), 'Missing built homepage');
  assert.ok(fs.existsSync(path.join(root, '404.html')), 'Missing built 404 page');
  walk(root);

  const assets = new Set();
  for (const file of htmlFiles) {
    const name = path.relative(root, file);
    const html = fs.readFileSync(file, 'utf8');
    let hasStylesheet = false;
    let hasClientScript = false;
    for (const [tag] of html.matchAll(/<(?:link|script|img)\b[^>]*>/gi)) {
      const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)]
        .map(([, key, value]) => [key.toLowerCase(), value]));
      const isStylesheet = /^<link\b/i.test(tag) && attrs.rel === 'stylesheet';
      const isClientScript = /^<script\b/i.test(tag) && attrs.type === 'module';
      hasStylesheet ||= isStylesheet;
      hasClientScript ||= isClientScript && Boolean(attrs.src);
      // Canonicals and external resources are not files in the deployment.
      const url = attrs.src || (['stylesheet', 'icon', 'apple-touch-icon', 'preload', 'modulepreload'].includes(attrs.rel) ? attrs.href : null);
      if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) continue;
      assert.ok(!url.startsWith('/src/'), `${name}: unbuilt source URL ${url}`);
      const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
      const asset = pathname.startsWith('/')
        ? path.resolve(root, `.${pathname}`)
        : path.resolve(path.dirname(file), pathname);
      assert.ok(asset.startsWith(`${root}${path.sep}`), `${name}: asset outside publish directory: ${url}`);
      assert.ok(fs.existsSync(asset) && fs.statSync(asset).isFile(), `${name}: missing asset ${url}`);
      assert.ok(fs.statSync(asset).size > 0, `${name}: empty asset ${url}`);
      if (isStylesheet) {
        assert.ok(asset.endsWith('.css'), `${name}: stylesheet is not compiled CSS`);
        const css = fs.readFileSync(asset, 'utf8');
        assert.ok(!/@import\s+["']tailwindcss["']/.test(css), `${name}: Tailwind CSS was not compiled`);
      }
      assets.add(asset);
    }
    assert.ok(hasStylesheet, `${name}: no stylesheet linked`);
    assert.ok(hasClientScript, `${name}: no client module linked`);
  }
  return { pages: htmlFiles.length, assets: assets.size };
}

// Canonical host policy: the site lives on the apex domain (goshbuzz.com) and
// the www subdomain must 301 to it. A missing or mis-directed host rule (or a
// canonical that points at the subdomain) silently splits the index and can
// make one host serve a stale or unstyled deployment while the other does not.
export const CANONICAL_HOST = 'goshbuzz.com';
export const SUBDOMAIN_HOST = 'www.goshbuzz.com';

export function checkDomainConfig(rootDir) {
  const read = (file) => fs.readFileSync(path.join(rootDir, file), 'utf8');
  const config = JSON.parse(read('vercel.json'));
  const redirects = config.redirects ?? [];

  // Exactly one host-scoped rule, and it must come first: Vercel matches
  // redirects in array order (first match wins), so the www → apex rule has to
  // run before the path-specific legacy rules.
  const hostRules = redirects.filter((rule) => rule.has?.some((h) => h.type === 'host'));
  assert.equal(hostRules.length, 1, 'vercel.json must contain exactly one host-scoped redirect (www subdomain → apex domain)');
  assert.equal(redirects[0], hostRules[0], 'the www → apex host rule must be the first redirect so it wins over path rules');
  const [wwwRule] = hostRules;
  assert.deepEqual(
    wwwRule.has,
    [{ type: 'host', value: SUBDOMAIN_HOST }],
    'the host rule must match only the www subdomain',
  );
  assert.equal(wwwRule.source, '/:path*', 'the www → apex rule must cover every path');
  assert.equal(
    wwwRule.destination,
    `https://${CANONICAL_HOST}/:path*`,
    'the www subdomain must 301 to the canonical apex domain, not to itself',
  );
  assert.equal(wwwRule.permanent, true, 'the www → apex redirect must be a permanent 301');

  // Every canonical reference in the repo must use the apex domain, otherwise
  // Google would see the same page under two hosts (duplicate content).
  const seo = read('src/components/SEO.tsx');
  const baseUrl = seo.match(/export const BASE_URL = '([^']+)'/)?.[1];
  assert.equal(baseUrl, `https://${CANONICAL_HOST}`, 'SEO BASE_URL must be the canonical apex domain');
  assert.ok(!seo.includes(SUBDOMAIN_HOST), 'the SEO component must not reference the www subdomain');

  const sitemap = read('public/sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length > 0, 'sitemap.xml must list URLs');
  const assertApexUrl = (raw, what) => {
    const parsed = new URL(raw);
    assert.equal(parsed.protocol, 'https:', `${what} must use https: ${raw}`);
    assert.equal(parsed.host, CANONICAL_HOST, `${what} must use the apex domain, not a subdomain: ${raw}`);
  };
  for (const loc of locs) assertApexUrl(loc, 'sitemap URL');

  const robots = read('public/robots.txt');
  const sitemapLine = robots.match(/^Sitemap:\s*(\S+)\s*$/m);
  assert.ok(sitemapLine, 'robots.txt must reference the sitemap');
  assertApexUrl(sitemapLine[1], 'robots.txt Sitemap');

  return { canonical: `https://${CANONICAL_HOST}`, subdomain: `https://${SUBDOMAIN_HOST}`, sitemapUrls: locs.length };
}

export function checkDeployment(rootDir) {
  const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
  assert.equal(config.framework, null, 'Vercel must use the explicit static (Other) preset, not Express auto-detection');
  assert.equal(config.outputDirectory, 'dist/client', 'Vercel must publish the complete dist/client directory');
  const domain = checkDomainConfig(rootDir);
  const result = checkBuild(path.join(rootDir, config.outputDirectory));
  console.log(`✅ Verified ${result.pages} HTML pages and ${result.assets} local assets in the static deployment.`);
  console.log(`✅ Verified host config: ${domain.subdomain} 301 → ${domain.canonical}; ${domain.sitemapUrls} sitemap URLs on the apex domain.`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkDeployment(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
}
