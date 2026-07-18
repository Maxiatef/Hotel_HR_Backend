import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Employee } from './employee.entity';
import { Department } from './department.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (user) => user.hotel)
  users: User[];

  @OneToMany(() => Employee, (emp) => emp.hotel)
  employees: Employee[];

  @OneToMany(() => Department, (dept) => dept.hotel)
  departments: Department[];
}
