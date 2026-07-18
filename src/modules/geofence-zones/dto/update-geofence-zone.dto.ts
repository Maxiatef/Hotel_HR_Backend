import { PartialType } from '@nestjs/mapped-types';
import { CreateGeofenceZoneDto } from './create-geofence-zone.dto';

export class UpdateGeofenceZoneDto extends PartialType(CreateGeofenceZoneDto) {}
