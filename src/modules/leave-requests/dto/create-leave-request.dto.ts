import { IsString, IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveRequestDto {
  @ApiPropertyOptional({ example: 'uuid-employee-id' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ example: 'uuid-hotel-id' })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiProperty({ example: 'annual', enum: ['annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid'] })
  @IsString()
  @IsNotEmpty()
  leaveType: string;

  @ApiProperty({ example: '2024-02-01', description: 'Leave start date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2024-02-07', description: 'Leave end date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ example: 'pending', enum: ['pending', 'approved', 'rejected'] })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({ example: 'Family vacation' })
  @IsOptional()
  @IsString()
  reason?: string;
}
