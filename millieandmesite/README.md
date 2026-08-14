# Millie & Me — Rental Booking Site

Replaces the Shopify rental flow with a real availability calendar, Stripe
checkout, and an admin dashboard for managing bookings and blocking dates.

## Stack

- **Frontend:** plain HTML/CSS/JS (no build step) in `public/`
- **Backend:** Netlify Functions in `netlify/functions/`
- **Database:** Postgres via Netlify DB (Neon) — tracks items and bookings, prevents double-booking
- **Payments:** Stripe Checkout (redirect-based, so card data never touches this app directly)

## One-time setup

### 1. Create the Netlify site

- Push this folder to a GitHub repo (or drag-and-drop deploy at app.netlify.com — but you'll
  want Git-based deploys if you plan to keep editing it).
- In Netlify: **Add new site → Import from Git**, select the repo. Build settings are already
  set in `netlify.toml` (publish = `public`, functions = `netlify/functions`).

### 2. Provision the database

- In your Netlify site dashboard: **Extensions → Netlify DB** (or **Integrations → Neon**),
  click "Provision database." This automatically sets a `NETLIFY_DATABASE_URL` environment
  variable on your site — the functions in this project already look for it.
- Open the database's SQL console (or connect with `psql`) and run, in order:
  1. `db/schema.sql`
  2. `db/seed.sql` (seeds 10 items pulled from your current Shopify catalog — see note below)

### 3. Set up Stripe

- Create a Stripe account (or use your existing one) at stripe.com.
- Grab your **secret key** (Developers → API keys) and add it to Netlify as the environment
  variable `STRIPE_SECRET_KEY` (Site settings → Environment variables).
- After your first deploy, go to Stripe → Developers → Webhooks → Add endpoint:
  - URL: `https://<your-site>.netlify.app/.netlify/functions/stripe-webhook`
  - Events to send: `checkout.session.completed`, `checkout.session.expired`
  - Copy the **signing secret** it gives you into Netlify as `STRIPE_WEBHOOK_SECRET`.

### 4. Set an admin password

- Add an environment variable `ADMIN_PASSWORD` in Netlify (any password you choose). This
  protects `/admin.html`, where you'll view bookings and block off dates.

### 5. Deploy

- Trigger a deploy (push to your repo, or "Trigger deploy" in Netlify). That's it — your
  catalog, live availability calendar, checkout, and admin dashboard are all live.

## Important notes before you fully cut over from Shopify

- **Only 10 items were seeded.** Your Shopify store had more products than what I pulled in
  this session — before going live, export your full catalog and add the rest to `db/seed.sql`
  (or I can pull the rest and hand you an updated seed file).
- **All 10 seeded items were "archived" in Shopify**, meaning they weren't even visible on your
  storefront. Double check pricing/descriptions are current before publishing.
- **Retail (non-rental) items** — this build only handles date-based rentals. If you still want
  to sell 2nd-hand items outright (no calendar needed), that's a simpler add — a plain product
  list with a "Buy Now" Stripe Checkout link, no availability logic required. Let me know if you
  want that added.
- **Admin password** is intentionally simple for a fast MVP — it's a single shared password, not
  individual staff logins. Fine to start with; worth upgrading to real authentication
  (Netlify Identity or similar) before handing access to multiple staff members.
- **Pending bookings that never pay** will sit as `pending` and block those dates until the
  Stripe session expires (Stripe's default checkout session expiry is 24 hours) and the
  `checkout.session.expired` webhook fires to release them.
- **Delivery/pickup logistics** aren't modeled here (this only handles the booking + payment).
  If Millie & Me's rentals require you to coordinate drop-off/pick-up manually today, that
  workflow stays the same — you'll just see confirmed bookings in `/admin.html` with dates and
  contact info to work from.

## Local development

```
npm install
npx netlify dev
```

This runs the functions and static site locally (requires the Netlify CLI: `npm i -g netlify-cli`)
and will pick up environment variables from `netlify env:pull` or a local `.env` file.
