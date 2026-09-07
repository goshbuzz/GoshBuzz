import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './LanguageContext';
import { CartProvider } from './CartContext';
import { AppLayout } from './App';

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
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  const headHtml = [
    helmet?.title?.toString() || '',
    helmet?.meta?.toString() || '',
    helmet?.link?.toString() || '',
    helmet?.script?.toString() || '',
  ].filter(Boolean).join('\n');

  // Detect the NotFound page marker so callers (server.ts, prerender.js)
  // can return a real HTTP 404 status instead of a soft-404 (200).
  const notFound = appHtml.includes('data-gb-404="true"');

  return { html: appHtml, head: headHtml, status: notFound ? 404 : 200 };
}
