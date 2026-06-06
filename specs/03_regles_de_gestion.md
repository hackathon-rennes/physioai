# Règles de gestion — PhysioRunningLab

> Analyse clinique du coureur — application web responsive
> Workflow d'analyse en 9 étapes
> Document de travail — 06 juin 2026

Ce document liste les règles de gestion (RG) qui encadrent le comportement de l'application. Chaque règle est identifiée, catégorisée et rattachée à l'étape concernée.

---

## 1. Règles transverses (RG-TR)

| ID | Règle | Justification |
| --- | --- | --- |
| RG-TR-01 | Toute donnée saisie ou importée est une **donnée de santé** et doit être hébergée en **HDS France**. | Cadre réglementaire (RGPD + HDS). |
| RG-TR-02 | Aucune donnée patient n'est traitée sans **consentement explicite** préalablement recueilli et horodaté. | RGPD — données de santé. |
| RG-TR-03 | Toute action significative (création, import, validation, génération, publication) est **journalisée** (qui, quoi, quand). | Traçabilité. |
| RG-TR-04 | Chaque patient possède **un dossier unique** consolidant toutes les étapes et l'historique. | Suivi longitudinal. |
| RG-TR-05 | **Aucune sortie de l'IA n'est publiée** sans validation explicite du kiné. | « L'IA propose, le kiné dispose ». |
| RG-TR-06 | Le workflow **n'est pas strictement linéaire** : une étape peut être sautée puis reprise ; un statut d'avancement est maintenu par patient. | Souplesse terrain. |
| RG-TR-07 | Le **patient** a un accès en **lecture seule** à sa version synthétique du bilan ; il ne peut ni modifier ni voir la version expert. | Séparation des rôles. |
| RG-TR-08 | Les **clés API et intégrations** (VALD/Vitruve/Stryd) sont gérées exclusivement par le rôle **Admin**. | Sécurité / gouvernance. |

---

## 2. Étape 1 — Questionnaire général (RG-Q1)

| ID | Règle |
| --- | --- |
| RG-Q1-01 | Le questionnaire est **envoyé automatiquement** au patient au démarrage de l'« analyse de course » par le kiné. |
| RG-Q1-02 | La **sauvegarde est progressive** : le patient peut quitter et reprendre sans perte de données. |
| RG-Q1-03 | Le bloc « **orthèses plantaires** » : les champs *ancienneté du port* et *motif de prescription* ne s'affichent **que si** la réponse est « oui ». |
| RG-Q1-04 | Le champ « **blessures en course à pied** » ouvre une **saisie détaillée** (zone, date, statut) lorsqu'il est renseigné. |
| RG-Q1-05 | Les champs sont **typés** (numérique, énuméré, texte libre, booléen) ; le caractère **obligatoire/optionnel** est paramétrable et validé avec le kiné. |
| RG-Q1-06 | À la complétion, le système produit un **profil coureur structuré et normalisé** exploitable par l'IA. |
| RG-Q1-07 | Le questionnaire est **disponible en version mobile** (responsive). |

---

## 3. Étape 2 — Première analyse IA (RG-A2)

| ID | Règle |
| --- | --- |
| RG-A2-01 | L'IA ne déclenche son analyse que **lorsque le questionnaire est suffisamment complet** (seuil de complétion à définir avec le kiné). |
| RG-A2-02 | L'IA génère un **pré-profil** + une **liste de questions complémentaires** ; elle ne pose aucun diagnostic à ce stade. |
| RG-A2-03 | Le kiné peut **éditer, valider ou retirer** chaque question suggérée ; seules les questions retenues constituent la trame d'interview. |
| RG-A2-04 | Le **taux d'acceptation** des suggestions IA est mesuré (KPI). |

---

## 4. Étape 3 — Interview & diagnostic différentiel (RG-I3)

| ID | Règle |
| --- | --- |
| RG-I3-01 | L'IA assiste **en temps réel** (relances, prise de notes) sans se substituer au kiné. |
| RG-I3-02 | La **détection de blessure** déclenche la **branche diagnostic différentiel** (matrices pathologies). En l'absence de blessure, cette branche est ignorée. |
| RG-I3-03 | L'IA **classe les hypothèses** en croisant les signes recueillis (histoire + examen) avec la matrice ; chaque hypothèse est **justifiée par les signes contributifs** (traçabilité). |
| RG-I3-04 | Le kiné **valide ou invalide chaque hypothèse** avant de poursuivre ; le protocole de la suite s'adapte au résultat validé. |
| RG-I3-05 | La **base de connaissances pathologies** est maintenue et/ou validée par les kinés (responsabilité clinique du contenu). |
| RG-I3-06 | L'IA fournit **une aide à la décision**, **jamais un diagnostic autonome**. |

---

## 5. Étapes 4 à 7 — Import des données capteurs (RG-IM)

| ID | Règle |
| --- | --- |
| RG-IM-01 | Au MVP, les données VALD / Vitruve / Stryd sont récupérées par **import de fichier (CSV/FIT)** ; l'API est reportée en V2. |
| RG-IM-02 | Tout import est **rattaché au test en cours**, donc **au patient et à l'analyse en cours**. |
| RG-IM-03 | Le fichier VALD « **List Testing** » consolide mobilité, forces et tests fonctionnels avec les colonnes **Droite / Gauche / Normes** ; ces trois axes sont conservés pour les comparaisons. |
| RG-IM-04 | Le **protocole de test de force (Étape 4)** peut être **adapté selon le diagnostic différentiel** de l'Étape 3. |
| RG-IM-05 | Un import en échec (format invalide, fichier illisible) **n'écrase pas** les données existantes et remonte un message d'erreur explicite. |
| RG-IM-06 | Les **asymétries Droite/Gauche** sont calculées et comparées aux normes pour chaque métrique pertinente. |
| RG-IM-07 | Les données **Stryd** capturées (puissance, cadence, temps de contact au sol, oscillation verticale, raideur/LSS, longueur de foulée) constituent la **signature biomécanique** rattachée à l'analyse. |

---

## 6. Étape 8 — Analyse vidéo clinique (RG-V8)

| ID | Règle |
| --- | --- |
| RG-V8-01 | La grille d'observation est renseignée en **vues frontale et sagittale**, des **deux côtés** (droit et gauche). |
| RG-V8-02 | La **saisie est manuelle** par le kiné ; **aucune analyse image automatisée** (pose estimation) au MVP. |
| RG-V8-03 | Chaque item de la grille (inclinaison du tronc, stabilité du bassin, valgus dynamique, flexion du genou, pronation du pied, déplacement vertical, verticalité du tibia, type de pose de pied, cadence, bruit) reçoit une **notation/scoring**. |
| RG-V8-04 | Les **marqueurs temporels et captures** réalisés sur la vidéo sont rattachés aux items observés. |
| RG-V8-05 | Les observations vidéo sont **structurées et scorées** avant d'alimenter le bilan. |

---

## 7. Étape 9 — Génération du bilan (RG-B9)

| ID | Règle |
| --- | --- |
| RG-B9-01 | Le bilan n'est généré que **lorsque les données nécessaires des étapes 1 → 8 sont disponibles** (étapes non requises pouvant être sautées). |
| RG-B9-02 | L'IA génère **systématiquement deux versions** : synthétique/patient et expert/kiné. |
| RG-B9-03 | Le kiné **valide et/ou édite** chaque version **avant publication** ; aucune publication automatique. |
| RG-B9-04 | Le bilan est **exportable en PDF** et **partageable au patient** (version synthétique uniquement côté patient). |
| RG-B9-05 | Les **comparaisons Droite/Gauche face aux normes** sont présentées avec un **code couleur vert/orange/rouge**. |
| RG-B9-06 | Chaque version du bilan est **versionnée** ; l'historique des versions est conservé. |
| RG-B9-07 | Le bilan inclut un **plan d'action priorisé et échéancé** et une **échelle de gestion de la douleur**. |

---

## 8. Bibliothèque de préconisations (RG-LIB)

| ID | Règle |
| --- | --- |
| RG-LIB-01 | Les préconisations (exercices, drills, renfo, mobilité) sont **réutilisables** depuis une bibliothèque centralisée. |
| RG-LIB-02 | Une préconisation insérée dans un bilan **conserve un lien** vers sa fiche source (mise à jour traçable). |

---

## 9. Synthèse — matrice règles × étapes

| Étape | Règles applicables |
| --- | --- |
| Transverse | RG-TR-01 → RG-TR-08 |
| 1 — Questionnaire | RG-Q1-01 → RG-Q1-07 |
| 2 — Analyse IA | RG-A2-01 → RG-A2-04 |
| 3 — Interview / diagnostic | RG-I3-01 → RG-I3-06 |
| 4-7 — Imports capteurs | RG-IM-01 → RG-IM-07 |
| 8 — Vidéo | RG-V8-01 → RG-V8-05 |
| 9 — Bilan | RG-B9-01 → RG-B9-07 |
| Bibliothèque | RG-LIB-01 → RG-LIB-02 |
