/*
  Warnings:

  - You are about to drop the column `testerProfileId` on the `IstSubtestSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IstSubtestSession" DROP CONSTRAINT "IstSubtestSession_testerProfileId_fkey";

-- AlterTable
ALTER TABLE "IstSubtestSession" DROP COLUMN "testerProfileId";
