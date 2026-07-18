import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('salary_history')
export class SalaryHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  housingAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  transportationAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otherFixedAllowance: number;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo?: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @ManyToOne(() => Employee, (emp) => emp.salaryHistories, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
