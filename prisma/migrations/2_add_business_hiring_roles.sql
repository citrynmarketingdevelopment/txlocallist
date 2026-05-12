-- Add hiring roles payload for business listings
ALTER TABLE "Business"
ADD COLUMN IF NOT EXISTS "hiringRoles" TEXT NOT NULL DEFAULT '[]';
