# Module logo overrides (optional)

The /network page syncs each module's logo live from the module's own
domain (its favicon), so branding stays in sync automatically.

To pin official artwork instead, drop an image here — e.g.
`public/modules/little-learn.png` — then set `logoFile: "/modules/little-learn.png"`
on that module in `src/data/networkData.ts`. The local file takes precedence
over the live favicon.
