import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmploymentAssignmentDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiPropertyOptional({ example: 'uuid-department-id' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ example: '2024-01-01', description: 'Assignment start date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Assignment end date (null = current)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'full_time', enum: ['full_time', 'part_time', 'contract'] })
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'on_leave', 'terminated'] })
  @IsOptional()
  @IsString()
  workStatus?: string;

  @ApiPropertyOptional({ example: 'Promoted to senior role' })
  @IsOptional()
  @IsString()
  transferReason?: string;
}
