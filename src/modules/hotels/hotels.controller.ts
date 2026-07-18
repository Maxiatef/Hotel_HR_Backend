import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { CurrentRole } from '../../common/decorators/current-role.decorator';
import { HotelService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@ApiTags('hotels')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('hotels')
export class HotelController {
  constructor(private readonly service: HotelService) {}

  @Post()
  @Roles('super_admin')
  @ApiOperation({ summary: 'Create a hotel', description: 'Requires super_admin role' })
  @ApiResponse({ status: 201, description: 'Hotel created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — super_admin only' })
  create(@Body() dto: CreateHotelDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all hotels' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 25 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, description: 'Paginated list of hotels' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.service.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
      sortBy,
      sortOrder as 'ASC' | 'DESC',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel found' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'hotel_admin')
  @ApiOperation({ summary: 'Update a hotel', description: 'hotel_admin can only update their own hotel' })
  @ApiResponse({ status: 200, description: 'Hotel updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto,
    @CurrentRole() role: string,
    @CurrentHotel() hotelId: string,
  ) {
    if (role !== 'super_admin' && id !== hotelId) {
      throw new ForbiddenException('Cannot modify a different hotel');
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Delete a hotel', description: 'Requires super_admin role' })
  @ApiResponse({ status: 200, description: 'Hotel deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
