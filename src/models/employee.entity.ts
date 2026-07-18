import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Department } from './department.entity';
import { SalaryHistory } from './salary-history.entity';
import { AttendanceRecord } from './attendance-record.entity';
import { LeaveRequest } from './leave-request.entity';
import { Loan } from './loan.entity';
import { Advance } from './advance.entity';
import { BonusDeduction } from './bonus-deduction.entity';
import { EmploymentAssignment } from './employment-assignment.entity';
import { EmployeeDocument } from './employee-document.entity';
import { EmployeeBankAccount } from './employee-bank-account.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  employeeCode: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar', nullable: true })
  departmentId?: string;

  @Column({ type: 'varchar', nullable: true })
  employmentType?: string;

  @Column({ type: 'varchar', default: 'active' })
  workStatus: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ type: 'boolean', default: true })
  hasSocialInsurance: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.11 })
  socialInsuranceRate: number;

  @Column({ type: 'boolean', default: true })
  hasTax: boolean;

  // If set, overrides the progressive brackets with a flat rate (e.g. 0.10 = 10%)
  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  taxRate?: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  middleName?: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  gender?: string;

  @Column({ type: 'varchar', nullable: true })
  nationality?: string;

  @Column({ type: 'varchar', nullable: true })
  nationalId?: string;

  @Column({ type: 'varchar', nullable: true })
  maritalStatus?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  position?: string;

  @Column({ type: 'varchar', nullable: true })
  emergencyContactName?: string;

  @Column({ type: 'varchar', nullable: true })
  emergencyContactPhone?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Hotel, (hotel) => hotel.employees, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @ManyToOne(() => Department, (dept) => dept.employees, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(() => SalaryHistory, (sh) => sh.employee)
  salaryHistories: SalaryHistory[];

  @OneToMany(() => AttendanceRecord, (ar) => ar.employee)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => LeaveRequest, (lr) => lr.employee)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => Loan, (l) => l.employee)
  loans: Loan[];

  @OneToMany(() => Advance, (a) => a.employee)
  advances: Advance[];

  @OneToMany(() => BonusDeduction, (bd) => bd.employee)
  bonusDeductions: BonusDeduction[];

  @OneToMany(() => EmploymentAssignment, (ea) => ea.employee)
  assignments: EmploymentAssignment[];

  @OneToMany(() => EmployeeDocument, (ed) => ed.employee)
  documents: EmployeeDocument[];

  @OneToMany(() => EmployeeBankAccount, (eba) => eba.employee)
  bankAccounts: EmployeeBankAccount[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
