# Plan d'Approbation Backend — PhysioAI (PhysioRunningLab)

## 1. Architecture des dossiers NestJS (Architecture Hexagonale)
L'application sera découpée en modules métiers indépendants, chacun respectant une séparation stricte en 4 couches (Domain, Application, Infrastructure, Presentation).

`	ext
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/     # CurrentUser, Roles...
│   ├── filters/        # Exception filters (Global error handling)
│   ├── guards/         # Azure Entra ID B2C JwtAuthGuard
│   ├── interceptors/   # Logging, Serialization
│   └── pipes/          # Zod / Class-validator pipes
├── config/             # Zod validation env (DATABASE_URL, JWT_SECRET, AZURE_*)
└── modules/
    ├── patients/       # Gestion des coureurs/patients
    ├── assessments/    # Gestion des bilans physiques et sessions
    ├── videos/         # Collecte et stockage des vidéos (liens Azure Blob)
    └── ai-analysis/    # Analyse vidéo et génération des recommandations via MS Foundry
        ├── domain/
        │   ├── entities/          # Entités pure (ex: AnalysisResult)
        │   ├── value-objects/     # (ex: JointAngle)
        │   └── ports/             # Interfaces (ex: IAiEnginePort, IAnalysisRepository)
        ├── application/
        │   └── use-cases/         # ex: AnalyzeRunningStrideUseCase
        ├── infrastructure/
        │   ├── persistence/       # Prisma adaptors
        │   └── ai-provider/       # Microsoft Foundry API adaptors
        └── presentation/
            ├── controllers/       # REST endpoints
            └── dto/               # Inputs/Outputs validés avec class-validator
`

## 2. Modèle de données Prisma (PostgreSQL)
Voici la modélisation principale des entités pour les patients et bilans.

`prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Patient {
  id        String   @id @default(cuid())
  tenantId  String   @map("tenant_id") // Pour Azure B2C
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  email     String   @unique
  birthDate DateTime? @map("birth_date")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  assessments Assessment[]

  @@index([tenantId])
  @@map("patients")
}

model Assessment {
  id          String   @id @default(cuid())
  patientId   String   @map("patient_id")
  status      AssessmentStatus @default(DRAFT)
  notes       String?
  scheduledAt DateTime @map("scheduled_at")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  patient     Patient  @relation(fields: [patientId], references: [id])
  videos      Video[]
  report      Report?

  @@index([patientId])
  @@map("assessments")
}

model Video {
  id           String   @id @default(cuid())
  assessmentId String   @map("assessment_id")
  blobUrl      String   @map("blob_url")
  viewType     String   // FRONT, BACK, SIDE_LEFT, SIDE_RIGHT
  status       VideoStatus @default(UPLOADED) // UPLOADED, ANALYZING, COMPLETED, ERROR
  createdAt    DateTime @default(now()) @map("created_at")

  assessment   Assessment @relation(fields: [assessmentId], references: [id])

  @@index([assessmentId])
  @@map("videos")
}

model Report {
  id           String   @id @default(cuid())
  assessmentId String   @unique @map("assessment_id")
  aiMetrics    Json     @map("ai_metrics") // Biomécanique extraite par MS Foundry
  recommendations Json  // Plan d'action renvoyé par le LLM
  pdfUrl       String?  @map("pdf_url")
  createdAt    DateTime @default(now()) @map("created_at")

  assessment   Assessment @relation(fields: [assessmentId], references: [id])

  @@map("reports")
}

enum AssessmentStatus {
  DRAFT
  VIDEOS_PENDING
  ANALYSIS_IN_PROGRESS
  COMPLETED
}

enum VideoStatus {
  UPLOADED
  ANALYZING
  COMPLETED
  ERROR
}
`

## 3. APIs prévues (REST via NestJS Swagger)
Toutes les routes métier nécessiteront une authentification Azure Entra ID.

**Système**
*   GET /health - Santé de l'API
*   GET /ready - Vérifie connexion DB et Redis/Bus
*   GET /live - Liveness probe Kubernetes/ACA

**Patients**
*   POST /v1/patients - Créer un patient (lié au B2C ID)
*   GET /v1/patients - Lister les patients (avec pagination/cursor)
*   GET /v1/patients/:id - Détails d'un patient

**Bilans (Assessments)**
*   POST /v1/patients/:patientId/assessments - Initier un bilan
*   GET /v1/assessments/:id - Statut et détail d'un bilan
*   PATCH /v1/assessments/:id/status - Mettre à jour le statut

**Vidéos (Collecte)**
*   POST /v1/assessments/:assessmentId/videos/upload-url - Générer une SAS URL Azure Blob pour l'upload front-end
*   POST /v1/assessments/:assessmentId/videos - Confirmer l'upload et intégrer en base
*   POST /v1/videos/:id/analyze - Déclencher l'analyse IA (asynchrone via BullMQ)

**Rapports & IA**
*   GET /v1/assessments/:assessmentId/report - Récupérer les données brutes de l'IA et conseils
*   POST /v1/assessments/:assessmentId/report/generate-pdf - Générer/Compiler l'ADR final

## 4. Intégration AI (Microsoft Foundry) et Auth (Azure Entra ID B2C)

### Sécurité & Auth (Azure Entra ID B2C)
*   **Implémentation :** Utilisation de passport-jwt.
*   **Flux :** Le Front-end gère le login avec Azure B2C et récupère un Access Token (JWT). Le backend valide la signature du JWT via l'URL JWKS exposée par Azure B2C.
*   **NestJS :** Création d'un JwtStrategy qui injectera le profil de l'utilisateur (	enantId, oles) dans eq.user. Un global ou module-scoped @UseGuards(JwtAuthGuard) protégera les endpoints.

### Intégration IA (Microsoft Foundry)
*   **Asynchronisme (BullMQ) :** Le traitement vidéo étant lourd, l'endpoint d'analyse ajoutera une tâche dans une file Azure Service Bus ou Redis via BullMQ. L'utilisateur recevra un status 202 Accepted.
*   **Adapter Pattern :** L'appel aux APIs Microsoft Foundry (Vision / ML) sera encapsulé dans un adaptateur de la couche Infrastructure (FoundryAiService implements IAiEnginePort).
*   **Traitement :**
    1. Récupération de la vidéo blob.
    2. Appel de Microsoft Foundry pour extraire la cinématique (angles, temps de contact, asymétries).
    3. LLM/Foundry prompt pour le plan de recommandation basé sur les métriques biomécaniques.
    4. Enregistrement des données JSON (aiMetrics & recommendations) dans l'entité Report.
    5. Emission d'un évènement de domaine (ReportGeneratedEvent) pour notifier le front-end (WebSocket/SSE) ou envoyer un email.