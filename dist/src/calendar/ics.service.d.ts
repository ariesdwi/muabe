import { Booking, Service, User } from '@prisma/client';
type BookingWithRelations = Booking & {
    service: Service;
    customer: User;
};
export declare class IcsService {
    generateIcs(booking: BookingWithRelations): string;
}
export {};
