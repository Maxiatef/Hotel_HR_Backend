import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { EmployeeBankAccountService } from './employee-bank-accounts.service';
import { CreateEmployeeBankAccountDto } from './dto/create-employee-bank-account.dto';
import { UpdateEmployeeBankAccountDto } from './dto/update-employee-bank-account.dto';

@Controller('employee-bank-accounts')
@UseGuards(HotelScopeGuard)
export class EmployeeBankAccountController {
  constructor(private readonly service: EmployeeBankAccountService) {}

  @Post()
  create(@Body() dto: CreateEmployeeBankAccountDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeBankAccountDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
