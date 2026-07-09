import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { PayrollPeriodController } from './payroll-periods.controller';
import { PayrollPeriodService } from './payroll-periods.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollPeriod])],
  controllers: [PayrollPeriodController],
  providers: [PayrollPeriodService],
  exports: [PayrollPeriodService],
})
export class PayrollPeriodModule {}
