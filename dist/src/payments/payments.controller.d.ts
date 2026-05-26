import { PaymentsService } from './payments.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
declare class RejectPaymentDto {
    reason: string;
}
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    uploadPaymentProof(bookingId: string, file: Express.Multer.File, dto: UploadPaymentProofDto): Promise<any>;
}
export declare class AdminPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(): Promise<any>;
    approve(id: string, adminId: string): Promise<any>;
    reject(id: string, dto: RejectPaymentDto, adminId: string): Promise<any>;
}
export {};
