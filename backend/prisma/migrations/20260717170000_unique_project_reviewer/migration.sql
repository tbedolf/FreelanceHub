-- Prevent a user from reviewing the same project more than once.
CREATE UNIQUE INDEX "Review_projectId_reviewerId_key"
ON "Review"("projectId", "reviewerId");
