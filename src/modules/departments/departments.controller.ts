import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('departments')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateDepartmentDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateDepartmentDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
