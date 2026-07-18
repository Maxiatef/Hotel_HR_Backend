import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { PayrollRun } from './payroll-run.entity';

@Entity('payroll_periods')
export class PayrollPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'varchar', default: 'open' })
  status: string;

  @OneToMany(() => PayrollRun, (pr) => pr.payrollPeriod)
  payrollRuns: PayrollRun[];

  @CreateDateColumn()
  createdAt: Date;
}
