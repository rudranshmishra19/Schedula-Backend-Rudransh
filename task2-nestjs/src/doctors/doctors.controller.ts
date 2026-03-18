import { Controller, Post, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post('onboarding/doctor')
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

  @Get('doctors/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return this.doctorsService.getProfile(req.user.id);
  }

  @Patch('doctors/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req, @Body() body) {
    return this.doctorsService.updateProfile(req.user.id, body);
  }
}