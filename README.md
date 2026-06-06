# PhysioRunningLab

> Application web d'analyse clinique du coureur — workflow guidé en 9 étapes, assisté par intelligence artificielle.

---

## Présentation

**PhysioRunningLab** est une application destinée aux kinésithérapeutes spécialisés dans la course à pied. Elle structure et accélère le processus d'analyse clinique d'un patient coureur, de la prise en charge initiale jusqu'à la génération d'un bilan personnalisé.

L'objectif est de **diviser par 4 le temps consacré à chaque analyse patient** (cible : < 1h au lieu de 4h) grâce à un workflow guidé et à une assistance IA intégrée à chaque étape.

---

## Deux espaces distincts

### Espace Kiné (tableau de bord)

Le kinésithérapeute dispose d'un **tableau de bord centralisé** qui lui permet de :

- Visualiser la liste de ses patients et l'avancement de leurs analyses
- Lancer une nouvelle analyse pour un patient
- Consulter les résultats du questionnaire pré-séance
- Mener l'**interview clinique assistée par IA** (~10 min) : l'IA génère une trame de questions personnalisée à partir du questionnaire, suggère des questions de relance et produit un **diagnostic différentiel** en cas de blessure détectée
- Importer et visualiser les données issues des capteurs (VALD, Vitruve, Stryd)
- Annoter l'analyse vidéo de course sur tapis
- Valider et publier le bilan final en deux versions (expert + patient)

### Espace Patient

Le patient interagit avec l'application à deux moments :

- **Avant la séance** : il reçoit un lien pour remplir un **questionnaire structuré en 5 blocs** (profil & morphologie, pratique de course, équipement, antécédents médicaux, attentes). La saisie est progressive, sauvegardée automatiquement, et optimisée pour mobile.
- **Après la séance** : il consulte la **version synthétique de son bilan** rédigée par l'IA et validée par son kiné.

---

## Workflow en 9 étapes

| Étape | Contenu | Acteur | Statut |
|-------|---------|--------|--------|
| 1 | Questionnaire général patient (5 blocs) | Patient | ✅ Développée |
| 2 | Première analyse IA du profil + trame d'interview | IA + Kiné | ✅ Développée |
| 3 | Interview ~10 min assistée IA + diagnostic différentiel | Kiné + IA | ✅ Développée |
| 4 | Test de force — import données VALD | Kiné | ✅ Développée |
| 5 | Test de mobilité — import données VALD | Kiné | 🚧 En cours |
| 6 | Test fonctionnel — import données Vitruve | Kiné | 🚧 En cours |
| 7 | Analyse sur tapis — import données Stryd | Kiné | 🚧 En cours |
| 8 | Analyse visuelle & clinique vidéo | Kiné | 🚧 En cours |
| 9 | Génération du bilan (version expert + version patient) | IA + Kiné | 🟡 v1 disponible |

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI |
| Backend | NestJS, TypeScript |
| ORM | Prisma 5 |
| Base de données | SQLite (dev) / PostgreSQL HDS (production) |
| IA | Google Gemini 3.5 Flash via `@google/generative-ai` |
| Graphiques | Recharts |

---

## Lancer le projet en local

### Prérequis

- Node.js >= 20
- npm >= 10

### 1. Backend (NestJS — port 3001)

```bash
cd src/backend

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# Renseigner DATABASE_URL et GEMINI_API_KEY dans .env

# Initialiser la base de données et appliquer le schéma
npx prisma db push

# (Optionnel) Charger les données de test
node seed.js

# Démarrer en mode développement (hot reload)
npm run start:dev
```

Le backend expose ses routes sous `http://localhost:3001/v1/`.

### 2. Frontend (Next.js — port 3000)

```bash
cd src/frontend

# Installer les dépendances
npm install

# Démarrer en mode développement (Turbopack)
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

### 3. Consulter la base de données avec Prisma Studio

Prisma Studio est une interface graphique permettant d'explorer et modifier les données directement.

```bash
cd src/backend

npx prisma studio
```

Prisma Studio s'ouvre automatiquement sur `http://localhost:5555`. Vous pouvez y consulter et éditer toutes les tables (`Patient`, `Assessment`, etc.) sans écrire de SQL.

---

## Variables d'environnement

Fichier `src/backend/.env` :

```env
# Chemin vers la base de données SQLite (dev)
DATABASE_URL="file:./dev.db"

# Clé API Google Gemini (obtenir sur https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="AIzaSy..."
```

---

## Structure du projet

```
physioai/
├── src/
│   ├── frontend/          # Application Next.js (espace kiné + espace patient)
│   │   └── src/app/
│   │       ├── (dashboard)/   # Layout kiné (header sans sidebar)
│   │       │   └── patients/  # Tableau de bord — liste des patients
│   │       ├── questionnaire/ # Formulaire patient (hors dashboard)
│   │       └── interview/     # Page interview kiné + IA (hors dashboard)
│   └── backend/           # API NestJS
│       ├── src/modules/
│       │   ├── patients/      # CRUD patients
│       │   └── assessments/   # Bilans + génération IA
│       └── prisma/
│           └── schema.prisma  # Schéma de données
├── docs/
│   ├── architecture/      # Diagrammes C4
│   └── adr/               # Architecture Decision Records
├── specs/                 # Spécifications fonctionnelles et design
└── factory-output/        # Artifacts de planification (ne pas supprimer)
```

---

## Démonstration

**PhysioRunningLab — Bilan Patient**

<video src="video/PhysioAI - Bilan Patient.mp4" controls width="100%" onloadedmetadata="this.playbackRate = 2;"></video>