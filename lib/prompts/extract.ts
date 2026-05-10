import type { Article } from "../types";
import type { CarouselDraft } from "../schemas";
import { CarouselDraft as CarouselDraftSchema } from "../schemas";
import { callClaude } from "../claude";
import { getPattern } from "../patterns-store";
import type { NarrativePattern } from "../patterns";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "../locales";
import { VOICE_FR } from "./voice-fr";
import { VOICE_AR } from "./voice-ar";

/**
 * Schema JSON pour le tool `output_carousel`. Discriminé par `type` via `oneOf` :
 * Claude voit les contraintes exactes par variante (min/max steps, champs requis).
 * Reflète strictement le schéma Zod côté `lib/schemas.ts`.
 */
const SLIDE_COVER = {
  type: "object",
  properties: {
    type: { const: "cover" },
    title: { type: "string" },
    subtitle: { type: "string" },
  },
  required: ["type", "title", "subtitle"],
  additionalProperties: false,
} as const;

const SLIDE_BODY = {
  type: "object",
  properties: {
    type: { const: "body" },
    tag: { type: "string" },
    title: { type: "string" },
    body: { type: "string" },
    testbox: {
      type: "object",
      properties: {
        label: { type: "string" },
        text: { type: "string" },
      },
      required: ["label", "text"],
      additionalProperties: false,
    },
    action: { type: "string" },
  },
  required: ["type", "tag", "title", "body", "action"],
  additionalProperties: false,
} as const;

const SLIDE_METHOD = {
  type: "object",
  properties: {
    type: { const: "method" },
    tag: { type: "string" },
    title: { type: "string" },
    steps: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
        },
        required: ["title", "text"],
        additionalProperties: false,
      },
    },
    action: { type: "string" },
  },
  required: ["type", "tag", "title", "steps"],
  additionalProperties: false,
} as const;

const SLIDE_STEPS = {
  type: "object",
  properties: {
    type: { const: "steps" },
    tag: { type: "string" },
    title: { type: "string" },
    steps: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
        },
        required: ["title", "text"],
        additionalProperties: false,
      },
    },
    action: { type: "string" },
  },
  required: ["type", "tag", "title", "steps"],
  additionalProperties: false,
} as const;

const SLIDE_DONTS = {
  type: "object",
  properties: {
    type: { const: "donts" },
    tag: { type: "string" },
    title: { type: "string" },
    donts: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
        },
        required: ["title", "reason"],
        additionalProperties: false,
      },
    },
    action: { type: "string" },
  },
  required: ["type", "tag", "title", "donts", "action"],
  additionalProperties: false,
} as const;

const SLIDE_CTA = {
  type: "object",
  properties: {
    type: { const: "cta" },
    title: { type: "string" },
    subtitle: { type: "string" },
    button: {
      type: "object",
      properties: {
        label: { type: "string" },
        text: { type: "string" },
      },
      required: ["label", "text"],
      additionalProperties: false,
    },
  },
  required: ["type", "title", "subtitle", "button"],
  additionalProperties: false,
} as const;

const TOOL_SCHEMA = {
  type: "object",
  properties: {
    slides: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: {
        oneOf: [
          SLIDE_COVER,
          SLIDE_BODY,
          SLIDE_METHOD,
          SLIDE_STEPS,
          SLIDE_DONTS,
          SLIDE_CTA,
        ],
      },
    },
  },
  required: ["slides"],
} as const;

const VOICES = { fr: VOICE_FR, ar: VOICE_AR } as const;

export async function extractCarousel(
  article: Article,
  pattern: NarrativePattern,
  locale: Locale = DEFAULT_LOCALE
): Promise<CarouselDraft> {
  const record = await getPattern(pattern);
  if (!record) {
    throw new Error(`pattern "${pattern}" introuvable`);
  }

  const articleBlock = `Title: ${article.title}
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
}`;

  const userMessage = `## Langue cible

Génère ce carrousel en **${LOCALES[locale].instruction}**. Réponds intégralement dans cette langue (sauf les noms propres et la marque "Bel & Blanc").

---

## Pattern à utiliser

${record.brief}

---

## Article à transformer en carrousel

${articleBlock}

Produis un carrousel cohérent (5-10 slides) qui suit le pattern ci-dessus, dans la langue cible. Reste fidèle au contenu de l'article.`;

  const voice = VOICES[locale];
  const draft = await callClaude({
    systemPrompt: `${voice.brandVoice}\n\n${voice.fewShot}`,
    userMessage,
    jsonSchema: TOOL_SCHEMA,
    outputSchema: CarouselDraftSchema,
  });

  return { ...draft, locale };
}
