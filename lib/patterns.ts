import { z } from "zod";

export type NarrativePattern = string;

export const PatternRecordSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id doit être en kebab-case (lettres minuscules, chiffres, tirets)"),
  label: z.string().min(1).max(80),
  tagline: z.string().min(1).max(160),
  brief: z.string().min(20),
});

export type PatternRecord = z.infer<typeof PatternRecordSchema>;

export const SEED_PATTERNS: PatternRecord[] = [
  {
    id: "les-causes",
    label: "Les causes",
    tagline: "Un problème observé → 3-5 causes → la méthode pour rattraper",
    brief: `**Pattern : Les causes.**

- Job narratif : un seul problème visible (le blanc qui grisaille, le pull qui pique, la chemise qui jaunit, le pli qui ne tient pas), 3 à 5 causes à expliquer une par une, puis la méthode artisanale pour rattraper. C'est le pattern le plus utilisé du studio.
- Séquence attendue : \`cover\` (le problème en hook : "Pourquoi ton X *devient Y.*") → \`body\` × 3 à 5 (chaque cause numérotée \`Cause 01 / N\`, \`Cause 02 / N\`, etc.) → \`method\` (la méthode de rattrapage en 2-3 étapes) → \`cta\`. 6-8 slides au total.
- Ton : voix d'artisan, factuel, sans dramatiser. "Voilà pourquoi ça arrive, voilà comment on rattrape." Pas alarmiste, pas culpabilisant.
- Tags privilégiés : \`Cause 01 / N\`, \`Cause 02 / N\`, \`Cause 03 / N\`, etc. (avec le total final, ex \`/04\`, pour signaler la position dans la série) ; \`La méthode\` ou \`Le rattrapage\` pour la slide finale technique.
- Le titre de la cover doit nommer le **symptôme observé** (ce que tu vois), pas la cause technique. Ex : "Pourquoi ton blanc *devient gris*", pas "Les tensioactifs piégés".
- Chaque body \`action\` doit être une instruction concrète liée à la cause de la slide ("**Divise la dose par deux.** Cycle de rinçage en plus une fois par mois."), pas un résumé général.
- La \`method\` finale ne reprend pas les causes — elle propose le geste correctif global (décaper, traiter, neutraliser…).`,
  },
  {
    id: "geste-par-geste",
    label: "Le geste-par-geste",
    tagline: "Méthode artisanale précise, étape par étape",
    brief: `**Pattern : Le geste-par-geste.**

- Job narratif : transmettre une méthode artisanale précise pour entretenir une matière ou une pièce délicate (cachemire, soie, lin, dentelle, cuir lavable…). Chaque geste a une raison technique. Le carrousel **enseigne un savoir-faire**.
- Séquence attendue : \`cover\` (la pièce + la promesse, ton "lent et méthodique") → \`body\` × 1 ou 2 (le contexte fibre / pourquoi cette méthode) → \`steps\` (4 à 8 gestes courts) → \`donts\` (optionnel, 3-4 erreurs clés à éviter) → \`cta\`. 5-7 slides au total.
- Ton : précis, tutoyé, vocabulaire technique mais accessible. "Sans tordre, presser comme une éponge." Tu nommes le geste, tu donnes la durée ou la température, tu expliques pourquoi.
- Tags privilégiés : \`Méthode · N étapes\`, \`La règle d'or\`, \`Avant de commencer\`, \`Le bon réflexe\`.
- Les noms d'étapes (\`steps[].title\`) doivent être 1-3 mots impératifs ou nominaux secs : \`Bain\`, \`Immerger\`, \`Tremper\`, \`Presser\`, \`Rincer\`, \`Essorer\`, \`Sécher\`. Pas de phrase complète.
- Les \`text\` des étapes : 1 phrase qui donne la précision technique (température, durée, geste exact).
- Le \`cta\` doit pivoter sur la valeur du savoir-faire ("Si tu n'as pas le temps ou si tu hésites, on a les bains et le matériel à l'atelier").`,
  },
  {
    id: "les-pieges",
    label: "Les pièges",
    tagline: "3 à 5 erreurs à ne jamais faire — et leur conséquence",
    brief: `**Pattern : Les pièges.**

- Job narratif : alerter sur les gestes destructeurs ou les erreurs courantes pour une matière, une pièce, ou une machine. Chaque interdit a une conséquence technique nommée. La leçon : "Tout part en X dès qu'un de ces gestes est fait."
- Séquence attendue : \`cover\` (la pièce + le hook "ce qui tue X") → \`body\` × 1 à 2 (contexte court : ce qui rend la pièce fragile, ou pourquoi ces gestes sont fatals) → \`donts\` (3 à 5 interdits) → \`cta\`. 5-7 slides au total.
- **Privilégier le type \`donts\` plutôt qu'enchaîner des \`body\`.** Le pattern existe pour ça.
- Ton : tranchant mais factuel, jamais catastrophiste. Direct. "Choc thermique → feutrage instantané." Pas de "attention ⚠️", pas de "le saviez-vous ?".
- Tags privilégiés : \`À ne jamais faire\`, \`Les pièges\`, \`Mauvais réflexe\`, \`Geste fatal\`.
- Les \`donts[].title\` : 2-6 mots qui nomment le geste ("Eau froide après tiède", "Machine, même cycle « laine »").
- Les \`donts[].reason\` : 1 phrase courte qui nomme la conséquence technique avec une flèche \`→\` (ex : "Choc thermique → feutrage instantané.").
- L'\`action\` de la slide \`donts\` doit nommer la conséquence globale ("**Tout part en feutrage** dès qu'un de ces gestes est fait.").`,
  },
  {
    id: "le-diagnostic",
    label: "Le diagnostic",
    tagline: "Signe visible → cause technique → solution → seuil atelier",
    brief: `**Pattern : Le diagnostic.**

- Job narratif : partir d'un signe visible précis (tache jaune sur col, odeur persistante, pli rebelle, auréole), expliquer ce que ce signe dit techniquement, donner la solution maison, et nommer le seuil à partir duquel il faut nous confier la pièce. C'est un pattern **pédagogique-prescripteur**.
- Séquence attendue : \`cover\` (le signe en visuel concret : "Une tache *jaune* qui ne part pas au lavage.") → \`body\` (ce que ce signe te dit, ce qui se passe dans la fibre) → \`method\` ou \`steps\` (la solution maison) → \`body\` (le seuil "à partir de quand c'est trop tard pour la maison") → \`cta\`. 5-7 slides au total.
- Ton : pédagogique, expert, "voilà ce que tu vois et voilà ce que ça veut dire". L'expertise n'écrase pas, elle éclaire.
- Tags privilégiés : \`Le signe\`, \`Ce que ça veut dire\`, \`Ce qui se passe\`, \`La solution maison\`, \`Le seuil\`, \`Quand nous confier la pièce\`.
- La cover doit décrire le signe en **visuel concret**, pas en jargon. "Tache jaune sur col" et pas "transfert sébacé oxydatif".
- La slide "seuil" est essentielle : elle pose le moment où la maison ne suffit plus. Sans elle, le \`cta\` paraît plaqué.
- Le \`cta\` enchaîne sur le seuil ("Au-delà, c'est l'atelier qu'il faut").`,
  },
];

export function slugifyPatternId(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
