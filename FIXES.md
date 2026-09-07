# SEO / Indexing Fixes — 2026-09-07

Fixes for the five Google Search Console reports (*Duplicate without user-selected canonical*, *Page with redirect*, *Excluded by 'noindex' tag*, *Soft 404*, *Crawled – currently not indexed*, all in "Validation failed" state on 2026-09-05) and for the AdSense rejection's technical side-effects.

## Root cause

`vercel.json` contained a catch-all rewrite of every non-file URL to `/index.html`. Because `dist/client/index.html` is overwritten at build time by the prerendered **homepage**, every unknown, deleted or un-prerendered URL (`/cart`, `/collection/frontpage`, `/policies/*`, `/pages/*`, old long blog slugs, random garbage) returned **HTTP 200 + homepage HTML + homepage canonical** → soft 404s, homepage duplicates and failed validations.

## Changes

| File | Change |
|---|---|
| `vercel.json` | **Removed the catch-all rewrite** (unknown URLs now get a real 404 + custom `404.html`). Added 301s: `/cart`→`/checkout`, `/collection/frontpage` & `/collections/frontpage`→`/`, `/policies/*`→new policy paths, `/pages/contact`→`/contact`, `/pages/payment-guide`→`/how-to-pay`, `/pages/data-sharing-opt-out`→`/privacy-policy`. Added `X-Robots-Tag: noindex, nofollow` header for `/checkout`. |
| `scripts/prerender.js` | Prerenders `/checkout` (with noindex). Writes a pristine shell to `dist/template.html` (fixes SSR fallback inheriting the homepage `<head>`). Generates branded `dist/client/404.html` for static-host 404s. |
| `server.ts` | Returns the SSR status (404 for unknown routes) instead of always 200. Adds `/cart`, frontpage and `/policies|/pages` 301s. Sets `X-Robots-Tag` on `/checkout`. Fixes bundled-server path resolution (`dist/dist/...` bug) and disables serve-static trailing-slash redirects so canonical URLs stay slash-free. |
| `src/entry-server.tsx` | `render()` now returns `status: 404` when the NotFound marker (`data-gb-404`) is present. |
| `src/pages/NotFound.tsx` | Adds the `data-gb-404="true"` marker + keeps `noindex, nofollow`. |
| `src/pages/Product.tsx` | Unknown slug renders the shared `NotFound` (404 status + noindex) instead of an untagged 200 "Guide Not Found" block. |
| `src/pages/Collection.tsx` | `/collection/frontpage` → client-side redirect to `/`; unknown collection types → `NotFound` (404) instead of an empty list under a bogus canonical. |
| `src/pages/Blogs.tsx` | Legacy `?page=N` URLs (identical content to page 1) now emit `noindex, follow` while keeping the page-1 canonical. |
| `src/pages/Checkout.tsx` | Adds `noindex, nofollow` meta. |
| `src/components/SEO.tsx` | Canonical mapper learns `/collection/frontpage`→`/` and `/cart`→`/checkout`. |
| `public/robots.txt` | Adds `Disallow: /cart`. |

## Verified behaviour (local production build, 2026-09-07)

| URL | Before | After |
|---|---|---|
| `/xyz-does-not-exist` | 200 + homepage | **404** + branded 404 page, noindex |
| `/products/skill-21-…-earn-keep-grow` | 308 → 200 homepage shell | **301 → `/blogs/news/financial-literacy-freelancers`** (200, self-canonical) |
| `/products/idea-30-…-bubble-io` | 308 → homepage shell | **301 → `/blogs/news/no-code-saas`** |
| `/policies/privacy-policy`, `/pages/contact`, `/pages/payment-guide` | 200 homepage shell | **301 → new canonical paths** |
| `/cart` | 200 homepage shell | **301 → `/checkout`** (noindex + X-Robots-Tag) |
| `/collection(s)/frontpage` | 200 homepage shell | **301 → `/`** |
| `/blogs/news/tagged/*` | 308 | 301 → `/blogs/news` (unchanged intent) |
| `/blogs/news?page=3` | 200 index,follow | 200 **noindex,follow** + page-1 canonical |
| `/blogs/news/<unknown-slug>`, `/collection/<unknown>` | 200 untagged | **404 noindex** |

## Deployment & GSC runbook

1. Push/merge this branch → Vercel auto-deploys (`npm run build`, static output `dist/client`).
2. Smoke-test on the production URL: `curl -sI https://goshbuzz.com/xyz-does-not-exist` must show **404**; `curl -sI https://goshbuzz.com/products/skill-21-financial-literacy-masterclass-pakistan-freelancers-earn-keep-grow` must show **301 → /blogs/news/financial-literacy-freelancers**.
3. In GSC: Sitemaps → resubmit `sitemap.xml`.
4. Only after step 2 passes, open each of the five reports and click **Validate fix** (order: Soft 404 → Duplicate without user-selected canonical → Page with redirect → Excluded by noindex → Crawled not indexed). Expect 1–3 weeks per report; the noindex/redirect reports decay as URLs are recrawled.
5. Spot-check with URL Inspection: `/`, `/blogs/news`, one article, `/checkout` (should be "Page is not indexed: excluded by noindex"), `/cart` (redirect), one garbage URL (404).
6. AdSense: keep `ads.txt`; finish the content un-gating work (see audit) before re-applying.
