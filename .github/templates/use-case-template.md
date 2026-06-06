# [UC-XXX-YY] — [Titre du Use Case]

> **Epic parent** : [EPIC-XXX]
> **Priorité** : Must Have | Should Have | Could Have
> **Complexité** : Simple | Moyenne | Complexe
> **Status** : Backlog | In Progress | Done

---

## 👤 Acteurs

- **Principal** : [Acteur qui initie le use case]
- **Secondaires** : [Autres acteurs impliqués]
- **Système** : [Systèmes tiers impliqués]

## 🔧 Préconditions

1. [Condition 1 requise avant le démarrage]
2. [Condition 2 requise avant le démarrage]

## 🔄 Flux principal (Happy Path)

| Étape | Acteur | Action | Système |
|-------|--------|--------|---------|
| 1 | Utilisateur | [Action] | [Réponse du système] |
| 2 | Système | [Traitement] | [Résultat] |
| 3 | Utilisateur | [Action] | [Réponse du système] |

## 🔀 Flux alternatifs

### Flux A — [Nom du cas alternatif]
*À partir de l'étape X du flux principal :*
- A1. [Action alternative]
- A2. [Résultat]
- Reprend au flux principal à l'étape Y

### Flux B — [Nom du cas alternatif]
- B1. [Action alternative]
- B2. [Résultat]

## ❌ Flux d'erreur

### Erreur E1 — [Nom de l'erreur]
*Condition déclenchante* : [Quand cela arrive]
- [Action du système en cas d'erreur]
- [Message affiché à l'utilisateur]
- [Log généré]

### Erreur E2 — [Nom de l'erreur]
*Condition déclenchante* : [Quand cela arrive]
- [Action du système en cas d'erreur]

## 🏁 Postconditions

1. [État du système après le use case]
2. [Effets de bord attendus (emails, notifications, etc.)]

## ✅ Critères d'acceptation (Gherkin)

```gherkin
Feature: [Titre du Use Case]
  En tant que [acteur]
  Je veux [capacité]
  Afin de [bénéfice]

  Scenario: [Happy path — cas nominal]
    Given [Contexte initial]
    And [Contexte complémentaire]
    When [Action de l'utilisateur]
    Then [Résultat attendu principal]
    And [Résultat attendu secondaire]

  Scenario: [Flux alternatif]
    Given [Contexte alternatif]
    When [Action de l'utilisateur]
    Then [Résultat attendu]

  Scenario: [Cas d'erreur]
    Given [Contexte d'erreur]
    When [Action de l'utilisateur]
    Then [Message d'erreur affiché]
    And [État du système après erreur]

  Scenario Outline: [Cas avec multiples données]
    Given [Contexte]
    When [Action avec <paramètre>]
    Then [Résultat avec <résultat attendu>]

    Examples:
      | paramètre | résultat attendu |
      | valeur1   | résultat1        |
      | valeur2   | résultat2        |
```

## 📋 Tasks de développement

| ID | Titre | Type | Assigné à |
|----|-------|------|-----------|
| [TASK-XXX] | [Titre de la task] | Feature | Frontend |
| [TASK-XXY] | [Titre de la task] | Feature | Backend |
| [TASK-XXZ] | [Titre de la task] | Test | QA |

## 📐 Wireframes / Maquettes

[Lien vers les maquettes Figma ou description de l'UI]

## 🔌 Interfaces techniques

**Endpoints API nécessaires** :
- `POST /api/v1/[ressource]` — [Description]
- `GET /api/v1/[ressource]/:id` — [Description]

**Événements système** :
- `[event.name]` déclenché quand [condition]

---
*Généré par JV-F4CT0RY — [Date]*
