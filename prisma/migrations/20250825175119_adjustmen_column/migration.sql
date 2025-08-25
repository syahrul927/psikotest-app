/*
  Warnings:

  - Added the required column `score` to the `PapiKostickResultDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PapiKostickResultDetail" ADD COLUMN     "category" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL;
