import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusDeduction } from '../../models/bonus-deduction.entity';
import { BonusDeductionController } from './bonus-deductions.controller';
import { BonusDeductionService } from './bonus-deductions.service';

@Module({
  imports: [TypeOrmModule.forFeature([BonusDeduction])],
  controllers: [BonusDeductionController],
  providers: [BonusDeductionService],
  exports: [BonusDeductionService],
})
export class BonusDeductionModule {}
