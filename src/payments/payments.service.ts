import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  async uploadPaymentProof(
    bookingId: string,
    file: Express.Multer.File,
    notes?: string,
  ) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: jpg, jpeg, png, webp, pdf',
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (
      !(
        [BookingStatus.DRAFT, BookingStatus.PENDING_PAYMENT] as string[]
      ).includes(booking.status)
    ) {
      throw new BadRequestException(
        'Cannot upload payment proof for booking in current state',
      );
    }

    const uploadResult = await this.uploadsService.uploadFile(
      file.buffer,
      'payment-proofs',
      file.originalname,
    );

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
          status: PaymentStatus.WAITING_APPROVAL,
        },
      }),
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.WAITING_APPROVAL },
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

  async approvePaymentProof(id: string, adminId: string) {
    const proof = await this.prisma.paymentProof.findUnique({ where: { id } });
    if (!proof) throw new NotFoundException('Payment proof not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.paymentProof.update({
        where: { id },
        data: {
          status: PaymentStatus.APPROVED,
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

  async rejectPaymentProof(id: string, adminId: string, reason: string) {
    const proof = await this.prisma.paymentProof.findUnique({ where: { id } });
    if (!proof) throw new NotFoundException('Payment proof not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.paymentProof.update({
        where: { id },
        data: {
          status: PaymentStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedBy: adminId,
          notes: reason,
        },
      });

      await tx.booking.update({
        where: { id: proof.bookingId },
        data: { status: BookingStatus.PENDING_PAYMENT },
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
}
