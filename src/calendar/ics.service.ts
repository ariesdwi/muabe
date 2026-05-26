import { Injectable } from '@nestjs/common';
import { Booking, Service, User } from '@prisma/client';
import { formatDateForCalendar } from '../common/utils/date.util';

type BookingWithRelations = Booking & {
  service: Service;
  customer: User;
};

@Injectable()
export class IcsService {
  generateIcs(booking: BookingWithRelations): string {
    const eventDate = booking.eventDate;
    const [startHour, startMin] = booking.eventStartTime.split(':').map(Number);
    const [endHour, endMin] = booking.eventEndTime.split(':').map(Number);

    const dtStart = new Date(eventDate);
    dtStart.setHours(startHour, startMin, 0, 0);

    const dtEnd = new Date(eventDate);
    dtEnd.setHours(endHour, endMin, 0, 0);

    const now = new Date();
    const uid = `booking-${booking.id}@mua-studio`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MUA Studio//Booking System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatDateForCalendar(now)}`,
      `DTSTART:${formatDateForCalendar(dtStart)}`,
      `DTEND:${formatDateForCalendar(dtEnd)}`,
      `SUMMARY:MUA Booking - ${booking.service.name} - ${booking.customer.name}`,
      `DESCRIPTION:Booking ID: ${booking.id}\\nKlien: ${booking.customer.name}\\nHP: ${booking.customer.phone}\\nLayanan: ${booking.service.name}`,
      `LOCATION:${booking.eventLocation ?? ''}${booking.eventAddress ? ', ' + booking.eventAddress : ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    return lines.join('\r\n');
  }
}
