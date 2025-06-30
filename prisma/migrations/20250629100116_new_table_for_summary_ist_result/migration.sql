-- CreateTable
CREATE TABLE "IstResultSummary" (
    "id" TEXT NOT NULL,
    "istInvitationId" TEXT NOT NULL,
    "thinkingFlexibility" INTEGER NOT NULL,
    "attentionFlexibility" INTEGER NOT NULL,
    "reasoningLogic" INTEGER NOT NULL,
    "memoryAndConcentration" INTEGER NOT NULL,
    "analyticalSynthesis" INTEGER NOT NULL,
    "numericalAbility" INTEGER NOT NULL,
    "totalIQ" INTEGER NOT NULL,

    CONSTRAINT "IstResultSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IstResultSummary" ADD CONSTRAINT "IstResultSummary_istInvitationId_fkey" FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
