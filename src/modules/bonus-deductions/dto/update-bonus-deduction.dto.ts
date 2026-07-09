import { PartialType } from '@nestjs/mapped-types';
import { CreateBonusDeductionDto } from './create-bonus-deduction.dto';

export class UpdateBonusDeductionDto extends PartialType(CreateBonusDeductionDto) {}
