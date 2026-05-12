-- Add hiring flag to business listings
ALTER TABLE "Business"
ADD COLUMN IF NOT EXISTS "isHiring" BOOLEAN NOT NULL DEFAULT false;
