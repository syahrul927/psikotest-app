/*
  Warnings:

  - Made the column `subtestTemplateId` on table `IstSubtestSession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "IstSubtestSession" DROP CONSTRAINT "IstSubtestSession_subtestTemplateId_fkey";

-- AlterTable
ALTER TABLE "IstResult" ALTER COLUMN "answered" DROP NOT NULL,
ALTER COLUMN "missed" DROP NOT NULL,
ALTER COLUMN "answeredCorrectly" DROP NOT NULL,
ALTER COLUMN "answeredWrong" DROP NOT NULL,
ALTER COLUMN "standarizedScore" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IstSubtestSession" ALTER COLUMN "subtestTemplateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "IstSubtestSession" ADD CONSTRAINT "IstSubtestSession_subtestTemplateId_fkey" FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
