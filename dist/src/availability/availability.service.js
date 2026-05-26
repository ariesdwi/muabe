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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function toMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}
let AvailabilityService = class AvailabilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMonthAvailability(month) {
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);
        const [bookings, unavailableDates, activeSlots] = await Promise.all([
            this.prisma.booking.findMany({
                where: {
                    eventDate: { gte: startDate, lte: endDate },
                    status: {
                        in: [
                            client_1.BookingStatus.APPROVED,
                            client_1.BookingStatus.PENDING_PAYMENT,
                            client_1.BookingStatus.WAITING_APPROVAL,
                        ],
                    },
                },
                select: {
                    eventDate: true,
                    status: true,
                    eventStartTime: true,
                    eventEndTime: true,
                },
            }),
            this.prisma.unavailableDate.findMany({
                where: { date: { gte: startDate, lte: endDate } },
                select: { date: true },
            }),
            this.prisma.timeSlot.findMany({
                where: { isActive: true },
                select: { startTime: true, endTime: true },
            }),
        ]);
        const totalSlots = activeSlots.length;
        const bookingsByDate = {};
        for (const b of bookings) {
            const key = b.eventDate.toISOString().split('T')[0];
            if (!bookingsByDate[key])
                bookingsByDate[key] = [];
            bookingsByDate[key].push({
                status: b.status,
                startTime: b.eventStartTime,
                endTime: b.eventEndTime,
            });
        }
        const unavailableSet = new Set(unavailableDates.map((d) => d.date.toISOString().split('T')[0]));
        const dates = [];
        const daysInMonth = endDate.getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            let status = 'available';
            if (unavailableSet.has(dateStr)) {
                status = 'unavailable';
            }
            else if (totalSlots === 0) {
                const dayBookings = bookingsByDate[dateStr] ?? [];
                const hasApproved = dayBookings.some((b) => b.status === client_1.BookingStatus.APPROVED);
                const hasPending = dayBookings.some((b) => b.status === client_1.BookingStatus.PENDING_PAYMENT ||
                    b.status === client_1.BookingStatus.WAITING_APPROVAL);
                if (hasApproved)
                    status = 'booked';
                else if (hasPending)
                    status = 'pending';
            }
            else {
                const dayBookings = bookingsByDate[dateStr] ?? [];
                const approvedBlockedCount = activeSlots.filter((slot) => {
                    const sStart = toMinutes(slot.startTime);
                    const sEnd = toMinutes(slot.endTime);
                    return dayBookings.some((b) => {
                        if (b.status !== client_1.BookingStatus.APPROVED)
                            return false;
                        const bStart = toMinutes(b.startTime);
                        const bEnd = toMinutes(b.endTime);
                        return bStart < sEnd && bEnd > sStart;
                    });
                }).length;
                const anyBlockedCount = activeSlots.filter((slot) => {
                    const sStart = toMinutes(slot.startTime);
                    const sEnd = toMinutes(slot.endTime);
                    return dayBookings.some((b) => {
                        const bStart = toMinutes(b.startTime);
                        const bEnd = toMinutes(b.endTime);
                        return bStart < sEnd && bEnd > sStart;
                    });
                }).length;
                if (approvedBlockedCount >= totalSlots) {
                    status = 'booked';
                }
                else if (anyBlockedCount >= totalSlots) {
                    status = 'pending';
                }
                else {
                    status = 'available';
                }
            }
            dates.push({ date: dateStr, status });
        }
        return { month, dates };
    }
    async getDayAvailability(date) {
        const eventDate = new Date(date);
        const [bookings, unavailable, activeSlots] = await Promise.all([
            this.prisma.booking.findMany({
                where: {
                    eventDate,
                    status: {
                        notIn: [
                            client_1.BookingStatus.CANCELLED,
                            client_1.BookingStatus.REJECTED,
                            client_1.BookingStatus.DRAFT,
                        ],
                    },
                },
                select: {
                    id: true,
                    eventStartTime: true,
                    eventEndTime: true,
                    eventLocation: true,
                    eventAddress: true,
                    notes: true,
                    agreedPrice: true,
                    status: true,
                    customer: {
                        select: { name: true, phone: true },
                    },
                    service: {
                        select: { name: true },
                    },
                },
                orderBy: { eventStartTime: 'asc' },
            }),
            this.prisma.unavailableDate.findFirst({
                where: { date: eventDate },
            }),
            this.prisma.timeSlot.findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }],
            }),
        ]);
        const slots = activeSlots.map((slot) => {
            const slotStart = toMinutes(slot.startTime);
            const slotEnd = toMinutes(slot.endTime);
            const overlappingBooking = bookings.find((b) => {
                const bStart = toMinutes(b.eventStartTime);
                const bEnd = toMinutes(b.eventEndTime);
                return bStart < slotEnd && bEnd > slotStart;
            });
            let slotStatus = 'available';
            if (overlappingBooking) {
                slotStatus =
                    overlappingBooking.status === client_1.BookingStatus.APPROVED
                        ? 'booked'
                        : 'pending';
            }
            return {
                id: slot.id,
                label: slot.label,
                startTime: slot.startTime,
                endTime: slot.endTime,
                sortOrder: slot.sortOrder,
                status: slotStatus,
                bookingId: overlappingBooking?.id ?? null,
            };
        });
        return {
            date,
            isUnavailable: !!unavailable,
            slots,
            bookings: bookings.map((b) => ({
                id: b.id,
                startTime: b.eventStartTime,
                endTime: b.eventEndTime,
                eventLocation: b.eventLocation ?? null,
                eventAddress: b.eventAddress ?? null,
                notes: b.notes ?? null,
                agreedPrice: b.agreedPrice,
                status: b.status,
                customerName: b.customer?.name ?? null,
                customerPhone: b.customer?.phone ?? null,
                serviceName: b.service?.name ?? null,
            })),
        };
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map