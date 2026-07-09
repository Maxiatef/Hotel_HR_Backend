import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryHistoryDto } from './create-salary-history.dto';

export class UpdateSalaryHistoryDto extends PartialType(CreateSalaryHistoryDto) {}
