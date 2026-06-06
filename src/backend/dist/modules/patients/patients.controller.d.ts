import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
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
