import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkBuild, checkDeployment, checkDomainConfig, CANONICAL_HOST, SUBDOMAIN_HOST } from './check-build.js';

const html = `<!doctype html><html><head>
<title>Test Page</title>
<link rel="stylesheet" href="/assets/site-123.css">
<script type="module" src="/assets/site-123.js"></script>
<link rel="canonical" href="https://goshbuzz.com/about">
</head><body><img src="/assets/logo-123.jpg?v=4">
<img src="https://images.unsplash.com/example.jpg"></body></html>`;

const wwwRedirect = {
  source: '/:path*',
  has: [{ type: 'host', value: SUBDOMAIN_HOST }],
  destination: `https://${CANONICAL_HOST}/:path*`,
  permanent: true,
};

const seoFile = `export const BASE_URL = 'https://${CANONICAL_HOST}';\n`;

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'goshbuzz-build-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const client = path.join(root, 'dist/client');
  fs.mkdirSync(path.join(client, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(client, 'blogs/news/example'), { recursive: true });
  fs.mkdirSync(path.join(root, 'public'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src/components'), { recursive: true });
  fs.writeFileSync(path.join(client, 'assets/site-123.css'), '.flex{display:flex}');
  fs.writeFileSync(path.join(client, 'assets/site-123.js'), 'console.log("app")');
  fs.writeFileSync(path.join(client, 'assets/logo-123.jpg'), 'image fixture');
  for (const name of ['index.html', '404.html', 'blogs/news/example/index.html']) {
    fs.writeFileSync(path.join(client, name), html);
  }
  fs.writeFileSync(path.join(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${CANONICAL_HOST}</loc></url>
  <url><loc>https://${CANONICAL_HOST}/blogs/news/example</loc></url>
</urlset>
`);
  fs.writeFileSync(path.join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${CANONICAL_HOST}/sitemap.xml\n`);
  fs.writeFileSync(path.join(root, 'src/components/SEO.tsx'), seoFile);
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client', redirects: [wwwRedirect] }));
  return { root, client };
}

test('checks assets on homepage, nested pages and 404; ignores external URLs', t => {
  const { client } = fixture(t);
  assert.deepEqual(checkBuild(client), { pages: 3, assets: 3 });
});

for (const asset of ['site-123.css', 'site-123.js', 'logo-123.jpg']) {
  test(`rejects missing deployed ${asset}`, t => {
    const { client } = fixture(t);
    fs.unlinkSync(path.join(client, 'assets', asset));
    assert.throws(() => checkBuild(client), /missing asset/);
  });
}

test('rejects empty CSS', t => {
  const { client } = fixture(t);
  fs.writeFileSync(path.join(client, 'assets/site-123.css'), '');
  assert.throws(() => checkBuild(client), /empty asset/);
});

test('rejects uncompiled Tailwind CSS', t => {
  const { client } = fixture(t);
  fs.writeFileSync(path.join(client, 'assets/site-123.css'), '@import "tailwindcss";');
  assert.throws(() => checkBuild(client), /Tailwind CSS was not compiled/);
});

for (const [label, content, error] of [
  ['missing stylesheet', html.replace(/<link rel="stylesheet"[^>]*>/, ''), /no stylesheet/],
  ['missing client script', html.replace(/<script.*?<\/script>/, ''), /no client module/],
  ['source URL', html.replace('/assets/site-123.css', '/src/index.css'), /unbuilt source URL/],
]) {
  test(`rejects ${label} on a nested page`, t => {
    const { client } = fixture(t);
    fs.writeFileSync(path.join(client, 'blogs/news/example/index.html'), content);
    assert.throws(() => checkBuild(client), error);
  });
}

for (const [label, content, error] of [
  ['title in body instead of head', html.replace('<title>Test Page</title>', '').replace('<body>', '<body><title>Test Page</title>'), /<title>/],
  ['title missing from head', html.replace('<title>Test Page</title>', ''), /<title> is not in <head>/],
  ['canonical missing from head', html.replace('<link rel="canonical" href="https://goshbuzz.com/about">', ''), /canonical link is not in <head>/],
]) {
  test(`rejects ${label}`, t => {
    const { client } = fixture(t);
    fs.writeFileSync(path.join(client, 'index.html'), content);
    assert.throws(() => checkBuild(client), error);
  });
}

test('requires an explicit static hosting preset', t => {
  const { root } = fixture(t);
  assert.doesNotThrow(() => checkDeployment(root));
  for (const framework of [undefined, 'express']) {
    fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework, outputDirectory: 'dist/client', redirects: [wwwRedirect] }));
    assert.throws(() => checkDeployment(root), /static \(Other\) preset/);
  }
});

test('verifies the www subdomain 301s to the canonical apex domain', t => {
  const { root } = fixture(t);
  assert.deepEqual(checkDomainConfig(root), {
    canonical: `https://${CANONICAL_HOST}`,
    subdomain: `https://${SUBDOMAIN_HOST}`,
    sitemapUrls: 2,
  });
});

test('rejects a vercel.json without the www → apex host rule', t => {
  const { root } = fixture(t);
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client' }));
  assert.throws(() => checkDomainConfig(root), /exactly one host-scoped redirect/);
});

test('rejects a www rule that redirects to the subdomain itself', t => {
  const { root } = fixture(t);
  const bad = { ...wwwRedirect, destination: `https://${SUBDOMAIN_HOST}/:path*` };
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client', redirects: [bad] }));
  assert.throws(() => checkDomainConfig(root), /canonical apex domain/);
});

test('rejects a temporary www → apex redirect', t => {
  const { root } = fixture(t);
  const bad = { ...wwwRedirect, permanent: false };
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client', redirects: [bad] }));
  assert.throws(() => checkDomainConfig(root), /permanent 301/);
});

test('rejects a www rule ordered after path-specific redirects', t => {
  const { root } = fixture(t);
  const alias = { source: '/products/idea-1', destination: '/blogs/news/crypto-spot-trading-pakistan', permanent: true };
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client', redirects: [alias, wwwRedirect] }));
  assert.throws(() => checkDomainConfig(root), /first redirect/);
});

test('rejects a sitemap URL served from the www subdomain', t => {
  const { root } = fixture(t);
  fs.writeFileSync(path.join(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${SUBDOMAIN_HOST}/blogs/news/example</loc></url>
</urlset>
`);
  assert.throws(() => checkDomainConfig(root), /apex domain, not a subdomain/);
});

test('rejects an SEO BASE_URL on the www subdomain', t => {
  const { root } = fixture(t);
  fs.writeFileSync(path.join(root, 'src/components/SEO.tsx'), `export const BASE_URL = 'https://${SUBDOMAIN_HOST}';\n`);
  assert.throws(() => checkDomainConfig(root), /BASE_URL/);
});

test('rejects a robots.txt sitemap on the www subdomain', t => {
  const { root } = fixture(t);
  fs.writeFileSync(path.join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${SUBDOMAIN_HOST}/sitemap.xml\n`);
  assert.throws(() => checkDomainConfig(root), /apex domain, not a subdomain/);
});
