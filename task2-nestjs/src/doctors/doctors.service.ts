import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private usersService: UsersService,
  ) {}

  async onboard(userId: number, data: Partial<Doctor>) {
    // Assign doctor role to user
    await this.usersService.update(userId, { role: 'doctor' });

    // Create doctor profile with pending status
    const doctor = this.doctorsRepository.create({
      ...data,
      user_id: userId,
      status: 'pending',
    });

    return this.doctorsRepository.save(doctor);
  }
}