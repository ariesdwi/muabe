import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  /** Public — customer fetches active slots */
  @Get()
  findAll(@Query('active') active?: string) {
    return this.timeSlotsService.findAll(active === 'true');
  }

  /** Admin — create slot */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTimeSlotDto) {
    return this.timeSlotsService.create(dto);
  }

  /** Admin — toggle active/inactive */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.timeSlotsService.toggle(id);
  }

  /** Admin — update label / times */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTimeSlotDto>) {
    return this.timeSlotsService.update(id, dto);
  }

  /** Admin — delete slot */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(id);
  }
}
