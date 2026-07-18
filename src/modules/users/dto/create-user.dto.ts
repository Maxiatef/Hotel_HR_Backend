import { IsString, IsNotEmpty, IsOptional, IsEmail, IsIn, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@hotel.com', description: 'User email address' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123!', description: 'Password (min 8 characters)', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    example: 'hr_manager',
    enum: ['hotel_admin', 'hr_manager', 'payroll_officer', 'manager', 'employee', 'auditor'],
    description: 'User role',
  })
  @IsOptional()
  @IsIn(['hotel_admin', 'hr_manager', 'payroll_officer', 'manager', 'employee', 'auditor'])
  role?: string;

  @ApiPropertyOptional({ example: 'uuid-employee-id', description: 'Linked employee ID' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether the user is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
