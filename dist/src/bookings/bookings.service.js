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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async isSlotAvailable(eventDate, startTime, endTime, excludeBookingId) {
        const conflicting = await this.prisma.booking.findFirst({
            where: {
                eventDate,
                id: excludeBookingId ? { not: excludeBookingId } : undefined,
                status: {
                    in: [
                        client_1.BookingStatus.APPROVED,
                        client_1.BookingStatus.PENDING_PAYMENT,
                        client_1.BookingStatus.WAITING_APPROVAL,
                    ],
                },
                AND: [
                    { eventStartTime: { lt: endTime } },
                    { eventEndTime: { gt: startTime } },
                ],
            },
        });
        return !conflicting;
    }
    async createBooking(dto) {
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        const eventDate = new Date(dto.eventDate);
        const unavailable = await this.prisma.unavailableDate.findFirst({
            where: { date: eventDate },
        });
        if (unavailable)
            throw new common_1.BadRequestException('Selected date is not available');
        const available = await this.isSlotAvailable(eventDate, dto.eventStartTime, dto.eventEndTime);
        if (!available)
            throw new common_1.BadRequestException('Selected time slot is not available');
        let customer = await this.prisma.user.findFirst({
            where: { phone: dto.customerPhone },
        });
        if (!customer) {
            customer = await this.prisma.user.create({
                data: {
                    name: dto.customerName,
                    phone: dto.customerPhone,
                    email: dto.customerEmail,
                    role: client_1.UserRole.CUSTOMER,
                },
            });
        }
        const booking = await this.prisma.booking.create({
            data: {
                customerId: customer.id,
                serviceId: dto.serviceId,
                eventDate,
                eventStartTime: dto.eventStartTime,
                eventEndTime: dto.eventEndTime,
                eventLocation: dto.eventLocation,
                eventAddress: dto.eventAddress,
                notes: dto.notes,
                agreedPrice: service.basePrice,
                status: client_1.BookingStatus.DRAFT,
            },
            include: {
                service: { select: { name: true, slug: true } },
                customer: { select: { name: true, phone: true, email: true } },
            },
        });
        return booking;
    }
    async findById(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
                customer: { select: { name: true, phone: true, email: true } },
                paymentProofs: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async findAll(filters) {
        return this.prisma.booking.findMany({
            where: filters?.status ? { status: filters.status } : {},
            include: {
                service: { select: { name: true } },
                customer: { select: { name: true, phone: true, email: true } },
                paymentProofs: { select: { id: true, status: true, uploadedAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approveBooking(id, dto, adminId) {
        const booking = await this.findById(id);
        if (booking.status !== client_1.BookingStatus.WAITING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not in waiting approval state');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { status: client_1.BookingStatus.APPROVED },
            });
            if (dto.adminNote) {
                await tx.adminNote.create({
                    data: { bookingId: id, authorId: adminId, content: dto.adminNote },
                });
            }
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'BOOKING_APPROVED',
                    entityType: 'Booking',
                    entityId: id,
                },
            });
            return updated;
        });
        return result;
    }
    async rejectBooking(id, dto, adminId) {
        const booking = await this.findById(id);
        if (![
            client_1.BookingStatus.WAITING_APPROVAL,
            client_1.BookingStatus.PENDING_PAYMENT,
        ].includes(booking.status)) {
            throw new common_1.BadRequestException('Cannot reject booking in current state');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { status: client_1.BookingStatus.REJECTED },
            });
            await tx.adminNote.create({
                data: {
                    bookingId: id,
                    authorId: adminId,
                    content: `Ditolak: ${dto.reason}`,
                },
            });
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'BOOKING_REJECTED',
                    entityType: 'Booking',
                    entityId: id,
                },
            });
            return updated;
        });
    }
    async cancelBooking(id) {
        const booking = await this.findById(id);
        if ([
            client_1.BookingStatus.APPROVED,
            client_1.BookingStatus.COMPLETED,
            client_1.BookingStatus.CANCELLED,
        ].includes(booking.status)) {
            throw new common_1.BadRequestException('Cannot cancel booking in current state');
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
    }
    async completeBooking(id, adminId) {
        const booking = await this.findById(id);
        if (booking.status !== client_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Booking must be approved before completion');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { status: client_1.BookingStatus.COMPLETED },
            });
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'BOOKING_COMPLETED',
                    entityType: 'Booking',
                    entityId: id,
                },
            });
            return updated;
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map