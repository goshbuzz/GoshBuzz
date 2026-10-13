import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "./config.js";

let client: SupabaseClient | undefined;

/**
 * Server-only client. The service-role key bypasses bucket rules, so it must never reach the
 * browser: it is read from Vercel server environment variables and used only by /api handlers.
 */
function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/** The private bucket that holds the PDFs (public access must stay OFF). */
export function deliveryStorage() {
  return getClient().storage.from(requireEnv("DELIVERY_BUCKET"));
}

/**
 * A short-lived signed URL (5 minutes). The customer's browser downloads straight from
 * Supabase Storage, so large PDFs never pass through the Vercel function, which has a
 * 4.5 MB response limit.
 */
export async function signedPdfUrl(storageKey: string, downloadName: string): Promise<string> {
  const { data, error } = await deliveryStorage().createSignedUrl(storageKey, 5 * 60, {
    download: downloadName.replace(/"/g, ""),
  });
  if (error || !data) {
    throw new Error(`Could not create a download link for ${storageKey}: ${error?.message ?? "no URL returned"}`);
  }
  return data.signedUrl;
}
