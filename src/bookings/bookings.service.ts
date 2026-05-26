import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async isSlotAvailable(
    eventDate: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const conflicting = await this.prisma.booking.findFirst({
      where: {
        eventDate,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: [
            BookingStatus.APPROVED,
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.WAITING_APPROVAL,
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

  async createBooking(dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) throw new NotFoundException('Service not found');

    const eventDate = new Date(dto.eventDate);

    const unavailable = await this.prisma.unavailableDate.findFirst({
      where: { date: eventDate },
    });
    if (unavailable)
      throw new BadRequestException('Selected date is not available');

    const available = await this.isSlotAvailable(
      eventDate,
      dto.eventStartTime,
      dto.eventEndTime,
    );
    if (!available)
      throw new BadRequestException('Selected time slot is not available');

    let customer = await this.prisma.user.findFirst({
      where: { phone: dto.customerPhone },
    });

    if (!customer) {
      customer = await this.prisma.user.create({
        data: {
          name: dto.customerName,
          phone: dto.customerPhone,
          email: dto.customerEmail,
          role: UserRole.CUSTOMER,
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
        status: BookingStatus.DRAFT,
      },
      include: {
        service: { select: { name: true, slug: true } },
        customer: { select: { name: true, phone: true, email: true } },
      },
    });

    return booking;
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        customer: { select: { name: true, phone: true, email: true } },
        paymentProofs: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findAll(filters?: { status?: BookingStatus }) {
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

  async approveBooking(id: string, dto: ApproveBookingDto, adminId: string) {
    const booking = await this.findById(id);

    if (booking.status !== BookingStatus.WAITING_APPROVAL) {
      throw new BadRequestException('Booking is not in waiting approval state');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.APPROVED },
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

  async rejectBooking(id: string, dto: RejectBookingDto, adminId: string) {
    const booking = await this.findById(id);

    if (
      !(
        [
          BookingStatus.WAITING_APPROVAL,
          BookingStatus.PENDING_PAYMENT,
        ] as string[]
      ).includes(booking.status)
    ) {
      throw new BadRequestException('Cannot reject booking in current state');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.REJECTED },
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

  async cancelBooking(id: string) {
    const booking = await this.findById(id);

    if (
      (
        [
          BookingStatus.APPROVED,
          BookingStatus.COMPLETED,
          BookingStatus.CANCELLED,
        ] as string[]
      ).includes(booking.status)
    ) {
      throw new BadRequestException('Cannot cancel booking in current state');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  async completeBooking(id: string, adminId: string) {
    const booking = await this.findById(id);

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException(
        'Booking must be approved before completion',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.COMPLETED },
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
}
