import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  employeeId?: string;

  @Column({ type: 'varchar', default: 'hr' })
  role: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.users, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @CreateDateColumn()
  createdAt: Date;
}
