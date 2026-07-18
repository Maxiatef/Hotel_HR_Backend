import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  principalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  remainingAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthlyInstallment: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @ManyToOne(() => Employee, (emp) => emp.loans, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
