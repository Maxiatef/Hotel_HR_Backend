import { IsString, IsNotEmpty, IsOptional, IsEmail, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn([
    'super_admin',
    'hotel_admin',
    'hr_manager',
    'payroll_officer',
    'manager',
    'employee',
    'auditor',
  ])
  role?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;
}
