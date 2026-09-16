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

---

# Addendum — second GSC batch reviewed 2026-09-07

| Report | Affected | What it means | Status after this fix |
|---|---|---|---|
| Duplicate, Google chose different canonical than user | 27 | Old `/blogs/news/tagged/*` pages declared a canonical but Google preferred `/blogs/news`. Last crawled May–Jun 2026 (pre-migration). | Tag URLs now **301 → /blogs/news** (vercel + server). Report decays as URLs are recrawled; re-run validation after deploy. |
| Discovered – currently not indexed | 69 | Google found the new-structure URLs (sitemap) but has **not crawled them yet** (Last crawled = N/A). Normal right after a migration + duplicate-heavy history; not a code bug. | Non-code actions: after deploy resubmit sitemap, request indexing (URL Inspection) for the 10 most important URLs, keep publishing/updating content, build internal links. Expect gradual crawl-over weeks 1–4. |
| Blocked by robots.txt | 3 | Shopify-era leftovers: `/cart/change?id=` (intentionally blocked — cart must stay out of the index), `/collections/e-books-collection?sort_by=…` and `/services/login_with_shop/…` (old Shopify endpoints). | `/cart/*` stays blocked by design. The other two now fall through to **301 → /collection/… → 404** and **404**, so they drop out of the report once recrawled. |
| Not found (404) | 6 | Two legacy product slugs without alias (`copywriting-words-…`, `no-code-saas-business-guide-bubble-io`), one www/http legacy chain, plus bot junk (`/${t}`, `/b`, `/v1/produce`). | Added missing aliases (`copywriting-words-…` → `copywriting-mastery`, etc.) + generated 301s; junk URLs correctly 404. |
| Alternate page with proper canonical tag | 10 | `tagged/*?page=1` and old `/products/…?variant=…&country=PK&currency=PKR` URLs whose canonical pointed elsewhere — Google **accepted** our canonical. Informational, not an error. | Variant/query URLs 301 via id rules (queries ignored); tagged URLs 301. Report decays. |

## Legacy redirect generation (new)

`scripts/gen-redirects.ts` regenerates the legacy-URL 301 block in `vercel.json`
from `src/data.ts` (product ids, slugs, `legacySlugAliases`) — 458 generated rules,
first-match-wins order: host rule → exact aliases → id wildcards (`/products/skill-21-:legacy*`)
→ manual wildcards. **Run `npx tsx scripts/gen-redirects.ts` whenever products are
added/renamed**, then commit `vercel.json`.

---

# Unstyled homepage / missing built assets — 2026-09-16

The reported screenshot shows server-rendered content without CSS and a broken
bundled logo, while an externally hosted photo loads. The local production build
contains the stylesheet, client JavaScript and hashed images, so changing layout
classes is not the appropriate fix.

## Deployment fix

- Set `framework: null` in `vercel.json` (Vercel's **Other/static** preset), keeping
  `npm run build` and `dist/client` as the build command and publish directory.
  This makes the intended static deployment explicit rather than relying on a
  dashboard preset or framework detection in a repo containing both Express and
  Vite. Vercel's Express adapter does not serve `express.static()` assets; see
  https://vercel.com/docs/frameworks/backend/express#serving-static-assets.
- Keep the existing redirects, cache headers and real static 404. Do not add a
  catch-all rewrite to the homepage: that can return HTML for missing CSS/JS and
  reintroduce the SEO soft-404 problem.
- Run `scripts/check-build.js` at the end of every build. It checks every generated
  HTML page (including nested pages and the 404) for stylesheet/client-module
  links, missing or empty local assets, source URLs and uncompiled Tailwind CSS.
  Regression tests run with `npm test`; an existing build can be rechecked with
  `npm run check:build`.

## Verification and rollout

`npm test` (10 tests), `npm run typecheck` and `npm run build` pass. The build
validator checks 76 HTML files and 14 distinct referenced local assets. A local
production Chromium smoke test verifies desktop (1568px) and mobile (390px)
layouts, CSS, logo loading, mobile navigation, nested pages and a real 404 with
no browser JavaScript errors. External ad/photo requests were excluded from
that local browser test.

Live asset responses and the active Vercel preset could not be inspected from
this environment, so the hosting-mode diagnosis still needs deployment
confirmation. These repository changes alone do not update the live website.

---

# Domain vs subdomain check — 2026-09-16

Question: does the unstyled-homepage issue live on the **domain** (apex) or the
**subdomain** (www) side? Both were checked live.

## Live DNS / edge check (2026-09-16)

| Host | Resolves to | Verdict |
|---|---|---|
| `goshbuzz.com` (domain) | A → `216.198.79.1` — Vercel anycast edge (AS16509, Vercel Inc.) | Serves the production site |
| `www.goshbuzz.com` (subdomain) | CNAME → `3103721f28a89b54.vercel-dns-017.com` → `64.29.17.65` / `216.198.79.65` (Vercel edge) | 301 → `https://goshbuzz.com/…` (host rule active) |

- **Neither host points at an external CDN or legacy hosting** — both go
  straight to Vercel, so the unstyled page is not caused by a domain/subdomain
  split. The apex (domain) is the canonical host; the subdomain only 301s to it.
- Canonical consistency in the repo: `BASE_URL` (`src/components/SEO.tsx`),
  all 74 `sitemap.xml` URLs, and `robots.txt` `Sitemap:` use
  `https://goshbuzz.com`; no code references `www.goshbuzz.com` except the
  `vercel.json` host redirect.

## Repo fix

`scripts/check-build.js` `checkDeployment` now also runs
`checkDomainConfig`, which fails the build if:

- `vercel.json` does not contain exactly one host-scoped rule, or it is not
  `www.goshbuzz.com` → `https://goshbuzz.com/:path*` **permanent**, or it is
  not the **first** redirect (order matters — first match wins);
- the www rule redirects to the subdomain itself (would keep two live hosts);
- `BASE_URL`, any `sitemap.xml` URL, or the `robots.txt` `Sitemap:` uses a
  subdomain instead of the apex (duplicate-content risk).

`npm test` covers all of these (18 tests). The domain part of the check runs
against the repo itself without a build: `node -e "import('./scripts/check-build.js').then(m=>console.log(m.checkDomainConfig(process.cwd())))"`.

## What still needs a dashboard check (not doable from the repo)

1. Vercel → project → **Domains**: both `goshbuzz.com` **and**
   `www.goshbuzz.com` must be attached and green. If www were missing, Vercel
   would serve its "domain not found" page on www instead of the 301.
2. **Framework preset = Other/static** (this is the actual fix for the
   unstyled page — `framework: null` in `vercel.json`), publishing
   `dist/client`.
3. Hard-reload with DevTools → Network → Disable cache to clear a cached
   unstyled page before concluding the deploy failed.

After merging and deploying this change in Vercel:

1. Confirm the deployment uses the **Other** preset and publishes **dist/client**.
2. Open the homepage with DevTools → Network → Disable cache, then reload.
3. Verify its `/assets/*.css`, `/assets/*.js` and logo requests return **200**,
   with CSS/JavaScript/image content types (not `text/html` or redirects).
4. Check desktop and mobile navigation, a direct article URL and an unknown URL
   (which must still return 404).
5. If assets still fail, inspect their actual response status and Vercel logs;
   also check dashboard domain redirects and any CDN outside Vercel. Do not
   change DNS records solely to address an unstyled but reachable page.
