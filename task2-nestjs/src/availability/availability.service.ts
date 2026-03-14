import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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

  private calculateSessionMinutes(data: Partial<Availability>): number {
    if (!data.consult_start_time || !data.consult_end_time) {
      throw new BadRequestException('consult_start_time and consult_end_time are required');
    }
    const [startH, startM] = data.consult_start_time.split(':').map(Number);
    const [endH, endM] = data.consult_end_time.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  }

  private calculateSlotData(data: Partial<Availability>): { total_patients: number, slot_duration_minutes: number } {
    if (!data.max_patients) {
      throw new BadRequestException('max_patients is required');
    }
    const sessionMinutes = this.calculateSessionMinutes(data);

    if (data.schedule_type === 'STREAM') {
      const slot_duration_minutes = sessionMinutes / data.max_patients;
      return { total_patients: data.max_patients, slot_duration_minutes };
    } else if (data.schedule_type === 'WAVE') {
      if (!data.slot_duration_minutes) {
        throw new BadRequestException('slot_duration_minutes is required for WAVE schedule');
      }
      const numberOfSlots = Math.floor(sessionMinutes / data.slot_duration_minutes);
      const total_patients = numberOfSlots * data.max_patients;
      return { total_patients, slot_duration_minutes: data.slot_duration_minutes };
    }
    throw new BadRequestException('schedule_type must be STREAM or WAVE');
  }

  private getDatesForDayInMonth(dayName: string, month: number, year: number): string[] {
    const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const targetDay = dayMap[dayName];
    if (targetDay === undefined) {
      throw new BadRequestException(`Invalid day_of_week: ${dayName}`);
    }

    const dates: string[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === targetDay) {
        const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dates.push(formatted);
      }
    }
    return dates;
  }

  async create(userId: number, data: Partial<Availability>, month?: number, year?: number) {
    const doctor = await this.doctorsService.getProfile(userId);
    const { total_patients, slot_duration_minutes } = this.calculateSlotData(data);

    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    if (!data.day_of_week || data.day_of_week.length === 0) {
      throw new BadRequestException('day_of_week array is required');
    }

    const results: any[] = [];

    for (const dayName of data.day_of_week) {
      const dates = this.getDatesForDayInMonth(dayName, targetMonth, targetYear);

      for (const date of dates) {
        const existing = await this.availabilityRepository.findOne({
          where: { doctor: { id: doctor.id }, date: date },
        });

        if (existing) {
          throw new ConflictException(`Availability for ${dayName} on ${date} already exists. Use custom availability to override.`);
        }

        const availability = this.availabilityRepository.create({
          ...data,
          doctor: { id: doctor.id },
          day_of_week: [dayName],
          date: date,
          total_patients,
          slot_duration_minutes,
          max_patients: data.max_patients,
        });

        const saved = await this.availabilityRepository.save(availability);
        const slots = await this.slotsService.generateSlots(saved);
        results.push({ ...saved, generatedSlots: slots });
      }
    }

    return {
      message: `Created ${results.length} availability records`,
      data: results,
    };
  }

  async getAll(userId: number) {
    const doctor = await this.doctorsService.getProfile(userId);
    const availability = await this.availabilityRepository.find({
      where: { doctor: { id: doctor.id } },
      order: { date: 'ASC' },
    });

    // Add doctor_id to each record
    return availability.map(a => ({
      ...a,
      doctor_id: doctor.id,
    }));
  }

  async update(userId: number, id: number, data: Partial<Availability>) {
    const availability = await this.availabilityRepository.findOne({ where: { id } });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    await this.availabilityRepository.update(id, data);
    return this.availabilityRepository.findOne({ where: { id } });
  }

  async delete(userId: number, id: number) {
    const availability = await this.availabilityRepository.findOne({ where: { id } });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    await this.availabilityRepository.delete(id);
    return { message: 'Availability deleted successfully' };
  }

  async createCustom(userId: number, data: Partial<Availability>) {
    const doctor = await this.doctorsService.getProfile(userId);
    const { total_patients, slot_duration_minutes } = this.calculateSlotData(data);

    if (!data.date) {
      throw new BadRequestException('date is required for custom availability');
    }

    const existing = await this.availabilityRepository.findOne({
      where: { doctor: { id: doctor.id }, date: data.date },
    });

    if (existing) {
      await this.slotsService.deleteSlotsByAvailability(existing.id);
      await this.availabilityRepository.delete(existing.id);
    }

    const availability = this.availabilityRepository.create({
      ...data,
      doctor: { id: doctor.id },
      total_patients,
      slot_duration_minutes,
      max_patients: data.max_patients,
    });

    const saved = await this.availabilityRepository.save(availability);
    const slots = await this.slotsService.generateSlots(saved);
    return { ...saved, generatedSlots: slots };
  }

  async getCustom(userId: number) {
    const doctor = await this.doctorsService.getProfile(userId);
    const availability = await this.availabilityRepository.find({
      where: { doctor: { id: doctor.id } },
      order: { date: 'ASC' },
    });

    //  Add doctor_id here too
    return availability.map(a => ({
      ...a,
      doctor_id: doctor.id,
    }));
  }
}