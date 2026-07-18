import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('advances')
export class Advance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  employeeId: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  requestDate: Date;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @ManyToOne(() => Employee, (emp) => emp.advances, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
