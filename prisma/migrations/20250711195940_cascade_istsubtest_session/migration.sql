-- DropForeignKey
ALTER TABLE "IstSubtestSession" DROP CONSTRAINT "IstSubtestSession_istInvitationId_fkey";

-- AddForeignKey
ALTER TABLE "IstSubtestSession" ADD CONSTRAINT "IstSubtestSession_istInvitationId_fkey" FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
