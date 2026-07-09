import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollRunController } from './payroll-runs.controller';
import { PayrollRunService } from './payroll-runs.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollRun])],
  controllers: [PayrollRunController],
  providers: [PayrollRunService],
  exports: [PayrollRunService],
})
export class PayrollRunModule {}
