"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const prisma_service_1 = require("../../prisma/prisma.service");
let AssessmentsService = class AssessmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async generateAiProfil(patientId) {
        const assess = await this.prisma.assessment.findFirst({ where: { patientId }, orderBy: { createdAt: 'desc' } });
        if (!assess)
            throw new Error('Aucun bilan pour ce patient');
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new common_1.HttpException('Clé API Gemini manquante dans le backend', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash', generationConfig: { responseMimeType: "application/json" } });
            const prompt = `Tu es une IA experte en biomécanique et kinésithérapie (course à pied). 
Voici les données du questionnaire rempli par le patient : ${assess.notes}

Génère 3 à 5 questions pertinentes à poser au patient pour lever les ambiguïtés de sa déclaration et aider le kiné à affiner son diagnostic.
Les questions doivent être fermées, c'est-à-dire que le patient doit pouvoir y répondre par OUI, NON ou PEUT-ÊTRE.

Renvoie UNIQUEMENT un objet JSON (Surtout pas de markdown ou de blocs \`\`\`json) avec la structure exacte suivante :
{
  "questions": [
    { "id": "q1", "text": "Votre question ici ?", "kept": true, "isEditing": false }
  ]
}`;
            const result = await model.generateContent(prompt);
            const jsonResponse = result.response.text();
            return await this.prisma.assessment.update({
                where: { id: assess.id },
                data: {
                    isPreProfilIADone: true,
                    aiQuestions: jsonResponse
                }
            });
        }
        catch (error) {
            const msg = error?.message || JSON.stringify(error);
            console.error('[generateAiProfil] ERREUR:', msg);
            throw new common_1.HttpException(`Erreur génération IA : ${msg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map