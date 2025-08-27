/*
  Warnings:

  - You are about to drop the column `factorA` on the `PapiKostickQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `factorB` on the `PapiKostickQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `isReverseScored` on the `PapiKostickQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `questionNumber` on the `PapiKostickQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `a` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `b` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `c` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `d` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `e` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `f` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `g` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `i` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `k` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `l` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `n` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `o` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `p` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `r` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `s` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `t` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `v` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `w` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `z` on the `PapiKostickResult` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `PapiKostickTesterProfile` table. All the data in the column will be lost.
  - You are about to drop the column `educationDescription` on the `PapiKostickTesterProfile` table. All the data in the column will be lost.
  - You are about to drop the column `placeOfBirth` on the `PapiKostickTesterProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PapiKostickQuestion_questionNumber_key";

-- AlterTable
ALTER TABLE "PapiKostickQuestion" DROP COLUMN "factorA",
DROP COLUMN "factorB",
DROP COLUMN "isReverseScored",
DROP COLUMN "questionNumber";

-- AlterTable
ALTER TABLE "PapiKostickResult" DROP COLUMN "a",
DROP COLUMN "b",
DROP COLUMN "c",
DROP COLUMN "d",
DROP COLUMN "e",
DROP COLUMN "f",
DROP COLUMN "g",
DROP COLUMN "i",
DROP COLUMN "k",
DROP COLUMN "l",
DROP COLUMN "n",
DROP COLUMN "o",
DROP COLUMN "p",
DROP COLUMN "r",
DROP COLUMN "s",
DROP COLUMN "t",
DROP COLUMN "v",
DROP COLUMN "w",
DROP COLUMN "x",
DROP COLUMN "z";

-- AlterTable
ALTER TABLE "PapiKostickTesterProfile" DROP COLUMN "address",
DROP COLUMN "educationDescription",
DROP COLUMN "placeOfBirth",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
