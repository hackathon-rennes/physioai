# 02 — Design system

Reproduit les tokens et composants de la maquette. La palette s'inspire de l'univers **course à pied + médical** de physiorunninglab.fr (teal/anthracite + accent vert anis). À recaler sur la charte officielle dès qu'elle est fournie (codes hex exacts + logo).

---

## 1. Couleurs (tokens CSS)

```css
:root{
  /* Marque */
  --ink:#0E2A33;       /* anthracite / teal profond — fonds sombres, titres */
  --ink-2:#13343F;
  --brand:#15B7A6;     /* teal-green signature — actions, accents */
  --brand-d:#0E8E81;   /* teal foncé — hover, texte sur clair */
  --brand-l:#C9F2EC;   /* teal clair — fonds de badge, surbrillances */
  --lime:#B8E02A;      /* vert anis — énergie / course, CTA secondaires */
  --lime-d:#9CC11E;

  /* Surfaces */
  --paper:#F4F7F8;     /* fond d'application */
  --card:#FFFFFF;      /* cartes */
  --line:#E2EAEC;      /* bordures, séparateurs */
  --muted:#5E7480;     /* texte secondaire */
  --txt:#16303A;       /* texte principal */

  /* Feux (normes / gestion douleur / scoring) */
  --green:#28B47A;     /* normal / en faveur / OK */
  --orange:#F5A623;    /* à surveiller */
  --red:#E5484D;       /* anormal / déficit */
}
```

### Code couleur sémantique (exigence du bilan)
| Couleur | Sens | Usage |
|---------|------|-------|
| 🟢 Vert | Normal / dans la norme / point fort | jauges, barres D/G, badges asymétrie OK, échelle douleur 0–2 |
| 🟠 Orange | À surveiller / écart modéré | scoring vidéo, asymétrie limite, échelle douleur 3–4 |
| 🔴 Rouge | Anormal / déficit / priorité | déficit de force, asymétrie forte, échelle douleur 5+ |

---

## 2. Typographie

- **Police** : pile système (`'Segoe UI', system-ui, Roboto, Arial, sans-serif`). En cible, possibilité d'une police de marque (ex. Inter) à harmoniser avec la charte.
- **Échelle** :

| Rôle | Taille | Poids |
|------|--------|-------|
| Titre de page (`h1.title`, `.home-hero h1`) | 25–28 px | 800 |
| Titre de carte (`.card h2`) | 15 px | 700 |
| Message clé du bilan (`.keymsg h3`) | 21 px | 700 |
| Corps | 13–14 px | 400–500 |
| Légendes / hints | 11–12.5 px | 500 |
| Sur-titres (uppercase) | 10–11 px / `letter-spacing` | 700 |

---

## 3. Tokens divers

```css
--shadow:   0 10px 30px rgba(14,42,51,.08);
--shadow-s: 0 4px 14px rgba(14,42,51,.07);
--r: 16px;  /* rayon des cartes ; boutons 10–11px ; pastilles 999px */
```
- Animation d'apparition des panneaux : `@keyframes fade` (opacity + translateY 8px, 0.3–0.35 s).

---

## 4. Inventaire des composants UI

### Boutons (`.btn`)
| Variante | Classe | Usage |
|----------|--------|-------|
| Primaire | `.btn.primary` | Action principale (valider, envoyer) — fond teal |
| Lime | `.btn.lime` | Action positive forte (publier le bilan) |
| Fantôme | `.btn.ghost` | Action secondaire — contour |

### Badges
| Type | Classe | Exemple |
|------|--------|---------|
| Marque | `.badge` | « Patient », « Nouvelle » |
| IA | `.badge.ai` | « IA propose » (violet) |
| Kiné | `.badge.kine` | « Kiné valide » (ambre) |
| Statut questionnaire | `.qbadge.qb-{none\|sent\|prog\|done}` | suivi amont |

### Cartes & conteneurs
- `.card` — carte standard (bordure + ombre douce).
- `.patient` — carte dossier patient (sidebar, dégradé sombre).
- `.ai-box` — encadré assistant IA (contour pointillé violet + animation « typing »).
- `.validate-bar` — bandeau « l'IA propose, le kiné dispose » (ambre).
- `.step1-banner.{ok|todo}` — bandeau de pré-remplissage de l'étape 1.
- `.keymsg` — encadré « message clé » du bilan (dégradé sombre).
- `.ins.{mean|do}` — encadrés « ce que ça veut dire » / « ce qu'on fait ».

### Formulaires (`.fld`)
- Label + champ typé (input/select/textarea), focus teal.
- **Logique conditionnelle** : `.conditional.show` (déplie des champs selon une réponse — ex. orthèses « oui », blessure « oui »).
- Cases à cocher `.chk` (accent teal).

### Données & visualisations
| Composant | Classe | Rôle |
|-----------|--------|------|
| Stepper | `.steps` / `.step` | Navigation 9 étapes |
| Anneau de progression | `.ring` (SVG) | % d'avancement |
| Matrice diagnostic | `table.matrix` + `.w.{pp,p,z,m,mm}` | pondérations --- à +++ |
| Hypothèses | `.hyp` + `.track` | classement + signes contributifs |
| Import fichier | `.drop` → `.drop.filled` | zone d'import VALD/Vitruve/Stryd |
| Tableau D/G/Normes | `table.dg` + `.asym.{ok,warn,bad}` | métriques comparées |
| Grille observation | `.obs-item` + `.scale` (boutons feu) | scoring vidéo |
| Jauge | `.gauge` (SVG + aiguille) | écarts du bilan patient |
| Barres D/G | `#dgBars` (généré JS) | comparaison vs norme (repère vertical) |
| Plan d'action | `.plan-item` + `.pr.{p1,p2,p3}` | priorités hiérarchisées |
| Échelle douleur | `.pain-scale` | 0–2 / 3–4 / 5+ |
| Toast | `.toast` | retours d'action |
| Modale | `.modal-bg` / `.modal` | aperçu questionnaire patient |

---

## 5. Iconographie & ton

- Icônes : pictos SVG (logo « coureur »), emojis fonctionnels dans la maquette (💪 🦵 📡 …) — **à remplacer par un jeu d'icônes cohérent** (ex. Lucide) en cible.
- Ton patient : tutoiement, vulgarisé, motivant (aligné sur le site « ton parcours sans blessure »).
- Ton expert : précis, clinique, factuel.

---

## 6. Accessibilité (à intégrer en dev)

- Contrastes : vérifier AA sur les badges colorés (notamment `--lime` sur fond clair → réserver au texte sombre).
- Ne **jamais** coder une information uniquement par la couleur : doubler les feux vert/orange/rouge d'un libellé/icône (déjà le cas dans la grille d'observation et les asymétries).
- Focus visible sur tous les champs (déjà présent : halo teal).
- Navigation clavier du stepper et des modales.
