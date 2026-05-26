import { AvailabilityService } from './availability.service';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getMonthAvailability(month: string): Promise<{
        month: string;
        dates: Array<{
            date: string;
            status: "available" | "booked" | "pending" | "unavailable";
        }>;
    }>;
    getDayAvailability(date: string): Promise<{
        date: string;
        isUnavailable: boolean;
        slots: any;
        bookings: any;
    }>;
}
