import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../models/attendance-record.entity';
import { AttendanceRecordController } from './attendance-records.controller';
import { AttendanceRecordService } from './attendance-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord])],
  controllers: [AttendanceRecordController],
  providers: [AttendanceRecordService],
  exports: [AttendanceRecordService],
})
export class AttendanceRecordModule {}
