import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBonusDeductionDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiPropertyOptional({ example: 'uuid-payroll-period-id' })
  @IsOptional()
  @IsString()
  payrollPeriodId?: string;

  @ApiProperty({ example: 'bonus', enum: ['bonus', 'deduction'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: 'Performance bonus Q4' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 'approved', enum: ['pending', 'approved', 'rejected'] })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
