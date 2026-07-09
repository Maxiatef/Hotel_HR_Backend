import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { BonusDeductionService } from './bonus-deductions.service';
import { CreateBonusDeductionDto } from './dto/create-bonus-deduction.dto';
import { UpdateBonusDeductionDto } from './dto/update-bonus-deduction.dto';

@Controller('bonus-deductions')
@UseGuards(HotelScopeGuard)
export class BonusDeductionController {
  constructor(private readonly service: BonusDeductionService) {}

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateBonusDeductionDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateBonusDeductionDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
