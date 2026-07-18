import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { PayrollItemController } from './payroll-items.controller';
import { PayrollItemService } from './payroll-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollItem, PayrollRun, PayrollPeriod])],
  controllers: [PayrollItemController],
  providers: [PayrollItemService],
  exports: [PayrollItemService],
})
export class PayrollItemModule {}
