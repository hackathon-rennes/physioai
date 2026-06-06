import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    if (!patient) throw new NotFoundException('Patient non trouvé');
    return patient;
  }
}