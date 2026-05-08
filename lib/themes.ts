import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const THEMES_DIR = path.join(process.cwd(), "public", "bg", "themes");

export interface Theme {
  id: string;
  name: string;
  coverUrl: string;
  bodyUrl: string;
  ctaUrl: string;
  hasBody: boolean;
}

const FALLBACK_BODY_URL = "/bg/body.png";

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export async function listThemes(): Promise<Theme[]> {
  let entries: { name: string; isDirectory: () => boolean }[];
  try {
    entries = await fs.readdir(THEMES_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const themes: Theme[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(THEMES_DIR, e.name);
    const files = await fs.readdir(dir);
    if (!files.includes("cover.png") || !files.includes("cta.png")) continue;
    const hasBody = files.includes("body.png");
    themes.push({
      id: e.name,
      name: e.name === "default" ? "Défaut" : titleCase(e.name),
      coverUrl: `/bg/themes/${e.name}/cover.png`,
      bodyUrl: hasBody ? `/bg/themes/${e.name}/body.png` : FALLBACK_BODY_URL,
      ctaUrl: `/bg/themes/${e.name}/cta.png`,
      hasBody,
    });
  }

  return themes.sort((a, b) => {
    if (a.id === "default") return -1;
    if (b.id === "default") return 1;
    return a.name.localeCompare(b.name);
  });
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTheme(
  name: string,
  cover: ArrayBuffer,
  cta: ArrayBuffer,
  body?: ArrayBuffer
): Promise<Theme> {
  const id = slugify(name);
  if (!id) throw new Error("nom de thème invalide");
  if (id === "default") throw new Error("le nom 'default' est réservé");

  const dir = path.join(THEMES_DIR, id);
  try {
    await fs.access(dir);
    throw new Error(`le thème "${id}" existe déjà`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("existe déjà")) throw e;
  }

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "cover.png"), Buffer.from(cover));
  await fs.writeFile(path.join(dir, "cta.png"), Buffer.from(cta));
  if (body) {
    await fs.writeFile(path.join(dir, "body.png"), Buffer.from(body));
  }

  return {
    id,
    name: titleCase(id),
    coverUrl: `/bg/themes/${id}/cover.png`,
    bodyUrl: body ? `/bg/themes/${id}/body.png` : FALLBACK_BODY_URL,
    ctaUrl: `/bg/themes/${id}/cta.png`,
    hasBody: !!body,
  };
}

export async function deleteTheme(id: string): Promise<void> {
  if (!id || id === "default") {
    throw new Error("le thème par défaut ne peut pas être supprimé");
  }
  if (id !== slugify(id)) {
    throw new Error("identifiant de thème invalide");
  }

  const dir = path.join(THEMES_DIR, id);
  const resolved = path.resolve(dir);
  const base = path.resolve(THEMES_DIR);
  if (!resolved.startsWith(base + path.sep)) {
    throw new Error("chemin hors du dossier des thèmes");
  }

  try {
    await fs.access(dir);
  } catch {
    throw new Error(`le thème "${id}" n'existe pas`);
  }

  await fs.rm(dir, { recursive: true, force: true });
}
