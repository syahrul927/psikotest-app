-- CreateEnum
CREATE TYPE "StatusPapiKostickInvitation" AS ENUM ('PENDING', 'ONPROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "PapiKostickFactor" AS ENUM ('N', 'G', 'A', 'L', 'P', 'I', 'T', 'V', 'O', 'B', 'S', 'X', 'C', 'D', 'R', 'Z', 'E', 'K', 'F', 'W');

-- CreateTable
CREATE TABLE "PapiKostickTesterProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(3) NOT NULL,
    "educationDescription" TEXT,

    CONSTRAINT "PapiKostickTesterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickInvitation" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "status" "StatusPapiKostickInvitation" NOT NULL DEFAULT 'PENDING',
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PapiKostickInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "descriptionA" TEXT NOT NULL,
    "descriptionB" TEXT NOT NULL,
    "factorA" TEXT NOT NULL,
    "factorB" TEXT NOT NULL,
    "isReverseScored" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PapiKostickQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickAnswer" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" VARCHAR(1) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PapiKostickAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickResult" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "n" DOUBLE PRECISION NOT NULL,
    "g" DOUBLE PRECISION NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "l" DOUBLE PRECISION NOT NULL,
    "p" DOUBLE PRECISION NOT NULL,
    "i" DOUBLE PRECISION NOT NULL,
    "t" DOUBLE PRECISION NOT NULL,
    "v" DOUBLE PRECISION NOT NULL,
    "o" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "s" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "c" DOUBLE PRECISION NOT NULL,
    "d" DOUBLE PRECISION NOT NULL,
    "r" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "e" DOUBLE PRECISION NOT NULL,
    "k" DOUBLE PRECISION NOT NULL,
    "f" DOUBLE PRECISION NOT NULL,
    "w" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PapiKostickResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickResultDetail" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "factor" "PapiKostickFactor" NOT NULL,
    "rawScore" DOUBLE PRECISION NOT NULL,
    "normalizedScore" DOUBLE PRECISION NOT NULL,
    "percentile" DOUBLE PRECISION,
    "interpretation" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PapiKostickResultDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PapiKostickInterpretation" (
    "id" TEXT NOT NULL,
    "factor" "PapiKostickFactor" NOT NULL,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PapiKostickInterpretation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickQuestion_questionNumber_key" ON "PapiKostickQuestion"("questionNumber");

-- CreateIndex
CREATE INDEX "PapiKostickAnswer_invitationId_idx" ON "PapiKostickAnswer"("invitationId");

-- CreateIndex
CREATE INDEX "PapiKostickAnswer_questionId_idx" ON "PapiKostickAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickAnswer_invitationId_questionId_key" ON "PapiKostickAnswer"("invitationId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickResult_invitationId_key" ON "PapiKostickResult"("invitationId");

-- CreateIndex
CREATE INDEX "PapiKostickResult_invitationId_idx" ON "PapiKostickResult"("invitationId");

-- CreateIndex
CREATE INDEX "PapiKostickResultDetail_resultId_idx" ON "PapiKostickResultDetail"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickResultDetail_resultId_factor_key" ON "PapiKostickResultDetail"("resultId", "factor");

-- CreateIndex
CREATE INDEX "PapiKostickInterpretation_factor_idx" ON "PapiKostickInterpretation"("factor");

-- CreateIndex
CREATE UNIQUE INDEX "PapiKostickInterpretation_factor_minScore_maxScore_key" ON "PapiKostickInterpretation"("factor", "minScore", "maxScore");

-- AddForeignKey
ALTER TABLE "PapiKostickInvitation" ADD CONSTRAINT "PapiKostickInvitation_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "PapiKostickTesterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PapiKostickAnswer" ADD CONSTRAINT "PapiKostickAnswer_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "PapiKostickInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PapiKostickAnswer" ADD CONSTRAINT "PapiKostickAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PapiKostickQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PapiKostickResult" ADD CONSTRAINT "PapiKostickResult_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "PapiKostickInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PapiKostickResultDetail" ADD CONSTRAINT "PapiKostickResultDetail_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "PapiKostickResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
