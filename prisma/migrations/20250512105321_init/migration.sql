-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "KraepelinTemplate" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "KraepelinTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TesterProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "educationName" TEXT NOT NULL,
    "educationDescription" TEXT,

    CONSTRAINT "TesterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secretKey" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ(3),
    "testerProfileId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KraepelinResult" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "panker" DOUBLE PRECISION,
    "highestJanker" INTEGER,
    "lowestJanker" INTEGER,
    "janker" INTEGER,
    "tianker" INTEGER,
    "hanker" DOUBLE PRECISION,
    "totalAnswered" INTEGER,
    "totalIncorrect" INTEGER,
    "totalNotAnswered" INTEGER,
    "highestFilled" INTEGER,
    "lowestFilled" INTEGER,
    "deciel" DOUBLE PRECISION,
    "generated" BOOLEAN,

    CONSTRAINT "KraepelinResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KraepelinResultSummary" (
    "id" TEXT NOT NULL,
    "kraepelinResultId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "answered" INTEGER NOT NULL,
    "correct" INTEGER,
    "wrong" INTEGER,

    CONSTRAINT "KraepelinResultSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KraepelinResultDetail" (
    "id" TEXT NOT NULL,
    "kraepelinResultId" TEXT NOT NULL,
    "xA" INTEGER NOT NULL,
    "yA" INTEGER NOT NULL,
    "xB" INTEGER NOT NULL,
    "yB" INTEGER NOT NULL,
    "a" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KraepelinResultDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "KraepelinTemplate_version_x_y_idx" ON "KraepelinTemplate"("version", "x", "y");

-- CreateIndex
CREATE INDEX "KraepelinResult_invitationId_idx" ON "KraepelinResult"("invitationId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_testerProfileId_fkey" FOREIGN KEY ("testerProfileId") REFERENCES "TesterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KraepelinResultSummary" ADD CONSTRAINT "KraepelinResultSummary_kraepelinResultId_fkey" FOREIGN KEY ("kraepelinResultId") REFERENCES "KraepelinResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KraepelinResultDetail" ADD CONSTRAINT "KraepelinResultDetail_kraepelinResultId_fkey" FOREIGN KEY ("kraepelinResultId") REFERENCES "KraepelinResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
