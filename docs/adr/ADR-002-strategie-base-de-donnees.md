# ADR 002: Stratégie de Base de Données

## Statut
Accepté

## Contexte
PhysioAI manipule des données de santé personnelles (DSP). Ces données requièrent un chiffrement au repos et en transit, une traçabilité totale (audit logs) et une haute disponibilité.

## Décision
- **Base de données relationnelle** : Azure Database for PostgreSQL - Flexible Server (Zone Redundant).
- **ORM** : Prisma.
- **Réseau** : Déploiement dans un subnet privé via Azure Private Link (aucun accès public).

## Conséquences
- **Avantages** : Conformité HDS, backups automatiques 35 jours, chiffrement via Azure Key Vault par défaut. Prisma accélère le développement.
- **Inconvénients** : Coût d'infrastructure fixe pour l'instance managée.
