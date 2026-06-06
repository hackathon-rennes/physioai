# JV-F4CT0RY

> Transforme une expression de besoin brute en livrable logiciel complet, en orchestrant une équipe d'agents IA spécialisés via GitHub Copilot Agent Teams.

---

## Concept

La **JV-F4CT0RY** est une factory logicielle pilotée par un **Factory Director** (agent IA) qui coordonne jusqu'à 11 agents spécialisés organisés en 3 phases séquentielles et vagues parallèles.

```
Expression de besoin  →  Planning  →  GitHub Init  →  Exécution  →  Livrable
```

---

## Architecture

### Phase 1 — Discovery & Planning (parallèle)

| Agent | Rôle | Output |
|-------|------|--------|
| `product-manager` | Epics fonctionnels + Use Cases | `factory-output/epics/`, `factory-output/use-cases/` |
| `tech-architect` | Tech Tasks + ADRs techniques | `factory-output/tech-tasks/`, `factory-output/adr/` |

Handoff : `factory-output/planning-complete.json`

### Phase 2 — GitHub Initialization (solo)

| Agent | Rôle | Output |
|-------|------|--------|
| `github-orchestrator` | Milestones, Issues, Labels sur GitHub | `factory-output/github/` |

Handoff : `factory-output/github-init-complete.json`

### Phase 3 — Execution (vagues parallèles)

**Wave 1 — Fondations**

| Agent | Rôle |
|-------|------|
| `cloud-architect` | Architecture Azure + diagrammes C4 + ADRs |

**Wave 2 — Développement (4 agents en parallèle)**

| Agent | Rôle |
|-------|------|
| `frontend` | UI/UX, composants React/Vue/Next.js |
| `backend` | API REST/GraphQL, services, domaine métier |
| `security` | Threat model, SAST, politiques de sécurité |
| `iac` | Terraform Azure, modules réutilisables |

**Wave 3 — Validation (3 agents en parallèle)**

| Agent | Rôle |
|-------|------|
| `unit-test` | Tests unitaires front + back (coverage > 80%) |
| `integration-test` | Tests d'intégration, E2E, contrats |
| `cicd` | GitHub Actions, pipelines, quality gates |

---

## Structure du projet

```
jv-f4ct0ry/
├── .github/
│   └── copilot-instructions.md         # Orchestrateur principal
├── .github/agents/
│   ├── 01-product-manager/
│   ├── 02-tech-architect/
│   ├── 03-github-orchestrator/
│   ├── 04-cloud-architect/
│   ├── 05-frontend/
│   ├── 06-backend/
│   ├── 07-security/
│   ├── 08-iac/
│   ├── 09-cicd/
│   ├── 10-unit-test/
│   ├── 11-integration-test/
│   └── 12-doc-lead/
├── .github/templates/                   # Templates d'artifacts
│   ├── adr-template.md
│   ├── epic-template.md
│   ├── task-template.md
│   ├── tech-task-template.md
│   └── use-case-template.md
├── .github/workflows/                   # Séquences d'orchestration
│   ├── phase1-discovery.md
│   ├── phase2-github-init.md
│   └── phase3-execution.md
└── factory-output/              # Artifacts générés (ne pas supprimer)
```

---

## Utilisation

### Prérequis

```bash
export GITHUB_TOKEN="ghp_..."          # GitHub PAT (scopes: repo + issues)
export GITHUB_ORG="your-org"
export AZURE_SUBSCRIPTION_ID="..."
export AZURE_TENANT_ID="..."
export AZURE_CLIENT_ID="..."
export AZURE_CLIENT_SECRET="..."
export PROJECT_NAME="my-project"
```

### Lancer la factory

Depuis GitHub Copilot CLI, dans le répertoire `jv-f4ct0ry/` :

```
/factory-start <expression de besoin>
```

Exemple :
```
/factory-start Application SaaS de gestion de flotte de véhicules électriques,
multi-tenant, avec tableau de bord temps réel, API mobile, et alertes prédictives.
```

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `/factory-start` | Lance la factory depuis une expression de besoin |
| `/epic-launch <epic-id>` | Démarre l'agent pour un epic spécifique |
| `/factory-status` | Affiche l'état de toute la team |
| `/factory-review` | Lance une revue cross-agents du code produit |

---

## Standards appliqués

- **Cloud-Native** : 12-Factor App, stateless, health checks, graceful shutdown
- **Azure** : Container Apps, Key Vault, Managed Identity, Private Endpoints, Zone-Redundant
- **Sécurité** : OWASP Top 10, JWT, rate limiting, RBAC, HTTPS/HSTS
- **DevOps** : Trunk-based dev, feature flags, blue/green deployments, conventional commits
- **Qualité** : Coverage > 80% unit / > 60% integ, TypeScript strict, OpenAPI, ADRs

---

## Modèles IA utilisés

| Rôle | Modèle | Raison |
|------|--------|--------|
| Factory Director, Cloud Architect, Tech Architect | `gemini-3.1-pro-preview` | Raisonnement complexe, architecture |
| Tous les autres agents | `gemini-3.1-pro-preview` | Rapidité, coût optimisé |