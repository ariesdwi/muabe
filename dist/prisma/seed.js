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
async function main() {
    const email = 'admin@muastudio.com';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Super admin already exists:', email);
    }
    else {
        const passwordHash = await bcrypt.hash('Admin@1234!', 12);
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email,
                passwordHash,
                role: client_1.UserRole.SUPER_ADMIN,
            },
        });
        console.log('✅ Super admin created');
        console.log('   Email   :', email);
        console.log('   Password: Admin@1234!');
    }
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
    }
    else {
        console.log(`Time slots already exist (${existingSlots} records)`);
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map