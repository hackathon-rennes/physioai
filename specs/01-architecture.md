# 01 — Architecture & navigation

## 1. Stack recommandée

La maquette est en HTML/CSS/JS pur. Pour le développement réel, recommandation :

| Couche | Recommandation | Justification |
|--------|----------------|---------------|
| **Front-end** | React 18 + TypeScript + Vite | Composants d'étape réutilisables, typage fort des données de santé |
| **UI / styling** | Tailwind CSS ou CSS Modules + design tokens | Reproduire le design system (voir `02-design-system.md`) |
| **State** | Zustand ou Redux Toolkit | État du workflow (étape courante, statut, dossier patient) |
| **Data fetching** | TanStack Query | Cache, statuts de chargement des imports/IA |
| **Back-end** | Node (NestJS) ou Python (FastAPI) | API REST/GraphQL, orchestration IA |
| **Base de données** | PostgreSQL (hébergement HDS) | Dossier patient, traçabilité, versions de bilan |
| **Stockage fichiers** | Object storage chiffré HDS | Fichiers VALD/Vitruve/Stryd, vidéos, PDF |
| **IA** | LLM via API + base de connaissances (RAG) | Pré-profil, questions, diagnostic différentiel, rédaction bilan |
| **E-mail** | Service transactionnel (ex. via prestataire HDS-compatible) | Envoi du questionnaire en amont |

> Contrainte : **tout composant manipulant des données patient doit résider dans un périmètre hébergé HDS en France**. Voir `08-conformite-rgpd-hds.md`.

---

## 2. Structure des vues

L'application se compose de **deux grandes vues** + une modale :

```
┌─ Top bar (persistante) ──────────────────────────────┐
│  Logo · [← Accueil] · pastille séance · pastille IA   │
└───────────────────────────────────────────────────────┘
│
├─ VUE 1 : ACCUEIL  (#homeView)         → route /dashboard
│    • Hero + stats
│    • Carte « Lancer une analyse »
│    • Aperçu e-mail patient
│    • Liste patients & RDV
│    └─ Modale aperçu questionnaire patient (#previewModal)
│
└─ VUE 2 : WORKFLOW (#workflowView)     → route /analyse/:patientId
     • Sidebar : dossier patient + anneau de progression + stepper 9 étapes
     • Main : 9 panneaux (un seul affiché à la fois)
```

### Mapping maquette → routes cibles

| Maquette (toggle d'affichage) | Route cible | Composant racine |
|-------------------------------|-------------|------------------|
| `#homeView` visible | `/dashboard` | `<DashboardPage>` |
| `#workflowView` visible, `goStep(n)` | `/analyse/:id/etape/:n` | `<WorkflowLayout>` + `<StepN>` |
| `#previewModal` | overlay (pas de route) ou `/dashboard?preview=:id` | `<PatientQuestionnairePreview>` |

---

## 3. Navigation & transitions

Dans la maquette, la navigation est gérée par bascule d'affichage (`display`) + classes CSS. En cible :

- **Accueil → Workflow** : `openAnalysis(patientId)` → router `push('/analyse/:id')`.
  - Charge le dossier patient, détermine l'état de l'étape 1 (pré-remplie ou à saisir).
- **Workflow → Accueil** : bouton `← Accueil` (`goHome()`) → `push('/dashboard')`.
- **Entre étapes** : `goStep(n)` → met à jour l'étape courante + l'URL.
  - **Non strictement linéaire** : on peut cliquer n'importe quelle étape du stepper.
  - La validation d'une étape (`complete(n)`) la marque « done » et propose l'étape suivante.

### États visuels d'une étape (stepper)
| État | Classe maquette | Signification |
|------|-----------------|---------------|
| À venir | `.step` | Non commencée |
| Active | `.step.active` | Affichée actuellement |
| Validée | `.step.done` | Terminée (sortie produite) |

---

## 4. Gestion de l'état (modèle cible)

```ts
interface WorkflowState {
  patientId: string;
  currentStep: number;            // 1..9
  completedSteps: Set<number>;    // équivalent du `done` JS de la maquette
  progressPct: number;            // completedSteps.size / 9 * 100
  step1Source: 'patient_amont' | 'kine_seance' | 'empty';
}
```

- L'**anneau de progression** (`#ringFill` / `#ringTxt`) = `completedSteps.size / 9`.
- Le **pré-remplissage** de l'étape 1 dépend du statut du questionnaire amont (voir `04-phase-amont.md`).

---

## 5. Layout & responsive

- **Desktop** : sidebar fixe (320 px) + zone principale (max 1180 px).
- **< 1000 px** : la sidebar du workflow est masquée (à remplacer en cible par un menu déroulant / stepper horizontal).
- **< 900 px** : la grille à 2 colonnes de l'accueil passe en 1 colonne.
- Tous les formulaires/tableaux doivent rester utilisables en tablette (usage probable en cabinet).

---

## 6. Découpage en composants (proposition)

```
<App>
├─ <TopBar />
├─ <DashboardPage>
│   ├─ <NewAnalysisCard />        // sélection patient + envoi questionnaire
│   ├─ <PatientEmailPreview />
│   ├─ <PatientList />            // tableau + statuts
│   └─ <PatientQuestionnairePreview />  // modale
└─ <WorkflowLayout>
    ├─ <PatientSidebar />         // dossier + progression + stepper
    └─ <StepRouter>
        ├─ <Step1Questionnaire />
        ├─ <Step2AIProfile />
        ├─ <Step3Interview />     // + <DiagnosticMatrix /> + <HypothesisList />
        ├─ <Step4Force /> <Step5Mobility /> <Step6Functional /> <Step7Treadmill />
        │   └─ <FileImport /> (composant générique d'import)
        ├─ <Step8Video />         // + <ObservationGrid />
        └─ <Step9Report />        // + <ReportPatient /> + <ReportExpert />
```

Composants transverses : `<FileImport>`, `<ValidationBar>` (« l'IA propose, le kiné valide »), `<Gauge>`, `<DGComparisonBar>`, `<Toast>`, `<Badge>`.
