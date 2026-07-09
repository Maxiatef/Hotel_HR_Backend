import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { AttendanceRecordService } from './attendance-records.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Controller('attendance-records')
@UseGuards(HotelScopeGuard)
export class AttendanceRecordController {
  constructor(private readonly service: AttendanceRecordService) {}

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateAttendanceRecordDto) {
    return this.service.create(hotelId, dto);
  }

  @Get()
  findAll(@CurrentHotel() hotelId: string) {
    return this.service.findAll(hotelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.findOne(id, hotelId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateAttendanceRecordDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
