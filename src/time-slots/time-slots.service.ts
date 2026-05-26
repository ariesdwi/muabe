import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';

@Injectable()
export class TimeSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(onlyActive = false) {
    return this.prisma.timeSlot.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }],
    });
  }

  async create(dto: CreateTimeSlotDto) {
    return this.prisma.timeSlot.create({ data: dto });
  }

  async toggle(id: string) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Time slot not found');
    return this.prisma.timeSlot.update({
      where: { id },
      data: { isActive: !slot.isActive },
    });
  }

  async update(id: string, dto: Partial<CreateTimeSlotDto>) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Time slot not found');
    return this.prisma.timeSlot.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Time slot not found');
    return this.prisma.timeSlot.delete({ where: { id } });
  }
}
