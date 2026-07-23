import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Pre-rendered HTML route handler for all non-file requests
  app.get('*all', async (req, res, next) => {
    const rawUrl = req.originalUrl.split('?')[0];
    
    // Pass static asset requests (e.g., .css, .js, .png, .jpg, .ico, .svg, .json) to static middleware
    if (path.extname(rawUrl)) {
      return next();
    }

    const url = rawUrl.endsWith('/') && rawUrl.length > 1 ? rawUrl.slice(0, -1) : rawUrl;

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
