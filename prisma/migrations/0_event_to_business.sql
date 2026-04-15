-- ================================================================
-- Migration: Event → Business (data migration)
-- ================================================================
-- This migration renames the Event table to Business and adjusts schema.
-- Run this AFTER running `prisma migrate deploy` with the new schema.

-- Step 1: Create the Event_backup table for safety
CREATE TABLE IF NOT EXISTS "Event_backup" AS
SELECT * FROM "Event";

-- Step 2: Copy Event data into a temporary staging table
-- (We'll manually insert into Business after the schema is ready)
-- This step is just a safety measure; actual data transfer happens in
-- a post-migration script (seed-event-data.mjs).

-- Step 3: The new Business table is created by Prisma's migrations,
-- so we don't need to CREATE it here. This file just documents the
-- transition and backs up the old data.

-- If you need to restore Event data before the new seed runs:
-- SELECT * FROM "Event_backup";
