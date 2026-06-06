# PhysioRunningLab — Analyse clinique du coureur
## Documentation de développement de la maquette

> Application web responsive d'aide à l'analyse clinique de course à pied, à destination des kinés du sport. Elle structure une séance d'analyse en **9 étapes**, précédées d'une **phase amont** (envoi d'un questionnaire au patient avant le RDV), et produit un **bilan en 2 versions** (patient / expert).

Cette documentation explique l'intégralité de la maquette HTML (`physiorunninglab-maquette.html`) afin de permettre son développement en application réelle.

---

## 1. Vision produit

- **Problème** : aujourd'hui, l'analyse de course mobilise ~4 h par patient. Données dispersées (questionnaire papier, fichiers VALD/Vitruve/Stryd, observation vidéo), bilan peu lisible.
- **Objectif** : un workflow guidé qui centralise toutes les données dans un **dossier patient unique**, assiste le kiné par une **IA d'aide à la décision** (« l'IA propose, le kiné valide »), et génère un **bilan impactant** à deux niveaux de lecture.
- **KPI de succès** :
  - Temps moyen d'analyse par patient (cible : diviser le « 4 h » actuel).
  - Taux de complétion du questionnaire patient (en amont).
  - Taux d'acceptation des préconisations IA par le kiné.
  - NPS patient sur la lisibilité du bilan.

---

## 2. Périmètre fonctionnel

| Phase | Contenu | Acteur principal |
|-------|---------|------------------|
| **Amont** | Accueil kiné, lancement d'analyse, envoi du questionnaire, suivi de statut | Kiné |
| **Étape 1** | Questionnaire général (5 blocs) | Patient (en amont) ou kiné (séance) |
| **Étape 2** | Première analyse IA du profil | IA + Kiné |
| **Étape 3** | Interview assistée + diagnostic différentiel | Kiné + IA |
| **Étape 4** | Test de force (VALD) | Kiné |
| **Étape 5** | Test de mobilité (VALD) | Kiné |
| **Étape 6** | Test fonctionnel (Vitruve) | Kiné |
| **Étape 7** | Analyse sur tapis (Stryd) | Kiné |
| **Étape 8** | Analyse visuelle & clinique de la vidéo | Kiné |
| **Étape 9** | Génération du bilan (2 versions) | IA + Kiné |

---

## 3. Acteurs & rôles

- **Coureur / Patient** — crée son compte, remplit le questionnaire (en amont, depuis mobile), participe à l'interview, consulte la version synthétique du bilan.
- **Kiné / Expert** — pilote le workflow, mène l'interview assistée, importe/valide les données capteurs, réalise l'observation vidéo, valide et publie le bilan.
- **Admin / Praticien gestionnaire** — gestion des comptes, des intégrations (clés API VALD/Vitruve/Stryd), des modèles de bilan et de la base de connaissances pathologies.
- **Moteur IA** (acteur système) — analyse de profil, génération de questions, enrichissement du diagnostic, rédaction des deux bilans. **Jamais autonome** : chaque sortie est validée par le kiné.

---

## 4. Arborescence de la documentation

| Fichier | Contenu |
|---------|---------|
| [`README.md`](./README.md) | Ce document — vision, périmètre, index |
| [`01-architecture.md`](./01-architecture.md) | Stack recommandée, structure des vues, navigation, gestion d'état |
| [`02-design-system.md`](./02-design-system.md) | Palette, typographie, tokens, inventaire des composants UI |
| [`03-modele-de-donnees.md`](./03-modele-de-donnees.md) | Entités, schémas TypeScript, statuts, relations |
| [`04-phase-amont.md`](./04-phase-amont.md) | Accueil kiné, envoi questionnaire, suivi de statut, pré-remplissage |
| [`05-workflow-analyse.md`](./05-workflow-analyse.md) | Détail développeur des 9 étapes (UI, données, règles, sorties) |
| [`06-integrations.md`](./06-integrations.md) | Maia, VALD, Vitruve, Stryd, e-mail, moteur IA, formats de fichiers |
| [`07-bilan-et-dataviz.md`](./07-bilan-et-dataviz.md) | Génération des 2 bilans, visualisations, validation kiné, export PDF |
| [`08-conformite-rgpd-hds.md`](./08-conformite-rgpd-hds.md) | RGPD, hébergement HDS, consentement, traçabilité, sécurité |

---

## 5. Correspondance maquette ↔ code

La maquette est un **fichier HTML autonome** (HTML + CSS + JS inline) à but de démonstration. Elle n'est pas l'architecture cible mais sert de **référence visuelle et fonctionnelle**.

| Élément maquette | Référence dans le code | À développer en |
|------------------|------------------------|-----------------|
| `#homeView` | Section accueil | Page / route `/dashboard` |
| `#workflowView` (`.shell`) | Sidebar + panneaux | Layout workflow `/analyse/:id` |
| `.panel[data-step="N"]` | 9 panneaux d'étape | 9 composants d'étape |
| `PATIENTS[]` (JS) | Jeu de données simulé | API back-end + base de données |
| `sendQuestionnaire()`, `simulatePatient()` | Simulations | Appels API réels (e-mail, webhook) |
| Fonctions `render*`, `gauge()`, `complete()` | Rendu/transition simulés | Composants + state management |

> ⚠️ Toutes les données chiffrées de la maquette (forces, amplitudes, hypothèses, etc.) sont **fictives** (cas fil rouge « Sarah DAVID »). Elles illustrent les formats attendus, pas des valeurs de référence cliniques.

---

## 6. Principes structurants (non négociables)

1. **Validation humaine systématique** — aucune sortie IA n'est publiée sans validation du kiné.
2. **Workflow non strictement linéaire** — possibilité de sauter/reprendre une étape ; statut d'avancement par patient.
3. **Dossier patient unique** — consolidation de toutes les étapes + historique (suivi longitudinal entre bilans).
4. **Traçabilité** — journal des actions, versions du bilan, signes contributifs des hypothèses.
5. **Données de santé** — RGPD + hébergement HDS en France (contrainte transverse structurante).
6. **Deux niveaux de lecture du bilan** — version patient (synthétique, motivante) et version expert (données brutes, justifications).
