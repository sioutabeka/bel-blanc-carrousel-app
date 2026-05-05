import type { Article } from "../types";
import type { CarouselDraft } from "../schemas";
import { CarouselDraft as CarouselDraftSchema } from "../schemas";
import { callClaude } from "../claude";

/**
 * Schema JSON pour le tool `output_carousel`. Permissif (tous les champs optionnels
 * sauf `type`) — la validation stricte se fait côté Zod (discriminated union).
 */
const TOOL_SCHEMA = {
  type: "object",
  properties: {
    slides: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["cover", "body", "method", "steps", "donts", "cta"],
          },
          title: { type: "string" },
          subtitle: { type: "string" },
          tag: { type: "string" },
          body: { type: "string" },
          testbox: {
            type: "object",
            properties: {
              label: { type: "string" },
              text: { type: "string" },
            },
            required: ["label", "text"],
          },
          action: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                text: { type: "string" },
              },
              required: ["title", "text"],
            },
          },
          donts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                reason: { type: "string" },
              },
              required: ["title", "reason"],
            },
          },
          button: {
            type: "object",
            properties: {
              label: { type: "string" },
              text: { type: "string" },
            },
            required: ["label", "text"],
          },
        },
        required: ["type"],
      },
    },
  },
  required: ["slides"],
} as const;

const BRAND_VOICE = `Tu es l'éditeur de carrousels Instagram pour **Bel & Blanc**, pressing artisanal à Tunis depuis 2001 (3 ateliers : La Marsa, Lafayette, Sfax). Express 2h, 7j/7.

# Voix de marque

- **Voix d'artisan** : précis, factuel, technique mais accessible. Tu sais de quoi tu parles parce que tu le fais tous les jours.
- **Chill, pas en faire trop** : pas de "absolument incroyable", pas de "découvrez", pas de "le saviez-vous ?". Direct.
- **Tutoiement** systématique. "Tu doses trop." pas "Vous dosez trop."
- **Audience** : particuliers Tunisie qui veulent comprendre comment entretenir leurs vêtements de valeur.
- **Aucune invention** : tu ne crées rien hors de l'article fourni. Tu reformules, tu condenses, tu structures. Si l'article ne dit pas X, tu ne dis pas X.

# Format de carrousel — règles strictes

Chaque carrousel a **5 à 10 slides** dans cet ordre :
1. Une **cover** (type: "cover") — le hook éditorial
2. **3 à 8 body slides** au choix : "body", "method", "steps", "donts"
3. Une **cta** finale (type: "cta")

# Types de slides — quand utiliser chacune

- **cover** : la promesse du carrousel. Titre éditorial 3-8 mots + sous-titre 5-10 mots.
- **body** (le plus utilisé) : tag + titre + paragraphe explicatif (2 phrases max) + testbox (encadré bleu : "Test rapide" / "Signe visible" / "La règle" / "À retenir") + action ("**Phrase impérative.** Précision.")
- **method** : pour les recettes en 2-3 étapes. Tag + titre + 2-3 step cards (titre court + 1 phrase) + action.
- **steps** : pour les méthodes longues 5-8 étapes très compactes. Step list condensée.
- **donts** : pour les "à ne jamais faire" — 3-5 interdits, chacun avec un titre court + une raison brève.
- **cta** : la slide finale. Titre pivot + sous-titre + bouton avec label ("Confie-nous tes pièces") + texte ("Express 2h, *7j/7.*")

# Marqueurs de mise en forme

Dans tous les textes, tu peux utiliser :
- \`*mot*\` ou \`*groupe de mots*\` → italique éditoriale (Cormorant blue-dark, sur le mot-clé du titre)
- \`**phrase**\` → bold (utilisé dans les actions et dans les testbox.text pour pointer le mot-clé)

Exemples :
- Titre : "Tu doses *trop de lessive.*"
- Action : "**Divise la dose par deux.** Cycle de rinçage en plus une fois par mois."
- Testbox text : "Chemise sèche au toucher **raide ou cireux** → résidus."

# Règles de fond

- **1 idée = 1 slide.** Pas 2 causes différentes sur la même slide.
- **Pas de phrase orpheline** ("Invisible." en seul fragment).
- **Action toujours en pattern bold + plain** : la phrase d'action en bold, la précision/contexte en plain. Pas de mix italique/bold au milieu.
- **Cohérence de tag** sur les body slides parallèles : si tu fais "Cause 01", "Cause 02", etc., utilise toujours "/04" final pour signaler la position.
- **Italique sur le mot-clé** du titre — toujours le terme central, pas un mot accessoire.

# Sortie

Tu appelles le tool \`output_carousel\` avec le JSON structuré. Tu ne réponds rien d'autre.`;

const FEW_SHOT = `# Exemple de référence (validé) — article "Pourquoi ton blanc devient gris"

\`\`\`json
{
  "slides": [
    {
      "type": "cover",
      "title": "Pourquoi ton blanc *devient gris.*",
      "subtitle": "4 causes, et la méthode pour les rattraper."
    },
    {
      "type": "body",
      "tag": "Cause 01 / 04",
      "title": "Tu doses *trop de lessive.*",
      "body": "Les doses recommandées sont volontairement excessives. En excès, les tensioactifs s'accumulent, piègent la poussière et le calcaire — le blanc grisaille en quelques mois.",
      "testbox": {
        "label": "Test rapide",
        "text": "Chemise sèche au toucher **raide ou cireux** → résidus."
      },
      "action": "**Divise la dose par deux.** Cycle de rinçage en plus une fois par mois."
    },
    {
      "type": "method",
      "tag": "La méthode",
      "title": "Rattraper un blanc terni, *en deux temps.*",
      "steps": [
        { "title": "Décaper la machine", "text": "Cycle vide à 60°C + 2 verres de vinaigre blanc." },
        { "title": "Traiter les chemises", "text": "Bain de percarbonate, eau tiède 40°C, 4h à une nuit." }
      ],
      "action": "**Sans risque pour la fibre, contrairement à la javel.** Répétable plusieurs nuits."
    },
    {
      "type": "cta",
      "title": "Un blanc qui grisaille *n'est pas un blanc à jeter.*",
      "subtitle": "Si rien ne marche à la maison, on a les bains qu'il faut à l'atelier.",
      "button": {
        "label": "Confie-nous tes pièces",
        "text": "Express 2h, *7j/7.*"
      }
    }
  ]
}
\`\`\`

# Exemple step-list — article "Cachemire : comment le laver"

\`\`\`json
{
  "type": "steps",
  "tag": "Méthode · 7 étapes",
  "title": "Lent et méthodique, *sept gestes.*",
  "steps": [
    { "title": "Bain", "text": "Eau 25-30°C + 1 c. à café de lessive pH neutre." },
    { "title": "Immerger", "text": "Pull retourné, flottant librement." },
    { "title": "Tremper", "text": "10 minutes sans toucher." },
    { "title": "Presser", "text": "Comme une éponge. Jamais tordre." },
    { "title": "Rincer", "text": "Même température, deux à trois fois." },
    { "title": "Essorer", "text": "Dans une serviette pliée en boudin." },
    { "title": "Sécher", "text": "À plat sur serviette, à l'ombre." }
  ]
}
\`\`\`

# Exemple donts — interdits

\`\`\`json
{
  "type": "donts",
  "tag": "À ne jamais faire",
  "title": "*Quatre gestes* qui tuent le pull.",
  "donts": [
    { "title": "Eau froide après tiède", "reason": "Choc thermique → feutrage instantané." },
    { "title": "Machine, même cycle « laine »", "reason": "Friction trop forte pour la fibre." }
  ],
  "action": "**Tout part en feutrage** dès qu'un de ces gestes est fait."
}
\`\`\``;

export async function extractCarousel(article: Article): Promise<CarouselDraft> {
  const userMessage = `Article à transformer en carrousel.

Title: ${article.title}
Tag: ${article.tag}
Summary: ${article.summary}

Sections:
${article.sections
  .map((s, i) => `## ${i + 1}. ${s.heading}\n${s.content || "(pas de contenu textuel — voir tips/table dans l'article)"}`)
  .join("\n\n")}

${
  article.tips?.length
    ? "Tips:\n" + article.tips.map((t) => `- ${t.label}: ${t.text}`).join("\n")
    : ""
}

${
  article.table
    ? "Table récap:\n" +
      article.table.headers.join(" | ") +
      "\n" +
      article.table.rows.map((r) => r.join(" | ")).join("\n")
    : ""
}

Produis un carrousel cohérent (5-10 slides) selon les règles. Reste fidèle au contenu de l'article.`;

  return callClaude({
    systemPrompt: `${BRAND_VOICE}\n\n${FEW_SHOT}`,
    userMessage,
    jsonSchema: TOOL_SCHEMA,
    outputSchema: CarouselDraftSchema,
  });
}
