# Workflow — produire un carrousel Bel & Blanc

Checklist concrète, étape par étape, pour produire et valider un carrousel avant publication. À ouvrir dans un onglet à côté du studio.

## 1. Avant de générer

- [ ] **Choisir l'article** dans la sidebar (filtré par tag : Conseil, Entretien, Matières).
- [ ] **Lire l'article entier** dans la zone principale, y compris les sections collapsées. Si l'article ne dit pas X, le carrousel ne dira pas X.
- [ ] **Choisir le pattern narratif** qui colle au contenu :
  - Article qui liste des causes ou des erreurs avec un rattrapage → **Les causes**
  - Article qui explique une méthode étape par étape sur une matière → **Le geste-par-geste**
  - Article centré sur "ce qu'il ne faut pas faire" → **Les pièges**
  - Article qui part d'un signe visible (tache, odeur, défaut) → **Le diagnostic**

> 💡 Si l'article tient dans deux patterns (rare), choisis celui qui correspond à l'angle Instagram qu'on veut donner ce mois-ci. Tu peux générer deux versions et garder la meilleure.

## 2. Génération

- [ ] Cliquer **Générer le carrousel**. Compter ~45 secondes.
- [ ] Si erreur Zod ("slide … manque champ X"), relancer une fois — Claude rate parfois un tag. Si l'erreur revient, c'est un signal que le pattern ou l'article a un problème (article trop court, pattern mal choisi).

## 3. Relecture éditoriale (la phase qui compte)

Lire chaque slide à voix haute. À chaque fois, vérifier :

### Voix

- [ ] **Tutoiement partout.** Aucun "vous" qui traîne.
- [ ] **Pas de formule générique** (`découvrez`, `le saviez-vous ?`, `absolument`, `incroyable`, superlatifs creux).
- [ ] **Pas d'emoji** dans le texte (⚠️ 🔥 ✨ etc.).
- [ ] **Pas d'invention.** Chaque fait technique du carrousel doit pouvoir être pointé dans l'article source. Si tu ne retrouves pas une info dans l'article, supprime-la ou édite la slide.

### Forme

- [ ] **Cover** : titre 3-8 mots avec **italique sur le mot-clé central**. Sous-titre 5-10 mots qui complète.
- [ ] **Body** : tag MAJUSCULES (2-4 mots, format `Cause 0X / N` si série), titre-question avec italique, paragraphe ≤ 2 phrases, action en pattern **bold + plain**.
- [ ] **Method** : 2-3 étapes (jamais plus). Si plus, c'est un `steps`.
- [ ] **Steps** : 4-8 étapes. Chaque `title` est 1-3 mots impératifs/nominaux secs (ex : `Bain`, `Immerger`, `Presser`).
- [ ] **Donts** : 3-5 interdits. Chaque `reason` nomme la conséquence technique avec `→` (ex : `Choc thermique → feutrage instantané.`).
- [ ] **CTA** : titre qui pivote sur la cover, sous-titre qui pose l'enjeu, bouton avec label + texte (ex : `Confie-nous tes pièces` / `Express 2h, *7j/7.*`).

### Fond

- [ ] **Une idée = une slide.** Pas deux causes empilées sur la même.
- [ ] **Pas de phrase orpheline** ("Invisible." en seul fragment sans contexte).
- [ ] **Cohérence des tags** sur les slides parallèles (`Cause 01 / 04`, `Cause 02 / 04`, etc., toujours avec le même total).
- [ ] **Italique sur le mot-clé** du titre, pas un mot accessoire.
- [ ] **Action en bold + plain.** Phrase impérative en bold, précision/contexte en plain. Pas de mix italique/bold au milieu.

## 4. Édition inline si besoin

- [ ] Activer **Mode édition** (bouton jaune en haut à droite).
- [ ] Cliquer sur n'importe quel texte pour le modifier directement.
- [ ] Marqueurs : `*mot*` pour italique, `**mot**` pour bold.
- [ ] **Terminer l'édition** avant de sauvegarder en PNG.

## 5. Choix du thème visuel

- [ ] Vérifier le thème (cover/cta) dans le **ThemePicker** au-dessus du carrousel.
- [ ] Le fond de body est partagé entre tous les thèmes — ne pas changer sauf raison.
- [ ] Si un thème ne va pas, soit le modifier dans `/public/bg/themes/<id>/`, soit en créer un nouveau via le bouton "+".

## 6. Export PNG

- [ ] Cliquer **Sauvegarder en PNG**. Compter quelques secondes par slide (Playwright lance un Chromium headless).
- [ ] Quand l'export est fait, cliquer **📂 Ouvrir le dossier** pour voir les PNGs dans Finder.

## 7. Avant publication Instagram

- [ ] **Vérifier l'ordre des PNGs** : `01-cover.png`, `02-…`, `…N-cta.png`. Renommer si nécessaire.
- [ ] **Ouvrir chaque PNG** et vérifier qu'il n'y a pas de débordement de texte (slide tronquée, texte qui sort du cadre). Si oui, retoucher la slide en mode édition et ré-exporter.
- [ ] **Cohérence visuelle** : la cover et la cta doivent partager la même ambiance (le thème). Les body partagent le fond commun.
- [ ] **Test mobile** : ouvrir le dossier sur le téléphone, vérifier que le texte reste lisible à taille Instagram.

## 8. Publication

- [ ] Charger les PNGs dans l'ordre dans Instagram (multi-image).
- [ ] Légende Instagram = sous-titre de la cover + lien blog Bel & Blanc + 3-5 hashtags pertinents.
- [ ] Publication en story 24h après le post (recommandé).

---

## Les signaux qui doivent te faire **arrêter** la génération

- L'article fait moins de 300 mots → trop court, le carrousel sera plat. Étoffer l'article d'abord.
- L'article ne contient aucun fait technique précis → pas de matière pour Bel & Blanc. Refuser ou rééditer l'article.
- Le pattern choisi force des slides vides (ex : `donts` sur un article qui ne parle pas d'erreurs) → changer de pattern, ne pas forcer.

## Les bricolages à éviter

- Régénérer 5 fois en espérant un meilleur résultat → si Claude rate deux fois sur le même article, le problème est ailleurs (article, pattern, ou prompt). Investiguer.
- Éditer un mot dans une slide pour la rendre publiable mais laisser le reste générique. Soit la slide est bonne, soit on la retravaille en profondeur ou on régénère.
- Publier sans avoir lu chaque PNG en plein écran. Toujours regarder le rendu final avant Instagram.
