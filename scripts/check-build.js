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

export function checkDeployment(rootDir) {
  const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
  assert.equal(config.framework, null, 'Vercel must use the explicit static (Other) preset, not Express auto-detection');
  assert.equal(config.outputDirectory, 'dist/client', 'Vercel must publish the complete dist/client directory');
  const result = checkBuild(path.join(rootDir, config.outputDirectory));
  console.log(`✅ Verified ${result.pages} HTML pages and ${result.assets} local assets in the static deployment.`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkDeployment(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
}
