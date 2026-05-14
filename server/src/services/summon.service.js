import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// Pity thresholds
const ANCIENT_PITY = 50;
const VOID_HERALD_PITY = 100;

// Drop rates by scroll type and rarity
const RATES = {
  lesser: { wandering: 0.60, bound: 0.30, ancient: 0.09, void_herald: 0.01 },
  abyssal: { wandering: 0.30, bound: 0.50, ancient: 0.18, void_herald: 0.02 },
};

// Void Crystal cost for one abyssal summon
const ABYSSAL_CRYSTAL_COST = 10;

export async function performSummon(userId, scrollType) {
  // Verify user has the scroll type available
  const practitioner = await prisma.practitioner.findUnique({
    where: { id: userId },
    select: {
      voidCrystalBalance: true,
      lesserScrolls: true,
    },
  });

  if (!practitioner) throw new AppError('Practitioner not found', 404);

  if (scrollType === 'lesser' && (practitioner.lesserScrolls ?? 0) < 1) {
    throw new AppError('No Lesser Summoning Scrolls available', 400, 'NO_SCROLLS');
  }

  if (scrollType === 'abyssal' && (practitioner.voidCrystalBalance ?? 0) < ABYSSAL_CRYSTAL_COST) {
    throw new AppError(`Insufficient Void Crystals. Abyssal summon costs ${ABYSSAL_CRYSTAL_COST} crystals`, 400, 'INSUFFICIENT_CRYSTALS');
  }

  // Get pull history for pity computation
  const pullHistory = await prisma.familiarSummon.findMany({
    where: { practitionerId: userId },
    orderBy: { pullIndex: 'asc' },
    select: { pullIndex: true, familiar: { select: { rarity: true } } },
  });

  const pullIndex = pullHistory.length;
  const pity = computePity(pullHistory);
  const rarity = rollRarity(scrollType, pity);

  // Get a familiar of the rolled rarity the user doesn't own yet
  const owned = await prisma.practitionerFamiliar.findMany({
    where: { practitionerId: userId },
    select: { familiarId: true },
  });
  const ownedIds = owned.map((p) => p.familiarId);

  const candidates = await prisma.familiar.findMany({
    where: { rarity, ...(ownedIds.length > 0 && { id: { notIn: ownedIds } }) },
  });

  // If all of this rarity owned, pick any duplicate
  const pool = candidates.length > 0
    ? candidates
    : await prisma.familiar.findMany({ where: { rarity } });

  if (pool.length === 0) throw new AppError(`No familiars available for rarity: ${rarity}`, 500);

  const familiar = pool[Math.floor(Math.random() * pool.length)];

  // Record the summon + upsert ownership in a transaction
  await prisma.$transaction([
    prisma.familiarSummon.create({
      data: { practitionerId: userId, scrollType, pullIndex, familiarId: familiar.id },
    }),
    prisma.practitionerFamiliar.upsert({
      where: { practitionerId_familiarId: { practitionerId: userId, familiarId: familiar.id } },
      create: { practitionerId: userId, familiarId: familiar.id },
      update: {},
    }),
    // Deduct scroll or crystals
    prisma.practitioner.update({
      where: { id: userId },
      data: scrollType === 'lesser'
        ? { lesserScrolls: { decrement: 1 } }
        : { voidCrystalBalance: { decrement: ABYSSAL_CRYSTAL_COST } },
    }),
  ]);

  return {
    familiar,
    pullIndex,
    pityAfterPull: {
      ancientPulls: pity.pullsSinceAncient + 1,
      voidHeraldPulls: pity.pullsSinceVoidHerald + 1,
      ancientGuaranteedAt: ANCIENT_PITY,
      voidHeraldGuaranteedAt: VOID_HERALD_PITY,
    },
    isNew: !ownedIds.includes(familiar.id),
  };
}

function computePity(pullHistory) {
  let pullsSinceAncient = 0;
  let pullsSinceVoidHerald = 0;

  for (let i = pullHistory.length - 1; i >= 0; i--) {
    const rarity = pullHistory[i].familiar?.rarity;
    if (rarity === 'void_herald') break;
    pullsSinceVoidHerald++;
  }
  for (let i = pullHistory.length - 1; i >= 0; i--) {
    const rarity = pullHistory[i].familiar?.rarity;
    if (rarity === 'ancient' || rarity === 'void_herald') break;
    pullsSinceAncient++;
  }

  return { pullsSinceAncient, pullsSinceVoidHerald };
}

function rollRarity(scrollType, pity) {
  // Pity guarantees
  if (pity.pullsSinceVoidHerald >= VOID_HERALD_PITY - 1) return 'void_herald';
  if (pity.pullsSinceAncient >= ANCIENT_PITY - 1) return 'ancient';

  const rates = RATES[scrollType];
  const roll = Math.random();

  if (roll < rates.void_herald) return 'void_herald';
  if (roll < rates.void_herald + rates.ancient) return 'ancient';
  if (roll < rates.void_herald + rates.ancient + rates.bound) return 'bound';
  return 'wandering';
}
