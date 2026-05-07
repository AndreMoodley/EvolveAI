-- CreateEnum
CREATE TYPE "VowType" AS ENUM ('major', 'minor');

-- CreateEnum
CREATE TYPE "SessionModality" AS ENUM ('origin', 'pull', 'push', 'core', 'cardio', 'recovery');

-- CreateTable
CREATE TABLE "Practitioner" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Practitioner',
    "ki" INTEGER NOT NULL DEFAULT 100,
    "shadowLevel" INTEGER NOT NULL DEFAULT 1,
    "hammerCount" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastLogDate" TIMESTAMP(3),
    "anchorCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Practitioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vow" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "VowType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolutionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progression" (
    "id" TEXT NOT NULL,
    "vowId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoidSession" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "modality" "SessionModality" NOT NULL,
    "description" TEXT NOT NULL,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 7,
    "note" TEXT,
    "occurredOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoidSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KiLeak" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 5,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KiLeak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrikeEvent" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrikeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_email_key" ON "Practitioner"("email");

-- CreateIndex
CREATE INDEX "Vow_practitionerId_idx" ON "Vow"("practitionerId");

-- CreateIndex
CREATE INDEX "Progression_vowId_idx" ON "Progression"("vowId");

-- CreateIndex
CREATE INDEX "VoidSession_practitionerId_occurredOn_idx" ON "VoidSession"("practitionerId", "occurredOn");

-- CreateIndex
CREATE INDEX "KiLeak_practitionerId_occurredAt_idx" ON "KiLeak"("practitionerId", "occurredAt");

-- CreateIndex
CREATE INDEX "StrikeEvent_practitionerId_occurredAt_idx" ON "StrikeEvent"("practitionerId", "occurredAt");

-- AddForeignKey
ALTER TABLE "Vow" ADD CONSTRAINT "Vow_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_vowId_fkey" FOREIGN KEY ("vowId") REFERENCES "Vow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoidSession" ADD CONSTRAINT "VoidSession_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiLeak" ADD CONSTRAINT "KiLeak_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrikeEvent" ADD CONSTRAINT "StrikeEvent_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
