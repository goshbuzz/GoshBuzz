# Module logos — real logos synced with robust fallback

The /network page now shows REAL logos with a 4-layer fallback chain:

1. **Live PWA icons** (e.g. /icons/icon-512.svg, /icon-512.png, /logo.png) hot-linked
   from each module's own domain — so rebranding syncs automatically.
2. **Local high-res copy** in this folder (e.g. little-learn.png) — guaranteed to load
   even if live hot-link fails (CORS, 404, or Vercel SPA fallback).
3. **Google S2 favicon proxy** (https://www.google.com/s2/favicons?domain=...&sz=128)
   — highly reliable CDN fallback.
4. **Monogram initials** — final fallback (should rarely show now).

Each module in `src/data/networkData.ts` defines:
- `faviconUrl`: primary live logo (real PWA icon, not just favicon.ico)
- `liveLogoUrls`: additional live candidates
- `logoFile`: local file in /modules/ (e.g. "/modules/little-learn.png")

To update a logo: replace the file here and, if the live PWA path changed,
update `faviconUrl` / `liveLogoUrls` in `networkData.ts`.

Current files (generated Sep 2026, replace with official artwork when available):
- little-learn.png — Little Learn (lion, kids education)
- proveli.png — Proveli (professional services)
- pakistan-tests-hub.png — Pakistan Tests Hub (exams)
- freeconvertio.png — FreeConvertio (free tools)
- young-scholars-pk.png — Young Scholars PK (student learning)
- yellow-pages-pakistan.png — Yellow Pages Pakistan (business directory)

