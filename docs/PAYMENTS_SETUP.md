# Card payments and automatic PDF delivery: setup guide

What happens after this is set up:

1. A customer adds ideas to the cart on `/checkout` and clicks **Pay by card**.
2. Stripe's secure page takes the card payment in **USD**. Same price for everyone.
3. Stripe tells GoshBuzz (webhook). GoshBuzz verifies the signature and emails the buyer
   **download links**, one per guide.
4. The link opens `/api/download`, which checks the signed link and redirects to a PDF in a
   **private** Google Cloud Storage bucket. The link is valid for a set number of days (default 7).

WhatsApp and JazzCash/EasyPaisa checkout keep working alongside card payments.

> Never paste secret keys (Stripe, Google service account, Resend) into chat, email, or Git.
> Put them only in Vercel environment variables and in the git-ignored `.env.local` on your computer.

---

## Decisions to confirm before going live

| # | Decision | Current setting | Why it matters |
|---|---|---|---|
| 1 | **Card price** | **$2.30** per idea (`src/data/cardPricing.ts`) | Nets about **PKR 509** per sale in the worst case (international card + currency conversion + USD→PKR payout). |
| 2 | **Same price everywhere?** | Card: $2.30 (about Rs. 637 at 277). WhatsApp/JazzCash: still **Rs. 500** | You asked for the same amount for everyone. Right now a Pakistani buyer sees Rs. 500 on WhatsApp and about Rs. 637 by card. Options: (a) raise the WhatsApp/JazzCash price to about Rs. 637; (b) keep Rs. 500 and charge **$1.80**, which nets only about **PKR 381** worst case; (c) test charging **PKR 500** directly through Stripe (PKR is on Stripe's currency list, but availability for a US account needs checking in your dashboard). |
| 3 | **Skills (Rs. 200)** | Not sold by card: no PDFs in Drive yet | My search found no PDFs in any of the 30 skill folders. They contain HTML pages, images and some spreadsheets or Google Docs. Either add PDFs, or I can export them. Suggested card price: **$1.10** (nets about PKR 201). |
| 4 | **PDFs to double-check** | Folder and file name disagree for: idea 6 (Chatbot folder has `AI_Automation_Agency_Blueprint.pdf`), idea 11 (Amazon VA folder has `Amazon_FBA_Agency_Blueprint.pdf`), idea 16 (Instagram Theme folder has `Digital_Real_Estate_Playbook.pdf`), idea 26 (WordPress folder has `Six_Figure_No_Code_Mastery.pdf`) | Customers will get whichever PDF is mapped. Confirm these four. |
| 5 | **Delivery** | Email with a private, expiring link (as you asked) | Attachments are too large for email. Files are about 9–24 MB each. |

### Price math (for transparency)

Stripe standard: 2.9% + 30¢ per card; +1.5% for international cards; +1% if currency conversion is needed
([Stripe pricing](https://stripe.com/pricing)). Exchange rate used: **277 PKR/USD** (12 Oct 2026).
Assumed USD→PKR payout cost: 2%.

| USD price | Net PKR, international card (worst case) | Net PKR, domestic US card |
|---|---|---|
| $1.80 | 381 | 393 |
| **$2.30 (idea)** | **509** | **525** |
| $1.10 (skill, later) | 201 | 209 |

---

## Part A. Stripe with your US LLC

Stripe does not support Pakistan-based businesses. Your US LLC can apply, so Stripe must be opened in the LLC's name.

1. **Confirm your LLC:** you need its exact legal name, state, and EIN. If you don't have an EIN, get one free at **irs.gov → "Apply for an EIN"**. Non-US owners may need the phone or mail process; check the IRS page for your case.
2. **Open a US business bank account in the LLC's name** (for example Mercury or Relay). Check each bank's requirements for non-US owners. Stripe pays out to this account in USD.
3. **Apply to Stripe:** go to **dashboard.stripe.com/register**
   - Country: **United States**
   - Business type: **LLC**
   - Enter the EIN, business address, owner details, and bank account.
   - Website: `https://goshbuzz.com`
   - Description: "Sale of digital PDF guides (digital goods), delivered by email."
   - Expect identity checks (passport, selfie) and possibly extra questions about owners or tax forms.
   - Approval is not guaranteed for a Pakistan-resident owner. If Stripe declines, the fallback is a merchant-of-record service such as Lemon Squeezy, which needs a different integration.
4. **Stay in test mode** until everything works. In the dashboard, go to **Developers → API keys** and copy the **Secret key** (`sk_test_...`). You'll put it in Vercel in Part D.
5. Turn on **Card** payments (on by default). Leave "Adaptive pricing" **off**, since we charge in USD.

## Part B. Google Cloud: private PDF storage and the Drive copy

Your PDFs stay in Drive (your master copy). A private bucket holds the copy that customers download.

1. Go to **console.cloud.google.com**, sign in with your Google account, and create a project called **goshbuzz-delivery**.
2. Enable these two APIs (APIs & Services → Library): **Cloud Storage API** and **Google Drive API**.
3. Create a bucket (Cloud Storage → Buckets → Create):
   - Name: **goshbuzz-deliverables** (must be globally unique; if taken, pick another and use it in Part D)
   - Location: **us-central1** (or any region)
   - **Public access prevention: Enforced** (this keeps the PDFs private)
4. Create a service account (IAM & Admin → Service accounts → Create):
   - Name: **goshbuzz-delivery**
   - Grant it **Storage Object Admin** on the bucket (bucket → Permissions → Grant access).
5. Create a key: open the service account → **Keys → Add key → Create new key → JSON**. A file downloads. **Keep it private**, and don't commit it.
6. Copy the service account **email** (ends with `.iam.gserviceaccount.com`).
7. In Google Drive, open the folder **"30 Ideas of Escaping out of Matrix"**, click Share, add that email as **Viewer**, and untick "Notify people". This gives the sync script read access to the PDFs.
8. **Copy the PDFs into the bucket** (run once on your computer, and again if a PDF changes):
   ```bash
   git clone https://github.com/goshbuzz/GoshBuzz.git && cd GoshBuzz   # or use your existing copy
   git checkout arena/93f9f889-goshbuzz
   npm install
   # create .env.local (git-ignored) with these two lines, filled in:
   #   DELIVERY_BUCKET=goshbuzz-deliverables
   #   GCP_SERVICE_ACCOUNT_JSON={"type":"service_account",...paste the whole key file on ONE line...}
   npm run sync:drive            # copies the 30 idea PDFs; skips ones already there
   npm run sync:drive -- --force # re-copy everything after a PDF changes
   ```
   Expected output ends with `Done. copied=30 skipped=0 total=30`. If it says Drive returned 404 or 403, the folder isn't shared with the service account (step 7).

## Part C. Email (Resend): free, no paid mailbox needed

You do **not** need to buy any email plan (Hostinger or other). Resend sends the delivery emails from its own servers. You only add a few DNS records to prove you own `goshbuzz.com`. Resend's free plan covers 3,000 emails a month (max 100 a day) with one custom domain. ([Resend pricing](https://resend.com/pricing))

1. Sign up at **resend.com** (free, no card). Sign in with Google or email.
2. **Domains → Add Domain →** type `goshbuzz.com`. Choose the region closest to your buyers (any is fine).
3. Resend shows about three DNS records. **Copy them exactly from Resend's screen**. They look like this:

   | Type | Name (host) | Value |
   |---|---|---|
   | TXT | `resend._domainkey` | long key starting with `p=MIG...` (from Resend) |
   | MX | `send` | `feedback-smtp.<region>.amazonses.com`, priority `10` (from Resend) |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` (from Resend) |

4. Add them in the DNS panel where `goshbuzz.com` DNS is managed. This is wherever you set the domain's DNS records (your registrar or hosting panel, which may be Hostinger).
   - **Name field:** type only the part before the domain (`resend._domainkey`, `send`). Many panels add `.goshbuzz.com` automatically. Pasting the full name doubles it.
   - **Do not edit or delete** any existing records. Resend's records only use the `send` and `resend._domainkey` names, so your root domain is untouched.
   - **Do not** create or change root (`@`) MX records.
5. Back in Resend, click **Verify DNS records**. It usually passes within minutes; it can take up to a few hours.
6. **API Keys → Create API Key**: name `goshbuzz-delivery`, permission **Sending access**, domain `goshbuzz.com`. Copy the key (`re_...`) **once**, and store it in a password manager.
7. Set the sender to any address on your verified domain, for example `orders@goshbuzz.com`. Replies need a real inbox: because `goshbuzz.com` has no mailbox, set `EMAIL_REPLY_TO` to your **Gmail** address, so customers who reply reach you.

## Part D. Vercel environment variables

Vercel → your project → **Settings → Environment Variables**. Add each one for **Production** and **Preview**:

| Name | Value |
|---|---|
| `SITE_URL` | `https://goshbuzz.com` |
| `STRIPE_SECRET_KEY` | `sk_test_...` now; `sk_live_...` after going live |
| `STRIPE_WEBHOOK_SECRET` | from Part E |
| `DOWNLOAD_TOKEN_SECRET` | 64 random hex characters: run `openssl rand -hex 32` |
| `DOWNLOAD_LINK_DAYS` | `7` (1 to 30) |
| `GCP_SERVICE_ACCOUNT_JSON` | the whole service-account JSON key, on one line |
| `DELIVERY_BUCKET` | `goshbuzz-deliverables` (or your bucket name) |
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `GoshBuzz <orders@goshbuzz.com>` |
| `EMAIL_REPLY_TO` | **your Gmail address**, so customer replies reach you (there is no mailbox on goshbuzz.com) |

Then **redeploy** (Deployments → Redeploy). The new `api/` functions deploy with the site.

## Part E. Stripe webhook

1. Stripe Dashboard (test mode) → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://goshbuzz.com/api/stripe-webhook`
3. Events to send: **checkout.session.completed** (only this one).
4. Click the endpoint → **Signing secret → Reveal** (`whsec_...`). Put it in Vercel as `STRIPE_WEBHOOK_SECRET`, then redeploy.

## Part F. Test with a fake card (test mode)

1. On goshbuzz.com, add one idea to the cart → **Checkout** → **Pay by card**.
2. On Stripe's page, use card **4242 4242 4242 4242**, any future expiry, any CVC, any postcode. Use your own email.
3. You should be redirected back with the "Payment received" message. Within about a minute, the email arrives (check spam). Click the link: the PDF should download.
4. In Stripe: **Developers → Webhooks → your endpoint**. Recent deliveries should show **200**.
5. If the email doesn't arrive, check the **Vercel → Logs** tab for `stripe-webhook` and `Delivery failed` messages.

## Part G. Go live

1. Finish Stripe **account activation** (business details and bank account).
2. In **live mode**, add the same webhook endpoint and copy its new **live** signing secret.
3. In Vercel, replace `STRIPE_SECRET_KEY` (`sk_live_...`) and `STRIPE_WEBHOOK_SECRET` (live `whsec_...`). Redeploy.
4. Make one real purchase with your own card, check the email, then refund yourself in Stripe.

## Part H. Money, tax and paperwork (talk to professionals)

- **Stripe pays out in USD** to your US LLC bank. Moving that money to Pakistan (Payoneer, Wise, or a bank) has its own fees and State Bank of Pakistan rules. Ask a Pakistani chartered accountant or tax consultant how to register (NTN) and report this income.
- **US tax:** a single-member LLC owned by a non-US person usually must file **IRS Form 5472** (with a pro-forma Form 1120), even with no US income. Penalties for missing it are significant. Ask a US CPA.
- Update your **Refund Policy** and **Delivery Policy** pages to describe automatic email delivery and the link validity period.

## Known limits (be aware)

- Links work for `DOWNLOAD_LINK_DAYS`, then expire. Customers who lose the email need a new link. For now, that means reply by WhatsApp or email and we re-send it manually.
- Anyone who gets a valid link can download the PDF until it expires. Links are not tied to one person.
- Cart limit: 20 guides per card order.
- Card acceptance: some Pakistani debit cards are not enabled for international online purchases. Those buyers can still use WhatsApp/JazzCash.
- The emailed link goes through your site (`/api/download`) and then to Google Cloud. Vercel's response-size limit (4.5 MB) is why the PDFs aren't streamed through the site.

## What is verified in code vs. what needs a live check

- Verified by automated tests in the repository (`npm run test:payments`): link signing and expiry, cart validation, Stripe signature check, catalog integrity, and the rejection paths of all three endpoints.
- **Not verified here** (needs your live accounts, in test mode first): a real Stripe checkout, the webhook receiving live payloads on Vercel, Google Cloud signed links, and Resend delivery to inboxes. Part F tests all of these.
