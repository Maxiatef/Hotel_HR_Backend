import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PayrollPeriod } from './payroll-period.entity';
import { PayrollItem } from './payroll-item.entity';

@Entity('payroll_runs')
export class PayrollRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar' })
  payrollPeriodId: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  runAt: Date;

  @Column({ type: 'varchar', default: 'draft' })
  status: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalGross: number;

  @ManyToOne(() => PayrollPeriod, (pp) => pp.payrollRuns, { nullable: false })
  @JoinColumn({ name: 'payrollPeriodId' })
  payrollPeriod: PayrollPeriod;

  @OneToMany(() => PayrollItem, (item) => item.payrollRun)
  items: PayrollItem[];

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalNet: number;
}
