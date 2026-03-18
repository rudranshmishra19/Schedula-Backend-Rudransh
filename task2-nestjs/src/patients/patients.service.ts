import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    //  Check for duplicate relationship per user
    const existing = await this.patientsRepository.findOne({
      where: { 
        user: { id: userId },
        relationship: data.relationship,
      },
    });

    if (existing) {
      throw new ConflictException(`Patient with relationship "${data.relationship}" already exists for this user`);
    }

    await this.usersService.update(userId, { role: 'patient' });

    const patient = this.patientsRepository.create({
      ...data,
      user: { id: userId },  //  fixed
    });
    return this.patientsRepository.save(patient);
  }

  async getProfile(userId: number) {
    const patient = await this.patientsRepository.findOne({
      where: { user: { id: userId } },  //  fixed
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