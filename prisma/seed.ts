import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // ── Super admin ──────────────────────────────────────────────────────────
  const email = 'admin@muastudio.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Super admin already exists:', email);
  } else {
    const passwordHash = await bcrypt.hash('Admin@1234!', 12);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      },
    });
    console.log('✅ Super admin created');
    console.log('   Email   :', email);
    console.log('   Password: Admin@1234!');
  }

  // ── Default time slots ───────────────────────────────────────────────────
  const existingSlots = await prisma.timeSlot.count();
  if (existingSlots === 0) {
    const defaultSlots = [
      {
        label: 'Subuh (04:00 – 06:00)',
        startTime: '04:00',
        endTime: '06:00',
        sortOrder: 0,
      },
      {
        label: 'Pagi (06:00 – 09:00)',
        startTime: '06:00',
        endTime: '09:00',
        sortOrder: 1,
      },
      {
        label: 'Pagi (07:00 – 10:00)',
        startTime: '07:00',
        endTime: '10:00',
        sortOrder: 2,
      },
      {
        label: 'Siang (09:00 – 12:00)',
        startTime: '09:00',
        endTime: '12:00',
        sortOrder: 3,
      },
      {
        label: 'Siang (10:00 – 13:00)',
        startTime: '10:00',
        endTime: '13:00',
        sortOrder: 4,
      },
      {
        label: 'Sore (13:00 – 16:00)',
        startTime: '13:00',
        endTime: '16:00',
        sortOrder: 5,
      },
      {
        label: 'Sore (15:00 – 18:00)',
        startTime: '15:00',
        endTime: '18:00',
        sortOrder: 6,
      },
      {
        label: 'Malam (18:00 – 21:00)',
        startTime: '18:00',
        endTime: '21:00',
        sortOrder: 7,
      },
    ];
    await prisma.timeSlot.createMany({ data: defaultSlots });
    console.log(`✅ ${defaultSlots.length} time slots seeded`);
  } else {
    console.log(`Time slots already exist (${existingSlots} records)`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
