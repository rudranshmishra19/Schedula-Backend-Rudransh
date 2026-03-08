import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slots.entity'; 
import { Availability } from '../availability/availability.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotsRepository: Repository<Slot>,
  ) {}

  async generateSlots(availability: Availability): Promise<Slot[]> {
    const slots: Slot[] = [];

    const [startHour, startMin] = availability.consult_start_time
      .split(':')
      .map(Number);
    const [endHour, endMin] = availability.consult_end_time
      .split(':')
      .map(Number);

    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    const duration = availability.slot_duration_minutes;

    for (let current = startTotal; current < endTotal; current += duration) {
      const slotStart = this.minutesToTime(current);
      const slotEnd = this.minutesToTime(current + duration);

      const slot = this.slotsRepository.create({
        availability_id: availability.id,
        doctor_id: availability.doctor_id,
        start_time: slotStart,
        end_time: slotEnd,
        max_patients: availability.max_patients,
        booked_count: 0,
        status: 'available',
        schedule_type: availability.schedule_type,
      });

      slots.push(slot);
    }

    return this.slotsRepository.save(slots);
  }

  private minutesToTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  }

  async getSlotsByAvailability(availabilityId: number): Promise<Slot[]> {
    return this.slotsRepository.find({
      where: { availability_id: availabilityId },
    });
  }

  async getSlotsByDoctor(doctorId: number): Promise<Slot[]> {
    return this.slotsRepository.find({
      where: { doctor_id: doctorId },
    });
  }
}