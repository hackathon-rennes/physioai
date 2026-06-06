# Questionnaire / grille d'observation vidéo — PhysioRunningLab

> Étape 8 du workflow — renseigné par le **kiné/expert**
> Analyse visuelle & clinique de la vidéo de course sur tapis (capteur de mouvement Stryd)
> Saisie **manuelle** — pas d'analyse image automatisée (pose estimation) au MVP

---

## Principes de saisie

- La grille est renseignée en **vues frontale et sagittale**, des **deux côtés** (droit et gauche).
- Outils d'annotation : **marqueurs temporels**, **captures**, **grille d'observation standardisée**, **notation/scoring**.
- Chaque item reçoit une **observation structurée + un score**.
- **Sortie** : observations cliniques structurées + scoring, alimentant le bilan (Étape 9).

---

## Structure d'observation par item

Pour chaque item, le kiné renseigne :

| Dimension | Détail |
| --- | --- |
| **Vue** | Frontale / Sagittale |
| **Côté** | Droit / Gauche |
| **Observation** | Description clinique structurée |
| **Score / Notation** | Échelle standardisée (à caler avec le référentiel kiné) |
| **Marqueur temporel** | Timecode(s) de la vidéo |
| **Capture** | Image(s) associée(s) |

---

## Grille des items observés

| # | Item | Vue(s) principale(s) | Côtés | Type de saisie |
| --- | --- | --- | --- | --- |
| 1 | Inclinaison du tronc | Sagittale | D / G | Observation + score |
| 2 | Stabilité du bassin | Frontale | D / G | Observation + score |
| 3 | Valgus dynamique | Frontale | D / G | Observation + score |
| 4 | Flexion du genou | Sagittale | D / G | Observation + score |
| 5 | Pronation du pied | Frontale | D / G | Observation + score |
| 6 | Déplacement vertical | Sagittale | — / bilatéral | Observation + score |
| 7 | Verticalité du tibia | Sagittale | D / G | Observation + score |
| 8 | Type de pose de pied | Sagittale | D / G | Énuméré (attaque talon / médio-pied / avant-pied) + score |
| 9 | Cadence | Sagittale | — / bilatéral | Numérique (pas/min) + score |
| 10 | Bruit | Audio / observation | — / bilatéral | Observation + score |

> **Note** : la **cadence** (item 9) peut être recoupée avec la donnée capteur **Stryd** (Étape 7) pour cohérence.

---

## Grille de saisie détaillée (modèle)

Pour chaque item ci-dessus, dupliquer la structure :

```
Item : [nom de l'item]
├─ Vue frontale
│  ├─ Côté droit  : observation ___________  score [ ]  timecode ____  capture ____
│  └─ Côté gauche : observation ___________  score [ ]  timecode ____  capture ____
└─ Vue sagittale
   ├─ Côté droit  : observation ___________  score [ ]  timecode ____  capture ____
   └─ Côté gauche : observation ___________  score [ ]  timecode ____  capture ____
```

*(Renseigner uniquement la/les vue(s) pertinente(s) pour l'item, conformément à la grille.)*

---

## Synthèse de l'observation vidéo

| Champ | Type | Notes |
| --- | --- | --- |
| Synthèse clinique globale | texte libre | Lecture d'ensemble du pattern de course |
| Asymétries notables D/G | texte / liste | Items présentant un écart marqué |
| Points prioritaires | liste | À reporter dans le plan d'action du bilan |

---

## Sortie de l'Étape 8

**Observations cliniques structurées + scoring**, agrégées avec les autres étapes (1 → 7) pour la **génération du bilan (Étape 9)**.
