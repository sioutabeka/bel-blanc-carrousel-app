import { NextResponse } from "next/server";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

export const runtime = "nodejs";

const OUTPUT_BASE = path.join(
  os.homedir(),
  "Documents",
  "carrousel-pressing-beletblanc"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const target = String(body?.path ?? "").trim();
    if (!target) {
      return NextResponse.json({ error: "path manquant" }, { status: 400 });
    }

    const resolved = path.resolve(target);
    const base = path.resolve(OUTPUT_BASE);
    if (resolved !== base && !resolved.startsWith(base + path.sep)) {
      return NextResponse.json(
        { error: "chemin hors du dossier autorisé" },
        { status: 400 }
      );
    }

    const cmd =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
        ? "explorer"
        : "xdg-open";

    spawn(cmd, [resolved], { detached: true, stdio: "ignore" }).unref();

    return NextResponse.json({ ok: true, path: resolved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "erreur inconnue";
    console.error("[/api/open-folder]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
