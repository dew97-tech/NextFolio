-- AlterTable
ALTER TABLE "Post" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Backfill: published posts were dated when their draft was created
UPDATE "Post" SET "publishedAt" = "date" WHERE "published" = true;

-- DropIndex
DROP INDEX "Post_published_date_idx";

-- CreateIndex
CREATE INDEX "Post_published_publishedAt_idx" ON "Post"("published", "publishedAt" DESC);
