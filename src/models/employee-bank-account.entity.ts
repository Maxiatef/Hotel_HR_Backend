import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_bank_accounts')
export class EmployeeBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar' })
  bankName: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({ type: 'varchar', nullable: true })
  iban?: string;

  @ManyToOne(() => Employee, (emp) => emp.bankAccounts, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;
}
