import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    findAll(): Promise<({
        assessments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            notes: string | null;
            scheduledAt: Date;
            questionnaireUrl: string | null;
            isPreAssessmentDone: boolean;
            isPreProfilIADone: boolean;
            aiQuestions: string | null;
            patientId: string;
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
    findOne(id: string): Promise<{
        assessments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            notes: string | null;
            scheduledAt: Date;
            questionnaireUrl: string | null;
            isPreAssessmentDone: boolean;
            isPreProfilIADone: boolean;
            aiQuestions: string | null;
            patientId: string;
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
    }>;
}
