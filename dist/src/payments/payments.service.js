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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
let PaymentsService = class PaymentsService {
    prisma;
    uploadsService;
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async uploadPaymentProof(bookingId, file, notes) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Allowed: jpg, jpeg, png, webp, pdf');
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException('File size must not exceed 5MB');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (![client_1.BookingStatus.DRAFT, client_1.BookingStatus.PENDING_PAYMENT].includes(booking.status)) {
            throw new common_1.BadRequestException('Cannot upload payment proof for booking in current state');
        }
        const uploadResult = await this.uploadsService.uploadFile(file.buffer, 'payment-proofs', file.originalname);
        const [proof] = await this.prisma.$transaction([
            this.prisma.paymentProof.create({
                data: {
                    bookingId,
                    fileUrl: uploadResult.url,
                    filePublicId: uploadResult.publicId,
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    notes,
                    status: client_1.PaymentStatus.WAITING_APPROVAL,
                },
            }),
            this.prisma.booking.update({
                where: { id: bookingId },
                data: { status: client_1.BookingStatus.WAITING_APPROVAL },
            }),
        ]);
        return proof;
    }
    async findAllProofs() {
        return this.prisma.paymentProof.findMany({
            include: {
                booking: {
                    select: {
                        id: true,
                        customer: { select: { name: true, phone: true } },
                        service: { select: { name: true } },
                        eventDate: true,
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async approvePaymentProof(id, adminId) {
        const proof = await this.prisma.paymentProof.findUnique({ where: { id } });
        if (!proof)
            throw new common_1.NotFoundException('Payment proof not found');
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.paymentProof.update({
                where: { id },
                data: {
                    status: client_1.PaymentStatus.APPROVED,
                    reviewedAt: new Date(),
                    reviewedBy: adminId,
                },
            });
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'PAYMENT_APPROVED',
                    entityType: 'PaymentProof',
                    entityId: id,
                },
            });
            return updated;
        });
    }
    async rejectPaymentProof(id, adminId, reason) {
        const proof = await this.prisma.paymentProof.findUnique({ where: { id } });
        if (!proof)
            throw new common_1.NotFoundException('Payment proof not found');
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.paymentProof.update({
                where: { id },
                data: {
                    status: client_1.PaymentStatus.REJECTED,
                    reviewedAt: new Date(),
                    reviewedBy: adminId,
                    notes: reason,
                },
            });
            await tx.booking.update({
                where: { id: proof.bookingId },
                data: { status: client_1.BookingStatus.PENDING_PAYMENT },
            });
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'PAYMENT_REJECTED',
                    entityType: 'PaymentProof',
                    entityId: id,
                },
            });
            return updated;
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map