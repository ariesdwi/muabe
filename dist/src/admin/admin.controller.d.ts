import { AdminService } from './admin.service';
declare class CreateUnavailableDateDto {
    date: string;
    reason?: string;
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardSummary(): Promise<{
        totalBookings: any;
        waitingApproval: any;
        pendingPayment: any;
        approvedThisMonth: any;
        completedThisMonth: any;
        upcomingBookings: any;
    }>;
    getUnavailableDates(): Promise<any>;
    addUnavailableDate(dto: CreateUnavailableDateDto, adminId: string): Promise<any>;
    removeUnavailableDate(id: string): Promise<any>;
}
export {};
