/*
  Warnings:

  - Added the required column `dateOfBirth` to the `IstTesterProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeOfBirth` to the `IstTesterProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IstTesterProfile" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "placeOfBirth" TEXT NOT NULL;
