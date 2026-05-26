import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DateStatus = 'available' | 'booked' | 'pending' | 'unavailable';
type SlotStatus = 'available' | 'pending' | 'booked';

/** Convert "HH:MM" to total minutes for overlap comparison */
function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthAvailability(month: string): Promise<{
    month: string;
    dates: Array<{ date: string; status: DateStatus }>;
  }> {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const [bookings, unavailableDates, activeSlots] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          eventDate: { gte: startDate, lte: endDate },
          status: {
            in: [
              BookingStatus.APPROVED,
              BookingStatus.PENDING_PAYMENT,
              BookingStatus.WAITING_APPROVAL,
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

    // Group bookings by date
    const bookingsByDate: Record<
      string,
      Array<{ status: BookingStatus; startTime: string; endTime: string }>
    > = {};
    for (const b of bookings) {
      const key = b.eventDate.toISOString().split('T')[0];
      if (!bookingsByDate[key]) bookingsByDate[key] = [];
      bookingsByDate[key].push({
        status: b.status,
        startTime: b.eventStartTime,
        endTime: b.eventEndTime,
      });
    }

    const unavailableSet = new Set(
      unavailableDates.map((d) => d.date.toISOString().split('T')[0]),
    );

    const dates: Array<{ date: string; status: DateStatus }> = [];
    const daysInMonth = endDate.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let status: DateStatus = 'available';

      if (unavailableSet.has(dateStr)) {
        status = 'unavailable';
      } else if (totalSlots === 0) {
        // No slots configured – fall back to simple date-level check
        const dayBookings = bookingsByDate[dateStr] ?? [];
        const hasApproved = dayBookings.some(
          (b) => b.status === BookingStatus.APPROVED,
        );
        const hasPending = dayBookings.some(
          (b) =>
            b.status === BookingStatus.PENDING_PAYMENT ||
            b.status === BookingStatus.WAITING_APPROVAL,
        );
        if (hasApproved) status = 'booked';
        else if (hasPending) status = 'pending';
      } else {
        const dayBookings = bookingsByDate[dateStr] ?? [];

        // Count how many slots are overlapped by an APPROVED booking
        const approvedBlockedCount = activeSlots.filter((slot) => {
          const sStart = toMinutes(slot.startTime);
          const sEnd = toMinutes(slot.endTime);
          return dayBookings.some((b) => {
            if (b.status !== BookingStatus.APPROVED) return false;
            const bStart = toMinutes(b.startTime);
            const bEnd = toMinutes(b.endTime);
            return bStart < sEnd && bEnd > sStart;
          });
        }).length;

        // Count how many slots are overlapped by ANY active booking
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
        } else if (anyBlockedCount >= totalSlots) {
          status = 'pending';
        } else {
          status = 'available';
        }
      }

      dates.push({ date: dateStr, status });
    }

    return { month, dates };
  }

  async getDayAvailability(date: string) {
    const eventDate = new Date(date);

    const [bookings, unavailable, activeSlots] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          eventDate,
          status: {
            notIn: [
              BookingStatus.CANCELLED,
              BookingStatus.REJECTED,
              BookingStatus.DRAFT,
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

    // Map each active slot to its availability status using time-range overlap
    const slots = activeSlots.map((slot) => {
      const slotStart = toMinutes(slot.startTime);
      const slotEnd = toMinutes(slot.endTime);

      // Find a booking that overlaps this slot
      const overlappingBooking = bookings.find((b) => {
        const bStart = toMinutes(b.eventStartTime);
        const bEnd = toMinutes(b.eventEndTime);
        return bStart < slotEnd && bEnd > slotStart;
      });

      let slotStatus: SlotStatus = 'available';
      if (overlappingBooking) {
        slotStatus =
          overlappingBooking.status === BookingStatus.APPROVED
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
}
