import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experience_years: number;

  @Column({ nullable: true })
  achievements: string;

  @Column({ default: 'pending' })
  status: string; // pending / active / inactive

  @CreateDateColumn()
  created_at: Date;
}