import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}
