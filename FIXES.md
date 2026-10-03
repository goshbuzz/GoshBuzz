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

# GoshBuzz Network page + SEO head fix — 2026-09-16

## 1. New `/network` page — all subdomains listed as GoshBuzz modules

The Vercel team `goshbuzz` runs six sub-projects beside the core site. They
are now presented on a dedicated page (`goshbuzz.com/network`, aliases
`/modules`, `/goshbuzz-network`, `/platforms`) as the **modules of the
GoshBuzz Network**:

| Module | Address | Hosting |
|---|---|---|
| Little Learn | littlelearn.goshbuzz.com | goshbuzz.com subdomain |
| Proveli | proveli.goshbuzz.com | goshbuzz.com subdomain |
| Pakistan Tests Hub | pakistantestshub.goshbuzz.com | goshbuzz.com subdomain |
| FreeConvertio | www.freeconvertio.com | own domain — **a product of goshbuzz.com** |
| Young Scholars PK | youngscholarspk.goshbuzz.com | goshbuzz.com subdomain |
| Yellow Pages Pakistan | yellowpagespakistan.goshbuzz.com | goshbuzz.com subdomain |

- **Synced logos:** each card hot-links the module's live favicon
  (`https://<module-host>/favicon.ico`), so logos stay in sync with each
  property automatically. To pin official artwork, drop a file in
  `public/modules/` and set `logoFile` in `src/data/networkData.ts`
  (local file wins; a monogram renders as fallback if an image fails).
- **SEO / AEO / GEO pitch:** JSON-LD `@graph` (CollectionPage + ItemList,
  Organization with `sameAs` for every module, FAQPage, BreadcrumbList);
  a network FAQ that states each module is part of goshbuzz.com and that
  **FreeConvertio is a product of goshbuzz.com** (visible accordion and
  FAQPage schema use the same `networkFaqs` array, so they always agree);
  a structured "Where to find each module" directory table (quotable for
  answer engines); site-wide FAQ entry on the homepage; About-page section;
  header/footer nav links; sitemap entry (`/network`, daily, 0.9).
- Single source of truth: `src/data/networkData.ts` (edit a module there and
  page + schema + copy all update).
- `checkBuild` now also asserts head integrity on every page: `<title>` and
  `<link rel="canonical">` must be in `<head>`, no `<title>` in the body, and
  JSON-LD never body-only (see below — this guard is what caught that bug).

## 2. SSR head fix — `<Helmet>` output leaked into the body (all pages)

Found while verifying the new page: with React 19 + `renderToString`, the
`react-helmet-async` context is **not** populated, so every page's
`<title>`, meta description, canonical, Open Graph tags and JSON-LD were
rendered **inside `<div id="root">`** in the body instead of `<head>` —
invisible to crawlers that only read `<head>` (canonical, meta and FAQ schema
all effectively missing for SEO/AEO/GEO).

Fix in `src/entry-server.tsx`: `hoistHeadTags()` extracts every head tag
(`<title>`, `<meta>`, `<link>` (incl. React 19 auto-preloads),
`<script type="application/ld+json">`) out of the SSR body HTML and injects
it into `<!--head-outlet-->`; falls back to the helmet context if it ever
starts working again. Hydration is unaffected (Helmet renders null in the
body on both sides).

Verified on the local production build: 77/77 prerendered pages have
`<title>` + canonical in `<head>`, zero body leaks; `/` `/apps` `/network`
serve 200 with correct head, unknown routes serve 404.

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

---

# SEO / AEO / GEO audit pass — 2026-10-03

- **Titles/descriptions:** ~60 article pages had 450–650 char meta descriptions and 70–86 char titles (truncated in SERPs). Now generated via `src/utils/seoText.ts` (≤60 / ≤155 chars, cut at sentence/word boundary). Home, About, Contact, Blogs, Apps, Network, legal pages tightened.
- **Social tags:** `og:image` / `twitter:image` / `og:locale` added to Home, About, Contact, Blogs, Collections, Apps, App detail, Network and legal pages (legal pages now use the shared `<SEO>` component).
- **Entity consistency (GEO):** new `src/data/siteEntity.ts` defines ONE Organization (`GoshBuzz`), Founder and WebSite node, referenced by `@id` from every page. Removed "GoshBuzz LLC / Pakistan / Apps" variants and the "Solat"/"Saulat" Nadeem split (now `AUTHOR_NAME`; **confirm spelling**).
- **Schema:** BreadcrumbList on articles; Organization + Founder graph on articles/apps; homepage now has FAQPage (same Q&A as the visible FAQ), WebPage and full entity graph. Article dates come from shared constants.
- **Removed** hard-coded `aggregateRating` (`ratingCount: 540`) from the app schema — not backed by real review data and a structured-data policy risk. Re-add only with real, verifiable ratings.
- **`/llms.txt`:** generated at build from the same data as the site (guides by category, apps, network modules).
- **`robots.txt`:** explicit Allow for Googlebot, Bingbot and AI crawlers (OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended); `/checkout` and `/cart` stay disallowed.
- **Sitemap:** article `lastmod` now equals `BlogPosting.dateModified` (shared constant) instead of the build date on every URL. Bump `ARTICLE_DATE_MODIFIED` in `siteEntity.ts` when content changes.
- `index.html`: `theme-color`, sitemap and llms.txt discovery links.

Verified: `npm run typecheck`, `npm test` (21 pass), `npm run build` (77 pages) all green.

---

# Site-audit fix pass — 2026-10-03 (Ahrefs-style checks)

Ahrefs MCP was unavailable during this pass, so the same checks were run locally against `dist/client` (77 pages): titles, meta descriptions, H1, canonicals, broken links, orphans, images, sitemap, assets.

- **Images:** added `width`/`height` + `decoding="async"` to all content images (~550 `<img>` without dimensions → 0) to remove CLS warnings.
- **Meta descriptions:** 10 article descriptions were under 110 chars; now padded to a useful length and `clampDescription` no longer cuts at a short first sentence.
- **Titles:** Privacy, Delivery, Terms titles lengthened past 30 chars.
- **Share links:** X/Twitter link now `x.com/intent/post` (was a redirecting `twitter.com` URL); WhatsApp / Facebook / X share URLs are URL-encoded (were invalid with raw spaces).
- **Footer socials:** removed tracking params from TikTok and Quora links.
- **Internal links:** `/collection/ideas` and `/collection/skills` had a single inlink; added to the footer on every page.
- Result of local audit: 0 broken internal links, 0 orphans, 0 duplicate titles/H1s/descriptions, 0 missing alt/canonical/H1, all sitemap URLs resolve.

---

# Ahrefs Site Audit fixes — 2026-10-03 (report of 05:49 PM)

- **Broken images (10) — root cause found:** `goshbuzz_logo.jpg`, `favicon*.png`, `apple-touch-icon.png` and the four `dropship_*.png` in `public/` were corrupted (UTF-8 re-encoding replaced the binary bytes with U+FFFD; not recoverable from git). This also broke every `og:image`/favicon pointing at them. Regenerated the logo, all favicons, `favicon.ico` and the apple-touch icon from the valid logo in `src/assets/images/`. The 4 dropship images were unrecoverable; replaced with simple branded illustrations — **swap in real product photos when available**.
- **Image file size too large (5):** dropship images (1.4–1.6 MB each) are now ~7 KB; logo 946 KB → 90 KB; bundled EMF banner/icon/logo images shrunk to under 100 KB each.
- **Only one dofollow incoming internal link (42):** every article linked to the same first 4 guides, so the other ~56 got a single link. "Explore more" now rotates through the catalogue; every article has at least 5 inlinks.
- **IndexNow (74 changed pages):** added key file `public/b70769f36a3c5a982d8251d4e70d4eec.txt`, `scripts/indexnow.js` (run `node scripts/indexnow.js` after each deploy; optional GitHub Action template kept outside the repo).
- Schema.org validation of all JSON-LD on goshbuzz.com against the current schema.org vocabulary: 0 errors.
