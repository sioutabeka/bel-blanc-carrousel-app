export type Locale = "fr" | "ar";

export const LOCALES = {
  fr: {
    label: "Français",
    short: "FR",
    dir: "ltr" as const,
    instruction: "français standard, voix Bel & Blanc",
  },
  ar: {
    label: "Tounsi",
    short: "TN",
    dir: "ltr" as const,
    instruction:
      "code-switch français-darija tunisien (base française avec expressions arabizi qui ponctuent — style Insta tunisois urbain)",
  },
} as const satisfies Record<Locale, { label: string; short: string; dir: "ltr" | "rtl"; instruction: string }>;

export const LOCALE_IDS = Object.keys(LOCALES) as Locale[];

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (value === "fr" || value === "ar");
}
