/**
 * Seed TX Localist database with subscription plans.
 * Run: node scripts/seed-plans.mjs
 *
 * Feature flags are JSON strings. Each tier includes different capabilities:
 * - MAX_PHOTOS: max photo uploads
 * - SHOW_CONTACT: show phone + email
 * - SHOW_WEBSITE: show website link
 * - SHOW_SOCIALS: show social media links
 * - JOB_POSTINGS: allow job postings (1 = yes, 0 = no)
 * - FEATURED: appear in featured listings
 * - PRIORITY_SEARCH: boost in search results
 */

import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaNeon({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const PLANS = [
  {
    name: "Free",
    slug: "free",
    tier: 0,
    priceCents: 0,
    billingPeriod: "monthly",
    features: {
      MAX_PHOTOS: 1,
      SHOW_CONTACT: false,
      SHOW_WEBSITE: false,
      SHOW_SOCIALS: false,
      JOB_POSTINGS: 0,
      FEATURED: false,
      PRIORITY_SEARCH: false,
    },
  },
  {
    name: "Starter",
    slug: "starter",
    tier: 1,
    priceCents: 2999, // $29.99/month
    billingPeriod: "monthly",
    features: {
      MAX_PHOTOS: 5,
      SHOW_CONTACT: true,
      SHOW_WEBSITE: true,
      SHOW_SOCIALS: false,
      JOB_POSTINGS: 1,
      FEATURED: false,
      PRIORITY_SEARCH: false,
    },
  },
  {
    name: "Pro",
    slug: "pro",
    tier: 2,
    priceCents: 5999, // $59.99/month
    billingPeriod: "monthly",
    features: {
      MAX_PHOTOS: 20,
      SHOW_CONTACT: true,
      SHOW_WEBSITE: true,
      SHOW_SOCIALS: true,
      JOB_POSTINGS: 3,
      FEATURED: false,
      PRIORITY_SEARCH: true,
    },
  },
  {
    name: "Premium",
    slug: "premium",
    tier: 3,
    priceCents: 9999, // $99.99/month
    billingPeriod: "monthly",
    features: {
      MAX_PHOTOS: 50,
      SHOW_CONTACT: true,
      SHOW_WEBSITE: true,
      SHOW_SOCIALS: true,
      JOB_POSTINGS: 10,
      FEATURED: true,
      PRIORITY_SEARCH: true,
    },
  },
];

async function main() {
  console.log("💳 Seeding subscription plans...");

  let created = 0;
  let skipped = 0;

  for (const planData of PLANS) {
    try {
      const plan = await prisma.plan.upsert({
        where: { slug: planData.slug },
        update: {
          // Update if needed
          priceCents: planData.priceCents,
          features: JSON.stringify(planData.features),
        },
        create: {
          name: planData.name,
          slug: planData.slug,
          tier: planData.tier,
          priceCents: planData.priceCents,
          billingPeriod: planData.billingPeriod,
          features: JSON.stringify(planData.features),
        },
      });

      console.log(`✓ ${plan.name} - $${(planData.priceCents / 100).toFixed(2)}/mo`);
      created++;
    } catch (error) {
      console.log(`⊘ ${planData.name} (already exists or error)`);
      console.error(error.message);
      skipped++;
    }
  }

  console.log(`\n✨ Seeded ${created} new plans, skipped ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
