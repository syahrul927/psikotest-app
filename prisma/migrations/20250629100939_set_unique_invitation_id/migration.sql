/*
  Warnings:

  - A unique constraint covering the columns `[istInvitationId]` on the table `IstResultSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IstResultSummary_istInvitationId_key" ON "IstResultSummary"("istInvitationId");
