-- CreateTable
CREATE TABLE "IstStandardIqScore" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "rawScore" INTEGER NOT NULL,
    "standarizedScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IstStandardIqScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IstStandardIqScore_age_idx" ON "IstStandardIqScore"("age");

-- CreateIndex
CREATE INDEX "IstStandardScore_age_idx" ON "IstStandardScore"("age");
