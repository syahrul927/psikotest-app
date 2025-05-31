/*
  Warnings:

  - Added the required column `timeLimit` to the `IstSubtest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IstSubtest" ADD COLUMN     "timeLimit" INTEGER NOT NULL;
