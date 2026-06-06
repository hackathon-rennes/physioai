# [TASK-XXX] — [Titre de la Task]

> **Use Case parent** : [UC-XXX-YY]
> **Epic** : [EPIC-XXX]
> **Type** : Feature | Bug | Refactor | Chore
> **Couche** : Frontend | Backend | Full-Stack | Infrastructure
> **Estimation** : [0.5j | 1j | 2j | 3j]
> **Assigné à** : [Agent / Développeur]

---

## 📝 Description

[Description concise de ce qui doit être implémenté. Une task = une fonctionnalité atomique.]

## 🎯 Objectif

[Pourquoi cette task est nécessaire — lien avec le Use Case parent]

## 📋 Périmètre

**Inclus** :
- [Ce qui doit être fait]
- [Ce qui doit être fait]

**Exclus** :
- [Ce qui n'est PAS dans cette task]
- [Ce qui sera traité dans une autre task]

## 🔧 Implémentation technique

### Frontend (si applicable)
- Composant(s) à créer/modifier : `[ComponentName]`
- Page(s) concernée(s) : `[app/[route]/page.tsx]`
- Endpoint(s) API consommés : `[GET/POST /api/...]`
- États gérés : [description des states]

### Backend (si applicable)
- Endpoint(s) à créer : `[METHOD /api/v1/...]`
- Service(s) impacté(s) : `[ServiceName]`
- Repository/DB : [tables/collections modifiées]
- Events émis : `[event.name]`

### Base de données (si applicable)
```sql
-- Migration à créer
ALTER TABLE [table] ADD COLUMN [column] [type];
CREATE INDEX [idx_name] ON [table]([column]);
```

## ✅ Definition of Done

- [ ] Code implémenté et fonctionnel
- [ ] Tests unitaires écrits et passants (coverage maintenu > 80%)
- [ ] Tests d'intégration mis à jour si nécessaire
- [ ] Pas de régression sur les tests existants
- [ ] Code review effectuée (si développeur humain)
- [ ] Linting et type-check passants
- [ ] Documentation mise à jour si changement d'API
- [ ] Issue GitHub fermée avec référence au PR

## 🔗 Dépendances

**Tasks prérequises** :
- [TASK-YYY] : [raison]

**Tasks débloquées par cette task** :
- [TASK-ZZZ] : [raison]

## 🧪 Scénarios de test

```
Tester que :
- [ ] [Comportement attendu 1]
- [ ] [Comportement attendu 2]
- [ ] [Gestion d'erreur 1]
```

## 📎 Ressources

- [Lien vers la documentation pertinente]
- [Lien vers le Use Case parent]

---
*Généré par JV-F4CT0RY — [Date]*
