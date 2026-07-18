import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GeofenceZoneService } from './geofence-zones.service';
import { CreateGeofenceZoneDto } from './dto/create-geofence-zone.dto';
import { UpdateGeofenceZoneDto } from './dto/update-geofence-zone.dto';
import { CheckPointDto } from './dto/check-point.dto';

@ApiTags('geofence-zones')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('geofence-zones')
export class GeofenceZoneController {
  constructor(private readonly service: GeofenceZoneService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateGeofenceZoneDto) {
    return this.service.create(hotelId, dto);
  }

  @Post('check')
  check(@CurrentHotel() hotelId: string, @Body() dto: CheckPointDto) {
    return this.service.isPointInsideAnyZone(hotelId, dto.lat, dto.lng);
  }

  @Get('check-point')
  @ApiQuery({ name: 'lat', type: Number })
  @ApiQuery({ name: 'lng', type: Number })
  async checkPoint(
    @CurrentHotel() hotelId: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    const result = await this.service.isPointInsideAnyZone(
      hotelId,
      parseFloat(lat),
      parseFloat(lng),
    );
    // Flat shape: mobile clients read `isInZone` as a plain boolean.
    return {
      isInZone: result.inside,
      zoneId: result.zoneId,
      zoneName: result.zoneName,
    };
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
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateGeofenceZoneDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
