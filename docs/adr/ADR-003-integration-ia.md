# ADR 003 : Délégation de l'IA à un service tiers (OpenAI)

**Statut :** Accepté
**Date :** 2026-06-06

## Contexte
L'application doit analyser des bilans cliniques et générer des plans de course personnalisés de manière intelligente.

## Décision
Nous utiliserons une API LLM tierce (ex: API OpenAI via Azure OpenAI pour des raisons de conformité santé/RGPD) plutôt que d'héberger un modèle local.

## Conséquences
- **Avantages** : Qualité de génération très élevée d'emblée, pas d'infrastructure GPU coûteuse à maintenir, mise en place rapide.
- **Inconvénients** : Dépendance à un tiers, coût à la requête, nécessité de pseudonymiser les données patient envoyées dans le prompt pour respecter le RGPD/HDS.
