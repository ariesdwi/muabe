import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardSummary(): Promise<{
        totalBookings: any;
        waitingApproval: any;
        pendingPayment: any;
        approvedThisMonth: any;
        completedThisMonth: any;
        upcomingBookings: any;
    }>;
    getUnavailableDates(): Promise<any>;
    addUnavailableDate(date: string, reason?: string, adminId?: string): Promise<any>;
    removeUnavailableDate(id: string): Promise<any>;
}
