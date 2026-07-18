import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeBankAccountDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'Banque Misr', description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '0001234567890', description: 'Bank account number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiPropertyOptional({ example: 'EG380019000500000001234567890', description: 'IBAN number' })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this is the primary account for salary payment' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
