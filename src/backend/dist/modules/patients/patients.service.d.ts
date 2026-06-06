import { PrismaService } from '../../prisma/prisma.service';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        assessments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            notes: string | null;
            scheduledAt: Date;
            questionnaireUrl: string | null;
            isPreAssessmentDone: boolean;
        }[];
    } & {
        id: string;
        maiaId: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        birthDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
