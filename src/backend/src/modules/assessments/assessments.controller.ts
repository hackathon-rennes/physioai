import { Controller, Post, Body, Param } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('v1/assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  async create(@Body() payload: any) { 
    return this.assessmentsService.create(payload);
  }

  @Post(':id/generate-ai-profil')
  async generateAiProfil(@Param('id') id: string) {
    return this.assessmentsService.generateAiProfil(id);
  }
}
