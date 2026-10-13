import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { digitalProducts, findDigitalProduct, resolveCart, CartError } from "../../src/data/digitalProducts";
import { products } from "../../src/data";
import { signDownloadToken, verifyDownloadToken } from "../lib/tokens";
import { buildDeliveryEmail, buildDeliveryLinks } from "../lib/delivery";
import { buildCheckoutParams, cartTotalCents } from "../lib/stripe";

const SECRET = "x".repeat(40);
const NOW = 1_800_000_000;

// ---------- download tokens ----------

test("token round-trips and carries its claims", () => {
  const token = signDownloadToken({ sid: "cs_test_1", pid: "idea-1", exp: NOW + 60 }, SECRET);
  assert.deepEqual(verifyDownloadToken(token, SECRET, NOW), { sid: "cs_test_1", pid: "idea-1", exp: NOW + 60 });
});

test("token is rejected when tampered, expired, signed with another secret, or malformed", () => {
  const token = signDownloadToken({ sid: "cs_test_1", pid: "idea-1", exp: NOW + 60 }, SECRET);
  const [body, sig] = token.split(".");
  const forgedBody = Buffer.from(JSON.stringify({ sid: "cs_test_1", pid: "idea-30", exp: NOW + 60 })).toString("base64url");

  assert.equal(verifyDownloadToken(`${forgedBody}.${sig}`, SECRET, NOW), null, "changed product must fail");
  assert.equal(verifyDownloadToken(`${body}.AAAA`, SECRET, NOW), null, "bad signature must fail");
  assert.equal(verifyDownloadToken(token, SECRET, NOW + 61), null, "expired must fail");
  assert.equal(verifyDownloadToken(token, "y".repeat(40), NOW), null, "wrong secret must fail");
  assert.equal(verifyDownloadToken("not-a-token", SECRET, NOW), null, "malformed must fail");
});

test("signing refuses a short secret", () => {
  assert.throws(() => signDownloadToken({ sid: "a", pid: "idea-1", exp: NOW }, "short"));
});

// ---------- cart validation ----------

test("resolveCart accepts ideas, removes duplicates, and rejects unknown or empty carts", () => {
  const items = resolveCart(["idea-1", "idea-4", "idea-1"]);
  assert.deepEqual(items.map((i) => i.id), ["idea-1", "idea-4"]);
  assert.equal(cartTotalCents(items), 460);

  // Mixed cart: ideas $2.30 + skills $1.10 each.
  const mixed = resolveCart(["idea-1", "skill-1"]);
  assert.equal(cartTotalCents(mixed), 340);

  assert.throws(() => resolveCart([]), CartError);
  assert.throws(() => resolveCart(undefined), CartError);
  assert.throws(() => resolveCart(["idea-999"]), CartError);
  assert.throws(() => resolveCart(["skill-99"]), CartError);
  assert.throws(() => resolveCart([42]), CartError);
  assert.throws(() => resolveCart(Array.from({ length: 21 }, (_, i) => `idea-${(i % 30) + 1}`)), CartError);
});

// ---------- checkout parameters ----------

test("checkout uses server-side USD prices and records product IDs in metadata", () => {
  const params = buildCheckoutParams(resolveCart(["idea-2", "idea-3"]), "https://goshbuzz.com");
  assert.equal(params.mode, "payment");
  assert.deepEqual(
    params.line_items?.map((li) => li.price_data?.unit_amount),
    [230, 230],
  );
  assert.ok(params.line_items?.every((li) => li.price_data?.currency === "usd"));
  assert.equal(params.metadata?.product_ids, "idea-2,idea-3");
  assert.equal(params.success_url, "https://goshbuzz.com/checkout?paid=1");
  assert.equal(params.cancel_url, "https://goshbuzz.com/checkout");
});

// ---------- delivery email ----------

test("delivery email links every product with a working signed token and escapes HTML", () => {
  const items = resolveCart(["idea-5", "idea-6"]);
  const { links, expiresAt } = buildDeliveryLinks("cs_test_9", items, SECRET, "https://goshbuzz.com", NOW);
  assert.equal(links.length, 2);
  for (const link of links) {
    const token = new URL(link.url).searchParams.get("token");
    assert.ok(token, "link has a token");
    const claims = verifyDownloadToken(token!, SECRET, NOW);
    assert.equal(claims?.sid, "cs_test_9");
    assert.equal(claims?.pid, findDigitalProduct(claims!.pid)?.id);
    assert.ok(link.url.startsWith("https://goshbuzz.com/api/download?token="));
  }
  assert.ok(expiresAt.getTime() > NOW * 1000);

  const message = buildDeliveryEmail(
    [{ title: `<script>alert("x")</script> & co`, url: links[0].url }],
    expiresAt,
  );
  assert.ok(message.html.includes("&lt;script&gt;"), "title must be escaped in HTML");
  assert.ok(!message.html.includes("<script>"));
  assert.match(message.text, /Each link works until/);
});

// ---------- Stripe signature ----------

test("Stripe webhook signature verification accepts a correct signature and rejects a wrong one", () => {
  const stripe = new Stripe("sk_test_dummy_key_for_unit_tests_only");
  const webhookSecret = "whsec_test_secret";
  const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed", data: { object: {} } });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });

  const event = stripe.webhooks.constructEvent(payload, header, webhookSecret);
  assert.equal(event.type, "checkout.session.completed");
  assert.throws(() => stripe.webhooks.constructEvent(payload, header, "whsec_wrong"));
  assert.throws(() => stripe.webhooks.constructEvent(payload + " ", header, webhookSecret));
});

// ---------- catalog integrity ----------

test("catalog covers 30 ideas and 30 skills exactly once, each with a unique Drive file and storage key", () => {
  assert.equal(digitalProducts.length, 60);
  assert.equal(new Set(digitalProducts.map((p) => p.id)).size, 60);
  assert.equal(new Set(digitalProducts.map((p) => p.driveFileId)).size, 60);
  assert.equal(new Set(digitalProducts.map((p) => p.storageKey)).size, 60);
  assert.equal(digitalProducts.filter((p) => p.type === "idea").length, 30);
  assert.equal(digitalProducts.filter((p) => p.type === "skill").length, 30);
  for (const p of digitalProducts) {
    if (p.type === "skill") {
      assert.ok(p.storageKey.startsWith("skills/"), `${p.id} stored under skills/`);
      assert.equal(p.priceUsdCents, 110, `${p.id} priced at $1.10`);
    } else {
      assert.ok(p.storageKey.startsWith("ideas/"), `${p.id} stored under ideas/`);
      assert.equal(p.priceUsdCents, 230, `${p.id} priced at $2.30`);
    }
  }
  const known = new Set(products.map((p) => p.id));
  for (const p of digitalProducts) {
    assert.ok(known.has(p.id), `${p.id} exists in src/data.ts`);
    assert.ok(p.priceUsdCents > 0);
    assert.ok(p.downloadName.endsWith(".pdf"), "download name keeps the .pdf extension");
    assert.ok(p.downloadName.length <= 150);
  }
});

// ---------- endpoint guards (no network) ----------

function fakeRequest(opts: { method: string; url?: string; headers?: Record<string, string>; body?: string }): IncomingMessage {
  const stream = Readable.from(opts.body ? [Buffer.from(opts.body)] : []) as unknown as IncomingMessage;
  Object.assign(stream, { method: opts.method, url: opts.url ?? "/", headers: opts.headers ?? {} });
  return stream;
}

function fakeResponse() {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    },
    end(chunk?: string) {
      if (chunk) this.body += chunk;
      return this;
    },
  };
  return res as typeof res & ServerResponse;
}

test("download endpoint rejects a missing or forged token with 404 and never redirects", async () => {
  process.env.DOWNLOAD_TOKEN_SECRET = SECRET;
  const { default: handler } = await import("../../api/download");
  const res = fakeResponse();
  await handler(fakeRequest({ method: "GET", url: "/api/download?token=forged.token" }), res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.headers.location, undefined);

  const res2 = fakeResponse();
  await handler(fakeRequest({ method: "GET", url: "/api/download" }), res2);
  assert.equal(res2.statusCode, 404);
});

test("webhook endpoint rejects unsigned requests with 400 before doing anything else", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy_key_for_unit_tests_only";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
  const { default: handler } = await import("../../api/stripe-webhook");
  const res = fakeResponse();
  await handler(fakeRequest({ method: "POST", body: "{}" }), res);
  assert.equal(res.statusCode, 400);

  const res2 = fakeResponse();
  await handler(fakeRequest({ method: "POST", headers: { "stripe-signature": "t=1,v1=bad" }, body: "{}" }), res2);
  assert.equal(res2.statusCode, 400);
});

test("create-checkout-session rejects GET and unknown products before calling Stripe", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy_key_for_unit_tests_only";
  const { default: handler } = await import("../../api/create-checkout-session");
  const res = fakeResponse();
  await handler(fakeRequest({ method: "GET" }), res);
  assert.equal(res.statusCode, 405);

  const res2 = fakeResponse();
  await handler(fakeRequest({ method: "POST", body: JSON.stringify({ productIds: ["idea-999"] }) }), res2);
  assert.equal(res2.statusCode, 400);
});
