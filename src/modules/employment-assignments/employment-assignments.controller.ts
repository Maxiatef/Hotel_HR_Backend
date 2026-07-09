import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { EmploymentAssignmentService } from './employment-assignments.service';
import { CreateEmploymentAssignmentDto } from './dto/create-employment-assignment.dto';
import { UpdateEmploymentAssignmentDto } from './dto/update-employment-assignment.dto';

@Controller('employment-assignments')
@UseGuards(HotelScopeGuard)
export class EmploymentAssignmentController {
  constructor(private readonly service: EmploymentAssignmentService) {}

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateEmploymentAssignmentDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateEmploymentAssignmentDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
