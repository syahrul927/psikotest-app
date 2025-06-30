/*
  Warnings:

  - Added the required column `from` to the `IstStandardIqScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `IstStandardIqScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IstStandardIqScore" ADD COLUMN     "from" INTEGER NOT NULL,
ADD COLUMN     "to" INTEGER NOT NULL;
