import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private usersService: UsersService,
  ) {}

  async onboard(userId: number, data: Partial<Patient>) {
    await this.usersService.update(userId, { role: 'patient' });
    const patient = this.patientsRepository.create({
      ...data,
      user_id: userId,
    });
    return this.patientsRepository.save(patient);
  }

  async getProfile(userId: number) {
    const patient = await this.patientsRepository.findOne({
      where: { user_id: userId },
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async updateProfile(userId: number, data: Partial<Patient>) {
    const patient = await this.getProfile(userId);
    await this.patientsRepository.update(patient.id, data);
    return this.getProfile(userId);
  }
}