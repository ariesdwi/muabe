import { PrismaService } from '../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
export declare class PaymentsService {
    private readonly prisma;
    private readonly uploadsService;
    constructor(prisma: PrismaService, uploadsService: UploadsService);
    uploadPaymentProof(bookingId: string, file: Express.Multer.File, notes?: string): Promise<any>;
    findAllProofs(): Promise<any>;
    approvePaymentProof(id: string, adminId: string): Promise<any>;
    rejectPaymentProof(id: string, adminId: string, reason: string): Promise<any>;
}
