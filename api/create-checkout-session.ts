import type { IncomingMessage, ServerResponse } from "node:http";
import { CartError, resolveCart } from "../src/data/digitalProducts.js";
import { siteUrl } from "../server/lib/config.js";
import { readJsonBody, sendJson } from "../server/lib/http.js";
import { buildCheckoutParams, cartTotalCents, getStripe } from "../server/lib/stripe.js";

/**
 * POST /api/create-checkout-session  { "productIds": ["idea-1", "idea-4"] }
 * Returns { url } of a hosted Stripe Checkout page. The browser then redirects there.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = (await readJsonBody(req)) as { productIds?: unknown };
    const items = resolveCart(body?.productIds);
    const session = await getStripe().checkout.sessions.create(buildCheckoutParams(items, siteUrl()));
    return sendJson(res, 200, { url: session.url, totalUsdCents: cartTotalCents(items) });
  } catch (error: unknown) {
    if (error instanceof CartError) return sendJson(res, 400, { error: error.message });
    console.error("create-checkout-session failed:", error);
    return sendJson(res, 500, { error: "Could not start card payment. Please try WhatsApp checkout." });
  }
}
