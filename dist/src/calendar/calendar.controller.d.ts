import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { IcsService } from './ics.service';
export declare class CalendarController {
    private readonly prisma;
    private readonly icsService;
    constructor(prisma: PrismaService, icsService: IcsService);
    downloadIcs(id: string, res: Response): Promise<void>;
}
