# Questionnaire général patient — PhysioRunningLab

> Étape 1 du workflow — rempli par le **patient/coureur**
> Repris du questionnaire « Analyse de course » existant
> Version mobile, sauvegarde progressive, reprise possible

---

## Principes de saisie

- **Sauvegarde progressive** : le patient peut quitter et reprendre sans perte.
- **Logique conditionnelle** : certains champs ne s'affichent que sous condition (voir mentions « ⟶ si… »).
- **Champs typés** ; caractère obligatoire/optionnel à valider avec le kiné (indiqué `[obligatoire]` / `[optionnel]` à titre de proposition).
- **Sortie** : profil coureur structuré et normalisé.

---

## Bloc 1 — Profil & morphologie

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Sexe | énuméré (H / F / Autre) | [obligatoire] | |
| Âge | numérique (années) | [obligatoire] | |
| Taille | numérique (cm) | [obligatoire] | |
| Poids | numérique (kg) | [obligatoire] | Sert au calcul des métriques rapportées au poids (W/kg) |
| Club ou association | texte | [optionnel] | |

---

## Bloc 2 — Pratique de course

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Nombre d'années de course | numérique (années) | [obligatoire] | |
| Volume hebdomadaire | numérique (km/semaine) | [obligatoire] | |
| Spécialité | énuméré / texte (distance ou discipline) | [obligatoire] | Ex. 5/10 km, semi, marathon, trail, piste |
| Changements récents dans l'entraînement | texte libre | [optionnel] | Volume, intensité, surface, chaussures, etc. |

---

## Bloc 3 — Équipement

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Chaussures utilisées | texte | [obligatoire] | Marque / modèle |
| Indice minimaliste | numérique / échelle | [optionnel] | |
| Orthèses plantaires | booléen (oui / non) | [obligatoire] | **Déclencheur conditionnel** |
| ⟶ Ancienneté du port | numérique (mois/années) | [obligatoire si « oui »] | **Affiché uniquement si orthèses = oui** |
| ⟶ Motif de prescription | texte | [obligatoire si « oui »] | **Affiché uniquement si orthèses = oui** |

---

## Bloc 4 — Antécédents

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Antécédents médicaux | texte libre | [optionnel] | |
| Blessures en course à pied | booléen / liste | [obligatoire] | **Déclencheur de saisie détaillée** |

### ⟶ Saisie détaillée des blessures (affichée si « blessures » renseigné)

Répéter pour chaque blessure :

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Zone | énuméré (ex. genou, cheville, mollet, hanche, pied, dos…) | [obligatoire] | |
| Date | date / période | [obligatoire] | |
| Statut | énuméré (en cours / résolue / récidivante) | [obligatoire] | |

---

## Bloc 5 — Attentes

| Champ | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| Attente(s) vis-à-vis de l'analyse | texte libre | [obligatoire] | Objectif / motivation / question principale du patient |

---

## Sortie de l'Étape 1

À la complétion, le système génère un **profil coureur structuré (données normalisées)**, transmis à l'**Étape 2 (première analyse IA)** qui produit le pré-profil et la trame d'interview.
