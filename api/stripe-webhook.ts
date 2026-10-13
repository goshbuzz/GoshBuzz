import type { IncomingMessage, ServerResponse } from "node:http";
import type Stripe from "stripe";
import { findDigitalProduct } from "../src/data/digitalProducts";
import { requireEnv, siteUrl } from "../server/lib/config";
import { buildDeliveryEmail, buildDeliveryLinks, sendDeliveryEmail } from "../server/lib/delivery";
import { readRawBody, sendText } from "../server/lib/http";
import { getStripe } from "../server/lib/stripe";

/**
 * POST /api/stripe-webhook. Stripe calls this after a payment succeeds.
 * Verifies the signature, then emails the buyer signed download links.
 * Return 500 on transient failures so Stripe retries; return 200 once handled.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendText(res, 405, "Method not allowed");
  }

  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") return sendText(res, 400, "Missing Stripe-Signature header");

  let event: Stripe.Event;
  try {
    const raw = await readRawBody(req);
    event = getStripe().webhooks.constructEvent(raw, signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    console.error("Webhook signature check failed:", (error as Error).message);
    return sendText(res, 400, "Invalid signature");
  }

  if (event.type !== "checkout.session.completed") {
    return sendText(res, 200, "Ignored");
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    console.warn(`Session ${session.id} not paid yet (${session.payment_status}); skipping.`);
    return sendText(res, 200, "Not paid");
  }

  const email = session.customer_details?.email;
  if (!email) {
    // Retrying cannot fix a missing address, so acknowledge and flag it for manual follow-up.
    console.error(`Session ${session.id} has no customer email. Deliver manually.`);
    return sendText(res, 200, "No email");
  }

  const productIds = (session.metadata?.product_ids ?? "").split(",").filter(Boolean);
  const items = productIds.map((id) => findDigitalProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length === 0) {
    console.error(`Session ${session.id} paid but matched no catalog products: ${productIds.join(",")}`);
    return sendText(res, 200, "No products");
  }

  try {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const { links, expiresAt } = buildDeliveryLinks(session.id, items, requireEnv("DOWNLOAD_TOKEN_SECRET"), siteUrl(), nowSeconds);
    const message = buildDeliveryEmail(links, expiresAt);
    // Same event ID on retries, so Resend can drop duplicate sends.
    await sendDeliveryEmail(email, message, `delivery-${event.id}`);
    return sendText(res, 200, "Delivered");
  } catch (error) {
    console.error(`Delivery failed for session ${session.id}:`, error);
    return sendText(res, 500, "Delivery failed; Stripe will retry");
  }
}
