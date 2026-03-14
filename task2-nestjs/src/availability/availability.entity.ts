import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })  // ✅ added onDelete
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ nullable: true, type: 'simple-array' })
  day_of_week: string[];

  @Column({ nullable: true, type: 'date' })
  date: string;

  @Column({ type: 'time' })
  consult_start_time: string;

  @Column({ type: 'time' })
  consult_end_time: string;

  @Column()
  schedule_type: string;

  @Column({ nullable: true })
  session: string;

  @Column({ default: 1 })
  max_patients: number;

  @Column({ nullable: true })
  total_patients: number;

  @Column()
  slot_duration_minutes: number;

  @Column({ default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;
}