import { Controller, Post, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post('onboarding/patient')
  @UseGuards(AuthGuard('jwt'))
  async onboardPatient(@Req() req, @Body() body) {
    const userId = req.user.id;
    return this.patientsService.onboard(userId, {
      name: body.name,
      age: body.age,
      sex: body.sex,
      weight: body.weight,
      complaint_id: body.complaint_id,
      relationship: body.relationship,
    });
  }

  @Get('patients/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return this.patientsService.getProfile(req.user.id);
  }

  @Patch('patients/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req, @Body() body) {
    return this.patientsService.updateProfile(req.user.id, body);
  }
}