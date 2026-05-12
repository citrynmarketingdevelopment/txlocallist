-- Create applications table for business hiring submissions
CREATE TABLE IF NOT EXISTS "BusinessApplication" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "resumeFileName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BusinessApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BusinessApplication_businessId_createdAt_idx"
ON "BusinessApplication"("businessId", "createdAt");

CREATE INDEX IF NOT EXISTS "BusinessApplication_email_idx"
ON "BusinessApplication"("email");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'BusinessApplication_businessId_fkey'
  ) THEN
    ALTER TABLE "BusinessApplication"
    ADD CONSTRAINT "BusinessApplication_businessId_fkey"
    FOREIGN KEY ("businessId")
    REFERENCES "Business"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;
