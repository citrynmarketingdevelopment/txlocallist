# Phase 1 — Data Model Refactor: Event → Business

**Goal:** Replace the event-centric schema with a full business-directory schema, including subscriptions, jobs, favorites, categories, and photo management.

---

## What Changed

### Old Schema (Event-focused)

```
User → Session
User → Event (creator)
Event → Tag
```

### New Schema (Business-directory)

```
User → Session
User → Favorite (saved businesses)
User → Business (owner)

Business → Subscription (monthly billing)
Business → Photo (multiple images)
Business → Category (via BusinessCategory join)
Business → Tag (via BusinessTag join)
Business → SocialLink (Instagram, etc.)
Business → Job (postings)

Plan (tier definition: Free, Starter, Pro, Premium)
City (pre-seeded: Austin, Houston, Dallas, etc.)
```

---

## Running the Migration

### Step 1: Deploy the new Prisma schema

```bash
npm run db:migrate
# or
prisma migrate deploy
```

This creates all the new tables (Business, Subscription, Plan, Photo, etc.) while **keeping Event intact** for now.

### Step 2: Seed reference data (required before migrating Event data)

```bash
# Seed 30+ Texas cities
npm run db:seed-cities

# Seed 50+ business categories (Bakery, Cafe, Boutique, etc.)
npm run db:seed-categories

# Seed 4 subscription tiers (Free, Starter, Pro, Premium)
npm run db:seed-plans
```

Or run all at once:

```bash
npm run db:seed-all
```

### Step 3: Migrate existing Event records

```bash
npm run db:seed-events
```

This script:
- Finds or creates the City record for each Event's city
- Creates a Business record with status ACTIVE, planId = Free
- Creates a Photo record if the event had an imageUrl
- Preserves the original creator as the owner

### Step 4: Verify the migration

```bash
# Connect to your database and spot-check:
SELECT COUNT(*) FROM "Business";  -- Should match your old Event count
SELECT * FROM "Plan";              -- Should have 4 plans
SELECT COUNT(*) FROM "City";       -- Should have 30+
```

### Step 5: Clean up (optional)

Once you've verified everything migrated correctly, drop the old Event table:

```sql
DROP TABLE "Event" CASCADE;
```

---

## Updating Application Code

After the migration, update these files to use `Business` instead of `Event`:

### 1. **src/app/actions/businesses.js** (renamed from actions/events.js)

```js
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function createBusinessAction(_prevState, formData) {
  const user = await requireUser();
  
  // Validate form fields
  // Create Business record
  // Add Photo records if images provided
  // Attach categories via BusinessCategory
}

// Similar functions:
// - updateBusinessAction
// - publishBusinessAction
// - pauseBusinessAction
// - deleteBusinessAction (soft-delete)
```

### 2. **src/app/dashboard/businesses/** (renamed from dashboard/events/)

Create these routes:
- `/dashboard/businesses` — list user's businesses
- `/dashboard/businesses/new` — create new listing
- `/dashboard/businesses/[id]/edit` — edit listing
- `/dashboard/billing` — subscription management

### 3. **src/app/api/search** (Phase 2)

Replace the hardcoded demo with a real search that queries:

```js
const businesses = await prisma.business.findMany({
  where: {
    status: "ACTIVE",
    city: { slug: locationQuery },
    OR: [
      { name: { search: searchQuery } },
      { description: { search: searchQuery } },
      { tags: { some: { tag: { name: { search: searchQuery } } } } },
    ],
  },
  include: {
    photos: { take: 1 },
    categories: { include: { category: true } },
    owner: { select: { name: true } },
  },
});
```

### 4. **src/app/business/[slug]/page.js** (Phase 2, new route)

Detail page for a single business:

```js
export default async function BusinessDetailPage({ params }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      photos: { orderBy: { order: "asc" } },
      categories: { include: { category: true } },
      socialLinks: { orderBy: { order: "asc" } },
      jobs: { where: { status: "ACTIVE" } },
      owner: { select: { name: true, email: true } },
      plan: true,
      subscription: true,
    },
  });
  
  // Tier-gate contact info, website, socials based on plan
  // Show 3-5 featured jobs
}
```

---

## Key Design Decisions

### Business.slug

Slug is unique **per city**, not globally. This lets two cities each have a "Coffee Cafe".

```prisma
@@unique([slug, cityId])
```

### Plan.features

Features are stored as a JSON string for flexibility:

```json
{
  "MAX_PHOTOS": 5,
  "SHOW_CONTACT": true,
  "SHOW_WEBSITE": true,
  "SHOW_SOCIALS": false,
  "JOB_POSTINGS": 1,
  "FEATURED": false,
  "PRIORITY_SEARCH": false
}
```

Retrieve and check with:

```js
const features = JSON.parse(business.plan.features || "{}");
if (features.SHOW_CONTACT) {
  // display phone & email
}
```

### Subscription Lifecycle

- When a Business is created, status = DRAFT, planId = null
- Owner publishes → status = ACTIVE, planId = freePlanId
- Owner upgrades → creates a Subscription record, Stripe handles billing
- Cancellation sets `cancelAtPeriodEnd = true`; at `currentPeriodEnd`, downgrade to Free tier
- No proration: if cancelled mid-month, service stops at period end (clean billing)

---

## Next Steps

**Phase 2 (Public Directory):**
- `/search` wired to Prisma queries
- `/cities/[city]` landing pages
- `/business/[slug]` detail pages
- Tier-gating of contact info & socials

**Phase 3 (Owner Dashboard):**
- `/dashboard/businesses` list + create + edit
- Photo uploads (Phase 5)
- Category selection
- Publish / pause / unpublish flow

**Phase 4 (Favorites):**
- `/favorites` page
- Heart button on cards
- Email digest of weekly favorites

**Phase 6 (Stripe Subscriptions):**
- Checkout flow
- Webhook handlers
- Customer Portal
- Billing page

---

## Troubleshooting

**"Error: Foreign key constraint failed"**
→ Ensure you've run `seed-cities.mjs` and `seed-plans.mjs` before migrating Event data.

**"Error: Unique constraint `slug_cityId` failed"**
→ Two events in the same city generated the same slug. Edit the Event record or manually run `seed-event-data.mjs` with slug deduplication.

**"Event table still exists after migration"**
→ The migration preserves Event for safety. Manually drop it after verifying: `DROP TABLE "Event" CASCADE;`

---

## Files Changed

- `prisma/schema.prisma` — new models
- `prisma/migrations/` — Prisma-generated migration file
- `scripts/seed-cities.mjs` — new
- `scripts/seed-categories.mjs` — new
- `scripts/seed-plans.mjs` — new
- `scripts/seed-event-data.mjs` — new
- `package.json` — new db seed scripts
