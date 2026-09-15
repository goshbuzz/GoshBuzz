import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkBuild, checkDeployment } from './check-build.js';

const html = `<!doctype html><html><head>
<link rel="stylesheet" href="/assets/site-123.css">
<script type="module" src="/assets/site-123.js"></script>
<link rel="canonical" href="https://goshbuzz.com/about">
</head><body><img src="/assets/logo-123.jpg?v=4">
<img src="https://images.unsplash.com/example.jpg"></body></html>`;

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'goshbuzz-build-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const client = path.join(root, 'dist/client');
  fs.mkdirSync(path.join(client, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(client, 'blogs/news/example'), { recursive: true });
  fs.writeFileSync(path.join(client, 'assets/site-123.css'), '.flex{display:flex}');
  fs.writeFileSync(path.join(client, 'assets/site-123.js'), 'console.log("app")');
  fs.writeFileSync(path.join(client, 'assets/logo-123.jpg'), 'image fixture');
  for (const name of ['index.html', '404.html', 'blogs/news/example/index.html']) {
    fs.writeFileSync(path.join(client, name), html);
  }
  fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework: null, outputDirectory: 'dist/client' }));
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

test('requires an explicit static hosting preset', t => {
  const { root } = fixture(t);
  assert.doesNotThrow(() => checkDeployment(root));
  for (const framework of [undefined, 'express']) {
    fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify({ framework, outputDirectory: 'dist/client' }));
    assert.throws(() => checkDeployment(root), /static \(Other\) preset/);
  }
});
