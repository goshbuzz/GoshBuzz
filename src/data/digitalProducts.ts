/**
 * Card-payment catalog for digital PDF guides.
 *
 * Server-side source of truth for what a card customer pays and which PDF they receive.
 * The browser only sends product IDs; prices and files are looked up here, never trusted from the client.
 *
 * Drive layout (folder 1HHWXgFfios6dz5wRceY8be0IjHofFHUO):
 *   "30 Ideas of Escaping out of Matrix"  -> one sub-folder per idea ("1 Crypto Spot Trading", ...)
 *   "30 Skills of Escaping out of Matrix" -> one sub-folder per skill (HTML pages, converted to PDF for card sales)
 * Each idea sub-folder holds exactly one PDF, mapped below by folder number.
 *
 * Prices live in cardPricing.ts (one USD price for everyone). See docs/PAYMENTS_SETUP.md for the math.
 */

import { CARD_PRICE_USD_CENTS } from "./cardPricing.js";

export interface DigitalProduct {
  /** Same id as in src/data.ts, e.g. "idea-1" or "skill-1". */
  id: string;
  type: "idea" | "skill";
  title: string;
  /** Price in US cents, charged in USD. */
  priceUsdCents: number;
  /** Drive sub-folder that holds the PDF (for reference and re-syncing). */
  driveFolderId: string;
  /** Drive file ID of the source. Ideas: the PDF. Skills: the HTML page (converted to PDF by the Apps Script). */
  driveFileId: string;
  /** Object key inside the private delivery bucket. */
  storageKey: string;
  /** Filename the customer's browser saves the PDF as. */
  downloadName: string;
  /** Set true when the folder name and PDF name disagree; confirm before selling. */
  needsReview?: boolean;
}

const idea = (
  n: number,
  title: string,
  driveFolderId: string,
  driveFileId: string,
  pdfName: string,
  needsReview = false,
): DigitalProduct => ({
  id: `idea-${n}`,
  type: "idea",
  title,
  priceUsdCents: CARD_PRICE_USD_CENTS.idea,
  driveFolderId,
  driveFileId,
  storageKey: `ideas/idea-${n}.pdf`,
  downloadName: `GoshBuzz - ${title} - ${pdfName}`.replace(/[\\/:*?"<>|]/g, "").slice(0, 150),
  ...(needsReview ? { needsReview: true } : {}),
});

const ideaProducts: DigitalProduct[] = [
  idea(1, "Crypto Spot Trading", "1ka_w5FZH1aO3aaSNZ9gsdrwbTpQ9cydf", "1N-uYpdu_9w6TsAagJChLykCFvj8FeR4-", "Crypto_Spot_Trading_Blueprint.pdf"),
  idea(2, "Blogging + AdSense", "1mF7Lx-__lXJQSi4-3GeGs6ctdWfjKWmY", "1IdLIlbVPfNVNTLmjVwzNBgUGr4u0NHoK", "Blogging_Asset_Blueprint.pdf"),
  idea(3, "E-commerce Multi-Platform", "1Erj8ZF-v40oyqi7iSnEmGijgoLP6esBX", "1y0iNZhNn4OAUvl1leheep77GN81MPNgX", "Pakistan_Global_E-Commerce_Blueprint.pdf"),
  idea(4, "Stock Market Investing", "1fAe3IiF64_Ev6O_m-_69q8Y08XjL6kRO", "1NX7Lom7uTLxTgyxeaD7hdFK_BUutdCV2", "The_5,000_PKR_Matrix_Escape.pdf"),
  idea(5, "Print on Demand + Digital Products", "1usKJ5TvPGI4vC8AUANESLYLkOVyaIjr3", "1hFK1RVBhKAE-XZ9ww3atmrLg6Hi-xrL-", "The_Passive_Design_Blueprint.pdf"),
  idea(6, "AI Chatbots + Voice Bots", "1lbVLcgxMUDMKhzEm8hkJtawbeivFwAiJ", "1qgRWLEyq56Pb8P5MxoR_XUbGuIqll1t-", "AI_Automation_Agency_Blueprint.pdf", true),
  idea(7, "Ad Management Agency", "1aB_KGMPUKk5d2ISbwRh7551XLROcbAyv", "1amsPvwTO2a1_9e3q0NSRf-ImnlFEJRcT", "Strategic_Ad_Agency_Blueprint.pdf"),
  idea(8, "Faceless YouTube Automation", "1iheA1vGPcQz82RREQIY4F4VTbtPEqNnr", "18VTeVDWAJ6y6YldO6Yo6r7DceqckOGr7", "Faceless_YouTube_Automation.pdf"),
  idea(9, "Tool Websites", "1JmAlvBFqFrqbk0SErKQcHbz7UDuMbnHk", "1xTy77WpHBC0Gq0oWo8EgDx43RfzSAcNy", "Tool_Site_Autopilot.pdf"),
  idea(10, "Freelancing Upwork", "1vsFMd54fUeBmsW7p9nsxSDwU5Hmd7gDB", "1EtU0GoP9nYGjTNtKrWwmNaTyBn4NGb4K", "Upwork_Mastery_Blueprint.pdf"),
  idea(11, "Amazon VA Services", "10rDMFXc1-47zQNfGDCzOd6kB5zvVCdPm", "1J59AlRB1BxGUchSOJrWC59uVr9Lk08of", "Amazon_FBA_Agency_Blueprint.pdf", true),
  idea(12, "Daraz Affiliate Marketing", "15AQikV-cPJdPFpyjPlJivHtjrVu9TsS-", "1OZKdxrA4BsEIAqmgQwJIYdYFSMqLB-Qa", "Daraz_Affiliate_Blueprint.pdf"),
  idea(13, "Social Media Management", "1MwSIneTUPeoKaDd0SMGbHebalCGW1yD5", "1Y6BhlMaYjDeAoe4obeGHd7igMK4AKOqF", "Six_Figure_SMM_Blueprint.pdf"),
  idea(14, "Online Course Creation", "1uQrw-v3nnfGfiWh1L2XuNzM0z4FqBOhL", "1bjegrGeE0964YllijudtHD1k8LQbFbQI", "The_Online_Course_Blueprint.pdf"),
  idea(15, "YouTube Shorts Monetization", "1Xn3ExjDeoCZz7Ed37ZfvNPkuQ_jfK5-W", "1slrFT0ykYQbXxVjHqhn0DV1Uq7-3NcYG", "Shorts_Mastery_Blueprint.pdf"),
  idea(16, "Instagram Theme Pages", "1XfdOhcrKK4GULWIxKAfthQOem4ZhMeo9", "1ff21ZKjMgiMeYAcq6iz2XKW-KTlJVtJb", "Digital_Real_Estate_Playbook.pdf", true),
  idea(17, "TikTok Creator Rewards", "18ayX97Vn_J8etUeSRApfdgsvMgCjxCxR", "16XZMxFPNrctSX0qvJ9PeMybhrLzPARzX", "TikTok_Viral_Payout_Blueprint.pdf"),
  idea(18, "Transcription + Translation", "1ny-_YhticVGvcnsbsCCBrE5Z4mGMRhfl", "1U3ZnmRxWpgwESYCyLGSm-IV-wfNTaCRs", "Urdu-English_Freelance_Blueprint.pdf"),
  idea(19, "SEO Services", "1ZkEKw4yi55-OkppuYCzu4yD_l4wbwD6S", "1EaGGYbYkg8JdvgeTIOLJj4k8kJWbwsI3", "Local_SEO_Business_Blueprint.pdf"),
  idea(20, "Canva Templates Etsy", "1FZyuS3vwViD72Bj3Goea0FQe9Kdrxs5l", "15m_Z3eb0scSXywCfAW8Om744vmy2rMHB", "Pakistani_Wedding_Etsy_Blueprint.pdf"),
  idea(21, "Video Editing Freelance", "1F2DSEnoirBsQd7f_qPn15wLC4GgXhKhV", "1KpIJJppEayCzYJsVtdIMjJe738ISP-GF", "Freelance_Video_Editing_Blueprint.pdf"),
  idea(22, "YouTube Thumbnail Design", "1us3_m5WJAzNpXIeQJF1C9VlPuzv_6nKI", "1IgGjzhZVZ_Fvxw53vjbOFh8-vpaZABde", "YouTube_Thumbnail_Business_Blueprint.pdf"),
  idea(23, "AI Content Writing", "1NoxkrKIZuywI_B0ZGB5OLHs49-z8QdWL", "1WipF8A1IsaHeKnqHCyfoc8qx3EuZTFkM", "The_AI_Writing_Agency.pdf"),
  idea(24, "Amazon KDP Publishing", "15Z3yd1cewYlNrFf9dUvo03drE-WTUHll", "1pH7JCqy-EVEbTY1EchAEbmjLveXyAlHF", "Amazon_KDP_Mastery.pdf"),
  idea(25, "Email Marketing Services", "1vv9BLAMskrY6Je_tWCfuLV-uo4s5640o", "15OZm75sBFnaB-p1HiT3JXGMoauRWbQ_j", "Email_Agency_Roadmap.pdf"),
  idea(26, "WordPress Development", "1PnMjMqcZrULoqSq4oplS7nsm7a6wkfPE", "1-4-9mYb_Ns_Zm2dGrpXoCCLVpUCP3TY0", "Six_Figure_No_Code_Mastery.pdf", true),
  idea(27, "Data Entry + Lead Gen", "1OO0F8dEh5ijf3HnSQpGX_wpHg0XIRtDt", "1KY_yx7B46QBG1a6R6QG3xOCDJ525rAkb", "Data_Entry_Lead_Gen_Blueprint.pdf"),
  idea(28, "Podcast Editing", "1jznn3dnSDrbP8mUHtBscpPcEmqaRAtK6", "1fsZbeAi3pHIZO6bKzdM7AbxI0UV0gjIK", "Podcast_Freelancing_Blueprint.pdf"),
  idea(29, "Real Estate Cold Calling", "1cBVzANsA9fJ0LMWZ_BEylKO0g-iHefGN", "12ESEYEkIJ7I0t5TYxdiqy4ysQcGgt88U", "Remote_Real_Estate_ISA_Roadmap.pdf"),
  idea(30, "No-Code SaaS", "135WyQ6nPr2UVzL-RpF-17biJDSIRFkVf", "1GOy1_1cTRwW8Lieuzk34oG8ex7FTqd9K", "No-Code_SaaS_Blueprint.pdf"),
];

/** Skills: one HTML page each in Drive. Converted to PDF by scripts/apps-script (skills).
 *  Not in the sync script: the source is HTML, not a PDF. */
const skill = (
  n: number,
  title: string,
  driveFolderId: string,
  driveFileId: string,
): DigitalProduct => ({
  id: `skill-${n}`,
  type: "skill",
  title,
  priceUsdCents: CARD_PRICE_USD_CENTS.skill,
  driveFolderId,
  driveFileId,
  storageKey: `skills/skill-${n}.pdf`,
  downloadName: `GoshBuzz - ${title} - Skill Guide.pdf`.replace(/[\\/:*?"<>|]/g, "").slice(0, 150),
});

const skillProducts: DigitalProduct[] = [
  skill(1, "Sales Skill Mastery", "11lSuh9_55cnRRklMesMomyxD7P5O-ZXB", "1WIfd6hR3Epgcw-5SiOFqrmP0TdymqSdu"),
  skill(2, "Communication Skill Mastery", "1tUyqu_ZY-Ktvr8u1kaBItwzIIDEgHQ5b", "1qZuU0t1w1Bn8iSI3ypAXZua5BEH67ANU"),
  skill(3, "Self-Discipline Mastery", "1E1T1BhlF5UzaUFWn4EIjBNfuYzL628PK", "13bll_ja9mE0u-Apv3yoKm1NB92MVbHgc"),
  skill(4, "AI Fundamentals Mastery", "1iMYlFx9jSjMSewau45nx4zoFdcSsJzdA", "1dFGTnjfY70MofjXD9EIU-vns6R6Hub0c"),
  skill(5, "CRM Automation Mastery", "1FmMI_Cr8vJkvkTZb949E54eZ7hN5BNjr", "1h3rjb38zS9497P2PPM1P9ZZ74ofzC7r-"),
  skill(6, "QuickBooks Financial Control", "1HJpuYyfOqMT6KCFmB05p-vhK0L6wKBqK", "1WC50iBSzdR3nS22gKAHFNtOBqET7n6XV"),
  skill(7, "Excel & Dashboards Mastery", "1w90O4yWj1oBqzR92X235v9pwtzWIXpbV", "1ikvO1uLLxZQf1vvN7bktJ4m7Lx9vx7nS"),
  skill(8, "Data Analysis Mastery", "1TEBUUUokjZgmf8qSYXIJptMrkPghfRi-", "1k7dDw085J4sLlO06ORHkaNVw8WvnCvve"),
  skill(9, "Chatbot & Voice Bot Development", "1wGXVUYF5Yn5QGGIjGa9KpRk0NwgzPCEI", "1R-ZGh91wbefd2T1vW_EioeCJFwCHgiua"),
  skill(10, "AI-Powered Development", "1MV_th6E7hPrnir99p9T-qbSAV-dOwjHK", "1t8xeidh3gPhKE5ivDuMZxbi7-Hmpg0Dq"),
  skill(11, "Copywriting Mastery", "1dexSp8yFE_IYBD4ljCMjmu5L4GAHLZes", "1hnG5xP6nn5eD2Oii7S8o2M-9t2vmdAnR"),
  skill(12, "Video Editing Mastery", "1O9RhWw2sgTmXJ5qwDn2SksqRoxHvYtlL", "14h0LT87903PU5StS9MG75vlOut5Busu0"),
  skill(13, "SEO & Keyword Research", "1XyRIJ7fNdSta_sK-d2UNDhjW6KS6DoEq", "1L7mlwGKtaZXwVAJuGtU-Orb173oOCsXz"),
  skill(14, "Graphic Design & Visuals", "1gJYtGWIDg9UN_FBrG3XBWcjdP-BMvgi2", "179lYTUu044CUTRvuiQe2Bya7hzcgiXFl"),
  skill(15, "Public Speaking & On-Camera", "1QvxXSnZL2K_aEA8h7rOw6Nlnme-hYTFI", "1bemq9KMGxL3aSlHBhCwvychNSwnVpv5k"),
  skill(16, "Negotiation Tactics", "1GRFlDzscqYROEx8hz_-1Ol_qHVD-9O30", "1VoKydskn1mLwOSZYnJfnPZ6N6e0xqogs"),
  skill(17, "Email Marketing Mastery", "1NvcldNwXTPgU1s5gLVfWhywkmEqdaGN5", "1uiRsxya0kgC2-JJc7P7RGb_QBSXNq-O7"),
  skill(18, "Social Media Advertising", "1_hNsTihHbAzc6cmsq2B3VQdT1PV_opzx", "1AOgOdXfFk-oSdgjg_95aqXkArnODnUim"),
  skill(19, "Content Strategy Mastery", "1vbfS3_zm_I16uVpY3-hcf4yRBVIu-AWk", "1tG7_x4G7PqD7UQ-7KJuTj4dKfoKdalO0"),
  skill(20, "Project Management Mastery", "133JP8IR6P_kmqkQV_bHpM61r0--hvzk0", "14iRFpCX3r9-15MSrxHuWR1LEr1xo7kqi"),
  skill(21, "Financial Literacy for Freelancers", "1TzjATctIgTtu9wzmlHlsAZBk9ktJvOqV", "1IG0RmIzDw0ggn8x03Cj1i9X2SaIqg6LH"),
  skill(22, "LinkedIn Networking Masterclass", "1nL7un_gUNELM7XZq3XoapmF8gQRQa0bz", "1I0DMNg6ZJbmKU22RfuG0Uk7kA7z-Omtx"),
  skill(23, "Cold Outreach Mastery", "1d4CAjc0szAoIAogbBgsp5tESOypNPCFM", "1Vy1eTz1QbJ-1VXonYgDfHmEK9869wR_s"),
  skill(24, "Prompt Engineering Mastery", "1Kgi9OEcZPdFEGBOY7UCKLQ2k6lUWHtVL", "1Uo-jQG7PDel1GC7YYGksY0C_aFGDXKCX"),
  skill(25, "Web Scraping Mastery", "1JXUnhv3R2NGmHsK4tGYQEgZjRz_U3TMN", "19wyP01wdyNVXDAUkL9xk6dhh39z89rsh"),
  skill(26, "API Integration Mastery", "1c1eUibwoiY3vBOeFeXIAA8DnSupy_3Wj", "1oT8qhFG1i3ABTtCPGCtp5ciwzUkKIrjT"),
  skill(27, "UI/UX Design Principles", "1_KlZ47q3w0WnU95x9Wtu99s4BFozMGmZ", "1m3r0kVLI1Y97IeKkQg2j9aObDmHOoD9I"),
  skill(28, "Personal Branding Mastery", "1xv7joW1tV6woGPWco4rMDf8EvwyYYjnG", "1nT91BUE6ZHGRKDlzdbilpMlPQBZBzh1J"),
  skill(29, "Time Management Mastery", "1YpQ5PTjFKGl_HqGztAo5_emVGU2OAay_", "1D5mpRsbXHnt-854C3FdIZdSnAoU63Ur8"),
  skill(30, "Leadership & Delegation", "1p4w_7s0Rv1OFT8yGOgOGLU1l7s9-h45n", "1o2Jxi5HBA1-Iro2NNEOkvS3W2ioxHXK9"),
];

export const digitalProducts: DigitalProduct[] = [...ideaProducts, ...skillProducts];

const byId = new Map(digitalProducts.map((p) => [p.id, p]));

export function findDigitalProduct(id: string): DigitalProduct | undefined {
  return byId.get(id);
}

/** Validates a cart of product IDs from a client request. Throws a readable Error on any problem. */
export function resolveCart(productIds: unknown): DigitalProduct[] {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new CartError("Your cart is empty.");
  }
  if (productIds.length > 20) {
    throw new CartError("Please check out at most 20 guides at a time.");
  }
  const seen = new Set<string>();
  const items: DigitalProduct[] = [];
  for (const raw of productIds) {
    if (typeof raw !== "string") throw new CartError("Invalid product in cart.");
    if (seen.has(raw)) continue;
    seen.add(raw);
    const product = findDigitalProduct(raw);
    if (!product) {
      throw new CartError(`"${raw}" is not available for card payment yet. Use WhatsApp checkout for it.`);
    }
    items.push(product);
  }
  return items;
}

export class CartError extends Error {}
