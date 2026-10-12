/**
 * One-time (and re-runnable) copy of the sold PDFs from Google Drive into the private
 * delivery bucket. Run from your own computer, not from the website.
 *
 *   GCP_SERVICE_ACCOUNT_JSON='<full JSON key>' DELIVERY_BUCKET=goshbuzz-deliverables \
 *     npx tsx scripts/sync-drive-to-storage.ts [--force] [--only=idea-1,idea-4]
 *
 * Prerequisite: in Google Drive, share the folder "30 Ideas of Escaping out of Matrix"
 * with the service account's client_email as Viewer.
 */
import { Storage } from "@google-cloud/storage";
import { GoogleAuth } from "google-auth-library";
import { digitalProducts, type DigitalProduct } from "../src/data/digitalProducts";
import { getServiceAccount } from "../server/lib/storage";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;

async function main() {
  const bucketName = process.env.DELIVERY_BUCKET;
  if (!bucketName) throw new Error("Set DELIVERY_BUCKET to your private bucket name.");

  const sa = getServiceAccount();
  const auth = new GoogleAuth({
    credentials: { client_email: sa.client_email, private_key: sa.private_key },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const token = await auth.getAccessToken();
  if (!token) throw new Error("Could not get a Drive access token from the service account.");

  const bucket = new Storage({
    projectId: sa.project_id,
    credentials: { client_email: sa.client_email, private_key: sa.private_key },
  }).bucket(bucketName);

  const targets: DigitalProduct[] = digitalProducts.filter((p: DigitalProduct) => !only || only.has(p.id));
  let copied = 0;
  let skipped = 0;

  for (const product of targets) {
    const file = bucket.file(product.storageKey);
    const [exists] = await file.exists();
    if (exists && !force) {
      skipped++;
      console.log(`skip  ${product.id} (already in bucket)`);
      continue;
    }

    const url = `https://www.googleapis.com/drive/v3/files/${product.driveFileId}?alt=media&supportsAllDrives=true`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      throw new Error(
        `${product.id}: Drive returned ${response.status}. Check the folder is shared with ${sa.client_email}.`,
      );
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 4).toString("ascii") !== "%PDF") {
      throw new Error(`${product.id}: ${product.driveFileId} is not a PDF.`);
    }

    await file.save(bytes, {
      contentType: "application/pdf",
      resumable: bytes.length > 5 * 1024 * 1024,
      metadata: { cacheControl: "private, no-store" },
    });
    copied++;
    console.log(`copy  ${product.id} -> ${product.storageKey} (${(bytes.length / 1048576).toFixed(1)} MB)`);
  }

  console.log(`\nDone. copied=${copied} skipped=${skipped} total=${targets.length}`);
}

main().catch((error) => {
  console.error("Sync failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
