# ADR 005 : Génération des PDF côté Backend

**Statut :** Accepté
**Date :** 2026-06-06

## Contexte
Les patients doivent pouvoir recevoir leur programme sous format PDF. Ce document doit avoir une présentation soignée (graphiques, tableaux de bord).

## Décision
La génération PDF se fera côté backend en utilisant un outil de rendu HTML vers PDF (ex: Puppeteer ou Playwright) basé sur des templates HTML/CSS.

## Conséquences
- **Avantages** : Permet de réutiliser les compétences HTML/CSS de l'équipe pour designer les documents. Identique sur tous les environnements.
- **Inconvénients** : Le rendu via un navigateur headless consomme beaucoup de mémoire et de CPU sur le backend. Une file de messages (queue) pourrait être nécessaire en production pour ne pas bloquer les requêtes.
