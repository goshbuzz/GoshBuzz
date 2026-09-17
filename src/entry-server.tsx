import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './LanguageContext';
import { CartProvider } from './CartContext';
import { AppLayout } from './App';

/**
 * Hoist head tags out of the rendered body into the document <head>.
 *
 * With React 19 + renderToString the HelmetProvider context is not reliably
 * populated, so <Helmet> output (title, meta, canonical, JSON-LD) ends up
 * inside the #root body HTML — invisible to crawlers that only read <head>.
 * React 19 also hoists its automatic <link rel="preload"> tags to the top of
 * #root. All of these belong in <head>, so extract every head-producing tag
 * from the body HTML and return them for head injection. If the helmet
 * context IS populated (future React/helmet versions), the caller prefers it.
 */
function hoistHeadTags(appHtml: string): { bodyHtml: string; headTags: string } {
  const found: string[] = [];
  let html = appHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/g, (m) => (found.push(m), ''));
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    (m) => (found.push(m), ''),
  );
  html = html.replace(/<(meta|link)\b[^>]*?\/?>/g, (m) => (found.push(m), ''));

  const ordered = [
    ...found.filter((t) => t.startsWith('<title')),
    ...found.filter((t) => t.startsWith('<meta')),
    ...found.filter((t) => t.startsWith('<link')),
    ...found.filter((t) => t.startsWith('<script')),
  ];

  return { bodyHtml: html, headTags: ordered.join('\n') };
}

export function render(url: string) {
  const helmetContext: { helmet?: any } = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <LanguageProvider>
        <CartProvider>
          <MemoryRouter initialEntries={[url]}>
            <AppLayout />
          </MemoryRouter>
        </CartProvider>
      </LanguageProvider>
    </HelmetProvider>,
  );

  const { helmet } = helmetContext;

  const contextHead = [
    helmet?.title?.toString() || '',
    helmet?.meta?.toString() || '',
    helmet?.link?.toString() || '',
    helmet?.script?.toString() || '',
  ].filter(Boolean).join('\n');

  const { bodyHtml, headTags } = hoistHeadTags(appHtml);
  // Prefer the helmet context when it is populated; otherwise fall back to
  // the tags hoisted out of the body (current React 19 behaviour).
  const headHtml = contextHead || headTags;

  // Detect the NotFound page marker so callers (server.ts, prerender.js)
  // can return a real HTTP 404 status instead of a soft-404 (200).
  const notFound = bodyHtml.includes('data-gb-404="true"');

  return { html: bodyHtml, head: headHtml, status: notFound ? 404 : 200 };
}
