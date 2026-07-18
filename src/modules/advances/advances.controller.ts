import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdvanceService } from './advances.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';
import { UpdateAdvanceDto } from './dto/update-advance.dto';

@ApiTags('advances')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('advances')
export class AdvanceController {
  constructor(private readonly service: AdvanceService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager', 'payroll_officer')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateAdvanceDto) {
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
  @Roles('super_admin', 'hotel_admin', 'hr_manager', 'payroll_officer')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateAdvanceDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Patch(':id/approve')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  @ApiOperation({ summary: 'Approve an advance request' })
  @ApiResponse({ status: 200, description: 'Advance approved' })
  approve(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.approve(id, hotelId);
  }

  @Patch(':id/reject')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  @ApiOperation({ summary: 'Reject an advance request' })
  @ApiResponse({ status: 200, description: 'Advance rejected' })
  reject(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.reject(id, hotelId);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
