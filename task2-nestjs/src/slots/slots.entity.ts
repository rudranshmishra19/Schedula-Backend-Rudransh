import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Availability } from '../availability/availability.entity';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Availability)
  @JoinColumn({ name: 'availability_id' })
  availability: Availability;

  @Column()
  availability_id: number;

  @Column()
  doctor_id: number;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column()
  max_patients: number;

  @Column({ default: 0 })
  booked_count: number;

  @Column({ default: 'available' })
  status: string;

  @Column({ nullable: true })
  schedule_type: string;

  @CreateDateColumn()
  created_at: Date;
}