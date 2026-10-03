// Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver...). Run AFTER deploy:
//   node scripts/indexnow.js
// The key file must be reachable at https://goshbuzz.com/<KEY>.txt (it lives in /public).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'goshbuzz.com';
const KEY = 'b70769f36a3c5a982d8251d4e70d4eec';

const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf-8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
