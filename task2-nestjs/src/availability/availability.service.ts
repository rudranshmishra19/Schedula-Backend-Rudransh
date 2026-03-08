import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './availability.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { SlotsService } from '../slots/slots.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private doctorsService: DoctorsService,
    private slotsService: SlotsService,
  ) {}

  async create(userId: number, data: Partial<Availability>) {
    const doctor = await this.doctorsService.getProfile(userId);
    const availability = this.availabilityRepository.create({
      ...data,
      doctor_id: doctor.id,
      user_id: userId,
    });
    const saved = await this.availabilityRepository.save(availability);
    const slots = await this.slotsService.generateSlots(saved);
    return { ...saved, generatedSlots: slots };
  }

  async getAll(userId: number) {
    const doctor = await this.doctorsService.getProfile(userId);
    return this.availabilityRepository.find({
      where: { doctor_id: doctor.id },
    });
  }

  async update(userId: number, id: number, data: Partial<Availability>) {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    await this.availabilityRepository.update(id, data);
    return this.availabilityRepository.findOne({ where: { id } });
  }

  async delete(userId: number, id: number) {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    await this.availabilityRepository.delete(id);
    return { message: 'Availability deleted successfully' };
  }

  async createCustom(userId: number, data: Partial<Availability>) {
    const doctor = await this.doctorsService.getProfile(userId);
    const availability = this.availabilityRepository.create({
      ...data,
      doctor_id: doctor.id,
      user_id: userId,
    });
    const saved = await this.availabilityRepository.save(availability);
    const slots = await this.slotsService.generateSlots(saved);
    return { ...saved, generatedSlots: slots };
  }

  async getCustom(userId: number) {
    const doctor = await this.doctorsService.getProfile(userId);
    return this.availabilityRepository.find({
      where: { doctor_id: doctor.id },
    });
  }
}