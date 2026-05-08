"use client";

import { useEffect, useRef, useState } from "react";

export interface Theme {
  id: string;
  name: string;
  coverUrl: string;
  bodyUrl: string;
  ctaUrl: string;
  hasBody: boolean;
}

interface Props {
  value: string | undefined;
  onChange: (themeId: string | undefined) => void;
}

export default function ThemePicker({ value, onChange }: Props) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/bg/themes", { cache: "no-store" });
      const data = await res.json();
      setThemes(data.themes ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTheme(id: string, name: string) {
    if (!confirm(`Supprimer le thème "${name}" ? Cette action est définitive.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/bg/themes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (value === id) onChange(undefined);
      await refresh();
    } catch (err) {
      alert(`Suppression impossible : ${err instanceof Error ? err.message : "erreur"}`);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const current = value ?? "default";

  return (
    <div className="rounded-md border border-blue/15 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-dark">
          🎨 Thème
        </div>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="text-xs underline text-ink-muted hover:text-night"
        >
          {adding ? "× annuler" : "+ ajouter un thème"}
        </button>
      </div>

      {loading && <div className="text-xs text-ink-muted">chargement…</div>}

      {!loading && (
        <div className="flex gap-3 flex-wrap">
          {themes.map((t) => (
            <div key={t.id} className="relative w-28 group">
              <button
                type="button"
                onClick={() => onChange(t.id === "default" ? undefined : t.id)}
                className={`block w-full rounded-md overflow-hidden border-2 transition ${
                  current === t.id
                    ? "border-blue ring-2 ring-blue/30"
                    : "border-blue/15 hover:border-blue/40"
                }`}
                title={t.name}
              >
                <div className="flex">
                  <img
                    src={t.coverUrl}
                    alt=""
                    className="w-1/3 aspect-[1080/1350] object-cover"
                  />
                  <img
                    src={t.bodyUrl}
                    alt=""
                    title={t.hasBody ? "body personnalisé" : "body par défaut"}
                    className={`w-1/3 aspect-[1080/1350] object-cover ${
                      t.hasBody ? "" : "opacity-60"
                    }`}
                  />
                  <img
                    src={t.ctaUrl}
                    alt=""
                    className="w-1/3 aspect-[1080/1350] object-cover"
                  />
                </div>
                <div className="px-2 py-1 text-[11px] font-semibold text-night truncate bg-white">
                  {t.name}
                </div>
              </button>
              {t.id !== "default" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTheme(t.id, t.name);
                  }}
                  disabled={deletingId === t.id}
                  title={`Supprimer "${t.name}"`}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 border border-red-200 text-red-700 text-xs opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-400 transition disabled:opacity-50"
                >
                  {deletingId === t.id ? "…" : "🗑"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {adding && (
        <AddThemeForm
          onSuccess={() => {
            setAdding(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function AddThemeForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);
  const ctaRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cover = coverRef.current?.files?.[0];
    const cta = ctaRef.current?.files?.[0];
    const body = bodyRef.current?.files?.[0];
    if (!name.trim() || !cover || !cta) {
      setError("nom + cover + cta requis");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("cover", cover);
      fd.append("cta", cta);
      if (body) fd.append("body", body);
      const res = await fetch("/api/bg/themes", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-md bg-blue-light/40 border border-blue/20 p-3 space-y-2 text-sm"
    >
      <label className="block">
        <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-blue-dark mb-1">
          Nom du thème
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: bleu marbre"
          className="w-full px-3 py-1.5 rounded border border-blue/20 bg-white"
        />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="block">
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-blue-dark mb-1">
            Cover (PNG)
          </span>
          <input ref={coverRef} type="file" accept="image/png" className="text-xs w-full" />
        </label>
        <label className="block">
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-blue-dark mb-1">
            Body <span className="font-normal italic normal-case tracking-normal text-ink-muted">(facultatif)</span>
          </span>
          <input ref={bodyRef} type="file" accept="image/png" className="text-xs w-full" />
        </label>
        <label className="block">
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-blue-dark mb-1">
            CTA (PNG)
          </span>
          <input ref={ctaRef} type="file" accept="image/png" className="text-xs w-full" />
        </label>
      </div>
      {error && <div className="text-xs text-red-700">⚠ {error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-1.5 rounded bg-night text-white text-xs font-semibold tracking-wide hover:bg-night-mid disabled:opacity-50"
      >
        {submitting ? "Upload…" : "Enregistrer le thème"}
      </button>
    </form>
  );
}
