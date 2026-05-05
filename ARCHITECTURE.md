# Architecture — Bel & Blanc Carrousel Studio

Doc technique. Pour la version « pour stagiaire non-tech », voir `README.md`.

## Stack

- **Next.js 15** (App Router, Server Components par défaut)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3** + tokens custom dans `tailwind.config.ts`
- **Zod** — validation des outputs Claude
- **Claude Code CLI** (`claude -p`) — appelé en sous-processus, pas via SDK API. Pas de clé API requise.

Aucune base de données, aucun runtime côté client lourd. Tout est SSR + un seul composant client (`ExtractButton`).

## Arborescence

```
bel-blanc-carrousel-app/
├── app/
│   ├── layout.tsx               # Root layout, charge les Google Fonts
│   ├── page.tsx                 # Home — sidebar + écran d'accueil
│   ├── globals.css              # Tailwind + tokens CSS Bel & Blanc
│   ├── editor/[slug]/page.tsx   # Page éditeur d'un article
│   ├── api/extract/route.ts     # POST /api/extract → appelle Claude
│   └── _components/
│       ├── Sidebar.tsx          # client — recherche + arbo articles
│       ├── ExtractButton.tsx    # client — bouton + état + fetch /api/extract
│       ├── Carousel.tsx         # serveur — rendu des slides
│       ├── carousel.css         # styles spécifiques aux slides
│       └── RichText.tsx         # parser maison `*italic*` / `**bold**`
├── lib/
│   ├── articles.ts              # lecture data/articles*.json (cached en RAM)
│   ├── claude.ts                # spawn `claude -p` + parse JSON envelope
│   ├── prompts/extract.ts       # BRAND_VOICE + FEW_SHOT + tool schema
│   ├── schemas.ts               # Zod schemas (CarouselDraft, Slide…)
│   ├── types.ts                 # types Article / ArticleIndex
│   └── render.ts                # stub (pas implémenté — voir TODOs)
├── data/                        # SYMLINK → ../bel&blanc-carrousel/data/
│   ├── articles.json            # 31 articles complets
│   └── articles-index.json      # version compacte (pour la sidebar)
├── public/bg/                   # 3 PNG 1080×1350 (cover, body, cta)
├── tailwind.config.ts           # tokens couleurs/typo de la charte
├── next.config.mjs
├── tsconfig.json                # paths alias `@/*` → racine
└── .env.example                 # CLAUDE_BIN (optionnel)
```

## Data flow

```
[user clique « Générer »]
        │
        ▼
ExtractButton.tsx (client)
        │  fetch POST /api/extract { slug }
        ▼
app/api/extract/route.ts
        │  getArticle(slug)  ← lib/articles.ts (cache RAM)
        │  extractCarousel(article)  ← lib/prompts/extract.ts
        ▼
lib/claude.ts: callClaude()
        │  spawn `claude -p --json-schema … --system-prompt … --disallowed-tools …`
        │  stdin = userMessage (article + sections)
        │  cwd = /tmp (évite l'auto-discovery de CLAUDE.md)
        ▼
Claude CLI → stdout JSON envelope
        │  { is_error, structured_output, … }
        ▼
Parse + validation Zod (CarouselDraft)
        ▼
Retour API → setDraft() côté client
        ▼
<Carousel draft={draft} /> rend les 5-10 slides
```

## Conventions clés

### Pas de SDK Anthropic, pas de clé API

`lib/claude.ts` lance `claude -p` via `child_process.spawn`. Le binaire est récupéré depuis `process.env.CLAUDE_BIN` (défaut : `claude` dans le PATH). C'est une décision volontaire — l'utilisateur a déjà le CLI, on évite la gestion de secrets.

Conséquences :
- L'app **ne tournera pas** sur un serveur sans CLI Claude (pas de Vercel sans config custom).
- `cwd: os.tmpdir()` dans le spawn évite que Claude pick up un `CLAUDE.md` parent.
- `--disallowed-tools` bloque tous les outils (Bash, Edit, Read…) pour forcer un mode pure-text generation.
- Timeout dur à 120s.

### Output structuré via tool schema

Le prompt définit un **JSON schema** (`TOOL_SCHEMA` dans `lib/prompts/extract.ts`) passé à `--json-schema`. Le schéma JSON est **permissif** (tous les champs optionnels sauf `type`) parce que Claude gère mal les `oneOf` complexes. La **validation stricte** se fait côté Zod (`CarouselDraft` = discriminated union sur `type`).

Si Zod rejette, l'erreur remonte jusqu'à l'UI avec le détail. C'est volontaire — on préfère échouer fort plutôt que rendre une slide à moitié cassée.

### RichText markers

`*x*` → `<em>` (italique Cormorant blue-dark)
`**x**` → `<strong>` (bold Public Sans blue-dark)

Parser maison dans `RichText.tsx` (~30 lignes). Pas de markdown complet, pas de lib externe — on ne veut que ces deux marqueurs.

### Données articles

- Source unique de vérité : `data/articles.json` (symlink vers le repo assets).
- Cache module-level (`_indexCache`, `_articlesCache`) — relu une seule fois par worker. En dev, `next dev` recharge sur changement de fichier.
- Pas de pagination, pas de DB — 31 articles, chargement instantané.

### Slide types

6 types discriminés sur `type` : `cover` | `body` | `method` | `steps` | `donts` | `cta`.
Chaque type a son propre schéma Zod **et** son propre composant React dans `Carousel.tsx`. Ajouter un type = toucher 3 endroits :
1. Nouveau schéma dans `lib/schemas.ts` (+ ajouter à `discriminatedUnion`).
2. Nouveau composant + case dans `Carousel.tsx` `SlideRenderer`.
3. Description du type dans le prompt système (`BRAND_VOICE`).

### Design tokens

Charte centralisée dans `~/Documents/bel&blanc-carrousel/CHARTE.md`. Les tokens sont dupliqués dans :
- `tailwind.config.ts` (utilitaires Tailwind : `bg-night`, `text-blue-dark`, `font-display`, …)
- `app/globals.css` (variables CSS pour le carrousel HTML)
- `app/_components/carousel.css` (styles de slides)

À synchroniser à la main si la charte évolue.

## Composants client vs serveur

Par défaut tout est Server Component (Next 15 App Router).
Marqués `"use client"` :
- `ExtractButton.tsx` — `useState` pour loading/draft/error.
- `Sidebar.tsx` — `useState` pour search query et tags ouverts.

Le composant `Carousel.tsx` reste **serveur** — pas d'interactivité.

## Limites / TODOs connus

- **`lib/render.ts` est un stub** — pensé à l'origine pour générer les PNG depuis Node (Playwright server-side), pas implémenté. Aujourd'hui l'export PNG passe par les HTML standalone du repo `bel&blanc-carrousel/` + `export-slides.js`.
- **Pas de persistance des drafts** — si on rafraîchit la page, le carrousel généré est perdu. À ajouter : sauvegarde dans `data/drafts/{slug}.json` ou similaire.
- **Pas d'édition manuelle** des slides après génération. À envisager : un mode édition WYSIWYG ou un éditeur JSON avec validation Zod live.
- **Pas de tests** (ni unit, ni E2E).
- **Le `BRAND_VOICE` du prompt est volumineux** (~1.5K tokens à chaque appel). Pas de cache prompt côté CLI — pourrait être optimisé si on bascule vers le SDK Anthropic avec `cache_control`.
- **`max_duration = 60`** dans la route API mais timeout côté `claude.ts` à 120s — incohérent. À aligner.

## Variables d'environnement

| Variable     | Défaut    | Rôle                                       |
| ------------ | --------- | ------------------------------------------ |
| `CLAUDE_BIN` | `claude`  | Chemin vers le binaire Claude Code CLI     |

Aucune autre variable. Pas de clé API.

## Scripts npm

| Script           | Action                                |
| ---------------- | ------------------------------------- |
| `npm run dev`    | `next dev` — hot reload sur :3000     |
| `npm run build`  | `next build` — build prod             |
| `npm run start`  | `next start` — serve build prod       |

Pas de lint, pas de format, pas de test (à ajouter si on industrialise).

## Branchement avec le repo assets

Le symlink `data/` est créé manuellement :

```bash
ln -s "/Users/essiabenkheder/Documents/bel&blanc-carrousel/data" data
```

Si tu clones l'app sur une autre machine, refais le lien (ou copie le dossier).
