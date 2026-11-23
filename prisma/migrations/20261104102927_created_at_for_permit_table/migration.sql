/*
  Warnings:

  - A unique constraint covering the columns `[applicationNum]` on the table `Permit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Permit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Permit_applicationNum_key" ON "Permit"("applicationNum");
