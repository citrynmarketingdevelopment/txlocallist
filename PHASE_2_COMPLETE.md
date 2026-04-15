# Phase 2 Complete: Public Directory & Discovery

**Status:** ✅ Ready to test and deploy

## What's Been Built

### **New Server-Side Components**

1. **API Endpoint: `/api/search`** (`src/app/api/search/route.js`)
   - Real database queries instead of demo data
   - Supports: keyword search, city filter, category filter, pagination
   - Returns tier-gated data (hides contact/website if not in paid tier)
   - Optimized with Prisma includes for performance

2. **Detail Page: `/business/[slug]`**
   - Full business profile with hero image + gallery
   - Tier-gated contact info, website, socials
   - Job postings section (if tier allows)
   - Category/tag links for browsing
   - Breadcrumb navigation
   - Metadata + OpenGraph for SEO
   - Static generation for top 100 businesses, ISR for rest

3. **City Landing: `/cities/[city]`**
   - Top businesses in the city
   - Businesses grouped by category
   - Search bar pre-filled with city name
   - Links to category pages
   - Generated for all 30+ seeded cities

4. **Category Landing: `/categories/[category]`**
   - All businesses in a category, grouped by city
   - Optional city filter via query param
   - SEO metadata + emoji icon support

### **Client-Side Components**

5. **Search Results: `/search`** (refactored from `/results`)
   - Real-time search powered by `/api/search`
   - Keyword + location filters
   - Category filter support
   - Pagination with "Previous" / "Next"
   - Loading states + skeleton screens
   - Helpful empty state with suggestions
   - URL-synced state (shareable search links)

### **New Server Actions**

6. **`src/app/actions/businesses.js`** (renamed from events.js)
   - `createBusinessAction()` — create new listing (DRAFT status, Free tier)
   - `publishBusinessAction()` — publish DRAFT → ACTIVE
   - `pauseBusinessAction()` — pause ACTIVE → PAUSED
   - `archiveBusinessAction()` — soft-delete to ARCHIVED
   - Full validation + error handling
   - Slug auto-generation with conflict detection

### **Styling**

- Detail page: rich, visual layout with tier-gating UI
- City page: featured section + category grid
- Category page: results grouped by city
- Search page: grid + pagination
- All responsive, following the retro Texas design system

---

## Routes Now Available

```
GET  /search                                    Search page (live queries)
GET  /api/search?q=keyword&loc=city&page=1     Search API endpoint
GET  /business/[slug]                           Listing detail page
GET  /cities/[city]                             City landing page
GET  /categories/[category]                     Category landing page
POST /actions                                   createBusinessAction
POST /actions                                   publishBusinessAction
POST /actions                                   pauseBusinessAction
POST /actions                                   archiveBusinessAction
```

---

## Key Implementation Details

### **Tier-Gating**

Contact info, website, and socials are hidden unless `plan.features.SHOW_CONTACT === true`:

```jsx
{showContact && business.phone && (
  <a href={`tel:${business.phone}`}>{business.phone}</a>
)}

{!showContact && (
  <div className={styles.upgradePrompt}>
    <Button as="link" href="/pricing" variant="primary">
      View Plans to See Contact Info
    </Button>
  </div>
)}
```

### **Search API Response**

Returns a transformed payload (not raw Prisma):

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "...",
        "slug": "cafe-austin",
        "name": "Cafe Name",
        "city": { "name": "Austin", "slug": "austin" },
        "categories": [...],
        "tags": [...],
        "image": { "url": "...", "alt": "..." },
        "tier": "pro",
        "showContact": true,
        "showWebsite": true,
        "phone": "512-...", // null if tier doesn't allow SHOW_CONTACT
        "website": "https://...", // null if tier doesn't allow SHOW_WEBSITE
      }
    ],
    "total": 42,
    "page": 1,
    "pageSize": 12,
    "hasMore": true
  }
}
```

### **Static Generation + ISR**

- City pages: generated for all 30+ cities on build
- Business detail pages: top 100 generated on build, rest ISR (1hr revalidation)
- Category pages: generated for all categories on build
- Reduces Cold Starts and improves perceived performance

### **Slug Handling**

Slugs are unique **per city**, not globally:

```prisma
@@unique([slug, cityId])
```

So "Coffee Cafe" can exist in both Austin and Dallas as `coffee-cafe-austin` and `coffee-cafe-dallas`.

---

## How to Test Locally

### **1. Verify the migration & seeding completed**

```bash
npm run db:migrate        # Apply schema
npm run db:seed-all       # Seed cities, categories, plans, sample data
```

### **2. Start dev server**

```bash
npm run dev
# Visit http://localhost:3000
```

### **3. Test each route**

- `/search` — try searching for "cafe" in "austin"
- `/cities/austin` — see businesses grouped by category
- `/categories/bakery` — see bakeries across all cities
- `/business/starlight-cafe-austin` — see detail page with tier-gating

### **4. Check the API directly**

```bash
curl "http://localhost:3000/api/search?q=cafe&loc=austin&page=1"
```

---

## What Still Needs to Be Done (Phase 3+)

### **Phase 3: Owner Dashboard**
- `/dashboard/businesses` — list owner's businesses
- `/dashboard/businesses/new` — create listing form
- `/dashboard/businesses/[id]/edit` — edit form
- `/dashboard/billing` — subscription management

### **Phase 5: Photo Uploads**
- UploadThing or Cloudinary integration
- Photo ordering/reordering
- Alt text management

### **Phase 6: Stripe Subscriptions**
- Checkout flow
- Webhook handlers
- Subscription downgrade on cancel

---

## Code Changes Required

### **Old Code (to archive)**

- `src/app/actions/events.js` — replaced by `businesses.js`
- `src/app/results/` — replaced by `src/app/search/`
- All routes using Event model

### **New Structure**

```
src/
  app/
    api/search/route.js                  NEW — search API
    business/[slug]/page.js              NEW — detail page
    cities/[city]/page.js                NEW — city landing
    categories/[category]/page.js        NEW — category landing
    search/page.js                       NEW — search page (server)
    search/SearchResultsContent.jsx      NEW — search page (client)
    search/page.module.css               NEW — search styles
    actions/businesses.js                RENAMED from events.js
    (old events.js can be deleted)
    (old results/ can be deleted)
```

---

## Performance Notes

- **Search queries** use trigram/insensitive matching; upgrade to Postgres full-text if searching >50k businesses
- **Static generation** reduces cold starts; ISR keeps detail pages fresh
- **Pagination** defaults to 12 results/page; adjust `PAGE_SIZE` in `route.js` if needed
- **Image optimization** via `next/image` on detail pages; consider Cloudinary transforms in Phase 5

---

## Validation Checklist

- [ ] `/search` works with keyword + city filters
- [ ] `/api/search` returns paginated results
- [ ] `/business/[slug]` displays correctly with tier-gated contact info
- [ ] `/cities/austin` shows top businesses + categories
- [ ] `/categories/bakery` groups results by city
- [ ] Tier-gating prevents viewing contact info on Free tier listings
- [ ] Links between pages work (city → category, detail → city, etc.)
- [ ] Mobile responsive on all pages
- [ ] No console errors or warnings

---

## Next Steps

1. **Test Phase 2 locally** (ensure all routes work)
2. **Deploy to production** (Vercel auto-handles ISR)
3. **Monitor search performance** (may need optimization if >10k listings)
4. **Start Phase 3** (owner dashboard + listing management)

See `PROJECT_ROADMAP.md` for the full timeline.
