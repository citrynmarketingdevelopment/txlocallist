# Phase 3 Testing Guide

## Pre-Testing Setup

### 1. Database Ready
```bash
npm run db:migrate        # Apply latest schema
npm run db:seed-all       # Seed cities, categories, plans
```

### 2. Start Dev Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

## Testing Checklist

### Dashboard Access
- [ ] Navigate to `/dashboard` while logged in as OWNER
- [ ] Dashboard loads without errors
- [ ] Welcome message shows correct user name
- [ ] Stats cards display (Total, Active, Draft, Paused, Paid Plans)

### Navigation
- [ ] Sidebar navigation visible with 4 tabs
- [ ] Tab highlight changes based on current page
- [ ] Help card visible in sidebar footer
- [ ] Responsive: sidebar collapses on mobile

### Overview Page (`/dashboard`)
- [ ] Stats cards show correct counts
- [ ] Recent listings section displays (or empty state if no listings)
- [ ] Quick actions grid visible with 4 cards
- [ ] "Create Listing" button navigates to new form
- [ ] Empty state shows if no listings yet

### Create Listing Form (`/dashboard/businesses/new`)
**Step 1: Basic Info**
- [ ] Progress bar shows step 1/5
- [ ] All input fields render (name, description, phone, email, website)
- [ ] "Next" button advances to step 2
- [ ] Validation: name required
- [ ] Validation: description required
- [ ] Error messages appear in red banner

**Step 2: Location**
- [ ] Progress bar shows step 2/5
- [ ] City dropdown populates with cities
- [ ] Address field required
- [ ] Latitude/Longitude optional
- [ ] "Previous" button returns to step 1
- [ ] Data persists between steps

**Step 3: Categories & Tags**
- [ ] Progress bar shows step 3/5
- [ ] Categories display as checkboxes with emojis
- [ ] Can select multiple categories
- [ ] Tags input accepts comma-separated values
- [ ] At least 1 category required

**Step 4: Photos**
- [ ] Progress bar shows step 4/5
- [ ] Photo placeholder displays
- [ ] Message says coming in Phase 5
- [ ] Can skip to next step

**Step 5: Review & Publish**
- [ ] Progress bar shows step 5/5
- [ ] Review cards show all entered data
- [ ] Publish checkbox toggles
- [ ] "Create Listing" button submits form

**Form Submission**
- [ ] Business created with DRAFT status
- [ ] Redirects to `/dashboard/businesses`
- [ ] Success message appears
- [ ] Listing appears in table

### My Listings Page (`/dashboard/businesses`)
- [ ] Table displays all user's businesses
- [ ] Columns: Name, City, Plan, Status, Actions
- [ ] Status filter tabs visible (All, Active, Draft, Paused, Archived)
- [ ] Filter tabs show counts
- [ ] Clicking filter updates table
- [ ] "Edit" button navigates to edit page
- [ ] "View" button opens listing in new tab
- [ ] Create Listing button in header
- [ ] Mobile: table collapses to readable format
- [ ] Empty state shows if no listings

### Edit Listing Form (`/dashboard/businesses/[id]/edit`)
- [ ] Form pre-populates with existing data
- [ ] Page title shows business name
- [ ] All fields editable (name, description, contact, location, categories, tags)
- [ ] Save button submits changes
- [ ] Cancel button goes back
- [ ] Success message shows on save
- [ ] Changes persist after reload

### Publishing/Status Changes
- [ ] Create new listing (stays DRAFT)
- [ ] Edit listing and check status still DRAFT
- [ ] Test `publishBusinessAction` (change to ACTIVE)
- [ ] Verify listing appears in `/search` after publishing
- [ ] Test pause/archive actions if implemented

### Billing Page (`/dashboard/billing`)
- [ ] Page loads without errors
- [ ] Current spending section visible
- [ ] Shows active subscriptions count
- [ ] Shows monthly recurring amount
- [ ] Plans grid displays (Free, Starter, Pro, Premium)
- [ ] Payment methods section is placeholder
- [ ] Billing information summary shows

### Settings Page (`/dashboard/settings`)
- [ ] Profile section shows user info (name, email, role)
- [ ] Security section shows
- [ ] Notifications section with checkboxes
- [ ] Danger zone section visible
- [ ] Buttons functional (placeholder implementations OK)

### Mobile Responsiveness
- [ ] Resize browser to 768px or smaller
- [ ] Sidebar converts to grid layout on mobile
- [ ] Forms stack vertically
- [ ] Table collapses to readable format
- [ ] Buttons full-width on mobile
- [ ] All text readable (no overflow)

### Error Handling
- [ ] Submit create form with empty name → error message
- [ ] Submit with description < 20 chars → error message
- [ ] Submit without selecting city → error message
- [ ] Submit without categories → error message
- [ ] Try to edit someone else's listing → redirect (if auth implemented)

### Performance
- [ ] Dashboard loads within 2 seconds
- [ ] Form inputs responsive (no lag)
- [ ] Table filtering instant
- [ ] No console errors or warnings
- [ ] Network tab shows reasonable request sizes

## Testing Scenarios

### Scenario 1: Create & Publish Listing
1. Navigate to `/dashboard/businesses/new`
2. Fill in all steps of form
3. On final step, check "Publish immediately"
4. Submit form
5. Verify listing appears in My Listings as ACTIVE
6. Verify listing searchable in `/search`

### Scenario 2: Create Draft & Edit
1. Create new listing (don't publish)
2. Verify in My Listings with DRAFT status
3. Click Edit button
4. Change business name
5. Save changes
6. Verify updated name in My Listings

### Scenario 3: Filter by Status
1. Have multiple listings with different statuses
2. Click "Draft" filter tab
3. Verify only draft listings show
4. Click "Active" filter
5. Verify only active listings show
6. Click "All" to reset

### Scenario 4: Mobile Workflow
1. Resize to mobile (375px)
2. Navigate to `/dashboard/businesses/new`
3. Fill form on mobile
4. Verify all steps accessible
5. Submit form
6. Verify success on mobile

## Known Limitations (Phase 3)

⚠️ **Photos** - Coming in Phase 5
- Photo upload not yet implemented
- Photo placeholders only

⚠️ **Auth** - Coming in Phase 4
- Must have pre-existing user account
- No signup/login UI yet
- Assumes user session exists

⚠️ **Billing** - Coming in Phase 6
- Stripe integration not yet implemented
- Billing page is placeholder only
- Can't actually upgrade plans yet

⚠️ **Edit Form** - Basic Implementation
- No validation errors on submit yet
- No success/error toasts
- Consider this placeholder for Phase 4

## Troubleshooting

### Dashboard redirects to /post-your-business
- **Cause**: User doesn't have OWNER role
- **Fix**: Log in with owner account or update user role in database

### Create form doesn't submit
- **Cause**: Missing getSession function or authentication
- **Fix**: Verify auth middleware is set up
- **Check**: Look for error in browser console

### Listings don't appear in search
- **Cause**: Business not published (still DRAFT)
- **Fix**: Change status to ACTIVE and publish
- **Verify**: Check database status field is "ACTIVE"

### Form loses data on page refresh
- **Expected Behavior**: Form resets (not persisted to DB yet)
- **Note**: Data only saves on submit

### Mobile layout broken
- **Cause**: CSS media query issue
- **Fix**: Check `dashboard.module.css` media queries
- **Debug**: Inspect element with DevTools

## Success Criteria

Phase 3 testing is successful when:
- ✅ All dashboard pages load
- ✅ Create listing form works (all 5 steps)
- ✅ Edit listing form works
- ✅ Listings appear in My Listings table
- ✅ Status filtering works
- ✅ Forms validate input
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Published listings appear in search

## Next Steps

Once testing is complete:
1. Document any bugs or issues
2. Note missing features (expected in later phases)
3. Verify all critical paths work
4. Move on to Phase 4 (Authentication) or Phase 5 (Photos)

---

**Good luck testing\! 🧪**
