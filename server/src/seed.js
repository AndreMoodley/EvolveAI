import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

const ADMIN_EMAIL = 'admin@evolveai.app';
const ADMIN_PASSWORD = 'VoidAdmin2024!';
const ADMIN_NAME = 'Administrator';

async function seed() {
  const existing = await prisma.practitioner.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    if (existing.role !== 'ADMIN') {
      await prisma.practitioner.update({
        where: { email: ADMIN_EMAIL },
        data: { role: 'ADMIN' },
      });
      console.log(`[seed] Upgraded existing account to ADMIN: ${ADMIN_EMAIL}`);
    } else {
      console.log(`[seed] Admin already exists: ${ADMIN_EMAIL}`);
    }
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.practitioner.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
      role: 'ADMIN',
    },
  });

  console.log('');
  console.log('✓ Admin account created');
  console.log('  Email   :', ADMIN_EMAIL);
  console.log('  Password:', ADMIN_PASSWORD);
  console.log('');

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
