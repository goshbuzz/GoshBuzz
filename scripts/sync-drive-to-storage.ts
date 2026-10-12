/**
 * One-time (and re-runnable) copy of the sold PDFs from Google Drive into the private
 * Supabase Storage bucket. Run from your own computer, not from the website.
 *
 * Put these in .env.local (git-ignored) next to package.json:
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=...            (Project Settings → API → service_role)
 *   DELIVERY_BUCKET=deliverables
 *   GCP_SERVICE_ACCOUNT_JSON={"type":"service_account",...}   (only used to READ Drive)
 *
 * Then run:
 *   npm run sync:drive                  # copies missing PDFs
 *   npm run sync:drive -- --force       # re-copies everything
 *   npm run sync:drive -- --only=idea-1,idea-4
 *
 * Prerequisite: in Google Drive, share the folder "30 Ideas of Escaping out of Matrix"
 * with the service account's client_email as Viewer. Google's Drive API is free and needs
 * no billing account. These Google credentials are never deployed to Vercel.
 */
import { createClient } from "@supabase/supabase-js";
import { GoogleAuth } from "google-auth-library";
import { digitalProducts, type DigitalProduct } from "../src/data/digitalProducts";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;

function requireLocal(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env.local (see the comment at the top of this script).`);
  return value;
}

function readDriveServiceAccount(): { client_email: string; private_key: string } {
  const parsed = JSON.parse(requireLocal("GCP_SERVICE_ACCOUNT_JSON"));
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GCP_SERVICE_ACCOUNT_JSON is missing client_email or private_key.");
  }
  return { client_email: parsed.client_email, private_key: String(parsed.private_key).replace(/\\n/g, "\n") };
}

async function main() {
  const bucketName = requireLocal("DELIVERY_BUCKET");
  const supabase = createClient(requireLocal("SUPABASE_URL"), requireLocal("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const bucket = supabase.storage.from(bucketName);

  const sa = readDriveServiceAccount();
  const auth = new GoogleAuth({
    credentials: { client_email: sa.client_email, private_key: sa.private_key },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const token = await auth.getAccessToken();
  if (!token) throw new Error("Could not get a Drive access token from the service account.");

  // One listing tells us what is already uploaded, so re-runs skip finished files.
  const { data: listed, error: listError } = await bucket.list("ideas", { limit: 1000 });
  if (listError) throw new Error(`Could not list bucket "${bucketName}": ${listError.message}`);
  const existing = new Set((listed ?? []).map((object) => object.name));

  const targets: DigitalProduct[] = digitalProducts.filter((p: DigitalProduct) => !only || only.has(p.id));
  let copied = 0;
  let skipped = 0;

  for (const product of targets) {
    const fileName = product.storageKey.split("/").pop() ?? product.storageKey;
    if (existing.has(fileName) && !force) {
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

    const { error: uploadError } = await bucket.upload(product.storageKey, new Blob([bytes], { type: "application/pdf" }), {
      contentType: "application/pdf",
      cacheControl: "no-store",
      upsert: true,
    });
    if (uploadError) throw new Error(`${product.id}: upload failed: ${uploadError.message}`);

    copied++;
    console.log(`copy  ${product.id} -> ${product.storageKey} (${(bytes.length / 1048576).toFixed(1)} MB)`);
  }

  console.log(`\nDone. copied=${copied} skipped=${skipped} total=${targets.length}`);
}

main().catch((error) => {
  console.error("Sync failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
