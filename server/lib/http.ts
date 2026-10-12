import type { IncomingMessage, ServerResponse } from "node:http";

type MaybeParsedRequest = IncomingMessage & { body?: unknown; rawBody?: unknown };

/**
 * Returns the exact request bytes. Stripe signatures are computed over the raw body, so a
 * re-serialised JSON object would fail verification. Falls back to the stream when the
 * platform has not already buffered the body.
 */
export async function readRawBody(req: MaybeParsedRequest): Promise<Buffer> {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === "string") return Buffer.from(req.rawBody, "utf8");
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body, "utf8");

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/** Parses a JSON body that may already have been parsed by the platform. */
export async function readJsonBody(req: MaybeParsedRequest): Promise<unknown> {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  const raw = await readRawBody(req);
  if (raw.length === 0) return {};
  return JSON.parse(raw.toString("utf8"));
}

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function sendText(res: ServerResponse, status: number, text: string): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(text);
}
