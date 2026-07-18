import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceRecordDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ example: '2024-01-15', description: 'Work date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  workDate: string;

  @ApiPropertyOptional({ example: '2024-01-15T08:00:00.000Z', description: 'Check-in timestamp' })
  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @ApiPropertyOptional({ example: '2024-01-15T17:00:00.000Z', description: 'Check-out timestamp' })
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @ApiPropertyOptional({ example: 2.5, description: 'Overtime hours worked' })
  @IsOptional()
  @IsNumber()
  overtimeHours?: number;

  @ApiPropertyOptional({ example: 8, description: 'Regular hours worked this day (used for hourly-rate payroll)' })
  @IsOptional()
  @IsNumber()
  hoursWorked?: number;

  @ApiPropertyOptional({ example: 'present', enum: ['present', 'absent', 'late', 'on_leave'] })
  @IsOptional()
  @IsIn(['present', 'absent', 'late', 'on_leave'])
  status?: string;
}
