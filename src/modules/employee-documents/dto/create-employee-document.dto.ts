import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDocumentDto {
  @ApiProperty({ example: 'uuid-employee-id' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'national_id', description: 'Document type (e.g. national_id, passport, contract)' })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiPropertyOptional({ example: '/uploads/1700000000000.pdf', description: 'Uploaded file URL' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Document expiry date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
