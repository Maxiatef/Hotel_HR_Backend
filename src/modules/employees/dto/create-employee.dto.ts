import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString, IsIn, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiPropertyOptional({ example: 'EMP-001', description: 'Unique employee code — auto-generated if omitted' })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiPropertyOptional({ example: 'uuid-department-id', description: 'Department ID' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({ example: 'full_time', enum: ['full_time', 'part_time', 'contract'] })
  @IsOptional()
  @IsIn(['full_time', 'part_time', 'contract'])
  employmentType?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'on_leave', 'terminated'] })
  @IsOptional()
  @IsIn(['active', 'on_leave', 'terminated'])
  workStatus?: string;

  @ApiPropertyOptional({ example: 50, description: 'Hourly pay rate — if set, payroll pays this employee by hours worked instead of a fixed monthly salary' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Michael', description: 'Middle name' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'Date of birth (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: 'Egyptian' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: '29001011234567', description: 'National ID number' })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiPropertyOptional({ example: 'married', enum: ['single', 'married', 'divorced', 'widowed'] })
  @IsOptional()
  @IsIn(['single', 'married', 'divorced', 'widowed'])
  maritalStatus?: string;

  @ApiPropertyOptional({ example: '+20 1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'john@hotel.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '123 Nile Street, Cairo' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Front Desk Manager' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+20 1098765432' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Whether this employee is enrolled in social insurance' })
  @IsOptional()
  @IsBoolean()
  hasSocialInsurance?: boolean;

  @ApiPropertyOptional({ example: 0.11, description: 'Social insurance rate (e.g. 0.11 = 11%). Defaults to Egypt standard 11%' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  socialInsuranceRate?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether income tax applies to this employee' })
  @IsOptional()
  @IsBoolean()
  hasTax?: boolean;

  @ApiPropertyOptional({ example: 0.10, description: 'Flat tax rate override (e.g. 0.10 = 10%). If omitted, Egypt progressive brackets apply.' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;
}
