import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { PayrollRunService } from './payroll-runs.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { UpdatePayrollRunDto } from './dto/update-payroll-run.dto';

@Controller('payroll-runs')
@UseGuards(HotelScopeGuard)
export class PayrollRunController {
  constructor(private readonly service: PayrollRunService) {}

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreatePayrollRunDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdatePayrollRunDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
