import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RejectLeaveDto {
  @ApiPropertyOptional({ example: 'Insufficient leave balance' })
  @IsOptional()
  @IsString()
  reason?: string;
}
