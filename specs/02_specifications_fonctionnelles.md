# Spécifications fonctionnelles — PhysioRunningLab

> Analyse clinique du coureur — application web responsive
> Workflow d'analyse en 9 étapes
> Document de travail — 06 juin 2026

---

## Préambule

Il s'agit de **données de santé**, ce qui impose un cadre réglementaire fort : **RGPD + hébergement HDS en France**. Cette exigence est une **contrainte transverse structurante**, intégrée à toutes les étapes.

---

## 1. Contexte & objectifs

| Élément | Description |
| --- | --- |
| Client | PhysioRunningLab — analyse clinique du coureur |
| Utilisateurs | Kiné/expert (utilisateur principal), Patient/coureur (saisie + lecture du bilan) |
| Problème | L'analyse complète d'un patient prend trop de temps (« ROI : 4H par analyse patient ») |
| Objectif produit | Réduire et structurer le temps d'analyse via un workflow guidé et assisté par IA, aboutissant à un bilan de course en 2 versions |
| Plateforme | Application web responsive (desktop kiné + mobile/tablette patient) |

### KPI de succès

- Temps moyen d'analyse par patient (cible : diviser le « 4H » actuel).
- Taux de complétion du questionnaire patient.
- Taux d'acceptation des préconisations IA par le kiné.
- NPS patient sur la lisibilité du bilan.

---

## 2. Acteurs & rôles

- **Coureur / Patient** — crée son compte, remplit le questionnaire, participe à l'interview, consulte sa version synthétique du bilan.
- **Kiné / Expert** — pilote le workflow, mène l'interview assistée, importe/valide les données capteurs, réalise l'observation vidéo clinique, valide et publie le bilan.
- **Admin / Praticien gestionnaire** — gestion des comptes, des intégrations (clés API VALD/Vitruve/Stryd), des modèles de bilan.
- **Moteur IA** (acteur système) — analyse de profil, génération de questions, enrichissement du diagnostic, rédaction des 2 bilans.

---

## 3. Spécifications par étape du workflow

### Étape 1 — Questionnaire général patient

**Objectif** : recueillir un profil coureur structuré et normalisé.

- Formulaire structuré rempli par le patient, repris du questionnaire « Analyse de course » existant.
- Champs regroupés en **5 blocs** :
  - **Profil & morphologie** : sexe ; âge ; taille ; poids ; club ou association.
  - **Pratique de course** : nombre d'années de course ; volume hebdomadaire (km/sem) ; spécialité (distance/discipline) ; changements récents dans l'entraînement.
  - **Équipement** : chaussures utilisées ; indice minimaliste ; orthèses plantaires (oui/non) — si oui : ancienneté du port et motif de prescription.
  - **Antécédents** : antécédents médicaux ; blessures en course à pied (historique).
  - **Attentes** : attente(s) du patient vis-à-vis de l'analyse (texte libre).
- **Fonctionnalités** : sauvegarde progressive, reprise possible, version mobile.
- **Logique conditionnelle** :
  - le bloc « orthèses plantaires » déplie les champs *ancienneté* et *motif* uniquement si « oui » ;
  - le champ « blessures en course à pied » ouvre une saisie détaillée (zone, date, statut) ;
  - champs typés, caractère obligatoire/optionnel à valider avec le kiné.
- **Sortie** : profil coureur structuré (données normalisées).

### Étape 2 — Première analyse IA du profil

**Objectif** : préparer une trame d'interview personnalisée.

- L'IA analyse le questionnaire et génère un **pré-profil** + une **liste de questions complémentaires** proposées au kiné pour affiner.
- Le kiné peut **éditer / valider / retirer** chaque question suggérée.
- **Sortie** : trame d'interview personnalisée.

### Étape 3 — Interview ~10 min assistée par IA

**Objectif** : affiner le profil et, si blessure, produire un diagnostic différentiel.

- Le kiné conduit l'interview ; l'IA assiste en temps réel (suggestions de questions de relance, prise de notes).
- L'IA enrichit le diagnostic et fait évoluer les questions en s'appuyant sur une **base de connaissances pathologies** si blessure détectée → produit un **diagnostic différentiel**.
- **Branche décisionnelle (oui/non)** : présence de blessure/pathologie → adapte la suite du protocole.
- **Validation kiné** : à l'issue du diagnostic, le kiné valide ou invalide chaque hypothèse avant de poursuivre.
- **Sortie** : diagnostic différentiel + hypothèses cliniques (validées par le kiné).

> Le format des fiches pathologie (matrices de diagnostic différentiel) est détaillé dans le fichier `04_formats_fichiers_references.md`.

### Étape 4 — Test de force (données VALD)

**Objectif** : produire les métriques de force.

- Récupération des données de force par **import de fichier (CSV/FIT)** — mode retenu pour le **MVP** (l'API VALD est reportée en V2).
- Le fichier VALD « List Testing » consolide mobilité, forces et tests fonctionnels (colonnes **Droite / Gauche / Normes**).
- Le protocole de test peut être adapté selon le diagnostic différentiel de l'Étape 3.
- **Sortie** : métriques de force (asymétries, force max, ratios).

### Étape 5 — Test de mobilité (données VALD)

**Objectif** : produire les métriques de mobilité articulaire.

- Récupération des données de mobilité/amplitude (VALD **ForceFrame / HumanTrak**) par **import de fichier (CSV/FIT)** pour le MVP.
- **Sortie** : métriques de mobilité articulaire, amplitudes, asymétries.

### Étape 6 — Test fonctionnel (données Vitruve)

**Objectif** : produire les métriques fonctionnelles / de puissance.

- Import des données fonctionnelles issues de **Vitruve** (sauts, puissance, profil charge-vitesse).
- **Sortie** : métriques fonctionnelles / puissance.

### Étape 7 — Analyse sur tapis (capteurs Stryd)

**Objectif** : produire la signature biomécanique de course.

- Récupération des données de course sur tapis via capteurs **Stryd**, par **import de fichier (CSV/FIT)** pour le MVP.
- Données : puissance, cadence, temps de contact au sol, oscillation verticale, raideur du ressort de jambe (LSS), longueur de foulée.
- **Sortie** : signature biomécanique de course.

### Étape 8 — Analyse visuelle & clinique de la vidéo (kiné)

**Objectif** : produire des observations cliniques structurées + scoring.

- Le kiné visionne la vidéo de course sur tapis (capteur de mouvement Stryd) et renseigne une **grille d'observation clinique standardisée**, en vues **frontale et sagittale**, des **deux côtés**.
- **Items renseignés par le kiné** : inclinaison du tronc ; stabilité du bassin ; valgus dynamique ; flexion du genou ; pronation du pied ; déplacement vertical ; verticalité du tibia ; type de pose de pied ; cadence ; bruit.
- **Outil d'annotation** : marqueurs temporels, captures, grille d'observation standardisée, notation.
- **Limite MVP** : pas d'analyse image automatisée (pose estimation) — saisie manuelle par le kiné.
- **Sortie** : observations cliniques structurées + scoring.

### Étape 9 — Génération du bilan de course (2 versions)

**Objectif** : produire les deux versions du bilan + recommandations.

- L'IA agrège toutes les données (Étapes 1 → 8) et génère **deux versions** du bilan :
  - **Version synthétique / patient** — lisible, pédagogique, vulgarisée + premières préconisations.
  - **Version expert / kiné** — détaillée, analytique, avec données brutes/graphiques + premières préconisations techniques.
- Le kiné valide/édite avant publication. **Export PDF**, partage au patient.
- **Sortie** : 2 bilans + recommandations.

#### Exigence : un bilan beaucoup plus impactant

- Référence de départ : le bilan exemple « Analyse de course » (Sarah DAVID) — message clé en tête, comparaisons Droite/Gauche face aux normes, conséquences cliniques, priorités et plan d'action.
- **À rendre plus impactant** :
  - hiérarchie visuelle forte (un message principal, puis les preuves) ;
  - visualisations des écarts D/G et des normes (jauges, barres, code couleur **vert/orange/rouge**) ;
  - vulgarisation pédagogique côté patient ;
  - encadrés « ce que ça veut dire » et « ce qu'on fait » ;
  - plan d'action priorisé et échéancé ;
  - échelle de gestion de la douleur ;
  - identité graphique soignée.
- Deux niveaux de lecture conservés : version patient (synthétique, motivante) et version expert (données brutes, graphiques, justifications techniques).

---

## 4. Exigences fonctionnelles transverses

| ID | Exigence |
| --- | --- |
| EFT-1 | **Dossier patient unique** consolidant toutes les étapes et l'historique (suivi longitudinal entre bilans). |
| EFT-2 | **Workflow non strictement linéaire** : pouvoir sauter/reprendre une étape ; statut d'avancement par patient. |
| EFT-3 | **Validation humaine systématique** : aucune sortie IA n'est publiée sans validation kiné (l'IA propose, le kiné dispose). |
| EFT-4 | **Traçabilité** : journal des actions, versions du bilan. |
| EFT-5 | **Gestion du consentement patient** (RGPD, données de santé). |
| EFT-6 | **Bibliothèque de préconisations réutilisable** (exercices, drills, renfo, mobilité). |

---

## 5. Contraintes techniques & réglementaires

- **Hébergement HDS** (Hébergeur de Données de Santé) en France — obligatoire.
- **RGPD** : consentement explicite, droit d'accès/effacement, minimisation des données.
- **Application web responsive** : desktop (kiné) + mobile/tablette (patient).
- **MVP** : import de fichiers (CSV/FIT) pour VALD, Vitruve, Stryd. **V2** : intégrations API.
- **Export** : bilan PDF (2 versions).

---

## 6. Périmètre MVP vs V2

| Fonctionnalité | MVP | V2 |
| --- | --- | --- |
| Questionnaire patient | ✅ | — |
| Analyse IA du profil + trame interview | ✅ | — |
| Interview assistée + diagnostic différentiel | ✅ | — |
| Récupération données VALD / Vitruve / Stryd | Import fichier (CSV/FIT) | API |
| Analyse vidéo | Grille manuelle kiné | Pose estimation automatisée (à l'étude) |
| Génération bilan 2 versions + PDF | ✅ | — |
| Suivi longitudinal | ✅ | Enrichi |
