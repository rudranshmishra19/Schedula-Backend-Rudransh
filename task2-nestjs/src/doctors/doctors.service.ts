import { Injectable, NotFoundException } from '@nestjs/common';
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
    await this.usersService.update(userId, { role: 'doctor' });
    const doctor = this.doctorsRepository.create({
      ...data,
      user_id: userId,
      status: 'pending',
    });
    return this.doctorsRepository.save(doctor);
  }
async getProfile(userId: number) {
  const doctor = await this.doctorsRepository.findOne({
    where: { user_id: userId },
    order: { created_at: 'DESC' },
  });
  if (!doctor) {
    throw new NotFoundException('Doctor profile not found');
  }
  return doctor;
}

  async updateProfile(userId: number, data: Partial<Doctor>) {
    const doctor = await this.getProfile(userId);
    await this.doctorsRepository.update(doctor.id, data);
    return this.getProfile(userId);
  }
}