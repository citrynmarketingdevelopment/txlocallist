import "dotenv/config";

import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH  = 64;
const SALT_BYTES  = 16;

async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set.");

const adapter = new PrismaNeon({ connectionString });
const prisma  = new PrismaClient({ adapter });

/**
 * Test accounts seeded by this script:
 *
 *  Role   Email                        Password
 *  -----  ---------------------------  ----------------
 *  USER   testuser@txlocallist.dev     TestUser123!
 *  OWNER  testowner@txlocallist.dev    TestOwner123!
 *  ADMIN  admin@txlocallist.dev        (see seed-admin.mjs / SEED_ADMIN_PASSWORD env)
 *
 * Run:  npm run db:seed-test-users
 */
const TEST_ACCOUNTS = [
  {
    email:    "testuser@txlocallist.dev",
    password: "TestUser123!",
    role:     "USER",
    name:     "Test Consumer",
  },
  {
    email:    "testowner@txlocallist.dev",
    password: "TestOwner123!",
    role:     "OWNER",
    name:     "Test Business Owner",
  },
];

try {
  for (const account of TEST_ACCOUNTS) {
    const passwordHash = await hashPassword(account.password);
    const user = await prisma.user.upsert({
      where:  { email: account.email },
      update: { passwordHash, role: account.role, name: account.name },
      create: { email: account.email, passwordHash, role: account.role, name: account.name },
      select: { email: true, role: true },
    });
    console.log(`Seeded: ${user.email} (${user.role})`);
  }

  console.log("\n--- Test credentials ---");
  console.log("Basic consumer : testuser@txlocallist.dev  / TestUser123!");
  console.log("Business owner : testowner@txlocallist.dev / TestOwner123!");
  console.log("Admin          : use SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD via seed-admin.mjs");
} finally {
  await prisma.$disconnect();
}
