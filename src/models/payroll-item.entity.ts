import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PayrollRun } from './payroll-run.entity';

@Entity('payroll_items')
export class PayrollItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  payrollRunId: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  fixedAllowances: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonusTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductionTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  overtimeTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  leaveDeductionTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  loanDeductionTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  advanceDeductionTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  socialInsuranceTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  totalHoursWorked: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  totalOvertimeHours: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netSalary: number;

  @ManyToOne(() => PayrollRun, (pr) => pr.items, { nullable: false })
  @JoinColumn({ name: 'payrollRunId' })
  payrollRun: PayrollRun;

  @CreateDateColumn()
  createdAt: Date;
}
