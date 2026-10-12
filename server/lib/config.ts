/** Reads a required server-side environment variable. Never import this from browser code. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.trim();
}

/** Public site origin used in Stripe redirects and email links. No trailing slash. */
export function siteUrl(): string {
  return (process.env.SITE_URL || "https://goshbuzz.com").replace(/\/+$/, "");
}

/** How long a download link in the delivery email stays valid. */
export function downloadLinkDays(): number {
  const raw = Number(process.env.DOWNLOAD_LINK_DAYS || 7);
  return Number.isFinite(raw) && raw > 0 && raw <= 30 ? raw : 7;
}
