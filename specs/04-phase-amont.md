# 04 — Phase amont (accueil & envoi du questionnaire)

Phase **précédant** le workflow d'analyse. Le kiné lance une analyse pour un patient issu de Maia, vérifie son e-mail et déclenche l'envoi du questionnaire **avant le RDV**. Les réponses pré-remplissent l'étape 1.

Réf. maquette : `#homeView`, `#previewModal`, fonctions `renderPatients`, `pickPatient`, `sendQuestionnaire`, `simulatePatient`, `openPreview`, `openAnalysis`, `goHome`.

---

## 1. Parcours cible

```
Prise de RDV dans Maia
        │  (dossier + e-mail patient synchronisés)
        ▼
[Accueil kiné] ──► Sélection patient ──► Vérif e-mail ──► « Envoyer le questionnaire »
        │                                                        │
        │                                                  e-mail transactionnel
        │                                                  (lien sécurisé personnel)
        ▼                                                        ▼
Suivi du statut  ◄──── webhook « complété » ◄──── Patient remplit (mobile, en amont)
        │
        ▼
« Ouvrir l'analyse » ──► Workflow, Étape 1 PRÉ-REMPLIE (source = patient_amont)
```

---

## 2. Écran d'accueil — composants

### 2.1 Hero + statistiques
- Salutation kiné + résumé : RDV à venir, questionnaires en attente, patients prêts à analyser.
- En cible : valeurs calculées depuis l'API (compteurs dérivés des statuts `QuestionnaireAmont`).

### 2.2 Carte « Lancer une analyse de course » (`.new-analysis`)
| Élément | ID maquette | Comportement cible |
|---------|-------------|--------------------|
| Bandeau source Maia | `.maia-src` | Indique que les patients viennent de Maia |
| Sélecteur patient | `#patientPick` | Liste des patients Maia (RDV à venir). `onChange → pickPatient` |
| Date du RDV | `#naRdv` | Lecture seule, depuis Maia |
| E-mail patient | `#naEmail` | **Pré-rempli depuis Maia, éditable** (obligatoire) |
| Case « envoyer maintenant » | `#naSendNow` | Permet de créer l'analyse sans envoyer tout de suite |
| Bouton envoi | — | `sendQuestionnaire()` → POST API |
| Confirmation | `#sendConfirm` | Timeline de statut (3 jalons) |

**Règle** : e-mail vide → blocage + message. En cible : validation format e-mail + vérification cohérence avec Maia.

### 2.3 Aperçu e-mail patient (`.mail-preview`)
Rendu de l'e-mail réellement envoyé : branding PhysioRunningLab, objet, corps tutoyé, **CTA « Remplir mon questionnaire »**, mention sécurité (lien personnel, sauvegarde progressive, mobile, **HDS/RGPD**). Champs dynamiques : `#mailTo`, `#mailName`, `#mailRdv`.

### 2.4 Liste patients & RDV (`table.patients`)
Colonnes : Patient · Rendez-vous · **Statut questionnaire amont** · Action.

| Statut | Classe badge | `q` (maquette) |
|--------|--------------|----------------|
| Non envoyé | `.qb-none` | `none` |
| Questionnaire envoyé | `.qb-sent` | `sent` |
| En cours de remplissage | `.qb-prog` | `prog` |
| Complété | `.qb-done` | `done` |

Action « Ouvrir l'analyse » : bouton **primaire** si `done`, **fantôme** sinon (on peut toujours ouvrir et saisir en séance).

### 2.5 Modale aperçu patient (`#previewModal`)
Vue mobile de ce que le patient reçoit/remplit (5 blocs condensés). Bouton **« Valider mes réponses »** = simulation de complétion (`simulateFromModal` → `simulatePatient`). En cible : remplacer par le **vrai formulaire patient multi-pages** servi sur le lien sécurisé.

---

## 3. Machine à états du questionnaire amont

```
none ──[sendQuestionnaire]──► sent ──[patient ouvre le lien]──► in_progress
                                                                     │
                                                          [patient valide]
                                                                     ▼
                                                                completed
```

| Transition | Déclencheur réel (cible) | Effet UI |
|------------|--------------------------|----------|
| `none → sent` | POST `/analyses/:id/questionnaire/send` (e-mail envoyé) | badge bleu, timeline jalon 1 ✓ |
| `sent → in_progress` | Webhook « lien ouvert » / 1ère sauvegarde | badge orange |
| `in_progress → completed` | Webhook « questionnaire validé » | badge vert, jalons 2 & 3 ✓ |

> Dans la maquette, `in_progress` est pré-affiché (Marc) et la complétion est déclenchée manuellement (`simulatePatient`) pour la démonstration.

---

## 4. Pré-remplissage de l'étape 1 (`openAnalysis`)

À l'ouverture de l'analyse, l'état de l'étape 1 dépend du statut amont :

| Statut amont | Bandeau étape 1 (`#step1Banner`) | Étape 1 | Sidebar |
|--------------|----------------------------------|---------|---------|
| `completed` | **Vert** « Questionnaire rempli par le patient en amont » | champs **pré-remplis**, étape marquée `done` | chip `#amontChip` visible, progression +1/9 |
| `none/sent/in_progress` | **Ambre** « Questionnaire non complété en amont » | à saisir en séance (le kiné pose les questions) | chip masqué |

Logique cible :
```ts
const prefilled = analyse.questionnaireAmont.status === 'completed';
step1.source = prefilled ? 'patient_amont' : 'kine_seance';
if (prefilled) { step1.data = mapQuestionnaireToStep1(answers); markStepDone(1); }
```

---

## 5. Endpoints API suggérés (phase amont)

| Méthode | Route | Rôle |
|---------|-------|------|
| `GET` | `/maia/patients?upcoming=true` | Liste des patients/RDV à venir |
| `POST` | `/analyses` | Créer une analyse `{ patientId, rdv }` |
| `POST` | `/analyses/:id/questionnaire/send` | Envoyer le questionnaire `{ email }` |
| `GET` | `/analyses/:id/questionnaire` | Statut + réponses |
| `POST` | `/public/q/:secureLinkId/save` | Sauvegarde progressive (côté patient) |
| `POST` | `/public/q/:secureLinkId/submit` | Validation finale (→ `completed`, webhook) |

**Sécurité** : le lien patient (`secureLinkId`) est un jeton à usage personnel, à durée de vie limitée, sans authentification lourde mais non devinable (voir `08-conformite-rgpd-hds.md`).

---

## 6. Critères d'acceptation (phase amont)

- [ ] Le kiné peut sélectionner un patient Maia et voir l'e-mail pré-rempli, modifiable.
- [ ] L'envoi est bloqué si l'e-mail est absent/invalide.
- [ ] Après envoi, le statut passe à « envoyé » et l'e-mail patient correspond à l'aperçu.
- [ ] À réception, le patient remplit le questionnaire depuis mobile avec sauvegarde progressive.
- [ ] À la complétion, le statut passe à « complété » et l'étape 1 est pré-remplie (source `patient_amont`).
- [ ] Si non complété, le kiné peut ouvrir l'analyse et saisir le questionnaire en séance.
- [ ] Bouton « ← Accueil » disponible depuis le workflow.
