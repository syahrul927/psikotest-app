/*
  Warnings:

  - Added the required column `sumRawScore` to the `IstResultSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sumStandarizedScore` to the `IstResultSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IstResultSummary" ADD COLUMN     "sumRawScore" INTEGER NOT NULL,
ADD COLUMN     "sumStandarizedScore" INTEGER NOT NULL;
