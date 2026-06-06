import { PrismaService } from '../../prisma/prisma.service';
export declare class AssessmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        status: string;
        notes: string | null;
        scheduledAt: Date;
        questionnaireUrl: string | null;
        isPreAssessmentDone: boolean;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
    }>;
}
