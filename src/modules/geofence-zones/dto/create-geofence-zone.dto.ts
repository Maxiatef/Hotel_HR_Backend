import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeofencePointDto } from './geofence-point.dto';

export class CreateGeofenceZoneDto {
  @ApiProperty({ example: 'Hotel Main Entrance Zone' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Array of lat/lng coordinates defining the polygon boundary (min 3 points)',
    type: [GeofencePointDto],
    example: [{ lat: 30.0444, lng: 31.2357 }, { lat: 30.0450, lng: 31.2360 }, { lat: 30.0448, lng: 31.2370 }],
  })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => GeofencePointDto)
  points: GeofencePointDto[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
