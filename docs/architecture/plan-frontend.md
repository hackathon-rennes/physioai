# PLAN D'APPROBATION FRONTEND — Wave 2 (PhysioAI)

## 1. Structure de Dossiers Next.js (App Router)
Le projet suivra une architecture modulaire et orientée "features", en respectant la stack globale validée (Next.js App Router, TypeScript, Tailwind, shadcn/ui).

```text
src/frontend/
├── app/                          
│   ├── (auth)/                   # Zone publique / authentification
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Zone privée / métier
│   │   ├── layout.tsx            # Layout incluant la sidebar (Navigation)
│   │   ├── patients/             # CRUD Patients
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── bilans/               # Suivi et création de bilans physio (lien ADR-005)
│   │   │   └── page.tsx
│   │   └── videos/               # Bibliothèque d'exercices vidéo
│   │       └── page.tsx
│   ├── api/                      # Next.js API Routes (si proxies nécessaires)
│   ├── globals.css
│   └── layout.tsx                # Root layout (Provider global)
├── components/
│   ├── ui/                       # Composants shadcn/ui isolés
│   ├── features/                 
│   │   ├── patients/             # Composants spécifiques aux patients
│   │   ├── bilans/               # Formulaires et viewer de bilans/PDF
│   │   └── videos/               # Player & listes d'exercices
│   └── shared/                   # Composants inter-domaines (Header, Sidebar)
├── hooks/                        # Custom hooks basés sur React Query
├── lib/
│   ├── api/                      # Axios/Fetch clients configurés
│   ├── auth.ts                   # Configuration NextAuth v5
│   ├── env.ts                    # Validation des variables d’environnement via Zod
│   └── utils.ts                  # Utilitaires (className cn, formats date)
├── types/                        # Types TypeScript partagés (Patient, Bilan, Video)
└── public/                       # Assets statiques
```

## 2. Liste des Composants React et Pages (Scope Initial)

### Pages Principales
* **`app/(auth)/login/page.tsx`** : Page de connexion centralisée (via Azure AD B2C / NextAuth).
* **`app/(dashboard)/patients/page.tsx`** : Tableau de bord des patients avec recherche, filtres et pagination.
* **`app/(dashboard)/patients/[id]/page.tsx`** : Dossier détaillé d'un patient (historique des bilans, exercices assignés).
* **`app/(dashboard)/bilans/page.tsx`** : Création/Édition d'un bilan avec possibilité de déclencher sa génération PDF (selon ADR-005).
* **`app/(dashboard)/videos/page.tsx`** : Librairie d'exercices vidéo (listing, tags, assignation rapide).

### Composants Principaux (Features)
* **Patients** : `PatientList`, `PatientProfileCard`, `PatientForm` (React Hook Form + Zod).
* **Bilans** : `BilanWizard` (formulaire multi-étapes), `BilanHistory`, `PdfViewerModal`.
* **Vidéos** : `VideoPlayer`, `VideoGrid`, `ExerciseTagGenerator`.

## 3. Stratégie d'État Global

Conformément aux instructions du *Frontend Developer*, nous n'utiliserons ni Redux ni l'API Context pour le stockage massif.
1. **Server State (État Serveur)** : **React Query (`@tanstack/react-query`)**
   * **Rôle** : Gérer toute la donnée issue de l'API Backend (fetching, caching, invalidation, synchronisation).
   * **Exemple** : Historique des bilans, liste des patients. Les composants ne feront jamais de `fetch` isolés, mais appelleront des hooks comme `usePatients()`.
2. **Client State (État Client)** : **Zustand**
   * **Rôle** : Gérer l'état éphémère de l'interface décorellé de l'API (état d'un wizard, tiroir latéral ouvert, mode sombre/clair, sélection multiple de vidéos).
3. **Forms State** : **React Hook Form + Resolvers Zod**
   * **Rôle** : Capturer les entrées utilisateur pour la création de profil ou de bilan, avec une validation stricte du schéma avant l'envoi au backend.

## 4. Stratégie de Tests Unitaires et Qualité

Nous mettons en place un filet de sécurité local pour atteindre la définition of done (DoD) avant tout commit :
1. **Outils** : Vitest + React Testing Library (RTL).
2. **Périmètre** : 
   * Au minimum un fichier `*.test.tsx` par composant au sein des répertoires `/features/`.
   * **Couverture cible : > 80%**.
3. **Cas de tests obligatoires par composant** :
   * Rendu visuel par défaut (Snapshot partiel ou test de présence).
   * Interactions utilisateur élémentaires (clavier/souris via `userEvent`).
   * Tests des états asynchrones d'erreur/chargement (ex: composants utilisant React Query).
4. **Accessibilité (A11y)** : 
   * Vérification du focus management et conformité aux standards WCAG 2.1 AA pour les composants interactifs.
5. **Quality Gates** : 
   * Le code doit passer `npm run type-check` (zéro erreurs TS), `npm run lint` et `npm run test -- --run` localement avant validation d'une Use Case.