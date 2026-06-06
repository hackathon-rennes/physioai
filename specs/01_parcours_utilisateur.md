# Parcours utilisateur — PhysioRunningLab

> Analyse clinique du coureur — application web responsive
> Workflow d'analyse en 9 étapes
> Document de travail — 06 juin 2026

---

## 1. Vue d'ensemble

Le parcours décrit le déroulé opérationnel d'une **séance d'analyse de course** vécue en cabinet. Le **kiné/expert** pilote la séance ; le **patient/coureur** répond et exécute les tests. Les informations patient proviennent de **Maia** (dossier patient existant, hors application).

Le parcours se découpe en **14 temps forts** (déroulé terrain) qui se rattachent aux **9 étapes du workflow produit**.

### Acteurs

| Acteur | Rôle dans le parcours |
| --- | --- |
| **Coureur / Patient** | Crée son compte, remplit le questionnaire, participe à l'interview, consulte la version synthétique du bilan |
| **Kiné / Expert** | Pilote le workflow, mène l'interview assistée, importe/valide les données capteurs, réalise l'observation vidéo, valide et publie le bilan |
| **Admin / Praticien gestionnaire** | Gestion des comptes, des intégrations (clés API VALD/Vitruve/Stryd), des modèles de bilan |
| **Moteur IA** (système) | Analyse de profil, génération de questions, enrichissement du diagnostic, rédaction des 2 bilans |

---

## 2. Les 14 temps forts du parcours terrain

| # | Temps fort | Acteur | Lieu | Étape produit |
| --- | --- | --- | --- | --- |
| 1 | Le patient prend rendez-vous sur Maia | Patient | Hors appli (Maia) | — |
| 2 | Le kiné valide le rendez-vous | Kiné | Hors appli (Maia) | — |
| 3 | Le kiné démarre « l'analyse de course » dans l'application | Kiné | Application | Étape 1 |
| 4 | Envoi automatique du questionnaire au patient | Système | Application | Étape 1 |
| 5 | Le patient reçoit et remplit le questionnaire | Patient | Application (mobile) | Étape 1 |
| 6 | Le kiné reçoit les résultats du questionnaire + une première analyse IA et les questions à creuser | Kiné + IA | Application | Étape 2 |
| 7 | Le patient arrive le jour J | Patient | Cabinet | — |
| 8 | Selon les réponses, le kiné pose des questions complémentaires pour identifier le « profil de coureur » (assisté par l'IA) | Kiné + IA | Application | Étape 3 |
| 9 | En cas de blessure, le kiné déclenche un diagnostic différentiel (matrices pathologies) | Kiné + IA | Application | Étape 3 |
| 10 | À l'issue du diagnostic, le kiné valide ou non le diagnostic proposé | Kiné | Application | Étape 3 |
| 11 | Si des tests physiques sont prévus, le kiné les réalise avec le patient | Kiné + Patient | Cabinet | Étapes 4-6 |
| 12 | Le kiné récupère les fichiers de résultats : (a) test de force, (b) test de mobilité, (c) test fonctionnel — chacun exporté en fichier (CSV/FIT) | Kiné | Outils de test | Étapes 4-6 |
| 13 | Le kiné importe les résultats dans l'interface — l'import est rattaché au test en cours, donc au patient | Kiné | Application | Étapes 4-7 |
| 14 | Si une analyse vidéo est prévue, le kiné réalise la captation, récupère les données capteurs puis ajoute son analyse clinique | Kiné + Patient | Cabinet | Étapes 7-8 |

> **Clôture du parcours** : récapitulatif de toutes les informations recueillies (étapes 1 à 8), puis génération du bilan en 2 versions (Étape 9).

---

## 3. Correspondance temps forts ↔ étapes du workflow

```
Temps forts terrain          Étapes du workflow produit
─────────────────────        ──────────────────────────
1-2  Prise de RDV (Maia)  →  (hors périmètre applicatif)
3-5  Lancement + questio. →  Étape 1 — Questionnaire général patient
6    Retour IA            →  Étape 2 — Première analyse IA du profil
7    Arrivée jour J       →  (hors périmètre applicatif)
8-10 Interview + diag     →  Étape 3 — Interview ~10 min assistée IA
11-13 Tests physiques     →  Étape 4 — Test de force (VALD)
                          →  Étape 5 — Test de mobilité (VALD)
                          →  Étape 6 — Test fonctionnel (Vitruve)
14   Captation vidéo      →  Étape 7 — Analyse sur tapis (Stryd)
                          →  Étape 8 — Analyse visuelle & clinique vidéo
     Clôture              →  Étape 9 — Génération du bilan (2 versions)
```

---

## 4. Détail des parcours par acteur

### 4.1 Parcours Patient

1. **Avant la séance**
   - Reçoit une notification/lien pour remplir le questionnaire général (Étape 1).
   - Crée/active son compte.
   - Remplit le questionnaire (5 blocs) avec sauvegarde progressive — possibilité de reprendre, version mobile.
2. **Pendant la séance (jour J)**
   - Participe à l'interview menée par le kiné (~10 min).
   - Exécute les tests physiques (force, mobilité, fonctionnel) selon le protocole.
   - Réalise la course sur tapis pour la captation vidéo / capteurs.
3. **Après la séance**
   - Reçoit la **version synthétique / patient** du bilan : lisible, pédagogique, vulgarisée, avec premières préconisations et plan d'action.
   - Consulte son bilan (lecture seule) et le suivi longitudinal entre bilans.

### 4.2 Parcours Kiné / Expert

1. **Initialisation**
   - Démarre une « analyse de course » depuis le dossier patient (Étape 1).
   - Déclenche l'envoi automatique du questionnaire.
2. **Préparation**
   - Reçoit le pré-profil IA + la liste de questions complémentaires suggérées (Étape 2).
   - Édite / valide / retire les questions suggérées → constitue la trame d'interview.
3. **Séance**
   - Mène l'interview assistée par l'IA en temps réel (Étape 3).
   - Si blessure : déclenche le diagnostic différentiel (matrices pathologies), valide/invalide chaque hypothèse.
   - Réalise les tests physiques, exporte et importe les fichiers VALD / Vitruve / Stryd (Étapes 4-7).
   - Réalise la captation vidéo et renseigne la grille d'observation clinique (Étape 8).
4. **Clôture**
   - Consulte le récapitulatif consolidé.
   - Génère le bilan en 2 versions (Étape 9), édite/valide, exporte en PDF et partage au patient.

### 4.3 Parcours Admin / Praticien gestionnaire

- Gère les comptes utilisateurs (kinés, patients).
- Configure les intégrations et clés API (VALD / Vitruve / Stryd) — import fichier au MVP, API en V2.
- Maintient les modèles de bilan et la bibliothèque de préconisations.
- Co-maintient la base de connaissances pathologies (responsabilité clinique partagée avec les kinés).

---

## 5. Caractéristiques transverses du parcours

- **Workflow non strictement linéaire** : possibilité de sauter / reprendre une étape ; statut d'avancement par patient.
- **Dossier patient unique** consolidant toutes les étapes et l'historique (suivi longitudinal entre bilans).
- **Validation humaine systématique** : aucune sortie IA n'est publiée sans validation du kiné (« l'IA propose, le kiné dispose »).
- **Traçabilité** : journal des actions, versions du bilan.
- **Consentement & RGPD** : recueil du consentement patient (données de santé, hébergement HDS France).

---

## 6. Points d'attention parcours (UX)

| Point | Enjeu |
| --- | --- |
| Questionnaire mobile | Taux de complétion patient — ergonomie mobile, sauvegarde progressive, logique conditionnelle fluide |
| Retour IA au kiné | Lisibilité du pré-profil et pertinence des questions suggérées (taux d'acceptation) |
| Import fichiers en séance | Rattachement automatique au test/patient en cours, feedback de réussite d'import |
| Grille vidéo | Saisie rapide en vues frontale/sagittale, deux côtés, sans friction |
| Bilan final | Hiérarchie visuelle forte, deux niveaux de lecture (patient vs expert) |
