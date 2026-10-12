import { Storage } from "@google-cloud/storage";
import { requireEnv } from "./config";

let storage: Storage | undefined;

/**
 * Service-account credentials, given as the full JSON key in GCP_SERVICE_ACCOUNT_JSON.
 * The same service account reads Drive during the one-time sync and signs download URLs.
 */
export function getServiceAccount(): { client_email: string; private_key: string; project_id?: string } {
  const parsed = JSON.parse(requireEnv("GCP_SERVICE_ACCOUNT_JSON"));
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GCP_SERVICE_ACCOUNT_JSON is missing client_email or private_key.");
  }
  return { ...parsed, private_key: String(parsed.private_key).replace(/\\n/g, "\n") };
}

function getStorage(): Storage {
  if (!storage) {
    const sa = getServiceAccount();
    storage = new Storage({
      projectId: sa.project_id,
      credentials: { client_email: sa.client_email, private_key: sa.private_key },
    });
  }
  return storage;
}

export function deliveryBucket() {
  return getStorage().bucket(requireEnv("DELIVERY_BUCKET"));
}

/**
 * A short-lived signed URL (5 minutes). The customer's browser downloads straight from
 * Google Cloud Storage, so large PDFs never pass through the Vercel function, which has a
 * 4.5 MB response limit.
 */
export async function signedPdfUrl(storageKey: string, downloadName: string): Promise<string> {
  const [url] = await deliveryBucket()
    .file(storageKey)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 60 * 1000,
      responseDisposition: `attachment; filename="${downloadName.replace(/"/g, "")}"`,
      responseType: "application/pdf",
    });
  return url;
}
