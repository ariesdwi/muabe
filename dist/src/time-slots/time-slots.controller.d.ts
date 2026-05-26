import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
export declare class TimeSlotsController {
    private readonly timeSlotsService;
    constructor(timeSlotsService: TimeSlotsService);
    findAll(active?: string): any;
    create(dto: CreateTimeSlotDto): Promise<any>;
    toggle(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateTimeSlotDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
