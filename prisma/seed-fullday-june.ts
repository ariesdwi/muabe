import 'dotenv/config';
import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);
const d = (iso: string) => new Date(iso);

interface Slot {
  date: string;
  start: string;
  end: string;
  serviceSlug: string;
  customerEmail: string;
  location: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  agreedPrice: number;
  approvedAt?: string;
  hasPaymentProof?: boolean;
  paymentStatus?: PaymentStatus;
  adminNote?: string;
}

// ─── 3 fully-booked Saturdays in June 2026 ──────────────────────────────────
const SLOTS: Slot[] = [

  // ══════════════════════════════════════════════════════════════════════
  // JUNE 6 (Saturday) — existing: Soft Glam 09:00–11:00 WAITING_APPROVAL
  // ══════════════════════════════════════════════════════════════════════
  {
    date: '2026-06-06', start: '06:00', end: '08:00',
    serviceSlug: 'graduation-makeup',
    customerEmail: 'rina.marlina@gmail.com',
    location: 'Kampus STIKES Bandung', address: 'Jl. Sarimanah Blok 23, Bandung',
    notes: 'Wisuda S1 – pagi awal sebelum upacara jam 08:30',
    status: BookingStatus.APPROVED, agreedPrice: 800_000,
    approvedAt: '2026-05-25T08:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-06', start: '11:30', end: '13:30',
    serviceSlug: 'photoshoot-makeup',
    customerEmail: 'nadia.octaviani@gmail.com',
    location: 'Studio Foto Prisma', address: 'Jl. Merdeka No. 40, Bandung',
    notes: 'Sesi foto maternity',
    status: BookingStatus.APPROVED, agreedPrice: 1_000_000,
    approvedAt: '2026-05-26T09:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-06', start: '14:00', end: '16:00',
    serviceSlug: 'party-event-makeup',
    customerEmail: 'lestari.wulandari@gmail.com',
    location: 'Gedung Serbaguna Permata', address: 'Jl. Permata No. 17, Bandung',
    notes: 'Pesta ulang tahun ke-25',
    status: BookingStatus.APPROVED, agreedPrice: 600_000,
    approvedAt: '2026-05-28T11:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-06', start: '17:00', end: '21:00',
    serviceSlug: 'bridal-makeup',
    customerEmail: 'dewi.kusuma@gmail.com',
    location: 'Ballroom Harris Hotel', address: 'Jl. Peta No. 241, Bandung',
    notes: 'Resepsi pernikahan sore-malam, tema navy gold',
    status: BookingStatus.APPROVED, agreedPrice: 2_700_000,
    approvedAt: '2026-05-15T10:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
    adminNote: 'Hari Sabtu padat – 5 klien terjadwal. Cek alat kosmetik cadangan.',
  },

  // ══════════════════════════════════════════════════════════════════════
  // JUNE 13 (Saturday) — existing: Graduation 07:00–09:00 PENDING_PAYMENT
  // ══════════════════════════════════════════════════════════════════════
  {
    date: '2026-06-13', start: '10:00', end: '12:00',
    serviceSlug: 'photoshoot-makeup',
    customerEmail: 'fitri.handayani@gmail.com',
    location: 'Studio Foto Lumina', address: 'Jl. Braga No. 18, Bandung',
    notes: 'Pemotretan buku tahunan wisuda',
    status: BookingStatus.APPROVED, agreedPrice: 1_000_000,
    approvedAt: '2026-06-01T09:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-13', start: '13:00', end: '15:00',
    serviceSlug: 'engagement-makeup',
    customerEmail: 'rina.marlina@gmail.com',
    location: 'Café Botanica', address: 'Jl. Setiabudhi No. 190, Bandung',
    notes: 'Lamaran siang, tema dusty rose',
    status: BookingStatus.APPROVED, agreedPrice: 1_500_000,
    approvedAt: '2026-06-02T10:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
    adminNote: 'Klien minta efek glitter halus di kelopak mata.',
  },
  {
    date: '2026-06-13', start: '15:30', end: '19:30',
    serviceSlug: 'bridal-makeup',
    customerEmail: 'citra.amelia@gmail.com',
    location: 'The Trans Luxury Hotel', address: 'Jl. Gatot Subroto No. 83, Bandung',
    notes: 'Akad + resepsi sore, pengantin Jawa modern',
    status: BookingStatus.APPROVED, agreedPrice: 2_800_000,
    approvedAt: '2026-05-20T14:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-13', start: '20:00', end: '21:30',
    serviceSlug: 'soft-glam-makeup',
    customerEmail: 'siti.rahayu@gmail.com',
    location: 'Ballroom Hotel Padma', address: 'Jl. Ranca Bentang No. 56, Bandung',
    notes: 'Gala dinner setelah resepsi – touch-up cepat',
    status: BookingStatus.PENDING_PAYMENT, agreedPrice: 450_000,
  },

  // ══════════════════════════════════════════════════════════════════════
  // JUNE 20 (Saturday) — existing: Graduation 07:00–09:00 DRAFT
  // ══════════════════════════════════════════════════════════════════════
  {
    date: '2026-06-20', start: '09:30', end: '13:30',
    serviceSlug: 'bridal-makeup',
    customerEmail: 'melinda.sari@gmail.com',
    location: 'Aula Gedung Merdeka', address: 'Jl. Asia Afrika No. 65, Bandung',
    notes: 'Pengantin adat modern, tema sage green',
    status: BookingStatus.APPROVED, agreedPrice: 2_500_000,
    approvedAt: '2026-06-05T09:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
    adminNote: 'Jadwal hari ini mulai pagi sampai malam – bawa asisten.',
  },
  {
    date: '2026-06-20', start: '14:00', end: '16:00',
    serviceSlug: 'engagement-makeup',
    customerEmail: 'yuliana.putri@outlook.com',
    location: 'Rumah Klien', address: 'Jl. Supratman No. 34, Bandung',
    notes: 'Lamaran keluarga inti saja, semi-formal',
    status: BookingStatus.APPROVED, agreedPrice: 1_500_000,
    approvedAt: '2026-06-07T10:00:00Z',
    hasPaymentProof: true, paymentStatus: PaymentStatus.APPROVED,
  },
  {
    date: '2026-06-20', start: '17:00', end: '19:00',
    serviceSlug: 'party-event-makeup',
    customerEmail: 'nadia.octaviani@gmail.com',
    location: 'Sky Lounge Hotel Sheraton', address: 'Jl. Ir. H. Juanda No. 390, Bandung',
    notes: 'Corporate year-end party – bold glam',
    status: BookingStatus.WAITING_APPROVAL, agreedPrice: 650_000,
    hasPaymentProof: true, paymentStatus: PaymentStatus.WAITING_APPROVAL,
  },
];

async function main() {
  console.log('🗓️  Seeding full-day Saturday bookings for June 2026...\n');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@muastudio.com' } });
  if (!admin) throw new Error('Super admin not found – run seed-dummy.ts first');

  const services = await prisma.service.findMany();
  const svcMap   = new Map(services.map((s) => [s.slug, s.id]));
  const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const custMap  = new Map(customers.map((c) => [c.email!, c.id]));

  const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  let added = 0;
  for (const slot of SLOTS) {
    const customerId = custMap.get(slot.customerEmail);
    const serviceId  = svcMap.get(slot.serviceSlug);
    if (!customerId) throw new Error(`Customer not found: ${slot.customerEmail}`);
    if (!serviceId)  throw new Error(`Service not found: ${slot.serviceSlug}`);

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceId,
        eventDate:      d(`${slot.date}T00:00:00Z`),
        eventStartTime: slot.start,
        eventEndTime:   slot.end,
        eventLocation:  slot.location,
        eventAddress:   slot.address,
        notes:          slot.notes ?? null,
        agreedPrice:    slot.agreedPrice,
        status:         slot.status,
        approvedAt:     slot.approvedAt ? d(slot.approvedAt) : null,
      },
    });

    if (slot.hasPaymentProof && slot.paymentStatus) {
      const isApproved = slot.paymentStatus === PaymentStatus.APPROVED;
      await prisma.paymentProof.create({
        data: {
          bookingId:    booking.id,
          fileUrl:      `https://res.cloudinary.com/demo/image/upload/v1/mua/payment_proof_${booking.id.slice(0, 8)}.jpg`,
          filePublicId: `mua/payment_proof_${booking.id.slice(0, 8)}`,
          fileName:     `bukti_transfer_${slot.date}.jpg`,
          fileSize:     rand([120_000, 250_000, 380_000, 512_000]),
          mimeType:     'image/jpeg',
          notes:        'Transfer via BCA Mobile Banking',
          status:       slot.paymentStatus,
          reviewedAt:   isApproved ? (slot.approvedAt ? d(slot.approvedAt) : null) : null,
          reviewedBy:   isApproved ? admin.id : null,
        },
      });
    }

    if (slot.adminNote) {
      await prisma.adminNote.create({
        data: { bookingId: booking.id, authorId: admin.id, content: slot.adminNote },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: slot.status === BookingStatus.APPROVED ? 'BOOKING_APPROVED' : 'BOOKING_CREATED',
        entityType: 'Booking',
        entityId: booking.id,
        metadata: { status: slot.status, eventDate: slot.date, agreedPrice: slot.agreedPrice },
      },
    });

    added++;
    console.log(`   ✓  [${slot.date}] ${slot.start}–${slot.end}  ${slot.serviceSlug}  [${slot.status}]`);
  }

  // Print per-day summary
  console.log('\n📊  Full-day view:');
  const days = ['2026-06-06', '2026-06-13', '2026-06-20'];
  for (const day of days) {
    const rows = await prisma.booking.findMany({
      where: { eventDate: d(`${day}T00:00:00Z`) },
      include: { service: { select: { name: true } } },
      orderBy: { eventStartTime: 'asc' },
    });
    console.log(`\n  ${day} — ${rows.length} booking:`);
    for (const r of rows) {
      console.log(`    ${r.eventStartTime}–${r.eventEndTime}  ${r.service.name.padEnd(22)}  [${r.status}]`);
    }
  }

  console.log(`\n✅  Done! Added ${added} extra slots across 3 fully-booked Saturdays.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
