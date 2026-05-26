"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const d = (iso) => new Date(iso);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const SERVICES = [
    {
        name: 'Bridal Makeup',
        slug: 'bridal-makeup',
        description: 'Paket makeup pengantin lengkap termasuk riasan wajah, rambut, dan sentuhan akhir',
        basePrice: 2_500_000,
        durationMinutes: 240,
        sortOrder: 1,
        status: client_1.ServiceStatus.ACTIVE,
    },
    {
        name: 'Engagement Makeup',
        slug: 'engagement-makeup',
        description: 'Riasan elegan untuk acara lamaran / tunangan',
        basePrice: 1_500_000,
        durationMinutes: 180,
        sortOrder: 2,
        status: client_1.ServiceStatus.ACTIVE,
    },
    {
        name: 'Graduation Makeup',
        slug: 'graduation-makeup',
        description: 'Riasan wisuda yang segar dan natural untuk momen berkesan',
        basePrice: 800_000,
        durationMinutes: 120,
        sortOrder: 3,
        status: client_1.ServiceStatus.ACTIVE,
    },
    {
        name: 'Party & Event Makeup',
        slug: 'party-event-makeup',
        description: 'Riasan glam untuk pesta ulang tahun, gala dinner, atau acara formal lainnya',
        basePrice: 600_000,
        durationMinutes: 90,
        sortOrder: 4,
        status: client_1.ServiceStatus.ACTIVE,
    },
    {
        name: 'Photoshoot Makeup',
        slug: 'photoshoot-makeup',
        description: 'Riasan foto-ready untuk sesi pemotretan studio maupun outdoor',
        basePrice: 1_000_000,
        durationMinutes: 120,
        sortOrder: 5,
        status: client_1.ServiceStatus.ACTIVE,
    },
    {
        name: 'Soft Glam Makeup',
        slug: 'soft-glam-makeup',
        description: 'Riasan ringan sehari-hari dengan sentuhan glamor lembut',
        basePrice: 450_000,
        durationMinutes: 75,
        sortOrder: 6,
        status: client_1.ServiceStatus.ACTIVE,
    },
];
const CUSTOMERS = [
    {
        name: 'Siti Rahayu',
        email: 'siti.rahayu@gmail.com',
        phone: '081234567801',
    },
    {
        name: 'Dewi Kusuma',
        email: 'dewi.kusuma@gmail.com',
        phone: '081234567802',
    },
    {
        name: 'Anita Wijaya',
        email: 'anita.wijaya@yahoo.com',
        phone: '081234567803',
    },
    {
        name: 'Fitri Handayani',
        email: 'fitri.handayani@gmail.com',
        phone: '081234567804',
    },
    {
        name: 'Rina Marlina',
        email: 'rina.marlina@gmail.com',
        phone: '081234567805',
    },
    {
        name: 'Yuliana Putri',
        email: 'yuliana.putri@outlook.com',
        phone: '081234567806',
    },
    {
        name: 'Melinda Sari',
        email: 'melinda.sari@gmail.com',
        phone: '081234567807',
    },
    {
        name: 'Nadia Octaviani',
        email: 'nadia.octaviani@gmail.com',
        phone: '081234567808',
    },
    {
        name: 'Lestari Wulandari',
        email: 'lestari.wulandari@gmail.com',
        phone: '081234567809',
    },
    {
        name: 'Citra Amelia',
        email: 'citra.amelia@gmail.com',
        phone: '081234567810',
    },
];
const BOOKING_TEMPLATES = [
    {
        eventDate: '2026-05-01',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Gedung Serbaguna Melati',
        eventAddress: 'Jl. Melati No. 12, Bandung',
        notes: 'Pengantin perempuan, mohon full coverage',
        customerIdx: 0,
        serviceIdx: 0,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 2_500_000,
        approvedAt: '2026-04-20T10:00:00Z',
        completedAt: '2026-05-01T10:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Klien sangat puas dengan hasil akhir riasan.',
    },
    {
        eventDate: '2026-05-02',
        eventStartTime: '08:00',
        eventEndTime: '10:00',
        eventLocation: 'Studio Foto Ceria',
        eventAddress: 'Jl. Ceria No. 5, Bandung',
        customerIdx: 4,
        serviceIdx: 4,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 1_000_000,
        approvedAt: '2026-04-25T09:00:00Z',
        completedAt: '2026-05-02T10:15:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-03',
        eventStartTime: '07:00',
        eventEndTime: '09:00',
        eventLocation: 'Kampus Universitas Padjadjaran',
        eventAddress: 'Jl. Dipatiukur No. 35, Bandung',
        notes: 'Wisuda S1 – warna toga hijau',
        customerIdx: 2,
        serviceIdx: 2,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 800_000,
        approvedAt: '2026-04-22T14:00:00Z',
        completedAt: '2026-05-03T09:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Selesai tepat waktu sebelum upacara dimulai.',
    },
    {
        eventDate: '2026-05-04',
        eventStartTime: '15:00',
        eventEndTime: '17:00',
        eventLocation: 'The Papandayan Hotel',
        eventAddress: 'Jl. Gatot Subroto No. 83, Bandung',
        customerIdx: 6,
        serviceIdx: 3,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 600_000,
        approvedAt: '2026-04-28T11:00:00Z',
        completedAt: '2026-05-04T17:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-05',
        eventStartTime: '06:30',
        eventEndTime: '10:30',
        eventLocation: 'Grha Batununggal',
        eventAddress: 'Jl. Batununggal Indah No. 1, Bandung',
        notes: 'Pengantin adat Sunda – sanggul gede',
        customerIdx: 1,
        serviceIdx: 0,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 2_700_000,
        approvedAt: '2026-04-18T08:00:00Z',
        completedAt: '2026-05-05T10:45:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Klien meminta aksesoris tambahan, biaya disesuaikan.',
    },
    {
        eventDate: '2026-05-06',
        eventStartTime: '09:00',
        eventEndTime: '11:00',
        eventLocation: 'Rumah Klien',
        eventAddress: 'Perumahan Griya Indah Blok B2, Cimahi',
        customerIdx: 3,
        serviceIdx: 5,
        status: client_1.BookingStatus.CANCELLED,
        agreedPrice: 450_000,
        cancelledReason: 'Klien membatalkan karena ada keperluan mendadak keluarga.',
        cancelledAt: '2026-05-04T18:00:00Z',
    },
    {
        eventDate: '2026-05-07',
        eventStartTime: '07:00',
        eventEndTime: '09:00',
        eventLocation: 'Kampus UIN Sunan Gunung Djati',
        eventAddress: 'Jl. A.H. Nasution No. 105, Bandung',
        customerIdx: 8,
        serviceIdx: 2,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 800_000,
        approvedAt: '2026-04-30T10:00:00Z',
        completedAt: '2026-05-07T09:45:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-08',
        eventStartTime: '10:00',
        eventEndTime: '12:00',
        eventLocation: 'Studio Kilau Photography',
        eventAddress: 'Jl. Kebon Kawung No. 8, Bandung',
        customerIdx: 9,
        serviceIdx: 4,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 1_000_000,
        approvedAt: '2026-04-27T12:00:00Z',
        completedAt: '2026-05-08T12:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-09',
        eventStartTime: '16:00',
        eventEndTime: '18:00',
        eventLocation: 'Restoran Padma',
        eventAddress: 'Jl. Cihampelas No. 62, Bandung',
        customerIdx: 5,
        serviceIdx: 3,
        status: client_1.BookingStatus.REJECTED,
        agreedPrice: 600_000,
        rejectionReason: 'Slot waktu sudah penuh pada tanggal tersebut.',
        rejectedAt: '2026-04-29T09:00:00Z',
    },
    {
        eventDate: '2026-05-10',
        eventStartTime: '05:30',
        eventEndTime: '09:30',
        eventLocation: 'Sasana Budaya Ganesha (Sabuga)',
        eventAddress: 'Jl. Tamansari No. 73, Bandung',
        notes: 'Pengantin dengan tema modern minimalis',
        customerIdx: 7,
        serviceIdx: 0,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 2_500_000,
        approvedAt: '2026-04-20T09:00:00Z',
        completedAt: '2026-05-10T09:45:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Riasan selesai 15 menit lebih awal dari jadwal.',
    },
    {
        eventDate: '2026-05-12',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Hotel Sariater',
        eventAddress: 'Jl. Raya Subang KM 15, Subang',
        notes: 'Pengantin adat Jawa – paes ageng',
        customerIdx: 0,
        serviceIdx: 1,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 1_700_000,
        approvedAt: '2026-05-01T10:00:00Z',
        completedAt: '2026-05-12T10:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-13',
        eventStartTime: '08:00',
        eventEndTime: '10:00',
        eventLocation: 'Kampus UNPAD Jatinangor',
        eventAddress: 'Jl. Raya Bandung-Sumedang KM 21, Jatinangor',
        customerIdx: 2,
        serviceIdx: 2,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 800_000,
        approvedAt: '2026-05-03T14:00:00Z',
        completedAt: '2026-05-13T10:15:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-14',
        eventStartTime: '14:00',
        eventEndTime: '16:00',
        eventLocation: 'Ballroom The Trans Luxury Hotel',
        eventAddress: 'Jl. Gatot Subroto No. 83, Bandung',
        customerIdx: 4,
        serviceIdx: 3,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 650_000,
        approvedAt: '2026-05-05T09:00:00Z',
        completedAt: '2026-05-14T16:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Event gala dinner perusahaan, klien senang dengan hasilnya.',
    },
    {
        eventDate: '2026-05-15',
        eventStartTime: '07:30',
        eventEndTime: '09:30',
        eventLocation: 'Rumah Klien',
        eventAddress: 'Jl. Surya Sumantri No. 45, Bandung',
        customerIdx: 6,
        serviceIdx: 5,
        status: client_1.BookingStatus.CANCELLED,
        agreedPrice: 450_000,
        cancelledReason: 'Klien membatalkan H-1, tidak ada konfirmasi ulang.',
        cancelledAt: '2026-05-14T20:00:00Z',
    },
    {
        eventDate: '2026-05-16',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Gedung Sate',
        eventAddress: 'Jl. Diponegoro No. 22, Bandung',
        notes: 'Pernikahan resepsi sore hari, makeup harus tahan lama',
        customerIdx: 1,
        serviceIdx: 0,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 2_500_000,
        approvedAt: '2026-05-02T11:00:00Z',
        completedAt: '2026-05-16T10:45:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-17',
        eventStartTime: '09:00',
        eventEndTime: '11:00',
        eventLocation: 'Studio Foto Bening',
        eventAddress: 'Jl. Dago No. 120, Bandung',
        customerIdx: 9,
        serviceIdx: 4,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 1_000_000,
        approvedAt: '2026-05-08T10:00:00Z',
        completedAt: '2026-05-17T11:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-18',
        eventStartTime: '06:30',
        eventEndTime: '10:30',
        eventLocation: 'Pendopo Bandung',
        eventAddress: 'Jl. Dalem Kaum No. 56, Bandung',
        notes: 'Lamaran – tema gold dan putih',
        customerIdx: 3,
        serviceIdx: 1,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 1_500_000,
        approvedAt: '2026-05-07T08:00:00Z',
        completedAt: '2026-05-18T11:00:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Respon klien sangat positif, sudah minta untuk memesan lagi di pernikahan.',
    },
    {
        eventDate: '2026-05-19',
        eventStartTime: '15:00',
        eventEndTime: '17:00',
        eventLocation: 'Aula SMA Negeri 3 Bandung',
        eventAddress: 'Jl. Belitung No. 8, Bandung',
        customerIdx: 5,
        serviceIdx: 3,
        status: client_1.BookingStatus.REJECTED,
        agreedPrice: 600_000,
        rejectionReason: 'Konflik jadwal dengan booking lain di jam yang sama.',
        rejectedAt: '2026-05-10T14:00:00Z',
    },
    {
        eventDate: '2026-05-20',
        eventStartTime: '07:00',
        eventEndTime: '09:00',
        eventLocation: 'Kampus Telkom University',
        eventAddress: 'Jl. Telekomunikasi No. 1, Bandung',
        customerIdx: 8,
        serviceIdx: 2,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 800_000,
        approvedAt: '2026-05-12T09:00:00Z',
        completedAt: '2026-05-20T09:30:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-21',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Vasa Hotel Surabaya',
        eventAddress: 'Jl. Mayjen Yono Soewoyo No. 1, Surabaya',
        notes: 'Destinasi wedding, client dari Bandung',
        customerIdx: 7,
        serviceIdx: 0,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 3_000_000,
        approvedAt: '2026-05-01T08:00:00Z',
        completedAt: '2026-05-21T10:45:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Biaya perjalanan sudah termasuk dalam harga yang disepakati.',
    },
    {
        eventDate: '2026-05-22',
        eventStartTime: '09:00',
        eventEndTime: '11:00',
        eventLocation: 'Rumah Klien',
        eventAddress: 'Jl. Riau No. 30, Bandung',
        customerIdx: 0,
        serviceIdx: 5,
        status: client_1.BookingStatus.COMPLETED,
        agreedPrice: 450_000,
        approvedAt: '2026-05-15T10:00:00Z',
        completedAt: '2026-05-22T11:15:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-23',
        eventStartTime: '14:00',
        eventEndTime: '16:00',
        eventLocation: 'The Luxton Hotel',
        eventAddress: 'Jl. Ir. H. Juanda No. 18, Bandung',
        customerIdx: 2,
        serviceIdx: 3,
        status: client_1.BookingStatus.APPROVED,
        agreedPrice: 600_000,
        approvedAt: '2026-05-16T11:00:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-24',
        eventStartTime: '07:00',
        eventEndTime: '09:00',
        eventLocation: 'Kampus UPI Bandung',
        eventAddress: 'Jl. Dr. Setiabudhi No. 229, Bandung',
        customerIdx: 6,
        serviceIdx: 2,
        status: client_1.BookingStatus.APPROVED,
        agreedPrice: 800_000,
        approvedAt: '2026-05-17T09:00:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-25',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Hotel Grand Tjokro',
        eventAddress: 'Jl. Cihampelas No. 211, Bandung',
        notes: 'Akad + resepsi hari yang sama',
        customerIdx: 4,
        serviceIdx: 0,
        status: client_1.BookingStatus.APPROVED,
        agreedPrice: 2_800_000,
        approvedAt: '2026-05-10T10:00:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
        adminNote: 'Sudah dikonfirmasi ulang H-3, siap berangkat.',
    },
    {
        eventDate: '2026-05-26',
        eventStartTime: '07:00',
        eventEndTime: '09:00',
        eventLocation: 'Studio Foto Lumina',
        eventAddress: 'Jl. Braga No. 18, Bandung',
        customerIdx: 9,
        serviceIdx: 4,
        status: client_1.BookingStatus.APPROVED,
        agreedPrice: 1_000_000,
        approvedAt: '2026-05-20T12:00:00Z',
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.APPROVED,
    },
    {
        eventDate: '2026-05-27',
        eventStartTime: '15:00',
        eventEndTime: '17:00',
        eventLocation: 'Kafe Aromatik',
        eventAddress: 'Jl. Trunojoyo No. 77, Bandung',
        customerIdx: 3,
        serviceIdx: 5,
        status: client_1.BookingStatus.WAITING_APPROVAL,
        agreedPrice: 450_000,
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.WAITING_APPROVAL,
    },
    {
        eventDate: '2026-05-28',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Griya Sari Convention Hall',
        eventAddress: 'Jl. Soekarno Hatta No. 628, Bandung',
        notes: 'Pengantin perempuan hadir dengan 2 bridesmaid, minta info paket group',
        customerIdx: 5,
        serviceIdx: 0,
        status: client_1.BookingStatus.WAITING_APPROVAL,
        agreedPrice: 2_500_000,
        hasPaymentProof: true,
        paymentStatus: client_1.PaymentStatus.WAITING_APPROVAL,
    },
    {
        eventDate: '2026-05-29',
        eventStartTime: '09:00',
        eventEndTime: '11:00',
        eventLocation: 'Rumah Klien',
        eventAddress: 'Komplek Perumahan Bumi Asri Blok D5, Cimahi',
        customerIdx: 8,
        serviceIdx: 5,
        status: client_1.BookingStatus.PENDING_PAYMENT,
        agreedPrice: 450_000,
    },
    {
        eventDate: '2026-05-30',
        eventStartTime: '14:00',
        eventEndTime: '16:30',
        eventLocation: 'The Prama Bandung',
        eventAddress: 'Jl. Lembang No. 28, Bandung',
        customerIdx: 1,
        serviceIdx: 1,
        status: client_1.BookingStatus.PENDING_PAYMENT,
        agreedPrice: 1_500_000,
        notes: 'Permintaan shimmer effect di area mata',
    },
    {
        eventDate: '2026-05-31',
        eventStartTime: '06:00',
        eventEndTime: '10:00',
        eventLocation: 'Rumah Klien',
        eventAddress: 'Jl. Setrasari Mall No. 5, Bandung',
        notes: 'Pengantin, minta trial sebelumnya',
        customerIdx: 7,
        serviceIdx: 0,
        status: client_1.BookingStatus.DRAFT,
        agreedPrice: 2_500_000,
    },
];
const UNAVAILABLE_DATES = [
    { date: '2026-05-11', reason: 'Libur Nasional Hari Waisak' },
    { date: '2026-05-30', reason: 'Stok alat kosmetik sedang di-restock' },
];
async function main() {
    console.log('🌱  Starting dummy data seed for May 2026...\n');
    console.log('📦  Seeding services...');
    const serviceIds = [];
    for (const svc of SERVICES) {
        const created = await prisma.service.upsert({
            where: { slug: svc.slug },
            update: svc,
            create: svc,
        });
        serviceIds.push(created.id);
        console.log(`   ✓  ${created.name}`);
    }
    const adminEmail = 'admin@muastudio.com';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
        const passwordHash = await bcrypt.hash('Admin@1234!', 12);
        admin = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: adminEmail,
                passwordHash,
                role: client_1.UserRole.SUPER_ADMIN,
            },
        });
        console.log('\n👤  Super admin created');
    }
    else {
        console.log('\n👤  Super admin already exists, skipping');
    }
    console.log('\n👥  Seeding customers...');
    const customerIds = [];
    const passwordHash = await bcrypt.hash('Customer@1234!', 10);
    for (const cust of CUSTOMERS) {
        const existing = await prisma.user.findUnique({
            where: { email: cust.email },
        });
        let user = existing;
        if (!user) {
            user = await prisma.user.create({
                data: { ...cust, passwordHash, role: client_1.UserRole.CUSTOMER },
            });
        }
        customerIds.push(user.id);
        console.log(`   ✓  ${user.name}`);
    }
    console.log('\n📅  Seeding bookings...');
    let bookingCount = 0;
    for (const tmpl of BOOKING_TEMPLATES) {
        const customerId = customerIds[tmpl.customerIdx];
        const serviceId = serviceIds[tmpl.serviceIdx];
        const bookingData = {
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
        if (tmpl.hasPaymentProof && tmpl.paymentStatus) {
            const isApproved = tmpl.paymentStatus === client_1.PaymentStatus.APPROVED;
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
        if (tmpl.adminNote) {
            await prisma.adminNote.create({
                data: {
                    bookingId: booking.id,
                    authorId: admin.id,
                    content: tmpl.adminNote,
                },
            });
        }
        const actionMap = {
            [client_1.BookingStatus.COMPLETED]: 'BOOKING_COMPLETED',
            [client_1.BookingStatus.APPROVED]: 'BOOKING_APPROVED',
            [client_1.BookingStatus.REJECTED]: 'BOOKING_REJECTED',
            [client_1.BookingStatus.CANCELLED]: 'BOOKING_CANCELLED',
            [client_1.BookingStatus.WAITING_APPROVAL]: 'BOOKING_PAYMENT_UPLOADED',
            [client_1.BookingStatus.PENDING_PAYMENT]: 'BOOKING_CREATED',
            [client_1.BookingStatus.DRAFT]: 'BOOKING_CREATED',
        };
        const action = actionMap[tmpl.status] ?? 'BOOKING_CREATED';
        await prisma.auditLog.create({
            data: {
                userId: admin.id,
                action,
                entityType: 'Booking',
                entityId: booking.id,
                metadata: {
                    status: tmpl.status,
                    eventDate: tmpl.eventDate,
                    agreedPrice: tmpl.agreedPrice,
                },
            },
        });
        console.log(`   ✓  [${tmpl.eventDate}] ${SERVICES[tmpl.serviceIdx].name} – ${tmpl.status}`);
    }
    console.log('\n🚫  Seeding unavailable dates...');
    for (const ud of UNAVAILABLE_DATES) {
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
    const stats = await prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
    });
    console.log('\n📊  Booking summary:');
    for (const s of stats) {
        console.log(`   ${s.status.padEnd(20)} ${s._count.id}`);
    }
    console.log(`\n✅  Done! Seeded ${bookingCount} bookings for May 2026.`);
    console.log('   Admin credentials → email: admin@muastudio.com | password: Admin@1234!');
    console.log('   Customer password  → Customer@1234!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-dummy.js.map