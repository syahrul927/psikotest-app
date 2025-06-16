/*
  Warnings:

  - You are about to drop the column `type` on the `IstQuestionTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IstQuestionTemplate" DROP COLUMN "type";

-- DropEnum
DROP TYPE "IstSubtestType";
