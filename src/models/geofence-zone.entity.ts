import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

export interface GeofencePoint {
  lat: number;
  lng: number;
}

@Entity('geofence_zones')
export class GeofenceZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  hotelId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'jsonb' })
  points: GeofencePoint[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @CreateDateColumn()
  createdAt: Date;
}
