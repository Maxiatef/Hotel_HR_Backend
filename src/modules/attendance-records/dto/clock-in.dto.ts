import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClockInDto {
  @ApiProperty({ example: 30.0444, description: 'GPS latitude at time of clock-in' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: 31.2357, description: 'GPS longitude at time of clock-in' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
