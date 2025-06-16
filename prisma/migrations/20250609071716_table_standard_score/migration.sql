/*
  Warnings:

  - You are about to drop the `IstUserAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IstUserAnswer" DROP CONSTRAINT "IstUserAnswer_questionId_fkey";

-- AlterTable
ALTER TABLE "IstQuestionTemplate" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "IstSubtestSession" ALTER COLUMN "startedAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "submittedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "IstSubtestTemplate" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- DropTable
DROP TABLE "IstUserAnswer";

-- CreateTable
CREATE TABLE "IstResult" (
    "id" TEXT NOT NULL,
    "istInvitationId" TEXT NOT NULL,
    "subtestTemplateId" TEXT NOT NULL,
    "answered" INTEGER NOT NULL,
    "missed" INTEGER NOT NULL,
    "answeredCorrectly" INTEGER NOT NULL,
    "answeredWrong" INTEGER NOT NULL,
    "standarizedScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IstResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstResultDetail" (
    "id" TEXT NOT NULL,
    "istResultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IstResultDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstStandardScore" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "subtestTemplateId" TEXT NOT NULL,
    "rawScore" INTEGER NOT NULL,
    "standarizedScore" INTEGER NOT NULL,
    "description" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IstStandardScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_question_unique" ON "IstResultDetail"("questionId");

-- AddForeignKey
ALTER TABLE "IstResult" ADD CONSTRAINT "IstResult_istInvitationId_fkey" FOREIGN KEY ("istInvitationId") REFERENCES "IstInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstResult" ADD CONSTRAINT "IstResult_subtestTemplateId_fkey" FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstResultDetail" ADD CONSTRAINT "IstResultDetail_istResultId_fkey" FOREIGN KEY ("istResultId") REFERENCES "IstResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstResultDetail" ADD CONSTRAINT "IstResultDetail_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "IstQuestionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstStandardScore" ADD CONSTRAINT "IstStandardScore_subtestTemplateId_fkey" FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
