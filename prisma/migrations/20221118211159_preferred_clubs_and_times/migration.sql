-- CreateTable
CREATE TABLE "PreferredClub" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,

    CONSTRAINT "PreferredClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferredTime" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "PreferredTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreferredClub_userId_idx" ON "PreferredClub"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PreferredClub_userId_clubId_key" ON "PreferredClub"("userId", "clubId");

-- CreateIndex
CREATE INDEX "PreferredTime_userId_idx" ON "PreferredTime"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PreferredTime_userId_time_key" ON "PreferredTime"("userId", "time");

-- AddForeignKey
ALTER TABLE "PreferredClub" ADD CONSTRAINT "PreferredClub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferredTime" ADD CONSTRAINT "PreferredTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
