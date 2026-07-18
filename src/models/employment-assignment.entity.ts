import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employment_assignments')
export class EmploymentAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar', nullable: true })
  departmentId?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  employmentType?: string;

  @Column({ type: 'varchar', nullable: true })
  workStatus?: string;

  @Column({ type: 'text', nullable: true })
  transferReason?: string;

  @ManyToOne(() => Employee, (emp) => emp.assignments, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
