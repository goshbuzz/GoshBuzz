import { products } from '../data.ts';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const BASE_URL = 'https://goshbuzz.com';

export const STATIC_ROUTES = [
  '/',
  '/apps',
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
  '/refund-policy'
];

export function generateSitemapUrls(): SitemapUrl[] {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls: SitemapUrl[] = STATIC_ROUTES.map((route) => {
    const loc = route === '/' ? BASE_URL : `${BASE_URL}${route}`;
    return {
      loc,
      lastmod: currentDate,
      changefreq: route === '/' || route === '/blogs/news' ? 'daily' : 'weekly',
      priority: route === '/' ? 1.0 : route === '/blogs/news' ? 0.9 : 0.7,
    };
  });

  const blogArticleUrls: SitemapUrl[] = products.map((product) => {
    const slug = product.slug || product.id;
    return {
      loc: `${BASE_URL}/blogs/news/${slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    };
  });

  return [...staticUrls, ...blogArticleUrls];
}

export function generateSitemapXml(): string {
  const urls = generateSitemapUrls();

  const xmlEntries = urls
    .map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}
