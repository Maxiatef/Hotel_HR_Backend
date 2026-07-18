import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayrollPeriodDto {
  @ApiPropertyOptional({ example: 'uuid-hotel-id' })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiProperty({ example: 2024, description: 'Payroll year' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 1, description: 'Payroll month (1–12)' })
  @IsNumber()
  @IsNotEmpty()
  month: number;

  @ApiPropertyOptional({ example: 'open', enum: ['open', 'closed', 'locked'] })
  @IsOptional()
  @IsIn(['open', 'closed', 'locked'])
  status?: string;
}
