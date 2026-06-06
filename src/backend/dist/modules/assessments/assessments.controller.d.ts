import { AssessmentsService } from './assessments.service';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    create(payload: any): Promise<{
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
