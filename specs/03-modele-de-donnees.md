# 03 — Modèle de données

Schémas indicatifs (TypeScript) dérivés de la maquette et de la spécification. À affiner avec le kiné pour les champs obligatoires/optionnels et les unités.

---

## 1. Vue d'ensemble des entités

```
Patient ──< AnalyseDeCourse ──┬── Questionnaire (étape 1)
                              ├── ProfilIA (étape 2)
                              ├── Interview + DiagnosticDifferentiel (étape 3)
                              ├── TestForce (étape 4)        ┐
                              ├── TestMobilite (étape 5)     ├─ via ImportFichier
                              ├── TestFonctionnel (étape 6)  │
                              ├── AnalyseTapis (étape 7)     ┘
                              ├── ObservationVideo (étape 8)
                              └── Bilan (étape 9, 2 versions, versionné)

FichePathologie (base de connaissances)  — référentiel transverse
PreconisationLibrary (exercices/drills)  — référentiel transverse
JournalAction (traçabilité)              — transverse
Consentement (RGPD)                      — rattaché au Patient
```

---

## 2. Patient

Source : **Maia** (dossier existant). Les données d'identité proviennent de Maia ; l'application n'est pas la source de vérité du dossier administratif.

```ts
interface Patient {
  id: string;
  maiaRef: string;          // référence dossier Maia
  initials: string;         // ex. "SD" (avatar)
  firstName: string;
  lastName: string;
  email: string;            // saisi/vérifié au lancement de l'analyse
  birthDateOrAge: number;   // 34
  sex: 'F' | 'H' | 'autre';
  club?: string;
  // attributs course (pré-affichés en sidebar)
  discipline: string;       // "Trail / route"
  weeklyVolumeKm: number;   // 45
  objective: string;        // "Ultra 50 km"
  minimalistIndexPct?: number; // 78
  knownHistory?: string;    // "Genou D."
}
```

---

## 3. AnalyseDeCourse (agrégat racine)

```ts
type StepStatus = 'pending' | 'active' | 'done' | 'skipped';

interface AnalyseDeCourse {
  id: string;
  patientId: string;
  rdv: string;              // date/heure du RDV (depuis Maia)
  createdAt: string;
  status: 'created' | 'in_progress' | 'report_published';
  steps: Record<1|2|3|4|5|6|7|8|9, StepStatus>;
  questionnaireAmont: QuestionnaireAmont;  // suivi de l'envoi (phase amont)
}
```

### Suivi du questionnaire amont (phase amont)
```ts
interface QuestionnaireAmont {
  status: 'none' | 'sent' | 'in_progress' | 'completed'; // ↔ qb-none/sent/prog/done
  sentAt?: string;
  completedAt?: string;
  channel: 'email';
  secureLinkId?: string;     // lien personnel sécurisé envoyé au patient
}
```
> Correspondance maquette : champ `q` de l'objet `PATIENTS[]` (`'none'|'sent'|'prog'|'done'`).

---

## 4. Étape 1 — Questionnaire général

5 blocs. Logique conditionnelle indiquée.

```ts
interface Questionnaire {
  source: 'patient_amont' | 'kine_seance';
  // Bloc 1 — Profil & morphologie
  sex: 'F' | 'H' | 'autre';
  age: number;
  heightCm: number;
  weightKg: number;
  club?: string;
  // Bloc 2 — Pratique de course
  yearsRunning: number;
  weeklyVolumeKm: number;
  speciality: string;
  recentTrainingChanges?: string;
  // Bloc 3 — Équipement
  shoes?: string;
  minimalistIndexPct?: number;
  orthotics: boolean;
  orthoticsAgeIfYes?: string;      // conditionnel si orthotics = true
  orthoticsReasonIfYes?: string;   // conditionnel
  // Bloc 4 — Antécédents
  medicalHistory?: string;
  runningInjury: boolean;
  injuryDetailsIfYes?: {           // conditionnel si runningInjury = true
    zone: string; date: string; status: 'en_cours' | 'recupere' | 'recidive';
  }[];
  // Bloc 5 — Attentes
  expectations: string;            // texte libre
  // méta
  draftSaved: boolean;             // sauvegarde progressive
}
```

**Règles de validation** : champs typés ; obligatoires/optionnels à valider avec le kiné ; champs conditionnels dépliés uniquement si la réponse déclenche (orthèses « oui », blessure « oui »). **Sortie : profil coureur normalisé.**

---

## 5. Étape 2 — Profil IA

```ts
interface ProfilIA {
  preProfile: {
    summary: string;        // ex. "Coureuse trail confirmée, charge ↑ rapide"
    signals: string[];      // signaux d'alerte
    interviewAxes: string[];
  };
  suggestedQuestions: SuggestedQuestion[];
}
interface SuggestedQuestion {
  id: string;
  text: string;             // éditable par le kiné
  context: string;          // justification de la suggestion
  state: 'proposed' | 'kept' | 'removed' | 'added_by_kine';
}
```
> Sortie : **trame d'interview personnalisée** = questions `kept` + `added_by_kine`.

---

## 6. Étape 3 — Interview & diagnostic différentiel

```ts
interface Interview {
  notes: string;            // prise de notes assistée IA
  injuryDetected: boolean;  // branche décisionnelle oui/non
  diagnostic?: DiagnosticDifferentiel;
}

interface DiagnosticDifferentiel {
  ficheId: string;          // FichePathologie utilisée (zone/motif)
  hypotheses: Hypothesis[];
}
interface Hypothesis {
  pathology: string;
  scorePct: number;             // classement IA
  contributingSigns: string[];  // traçabilité
  kineDecision: 'pending' | 'validated' | 'rejected';
}
```

### FichePathologie (base de connaissances)
Format **unique et homogène** pour ingestion par l'IA (RAG). Voir `06-integrations.md`.
```ts
interface FichePathologie {
  id: string;
  zone: string;                 // "Douleur genou latéral"
  source: string;               // ex. "La Clinique Du Coureur"
  pathologies: string[];        // colonnes (candidates)
  signs: {
    section: 'histoire_subjectif' | 'examen_objectif';
    label: string;              // ex. "Test de Noble"
    weights: Record<string, Ordinal>;  // pathologie -> pondération
    note?: string;              // ex. "+ plus si genou à 30°"
  }[];
  maintainedBy: 'kine';         // gouvernance clinique
}
type Ordinal = '---' | '--' | '-' | '0' | '+' | '++' | '+++';
```
> Mapping visuel des pondérations : `.w.mm`(--/---), `.w.m`(-), `.w.z`(0), `.w.p`(+), `.w.pp`(++/+++).

---

## 7. Étapes 4–7 — Tests (données capteurs)

Toutes alimentées par **import de fichier** (CSV/FIT) pour le MVP.

```ts
interface ImportFichier {
  step: 4 | 5 | 6 | 7;
  filename: string;
  format: 'CSV' | 'FIT';
  source: 'VALD' | 'Vitruve' | 'Stryd';
  patientId: string;        // l'import est rattaché au test en cours → au patient
  uploadedAt: string;
  parsedMetrics: Record<string, MetricDG | number>;
}
interface MetricDG {        // mesure latéralisée
  right: number; left: number; norm?: number | string; asymmetryPct?: number;
  flag: 'ok' | 'warn' | 'bad';
}
```

| Étape | Source | Exemples de métriques (sortie) |
|-------|--------|-------------------------------|
| 4 Force | VALD (ForceFrame/NordBord) | quadriceps, ischios, moyen fessier, ratio I/Q, asymétries |
| 5 Mobilité | VALD (ForceFrame/HumanTrak) | dorsiflexion, extension hanche, rotation interne, amplitudes |
| 6 Fonctionnel | Vitruve | CMJ, single-leg hop (LSI), puissance W/kg, profil charge-vitesse |
| 7 Tapis | Stryd | puissance, cadence, GCT D/G, oscillation verticale, LSS, longueur de foulée |

> Le **protocole de test peut être adapté** selon le diagnostic différentiel de l'étape 3.

---

## 8. Étape 8 — Observation vidéo

```ts
interface ObservationVideo {
  views: ('frontale' | 'sagittale_g' | 'sagittale_d')[];
  timeMarkers: { tMs: number; capture?: string; note?: string }[];
  grid: ObservationItem[];   // grille standardisée
}
interface ObservationItem {
  label: ObsLabel;
  score: 'normal' | 'a_surveiller' | 'anormal';  // feu vert/orange/rouge
}
type ObsLabel =
  | "Inclinaison du tronc" | "Stabilité du bassin" | "Valgus dynamique"
  | "Flexion du genou" | "Pronation du pied" | "Déplacement vertical"
  | "Verticalité du tibia" | "Type de pose de pied" | "Cadence" | "Bruit";
```
> MVP : **saisie manuelle** par le kiné, pas de pose estimation automatisée.

---

## 9. Étape 9 — Bilan (versionné)

```ts
interface Bilan {
  id: string;
  analyseId: string;
  version: number;                 // traçabilité des versions
  status: 'draft' | 'validated' | 'published';
  patientReport: PatientReport;    // synthétique / pédagogique
  expertReport: ExpertReport;      // analytique / données brutes
  validatedBy?: string;            // kiné
  publishedAt?: string;
  pdfUrl?: string;
}
interface PatientReport {
  keyMessage: string;
  gauges: { label: string; pct: number; value: string; tag: string; flag: 'ok'|'warn'|'bad' }[];
  meaning: string;                 // "ce que ça veut dire"
  action: string;                  // "ce qu'on fait"
  actionPlan: { priority: 1|2|3; title: string; detail: string; when: string }[];
  painScale: true;                 // échelle 0-2 / 3-4 / 5+
}
interface ExpertReport {
  retainedHypothesis: string;
  metrics: Record<string, MetricDG | number>;
  dgComparisons: { label: string; right: number; left: number; norm: number }[];
  technicalRecommendations: { tag: string; title: string; detail: string; when: string }[];
}
```

---

## 10. Référentiels & traçabilité transverses

```ts
interface PreconisationLibrary {        // bibliothèque réutilisable
  id: string; type: 'exercice'|'drill'|'renfo'|'mobilite';
  title: string; description: string; media?: string;
}

interface JournalAction {               // traçabilité
  id: string; analyseId: string; actor: 'kine'|'patient'|'ia';
  action: string; payload?: unknown; timestamp: string;
}

interface Consentement {                // RGPD / données de santé
  patientId: string; granted: boolean; grantedAt: string; scope: string[];
}
```
