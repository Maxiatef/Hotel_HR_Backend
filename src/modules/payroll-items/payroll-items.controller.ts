import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { CurrentEmployee } from '../../common/decorators/current-employee.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PayrollItemService } from './payroll-items.service';
import { CreatePayrollItemDto } from './dto/create-payroll-item.dto';
import { UpdatePayrollItemDto } from './dto/update-payroll-item.dto';

@ApiTags('payroll-items')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('payroll-items')
export class PayrollItemController {
  constructor(private readonly service: PayrollItemService) {}

  // Employee self-service — declared before ':id' so 'me' is not swallowed by the param route
  @Get('me')
  @ApiOperation({ summary: 'List my payslips' })
  findMine(
    @CurrentHotel() hotelId: string,
    @CurrentEmployee() employeeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findMine(hotelId, employeeId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 25);
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Get a single payslip with full breakdown' })
  findMineById(
    @Param('id') id: string,
    @CurrentHotel() hotelId: string,
    @CurrentEmployee() employeeId: string,
  ) {
    return this.service.findMineById(id, hotelId, employeeId);
  }

  @Post()
  @Roles('super_admin', 'payroll_officer')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreatePayrollItemDto) {
    return this.service.create(hotelId, dto);
  }

  @Get()
  findAll(
    @CurrentHotel() hotelId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('payrollRunId') payrollRunId?: string,
  ) {
    return this.service.findAll(
      hotelId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
      sortBy,
      sortOrder as 'ASC' | 'DESC',
      payrollRunId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.findOne(id, hotelId);
  }

  @Patch(':id')
  @Roles('super_admin', 'payroll_officer')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdatePayrollItemDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
