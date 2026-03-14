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

  const [startHour, startMin] = availability.consult_start_time.split(':').map(Number);
  const [endHour, endMin] = availability.consult_end_time.split(':').map(Number);

  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;
  const duration = availability.slot_duration_minutes;

  let patientsAssigned = 0;  //  track total patients assigned

  for (let current = startTotal; current < endTotal; current += duration) {
    
    //  Stop if total_patients reached (for WAVE)
    if (availability.schedule_type === 'WAVE' && 
        availability.total_patients &&
        patientsAssigned >= availability.total_patients) {
      break;
    }

    //  For WAVE: last slot might get fewer patients
    const remainingPatients = availability.total_patients 
      ? availability.total_patients - patientsAssigned 
      : availability.max_patients;
      
    const slotMaxPatients = availability.schedule_type === 'WAVE'
      ? Math.min(availability.max_patients, remainingPatients)
      : availability.max_patients;  // STREAM always 1

    const slotStart = this.minutesToTime(current);
    const slotEnd = this.minutesToTime(current + duration);

    const slot = this.slotsRepository.create({
      availability_id: availability.id,
      doctor_id: availability.doctor.id,
      start_time: slotStart,
      end_time: slotEnd,
      max_patients: availability.schedule_type === 'STREAM' ? 1: slotMaxPatients,  //  correct per slot
      booked_count: 0,
      status: 'available',
      schedule_type: availability.schedule_type,
    });

    patientsAssigned += slotMaxPatients;  //  track assigned
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
  async deleteSlotsByAvailability(availabilityId: number): Promise<void> {
  await this.slotsRepository.delete({ availability_id: availabilityId });
}
}