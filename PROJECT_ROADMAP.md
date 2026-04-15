# TX Localist — Full Project Roadmap to Launch

_Generated April 15, 2026_

This roadmap inspects the current repo, the project scope in the project instructions, and maps out every phase required to take **the website** from its current state to a production launch. The mobile app is intentionally kept out of scope here and earmarked for a later phase.

---

## 1. Current State Audit

### Stack (good foundation, keep it)
- **Framework:** Next.js 16 (App Router) + React 19
- **DB:** PostgreSQL (Neon serverless) via Prisma 7
- **Auth:** Custom session-based auth (User / Session models, bcrypt-style password hashing via `src/lib/auth`)
- **State:** Zustand (referenced in the commented-out `/results` code)
- **Fonts / UI:** Space Grotesk, Shrikhand, Bungee, Geist Mono; retro Texas color palette in `src/app/globals.css`
- **Assets:** Brand logos present in `/public` and `src/app/assets`

### What's built
- `/` homepage — **styled, final direction**
- `/results` — **styled, final direction** (uses a `ResultsExperience.jsx` client component; legacy commented version wired to Gemini AI + Google Maps)
- `/login`, `/signup`, `/dashboard`, `/dashboard/events/new`, `/admin`, `/events` — functional skeletons, not yet styled to match brand
- Prisma models: `User`, `Session`, `Event`, `Tag` (with a seed script for event tags)
- Server actions for auth, events, tags

### Critical gaps vs. the business scope
The current schema is built around **Events**, but the business model in the project instructions is a **paid business directory with month-to-month subscriptions, favorites, and job postings**. The `Event` model and related UI will need to be renamed / refactored to `Business` (or `Listing`) before going much further. Doing this now avoids a painful rename later.

Other gaps:
- No subscription / billing layer (Stripe)
- No listing tiers (Free, Tier 1, Tier 2, …)
- No `Favorite` / saved-business model or UI for "Localists"
- No `Job` model or job-posting UI
- No categories (separate from tags)
- No image upload pipeline (currently expects raw image URLs)
- No email provider (transactional + receipts)
- No slug-based SEO URLs (`/business/[city]/[slug]`)
- No public city or category landing pages
- No search index beyond basic Prisma `where` clauses
- No analytics, error tracking, legal pages, or sitemap/robots
- Two separate CSS root files (`globals.css` and `results/globals.css`) — design tokens should be consolidated

---

## 2. Recommended Structural / Code Changes (do these early)

These are the refactors that pay for themselves across every later phase.

**2.1 Rename `Event` → `Business` (or `Listing`)**
Update Prisma model, server actions (`actions/events.js` → `actions/businesses.js`), routes (`/events` → `/businesses`, `/dashboard/events/new` → `/dashboard/businesses/new`). Add a migration; don't do a `prisma db push` destructively once real data exists.

**2.2 Add proper domain models** (detailed in Phase 2)
`Business`, `Category`, `Tag`, `Plan` (tier), `Subscription`, `Favorite`, `Job`, `Photo`, `City`.

**2.3 Consolidate design tokens**
Move the shared palette, fonts, and the "retro" primitives into **one** `globals.css`. Keep `home.module.css` and the results styles as page-level overrides only. Delete duplicated `:root` blocks.

**2.4 Introduce a shared component library**
Create `src/components/` with: `Navbar`, `Footer`, `BusinessCard`, `SearchBar`, `Badge`, `Button`, `Input`, `Container`, `Section`. Both `/` and `/results` currently duplicate nav, footer, feature strip, and card markup — extracting them now prevents drift while the rest of the site is built.

**2.5 Add a `/business/[slug]` detail route**
Every directory needs a canonical listing page. Use slug (business-name-city) for SEO.

**2.6 Route map to build toward**
```
/                           Home
/search                     (alias: /results) public search
/cities                     All Texas cities index
/cities/[city]              City landing page
/categories/[category]      Category landing page
/business/[slug]            Listing detail page
/favorites                  Saved by the signed-in Localist
/jobs                       Job board (all cities)
/jobs/[jobId]               Single job
/post-your-business         Marketing + tier picker
/pricing                    Pricing tiers
/dashboard                  Owner dashboard
/dashboard/listings         Owner's businesses
/dashboard/listings/new     Create listing
/dashboard/listings/[id]/edit
/dashboard/billing          Subscription management
/dashboard/jobs             Owner job postings
/admin                      Admin dashboard
/admin/listings             Moderation queue
/admin/users                User management
/login, /signup, /logout
/about, /contact, /privacy, /terms
/sitemap.xml, /robots.txt
```

**2.7 Environment variables to plan for**
`DATABASE_URL`, `SESSION_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PK`, `RESEND_API_KEY` (or Postmark), `UPLOADTHING_TOKEN` (or Cloudinary), `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_SITE_URL`.

**2.8 Folder structure target**
```
src/
  app/                 routes only
  components/          shared UI
  features/            domain logic (businesses, billing, favorites, jobs, search)
  lib/                 auth, prisma, stripe, mail, uploads, slugify
  styles/              (optional) partials, if globals.css grows
  hooks/
  store/               zustand stores
```

---

## 3. Phased Launch Plan

Each phase has exit criteria. Do not move on until they're met.

### Phase 0 — Foundations & Cleanup (1 week)
**Goal:** Get the repo ready to safely build on.
- Consolidate `globals.css`; delete the duplicate `:root` in `results/globals.css`
- Extract shared `Navbar` + `Footer` + `BusinessCard` + `SearchBar` components
- Remove the giant commented-out block in `src/app/results/page.js`
- Add Prettier + stricter ESLint rules; add a `lint` pre-commit via Husky
- Add Sentry (free tier) + PostHog (or Plausible)
- Add `.env.example` covering every key in §2.7
- Add CI (GitHub Actions): install, lint, `prisma validate`, `next build`
- Decide hosting now: **Vercel + Neon** is the simplest path
- Add a `CHANGELOG.md`

**Exit criteria:** CI is green on main, no duplicated components, design tokens live in one place.

---

### Phase 1 — Data Model Refactor (1 week)
**Goal:** Replace the Event-centric schema with the real business-directory schema.

Refactor Prisma to roughly:
```
User            id, email, passwordHash, role (USER | OWNER | ADMIN), name, avatarUrl, ...
Business        id, slug (unique), ownerId, name, description, phone, email,
                website, address, addressName, zip, city, state, country,
                lat, lng, planId, status (DRAFT | ACTIVE | PAUSED | SUSPENDED),
                publishedAt, createdAt, updatedAt
Photo           id, businessId, url, order, alt
Category        id, name, slug (unique)            // top-level taxonomy
Tag             id, name, slug (unique)            // free-form keywords
BusinessCategory (M:N join)
BusinessTag      (M:N join)
SocialLink      id, businessId, platform, url
Plan            id, name, slug, priceCents, features (Json), tier (FREE|TIER1|TIER2|TIER3)
Subscription    id, businessId, stripeCustomerId, stripeSubId, status,
                currentPeriodEnd, cancelAtPeriodEnd, planId
Favorite        id, userId, businessId            // unique(userId, businessId)
Job             id, businessId, title, description, employmentType,
                salaryMin, salaryMax, isRemote, applyUrl, expiresAt, status
City            id, name, slug, state             // pre-seeded TX cities
AuditLog        id, actorId, action, entity, entityId, meta, createdAt
```
Indexes: `Business(city, state)`, `Business(slug)`, `Subscription(status)`, `Favorite(userId)`, `Job(businessId, status)`.

Write a **migration** (not `db push`) plus a data migration to copy any demo `Event` rows into `Business`. Seed scripts for Cities (top 100 TX cities), Categories, and sample Plans.

**Exit criteria:** `prisma migrate` runs clean on a fresh DB, seed scripts produce a browsable dev dataset.

---

### Phase 2 — Public Directory (2–3 weeks)
**Goal:** Visitors can find and view real listings.

- `/search` (the current `/results` page) wired to DB instead of Gemini demo. Server action + `searchBusinesses({ city, keyword, category, tags, page })`. Start with Prisma `where` + trigram/`ilike`; move to Postgres full-text (`to_tsvector`) once volume grows.
- `/cities/[city]` — city landing page, top listings, categories present in that city
- `/categories/[category]` — category landing page
- `/business/[slug]` — **new** detail page:
  - hero image + gallery (respect tier)
  - description, hours, address, map embed
  - contact (gated behind tier: free listings show "Upgrade to see contact")
  - keyword & category chips
  - website + socials (tier-gated)
  - job postings for this business
  - "Save to favorites" button (auth-gated)
- Sticky filter rail (city, category, price tier, has-photos, has-jobs)
- Server-side pagination + Next.js caching (`revalidate` per route)
- Free-tier fallback card with visible upgrade prompt
- OpenGraph images per listing (`/opengraph-image.tsx`)

**Exit criteria:** From homepage search, you can land on a city page, filter, open a business, and see tier-appropriate info. SEO meta and JSON-LD `LocalBusiness` schema present on every detail page.

---

### Phase 3 — Accounts, Listings, Owner Dashboard (2 weeks)
**Goal:** Business owners can sign up and create/manage a free listing end-to-end.

- Rework signup flow to capture role (Localist vs. Business Owner)
- Owner dashboard at `/dashboard`
- `/dashboard/listings` index with status chips
- `/dashboard/listings/new` multi-step form:
  1. Business basics (name, category, city)
  2. Description, keywords/tags
  3. Contact + website + socials
  4. Photos (upload pipeline — **see Phase 5 for image host**; stub URL input until then)
  5. Choose plan (free by default)
  6. Review + publish
- `/dashboard/listings/[id]/edit` — same form in edit mode
- Slug generation (`slugify(name) + "-" + citySlug`, enforce uniqueness)
- Soft-delete / archive instead of hard delete
- Admin moderation: `/admin/listings` with approve / suspend / feature

**Exit criteria:** A brand-new owner can register, create, edit, publish, and unpublish a free listing without dev intervention.

---

### Phase 4 — Favorites & Localist Accounts (3–5 days)
**Goal:** Consumers have a reason to sign up.
- `Favorite` server actions (add/remove, optimistic UI)
- `/favorites` page, auth-gated
- Heart button on business cards and detail pages
- Email digest toggle in user settings ("Weekly new gems in Austin")

**Exit criteria:** Save + view favorites works on desktop and mobile web.

---

### Phase 5 — Media & Transactional Email (1 week)
**Goal:** Production-quality media handling and email.
- Pick one image host: **UploadThing** (quickest for Next) **or Cloudinary** (better transforms). Wire into the listing form. Store `url`, `width`, `height` per `Photo`.
- Validate file type, size, EXIF strip
- Image component: `next/image` + `remotePatterns` for chosen host
- Pick email provider: **Resend** is simplest. Templates (React Email):
  - Welcome
  - Email verification
  - Password reset
  - Listing published / suspended
  - Payment receipt
  - Trial ending / card failed
- Rate limit outgoing email + bounce handling

**Exit criteria:** Owners upload real photos, all transactional emails render and send.

---

### Phase 6 — Subscriptions & Paid Tiers (2 weeks) — THE revenue phase
**Goal:** Owners can upgrade a listing and cancel it month-to-month.

- Stripe: create Products/Prices for each tier in the Stripe dashboard; store `stripePriceId` on `Plan`
- Checkout via **Stripe Checkout Sessions** (simplest, PCI-offloaded). Never collect cards on-site.
- Customer Portal for updates and cancellations (Stripe hosts this)
- `Subscription` rows driven by **webhooks** (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`). Use `STRIPE_WEBHOOK_SECRET`.
- Listing visibility gated by `Subscription.status === 'active'` for paid tiers
- Enforce tier capabilities in one place (`lib/tiers.ts`): max photos, show contact, show website, show socials, job posts allowed, featured placement, priority in search
- No proration on cancellation — per scope. Set Stripe subscription `cancel_at_period_end = true` and let `currentPeriodEnd` drive downgrade to free.
- Billing page at `/dashboard/billing` shows next charge, plan, "Manage in Stripe"

**Exit criteria:** Test-mode and live-mode upgrades both work, webhooks reconcile state, cancellation downgrades at period end.

---

### Phase 7 — Jobs Board (1 week)
**Goal:** Ship the job-posting piece of the scope.
- `Job` CRUD inside owner dashboard (gated to tiers that include jobs)
- `/jobs` public board with city + keyword filters
- `/jobs/[jobId]` detail
- Auto-expire at `expiresAt`
- Structured data: `JobPosting` JSON-LD (unlocks Google for Jobs)

**Exit criteria:** A paid-tier owner can post a job, it appears on `/jobs` and on their listing detail page.

---

### Phase 8 — Polish, Brand, UX Pass (1 week)
**Goal:** Bring every page up to the quality bar the homepage and `/results` already set.

Use the three UI-focused skills already installed on this machine:
- `anthropic-skills:frontend-design` — distinctive, non-generic UI
- `anthropic-skills:ui-ux-pro-max` — palettes, typography, interaction patterns
- `anthropic-skills:parallax-scroll-animation` — for a cinematic homepage hero or city landing pages if desired

Checklist:
- Dashboard, admin, login, signup, business detail — all restyled to match the retro Texas system in `globals.css`
- Responsive audit at 360 / 768 / 1280
- Dark-mode decision (scope is silent — recommend "defer")
- Empty states and loading skeletons for every data-driven page
- Accessibility: color contrast (the cream/brown combo passes WCAG AA at body sizes — verify for small UI text), keyboard nav, focus rings, alt text, semantic headings
- Error boundaries + 404 / 500 pages on-brand

---

### Phase 9 — SEO, Legal, Trust (3–5 days)
- `sitemap.xml` generated from cities, categories, and active businesses
- `robots.txt`
- Per-page metadata (title/description/OG)
- JSON-LD: `LocalBusiness` on detail pages, `JobPosting` on jobs, `BreadcrumbList` on nested pages
- Canonical URLs (strip querystrings from the canonical for `/search`)
- Privacy policy, Terms of service, Refund policy (stating no proration)
- Cookie banner if you add analytics cookies (Plausible skips this; PostHog may not)
- `NEXT_PUBLIC_SITE_URL` driving absolute URLs everywhere

---

### Phase 10 — Hardening & Launch (1 week)
- Load test search with k6 or Artillery at ~50 RPS
- DB backups + point-in-time on Neon
- Rate limiting on auth endpoints (upstash/ratelimit)
- CSP + security headers (`next.config.js` / `middleware.ts`)
- Bot protection on signup and contact forms (hCaptcha / Turnstile)
- Status page or at minimum an uptime check (BetterStack / UptimeRobot)
- Stripe live keys, DNS + SSL on the production domain
- Staging environment that mirrors prod
- Launch runbook: what to do if webhooks fail, if search returns empty, if DB hits connection limits
- Post-launch: daily error-rate check for the first 2 weeks

**Exit criteria:** All of the above are checked, and a non-technical teammate can register, upgrade a listing, and cancel it without your help.

---

### Phase 11 — Post-launch / Phase 2 of business (not blocking launch)
- Reviews & ratings
- Owner analytics (listing views, phone clicks, website clicks)
- Featured placements / homepage slots as an add-on
- Referral program
- Mobile app (React Native or Expo) sharing the Next.js API
- Admin CSV import for bulk-seeding cities or legacy listings

---

## 4. Skills Inventory on This Machine

These are the skills currently installed that are directly useful for this project:
- **frontend-design** — use when styling remaining pages (dashboard, admin, detail) to keep the retro direction and avoid a generic SaaS look
- **ui-ux-pro-max** — for palette verification, font pairings, component patterns (shadcn/ui references included)
- **parallax-scroll-animation** — optional, for a cinematic homepage or city landing hero
- **docx / pdf / pptx / xlsx** — for generating sales decks, rate cards, onboarding PDFs, and listing-data exports later
- **schedule** — to run recurring jobs (e.g., weekly "expire trials" sweep) if you don't want to rely solely on Stripe webhooks
- **skill-creator** — to package recurring TX Localist workflows (e.g., "add a new city") into a reusable skill

No custom user-authored skills were found in the skills directory. If you want, we can use `skill-creator` to build a "tx-localist" skill that scaffolds a new feature (model + action + route + component) in one command.

---

## 5. Suggested Next Step

Start with **Phase 0 + Phase 1 together** — consolidate CSS, extract shared components, and do the Prisma refactor before building more pages. Every later phase gets easier once the schema reflects the real product and the shared components exist. Phase 2 (public directory) then moves fast because the search UI already exists at `/results`; it just needs to be pointed at the database.

If you want, I can kick off Phase 0 right now: extract the `Navbar`, `Footer`, and `BusinessCard` components and merge the two `globals.css` files without breaking the styled home or results pages.
