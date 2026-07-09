import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee_documents')
export class EmployeeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  documentType: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;
}
