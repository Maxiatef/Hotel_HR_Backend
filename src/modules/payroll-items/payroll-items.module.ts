import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollItemController } from './payroll-items.controller';
import { PayrollItemService } from './payroll-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollItem])],
  controllers: [PayrollItemController],
  providers: [PayrollItemService],
  exports: [PayrollItemService],
})
export class PayrollItemModule {}
