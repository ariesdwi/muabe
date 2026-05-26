import { IsOptional, IsString } from 'class-validator';

export class UploadPaymentProofDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
