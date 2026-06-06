# Formats des fichiers & références sources — PhysioRunningLab

> Analyse clinique du coureur — application web responsive
> Document de travail — 06 juin 2026

Ce document décrit les **formats de fichiers** importés au MVP et les **références** vers les fichiers issus des applications partenaires : **Stryd**, **VALD (ValdHub)** et **Vitruve**. Il couvre également le format des **fiches pathologie** de la base de connaissances.

> **Mode d'intégration MVP** : import de fichier (CSV/FIT). Les API constructeurs sont reportées en **V2**.

---

## 1. Principes communs d'import

| Principe | Détail |
| --- | --- |
| Formats acceptés | **CSV** et **FIT** (selon la source) |
| Rattachement | Chaque import est rattaché au **test en cours**, donc au **patient** et à l'**analyse en cours** (RG-IM-02) |
| Axes de comparaison | **Droite / Gauche / Normes** conservés pour toutes les métriques bilatérales |
| Calculs dérivés | Asymétrie D/G (%), force max, ratios, écart à la norme |
| Échec d'import | Format invalide → message d'erreur explicite, **aucun écrasement** des données existantes (RG-IM-05) |
| Horodatage | Date du test + date d'import journalisées (traçabilité) |

---

## 2. VALD (ValdHub) — Étapes 4 & 5

**Source** : plateforme **ValdHub** (export manuel au MVP).
**Matériel** : VALD **ForceFrame**, **HumanTrak**, **DynaMo** (selon protocole).
**Usage** : test de force (Étape 4) et test de mobilité (Étape 5).

### 2.1 Fichier « List Testing »

Le fichier VALD **« List Testing »** consolide **mobilité, forces et tests fonctionnels** dans un même export.

| Caractéristique | Valeur |
| --- | --- |
| Format | CSV (export ValdHub « List Testing ») / FIT |
| Structure | Une ligne par test/métrique |
| Colonnes clés | **Droite**, **Gauche**, **Normes** |
| Granularité | Par articulation / mouvement / type de test |

### 2.2 Champs attendus (modèle d'import)

| Champ | Type | Description |
| --- | --- | --- |
| `athlete_id` / `patient_ref` | texte | Identifiant patient (rattachement) |
| `test_date` | date | Date du test |
| `test_type` | énuméré | Force / Mobilité / Fonctionnel |
| `metric_name` | texte | Nom de la métrique (ex. force max, amplitude) |
| `value_right` | numérique | Valeur côté **Droit** |
| `value_left` | numérique | Valeur côté **Gauche** |
| `norm_min` / `norm_max` | numérique | Bornes de **Norme** |
| `unit` | texte | Unité (N, kg, °, etc.) |

### 2.3 Métriques produites (Étape 4 — Force)

- Force max (par groupe musculaire / articulation).
- Asymétries Droite/Gauche.
- Ratios (agonistes/antagonistes selon protocole).

### 2.4 Métriques produites (Étape 5 — Mobilité)

- Amplitudes articulaires.
- Asymétries Droite/Gauche.
- Écart aux normes.

---

## 3. Vitruve — Étape 6 (test fonctionnel)

**Source** : encodeur/plateforme **Vitruve**.
**Usage** : test fonctionnel — sauts, puissance, profil charge-vitesse.

| Caractéristique | Valeur |
| --- | --- |
| Format | CSV (export Vitruve) |
| Structure | Une ligne par répétition / saut |
| Nature | Données fonctionnelles & de puissance |

### 3.1 Champs attendus (modèle d'import)

| Champ | Type | Description |
| --- | --- | --- |
| `patient_ref` | texte | Identifiant patient |
| `test_date` | date | Date du test |
| `exercise` | texte | Exercice (ex. squat jump, CMJ, charge-vitesse) |
| `load` | numérique | Charge (kg) |
| `mean_velocity` | numérique | Vitesse moyenne (m/s) |
| `peak_velocity` | numérique | Vitesse pic (m/s) |
| `power` | numérique | Puissance (W) |
| `jump_height` | numérique | Hauteur de saut (cm) |
| `side` | énuméré | Droit / Gauche / Bilatéral (si applicable) |

### 3.2 Métriques produites

- Puissance, hauteur de saut.
- Profil **charge-vitesse** (load-velocity).
- Asymétries éventuelles selon le protocole.

---

## 4. Stryd — Étape 7 (analyse sur tapis)

**Source** : capteur de puissance/mouvement **Stryd** (pied).
**Usage** : analyse de course sur tapis — signature biomécanique. Sert aussi de support à la **vidéo** (Étape 8).

| Caractéristique | Valeur |
| --- | --- |
| Format | **FIT** (natif Stryd) / CSV |
| Structure | Série temporelle (échantillonnage par seconde / par foulée) |
| Nature | Données biomécaniques de course |

### 4.1 Métriques Stryd attendues

| Métrique | Unité | Description |
| --- | --- | --- |
| `power` | W (ou W/kg) | Puissance de course |
| `cadence` | pas/min (spm) | Cadence |
| `ground_contact_time` | ms | Temps de contact au sol (GCT) |
| `vertical_oscillation` | cm | Oscillation verticale |
| `leg_spring_stiffness` (LSS) | kN/m | Raideur du ressort de jambe |
| `stride_length` | m | Longueur de foulée |

### 4.2 Champs attendus (modèle d'import)

| Champ | Type | Description |
| --- | --- | --- |
| `patient_ref` | texte | Identifiant patient |
| `test_date` | date | Date du test |
| `timestamp` | datetime | Horodatage de l'échantillon |
| `speed` | numérique | Vitesse tapis (km/h ou m/s) |
| `power` / `cadence` / `gct` / `vo` / `lss` / `stride_length` | numérique | Voir §4.1 |

### 4.3 Métrique produite

- **Signature biomécanique de course** (agrégats moyens/min/max + courbes temporelles), rattachée à l'analyse.

---

## 5. Récapitulatif des sources

| Étape | Application | Données | Format MVP | Format V2 |
| --- | --- | --- | --- | --- |
| 4 — Force | **VALD (ValdHub)** | Forces (D/G/Normes) | CSV / FIT (« List Testing ») | API VALD |
| 5 — Mobilité | **VALD (ForceFrame/HumanTrak)** | Amplitudes, asymétries | CSV / FIT | API VALD |
| 6 — Fonctionnel | **Vitruve** | Sauts, puissance, charge-vitesse | CSV | API Vitruve |
| 7 — Tapis | **Stryd** | Puissance, cadence, GCT, oscillation, LSS, foulée | FIT / CSV | API Stryd |

---

## 6. Format des fiches pathologie (base de connaissances — Étape 3)

Le diagnostic différentiel s'appuie sur des **fiches pathologie** au format **matrice**, ingérées de façon homogène.

| Élément | Description |
| --- | --- |
| **Portée d'une fiche** | Une zone / un motif de consultation (ex. « douleur genou latéral ») |
| **Colonnes** | **Pathologies candidates** |
| **Lignes** | **Signes cliniques**, regroupés en deux sections : *histoire / examen subjectif* et *examen objectif* (dont tests cliniques nommés : Noble, Garrick, stress test tibio-fibulaire, SLR…) |
| **Cellules** | **Pondération ordinale** de l'association signe ↔ pathologie, échelle de `- - -` (fortement contre) à `+++` (fortement en faveur), avec notes conditionnelles éventuelles (ex. « + plus si genou à 30° ») |

### 6.1 Modèle de données d'une fiche

```yaml
fiche_pathologie:
  zone: "douleur genou latéral"
  source: "La Clinique Du Coureur"
  pathologies:            # colonnes
    - "Syndrome de l'essuie-glace (bandelette ilio-tibiale)"
    - "..."
  signes:                 # lignes
    - section: "histoire / examen subjectif"
      libelle: "..."
    - section: "examen objectif"
      libelle: "Test de Noble"
  matrice:                # cellule = pondération signe x pathologie
    - signe: "Test de Noble"
      pathologie: "Syndrome de l'essuie-glace"
      ponderation: "+++"
      note_conditionnelle: "+ plus si genou à 30°"
```

### 6.2 Exploitation par l'IA

- L'IA **croise les signes recueillis** (histoire + examen) avec la matrice pour **classer les hypothèses**.
- Chaque hypothèse est **justifiée par les signes contributifs** (traçabilité).
- **Gouvernance** : la base est maintenue/validée par les kinés (responsabilité clinique). L'IA propose à partir des fiches, le kiné valide — **aide à la décision, sans diagnostic autonome**.

---

## 7. Références sources

| Référence | Nature |
| --- | --- |
| Questionnaire « Analyse de course » existant | Base du questionnaire général (Étape 1) |
| Bilan exemple « Analyse de course » (Sarah DAVID) | Référence de mise en forme du bilan (Étape 9) |
| Fiches « La Clinique Du Coureur » | Source des matrices de diagnostic différentiel (Étape 3) |
| Maia | Dossier patient existant (prise de RDV, hors appli) |
| ValdHub / VALD | Source données de force et mobilité |
| Vitruve | Source données fonctionnelles |
| Stryd | Source données biomécaniques de course |
