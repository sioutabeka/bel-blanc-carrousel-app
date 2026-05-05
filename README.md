# Bel & Blanc — Carrousel Studio

> Un outil interne pour transformer les articles de blog Bel & Blanc en carrousels Instagram, plus vite et avec une vraie cohérence éditoriale.

---

## C'est quoi ce projet, en une phrase ?

Une petite **application web** qui lit les articles du blog Bel & Blanc, et qui demande à une IA (Claude) de proposer un carrousel Instagram prêt à publier. Le résultat s'affiche directement dans le navigateur, avec les bonnes typos et les bonnes couleurs de la marque.

## Pourquoi on en a besoin ?

Bel & Blanc, c'est un **pressing artisanal à Tunis** depuis 2001 (3 ateliers : La Marsa, Lafayette, Sfax). Sur Instagram, l'objectif c'est de **publier ~30 carrousels par mois** qui éduquent les particuliers sur l'entretien du textile. Sans cet outil, chaque carrousel prend des heures : lire l'article, choisir l'angle, écrire les slides, vérifier le ton… L'app fait le premier brouillon **en 45 secondes**, à toi de l'affiner.

## Pour qui c'est ?

- **Toi**, qui produis les carrousels au quotidien.
- L'équipe contenu de Bel & Blanc (en interne).
- Pas pour les clients, pas pour le public.

---

## Comment ça marche, vu de l'utilisateur ?

### 1. Tu ouvres l'app

Tu lances l'app dans ton terminal (voir plus bas), tu ouvres `http://localhost:3000` dans ton navigateur, et tu vois deux choses :

- **Une barre latérale à gauche** : la liste des **31 articles** du blog Bel & Blanc, regroupés par tag (Conseil, Entretien, Matières). Il y a une barre de recherche en haut.
- **Une zone à droite** : pour l'instant, juste un message d'accueil.

### 2. Tu choisis un article

Tu cliques sur un article dans la barre latérale (par exemple *« Adoucissant : pourquoi les pros le détestent »*). La zone de droite affiche :

- Le titre
- Le résumé
- Les **sections** de l'article (visibles en cliquant sur "Sections de l'article")
- Un gros bouton noir : **« Générer le carrousel »**

### 3. Tu cliques sur "Générer le carrousel"

L'app envoie l'article à Claude (l'IA) avec une consigne très précise (la « voix de marque » Bel & Blanc). Claude réfléchit ~45 secondes, puis renvoie un carrousel structuré : entre **5 et 10 slides**, prêtes à être visualisées.

### 4. Tu vois le résultat

Les slides apparaissent en bas, avec les **vraies typos** et **vraies couleurs** Bel & Blanc :

- **Bodoni Moda** (les gros titres)
- **Cormorant Garamond** (les italiques élégantes)
- **Public Sans** (le texte courant)
- Bleus de marque, fonds clairs, accent jaune

Tu peux aussi cliquer sur "voir JSON brut" pour voir le contenu structuré (utile si on veut copier-coller dans un autre outil).

---

## Le vocabulaire à connaître

### Les types de slides

Chaque carrousel suit toujours la même structure :

| Type      | À quoi ça sert                                                           |
| --------- | ------------------------------------------------------------------------ |
| **cover** | La 1ʳᵉ slide. Le hook qui donne envie de glisser. Toujours en premier.   |
| **body**  | La slide standard : un titre + un paragraphe + un encadré + une action.  |
| **method**| Pour les recettes courtes (2-3 étapes). Ex : « Comment détacher le vin ».|
| **steps** | Pour les méthodes plus longues (5-8 étapes). Ex : laver le cachemire.    |
| **donts** | La liste des « à ne JAMAIS faire ». Avec les croix ✕ rouges.             |
| **cta**   | La dernière slide. Renvoie vers le pressing : « Confie-nous tes pièces ».|

Un carrousel = **toujours** une cover + 3 à 8 slides du milieu + une cta.

### Les marqueurs de mise en forme

Quand l'IA écrit un texte, elle utilise deux symboles spéciaux :

- `*mot*` → met le mot en **italique élégante** (Cormorant). On l'utilise sur le mot-clé du titre.
  Exemple : « Tu doses *trop de lessive.* »
- `**phrase**` → met la phrase en **gras**. On l'utilise dans les actions et les encadrés.
  Exemple : « **Divise la dose par deux.** »

Ces deux marqueurs sont automatiquement transformés en italique / gras quand le carrousel s'affiche.

### La voix Bel & Blanc

L'IA est **briefée** pour respecter le ton de la marque :

- **Voix d'artisan** — précis, factuel, technique mais accessible.
- **Tutoiement** — toujours « tu », jamais « vous ».
- **Pas de marketing** — pas de « découvrez », pas de « le saviez-vous ? ».
- **Aucune invention** — l'IA reformule l'article, mais elle n'ajoute rien qui n'y est pas.

---

## Lancer l'app

### Prérequis

- Avoir **Node.js** installé (version 18 ou plus récente).
- Avoir le **CLI Claude Code** installé (l'app l'utilise pour appeler l'IA).

### Démarrage

Dans le terminal, à la racine du projet :

```bash
npm install     # première fois seulement, télécharge les dépendances
npm run dev     # lance l'app
```

Puis ouvre `http://localhost:3000` dans ton navigateur.

### Stopper l'app

Dans le terminal, fais `Ctrl + C`.

---

## Ce que l'app **fait**

- Liste les 31 articles, recherche, navigation par tag.
- Affiche un article dans une page d'éditeur lisible.
- Demande à Claude de générer un carrousel structuré (5-10 slides).
- Affiche les slides avec les vraies typos / couleurs Bel & Blanc.
- Affiche le JSON brut si tu veux le copier ailleurs.

## Ce que l'app **ne fait pas (encore)**

- ❌ **Pas d'export en PNG** depuis l'app. Pour les vrais carrousels publiés, on passe par les fichiers HTML standalone du repo `~/Documents/bel&blanc-carrousel/` (voir le `WORKFLOW.md` là-bas).
- ❌ **Pas de modification manuelle des slides** dans l'app. Si tu veux corriger un mot, il faut copier le JSON et l'éditer ailleurs.
- ❌ **Pas de sauvegarde** — si tu fermes l'onglet, le carrousel généré disparaît. Garde le JSON si tu veux le retrouver.
- ❌ **Pas de génération d'images** (les vrais fonds Canva sont dans l'autre repo).

## Les liens avec le reste de l'écosystème Bel & Blanc

Il y a **deux dossiers** liés :

1. **`~/Documents/bel-blanc-carrousel-app/`** ← **toi tu es ici**, c'est l'app web.
2. **`~/Documents/bel&blanc-carrousel/`** — le dossier des **assets** : articles JSON, fonds PNG depuis Canva, charte graphique (`CHARTE.md`), et les fichiers HTML standalone qui servent aujourd'hui à la production réelle.

L'app lit les articles du dossier 2 via un **lien symbolique** (`data/`), donc si l'équipe contenu enrichit `articles.json`, l'app les voit automatiquement.

---

## Si tu te poses une question

- **Le bouton "Générer" tourne dans le vide** → c'est normal, ça prend 30-60 secondes. Si ça dépasse 2 minutes, regarde le terminal.
- **Erreur "claude binary not found"** → le CLI Claude n'est pas installé / pas dans le PATH. Demande à un dev.
- **Le carrousel est moche / mal cadré** → c'est l'aperçu écran, pas l'export final. Les vrais carrousels publiés passent par les fichiers HTML standalone et l'export Playwright dans l'autre repo.
- **Je veux modifier le ton de l'IA** → c'est dans `lib/prompts/extract.ts` (la constante `BRAND_VOICE`). Modifie avec un dev à côté.

Pour tout le reste, demande à l'équipe tech ou ouvre un ticket.
