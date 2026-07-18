import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferEmployeeDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-source-hotel-id', description: 'Hotel to transfer FROM' })
  @IsString()
  @IsNotEmpty()
  fromHotelId: string;

  @ApiProperty({ example: 'uuid-destination-hotel-id', description: 'Hotel to transfer TO' })
  @IsString()
  @IsNotEmpty()
  toHotelId: string;

  @ApiPropertyOptional({ example: 'uuid-department-id', description: 'Department in the destination hotel' })
  @IsOptional()
  @IsString()
  toDepartmentId?: string;

  @ApiPropertyOptional({ example: 'Internal transfer request by management' })
  @IsOptional()
  @IsString()
  transferReason?: string;

  @ApiPropertyOptional({ example: 'full_time', enum: ['full_time', 'part_time', 'contract'] })
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'on_leave', 'terminated'] })
  @IsOptional()
  @IsString()
  workStatus?: string;
}
