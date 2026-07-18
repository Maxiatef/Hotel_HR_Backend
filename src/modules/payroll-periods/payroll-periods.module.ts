import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollPeriodController } from './payroll-periods.controller';
import { PayrollPeriodService } from './payroll-periods.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollPeriod, PayrollRun, PayrollItem])],
  controllers: [PayrollPeriodController],
  providers: [PayrollPeriodService],
  exports: [PayrollPeriodService],
})
export class PayrollPeriodModule {}
