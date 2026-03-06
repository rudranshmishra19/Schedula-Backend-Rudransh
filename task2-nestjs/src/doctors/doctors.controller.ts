import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('onboarding')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post('doctor')
  @UseGuards(AuthGuard('jwt'))
  async onboardDoctor(@Req() req, @Body() body) {
    const userId = req.user.id;
    return this.doctorsService.onboard(userId, {
      title: body.title,
      specialization: body.specialization,
      experience_years: body.experience_years,
      achievements: body.achievements,
    });
  }
}