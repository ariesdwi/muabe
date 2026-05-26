import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

class CreateUnavailableDateDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/summary')
  getDashboardSummary() {
    return this.adminService.getDashboardSummary();
  }

  @Get('unavailable-dates')
  getUnavailableDates() {
    return this.adminService.getUnavailableDates();
  }

  @Post('unavailable-dates')
  addUnavailableDate(
    @Body() dto: CreateUnavailableDateDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.addUnavailableDate(dto.date, dto.reason, adminId);
  }

  @Delete('unavailable-dates/:id')
  removeUnavailableDate(@Param('id') id: string) {
    return this.adminService.removeUnavailableDate(id);
  }
}
