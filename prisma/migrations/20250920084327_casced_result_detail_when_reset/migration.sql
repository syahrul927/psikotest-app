-- DropForeignKey
ALTER TABLE "IstResultDetail" DROP CONSTRAINT "IstResultDetail_istResultId_fkey";

-- AddForeignKey
ALTER TABLE "IstResultDetail" ADD CONSTRAINT "IstResultDetail_istResultId_fkey" FOREIGN KEY ("istResultId") REFERENCES "IstResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
