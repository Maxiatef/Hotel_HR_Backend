import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('bonus_deductions')
export class BonusDeduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar', nullable: true })
  payrollPeriodId?: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', default: 'approved' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @ManyToOne(() => Employee, (emp) => emp.bonusDeductions, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
