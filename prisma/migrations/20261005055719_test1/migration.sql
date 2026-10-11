-- CreateTable
CREATE TABLE "Permit" (
    "id" SERIAL NOT NULL,
    "permitNo" TEXT NOT NULL,
    "applicationNum" TEXT NOT NULL,
    "altitudeFt" INTEGER NOT NULL,
    "class" INTEGER NOT NULL,
    "fullText" TEXT NOT NULL,

    CONSTRAINT "Permit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "permitId" INTEGER NOT NULL,
    "activityDate" TEXT NOT NULL,
    "activityTime" TEXT NOT NULL,
    "activityDateTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'N',
    "mref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "takenBy" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permit_permitNo_key" ON "Permit"("permitNo");

-- CreateIndex
CREATE INDEX "Activity_status_activityDateTime_idx" ON "Activity"("status", "activityDateTime");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_permitId_activityDate_activityTime_key" ON "Activity"("permitId", "activityDate", "activityTime");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Permit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
