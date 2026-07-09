import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryHistory } from '../../models/salary-history.entity';
import { SalaryHistoryController } from './salary-history.controller';
import { SalaryHistoryService } from './salary-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryHistory])],
  controllers: [SalaryHistoryController],
  providers: [SalaryHistoryService],
  exports: [SalaryHistoryService],
})
export class SalaryHistoryModule {}
