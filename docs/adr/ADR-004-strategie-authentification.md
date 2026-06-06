# ADR 004: Stratégie d'Authentification

## Statut
Accepté

## Contexte
L'application cible deux populations : les physiothérapeutes (pros) et les patients. Le standard de sécurité pour la santé requiert le multi-facteur (MFA).

## Décision
- **Service** : Microsoft Entra External ID (anciennement Azure AD B2C).
- **Implémentation** : OpenID Connect (OIDC) avec MFA obligatoire pour les praticiens. Les tokens JWT seront vérifiés par l'API Gateway et le backend NestJS.

## Conséquences
- **Avantages** : Délégation complète de la sécurité identité à Microsoft, support natif du MFA et des flux de réinitialisation de mot de passe.
- **Inconvénients** : Personnalisation de l'UI des pages de connexion B2C parfois complexe.
