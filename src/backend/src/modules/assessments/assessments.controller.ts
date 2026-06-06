import { Controller, Post, Body } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('v1/assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  async create(@Body() payload: any) { 
    return this.assessmentsService.create(payload);
  }
}