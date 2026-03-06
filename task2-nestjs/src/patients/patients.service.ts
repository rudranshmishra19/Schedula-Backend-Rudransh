import { Injectable } from '@nestjs/common';
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
    // Assign patient role to user
    await this.usersService.update(userId, { role: 'patient' });

    // Create patient profile
    const patient = this.patientsRepository.create({
      ...data,
      user_id: userId,
    });

    return this.patientsRepository.save(patient);
  }
}