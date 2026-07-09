import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}
