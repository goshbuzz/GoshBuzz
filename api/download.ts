import type { IncomingMessage, ServerResponse } from "node:http";
import { findDigitalProduct } from "../src/data/digitalProducts.js";
import { requireEnv } from "../server/lib/config.js";
import { sendText } from "../server/lib/http.js";
import { signedPdfUrl } from "../server/lib/storage.js";
import { verifyDownloadToken } from "../server/lib/tokens.js";

/**
 * GET /api/download?token=...
 * Checks the signed, unexpired token, then redirects to a 5-minute signed Cloud Storage URL.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return sendText(res, 405, "Method not allowed");
  }

  const token = new URL(req.url ?? "/", "https://placeholder.invalid").searchParams.get("token") ?? "";
  const claims = token ? verifyDownloadToken(token, requireEnv("DOWNLOAD_TOKEN_SECRET")) : null;
  if (!claims) {
    return sendText(res, 404, "This download link is invalid or has expired. Reply to your order email or message us on WhatsApp for a new link.");
  }

  const product = findDigitalProduct(claims.pid);
  if (!product) return sendText(res, 404, "Product not found.");

  try {
    const url = await signedPdfUrl(product.storageKey, product.downloadName);
    res.statusCode = 302;
    res.setHeader("Location", url);
    res.setHeader("Cache-Control", "no-store");
    res.end();
  } catch (error) {
    console.error(`Could not sign download for ${product.id}:`, error);
    return sendText(res, 500, "Download temporarily unavailable. Please try again shortly.");
  }
}
