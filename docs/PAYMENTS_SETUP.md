# Card payments and automatic PDF delivery: setup guide

What happens after this is set up:

1. A customer adds ideas to the cart on `/checkout` and clicks **Pay by card**.
2. Stripe's secure page takes the card payment in **USD**. Same price for everyone.
3. Stripe tells GoshBuzz (webhook). GoshBuzz verifies the signature and emails the buyer
   **download links**, one per guide.
4. The link opens `/api/download`, which checks the signed link and redirects to a PDF in a
   **private** Supabase Storage bucket. The link is valid for a set number of days (default 7).

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

## Part B. Supabase Storage (private PDFs) and the Drive copy script

Your PDFs stay in Google Drive (your master copy). A **private** Supabase Storage bucket holds the copy customers download. Supabase's free plan needs no card. Google is used only on your computer, to read the Drive folder.

### B1. Create the Supabase project
1. Go to **supabase.com**, sign up (GitHub or email), and click **New project**.
   - Name: `goshbuzz`
   - Region: the closest to your buyers (Mumbai or Singapore)
   - Database password: generate one and save it in a password manager. The app doesn't use it.
   - Plan: **Free**
2. **Storage → New bucket:** name `deliverables`, **Public bucket: OFF**.
3. **Get the Project URL:** Project Settings → **Data API** (or the Connect button), and copy the **Project URL** (`https://xxxx.supabase.co`).
4. **Get the secret key:** Project Settings → **API Keys**, section **Secret keys**. Click the copy icon next to the key (it starts with `sb_secret_`). Keep it secret. Never paste it into chat, a `VITE_` variable, or a file in Git.
   - If the script later fails with a 401 or "Invalid JWT" error, use the legacy **service_role** key from the **Legacy anon, service_role API keys** tab instead, and put it in the same `SUPABASE_SERVICE_ROLE_KEY` variable.
   - Never use the **Publishable** key for this. It's for browsers and can't upload.

### B2. Google Drive read access (free, no billing)
1. Go to **console.cloud.google.com**, sign in, and create a project named `goshbuzz-delivery`. No billing account is needed.
2. Enable the **Google Drive API** (APIs & Services → Library).
3. **IAM & Admin → Service accounts → Create** a service account named `goshbuzz-drive-reader`. No roles are needed.
4. Open it → **Keys → Add key → Create new key → JSON**. A file downloads. Keep it private.
5. Copy the service account **email** (ends in `.iam.gserviceaccount.com`).
6. In Google Drive, open **"30 Ideas of Escaping out of Matrix"**, click **Share**, add that email as **Viewer**, and untick "Notify people".

### B3. Run the copy script (on your computer, once)
The script copies each PDF from Drive into the bucket as `ideas/idea-N.pdf`, checks that it is really a PDF, and skips files already uploaded.

1. Get the code: `git clone https://github.com/goshbuzz/GoshBuzz.git`, then `cd GoshBuzz` and `git checkout arena/93f9f889-goshbuzz`. Needs Node 22 or newer.
2. Run `npm install`.
3. Create a file named **`.env.local`** in the GoshBuzz folder (git ignores it). Fill it in:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...your_secret_key
   DELIVERY_BUCKET=deliverables
   GCP_SERVICE_ACCOUNT_JSON={"type":"service_account", ...the whole key file, on ONE line...}
   ```
4. Run `npm run sync:drive`. It should end with `Done. copied=30 skipped=0 total=30`.
5. To re-copy everything after a PDF changes: `npm run sync:drive -- --force`.

If you see `Drive returned 404` or `403`, the folder isn't shared with the service account email (step B2.6).

### B4. Easier alternative: copy with Google Apps Script (no Google Cloud, no command line)

If the Google Cloud and command-line steps (B2 and B3) are too much, use `scripts/apps-script/Code.gs`. It runs inside your own Google account, so it can read the Drive folder you already own. It needs no service-account key and no Node.js.

1. Go to **script.google.com**, click **New project**, and name it `GoshBuzz PDF copy`.
2. Replace the code in `Code.gs` with the contents of `scripts/apps-script/Code.gs` from the repo, then save.
3. **Project Settings (gear icon) → Script properties**, and add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your secret key (`sb_secret_...`)
   - `DELIVERY_BUCKET` = `deliverables` (optional, this is the default)
4. Choose `checkConnection` from the function list and click **Run**. Approve the permissions. The log should say `Connected`.
5. Choose `uploadIdeaPdfs` and click **Run**. Watch the log for 30 `copy` lines ending with `Done. copied=30`. If it stops early with `Time limit reached`, run it again. It skips files already uploaded.

Apps Script is free for personal Google accounts. Keep the project private, because the secret key is stored there.

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
| `SUPABASE_URL` | your Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | the secret key (`sb_secret_...`), or the legacy service_role key as a fallback (secret; server only) |
| `DELIVERY_BUCKET` | `deliverables` (your private bucket name) |
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
- The emailed link goes through your site (`/api/download`) and then to Supabase Storage. Vercel's response-size limit (4.5 MB) is why the PDFs aren't streamed through the site.

## What is verified in code vs. what needs a live check

- Verified by automated tests in the repository (`npm run test:payments`): link signing and expiry, cart validation, Stripe signature check, catalog integrity, and the rejection paths of all three endpoints.
- **Not verified here** (needs your live accounts, in test mode first): a real Stripe checkout, the webhook receiving live payloads on Vercel, Supabase signed links, and Resend delivery to inboxes. Part F tests all of these.
