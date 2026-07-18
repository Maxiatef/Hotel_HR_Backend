import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ example: 10000, description: 'Total loan principal amount' })
  @IsNumber()
  @IsNotEmpty()
  principalAmount: number;

  @ApiProperty({ example: 10000, description: 'Remaining balance (initially equals principalAmount)' })
  @IsNumber()
  @IsNotEmpty()
  remainingAmount: number;

  @ApiPropertyOptional({ example: 500, description: 'Monthly deduction installment' })
  @IsOptional()
  @IsNumber()
  monthlyInstallment?: number;

  @ApiProperty({ example: '2024-01-01', description: 'Loan start date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'paid_off', 'defaulted'] })
  @IsOptional()
  @IsIn(['active', 'paid_off', 'defaulted'])
  status?: string;
}
