import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

  async generateAiProfil(patientId: string) {
    const assess = await this.prisma.assessment.findFirst({ where: { patientId }, orderBy: { createdAt: 'desc' } });
    if (!assess) throw new Error('Aucun bilan pour ce patient');

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new HttpException('Clé API Gemini manquante dans le backend', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
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

      // Enregistrement en base de données
      return await this.prisma.assessment.update({
        where: { id: assess.id },
        data: { 
          isPreProfilIADone: true,
          aiQuestions: jsonResponse
        }
      });
    } catch (error) {
      const msg = error?.message || JSON.stringify(error);
      console.error('[generateAiProfil] ERREUR:', msg);
      throw new HttpException(`Erreur génération IA : ${msg}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
