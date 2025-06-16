/*
  Warnings:

  - Added the required column `istInvitationId` to the `IstSubtestSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IstSubtestSession" ADD COLUMN     "istInvitationId" TEXT NOT NULL,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "IstSubtestSession" ADD CONSTRAINT "IstSubtestSession_istInvitationId_fkey" FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
