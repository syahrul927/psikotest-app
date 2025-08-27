/*
  Warnings:

  - Changed the type of `factor` on the `PapiKostickResultDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PapiKostickResultDetail" DROP COLUMN "factor",
ADD COLUMN     "factor" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PapiKostickFactor";

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickResultDetail_resultId_factor_key" ON "PapiKostickResultDetail"("resultId", "factor");
