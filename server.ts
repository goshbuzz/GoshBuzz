import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findProductByIdentifier, legacySlugAliases } from './src/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  let vite: any;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
  }

  // Explicit handler for IAB Tech Lab / Google AdMob app-ads.txt and ads.txt
  app.get('/app-ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const appAdsPath = path.resolve(__dirname, 'public/app-ads.txt');
    if (fs.existsSync(appAdsPath)) {
      return res.sendFile(appAdsPath);
    }
    const distPath = path.resolve(__dirname, 'dist/client/app-ads.txt');
    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    return res.status(200).send('google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0\n');
  });

  app.get('/ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const adsPath = path.resolve(__dirname, 'public/ads.txt');
    if (fs.existsSync(adsPath)) {
      return res.sendFile(adsPath);
    }
    return res.status(200).send('google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0\n');
  });

  // Pre-rendered HTML route handler for all non-file requests
  app.get('*all', async (req, res, next) => {
    const rawUrl = req.originalUrl.split('?')[0];
    
    // Pass static asset requests (e.g., .css, .js, .png, .jpg, .ico, .svg, .json) to static middleware
    if (path.extname(rawUrl)) {
      return next();
    }

    const url = rawUrl.endsWith('/') && rawUrl.length > 1 ? rawUrl.slice(0, -1) : rawUrl;

    // 301 Permanent Redirects for canonical SEO compliance
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

    try {
      // Check for pre-rendered static HTML file first in dist/client/
      let prerenderedPath: string;
      if (url === '/') {
        prerenderedPath = path.resolve(__dirname, 'dist/client/index.html');
        if (!fs.existsSync(prerenderedPath)) {
          prerenderedPath = path.resolve(__dirname, 'client/index.html');
        }
      } else {
        prerenderedPath = path.resolve(__dirname, `dist/client${url}/index.html`);
        if (!fs.existsSync(prerenderedPath)) {
          prerenderedPath = path.resolve(__dirname, `client${url}/index.html`);
        }
      }

      if (fs.existsSync(prerenderedPath)) {
        return res.sendFile(prerenderedPath);
      }

      let template: string;
      let render: (url: string) => { html: string; head: string };

      if (!isProd && vite) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'client/index.html'), 'utf-8');
        // @ts-ignore
        const serverEntry = await import('./server/entry-server.js');
        render = serverEntry.render;
      }

      const { html, head } = render(url);

      const fullHtml = template
        .replace(`<!--head-outlet-->`, head || '')
        .replace(`<!--ssr-outlet-->`, html || '');

      res.status(200).set({ 'Content-Type': 'text/html' }).end(fullHtml);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('SSR Error for URL', url, ':', e);
      next(e);
    }
  });

  if (!isProd && vite) {
    app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));
    app.use(express.static(path.resolve(__dirname, 'client'), { index: false }));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
