import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../../models/attendance-record.entity';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';
import { GeofenceZoneService } from '../geofence-zones/geofence-zones.service';

const REGULAR_HOURS_PER_DAY = 8;

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class AttendanceRecordService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly repo: Repository<AttendanceRecord>,
    private readonly geofenceService: GeofenceZoneService,
  ) {}

  create(hotelId: string, dto: CreateAttendanceRecordDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  async findAll(hotelId: string, page = 1, limit = 25, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC') {
    const skip = (page - 1) * limit;
    const order = sortBy ? { [sortBy]: sortOrder } : {};
    const [data, total] = await this.repo.findAndCount({
      where: { hotelId } as any,
      skip,
      take: limit,
      order,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`AttendanceRecord ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateAttendanceRecordDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }

  private requireEmployeeId(employeeId?: string): string {
    if (!employeeId) {
      throw new BadRequestException('Your account is not linked to an employee record');
    }
    return employeeId;
  }

  async clockIn(hotelId: string, employeeId: string | undefined, lat: number, lng: number) {
    const empId = this.requireEmployeeId(employeeId);

    const zoneMatch = await this.geofenceService.isPointInsideAnyZone(hotelId, lat, lng);
    if (!zoneMatch.inside) {
      throw new BadRequestException('You are not within a valid work location to clock in');
    }

    // Block if there is already an open record (clocked in but not yet out)
    const workDate = todayDateString();
    const openRecord = await this.repo.findOne({
      where: { employeeId: empId, hotelId, workDate } as any,
      order: { checkIn: 'DESC' } as any,
    });
    if (openRecord?.checkIn && !openRecord.checkOut) {
      throw new BadRequestException('You are already clocked in');
    }

    // Create a fresh record for this clock-in cycle.
    // The DB partial unique index (employeeId, workDate) WHERE checkOut IS NULL
    // enforces at most one open record at a time, so concurrent retries from the
    // mobile offline queue can't produce duplicates.
    const now = new Date();
    const record = new AttendanceRecord();
    record.employeeId = empId;
    record.hotelId = hotelId;
    record.workDate = workDate as any;
    record.checkIn = now;
    record.status = 'present';
    record.zoneId = zoneMatch.zoneId;
    record.zoneName = zoneMatch.zoneName;
    record.zoneEnteredAt = now;
    try {
      return await this.repo.save(record);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new BadRequestException('You are already clocked in');
      }
      throw err;
    }
  }

  async clockOut(hotelId: string, employeeId: string | undefined, lat: number, lng: number) {
    const empId = this.requireEmployeeId(employeeId);

    // No zone check on clock-out: the employee is clocking out BECAUSE they left
    // the zone. Requiring them to be inside would always reject auto clock-outs.
    // Zone validation only applies to clock-in (prevents fake check-ins from home).

    // Find the latest open record for today
    const workDate = todayDateString();
    const record = await this.repo.findOne({
      where: { employeeId: empId, hotelId, workDate } as any,
      order: { checkIn: 'DESC' } as any,
    });

    if (!record?.checkIn) {
      throw new BadRequestException('You have not clocked in today');
    }
    if (record.checkOut) {
      throw new BadRequestException('You are not currently clocked in');
    }

    record.checkOut = new Date();
    const totalHours = (record.checkOut.getTime() - new Date(record.checkIn).getTime()) / (1000 * 60 * 60);
    record.hoursWorked = Math.round(Math.min(totalHours, REGULAR_HOURS_PER_DAY) * 100) / 100;
    record.overtimeHours = Math.round(Math.max(totalHours - REGULAR_HOURS_PER_DAY, 0) * 100) / 100;

    return this.repo.save(record);
  }

  async getTodayForEmployee(hotelId: string, employeeId?: string) {
    const empId = this.requireEmployeeId(employeeId);
    const workDate = todayDateString();
    // Return the latest open record (clocked in, not yet out), or the most recent record
    const openRecord = await this.repo.findOne({
      where: { employeeId: empId, hotelId, workDate, checkOut: null } as any,
      order: { checkIn: 'DESC' } as any,
    });
    if (openRecord) return openRecord;
    return this.repo.findOne({
      where: { employeeId: empId, hotelId, workDate } as any,
      order: { checkIn: 'DESC' } as any,
    });
  }

  async findMine(hotelId: string, employeeId: string | undefined, page = 1, limit = 25) {
    const empId = this.requireEmployeeId(employeeId);
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({
      where: { employeeId: empId, hotelId } as any,
      skip,
      take: limit,
      order: { workDate: 'DESC' } as any,
    });
    return { data, total, page, limit };
  }
}
