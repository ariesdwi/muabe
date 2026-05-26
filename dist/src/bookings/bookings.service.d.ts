import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private isSlotAvailable;
    createBooking(dto: CreateBookingDto): Promise<any>;
    findById(id: string): Promise<any>;
    findAll(filters?: {
        status?: BookingStatus;
    }): Promise<any>;
    approveBooking(id: string, dto: ApproveBookingDto, adminId: string): Promise<any>;
    rejectBooking(id: string, dto: RejectBookingDto, adminId: string): Promise<any>;
    cancelBooking(id: string): Promise<any>;
    completeBooking(id: string, adminId: string): Promise<any>;
}
