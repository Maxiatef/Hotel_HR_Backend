import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_documents')
export class EmployeeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar' })
  documentType: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl?: string;

  @ManyToOne(() => Employee, (emp) => emp.documents, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;
}
