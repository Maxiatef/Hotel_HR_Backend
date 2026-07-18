import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeofenceZone } from '../../models/geofence-zone.entity';
import { CreateGeofenceZoneDto } from './dto/create-geofence-zone.dto';
import { UpdateGeofenceZoneDto } from './dto/update-geofence-zone.dto';
import { isPointInsideOrNearPolygon } from '../../common/utils/geofence.util';

@Injectable()
export class GeofenceZoneService {
  constructor(
    @InjectRepository(GeofenceZone)
    private readonly repo: Repository<GeofenceZone>,
  ) {}

  create(hotelId: string, dto: CreateGeofenceZoneDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  async findAll(hotelId: string, page = 1, limit = 25, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC') {
    const skip = (page - 1) * limit;
    const order = sortBy ? { [sortBy]: sortOrder } : {};
    const [data, total] = await this.repo.findAndCount({
      where: { hotelId } as any,
      skip,
      take: limit,
      order,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`GeofenceZone ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateGeofenceZoneDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }

  async isPointInsideAnyZone(hotelId: string, lat: number, lng: number) {
    const zones = await this.repo.find({ where: { hotelId, isActive: true } as any });
    for (const zone of zones) {
      // Accept the point if it's inside the polygon, or within 150m of the
      // nearest edge, to account for GPS inaccuracy (especially indoors).
      if (isPointInsideOrNearPolygon({ lat, lng }, zone.points, 150)) {
        return { inside: true, zoneId: zone.id, zoneName: zone.name };
      }
    }
    return { inside: false };
  }
}
