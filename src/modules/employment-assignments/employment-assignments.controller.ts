import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmploymentAssignmentService } from './employment-assignments.service';
import { CreateEmploymentAssignmentDto } from './dto/create-employment-assignment.dto';
import { UpdateEmploymentAssignmentDto } from './dto/update-employment-assignment.dto';
import { TransferEmployeeDto } from './dto/transfer-employee.dto';

@ApiTags('employment-assignments')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('employment-assignments')
export class EmploymentAssignmentController {
  constructor(private readonly service: EmploymentAssignmentService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateEmploymentAssignmentDto) {
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
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateEmploymentAssignmentDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Post('transfer')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  transfer(@Body() dto: TransferEmployeeDto) {
    return this.service.transfer(dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
