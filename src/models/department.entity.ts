import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Employee } from './employee.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Hotel, (hotel) => hotel.departments, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @OneToMany(() => Employee, (emp) => emp.department)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;
}
