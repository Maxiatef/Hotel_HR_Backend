import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmployeeBankAccountService } from './employee-bank-accounts.service';
import { CreateEmployeeBankAccountDto } from './dto/create-employee-bank-account.dto';
import { UpdateEmployeeBankAccountDto } from './dto/update-employee-bank-account.dto';

@ApiTags('employee-bank-accounts')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('employee-bank-accounts')
export class EmployeeBankAccountController {
  constructor(private readonly service: EmployeeBankAccountService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager', 'payroll_officer')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateEmployeeBankAccountDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateEmployeeBankAccountDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
