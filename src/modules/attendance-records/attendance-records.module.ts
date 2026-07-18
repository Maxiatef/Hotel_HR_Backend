import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../models/attendance-record.entity';
import { AttendanceRecordController } from './attendance-records.controller';
import { AttendanceRecordService } from './attendance-records.service';
import { GeofenceZoneModule } from '../geofence-zones/geofence-zones.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord]), GeofenceZoneModule],
  controllers: [AttendanceRecordController],
  providers: [AttendanceRecordService],
  exports: [AttendanceRecordService],
})
export class AttendanceRecordModule {}
