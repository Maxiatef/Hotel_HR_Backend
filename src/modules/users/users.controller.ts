import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(HotelScopeGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateUserDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
