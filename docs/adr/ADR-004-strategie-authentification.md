# ADR 004 : Délégation de l'authentification (OIDC)

**Statut :** Accepté
**Date :** 2026-06-06

## Contexte
L'application doit gérer des comptes de professionnels de santé avec un haut niveau de sécurité, potentiellement avec du MFA (Multi-Factor Authentication).

## Décision
Ne pas implémenter de système d'authentification "maison". Déléguer la gestion des identités à un Identity Provider (IdP) externe certifié (ex: Auth0, Clerk, ou Azure AD B2C) via les standards OAuth2 / OIDC.

## Conséquences
- **Avantages** : Sécurité robuste par défaut, MFA inclus, gestion simplifiée des mots de passe oubliés et des politiques de sécurité.
- **Inconvénients** : Coût potentiel lié à l'IdP, couplage fort avec le service choisi.
