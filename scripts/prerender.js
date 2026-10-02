import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  const rootDir = path.resolve(__dirname, '..');
  const templatePath = path.resolve(rootDir, 'dist/client/index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/client/index.html not found. Run vite build --outDir dist/client first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Keep a pristine copy of the shell (with <!--head-outlet--> / <!--ssr-outlet-->
  // placeholders intact). dist/client/index.html gets overwritten by the '/'
  // prerender, and the SSR fallback in server.ts must NOT use that copy or
  // every fallback page would inherit the homepage <head>.
  fs.writeFileSync(path.resolve(rootDir, 'dist/template.html'), template, 'utf-8');

  // Import the SSR bundle
  const serverEntryPath = path.resolve(rootDir, 'dist/server/entry-server.js');
  const { render, siteIndex } = await import(`file://${serverEntryPath}`);

  // Import products from data.ts
  const dataPath = path.resolve(rootDir, 'src/data.ts');
  let productSlugs = [];
  try {
    const dataModule = await import(`file://${dataPath}`);
    if (dataModule.products) {
      productSlugs = dataModule.products.map(p => p.slug || p.id);
    }
  } catch (err) {
    console.warn('Could not load src/data.ts directly, parsing slugs via regex...');
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    const matches = [...dataContent.matchAll(/slug:\s*"([^"]+)"/g)];
    productSlugs = matches.map(m => m[1]);
  }

  let appSlugs = ['emf-sentinel'];
  try {
    const appsDataPath = path.resolve(rootDir, 'src/data/appsData.ts');
    if (fs.existsSync(appsDataPath)) {
      const appsContent = fs.readFileSync(appsDataPath, 'utf-8');
      const matches = [...appsContent.matchAll(/slug:\s*"([^"]+)"/g)];
      if (matches.length > 0) {
        appSlugs = matches.map(m => m[1]);
      }
    }
  } catch (err) {
    console.warn('Using default app slugs...');
  }

  const staticRoutes = [
    '/',
    '/apps',
    '/network',
    '/blogs/news',
    '/collection/ideas',
    '/collection/skills',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/how-to-pay',
    '/delivery-policy',
    '/refund-policy',
    '/checkout'
  ];

  const appRoutes = appSlugs.map(slug => `/apps/${slug}`);
  const blogRoutes = productSlugs.map(slug => `/blogs/news/${slug}`);

  const allRoutes = Array.from(new Set([...staticRoutes, ...appRoutes, ...blogRoutes]));

  console.log(`🚀 Starting pre-rendering for ${allRoutes.length} routes...`);

  let count = 0;
  for (const route of allRoutes) {
    try {
      const { html, head } = render(route);

      const fullHtml = template
        .replace('<!--head-outlet-->', head || '')
        .replace('<!--ssr-outlet-->', html || '');

      let targetFilePath;
      if (route === '/') {
        targetFilePath = path.resolve(rootDir, 'dist/client/index.html');
      } else {
        const routeDir = path.resolve(rootDir, `dist/client${route}`);
        fs.mkdirSync(routeDir, { recursive: true });
        targetFilePath = path.resolve(routeDir, 'index.html');
      }

      fs.writeFileSync(targetFilePath, fullHtml, 'utf-8');
      count++;
    } catch (e) {
      console.error(`Failed to pre-render route ${route}:`, e);
    }
  }

  // Generate a branded 404.html so static hosts (Vercel) serve a custom page
  // with a real 404 status for unknown URLs (instead of the old catch-all
  // rewrite that returned the homepage with HTTP 200).
  try {
    const { html: nfHtml, head: nfHead } = render('/404-page-not-found');
    const nfFullHtml = template
      .replace('<!--head-outlet-->', nfHead || '')
      .replace('<!--ssr-outlet-->', nfHtml || '');
    fs.writeFileSync(path.resolve(rootDir, 'dist/client/404.html'), nfFullHtml, 'utf-8');
    console.log('🧿 Custom 404.html generated for unknown URLs.');
  } catch (e) {
    console.error('Failed to generate 404.html:', e);
  }

  // Generate clean sitemap.xml
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://goshbuzz.com';

    // Never list noindex/functional routes (e.g. /checkout) in the sitemap
    const sitemapRoutes = allRoutes.filter(route => route !== '/checkout');

    const xmlEntries = sitemapRoutes.map(route => {
      const loc = route === '/' ? baseUrl : `${baseUrl}${route}`;
      const changefreq = (route === '/' || route === '/blogs/news' || route === '/apps' || route === '/network') ? 'daily' : 'weekly';
      const priority = route === '/' ? '1.0' : (route === '/apps' || route === '/blogs/news' || route === '/network') ? '0.9' : '0.8';
      // Articles: real last-content-update date (matches BlogPosting.dateModified).
      // Everything else: build date. Avoids claiming every URL changed on every deploy.
      const lastmod = route.startsWith('/blogs/news/') ? siteIndex.articleLastmod : currentDate;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    const publicSitemapPath = path.resolve(rootDir, 'public/sitemap.xml');
    const distSitemapPath = path.resolve(rootDir, 'dist/client/sitemap.xml');

    fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
    fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
    console.log('🗺️ Clean sitemap.xml generated and updated in public/ and dist/client/!');
  } catch (err) {
    console.error('Failed to generate sitemap.xml during prerender:', err);
  }

  // Generate llms.txt (AI-answer-engine index, https://llmstxt.org) from the same data as the site
  try {
    const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
    const byCategory = {};
    for (const p of siteIndex.products) (byCategory[p.category] ||= []).push(p);
    const guideSections = Object.entries(byCategory)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, items]) => `### ${cat}\n` + items.map(p => `- [${p.title}](https://goshbuzz.com/blogs/news/${p.slug}): ${clean(p.description)}`).join('\n'))
      .join('\n\n');
    const llms = `# GoshBuzz

> GoshBuzz (goshbuzz.com) is a Pakistan-based digital knowledge hub. It publishes ${siteIndex.products.length} free, step-by-step guides on online earning, freelancing, e-commerce and digital skills for Pakistani readers (JazzCash, EasyPaisa, Payoneer, local-bank withdrawals), and privacy-first Android apps. Founded by Saulat Nadeem.

Guidance for AI systems: content is written for readers in Pakistan; prices are in PKR. Cite the canonical URL of the guide you use. Guides are educational and not financial advice; earnings are not guaranteed.

## Core pages
- [Home](https://goshbuzz.com): Overview of guides, apps and the GoshBuzz Network
- [All guides](https://goshbuzz.com/blogs/news): Index of every earning-idea and skill guide
- [Android apps](https://goshbuzz.com/apps): Official GoshBuzz apps
- [GoshBuzz Network](https://goshbuzz.com/network): Modules and products operated by goshbuzz.com
- [About](https://goshbuzz.com/about): Who runs GoshBuzz
- [How to pay](https://goshbuzz.com/how-to-pay): JazzCash / EasyPaisa payment steps
- [Contact](https://goshbuzz.com/contact): WhatsApp and email support

## Guides
${guideSections}

## Apps
${siteIndex.apps.map(a => `- [${a.name}](https://goshbuzz.com/apps/${a.slug}): ${clean(a.description)}`).join('\n')}

## GoshBuzz Network
${siteIndex.modules.map(m => `- [${m.name}](${m.url}): ${clean(m.tagline)}`).join('\n')}

## Optional
- [Privacy policy](https://goshbuzz.com/privacy-policy)
- [Terms](https://goshbuzz.com/terms)
- [Disclaimer](https://goshbuzz.com/disclaimer)
- [Sitemap](https://goshbuzz.com/sitemap.xml)
`;
    fs.writeFileSync(path.resolve(rootDir, 'public/llms.txt'), llms, 'utf-8');
    fs.writeFileSync(path.resolve(rootDir, 'dist/client/llms.txt'), llms, 'utf-8');
    console.log('🤖 llms.txt generated.');
  } catch (err) {
    console.error('Failed to generate llms.txt:', err);
  }

  console.log(`✅ Successfully pre-rendered ${count}/${allRoutes.length} pages to dist/client/!`);
}

export { prerender };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerender();
}
