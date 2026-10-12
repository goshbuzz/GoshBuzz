/**
 * GoshBuzz: copy the 30 idea PDFs from Google Drive into the private Supabase bucket.
 * Runs in your own Google account, so no Google Cloud project or service-account key is needed.
 *
 * SETUP (one time)
 *  1. Go to script.google.com → New project. Name it "GoshBuzz PDF copy".
 *  2. Replace the contents of Code.gs with this file, then click Save.
 *  3. Project Settings (gear icon) → Script properties → Add script property:
 *       SUPABASE_URL              = https://xxxx.supabase.co
 *       SUPABASE_SERVICE_ROLE_KEY = sb_secret_...   (Supabase → API Keys → Secret keys)
 *       DELIVERY_BUCKET           = deliverables      (optional; this is the default)
 *  4. In the editor, pick the function checkConnection and click Run. Approve the permissions
 *     (Drive and external requests). It should log "Connected. Bucket has 0 idea PDFs."
 *
 * COPY
 *  5. Pick uploadIdeaPdfs and click Run. Check the Execution log for "copy" lines.
 *     If it stops with "Time limit reached", run it again. It skips PDFs already uploaded.
 *  6. To re-upload everything after a PDF changes, run forceUploadIdeaPdfs.
 *
 * The secret key stays in Script properties, never in this code. Don't share the project with others.
 */

// Same 30 Drive files as src/data/digitalProducts.ts. Keep these in sync if a PDF changes.
const FILES = [
  { id: "idea-1", driveFileId: "1N-uYpdu_9w6TsAagJChLykCFvj8FeR4-", storageKey: "ideas/idea-1.pdf" },
  { id: "idea-2", driveFileId: "1IdLIlbVPfNVNTLmjVwzNBgUGr4u0NHoK", storageKey: "ideas/idea-2.pdf" },
  { id: "idea-3", driveFileId: "1y0iNZhNn4OAUvl1leheep77GN81MPNgX", storageKey: "ideas/idea-3.pdf" },
  { id: "idea-4", driveFileId: "1NX7Lom7uTLxTgyxeaD7hdFK_BUutdCV2", storageKey: "ideas/idea-4.pdf" },
  { id: "idea-5", driveFileId: "1hFK1RVBhKAE-XZ9ww3atmrLg6Hi-xrL-", storageKey: "ideas/idea-5.pdf" },
  { id: "idea-6", driveFileId: "1qgRWLEyq56Pb8P5MxoR_XUbGuIqll1t-", storageKey: "ideas/idea-6.pdf" },
  { id: "idea-7", driveFileId: "1amsPvwTO2a1_9e3q0NSRf-ImnlFEJRcT", storageKey: "ideas/idea-7.pdf" },
  { id: "idea-8", driveFileId: "18VTeVDWAJ6y6YldO6Yo6r7DceqckOGr7", storageKey: "ideas/idea-8.pdf" },
  { id: "idea-9", driveFileId: "1xTy77WpHBC0Gq0oWo8EgDx43RfzSAcNy", storageKey: "ideas/idea-9.pdf" },
  { id: "idea-10", driveFileId: "1EtU0GoP9nYGjTNtKrWwmNaTyBn4NGb4K", storageKey: "ideas/idea-10.pdf" },
  { id: "idea-11", driveFileId: "1J59AlRB1BxGUchSOJrWC59uVr9Lk08of", storageKey: "ideas/idea-11.pdf" },
  { id: "idea-12", driveFileId: "1OZKdxrA4BsEIAqmgQwJIYdYFSMqLB-Qa", storageKey: "ideas/idea-12.pdf" },
  { id: "idea-13", driveFileId: "1Y6BhlMaYjDeAoe4obeGHd7igMK4AKOqF", storageKey: "ideas/idea-13.pdf" },
  { id: "idea-14", driveFileId: "1bjegrGeE0964YllijudtHD1k8LQbFbQI", storageKey: "ideas/idea-14.pdf" },
  { id: "idea-15", driveFileId: "1slrFT0ykYQbXxVjHqhn0DV1Uq7-3NcYG", storageKey: "ideas/idea-15.pdf" },
  { id: "idea-16", driveFileId: "1ff21ZKjMgiMeYAcq6iz2XKW-KTlJVtJb", storageKey: "ideas/idea-16.pdf" },
  { id: "idea-17", driveFileId: "16XZMxFPNrctSX0qvJ9PeMybhrLzPARzX", storageKey: "ideas/idea-17.pdf" },
  { id: "idea-18", driveFileId: "1U3ZnmRxWpgwESYCyLGSm-IV-wfNTaCRs", storageKey: "ideas/idea-18.pdf" },
  { id: "idea-19", driveFileId: "1EaGGYbYkg8JdvgeTIOLJj4k8kJWbwsI3", storageKey: "ideas/idea-19.pdf" },
  { id: "idea-20", driveFileId: "15m_Z3eb0scSXywCfAW8Om744vmy2rMHB", storageKey: "ideas/idea-20.pdf" },
  { id: "idea-21", driveFileId: "1KpIJJppEayCzYJsVtdIMjJe738ISP-GF", storageKey: "ideas/idea-21.pdf" },
  { id: "idea-22", driveFileId: "1IgGjzhZVZ_Fvxw53vjbOFh8-vpaZABde", storageKey: "ideas/idea-22.pdf" },
  { id: "idea-23", driveFileId: "1WipF8A1IsaHeKnqHCyfoc8qx3EuZTFkM", storageKey: "ideas/idea-23.pdf" },
  { id: "idea-24", driveFileId: "1pH7JCqy-EVEbTY1EchAEbmjLveXyAlHF", storageKey: "ideas/idea-24.pdf" },
  { id: "idea-25", driveFileId: "15OZm75sBFnaB-p1HiT3JXGMoauRWbQ_j", storageKey: "ideas/idea-25.pdf" },
  { id: "idea-26", driveFileId: "1-4-9mYb_Ns_Zm2dGrpXoCCLVpUCP3TY0", storageKey: "ideas/idea-26.pdf" },
  { id: "idea-27", driveFileId: "1KY_yx7B46QBG1a6R6QG3xOCDJ525rAkb", storageKey: "ideas/idea-27.pdf" },
  { id: "idea-28", driveFileId: "1fsZbeAi3pHIZO6bKzdM7AbxI0UV0gjIK", storageKey: "ideas/idea-28.pdf" },
  { id: "idea-29", driveFileId: "12ESEYEkIJ7I0t5TYxdiqy4ysQcGgt88U", storageKey: "ideas/idea-29.pdf" },
  { id: "idea-30", driveFileId: "1GOy1_1cTRwW8Lieuzk34oG8ex7FTqd9K", storageKey: "ideas/idea-30.pdf" }
];

const TIME_LIMIT_MS = 4.5 * 60 * 1000; // Apps Script stops at 6 minutes; stop early and resume.

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  const url = (props.getProperty("SUPABASE_URL") || "").replace(/\/$/, "");
  const key = props.getProperty("SUPABASE_SERVICE_ROLE_KEY") || "";
  const bucket = props.getProperty("DELIVERY_BUCKET") || "deliverables";
  if (!url || !key) {
    throw new Error("Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Project Settings → Script properties.");
  }
  return { url, key, bucket };
}

function authHeaders_(cfg) {
  return { Authorization: "Bearer " + cfg.key, apikey: cfg.key };
}

function listExisting_(cfg) {
  const res = UrlFetchApp.fetch(cfg.url + "/storage/v1/object/list/" + cfg.bucket, {
    method: "post",
    contentType: "application/json",
    headers: authHeaders_(cfg),
    payload: JSON.stringify({ prefix: "ideas", limit: 1000, offset: 0 }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error("Could not list the bucket (" + res.getResponseCode() + "): " + res.getContentText());
  }
  return new Set(JSON.parse(res.getContentText()).map((object) => object.name));
}

/** Confirms the URL, bucket and key work. Makes no changes. */
function checkConnection() {
  const cfg = getConfig_();
  const existing = listExisting_(cfg);
  console.log("Connected. Bucket \"" + cfg.bucket + "\" has " + existing.size + " idea PDFs in ideas/.");
}

function uploadIdeaPdfs() {
  copyPdfs_(false);
}

function forceUploadIdeaPdfs() {
  copyPdfs_(true);
}

function copyPdfs_(force) {
  const cfg = getConfig_();
  const existing = force ? new Set() : listExisting_(cfg);
  const started = Date.now();
  let copied = 0;
  let skipped = 0;

  for (const file of FILES) {
    if (Date.now() - started > TIME_LIMIT_MS) {
      console.log("Time limit reached after " + copied + " copies. Run uploadIdeaPdfs again to continue.");
      break;
    }
    const name = file.storageKey.split("/").pop();
    if (existing.has(name)) {
      skipped++;
      console.log("skip  " + file.id + " (already in bucket)");
      continue;
    }

    const bytes = DriveApp.getFileById(file.driveFileId).getBlob().getBytes();
    const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (magic !== "%PDF") {
      throw new Error(file.id + " is not a PDF. Check the Drive file " + file.driveFileId + ".");
    }

    const res = UrlFetchApp.fetch(cfg.url + "/storage/v1/object/" + cfg.bucket + "/" + file.storageKey, {
      method: "post",
      contentType: "application/pdf",
      headers: Object.assign({ "x-upsert": "true" }, authHeaders_(cfg)),
      payload: bytes,
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) {
      throw new Error(file.id + " upload failed (" + res.getResponseCode() + "): " + res.getContentText());
    }
    copied++;
    console.log("copy  " + file.id + " -> " + file.storageKey + " (" + (bytes.length / 1048576).toFixed(1) + " MB)");
  }

  console.log("Done. copied=" + copied + " skipped=" + skipped + " total=" + FILES.length);
}
