import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('patients')
@Unique(['user', 'relationship'])
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  complaint_id: number;

  @Column({ nullable: true })
  relationship: string; // self / wife / son / etc

  @CreateDateColumn()
  created_at: Date;
}