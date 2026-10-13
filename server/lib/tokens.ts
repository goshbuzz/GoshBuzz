import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed, expiring download tokens: "<base64url(json claims)>.<base64url(hmac-sha256)>".
 * Stateless, so no database is needed. The HMAC secret never leaves the server.
 */
export interface DownloadClaims {
  /** Stripe Checkout session ID the purchase belongs to. */
  sid: string;
  /** Product ID, e.g. "idea-1". */
  pid: string;
  /** Expiry as a Unix timestamp in seconds. */
  exp: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payloadPart: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadPart).digest("base64url");
}

export function signDownloadToken(claims: DownloadClaims, secret: string): string {
  if (secret.length < 32) throw new Error("Token secret must be at least 32 characters.");
  const payloadPart = b64url(JSON.stringify(claims));
  return `${payloadPart}.${sign(payloadPart, secret)}`;
}

/** Returns the claims if the signature is valid and the token has not expired; otherwise null. */
export function verifyDownloadToken(
  token: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): DownloadClaims | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadPart, signaturePart] = parts;

  const expected = Buffer.from(sign(payloadPart, secret));
  const received = Buffer.from(signaturePart);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!claims || typeof claims !== "object") return null;
  const c = claims as Record<string, unknown>;
  if (typeof c.sid !== "string" || typeof c.pid !== "string" || typeof c.exp !== "number") return null;
  if (c.exp <= nowSeconds) return null;
  return { sid: c.sid, pid: c.pid, exp: c.exp };
}
