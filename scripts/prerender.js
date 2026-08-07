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
  
  // Import the SSR bundle
  const serverEntryPath = path.resolve(rootDir, 'dist/server/entry-server.js');
  const { render } = await import(`file://${serverEntryPath}`);

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

  const staticRoutes = [
    '/',
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

  const blogRoutes = productSlugs.map(slug => `/blogs/news/${slug}`);

  const allRoutes = Array.from(new Set([...staticRoutes, ...blogRoutes]));

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

  // Generate clean sitemap.xml
  try {
    const sitemapModulePath = path.resolve(rootDir, 'src/utils/sitemap.ts');
    const { generateSitemapXml } = await import(`file://${sitemapModulePath}`);
    const sitemapXml = generateSitemapXml();

    const publicSitemapPath = path.resolve(rootDir, 'public/sitemap.xml');
    const distSitemapPath = path.resolve(rootDir, 'dist/client/sitemap.xml');

    fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
    fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
    console.log('🗺️ Clean sitemap.xml generated and updated in public/ and dist/client/!');
  } catch (err) {
    console.error('Failed to generate sitemap.xml during prerender:', err);
  }

  console.log(`✅ Successfully pre-rendered ${count}/${allRoutes.length} pages to dist/client/!`);
}

prerender();
