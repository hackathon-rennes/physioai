# ADR 002 : Base de données évolutive (SQLite vers PostgreSQL)

**Statut :** Accepté
**Date :** 2026-06-06

## Contexte
Nous devons lancer un MVP rapidement à moindre coût, mais l'application gérera des données de santé (nécessitant une conformité HDS en production).

## Décision
Nous utiliserons **SQLite** pour la phase de développement et le MVP initial (hébergement sur une seule instance), et nous migrerons vers **PostgreSQL** géré (ex: Azure Database for PostgreSQL) pour l'environnement de production HDS. Un ORM agnostique (comme Prisma ou TypeORM) sera utilisé.

## Conséquences
- **Avantages** : Démarrage très rapide et coût zéro pour le MVP. Transition fluide vers la prod si l'ORM gère correctement les dialectes.
- **Inconvénients** : Interdiction d'utiliser des fonctionnalités spécifiques à PostgreSQL (ex: JSONB complexe, PostGIS) dans le MVP sous peine de casser la compatibilité SQLite.
