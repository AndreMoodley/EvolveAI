-- CreateEnum
CREATE TYPE "FamiliarRarity" AS ENUM ('wandering', 'bound', 'ancient', 'void_herald');

-- AlterTable
ALTER TABLE "Practitioner" ADD COLUMN     "activeBloodlineId" TEXT,
ADD COLUMN     "activeDomainPackId" TEXT,
ADD COLUMN     "activeFamiliarId" TEXT,
ADD COLUMN     "corruptedAt" TIMESTAMP(3),
ADD COLUMN     "hasTranscendentSkin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lesserScrolls" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "restrictionScar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "voidCrystalBalance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vow" ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "vowSubtype" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "wagerAmount" DOUBLE PRECISION,
ADD COLUMN     "wagerStatus" TEXT;

-- CreateTable
CREATE TABLE "Bloodline" (
    "id" TEXT NOT NULL,
    "lineageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "stageConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bloodline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerBloodline" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "bloodlineId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerBloodline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainPack" (
    "id" TEXT NOT NULL,
    "packKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "themeConfig" JSONB NOT NULL,
    "audioBundle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerDomain" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "domainPackId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PractitionerDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familiar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" "FamiliarRarity" NOT NULL,
    "abilityKey" TEXT NOT NULL,
    "visualKey" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerFamiliar" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "familiarId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PractitionerFamiliar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamiliarSummon" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "scrollType" TEXT NOT NULL,
    "pullIndex" INTEGER NOT NULL,
    "familiarId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamiliarSummon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WagerEvent" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "crystalAmount" INTEGER NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekTarget" JSONB NOT NULL,
    "outcome" TEXT,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WagerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bloodline_lineageKey_key" ON "Bloodline"("lineageKey");

-- CreateIndex
CREATE INDEX "PractitionerBloodline_practitionerId_idx" ON "PractitionerBloodline"("practitionerId");

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerBloodline_practitionerId_bloodlineId_key" ON "PractitionerBloodline"("practitionerId", "bloodlineId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainPack_packKey_key" ON "DomainPack"("packKey");

-- CreateIndex
CREATE INDEX "PractitionerDomain_practitionerId_idx" ON "PractitionerDomain"("practitionerId");

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerDomain_practitionerId_domainPackId_key" ON "PractitionerDomain"("practitionerId", "domainPackId");

-- CreateIndex
CREATE INDEX "PractitionerFamiliar_practitionerId_idx" ON "PractitionerFamiliar"("practitionerId");

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerFamiliar_practitionerId_familiarId_key" ON "PractitionerFamiliar"("practitionerId", "familiarId");

-- CreateIndex
CREATE INDEX "FamiliarSummon_practitionerId_timestamp_idx" ON "FamiliarSummon"("practitionerId", "timestamp");

-- CreateIndex
CREATE INDEX "WagerEvent_practitionerId_weekStart_idx" ON "WagerEvent"("practitionerId", "weekStart");

-- AddForeignKey
ALTER TABLE "PractitionerBloodline" ADD CONSTRAINT "PractitionerBloodline_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerBloodline" ADD CONSTRAINT "PractitionerBloodline_bloodlineId_fkey" FOREIGN KEY ("bloodlineId") REFERENCES "Bloodline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerDomain" ADD CONSTRAINT "PractitionerDomain_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerDomain" ADD CONSTRAINT "PractitionerDomain_domainPackId_fkey" FOREIGN KEY ("domainPackId") REFERENCES "DomainPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerFamiliar" ADD CONSTRAINT "PractitionerFamiliar_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerFamiliar" ADD CONSTRAINT "PractitionerFamiliar_familiarId_fkey" FOREIGN KEY ("familiarId") REFERENCES "Familiar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamiliarSummon" ADD CONSTRAINT "FamiliarSummon_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamiliarSummon" ADD CONSTRAINT "FamiliarSummon_familiarId_fkey" FOREIGN KEY ("familiarId") REFERENCES "Familiar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WagerEvent" ADD CONSTRAINT "WagerEvent_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
