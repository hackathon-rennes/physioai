import { Controller, Get } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('v1/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }
}