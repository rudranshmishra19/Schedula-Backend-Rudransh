import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,  ///
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('doctors')
@Unique(['user']) // this one
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User,{onDelete: 'CASCADE', eager:false })
  @JoinColumn({ name: 'user_id' })
  user: User;

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