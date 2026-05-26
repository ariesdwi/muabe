import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveBookingDto {
  @IsOptional()
  @IsString()
  adminNote?: string;
}
