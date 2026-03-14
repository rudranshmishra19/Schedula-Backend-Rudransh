import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('availability')
@UseGuards(AuthGuard('jwt'))
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post()
  async create(@Req() req, @Body() body) {
    return this.availabilityService.create(req.user.id, {
      day_of_week: body.day_of_week,
      consult_start_time: body.consult_start_time,
      consult_end_time: body.consult_end_time,
      schedule_type: body.schedule_type,
      session: body.session,
      max_patients: body.max_patients,
      slot_duration_minutes: body.slot_duration_minutes,
      is_available: body.is_available,
    }, body.month, body.year);  // 👈 pass month and year
  }

  @Get()
  async getAll(@Req() req) {
    return this.availabilityService.getAll(req.user.id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: number, @Body() body) {
    return this.availabilityService.update(req.user.id, id, body);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.availabilityService.delete(req.user.id, id);
  }

  @Post('custom')
  async createCustom(@Req() req, @Body() body) {
    return this.availabilityService.createCustom(req.user.id, {
      date: body.date,
      consult_start_time: body.consult_start_time,
      consult_end_time: body.consult_end_time,
      schedule_type: body.schedule_type,
      session: body.session,
      max_patients: body.max_patients,
      slot_duration_minutes: body.slot_duration_minutes,
      is_available: body.is_available,
    });
  }

  @Get('custom')
  async getCustom(@Req() req) {
    return this.availabilityService.getCustom(req.user.id);
  }

  @Patch('custom/:id')
  async updateCustom(@Req() req, @Param('id') id: number, @Body() body) {
    return this.availabilityService.update(req.user.id, id, body);
  }

  @Delete('custom/:id')
  async deleteCustom(@Req() req, @Param('id') id: number) {
    return this.availabilityService.delete(req.user.id, id);
  }
}