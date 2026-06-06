#!/usr/bin/env python3
"""
Generate factory-output/github-init-complete.json from factory-output/planning-complete.json
Usage: python scripts/generate_github_init.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLANNING = ROOT / "factory-output" / "planning-complete.json"
OUT = ROOT / "factory-output" / "github-init-complete.json"


def slugify(s: str) -> str:
    return (
        s.lower()
        .replace(" ", "-")
        .replace("/", "-")
        .replace("'", "")
        .replace("__", "-")
    )


def main():
    with PLANNING.open(encoding="utf-8") as f:
        planning = json.load(f)

    # labels: prefer planning.github_labels if present
    labels = planning.get("github_labels") or []

    # build issues from use_cases
    use_cases = planning.get("use_cases", [])

    issues = {}
    useCaseToIssue = {}
    for uc in use_cases:
        uid = uc.get("id") or uc.get("uc_id")
        title = f"📖 [{uid}] {uc.get('title','')}".strip()
        # build body: short context + acceptance criteria
        context = uc.get("epic_id", "")
        acceptance = uc.get("acceptance_criteria") or []
        body_parts = []
        if context:
            body_parts.append(f"Epic: {context}")
        if uc.get("preconditions"):
            body_parts.append("Preconditions:\n- " + "\n- ".join(uc.get("preconditions")))
        if acceptance:
            body_parts.append("Critères d'acceptation:\n- " + "\n- ".join(acceptance))
        body = "\n\n".join(body_parts)

        # labels: map actor roles to labels (frontend/backend) and add use-case
        issue_labels = ["use-case"]
        actors = uc.get("actor_primary") or uc.get("actors")
        if actors:
            # simple mapping
            if "Frontend" in str(actors) or "Patient" in str(actors) or "Kiné" in str(actors):
                issue_labels.append("frontend")
            if "Backend" in str(actors) or "Système" in str(actors) or "Admin" in str(actors):
                issue_labels.append("backend")
        # priority from epic
        epic_priority = None
        epic_id = uc.get("epic_id")
        for e in planning.get("epics", []):
            if e.get("id") == epic_id:
                epic_priority = e.get("priority")
                break
        if epic_priority:
            if "Must" in epic_priority:
                issue_labels.append("must-have")
            elif "Should" in epic_priority:
                issue_labels.append("should-have")

        issues[uid] = {
            "title": title,
            "body": body,
            "assignee": None,
            "labels": issue_labels,
        }
        useCaseToIssue[uid] = title

    # choose initial branches from the highest-priority tasks (by story_points if available)
    tasks = planning.get("tasks", [])
    # pick first 8 tasks
    initial_branches = []
    for t in tasks[:8]:
        tid = t.get("id")
        use_case = t.get("use_case_id") or t.get("use_case") or t.get("use_case_id")
        short = slugify(t.get("title", tid)[:40])
        branch = f"feature/{(use_case or tid)}-{short}"
        initial_branches.append({"task_id": tid, "branch": branch})

    pr_template = {
        "title": "PR: <type>/<référence> - Court résumé",
        "body": "Résumé:\n- Quel est le changement principal ?\n\nContexte / problème:\n- Pourquoi ce changement est-il nécessaire ?\n\nSolution proposée:\n- Description concise de l'implémentation.\n\nChecklist (obligatoire):\n- [ ] J'ai lié cette PR à l'issue correspondante (ex: #UC-002)\n- [ ] Les tests unitaires associés sont ajoutés/retournent OK\n- [ ] La CI passe localement et sur la PR\n- [ ] J'ai ajouté la documentation nécessaire (`docs/` ou commentaires)\n- [ ] J'ai demandé une revue (assigner au relecteur)\n        ",
        "checklist_items": [
            "Lien vers l'issue",
            "Tests unitaires",
            "CI verte",
            "Documentation",
            "Demande de revue",
        ],
    }

    out = {
        "version": "1.0",
        "produced_at": planning.get("project", {}).get("generated_at"),
        "produced_by": "generate_github_init.py",
        "repository": {
            "owner": "<GITHUB_ORG>",
            "name": planning.get("project", {}).get("name", "physioai"),
            "url": f"https://github.com/<GITHUB_ORG>/{planning.get('project',{}).get('name','physioai')}"
        },
        "labels": labels,
        "issues": issues,
        "branch_naming_convention": "feature/<UC-or-TASK>-<short-kebab-desc> | fix/<bug-id>-<short-desc> | hotfix/<short-desc>",
        "initial_branches": initial_branches,
        "pr_template": pr_template,
        "useCaseToIssue": useCaseToIssue,
        "stats": {
            "total_use_cases": len(use_cases),
            "issues_created": len(use_cases),
            "labels_created": len(labels),
        },
        "notes": {
            "paths": {
                "planning_file": str(PLANNING.relative_to(ROOT)),
                "handoff_file": str(OUT.relative_to(ROOT)),
            },
            "remarks": "Vérifier les assignees/milestones et remplacer <GITHUB_ORG> avant création automatique."
        }
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"Written {OUT}")


if __name__ == "__main__":
    main()
