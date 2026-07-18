import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { Employee } from '../../models/employee.entity';
import { BonusDeduction } from '../../models/bonus-deduction.entity';
import { AttendanceRecord } from '../../models/attendance-record.entity';
import { Loan } from '../../models/loan.entity';
import { Advance } from '../../models/advance.entity';
import { PayrollRunController } from './payroll-runs.controller';
import { PayrollRunService } from './payroll-runs.service';
import { PayrollCalculationService } from './payroll-calculation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayrollRun,
      PayrollItem,
      PayrollPeriod,
      Employee,
      BonusDeduction,
      AttendanceRecord,
      Loan,
      Advance,
    ]),
  ],
  controllers: [PayrollRunController],
  providers: [PayrollRunService, PayrollCalculationService],
  exports: [PayrollRunService, PayrollCalculationService],
})
export class PayrollRunModule {}
