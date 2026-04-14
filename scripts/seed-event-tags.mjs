import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const DEFAULT_EVENT_TAGS = [
  "Live Music",
  "Family Friendly",
  "Food & Drink",
  "Networking",
  "Arts & Culture",
  "Outdoor",
  "Wellness",
  "Community",
];

function slugifyTag(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaNeon({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

try {
  await Promise.all(
    DEFAULT_EVENT_TAGS.map((name) =>
      prisma.tag.upsert({
        where: { slug: slugifyTag(name) },
        update: { name },
        create: {
          name,
          slug: slugifyTag(name),
        },
      }),
    ),
  );

  console.log(`Seeded ${DEFAULT_EVENT_TAGS.length} default event tags`);
} finally {
  await prisma.$disconnect();
}
