import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // HACKATHON MODE: On s'assure que le patient existe d'abord dans la DB SQLite 
    // (car Zustand envoie les ID '1', '2', '3' qui n'existent pas encore physiquement en BDD)
    await this.prisma.patient.upsert({
      where: { id: data.patientId },
      update: {},
      create: {
        id: data.patientId,
        tenantId: "hackathon-tenant",
        firstName: "Mock",
        lastName: "Patient",
        email: `mock${data.patientId}@test.com`
      }
    });

    return this.prisma.assessment.create({
      data: {
        patientId: data.patientId,
        status: data.status || 'DRAFT',
        notes: data.notes || null,
        isPreAssessmentDone: data.status === 'QUESTIONNAIRE_COMPLETED',
        scheduledAt: new Date(data.scheduledAt || Date.now()),
      },
    });
  }
}