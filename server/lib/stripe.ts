import Stripe from "stripe";
import { requireEnv, siteUrl } from "./config.js";
import type { DigitalProduct } from "../../src/data/digitalProducts.js";

let client: Stripe | undefined;

/** Lazily creates the Stripe client so tests and non-payment routes never need the key. */
export function getStripe(): Stripe {
  if (!client) client = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  return client;
}

/** Stripe Checkout parameters for a cart. Prices come only from the server-side catalog. */
export function buildCheckoutParams(items: DigitalProduct[], origin = siteUrl()): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: items.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: product.priceUsdCents,
        product_data: { name: product.title, metadata: { product_id: product.id } },
      },
    })),
    // Stored on the session so the webhook can rebuild the order without trusting the browser.
    metadata: { product_ids: items.map((p) => p.id).join(",") },
    customer_creation: "if_required",
    billing_address_collection: "auto",
    success_url: `${origin}/checkout?paid=1`,
    cancel_url: `${origin}/checkout`,
  };
}

export function cartTotalCents(items: DigitalProduct[]): number {
  return items.reduce((sum, item) => sum + item.priceUsdCents, 0);
}
