import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee_bank_accounts')
export class EmployeeBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  bankName: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({ type: 'varchar', nullable: true })
  iban?: string;

  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;
}
