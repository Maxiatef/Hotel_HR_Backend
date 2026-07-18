import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayrollItemDto {
  @ApiProperty({ example: 'uuid-payroll-run-id' })
  @IsString()
  @IsNotEmpty()
  payrollRunId: string;

  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  baseSalary: number;

  @ApiPropertyOptional({ example: 1700, description: 'Sum of all fixed allowances' })
  @IsOptional()
  @IsNumber()
  fixedAllowances?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  bonusTotal?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  deductionTotal?: number;

  @ApiPropertyOptional({ example: 375, description: 'Overtime pay' })
  @IsOptional()
  @IsNumber()
  overtimeTotal?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  leaveDeductionTotal?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  loanDeductionTotal?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  advanceDeductionTotal?: number;

  @ApiPropertyOptional({ example: 550, description: '11% of base salary (Egypt employee share)' })
  @IsOptional()
  @IsNumber()
  socialInsuranceTotal?: number;

  @ApiPropertyOptional({ example: 125, description: 'Progressive income tax' })
  @IsOptional()
  @IsNumber()
  taxTotal?: number;

  @ApiProperty({ example: 6500, description: 'Final net salary after all deductions' })
  @IsNumber()
  @IsNotEmpty()
  netSalary: number;
}
