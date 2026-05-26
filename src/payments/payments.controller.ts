import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PaymentsService } from './payments.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import { IsNotEmpty, IsString } from 'class-validator';

class RejectPaymentDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}

@Controller('bookings/:bookingId/payment-proof')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  uploadPaymentProof(
    @Param('bookingId') bookingId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadPaymentProofDto,
  ) {
    return this.paymentsService.uploadPaymentProof(bookingId, file, dto.notes);
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/payment-proofs')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAllProofs();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.paymentsService.approvePaymentProof(id, adminId);
  }

  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectPaymentDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.paymentsService.rejectPaymentProof(id, adminId, dto.reason);
  }
}
