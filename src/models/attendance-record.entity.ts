import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'date' })
  workDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkIn?: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut?: Date;

  // Which geofence zone matched at the moment of clock-in, and when — for mobile GPS
  // clock-ins. Null for records created manually by HR without a geofence check.
  @Column({ type: 'varchar', nullable: true })
  zoneId?: string;

  @Column({ type: 'varchar', nullable: true })
  zoneName?: string;

  @Column({ type: 'timestamp', nullable: true })
  zoneEnteredAt?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursWorked: number;

  @ManyToOne(() => Employee, (emp) => emp.attendanceRecords, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'varchar', default: 'present' })
  status: string;
}
