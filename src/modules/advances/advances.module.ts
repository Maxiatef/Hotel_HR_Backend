import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advance } from '../../models/advance.entity';
import { AdvanceController } from './advances.controller';
import { AdvanceService } from './advances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Advance])],
  controllers: [AdvanceController],
  providers: [AdvanceService],
  exports: [AdvanceService],
})
export class AdvanceModule {}
