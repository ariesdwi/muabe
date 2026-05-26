import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { IcsService } from './ics.service';

@Controller()
export class CalendarController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly icsService: IcsService,
  ) {}

  @Get('bookings/:id/calendar.ics')
  async downloadIcs(@Param('id') id: string, @Res() res: Response) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true, customer: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const icsContent = this.icsService.generateIcs(booking as any);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="booking-${id}.ics"`,
    );
    res.send(icsContent);
  }
}
