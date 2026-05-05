import { z } from "zod";

/**
 * Texte avec marqueurs : *...* = italique (mot accentué Cormorant blue-dark),
 * **...** = bold (Public Sans blue-dark dans les actions).
 */
const RichText = z.string().min(1);

/** Slide cover — premier slide, hook éditorial */
export const CoverSlide = z.object({
  type: z.literal("cover"),
  title: RichText.describe(
    "Titre principal du carrousel. 3-8 mots. Peut contenir un mot/groupe en italique avec *...*"
  ),
  subtitle: RichText.describe(
    "Phrase courte sous le titre. 5-10 mots. Promet ce que le carrousel délivre."
  ),
});

/** Slide body classique — tag + titre + paragraphe + encadré + action */
export const BodySlide = z.object({
  type: z.literal("body"),
  tag: z.string().describe(
    'Petite étiquette en haut. Ex: "Cause 01 / 04", "Pourquoi", "À retenir", "Entre les saisons"'
  ),
  title: RichText.describe(
    "Titre de la slide. 3-7 mots. Mot-clé en italique avec *...*"
  ),
  body: RichText.describe(
    "Paragraphe explicatif. 2 phrases max. Précis, factuel, voix d'artisan."
  ),
  testbox: z
    .object({
      label: z
        .string()
        .describe(
          'Label de l\'encadré. Ex: "Test rapide", "Signe visible", "La règle", "À retenir", "Le verdict"'
        ),
      text: RichText.describe(
        "Une phrase forte. 6-12 mots. Mot-clé en bold avec **...**"
      ),
    })
    .optional(),
  action: RichText.describe(
    "Ligne d'action en bas. Format: **Phrase impérative.** Précision en plain."
  ),
});

/** Slide méthode 2-3 étapes — pour les recettes courtes */
export const MethodSlide = z.object({
  type: z.literal("method"),
  tag: z.string(),
  title: RichText,
  steps: z
    .array(
      z.object({
        title: z.string().describe("Titre court de l'étape. 2-4 mots."),
        text: z.string().describe("Description compacte. 1 phrase max."),
      })
    )
    .min(2)
    .max(3),
  action: RichText.optional(),
});

/** Slide step-list — méthode longue 5-8 étapes compactes */
export const StepsSlide = z.object({
  type: z.literal("steps"),
  tag: z.string(),
  title: RichText,
  steps: z
    .array(
      z.object({
        title: z.string().describe("Verbe ou nom court. 1-3 mots."),
        text: z.string().describe("Description très brève. 6-12 mots."),
      })
    )
    .min(5)
    .max(8),
  action: RichText.optional(),
});

/** Slide donts — liste d'interdits avec ✕ rouge */
export const DontsSlide = z.object({
  type: z.literal("donts"),
  tag: z.string(),
  title: RichText,
  donts: z
    .array(
      z.object({
        title: z.string().describe("Le geste interdit. 3-6 mots."),
        reason: z.string().describe("Pourquoi c'est mal. 4-8 mots."),
      })
    )
    .min(3)
    .max(5),
  action: RichText,
});

/** Slide CTA finale */
export const CtaSlide = z.object({
  type: z.literal("cta"),
  title: RichText.describe("Phrase pivot finale. 6-10 mots."),
  subtitle: RichText.describe("Pont vers l'offre. 8-15 mots."),
  button: z.object({
    label: z.string().describe('Sur-titre du bouton. Ex: "Confie-nous tes pièces"'),
    text: RichText.describe('Action principale. Ex: "Express 2h, *7j/7.*"'),
  }),
});

export const Slide = z.discriminatedUnion("type", [
  CoverSlide,
  BodySlide,
  MethodSlide,
  StepsSlide,
  DontsSlide,
  CtaSlide,
]);

export const CarouselDraft = z.object({
  slides: z.array(Slide).min(5).max(10),
});

export type CoverSlide = z.infer<typeof CoverSlide>;
export type BodySlide = z.infer<typeof BodySlide>;
export type MethodSlide = z.infer<typeof MethodSlide>;
export type StepsSlide = z.infer<typeof StepsSlide>;
export type DontsSlide = z.infer<typeof DontsSlide>;
export type CtaSlide = z.infer<typeof CtaSlide>;
export type Slide = z.infer<typeof Slide>;
export type CarouselDraft = z.infer<typeof CarouselDraft>;
