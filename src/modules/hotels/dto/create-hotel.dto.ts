import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ example: 'HTL-001', description: 'Unique hotel code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Grand Nile Hotel', description: 'Hotel name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Cairo', description: 'City where the hotel is located' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether the hotel is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
