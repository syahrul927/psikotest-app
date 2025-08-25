/*
  Warnings:

  - You are about to drop the column `normalizedScore` on the `PapiKostickResultDetail` table. All the data in the column will be lost.
  - You are about to drop the column `percentile` on the `PapiKostickResultDetail` table. All the data in the column will be lost.
  - You are about to drop the column `rawScore` on the `PapiKostickResultDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PapiKostickResultDetail" DROP COLUMN "normalizedScore",
DROP COLUMN "percentile",
DROP COLUMN "rawScore";
