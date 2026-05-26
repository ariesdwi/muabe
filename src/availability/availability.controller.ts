import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  getMonthAvailability(@Query('month') month: string) {
    return this.availabilityService.getMonthAvailability(month);
  }

  @Get('day')
  getDayAvailability(@Query('date') date: string) {
    return this.availabilityService.getDayAvailability(date);
  }
}
