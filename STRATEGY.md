# Stratégie — Bel & Blanc Carrousel Studio

## 1. Le contexte

Bel & Blanc Carrousel Studio est l'outil interne qui transforme les articles du blog `beletblanc.tn` en carrousels Instagram (5 à 10 slides), avec la charte visuelle Bel & Blanc et la voix éditoriale propre à la maison.

L'enjeu : produire vite, sans perdre la voix. Un article publié en blog doit pouvoir devenir un carrousel publiable sur Instagram en **moins de 5 minutes** côté éditeur (sélection article → choix pattern → génération → relecture éventuelle → export PNG).

## 2. La voix Bel & Blanc — ce qu'on défend

- **Voix d'artisan.** On sait de quoi on parle parce qu'on le fait tous les jours, dans les trois ateliers (La Marsa, Lafayette, Sfax). On nomme les fibres, les températures, les durées.
- **Factuel.** Si l'article ne dit pas X, le carrousel ne dit pas X. Pas d'invention pour faire joli.
- **Tutoiement systématique.** "Tu doses trop." Pas "Vous dosez trop."
- **Précision technique > effet de style.** "Choc thermique → feutrage instantané." est plus fort que "attention au feutrage".
- **Une idée = une slide.** Pas deux causes empilées sur la même carte.
- **Italique sur le mot-clé du titre.** Toujours le terme central, jamais un mot accessoire.
- **Action en pattern bold + plain.** "**Divise la dose par deux.** Cycle de rinçage en plus une fois par mois."

## 3. La voix Bel & Blanc — ce qu'on refuse

- ❌ **"Découvrez", "Le saviez-vous ?", "Absolument incroyable".** Ces formules sont la marque du content générique. On n'en fait pas.
- ❌ **Emojis dans le contenu.** Pas de ⚠️, pas de 🔥, pas de ✨.
- ❌ **Superlatifs.** "Le meilleur", "ultime", "secret" — non.
- ❌ **Phrase orpheline en titre.** "Invisible." seul ne dit rien. Il faut la fibre, le geste, la conséquence.
- ❌ **Mix italique/bold dans la même phrase d'action.** Bold pour la phrase impérative, plain pour la précision. Stop.
- ❌ **Marketing creux qui parle au lieu de montrer.** "Bel & Blanc prend soin de votre linge avec amour" → bannière vide. À remplacer par un geste concret.

## 4. Pourquoi un repo séparé (pas multi-tenant)

Le moteur du studio (Next.js + Claude CLI + Playwright) a été conçu d'abord comme template (cf. `osecom-app` côté `~/dev`). Bel & Blanc en est **le premier fork client**. Décision retenue : **un repo par client**, pas une config multi-tenant.

Raisons :
- **Charte visuelle riche** : palettes, fonts, layouts. Une config JSON ne capture pas tout.
- **Voix éditoriale volumineuse** (~1,5K tokens dans le prompt). La maintenir en data structurée serait pénible.
- **Pas d'effets de bord cross-client** : un fix urgent côté Bel & Blanc ne pète pas un autre client.
- **Charge cognitive faible** : on raisonne sur un seul contexte à la fois.

Coût accepté : les fixes du moteur partagé doivent être portés à la main.

## 5. Le rôle du système de patterns

Un **pattern narratif** = un squelette de carrousel (séquence de types de slides + ton + tags privilégiés). Bel & Blanc en démarre avec quatre, pensés depuis les vrais carrousels validés :

| Pattern | Quand l'utiliser |
|---|---|
| **Les causes** | Un problème observé → 3-5 causes → la méthode pour rattraper. Le pattern le plus utilisé. (Ex : "Pourquoi ton blanc devient gris.") |
| **Le geste-par-geste** | Méthode artisanale précise sur une matière délicate. (Ex : "Cachemire en 7 gestes.") |
| **Les pièges** | 3-5 erreurs à ne jamais faire, avec leur conséquence technique. (Ex : "4 gestes qui tuent un pull.") |
| **Le diagnostic** | Signe visible → cause technique → solution maison → seuil atelier. (Ex : "Une tache jaune qui ne part pas au lavage.") |

Le pattern est **choisi par l'éditeur** au moment de générer, et son brief est injecté dans le prompt envoyé à Claude. C'est lui qui dicte la séquence — Claude n'a **pas** la liberté de choisir son format.

Les patterns sont éditables depuis `/patterns`. Ajouter un cinquième pattern (ex : "Le comparatif fibre" pour opposer deux matières) est une commande de quelques minutes.

## 6. Décisions techniques structurantes

### 6.1 Pas de SDK Anthropic, pas de clé API

Le moteur appelle `claude -p` via `child_process.spawn`. Décision volontaire — l'utilisateur a le CLI installé, on évite la gestion de secrets et la friction de setup. Conséquence : l'app ne tourne pas sur un serveur sans CLI Claude (pas de Vercel sans config custom).

### 6.2 Tool schema strict + Zod strict

Contrairement à Osecom (schema permissif côté tool, strict côté Zod), Bel & Blanc utilise un **JSON schema strict** avec `oneOf` discriminé par `type` (cf. `lib/prompts/extract.ts`). On accepte le risque qu'un Claude récent gère mal des `oneOf` complexes — en échange, on filtre la sortie à la source.

Si Zod rejette malgré tout, l'erreur remonte à l'UI avec le détail. C'est volontaire.

### 6.3 Cache RAM des articles

`lib/articles.ts` cache l'index et les articles en mémoire au premier load. En dev, `next dev` invalide au reload de fichier. En prod, le cache vit le temps du worker.

### 6.4 Données symlinkées vers le monorepo Bel & Blanc

`data/` est lié vers `~/Documents/bel&blanc-carrousel/`. Les articles, les assets de charte, et les fonds PNG vivent dans ce monorepo externe — partagés avec d'autres outils Bel & Blanc.

## 7. Pièges connus

### 7.1 iCloud Drive et `node_modules`

Le projet est dans `~/Documents/`, donc synchronisé iCloud. iCloud crée parfois des doublons type `next 2/`, `react 2/` à l'intérieur de `node_modules` — qui font sortir TypeScript en erreur (`TS2688: Cannot find type definition file for 'node 2'`). Workaround : `npx tsc --noEmit --types node --types react --types react-dom`. Solution durable : déplacer le projet hors iCloud (`~/dev/`).

### 7.2 Push Git → SIGBUS

Vu en avril 2026 : `git push` qui meurt en signal 10 (SIGBUS) sur le pack-objects. Fix : `git -c pack.threads=1 -c pack.window=0 push`. Cause probable : pression mémoire pendant la compression.

### 7.3 Patterns manquant côté API extract

Si l'API `/api/extract` reçoit une requête sans champ `pattern`, elle renvoie 400. C'est volontaire — un carrousel sans pattern n'a pas de squelette à suivre, autant échouer fort. L'`ExtractButton` charge la liste au mount et pré-sélectionne le premier ; si la liste est vide, le bouton "Générer" est disabled.

## 8. KPI implicites

- **Time-to-first-carousel** sur un article nouveau : < 5 min (sélection → pattern → génération → relecture → export).
- **Temps de génération Claude** : ~45s par carrousel.
- **Taux de carrousels exportés sans édition** : à mesurer. Cible idéale > 60%, sinon le `BRAND_VOICE` ou les patterns demandent un tour de vis.

## 9. Decision log

### 9.1 Patterns plutôt que paramètres libres dans l'UI

Plutôt qu'un menu "tonalité ? longueur ? format ?" chacun avec 5 options (combinatoire ingérable), on a opté pour des **patterns nommés et éditables**. Un pattern = un squelette + un ton + des tags. Quatre patterns suffisent à couvrir 80% des carrousels Bel & Blanc.

### 9.2 Pattern obligatoire (pas optionnel)

L'API extract refuse de générer sans pattern (400). Raison : sans pattern, Claude choisit lui-même le format en lisant l'article — et le résultat est imprévisible. Forcer le choix = forcer la cohérence éditoriale.

### 9.3 Édition inline post-génération

L'éditeur peut cliquer sur n'importe quel texte du carrousel généré et le modifier dans le navigateur (cf. `EditableText.tsx`). Décision : pas de "régénérer cette slide" — soit on garde, soit on retouche, soit on relance la génération entière. Ça évite les bricolages partiels.

## 10. Roadmap (indicatif)

- Mesurer le taux de carrousels exportés sans édition (instrumentation simple).
- Étendre les patterns : ajouter "Le comparatif fibre" si la demande arrive.
- Library de thèmes pré-faits : 5-10 thèmes "stockés" pour ne pas redessiner les fonds à chaque carrousel.
- Multi-articles batch : générer N carrousels en série depuis l'index (utile pour rattraper un retard de production).
