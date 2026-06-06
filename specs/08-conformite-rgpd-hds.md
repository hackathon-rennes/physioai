# 08 — Conformité : RGPD, HDS, traçabilité & sécurité

> **Préambule (contrainte transverse structurante)** : l'application manipule des **données de santé**. Cela impose un cadre réglementaire fort — **RGPD + hébergement HDS en France**. Cette exigence n'était pas explicite dans le brief initial mais elle conditionne l'architecture, les intégrations et l'UX. À traiter dès la conception (*privacy by design*).

---

## 1. Hébergement HDS

- Toute donnée patient (questionnaire, fichiers capteurs, vidéos, bilans, journaux) doit être **hébergée chez un hébergeur certifié HDS en France**.
- Les traitements (back-end, base de données, stockage fichiers, moteur IA) doivent rester dans ce périmètre conforme.
- **Vigilance IA** : ne pas transmettre de données de santé à des services tiers non conformes. Privilégier un déploiement IA dans le périmètre HDS ou un prestataire contractuellement conforme (DPA + clauses santé).

---

## 2. RGPD — principes applicatifs

| Principe | Mise en œuvre |
|----------|---------------|
| **Base légale / consentement** | Recueil et stockage du consentement patient (entité `Consentement`) avant traitement |
| **Minimisation** | Ne collecter que les champs utiles à l'analyse (arbitrer les champs du questionnaire avec le kiné) |
| **Finalité** | Données utilisées pour l'analyse de course et le suivi, pas au-delà |
| **Droits des personnes** | Accès, rectification, effacement, portabilité, opposition |
| **Durée de conservation** | Définir une politique de rétention (dossier de santé) ; archivage/suppression |
| **Information** | Mention claire dans l'e-mail patient et le formulaire (déjà présente dans l'aperçu : « données de santé hébergées en France (HDS/RGPD) ») |

---

## 3. Sécurité

### 3.1 Authentification & rôles
- Comptes **Kiné/Expert**, **Admin/Praticien gestionnaire**, **Patient** — habilitations distinctes (voir `README.md` §3).
- Authentification forte pour les praticiens ; gestion fine des accès au dossier patient.

### 3.2 Lien questionnaire patient (amont)
- Jeton **personnel, non devinable, à durée de vie limitée** (`secureLinkId`).
- Accès au seul questionnaire du patient concerné ; pas d'exposition d'autres données.
- Sauvegarde progressive côté serveur, chiffrée.

### 3.3 Données au repos & en transit
- Chiffrement en transit (TLS) et au repos (base + stockage fichiers/vidéos).
- Cloisonnement des fichiers capteurs et vidéos (object storage chiffré, accès signé temporaire).

---

## 4. Traçabilité (exigence fonctionnelle transverse)

- **Journal des actions** (`JournalAction`) : qui (kiné/patient/IA), quoi, quand.
- **Versions du bilan** : chaque génération/édition/publication tracée.
- **Décisions cliniques** : validation/invalidation des hypothèses, acceptation/refus des préconisations IA.
- **Sorties IA** : entrées/sorties et version du modèle/prompt conservées pour audit clinique.

Objectif : auditabilité clinique (l'IA propose, le kiné décide — la responsabilité reste humaine) et conformité.

---

## 5. Gouvernance clinique du contenu

- La **base de connaissances pathologies** est maintenue et/ou validée par les kinés (responsabilité clinique du contenu).
- L'IA est un **outil d'aide à la décision** : pas de diagnostic autonome, validation humaine systématique (verrou applicatif sur toutes les publications).

---

## 6. Checklist conformité (avant mise en production)

- [ ] Hébergement HDS contractualisé (back, BDD, fichiers, IA).
- [ ] Registre des traitements + analyse d'impact (AIPD/DPIA) réalisée.
- [ ] Consentement patient recueilli et stocké.
- [ ] Politique de conservation et procédure d'effacement.
- [ ] Gestion des droits des personnes opérationnelle.
- [ ] Chiffrement transit + repos vérifié.
- [ ] Jetons de lien patient sécurisés et expirables.
- [ ] Journalisation/traçabilité active (actions, versions, IA).
- [ ] Aucune donnée de santé transmise à un service non conforme.
- [ ] Verrou « pas de publication sans validation kiné » testé.
