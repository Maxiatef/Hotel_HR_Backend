import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeofenceZone } from '../../models/geofence-zone.entity';
import { GeofenceZoneController } from './geofence-zones.controller';
import { GeofenceZoneService } from './geofence-zones.service';

@Module({
  imports: [TypeOrmModule.forFeature([GeofenceZone])],
  controllers: [GeofenceZoneController],
  providers: [GeofenceZoneService],
  exports: [GeofenceZoneService],
})
export class GeofenceZoneModule {}
