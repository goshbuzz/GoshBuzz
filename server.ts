import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { findProductByIdentifier, legacySlugAliases } from './src/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Works both from source (tsx server.ts) and from the esbuild bundle (dist/server.js)
const IS_BUNDLED = path.basename(__dirname) === 'dist';
const ROOT_DIR = IS_BUNDLED ? path.resolve(__dirname, '..') : __dirname;
const DIST_DIR = IS_BUNDLED ? __dirname : path.resolve(__dirname, 'dist');

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  let vite: any;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Allow preview hosts like https://{port}-{sandboxId}.e2b.app
        allowedHosts: true,
        hmr: {
          host: '0.0.0.0',
        },
      },
      appType: 'custom',
    });
  }

  // Explicit handler for IAB Tech Lab / Google AdMob app-ads.txt and ads.txt
  app.get('/app-ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const appAdsPath = path.join(ROOT_DIR, 'public', 'app-ads.txt');
    if (fs.existsSync(appAdsPath)) {
      return res.sendFile(appAdsPath);
    }
    const distPath = path.join(DIST_DIR, 'client', 'app-ads.txt');
    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    return res.status(200).send('google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0\n');
  });

  app.get('/ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const adsPath = path.join(ROOT_DIR, 'public', 'ads.txt');
    if (fs.existsSync(adsPath)) {
      return res.sendFile(adsPath);
    }
    return res.status(200).send('google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0\n');
  });

  // Serve static assets in production or mount Vite middleware in development FIRST
  if (!isProd && vite) {
    app.use(vite.middlewares);
  } else {
    // redirect:false so /blogs/news is NOT 301'd to /blogs/news/ (canonical URLs
    // have no trailing slash); index:false so directory hits fall through to SSR.
    app.use(express.static(path.join(DIST_DIR, 'client'), { index: false, redirect: false }));
    app.use(express.static(path.join(ROOT_DIR, 'public'), { index: false, redirect: false }));
  }

  // Pre-rendered HTML & SSR route handler for all page navigations
  app.get('*all', async (req, res, next) => {
    const rawUrl = req.originalUrl.split('?')[0];
    
    // Pass static asset requests (e.g., .css, .js, .png, .jpg, .ico, .svg, .json) to static middleware
    if (path.extname(rawUrl)) {
      return next();
    }

    const url = rawUrl.endsWith('/') && rawUrl.length > 1 ? rawUrl.slice(0, -1) : rawUrl;

    // 301 Permanent Redirects for canonical SEO compliance
    const legacyPageMap: Record<string, string> = {
      '/policies/privacy-policy': '/privacy-policy',
      '/policies/refund-policy': '/refund-policy',
      '/policies/delivery-policy': '/delivery-policy',
      '/policies/shipping-policy': '/delivery-policy',
      '/policies/terms-of-service': '/terms',
      '/pages/contact': '/contact',
      '/pages/about': '/about',
      '/pages/payment-guide': '/how-to-pay',
      '/pages/data-sharing-opt-out': '/privacy-policy',
      '/blogs/news/30-best-ways-to-earn-money-online-in-pakistan': '/collection/ideas',
      '/blogs/news/30-high-income-skills-to-master-in-2025': '/collection/skills',
    };
    if (legacyPageMap[url]) return res.redirect(301, legacyPageMap[url]);
    if (url === '/cart' || url === '/cart/') {
      return res.redirect(301, '/checkout');
    }
    if (url === '/collection/frontpage' || url === '/collection/frontpage/' || url === '/collections/frontpage' || url === '/collections/frontpage/') {
      return res.redirect(301, '/');
    }
    if (url === '/blogs' || url.startsWith('/blogs/news/tagged') || url.startsWith('/blogs/tagged') || url.startsWith('/blogs/tag')) {
      return res.redirect(301, '/blogs/news');
    }
    if (url.startsWith('/blogs/news/')) {
      const slug = url.replace(/^\/blogs\/news\//, '');
      const product = findProductByIdentifier(slug);
      if (product && product.slug && product.slug !== slug) {
        return res.redirect(301, `/blogs/news/${product.slug}`);
      }
    }
    if (url.startsWith('/products/') || url.startsWith('/product/')) {
      const slug = url.replace(/^\/(products|product)\//, '');
      const product = findProductByIdentifier(slug);
      const targetSlug = product ? product.slug : slug;
      return res.redirect(301, `/blogs/news/${targetSlug}`);
    }
    if (url === '/products' || url === '/product' || url === '/collections') {
      return res.redirect(301, '/');
    }
    if (url.startsWith('/collections/')) {
      const type = url.replace(/^\/collections\//, '');
      return res.redirect(301, `/collection/${type}`);
    }

    if (url === '/privacy') return res.redirect(301, '/privacy-policy');
    if (url === '/refund') return res.redirect(301, '/refund-policy');
    if (url === '/delivery' || url === '/shipping') return res.redirect(301, '/delivery-policy');
    if (url === '/about-us') return res.redirect(301, '/about');
    if (url === '/contact-us') return res.redirect(301, '/contact');
    if (url === '/terms-and-conditions' || url === '/terms-of-service' || url === '/tos') return res.redirect(301, '/terms');
    if (url === '/disclaimers') return res.redirect(301, '/disclaimer');

    // Functional (non-content) routes must never be indexed
    if (url === '/checkout') {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    try {
      if (isProd) {
        // Check for pre-rendered static HTML file first in dist/client/
        let prerenderedPath: string;
        if (url === '/') {
          prerenderedPath = path.join(DIST_DIR, 'client', 'index.html');
        } else {
          prerenderedPath = path.join(DIST_DIR, 'client' + url, 'index.html');
        }

        if (fs.existsSync(prerenderedPath)) {
          return res.sendFile(prerenderedPath);
        }

        // Pristine shell with placeholders (never the prerendered homepage copy)
        const templatePath = fs.existsSync(path.join(DIST_DIR, 'template.html'))
          ? path.join(DIST_DIR, 'template.html')
          : path.join(DIST_DIR, 'client', 'index.html');
        const template = fs.readFileSync(templatePath, 'utf-8');
        // @ts-ignore
        const serverEntry = await import(pathToFileURL(path.join(DIST_DIR, 'server', 'entry-server.js')).href);
        const { html, head, status } = serverEntry.render(url);

        const fullHtml = template
          .replace(`<!--head-outlet-->`, head || '')
          .replace(`<!--ssr-outlet-->`, html || '');

        // Return a real 404 status for unknown routes (soft-404 fix)
        return res.status(status || 200).set({ 'Content-Type': 'text/html' }).end(fullHtml);
      }

      // Development SSR rendering with live Vite transform
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
      const { html, head, status } = render(url);

      const fullHtml = template
        .replace(`<!--head-outlet-->`, head || '')
        .replace(`<!--ssr-outlet-->`, html || '');

      res.status(status || 200).set({ 'Content-Type': 'text/html' }).end(fullHtml);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('SSR Error for URL', url, ':', e);
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
