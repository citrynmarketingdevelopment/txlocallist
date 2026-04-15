# Phase 1 Complete: Data Model Refactor

## What's Been Done

### 1. **Prisma Schema Rewrite** (`prisma/schema.prisma`)

Replaced the Event-centric schema with a full directory system:

**New Models:**
- `User` (roles: USER, OWNER, ADMIN)
- `Business` (core listing; replaces Event)
- `Subscription` (Stripe integration ready)
- `Plan` (4 tiers: Free, Starter, Pro, Premium)
- `Photo` (multiple images per business)
- `Category` & `Tag` (taxonomy)
- `BusinessCategory` & `BusinessTag` (many-to-many joins)
- `SocialLink` (Instagram, Facebook, etc.)
- `Job` (job postings per business)
- `Favorite` (saved businesses by users)
- `City` (pre-seeded Texas cities)
- `AuditLog` (optional, Phase 10+)

**Key Features:**
- Tier-gating via `Plan.features` JSON
- Slug uniqueness per city (not global)
- Soft-delete via `BusinessStatus` enum
- Comprehensive indexing for search performance

### 2. **Seed Scripts** (4 new files under `scripts/`)

- **seed-cities.mjs** — Seeds 30+ major Texas cities with lat/lng
- **seed-categories.mjs** — Seeds 50+ business categories (Bakery, Cafe, etc.)
- **seed-plans.mjs** — Seeds 4 subscription tiers with feature sets
- **seed-event-data.mjs** — Migrates existing Event records to Business

Run all at once:
```bash
npm run db:seed-all
```

### 3. **Tier System** (`src/lib/tiers.ts`)

Single source of truth for feature gating:

```js
import { canShowContact, getMaxPhotos, canPostJobs } from "@/lib/tiers";

const features = canShowContact(business.plan?.features); // boolean
const maxPhotos = getMaxPhotos(business.plan?.features);  // number
const canPost = canPostJobs(business.plan?.features);     // boolean
```

### 4. **Documentation** (2 new guides)

- **PHASE_1_MIGRATION_GUIDE.md** — Complete migration instructions + troubleshooting
- **PROJECT_ROADMAP.md** — Updated with the new schema context

### 5. **Package.json Updates**

Added convenience scripts:
```bash
npm run db:migrate          # Apply Prisma migration
npm run db:seed-cities      # Seed cities only
npm run db:seed-categories  # Seed categories only
npm run db:seed-plans       # Seed tiers only
npm run db:seed-events      # Migrate Event → Business
npm run db:seed-all         # Run all seeds in order
```

---

## How to Deploy Phase 1

### Local Development

```bash
# 1. Pull the latest schema
npm install

# 2. Apply migrations to your database
npm run db:migrate

# 3. Seed reference data
npm run db:seed-all

# 4. Verify the data
npm run dev
# Visit your app and check the database
```

### Production (Neon + Vercel)

```bash
# 1. On your local machine, generate a migration
prisma migrate dev --name "event_to_business"

# 2. Commit the migration to GitHub
git add prisma/migrations/
git commit -m "Phase 1: Event → Business refactor"
git push

# 3. Vercel auto-deploys; Prisma applies migration automatically

# 4. Run seeds via Vercel Functions or manual CLI:
# - Use Vercel's bash terminal, or
# - SSH into a temporary container and run:
node scripts/seed-cities.mjs
node scripts/seed-categories.mjs
node scripts/seed-plans.mjs
node scripts/seed-event-data.mjs
```

---

## What Needs to Change in Your Code

### Immediate (required to avoid errors)

1. **Rename routes & actions:**
   - `src/app/actions/events.js` → `src/app/actions/businesses.js`
   - `src/app/dashboard/events/` → `src/app/dashboard/businesses/`
   - Update imports everywhere

2. **Update action signatures:**
   ```js
   // OLD
   export async function createEventAction(prevState, formData)
   
   // NEW
   export async function createBusinessAction(prevState, formData)
   ```

3. **Update Prisma queries:**
   ```js
   // OLD
   const events = await prisma.event.findMany();
   
   // NEW
   const businesses = await prisma.business.findMany({
     include: {
       photos: true,
       categories: { include: { category: true } },
       plan: true,
     },
   });
   ```

### Phase 2 (Search & Discovery)

- Wire `/search` to query Business table
- Build `/cities/[city]` landing pages
- Build `/business/[slug]` detail pages
- Implement tier-gating on contact/website/socials

### Phase 3 (Owner Dashboard)

- Rewrite `/dashboard` to work with Business model
- Add photo upload pipeline
- Add category/tag selection
- Add subscription UI (Phase 6)

---

## Rollback Plan

If something goes wrong:

```bash
# Rollback the migration (keeps old Event table)
prisma migrate resolve --rolled-back "0_event_to_business"

# Or, manually restore from backup and drop new tables:
DROP TABLE "Subscription", "Job", "Photo", "BusinessTag", "BusinessCategory", "SocialLink", "Business", "Plan", "Category", "City";
```

---

## Files Created/Modified

**Created:**
- `prisma/schema.prisma` (rewritten)
- `scripts/seed-cities.mjs`
- `scripts/seed-categories.mjs`
- `scripts/seed-plans.mjs`
- `scripts/seed-event-data.mjs`
- `src/lib/tiers.ts`
- `PHASE_1_MIGRATION_GUIDE.md`

**Modified:**
- `package.json` (added seed scripts)

**Unchanged (for now):**
- `src/app/actions/events.js` (to be renamed & updated in Phase 2)
- `src/app/dashboard/` (to be refactored in Phase 3)

---

## Validation Checklist

- [ ] Schema compiles without errors: `npx prisma validate`
- [ ] Migration applies cleanly: `npm run db:migrate`
- [ ] Cities seed successfully: `npm run db:seed-cities`
- [ ] Categories seed successfully: `npm run db:seed-categories`
- [ ] Plans seed successfully: `npm run db:seed-plans`
- [ ] Event data migrates successfully: `npm run db:seed-events`
- [ ] Business table has correct row count (matches old Event count)
- [ ] Tier utility functions work as expected
- [ ] No TypeScript errors: `npx tsc --noEmit`

---

## Next Phase

**Phase 2 — Public Directory** (2–3 weeks)
- `/search` wired to Business queries
- City & category landing pages
- Business detail pages
- Tier-gating of contact info

See `PROJECT_ROADMAP.md` Phase 2 section for details.
