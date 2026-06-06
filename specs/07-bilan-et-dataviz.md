# 07 — Bilan & data-visualisation (étape 9)

Le bilan est le **livrable clé**. Exigence : le rendre **beaucoup plus impactant** que le bilan « Analyse de course » de référence (cas Sarah DAVID), tout en conservant **deux niveaux de lecture**.

Réf. maquette : panneau `data-step="9"`, `switchRep`, `gauge()`, `renderDG()`, `publishReport()`.

---

## 1. Deux versions, un même socle de données

| | Version **Patient** | Version **Expert** |
|---|---------------------|---------------------|
| Public | Coureur | Kiné |
| Ton | Synthétique, pédagogique, motivant, vulgarisé | Détaillé, analytique, technique |
| Contenu | Message clé, jauges, « ce que ça veut dire / ce qu'on fait », plan d'action, échelle douleur | Synthèse analytique, données brutes/graphiques, justifications techniques |
| Préconisations | Premières préconisations vulgarisées | Préconisations techniques |

Les deux versions sont générées par l'IA à partir des **mêmes données agrégées** (étapes 1→8), puis validées/éditées par le kiné.

---

## 2. Ingrédients d'un bilan « impactant » (exigence)

1. **Hiérarchie visuelle forte** : un **message principal** en tête (`.keymsg`), puis les preuves.
2. **Visualisation des écarts D/G et des normes** : jauges, barres, **code couleur vert/orange/rouge**.
3. **Vulgarisation pédagogique** côté patient.
4. Encadrés **« ce que ça veut dire »** (`.ins.mean`) et **« ce qu'on fait »** (`.ins.do`).
5. **Plan d'action priorisé et échéancé** (`.plan-item` + priorités `.pr.p1/p2/p3` + colonne « quand »).
6. **Échelle de gestion de la douleur** (`.pain-scale` : 0–2 / 3–4 / 5+).
7. **Identité graphique soignée** (design system, voir `02-design-system.md`).

---

## 3. Composants de visualisation

### 3.1 Jauge (version patient) — `gauge()`
- Demi-cercle à 3 zones (vert/orange/rouge) + aiguille positionnée selon un pourcentage (0–100 → −90°…+90°).
- Props cible : `{ label, pct, value, tag, flag }`.
- Usage : synthétiser un écart en un coup d'œil (ex. « force hanche droite », « cadence », « puissance de saut »).

### 3.2 Barres comparatives D/G vs norme (version expert) — `renderDG()`
- Pour chaque mesure : deux barres (Droite, Gauche) + **repère vertical de la norme**.
- Couleur de barre : vert si ≥ norme, rouge sinon.
- Props cible : `{ label, right, left, norm, max }`.

### 3.3 Tableaux D/G/Normes — `table.dg`
- Colonnes : Mesure · Droite · Gauche · Norme · Asymétrie (`.asym.ok/warn/bad`).

### 3.4 Plan d'action — `.plan-item`
- Priorité (P1 rouge / P2 orange / P3 vert), titre, détail, échéance.

### 3.5 Échelle de douleur — `.pain-scale`
- 3 segments colorés : « 0–2 j'y vais » (vert), « 3–4 j'adapte » (orange), « 5+ je stoppe » (rouge).

---

## 4. Workflow de validation & publication

```
[IA agrège 1→8] → génère brouillon (draft) des 2 versions
        ▼
[Kiné relit / édite]  ← bandeau .validate-bar (verrou applicatif)
        ▼
[Valider] → status = validated
        ▼
[Publier au patient] (publishReport) → status = published
        ├─ Export PDF
        └─ Partage au patient (accès version synthétique)
```

- **Règle** : aucune publication sans validation kiné.
- **Versionnement** : chaque génération/édition crée une version (`Bilan.version`) — traçabilité.
- **Export PDF** : générer les deux versions ; le patient n'accède qu'à la version synthétique.

---

## 5. Critères d'acceptation (bilan)

- [ ] Le message clé apparaît en tête de la version patient.
- [ ] Les écarts D/G et normes sont visualisés en vert/orange/rouge (jauges + barres).
- [ ] Les encadrés « ce que ça veut dire » et « ce qu'on fait » sont présents côté patient.
- [ ] Le plan d'action est priorisé et échéancé.
- [ ] L'échelle de gestion de la douleur est affichée.
- [ ] La version expert expose données brutes, graphiques et justifications techniques.
- [ ] La publication exige une validation kiné explicite.
- [ ] Le bilan est exporté en PDF et partagé au patient.
- [ ] Chaque version est tracée (numéro de version, auteur, horodatage).

---

## 6. Suivi longitudinal (au-delà du MVP immédiat)

Le **dossier patient unique** consolide l'historique des bilans : prévoir la **comparaison entre bilans successifs** (évolution des asymétries, de la cadence, etc.) pour valoriser le suivi (`AnalyseDeCourse` multiples par patient, mêmes métriques comparables dans le temps).
