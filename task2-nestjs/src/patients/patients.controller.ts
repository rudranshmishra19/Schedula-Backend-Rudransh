import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('onboarding')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post('patient')
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
}