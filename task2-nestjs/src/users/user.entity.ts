import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  role: string; // null initially, then 'patient' or 'doctor'

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;
}