-- CreateEnum
CREATE TYPE "IstQuestionType" AS ENUM ('TYPE1', 'TYPE2', 'TYPE3', 'TYPE4', 'TYPE5', 'TYPE6', 'TYPE7', 'TYPE8', 'TYPE9');

-- CreateTable
CREATE TABLE "IstOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "IstOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstSubtest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IstSubtest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstQuestion" (
    "id" TEXT NOT NULL,
    "subtestId" TEXT NOT NULL,
    "type" "IstQuestionType" NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "correctAnswer" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IstQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstInvitation" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ(3),
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IstInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IstUserAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionLabel" TEXT,
    "answerText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IstUserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_question_unique" ON "IstUserAnswer"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "IstOption" ADD CONSTRAINT "IstOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "IstQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstQuestion" ADD CONSTRAINT "IstQuestion_subtestId_fkey" FOREIGN KEY ("subtestId") REFERENCES "IstSubtest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstInvitation" ADD CONSTRAINT "IstInvitation_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "TesterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IstUserAnswer" ADD CONSTRAINT "IstUserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "IstQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
