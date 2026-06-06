# ADR 001: Choix de la stack Frontend et Backend

## Statut
Accepté

## Contexte
PhysioAI nécessite une interface utilisateur réactive (côté patient et praticien) ainsi qu'un backend robuste capable de traiter des règles métiers complexes de santé, tout en étant hébergé sur une infrastructure certifiée HDS (Azure).

## Décision
- **Frontend** : Next.js (React) avec Tailwind CSS.
- **Backend** : NestJS (Node.js/TypeScript).
- **Hébergement** : Azure Container Apps (ACA) derrière Azure Front Door.

## Conséquences
- **Avantages** : TypeScript de bout en bout (partage de types/DTOs). ACA permet un déploiement serverless, scalable à zéro, et sans gestion d'infrastructure sous-jacente.
- **Inconvénients** : Courbe d'apprentissage pour NestJS si l'équipe n'est pas familière avec l'injection de dépendances.
