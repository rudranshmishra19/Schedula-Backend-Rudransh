import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { AuthGuard } from '@nestjs/passport';
import { DoctorsService } from '../doctors/doctors.service';

@Controller('slots')
@UseGuards(AuthGuard('jwt'))
export class SlotsController {
  constructor(
    private slotsService: SlotsService,
    private doctorsService: DoctorsService,
  ) {}

  @Get('availability/:availabilityId')
  async getSlotsByAvailability(@Param('availabilityId') availabilityId: number) {
    return this.slotsService.getSlotsByAvailability(availabilityId);
  }

  @Get('doctor')
  async getSlotsByDoctor(@Req() req) {
    const doctor = await this.doctorsService.getProfile(req.user.id);
    return this.slotsService.getSlotsByDoctor(doctor.id);
  }
}