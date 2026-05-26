import { PrismaService } from '../prisma/prisma.service';
type DateStatus = 'available' | 'booked' | 'pending' | 'unavailable';
export declare class AvailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMonthAvailability(month: string): Promise<{
        month: string;
        dates: Array<{
            date: string;
            status: DateStatus;
        }>;
    }>;
    getDayAvailability(date: string): Promise<{
        date: string;
        isUnavailable: boolean;
        slots: any;
        bookings: any;
    }>;
}
export {};
