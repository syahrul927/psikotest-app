-- CreateEnum
CREATE TYPE "StatusWwqInvitation" AS ENUM ('PENDING', 'ONPROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "WwqTesterProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WwqTesterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WwqInvitation" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "status" "StatusWwqInvitation" NOT NULL DEFAULT 'PENDING',
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WwqInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WwqQuestion" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WwqQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WwqAnswer" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WwqAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WwqResult" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "totalWeighted" INTEGER NOT NULL,
    "overallValue" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "completedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WwqResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WwqResultDetail" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "aspectNo" INTEGER NOT NULL,
    "aspect" TEXT NOT NULL,
    "rawScore" INTEGER NOT NULL,
    "acuan" INTEGER NOT NULL,
    "weighted" INTEGER NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WwqResultDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WwqQuestion_order_key" ON "WwqQuestion"("order");

-- CreateIndex
CREATE INDEX "WwqAnswer_invitationId_idx" ON "WwqAnswer"("invitationId");

-- CreateIndex
CREATE INDEX "WwqAnswer_questionId_idx" ON "WwqAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "WwqAnswer_invitationId_questionId_key" ON "WwqAnswer"("invitationId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "WwqResult_invitationId_key" ON "WwqResult"("invitationId");

-- CreateIndex
CREATE INDEX "WwqResult_invitationId_idx" ON "WwqResult"("invitationId");

-- CreateIndex
CREATE INDEX "WwqResultDetail_resultId_idx" ON "WwqResultDetail"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "WwqResultDetail_resultId_aspectNo_key" ON "WwqResultDetail"("resultId", "aspectNo");

-- AddForeignKey
ALTER TABLE "WwqInvitation" ADD CONSTRAINT "WwqInvitation_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "WwqTesterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WwqAnswer" ADD CONSTRAINT "WwqAnswer_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "WwqInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WwqAnswer" ADD CONSTRAINT "WwqAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "WwqQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WwqResult" ADD CONSTRAINT "WwqResult_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "WwqInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WwqResultDetail" ADD CONSTRAINT "WwqResultDetail_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "WwqResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
