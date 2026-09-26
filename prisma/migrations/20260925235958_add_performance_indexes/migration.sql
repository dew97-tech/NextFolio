-- CreateIndex
CREATE INDEX "Post_published_date_idx" ON "Post"("published", "date" DESC);

-- CreateIndex
CREATE INDEX "GenerationRun_status_startedAt_idx" ON "GenerationRun"("status", "startedAt" DESC);

