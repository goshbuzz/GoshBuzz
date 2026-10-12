/**
 * GoshBuzz: convert the 30 skill HTML pages in Google Drive to PDF and upload them to the
 * private Supabase bucket as skills/skill-N.pdf.
 *
 * SETUP
 *  1. In the SAME Apps Script project as Code.gs, click + next to "Files" → Script, name it "Skills".
 *     Paste this whole file into it and save.
 *  2. Services (+) in the left sidebar → Drive API → version v3 → Add.
 *     (This lets the script convert HTML into a Google Doc, then export it as PDF.)
 *  3. Run checkConnection first if you haven't (from Code.gs), then run uploadSkillPdfs.
 *
 * Each run skips skills already uploaded, and stops early at the time limit. Run again to finish.
 * Temporary Google Docs created during conversion are moved to the Drive trash right away.
 * Conversion keeps the text and headings; check a few PDFs for layout and images before selling.
 */

// Source: the HTML page in each "N Skill" folder (same numbers as src/data/digitalProducts.ts).
const SKILL_FILES = [
  { id: "skill-1", title: "Sales Skill Mastery", htmlFileId: "1WIfd6hR3Epgcw-5SiOFqrmP0TdymqSdu", storageKey: "skills/skill-1.pdf" },
  { id: "skill-2", title: "Communication Skill Mastery", htmlFileId: "1qZuU0t1w1Bn8iSI3ypAXZua5BEH67ANU", storageKey: "skills/skill-2.pdf" },
  { id: "skill-3", title: "Self-Discipline Mastery", htmlFileId: "13bll_ja9mE0u-Apv3yoKm1NB92MVbHgc", storageKey: "skills/skill-3.pdf" },
  { id: "skill-4", title: "AI Fundamentals Mastery", htmlFileId: "1dFGTnjfY70MofjXD9EIU-vns6R6Hub0c", storageKey: "skills/skill-4.pdf" },
  { id: "skill-5", title: "CRM Automation Mastery", htmlFileId: "1h3rjb38zS9497P2PPM1P9ZZ74ofzC7r-", storageKey: "skills/skill-5.pdf" },
  { id: "skill-6", title: "QuickBooks Financial Control", htmlFileId: "1WC50iBSzdR3nS22gKAHFNtOBqET7n6XV", storageKey: "skills/skill-6.pdf" },
  { id: "skill-7", title: "Excel & Dashboards Mastery", htmlFileId: "1ikvO1uLLxZQf1vvN7bktJ4m7Lx9vx7nS", storageKey: "skills/skill-7.pdf" },
  { id: "skill-8", title: "Data Analysis Mastery", htmlFileId: "1k7dDw085J4sLlO06ORHkaNVw8WvnCvve", storageKey: "skills/skill-8.pdf" },
  { id: "skill-9", title: "Chatbot & Voice Bot Development", htmlFileId: "1R-ZGh91wbefd2T1vW_EioeCJFwCHgiua", storageKey: "skills/skill-9.pdf" },
  { id: "skill-10", title: "AI-Powered Development", htmlFileId: "1t8xeidh3gPhKE5ivDuMZxbi7-Hmpg0Dq", storageKey: "skills/skill-10.pdf" },
  { id: "skill-11", title: "Copywriting Mastery", htmlFileId: "1hnG5xP6nn5eD2Oii7S8o2M-9t2vmdAnR", storageKey: "skills/skill-11.pdf" },
  { id: "skill-12", title: "Video Editing Mastery", htmlFileId: "14h0LT87903PU5StS9MG75vlOut5Busu0", storageKey: "skills/skill-12.pdf" },
  { id: "skill-13", title: "SEO & Keyword Research", htmlFileId: "1L7mlwGKtaZXwVAJuGtU-Orb173oOCsXz", storageKey: "skills/skill-13.pdf" },
  { id: "skill-14", title: "Graphic Design & Visuals", htmlFileId: "179lYTUu044CUTRvuiQe2Bya7hzcgiXFl", storageKey: "skills/skill-14.pdf" },
  { id: "skill-15", title: "Public Speaking & On-Camera", htmlFileId: "1bemq9KMGxL3aSlHBhCwvychNSwnVpv5k", storageKey: "skills/skill-15.pdf" },
  { id: "skill-16", title: "Negotiation Tactics", htmlFileId: "1VoKydskn1mLwOSZYnJfnPZ6N6e0xqogs", storageKey: "skills/skill-16.pdf" },
  { id: "skill-17", title: "Email Marketing Mastery", htmlFileId: "1uiRsxya0kgC2-JJc7P7RGb_QBSXNq-O7", storageKey: "skills/skill-17.pdf" },
  { id: "skill-18", title: "Social Media Advertising", htmlFileId: "1AOgOdXfFk-oSdgjg_95aqXkArnODnUim", storageKey: "skills/skill-18.pdf" },
  { id: "skill-19", title: "Content Strategy Mastery", htmlFileId: "1tG7_x4G7PqD7UQ-7KJuTj4dKfoKdalO0", storageKey: "skills/skill-19.pdf" },
  { id: "skill-20", title: "Project Management Mastery", htmlFileId: "14iRFpCX3r9-15MSrxHuWR1LEr1xo7kqi", storageKey: "skills/skill-20.pdf" },
  { id: "skill-21", title: "Financial Literacy for Freelancers", htmlFileId: "1IG0RmIzDw0ggn8x03Cj1i9X2SaIqg6LH", storageKey: "skills/skill-21.pdf" },
  { id: "skill-22", title: "LinkedIn Networking Masterclass", htmlFileId: "1I0DMNg6ZJbmKU22RfuG0Uk7kA7z-Omtx", storageKey: "skills/skill-22.pdf" },
  { id: "skill-23", title: "Cold Outreach Mastery", htmlFileId: "1Vy1eTz1QbJ-1VXonYgDfHmEK9869wR_s", storageKey: "skills/skill-23.pdf" },
  { id: "skill-24", title: "Prompt Engineering Mastery", htmlFileId: "1Uo-jQG7PDel1GC7YYGksY0C_aFGDXKCX", storageKey: "skills/skill-24.pdf" },
  { id: "skill-25", title: "Web Scraping Mastery", htmlFileId: "19wyP01wdyNVXDAUkL9xk6dhh39z89rsh", storageKey: "skills/skill-25.pdf" },
  { id: "skill-26", title: "API Integration Mastery", htmlFileId: "1oT8qhFG1i3ABTtCPGCtp5ciwzUkKIrjT", storageKey: "skills/skill-26.pdf" },
  { id: "skill-27", title: "UI/UX Design Principles", htmlFileId: "1m3r0kVLI1Y97IeKkQg2j9aObDmHOoD9I", storageKey: "skills/skill-27.pdf" },
  { id: "skill-28", title: "Personal Branding Mastery", htmlFileId: "1nT91BUE6ZHGRKDlzdbilpMlPQBZBzh1J", storageKey: "skills/skill-28.pdf" },
  { id: "skill-29", title: "Time Management Mastery", htmlFileId: "1D5mpRsbXHnt-854C3FdIZdSnAoU63Ur8", storageKey: "skills/skill-29.pdf" },
  { id: "skill-30", title: "Leadership & Delegation", htmlFileId: "1o2Jxi5HBA1-Iro2NNEOkvS3W2ioxHXK9", storageKey: "skills/skill-30.pdf" }
];

const SKILL_TIME_LIMIT_MS = 4.5 * 60 * 1000;

function convertHtmlToPdf_(htmlFileId, title) {
  const htmlBlob = DriveApp.getFileById(htmlFileId).getBlob();
  const doc = Drive.Files.create({ name: title, mimeType: "application/vnd.google-apps.document" }, htmlBlob);
  try {
    return DriveApp.getFileById(doc.id).getAs("application/pdf");
  } finally {
    DriveApp.getFileById(doc.id).setTrashed(true);
  }
}

function listSkillsExisting_(cfg) {
  const res = UrlFetchApp.fetch(cfg.url + "/storage/v1/object/list/" + cfg.bucket, {
    method: "post",
    contentType: "application/json",
    headers: authHeaders_(cfg),
    payload: JSON.stringify({ prefix: "skills", limit: 1000, offset: 0 }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error("Could not list skills in the bucket (" + res.getResponseCode() + "): " + res.getContentText());
  }
  return new Set(JSON.parse(res.getContentText()).map((object) => object.name));
}

function uploadSkillPdfs() {
  copySkillPdfs_(false);
}

function forceUploadSkillPdfs() {
  copySkillPdfs_(true);
}

function copySkillPdfs_(force) {
  const cfg = getConfig_();
  const existing = force ? new Set() : listSkillsExisting_(cfg);
  const started = Date.now();
  let copied = 0;
  let skipped = 0;

  for (const file of SKILL_FILES) {
    if (Date.now() - started > SKILL_TIME_LIMIT_MS) {
      console.log("Time limit reached after " + copied + " copies. Run uploadSkillPdfs again to continue.");
      break;
    }
    const name = file.storageKey.split("/").pop();
    if (existing.has(name)) {
      skipped++;
      console.log("skip  " + file.id + " (already in bucket)");
      continue;
    }

    const pdf = convertHtmlToPdf_(file.htmlFileId, file.title);
    const bytes = pdf.getBytes();
    const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (magic !== "%PDF") {
      throw new Error(file.id + " did not convert to a PDF.");
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

  console.log("Done. copied=" + copied + " skipped=" + skipped + " total=" + SKILL_FILES.length);
}
