# ADR 005: Génération des rapports PDF

## Statut
Accepté

## Contexte
Les praticiens ont besoin d'exporter des bilans physiothérapeutiques au format PDF. Ce rendu doit être fluide et identique à l'affichage web.

## Décision
- **Technologie** : Puppeteer (headless Chrome).
- **Hébergement** : Microservice NestJS séparé OU Azure Function dédié conteneurisé.
- **Stockage temporaire** : Azure Blob Storage (avec lifecycle management pour suppression auto après 1 heure, accès via SAS tokens à usage unique).

## Conséquences
- **Avantages** : Rendu HTML/CSS parfait. La séparation dans un microservice évite de bloquer la boucle d'événements (Event Loop) du backend principal.
- **Inconvénients** : Les PDF nécessitant Chrome headless consomment beaucoup de RAM (nécessite d'ajuster les profils de ressources ACA).
