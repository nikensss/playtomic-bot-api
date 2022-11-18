/*
  Warnings:

  - You are about to drop the column `clubName` on the `PreferredClub` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreferredClub" DROP COLUMN "clubName";

-- CreateIndex
CREATE INDEX "users_telegramId_idx" ON "users"("telegramId");
