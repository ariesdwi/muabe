import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [
      totalBookings,
      waitingApproval,
      approvedThisMonth,
      completedThisMonth,
      upcomingBookings,
      pendingPayment,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: { status: BookingStatus.WAITING_APPROVAL },
      }),
      this.prisma.booking.count({
        where: {
          status: BookingStatus.APPROVED,
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      this.prisma.booking.count({
        where: {
          status: BookingStatus.COMPLETED,
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          status: BookingStatus.APPROVED,
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
        where: { status: BookingStatus.PENDING_PAYMENT },
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

  async addUnavailableDate(date: string, reason?: string, adminId?: string) {
    return this.prisma.unavailableDate.create({
      data: {
        date: new Date(date),
        reason,
        createdById: adminId,
      },
    });
  }

  async removeUnavailableDate(id: string) {
    return this.prisma.unavailableDate.delete({ where: { id } });
  }
}
