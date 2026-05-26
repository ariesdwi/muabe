import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CheckAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in format YYYY-MM' })
  month: string;
}
