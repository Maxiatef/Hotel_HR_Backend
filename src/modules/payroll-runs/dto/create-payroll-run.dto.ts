import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayrollRunDto {
  @ApiPropertyOptional({ example: 'uuid-hotel-id' })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiProperty({ example: 'uuid-payroll-period-id', description: 'Payroll period to run against' })
  @IsString()
  @IsNotEmpty()
  payrollPeriodId: string;

  @ApiPropertyOptional({ example: 'uuid-user-id', description: 'User who initiated the run' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'draft', enum: ['draft', 'finalized', 'paid'] })
  @IsOptional()
  @IsIn(['draft', 'finalized', 'paid'])
  status?: string;

  @ApiPropertyOptional({ example: 85000, description: 'Total gross salary (set by system after processing)' })
  @IsOptional()
  @IsNumber()
  totalGross?: number;

  @ApiPropertyOptional({ example: 72000, description: 'Total net salary (set by system after processing)' })
  @IsOptional()
  @IsNumber()
  totalNet?: number;
}
