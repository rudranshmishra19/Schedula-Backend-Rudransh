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

  @Column()
  user_id: number;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column()
  doctor_id: number;

  @Column({ nullable: true })
  day_of_week: string;

  @Column({ nullable: true, type: 'date' })
  specific_date: string;

  @Column({ type: 'time' })
  consult_start_time: string;

  @Column({ type: 'time' })
  consult_end_time: string;

  @Column()
  schedule_type: string;

  @Column({ nullable: true })
  session: string;

  @Column()
  max_patients: number;

  @Column()
  slot_duration_minutes: number;

  @Column({ default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;
}