"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const [totalBookings, waitingApproval, approvedThisMonth, completedThisMonth, upcomingBookings, pendingPayment,] = await Promise.all([
            this.prisma.booking.count(),
            this.prisma.booking.count({
                where: { status: client_1.BookingStatus.WAITING_APPROVAL },
            }),
            this.prisma.booking.count({
                where: {
                    status: client_1.BookingStatus.APPROVED,
                    createdAt: { gte: startOfMonth, lte: endOfMonth },
                },
            }),
            this.prisma.booking.count({
                where: {
                    status: client_1.BookingStatus.COMPLETED,
                    createdAt: { gte: startOfMonth, lte: endOfMonth },
                },
            }),
            this.prisma.booking.findMany({
                where: {
                    status: client_1.BookingStatus.APPROVED,
                    eventDate: { gte: now },
                },
                include: {
                    customer: { select: { name: true, phone: true } },
                    service: { select: { name: true } },
                },
                orderBy: { eventDate: 'asc' },
                take: 10,
            }),
            this.prisma.booking.count({
                where: { status: client_1.BookingStatus.PENDING_PAYMENT },
            }),
        ]);
        return {
            totalBookings,
            waitingApproval,
            pendingPayment,
            approvedThisMonth,
            completedThisMonth,
            upcomingBookings,
        };
    }
    async getUnavailableDates() {
        return this.prisma.unavailableDate.findMany({
            orderBy: { date: 'asc' },
        });
    }
    async addUnavailableDate(date, reason, adminId) {
        return this.prisma.unavailableDate.create({
            data: {
                date: new Date(date),
                reason,
                createdById: adminId,
            },
        });
    }
    async removeUnavailableDate(id) {
        return this.prisma.unavailableDate.delete({ where: { id } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map