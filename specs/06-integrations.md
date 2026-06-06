# 06 — Intégrations & API externes

## 1. Vue d'ensemble

| Intégration | Rôle | MVP | V2 |
|-------------|------|-----|-----|
| **Maia** | Dossier patient + RDV (source de vérité administrative) | Lecture dossiers/RDV, e-mail patient | — |
| **E-mail transactionnel** | Envoi du questionnaire en amont (lien sécurisé) | Oui | Relances automatiques |
| **VALD** | Force (étape 4) + Mobilité (étape 5) | **Import fichier CSV/FIT** | API VALD temps réel |
| **Vitruve** | Test fonctionnel (étape 6) | Import fichier | API |
| **Stryd** | Analyse tapis (étape 7) | Import fichier CSV/FIT | API / sync capteur |
| **Moteur IA** | Profil, questions, diagnostic, rédaction bilan | Oui (avec validation kiné) | Amélioration continue |

> **Décision MVP** : les données capteurs (VALD/Vitruve/Stryd) entrent par **import de fichier**, pas par API. L'API VALD est explicitement **reportée en V2**.

---

## 2. Maia

- **Usage** : récupérer les patients à venir et leur e-mail au lancement d'une analyse. Le dossier patient existe déjà dans Maia (les informations patient en proviennent).
- **Flux** : `GET /maia/patients?upcoming=true` → alimente le sélecteur d'accueil et le pré-remplissage e-mail/RDV.
- **À cadrer** : mode d'intégration disponible (API, export, connecteur), périmètre des champs accessibles, fréquence de synchronisation.

---

## 3. E-mail (questionnaire en amont)

- **Déclencheur** : `POST /analyses/:id/questionnaire/send`.
- **Contenu** : e-mail brandé PhysioRunningLab + **lien personnel sécurisé** (`secureLinkId`).
- **Retour de complétion** : webhook interne (`submit`) → statut `completed` → pré-remplissage étape 1.
- **Contrainte** : prestataire compatible avec l'hébergement de données de santé / chaîne de traitement conforme (voir `08-conformite-rgpd-hds.md`).

---

## 4. Imports de fichiers capteurs (étapes 4–7)

### Principe
- Composant générique `<FileImport>` : zone de dépôt, validation du format, **rattachement au test/patient courant**, parsing → métriques normalisées (`MetricDG`).
- Formats : **CSV / FIT**.

### Spécificités par source
| Source | Fichier type (maquette) | Particularités de parsing |
|--------|-------------------------|---------------------------|
| VALD | `VALD_ForceFrame_*.csv`, `VALD_HumanTrak_*.csv` | Fichier « List Testing » : colonnes **Droite / Gauche / Normes** ; consolide mobilité + forces + fonctionnels |
| Vitruve | `Vitruve_CMJ_*.csv` | Sauts, puissance, profil charge-vitesse |
| Stryd | `Stryd_tapis_*.fit` | Puissance, cadence, GCT D/G, oscillation, LSS, longueur de foulée |

### À cadrer avec le client
- Schémas réels des exports (en-têtes de colonnes, unités, séparateurs, encodage).
- Mapping colonnes → champs `parsedMetrics`.
- Gestion des versions de format (les outils évoluent).
- Règles de calcul des **asymétries** et des **flags** (seuils ok/warn/bad) — **responsabilité clinique du kiné**.

> Recommandation : définir un **adaptateur par source** (`valdAdapter`, `vitruveAdapter`, `strydAdapter`) isolant le parsing, pour préparer le passage aux API en V2 sans changer le reste.

---

## 5. Moteur IA

### Rôles
| Étape | Fonction IA | Garde-fou |
|-------|-------------|-----------|
| 2 | Pré-profil + questions complémentaires | Kiné édite/valide/retire |
| 3 | Diagnostic différentiel à partir des fiches (RAG) | Kiné valide chaque hypothèse + **traçabilité par signes** |
| 9 | Rédaction des 2 bilans (patient/expert) | Kiné valide/édite avant publication |

### Base de connaissances (diagnostic différentiel)
- **Format unique et homogène** des fiches pathologie (matrices signe ↔ pathologie, pondérations ordinales `--- → +++`, notes conditionnelles).
- Ingestion par l'IA en **RAG** : l'IA croise les signes recueillis avec la matrice, classe les hypothèses, et **justifie chaque hypothèse par les signes contributifs**.
- **Gouvernance** : contenu maintenu/validé par les kinés (responsabilité clinique). L'IA **propose**, le kiné **dispose**.

### Exigences techniques
- Traçabilité des entrées/sorties IA (journal) pour audit clinique.
- Versionnement des prompts/modèles utilisés.
- Hébergement/traitement conforme aux données de santé (pas de fuite vers des services non conformes).
- Robustesse : l'IA ne doit jamais publier sans validation humaine (verrou applicatif).

---

## 6. Tableau récapitulatif des endpoints (proposition)

| Domaine | Endpoint | Méthode |
|---------|----------|---------|
| Patients Maia | `/maia/patients?upcoming=true` | GET |
| Analyse | `/analyses` | POST |
| Questionnaire amont | `/analyses/:id/questionnaire/send` | POST |
| Questionnaire public | `/public/q/:secureLinkId/{save,submit}` | POST |
| Profil IA (étape 2) | `/analyses/:id/ia/profile` | POST |
| Diagnostic (étape 3) | `/analyses/:id/ia/diagnostic` | POST |
| Import capteur (4–7) | `/analyses/:id/imports` | POST (multipart) |
| Observation vidéo (8) | `/analyses/:id/observation` | PUT |
| Bilan (9) | `/analyses/:id/report/{generate,validate,publish,pdf}` | POST |
| Traçabilité | `/analyses/:id/journal` | GET |
