import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.assessment.create({
      data: {
        patientId: data.patientId,
        scheduledAt: new Date(data.scheduledAt || Date.now()),
      },
    });
  }
}