import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PayrollRunService } from './payroll-runs.service';
import { PayrollCalculationService } from './payroll-calculation.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { UpdatePayrollRunDto } from './dto/update-payroll-run.dto';

@ApiTags('payroll-runs')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('payroll-runs')
export class PayrollRunController {
  constructor(
    private readonly service: PayrollRunService,
    private readonly calculationService: PayrollCalculationService,
  ) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreatePayrollRunDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdatePayrollRunDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }

  @Post(':id/process')
  @Roles('super_admin', 'hotel_admin', 'payroll_officer')
  @ApiOperation({ summary: 'Process a payroll run', description: 'Triggers full payroll calculation for all active employees. Calculates salary, overtime, tax, social insurance, loans, and advances.' })
  @ApiResponse({ status: 201, description: 'Payroll processing started' })
  process(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.calculationService.processPayroll(id, hotelId);
  }
}
