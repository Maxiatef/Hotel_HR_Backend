import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { CurrentEmployee } from '../../common/decorators/current-employee.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AttendanceRecordService } from './attendance-records.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';

@ApiTags('attendance-records')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('attendance-records')
export class AttendanceRecordController {
  constructor(private readonly service: AttendanceRecordService) {}

  // Employee self-service (mobile app) — declared before the ':id' route below so
  // 'me'/'me/today'/'clock-in'/'clock-out' aren't swallowed by the :id param route.
  // @SkipThrottle: these are machine-generated (background service, 30 s poll) so the
  // global 3 req/s limit would reject legitimate requests from a hotel with many employees.
  @SkipThrottle()
  @Post('clock-in')
  @ApiOperation({ summary: 'Clock in', description: "Records the caller's own check-in, validated against the hotel's geofence zones" })
  clockIn(@CurrentHotel() hotelId: string, @CurrentEmployee() employeeId: string, @Body() dto: ClockInDto) {
    return this.service.clockIn(hotelId, employeeId, dto.lat, dto.lng);
  }

  @SkipThrottle()
  @Post('clock-out')
  @ApiOperation({ summary: 'Clock out', description: "Records the caller's own check-out and computes hours worked" })
  clockOut(@CurrentHotel() hotelId: string, @CurrentEmployee() employeeId: string, @Body() dto: ClockOutDto) {
    return this.service.clockOut(hotelId, employeeId, dto.lat, dto.lng);
  }

  @SkipThrottle()
  @Get('me/today')
  @ApiOperation({ summary: "Today's attendance for the caller" })
  getMyToday(@CurrentHotel() hotelId: string, @CurrentEmployee() employeeId: string) {
    return this.service.getTodayForEmployee(hotelId, employeeId);
  }

  @SkipThrottle()
  @Get('me')
  @ApiOperation({ summary: "The caller's own attendance history" })
  findMine(
    @CurrentHotel() hotelId: string,
    @CurrentEmployee() employeeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findMine(hotelId, employeeId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 25);
  }

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager', 'manager')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateAttendanceRecordDto) {
    return this.service.create(hotelId, dto);
  }

  @Get()
  findAll(
    @CurrentHotel() hotelId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.service.findAll(
      hotelId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
      sortBy,
      sortOrder as 'ASC' | 'DESC',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.findOne(id, hotelId);
  }

  @Patch(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager', 'manager')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateAttendanceRecordDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
