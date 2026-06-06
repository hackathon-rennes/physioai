import { PrismaService } from '../../prisma/prisma.service';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    }[]>;
}
