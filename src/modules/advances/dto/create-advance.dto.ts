import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdvanceDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ example: 1000, description: 'Advance amount requested' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2024-01-10', description: 'Request date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  requestDate: string;

  @ApiPropertyOptional({ example: 'pending', enum: ['pending', 'approved', 'rejected', 'deducted'] })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'deducted'])
  status?: string;
}
