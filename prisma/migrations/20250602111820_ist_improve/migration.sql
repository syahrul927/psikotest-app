/*
  Warnings:

  - You are about to drop the column `startAt` on the `IstInvitation` table. All the data in the column will be lost.
  - You are about to drop the column `answerText` on the `IstUserAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `selectedOptionLabel` on the `IstUserAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `IstUserAnswer` table. All the data in the column will be lost.
  - You are about to drop the `IstOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IstQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IstSubtest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answer` to the `IstUserAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testerProfileId` to the `IstUserAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IstSubtestType" AS ENUM ('TYPE1', 'TYPE2', 'TYPE3', 'TYPE4', 'TYPE5', 'TYPE6', 'TYPE7', 'TYPE8', 'TYPE9');

-- CreateEnum
CREATE TYPE "StatusIstInvitation" AS ENUM ('PENDING', 'ONPROGRESS', 'AWAITING_REVIEW', 'DONE');

-- DropForeignKey
ALTER TABLE "IstInvitation" DROP CONSTRAINT "IstInvitation_testerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "IstOption" DROP CONSTRAINT "IstOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "IstQuestion" DROP CONSTRAINT "IstQuestion_subtestId_fkey";

-- DropForeignKey
ALTER TABLE "IstUserAnswer" DROP CONSTRAINT "IstUserAnswer_questionId_fkey";

-- DropIndex
DROP INDEX "user_question_unique";

-- AlterTable
ALTER TABLE "IstInvitation" DROP COLUMN "startAt",
ADD COLUMN     "status" "StatusIstInvitation" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "IstUserAnswer" DROP COLUMN "answerText",
DROP COLUMN "selectedOptionLabel",
DROP COLUMN "userId",
ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "testerProfileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "IstOption";

-- DropTable
DROP TABLE "IstQuestion";

-- DropTable
DROP TABLE "IstSubtest";

-- DropEnum
DROP TYPE "IstQuestionType";

-- CreateTable
CREATE TABLE "IstTesterProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "educationName" TEXT NOT NULL,
    "educationDescription" TEXT,

    CONSTRAINT "IstTesterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstSubtestSession" (
    "id" TEXT NOT NULL,
    "testerProfileId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "questionOrder" TEXT[],
    "subtestTemplateId" TEXT,

    CONSTRAINT "IstSubtestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstSubtestTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IstSubtestTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstQuestionTemplate" (
    "id" TEXT NOT NULL,
    "subtestTemplateId" TEXT NOT NULL,
    "type" "IstSubtestType" NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "correctAnswer" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IstQuestionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstOptionTemplate" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "IstOptionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_question_unique" ON "IstUserAnswer"("questionId");

-- AddForeignKey
ALTER TABLE "IstInvitation" ADD CONSTRAINT "IstInvitation_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "IstTesterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstSubtestSession" ADD CONSTRAINT "IstSubtestSession_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "IstTesterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstSubtestSession" ADD CONSTRAINT "IstSubtestSession_subtestTemplateId_fkey" FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstUserAnswer" ADD CONSTRAINT "IstUserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "IstQuestionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstQuestionTemplate" ADD CONSTRAINT "IstQuestionTemplate_subtestTemplateId_fkey" FOREIGN KEY ("subtestTemplateId") REFERENCES "IstSubtestTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstOptionTemplate" ADD CONSTRAINT "IstOptionTemplate_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "IstQuestionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
