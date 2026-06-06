# 05 — Workflow d'analyse (les 9 étapes)

Détail développeur de chaque étape : objectif, UI (réf. maquette), entrées/sorties, règles, et critères d'acceptation. Toutes les étapes partagent : le **dossier patient** en sidebar, l'**anneau de progression**, le **stepper** navigable, et la possibilité de **sauter/reprendre** (workflow non strictement linéaire).

Réf. maquette : `.panel[data-step="N"]`, `goStep(n)`, `complete(n)`.

---

## Conventions communes

- **Validation d'étape** : bouton primaire en pied de panneau → `complete(n)` → marque l'étape `done`, met à jour la progression, propose l'étape suivante.
- **Bandeau IA/Kiné** : `.validate-bar` rappelle « l'IA propose, le kiné dispose » sur les étapes à sortie IA.
- **Toast** : retour visuel de chaque action.

---

## Étape 1 — Questionnaire général patient

- **Objectif** : recueillir le profil coureur (5 blocs). Rempli par le patient en amont (idéal) ou par le kiné en séance.
- **UI** : 5 sections (`.block-title`), champs typés, **logique conditionnelle** (`.conditional` pour orthèses « oui » et blessure « oui »), bandeau de pré-remplissage `#step1Banner`.
- **Entrée** : réponses patient (amont) ou saisie kiné.
- **Sortie** : `Questionnaire` normalisé (profil coureur).
- **Règles** : sauvegarde progressive ; reprise possible ; version mobile ; champs obligatoires/optionnels à arbitrer avec le kiné.
- **AC** :
  - [ ] Les blocs conditionnels n'apparaissent que si la réponse les déclenche.
  - [ ] La blessure ouvre une saisie détaillée (zone, date, statut).
  - [ ] Pré-remplissage effectif si questionnaire amont `completed`.

---

## Étape 2 — Première analyse IA du profil

- **Objectif** : générer un **pré-profil** + une liste de **questions complémentaires** pour affiner.
- **UI** : encadré IA (`.ai-box`) avec synthèse (profil / signaux / axes) ; liste de questions (`.q-item`) avec actions **garder / éditer / retirer** (`keepQ`, `removeQ`, contenteditable) ; bouton « + Ajouter une question » (`addQuestion`).
- **Entrée** : `Questionnaire` (étape 1).
- **Sortie** : `ProfilIA` → **trame d'interview personnalisée** (questions `kept` + `added_by_kine`).
- **Règles** : le kiné peut éditer/valider/retirer chaque suggestion. Aucune question imposée.
- **AC** :
  - [ ] Le kiné peut modifier le texte d'une question.
  - [ ] Les questions retirées n'alimentent pas la trame.
  - [ ] La trame produite est transmise à l'étape 3.

---

## Étape 3 — Interview assistée (~10 min) + diagnostic différentiel

- **Objectif** : conduire l'interview, enrichir le diagnostic ; si blessure → **diagnostic différentiel** via matrice pathologies.
- **UI** :
  - Bandeau `.validate-bar` (« l'IA propose, le kiné dispose »).
  - **Matrice** (`table.matrix`) : lignes = signes (sections histoire/subjectif & examen objectif), colonnes = pathologies, cellules = pondérations `--- → +++` (`.w.*`).
  - **Hypothèses classées** (`.hyp`) avec score, **signes contributifs (traçabilité)**, et boutons **valider/invalider** (`valHyp`).
- **Entrée** : trame d'interview (étape 2) + signes recueillis.
- **Sortie** : `DiagnosticDifferentiel` (hypothèses validées par le kiné).
- **Règles** :
  - Branche décisionnelle oui/non : présence de blessure → adapte la suite (et le protocole de tests).
  - L'IA **propose** à partir des fiches ; le kiné **valide** chaque hypothèse. Pas de diagnostic autonome.
  - Base de connaissances maintenue/validée par les kinés (gouvernance clinique) — voir `03-modele-de-donnees.md` §6 et `06-integrations.md`.
- **AC** :
  - [ ] Chaque hypothèse affiche ses signes contributifs.
  - [ ] La validation/invalidation est tracée.
  - [ ] La détection de blessure conditionne la suite du protocole.

---

## Étapes 4 à 7 — Tests (import de fichiers)

Modèle commun : **composant d'import** (`.drop` → `.drop.filled`, `dropFile`) rattachant le fichier au patient, puis affichage des métriques. Format MVP : **CSV/FIT** (API temps réel reportée en V2).

### Étape 4 — Test de force (VALD)
- **Source** : VALD (fichier « List Testing » consolidant mobilité, forces, fonctionnels — colonnes Droite/Gauche/Normes).
- **Sortie** : asymétries, force max, ratios (`table.dg` + `.asym.*`).
- **Note** : protocole adaptable selon le diagnostic (étape 3).

### Étape 5 — Test de mobilité (VALD)
- **Source** : VALD ForceFrame / HumanTrak.
- **Sortie** : amplitudes articulaires, asymétries.

### Étape 6 — Test fonctionnel (Vitruve)
- **Source** : Vitruve (sauts, puissance, profil charge-vitesse).
- **Sortie** : métriques fonctionnelles / puissance (CMJ, LSI single-leg hop, W/kg).

### Étape 7 — Analyse sur tapis (Stryd)
- **Source** : capteurs Stryd (fichier CSV/FIT).
- **Sortie** : **signature biomécanique** — puissance, cadence, GCT (D/G), oscillation verticale, raideur LSS, longueur de foulée (`.summary-grid`).

- **AC communs (4–7)** :
  - [ ] L'import accepte CSV/FIT et rattache le fichier au patient/test courant.
  - [ ] Les métriques latéralisées affichent D/G/Norme + indicateur d'asymétrie.
  - [ ] Le parsing échoue proprement (message clair) si le format est invalide.

---

## Étape 8 — Analyse visuelle & clinique de la vidéo

- **Objectif** : visionner la vidéo de course (tapis, capteur Stryd) et renseigner une **grille d'observation standardisée** (vues frontale & sagittale, deux côtés).
- **UI** : lecteur (`.video-mock`) avec **marqueurs temporels** ; sélecteur de vues (`.views`) ; **grille** (`.obs-item`) avec notation feu (`rate` → vert/orange/rouge).
- **Items** (10) : inclinaison du tronc ; stabilité du bassin ; valgus dynamique ; flexion du genou ; pronation du pied ; déplacement vertical ; verticalité du tibia ; type de pose de pied ; cadence ; bruit.
- **Entrée** : vidéo + données capteurs Stryd.
- **Sortie** : `ObservationVideo` (observations structurées + scoring).
- **Règle MVP** : **saisie manuelle** par le kiné — pas de pose estimation automatisée.
- **AC** :
  - [ ] Chaque item de la grille reçoit un score vert/orange/rouge.
  - [ ] Les marqueurs temporels/captures sont rattachés à la grille.

---

## Étape 9 — Génération du bilan (2 versions)

- **Objectif** : l'IA **agrège les étapes 1→8** et génère **deux versions** du bilan ; le kiné valide/édite avant publication.
- **UI** : onglets **Patient / Expert** (`switchRep`) ; version patient = message clé (`.keymsg`), jauges (`gauge()`), encadrés « ce que ça veut dire / ce qu'on fait » (`.ins`), **plan d'action priorisé** (`.plan-item`/`.pr`), **échelle de douleur** ; version expert = synthèse analytique, **barres D/G vs normes** (`#dgBars`), justifications techniques. Bandeau de validation kiné + **export PDF** + **publication patient** (`publishReport`).
- **Entrée** : toutes les sorties des étapes 1→8.
- **Sortie** : `Bilan` versionné (2 vues) + recommandations.
- **Règles** : aucune publication sans validation kiné ; export PDF ; partage au patient ; conserver les deux niveaux de lecture.
- **Détails** : voir `07-bilan-et-dataviz.md`.
- **AC** :
  - [ ] Les deux versions sont générées et éditables.
  - [ ] La publication est bloquée tant que le kiné n'a pas validé.
  - [ ] Le bilan est versionné (traçabilité).

---

## Récapitulatif entrées → sorties

| Étape | Entrée | Sortie |
|-------|--------|--------|
| 1 | Réponses patient/kiné | Profil coureur normalisé |
| 2 | Profil (1) | Trame d'interview |
| 3 | Trame (2) + signes | Diagnostic différentiel validé |
| 4 | Fichier VALD | Métriques de force |
| 5 | Fichier VALD | Métriques de mobilité |
| 6 | Fichier Vitruve | Métriques fonctionnelles |
| 7 | Fichier Stryd | Signature biomécanique |
| 8 | Vidéo + capteurs | Observations + scoring |
| 9 | Étapes 1→8 | 2 bilans + recommandations |
