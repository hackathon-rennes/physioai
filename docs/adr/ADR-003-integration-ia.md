# ADR 003: Intégration de l'Intelligence Artificielle

## Statut
Accepté

## Contexte
La solution doit générer des résumés de séances et des parcours de soins. L'utilisation d'IA générative avec des DSP exige une stricte isolation des données (pas d'entraînement sur les données clients).

## Décision
- **Fournisseur IA** : Microsoft Foundry / Azure OpenAI Service (Région Europe certifiée de préférence France Central).
- **Modèle** : GPT-4o (Preview) ou équivalent.
- **Sécurité** : Accès exclusif via Azure Private Endpoint + Managed Identity.

## Conséquences
- **Avantages** : Les requêtes (prompts) restent dans la boundary de sécurité du VNet. Azure garantit que les données ne sont pas utilisées pour réentraîner les modèles.
- **Inconvénients** : Quotas réseau et dépendance forte à la disponibilité d'Azure OpenAI dans la région cible.
