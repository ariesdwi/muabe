import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
export declare class TimeSlotsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(onlyActive?: boolean): any;
    create(dto: CreateTimeSlotDto): Promise<any>;
    toggle(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateTimeSlotDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
