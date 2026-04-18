# TX Localist - Build Roadmap and Status

> Last updated: April 17, 2026
> Stack: Next.js 16 App Router, Prisma + Neon (PostgreSQL), CSS Modules

---

## Completed

### Core platform
- [x] Next.js 16 App Router app scaffold
- [x] Prisma schema for Business, City, Category, Tag, Plan, Photo, SocialLink, Favorite, Job, User, Event, Session, and BusinessHours
- [x] Neon serverless PostgreSQL via `@prisma/adapter-neon`
- [x] Auth with httpOnly session cookies and server-side user lookup
- [x] Seed scripts for cities, categories, plans, admin user, and test users
- [x] UploadThing integration for photo uploads
- [x] Tier/feature gating system in `src/lib/tiers.ts`

### Results page and search
- [x] City + keyword search with city normalization (`Austin`, `Austin, TX`, and `austin` resolve together)
- [x] Search API at `/api/search` with default and popular sorting
- [x] Card, list, and map view switcher on the results page
- [x] Sidebar navigation for events, cities, categories, add listing, and login/dashboard
- [x] Browse stack under the login/dashboard button with `New`, `Most Saved`, and `My Favorites`
- [x] `Most Saved` live sort using `favorites._count`
- [x] Logged-in `My Favorites` tab on `/results`
- [x] Dynamic login/dashboard CTA based on auth state
- [x] Mobile bottom nav and mobile city picker sheet
- [x] Active filter chips / removable result filters
- [x] Richer empty states on `/results`
- [x] Trust strip messaging inside `/results`
- [x] Lightweight `/suggest-business` flow with prefilled suggestion link

### Favorites
- [x] `Favorite` model with `userId_businessId` unique constraint
- [x] `/api/favorites` POST endpoint for save/unsave
- [x] Shared `SaveButton` client component
- [x] Optimistic save/unsave UI with rollback on failure
- [x] Login redirect when trying to save while signed out
- [x] Save controls wired into results cards, rows, and business detail
- [x] Server-side `savedIds` hydration on results
- [x] `/dashboard/favorites` page with empty state, remove action, saved-date metadata, and sort/filter UI

### Business detail page
- [x] Full redesigned business profile page with hero, stats bar, gallery, bento cards, location section, and jobs section
- [x] Share button improvements for hero usage
- [x] Tier-gated contact, website, social icons, and job visibility
- [x] Photo gallery strip with arrows and lightbox
- [x] Upgrade nudge for free listings
- [x] Directions and Google Maps outbound links

### Business hours
- [x] `BusinessHours` model in Prisma schema
- [x] Prisma client regeneration and database sync for hours table
- [x] Hours editor in create listing flow
- [x] Hours editor in edit listing flow
- [x] Actual hours display on public business detail pages

### Public pages
- [x] `/pricing`
- [x] `/events`
- [x] `/about`
- [x] `/how-it-works`
- [x] `/terms`
- [x] `/privacy`
- [x] `/contact` static info page
- [x] `/suggest-business`
- [x] `/categories/[category]`
- [x] `/cities/[city]`

### Dashboard and auth polish
- [x] User dashboard shell and admin dashboard shell
- [x] Logout button in user dashboard
- [x] Logout button in admin dashboard
- [x] Regular `USER` accounts routed to favorites dashboard instead of owner-only views

---

## In Progress / Partial

### Results page polish
- [ ] Pagination or infinite scroll on the retro `/results` experience
  Note: `/search` already has pagination; `/results` still behaves like the custom editorial experience.

### Homepage refresh
- [ ] Featured businesses should be driven by real featured data instead of hardcoded content
- [ ] City quick links section
- [ ] Social proof strip
- [ ] Final brand-copy pass on hero and supporting sections

### City and category landing pages
- [x] Base routes exist
- [ ] Richer city hero content, imagery, and counts
- [ ] Category visuals / icons / editorial polish

### Contact and support
- [x] Static contact page exists
- [ ] Contact form / Resend submission flow

### Business detail QA
- [ ] Mobile QA pass on real devices
- [ ] Replace map placeholder with embedded/live map experience if desired

### Owner dashboard polish
- [ ] Photo reorder UX
- [ ] Social links manager
- [ ] Job posting create/edit/close flow
- [ ] Listing preview button
- [ ] Analytics stub for views and saves

---

## Not Started

### Public jobs board
- [ ] `/jobs` browse page for all active jobs
- [ ] Filter by city and employment type
- [ ] `/jobs/[id]` detail page
- [ ] Apply flow using existing `applyUrl` / `applyEmail`
- [ ] "Powered by TX Localist" attribution on public job posts

### Payments and subscriptions
- [ ] Stripe recurring billing
- [ ] Webhook syncing to `planId` / subscription state
- [ ] Upgrade / downgrade flow in dashboard
- [ ] Grace period handling for failed payments
- [ ] Real payment method management UI

### Additional directory features
- [ ] `Open Now` badge on result cards using business hours
- [ ] Better moderation / approval workflows for admins
- [ ] Public event detail page

---

## Pre-launch technical debt

| Item | Priority |
|------|----------|
| Rate limiting on `/api/favorites` and `/api/search` | High |
| Admin moderation UI | High |
| SEO structured data on business detail pages | Medium |
| Revalidate/caching strategy review | Medium |
| Convert more `<img>` usage to Next `<Image>` where it makes sense | Medium |
| Error boundaries for interactive client components | Medium |
| `/sitemap.xml` | Medium |
| `/robots.txt` | Medium |
| Loading skeletons on results | Low |

---

## Recommended next order

1. Finish results-page polish.
   The big remaining item here is pagination or infinite scroll on the retro `/results` experience.

2. Build the public jobs board.
   The schema and dashboard-side business/job foundation already exist, so this is a strong next public-facing feature.

3. Polish the owner dashboard.
   Social links, better photo UX, preview flow, and analytics will make the business side feel much more complete.

4. Add Stripe and real billing flows.
   Pricing exists, but subscriptions are still mostly placeholder.

5. Close pre-launch platform gaps.
   Rate limiting, sitemap, robots, and moderation are the highest-signal launch-readiness tasks.

---

## Key file reference

| File | Purpose |
|------|---------|
| `src/app/results/ResultsExperience.jsx` | Main results page client experience |
| `src/app/results/page.js` | Server-side results data hydration |
| `src/app/api/search/route.js` | Search API with sort support |
| `src/app/api/favorites/route.js` | Save/unsave toggle API |
| `src/app/dashboard/favorites/page.js` | Favorites dashboard route |
| `src/app/dashboard/favorites/FavoritesDashboard.jsx` | Favorites dashboard client UI |
| `src/app/business/[slug]/page.js` | Public business detail page |
| `src/app/actions/businesses.js` | Business create/update/publish actions |
| `src/lib/business-hours.js` | Shared hours normalization and formatting |
| `src/components/SaveButton/SaveButton.jsx` | Shared save button |
| `src/lib/tiers.ts` | Tier-based feature gating |
| `prisma/schema.prisma` | Full database schema |
