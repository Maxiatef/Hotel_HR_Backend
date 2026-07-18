import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PayrollPeriodService } from './payroll-periods.service';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';

@ApiTags('payroll-periods')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('payroll-periods')
export class PayrollPeriodController {
  constructor(private readonly service: PayrollPeriodService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreatePayrollPeriodDto) {
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
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdatePayrollPeriodDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Patch(':id/close')
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  close(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.close(id, hotelId);
  }

  @Patch(':id/open')
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  open(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.open(id, hotelId);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
