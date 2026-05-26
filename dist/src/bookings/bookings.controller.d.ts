import { BookingsService } from './bookings.service';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(dto: CreateBookingDto): Promise<any>;
    findById(id: string): Promise<any>;
}
export declare class AdminBookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(): Promise<any>;
    findById(id: string): Promise<any>;
    approve(id: string, dto: ApproveBookingDto, adminId: string): Promise<any>;
    reject(id: string, dto: RejectBookingDto, adminId: string): Promise<any>;
    cancel(id: string): Promise<any>;
    complete(id: string, adminId: string): Promise<any>;
}
