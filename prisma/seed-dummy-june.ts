import 'dotenv/config';
import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

const d = (iso: string) => new Date(iso);
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ─── booking templates for June 2026 ────────────────────────────────────────
interface BookingTemplate {
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAddress: string;
  notes?: string;
  customerEmail: string;
  serviceSlug: string;
  status: BookingStatus;
  agreedPrice: number;
  rejectionReason?: string;
  cancelledReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  hasPaymentProof?: boolean;
  paymentStatus?: PaymentStatus;
  adminNote?: string;
}

const BOOKING_TEMPLATES: BookingTemplate[] = [
  // ── June 1 ──
  {
    eventDate: '2026-06-01',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'The Stones Hotel Bali',
    eventAddress: 'Jl. Benesari, Kuta, Bali',
    notes: 'Destination wedding dari Bandung ke Bali',
    customerEmail: 'siti.rahayu@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.APPROVED,
    agreedPrice: 3_200_000,
    approvedAt: '2026-05-20T08:00:00Z',
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.APPROVED,
    adminNote:
      'Tiket dan akomodasi sudah dipesan. Konfirmasi keberangkatan H-5.',
  },
  // ── June 2 ──
  {
    eventDate: '2026-06-02',
    eventStartTime: '07:00',
    eventEndTime: '09:00',
    eventLocation: 'Kampus ITB Bandung',
    eventAddress: 'Jl. Ganesha No. 10, Bandung',
    notes: 'Wisuda S1 jurusan Teknik, toga hitam',
    customerEmail: 'anita.wijaya@yahoo.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.APPROVED,
    agreedPrice: 800_000,
    approvedAt: '2026-05-22T09:00:00Z',
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.APPROVED,
  },
  // ── June 3 ──
  {
    eventDate: '2026-06-03',
    eventStartTime: '15:00',
    eventEndTime: '17:00',
    eventLocation: 'Pullman Bandung Grand Central',
    eventAddress: 'Jl. Diponegoro No. 27, Bandung',
    customerEmail: 'rina.marlina@gmail.com',
    serviceSlug: 'party-event-makeup',
    status: BookingStatus.APPROVED,
    agreedPrice: 600_000,
    approvedAt: '2026-05-24T11:00:00Z',
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.APPROVED,
  },
  // ── June 4 ──
  {
    eventDate: '2026-06-04',
    eventStartTime: '08:00',
    eventEndTime: '10:00',
    eventLocation: 'Studio Foto Prism',
    eventAddress: 'Jl. Merdeka No. 40, Bandung',
    customerEmail: 'citra.amelia@gmail.com',
    serviceSlug: 'photoshoot-makeup',
    status: BookingStatus.APPROVED,
    agreedPrice: 1_000_000,
    approvedAt: '2026-05-25T10:00:00Z',
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.APPROVED,
  },
  // ── June 5 ──
  {
    eventDate: '2026-06-05',
    eventStartTime: '06:30',
    eventEndTime: '10:30',
    eventLocation: 'Aryaduta Hotel Bandung',
    eventAddress: 'Jl. Sumatera No. 51, Bandung',
    notes: 'Pengantin adat Sunda – tema hijau tosca',
    customerEmail: 'dewi.kusuma@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.APPROVED,
    agreedPrice: 2_500_000,
    approvedAt: '2026-05-18T09:00:00Z',
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.APPROVED,
    adminNote:
      'Trial makeup sudah dilakukan tgl 28 Mei, klien setuju dengan hasil.',
  },
  // ── June 6 ──
  {
    eventDate: '2026-06-06',
    eventStartTime: '09:00',
    eventEndTime: '11:00',
    eventLocation: 'Rumah Klien',
    eventAddress: 'Jl. Pasir Kaliki No. 55, Bandung',
    customerEmail: 'melinda.sari@gmail.com',
    serviceSlug: 'soft-glam-makeup',
    status: BookingStatus.WAITING_APPROVAL,
    agreedPrice: 450_000,
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.WAITING_APPROVAL,
  },
  // ── June 7 ──
  {
    eventDate: '2026-06-07',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Aston Primera Pasteur',
    eventAddress: 'Jl. Dr. Djundjunan No. 96, Bandung',
    notes: 'Pengantin + 2 bridesmaid, paket satuan dulu',
    customerEmail: 'yuliana.putri@outlook.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.WAITING_APPROVAL,
    agreedPrice: 2_500_000,
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.WAITING_APPROVAL,
  },
  // ── June 8 ──
  {
    eventDate: '2026-06-08',
    eventStartTime: '14:00',
    eventEndTime: '16:00',
    eventLocation: 'Jl. RE Martadinata No. 10, Bandung',
    eventAddress: 'Jl. RE Martadinata No. 10, Bandung',
    customerEmail: 'fitri.handayani@gmail.com',
    serviceSlug: 'party-event-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 600_000,
    notes: 'Event launching produk fashion brand lokal',
  },
  // ── June 9 ──
  {
    eventDate: '2026-06-09',
    eventStartTime: '07:00',
    eventEndTime: '09:00',
    eventLocation: 'Kampus UNISBA Bandung',
    eventAddress: 'Jl. Tamansari No. 1, Bandung',
    customerEmail: 'lestari.wulandari@gmail.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 800_000,
  },
  // ── June 10 ──
  {
    eventDate: '2026-06-10',
    eventStartTime: '09:00',
    eventEndTime: '11:00',
    eventLocation: 'Studio Foto Aurora',
    eventAddress: 'Jl. Buah Batu No. 80, Bandung',
    customerEmail: 'citra.amelia@gmail.com',
    serviceSlug: 'photoshoot-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 1_000_000,
    notes: 'Pemotretan untuk portofolio bisnis',
  },
  // ── June 11 ──
  {
    eventDate: '2026-06-11',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Pesona Square Depok',
    eventAddress: 'Jl. Margonda Raya No. 399, Depok',
    notes: 'Pengantin, client dari Bandung pindah acara ke Depok',
    customerEmail: 'nadia.octaviani@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 2_700_000,
  },
  // ── June 12 ──
  {
    eventDate: '2026-06-12',
    eventStartTime: '15:00',
    eventEndTime: '17:00',
    eventLocation: 'Hotel Horison Ultima Bandung',
    eventAddress: 'Jl. Pelajar Pejuang 45 No. 41, Bandung',
    customerEmail: 'rina.marlina@gmail.com',
    serviceSlug: 'party-event-makeup',
    status: BookingStatus.REJECTED,
    agreedPrice: 600_000,
    rejectionReason:
      'Tanggal sudah fully booked untuk bridal di pagi hari, tidak bisa double shift.',
    rejectedAt: '2026-06-01T10:00:00Z',
  },
  // ── June 13 ──
  {
    eventDate: '2026-06-13',
    eventStartTime: '07:00',
    eventEndTime: '09:00',
    eventLocation: 'Kampus UIN Bandung',
    eventAddress: 'Jl. A.H. Nasution No. 105, Bandung',
    customerEmail: 'siti.rahayu@gmail.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 800_000,
  },
  // ── June 14 ──
  {
    eventDate: '2026-06-14',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Grha Batununggal',
    eventAddress: 'Jl. Batununggal Indah No. 1, Bandung',
    notes: 'Pengantin tema gold-maroon, riasan tahan 12 jam',
    customerEmail: 'anita.wijaya@yahoo.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.WAITING_APPROVAL,
    agreedPrice: 2_500_000,
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.WAITING_APPROVAL,
  },
  // ── June 15 ──
  {
    eventDate: '2026-06-15',
    eventStartTime: '09:00',
    eventEndTime: '11:00',
    eventLocation: 'Rumah Klien',
    eventAddress: 'Komp. Antapani Indah Blok C3, Bandung',
    customerEmail: 'melinda.sari@gmail.com',
    serviceSlug: 'photoshoot-makeup',
    status: BookingStatus.WAITING_APPROVAL,
    agreedPrice: 1_000_000,
    hasPaymentProof: true,
    paymentStatus: PaymentStatus.WAITING_APPROVAL,
  },
  // ── June 16 ──
  {
    eventDate: '2026-06-16',
    eventStartTime: '14:00',
    eventEndTime: '16:30',
    eventLocation: 'Grand Ballroom Hotel Santika',
    eventAddress: 'Jl. Sumatera No. 52, Bandung',
    customerEmail: 'yuliana.putri@outlook.com',
    serviceSlug: 'engagement-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 1_500_000,
    notes: 'Lamaran tema dusty pink',
  },
  // ── June 17 ──
  {
    eventDate: '2026-06-17',
    eventStartTime: '07:30',
    eventEndTime: '09:30',
    eventLocation: 'Rumah Klien',
    eventAddress: 'Jl. Surya Sumantri No. 12, Bandung',
    customerEmail: 'fitri.handayani@gmail.com',
    serviceSlug: 'soft-glam-makeup',
    status: BookingStatus.CANCELLED,
    agreedPrice: 450_000,
    cancelledReason: 'Klien mengundurkan diri karena sakit.',
    cancelledAt: '2026-06-15T18:00:00Z',
  },
  // ── June 18 ──
  {
    eventDate: '2026-06-18',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Villa Istana Bunga',
    eventAddress: 'Jl. Sersan Bajuri, Lembang, Bandung Barat',
    notes: 'Pernikahan outdoor di taman',
    customerEmail: 'lestari.wulandari@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 2_800_000,
  },
  // ── June 19 ──
  {
    eventDate: '2026-06-19',
    eventStartTime: '08:00',
    eventEndTime: '10:00',
    eventLocation: 'Studio Foto Kilau',
    eventAddress: 'Jl. Kebon Kawung No. 8, Bandung',
    customerEmail: 'dewi.kusuma@gmail.com',
    serviceSlug: 'photoshoot-makeup',
    status: BookingStatus.PENDING_PAYMENT,
    agreedPrice: 1_000_000,
  },
  // ── June 20 ──
  {
    eventDate: '2026-06-20',
    eventStartTime: '07:00',
    eventEndTime: '09:00',
    eventLocation: 'Kampus STIKES Bandung',
    eventAddress: 'Jl. Sarimanah Blok 23, Bandung',
    customerEmail: 'nadia.octaviani@gmail.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 800_000,
  },
  // ── June 21 ──
  {
    eventDate: '2026-06-21',
    eventStartTime: '15:00',
    eventEndTime: '17:00',
    eventLocation: 'Restoran Puti Bungsu',
    eventAddress: 'Jl. Lombok No. 11, Bandung',
    customerEmail: 'rina.marlina@gmail.com',
    serviceSlug: 'party-event-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 600_000,
    notes: 'Ulang tahun ke-30, tema vintage',
  },
  // ── June 22 ──
  {
    eventDate: '2026-06-22',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Four Points by Sheraton',
    eventAddress: 'Jl. Ir. H. Juanda No. 46, Bandung',
    notes: 'Pengantin dengan 3 bridesmaid, hanya booking MUA untuk pengantin',
    customerEmail: 'siti.rahayu@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 2_500_000,
  },
  // ── June 23 ──
  {
    eventDate: '2026-06-23',
    eventStartTime: '09:00',
    eventEndTime: '11:00',
    eventLocation: 'Rumah Klien',
    eventAddress: 'Jl. Cipaganti No. 99, Bandung',
    customerEmail: 'citra.amelia@gmail.com',
    serviceSlug: 'soft-glam-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 450_000,
  },
  // ── June 24 ──
  {
    eventDate: '2026-06-24',
    eventStartTime: '07:30',
    eventEndTime: '09:30',
    eventLocation: 'Kampus Polban',
    eventAddress: 'Jl. Gegerkalong Hilir, Bandung',
    customerEmail: 'melinda.sari@gmail.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 800_000,
  },
  // ── June 25 ──
  {
    eventDate: '2026-06-25',
    eventStartTime: '14:00',
    eventEndTime: '16:30',
    eventLocation: 'Amaroossa Grande Hotel',
    eventAddress: 'Jl. Otto Iskandar Dinata No. 71, Bekasi',
    notes: 'Lamaran, klien pindah ke Bekasi',
    customerEmail: 'anita.wijaya@yahoo.com',
    serviceSlug: 'engagement-makeup',
    status: BookingStatus.CANCELLED,
    agreedPrice: 1_500_000,
    cancelledReason: 'Klien cancel H-10, acara ditunda ke bulan depan.',
    cancelledAt: '2026-06-15T10:00:00Z',
  },
  // ── June 26 ──
  {
    eventDate: '2026-06-26',
    eventStartTime: '06:30',
    eventEndTime: '10:30',
    eventLocation: 'Hotel Grand Mercure',
    eventAddress: 'Jl. Setiabudhi No. 269, Bandung',
    notes: 'Pengantin, venue outdoor + indoor',
    customerEmail: 'fitri.handayani@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 2_700_000,
  },
  // ── June 27 ──
  {
    eventDate: '2026-06-27',
    eventStartTime: '09:00',
    eventEndTime: '11:00',
    eventLocation: 'Studio Foto Visio',
    eventAddress: 'Jl. Riau No. 22, Bandung',
    customerEmail: 'yuliana.putri@outlook.com',
    serviceSlug: 'photoshoot-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 1_000_000,
  },
  // ── June 28 ──
  {
    eventDate: '2026-06-28',
    eventStartTime: '07:00',
    eventEndTime: '09:00',
    eventLocation: 'Kampus UNPAD Dipatiukur',
    eventAddress: 'Jl. Dipatiukur No. 35, Bandung',
    customerEmail: 'lestari.wulandari@gmail.com',
    serviceSlug: 'graduation-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 800_000,
  },
  // ── June 29 ──
  {
    eventDate: '2026-06-29',
    eventStartTime: '16:00',
    eventEndTime: '18:00',
    eventLocation: 'Ballroom Hotel Horison',
    eventAddress: 'Jl. Pelajar Pejuang No. 41, Bandung',
    customerEmail: 'nadia.octaviani@gmail.com',
    serviceSlug: 'party-event-makeup',
    status: BookingStatus.REJECTED,
    agreedPrice: 600_000,
    rejectionReason: 'Tanggal sudah terisi booking bridal pagi + sore hari.',
    rejectedAt: '2026-06-10T14:00:00Z',
  },
  // ── June 30 ──
  {
    eventDate: '2026-06-30',
    eventStartTime: '06:00',
    eventEndTime: '10:00',
    eventLocation: 'Gedung Merdeka Bandung',
    eventAddress: 'Jl. Asia Afrika No. 65, Bandung',
    notes: 'Pengantin penutup bulan Juni – tema sage green',
    customerEmail: 'dewi.kusuma@gmail.com',
    serviceSlug: 'bridal-makeup',
    status: BookingStatus.DRAFT,
    agreedPrice: 2_500_000,
  },
];

const UNAVAILABLE_DATES_JUNE = [
  { date: '2026-06-01', reason: 'Hari Lahir Pancasila – Libur Nasional' },
  { date: '2026-06-20', reason: 'Service rutin peralatan makeup' },
];

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Starting dummy data seed for June 2026...\n');

  // Load admin
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@muastudio.com' },
  });
  if (!admin)
    throw new Error('Super admin not found – run seed-dummy.ts first');

  // Load service map
  const services = await prisma.service.findMany();
  const serviceMap = new Map(services.map((s) => [s.slug, s.id]));

  // Load customer map
  const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const customerMap = new Map(customers.map((c) => [c.email!, c.id]));

  console.log(
    `   Found ${services.length} services, ${customers.length} customers\n`,
  );

  // Seed bookings
  console.log('📅  Seeding June bookings...');
  let bookingCount = 0;

  for (const tmpl of BOOKING_TEMPLATES) {
    const customerId = customerMap.get(tmpl.customerEmail);
    const serviceId = serviceMap.get(tmpl.serviceSlug);

    if (!customerId)
      throw new Error(`Customer not found: ${tmpl.customerEmail}`);
    if (!serviceId) throw new Error(`Service not found: ${tmpl.serviceSlug}`);

    const bookingData: any = {
      customerId,
      serviceId,
      eventDate: d(`${tmpl.eventDate}T00:00:00Z`),
      eventStartTime: tmpl.eventStartTime,
      eventEndTime: tmpl.eventEndTime,
      eventLocation: tmpl.eventLocation,
      eventAddress: tmpl.eventAddress,
      notes: tmpl.notes ?? null,
      agreedPrice: tmpl.agreedPrice,
      status: tmpl.status,
      rejectionReason: tmpl.rejectionReason ?? null,
      cancelledReason: tmpl.cancelledReason ?? null,
      approvedAt: tmpl.approvedAt ? d(tmpl.approvedAt) : null,
      rejectedAt: tmpl.rejectedAt ? d(tmpl.rejectedAt) : null,
      cancelledAt: tmpl.cancelledAt ? d(tmpl.cancelledAt) : null,
      completedAt: tmpl.completedAt ? d(tmpl.completedAt) : null,
    };

    const booking = await prisma.booking.create({ data: bookingData });
    bookingCount++;

    // Payment proof
    if (tmpl.hasPaymentProof && tmpl.paymentStatus) {
      const isApproved = tmpl.paymentStatus === PaymentStatus.APPROVED;
      await prisma.paymentProof.create({
        data: {
          bookingId: booking.id,
          fileUrl: `https://res.cloudinary.com/demo/image/upload/v1/mua/payment_proof_${booking.id.slice(0, 8)}.jpg`,
          filePublicId: `mua/payment_proof_${booking.id.slice(0, 8)}`,
          fileName: `bukti_transfer_${tmpl.eventDate}.jpg`,
          fileSize: rand([120_000, 250_000, 380_000, 512_000]),
          mimeType: 'image/jpeg',
          notes: 'Transfer via BCA Mobile Banking',
          status: tmpl.paymentStatus,
          reviewedAt: isApproved
            ? tmpl.approvedAt
              ? d(tmpl.approvedAt)
              : null
            : null,
          reviewedBy: isApproved ? admin.id : null,
        },
      });
    }

    // Admin note
    if (tmpl.adminNote) {
      await prisma.adminNote.create({
        data: {
          bookingId: booking.id,
          authorId: admin.id,
          content: tmpl.adminNote,
        },
      });
    }

    // Audit log
    const actionMap: Partial<Record<BookingStatus, string>> = {
      [BookingStatus.COMPLETED]: 'BOOKING_COMPLETED',
      [BookingStatus.APPROVED]: 'BOOKING_APPROVED',
      [BookingStatus.REJECTED]: 'BOOKING_REJECTED',
      [BookingStatus.CANCELLED]: 'BOOKING_CANCELLED',
      [BookingStatus.WAITING_APPROVAL]: 'BOOKING_PAYMENT_UPLOADED',
      [BookingStatus.PENDING_PAYMENT]: 'BOOKING_CREATED',
      [BookingStatus.DRAFT]: 'BOOKING_CREATED',
    };
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: actionMap[tmpl.status] ?? 'BOOKING_CREATED',
        entityType: 'Booking',
        entityId: booking.id,
        metadata: {
          status: tmpl.status,
          eventDate: tmpl.eventDate,
          agreedPrice: tmpl.agreedPrice,
        },
      },
    });

    console.log(
      `   ✓  [${tmpl.eventDate}] ${tmpl.serviceSlug} – ${tmpl.status}`,
    );
  }

  // Unavailable dates
  console.log('\n🚫  Seeding unavailable dates...');
  for (const ud of UNAVAILABLE_DATES_JUNE) {
    await prisma.unavailableDate.create({
      data: {
        date: d(`${ud.date}T00:00:00Z`),
        reason: ud.reason,
        isFullDay: true,
        createdById: admin.id,
      },
    });
    console.log(`   ✓  ${ud.date} – ${ud.reason}`);
  }

  // Summary
  const juneStart = d('2026-06-01T00:00:00Z');
  const juneEnd = d('2026-07-01T00:00:00Z');
  const stats = await prisma.booking.groupBy({
    by: ['status'],
    where: { eventDate: { gte: juneStart, lt: juneEnd } },
    _count: { id: true },
  });
  console.log('\n📊  June booking summary:');
  for (const s of stats) {
    console.log(`   ${s.status.padEnd(20)} ${s._count.id}`);
  }

  console.log(`\n✅  Done! Seeded ${bookingCount} bookings for June 2026.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
