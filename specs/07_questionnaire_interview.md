# Questionnaire / trame d'interview — PhysioRunningLab

> Étape 3 du workflow — interview de ~10 min menée par le **kiné/expert**, **assistée par l'IA**
> Trame issue de l'Étape 2 (pré-profil IA + questions complémentaires validées par le kiné)

---

## Principes de conduite

- Le kiné **conduit l'interview** ; l'IA **assiste en temps réel** (suggestions de relances, prise de notes).
- La trame de départ est **personnalisée** : elle provient des questions complémentaires générées par l'IA (Étape 2), que le kiné a **éditées / validées / retirées**.
- En cas de **blessure détectée**, l'IA déclenche la **branche diagnostic différentiel** (matrices pathologies) et fait évoluer les questions.
- **Validation kiné** : chaque hypothèse de diagnostic est **validée ou invalidée** par le kiné avant de poursuivre.
- **Sortie** : diagnostic différentiel + hypothèses cliniques validées.

---

## Section A — Confirmation & approfondissement du profil

Questions de relance issues du pré-profil IA. Objectif : préciser le « profil de coureur ».

| # | Thème | Question type (à personnaliser par l'IA) | Saisie |
| --- | --- | --- | --- |
| A1 | Pratique | Évolution récente du volume / de l'intensité ? | Notes |
| A2 | Objectifs | Échéance / compétition visée ? | Notes |
| A3 | Sensations | Gêne, douleur ou fatigue particulière à la course ? | Booléen + notes |
| A4 | Équipement | Changement récent de chaussures / surface ? | Notes |
| A5 | Sommeil / charge | Récupération, sommeil, charge de vie ? | Notes |

> Les questions A* sont **générées dynamiquement** par l'IA à partir du questionnaire (Étape 1) ; le tableau ci-dessus est un cadre indicatif.

---

## Section B — Branche décisionnelle : présence de blessure ?

```
Blessure / douleur identifiée ?
├─ NON  → poursuivre le profil, passer aux tests physiques (Étapes 4-7)
└─ OUI  → déclencher le DIAGNOSTIC DIFFÉRENTIEL (Section C)
```

| Champ | Type | Notes |
| --- | --- | --- |
| Blessure / douleur présente | booléen (oui / non) | Déclencheur de la Section C |
| Zone concernée | énuméré | Sélectionne la **fiche pathologie** pertinente |

---

## Section C — Diagnostic différentiel (si blessure)

L'IA s'appuie sur la **base de connaissances pathologies** (matrices). Voir le format détaillé dans `04_formats_fichiers_references.md`.

### C.1 Recueil des signes — Histoire / examen subjectif

| Champ | Type | Notes |
| --- | --- | --- |
| Mécanisme / circonstances d'apparition | texte | |
| Localisation précise de la douleur | texte / schéma | |
| Facteurs aggravants / soulageants | texte | |
| Ancienneté / évolution | texte | |
| Irradiation | texte | |

### C.2 Recueil des signes — Examen objectif

| Champ | Type | Notes |
| --- | --- | --- |
| Tests cliniques nommés (ex. Noble, Garrick, stress test tibio-fibulaire, SLR…) | énuméré + résultat | Selon la fiche de la zone |
| Palpation | texte | |
| Amplitudes / mises en tension | texte | |
| Signes conditionnels (ex. genou à 30°) | texte | Notes conditionnelles de la matrice |

### C.3 Hypothèses produites par l'IA

Pour chaque hypothèse, l'IA fournit une **justification par les signes contributifs** (traçabilité) :

| Champ | Type | Notes |
| --- | --- | --- |
| Pathologie candidate | texte | Issue des colonnes de la matrice |
| Niveau de plausibilité | échelle | Croisement signes ↔ matrice (`- - -` à `+++`) |
| Signes contributifs | liste | Traçabilité de la justification |
| **Validation kiné** | énuméré (validée / invalidée / à revoir) | **Obligatoire avant de poursuivre** |

---

## Section D — Décision de protocole

| Champ | Type | Notes |
| --- | --- | --- |
| Tests physiques prévus | multi-sélection (force / mobilité / fonctionnel) | Le protocole de force peut être **adapté au diagnostic** |
| Analyse vidéo prévue | booléen | Déclenche Étapes 7-8 |
| Notes du kiné | texte libre | |

---

## Sortie de l'Étape 3

**Diagnostic différentiel + hypothèses cliniques validées par le kiné**, qui orientent la suite du protocole (tests physiques et/ou vidéo) puis alimentent le bilan (Étape 9).

> **Rappel de gouvernance** : l'IA fournit une **aide à la décision**, jamais un diagnostic autonome. La base de connaissances est maintenue/validée par les kinés.
