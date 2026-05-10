"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleIndexEntry } from "@/lib/types";

interface Props {
  byTag: Record<string, ArticleIndexEntry[]>;
}

export default function Sidebar({ byTag }: Props) {
  const [query, setQuery] = useState("");
  const [openTags, setOpenTags] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(byTag).map((t) => [t, true]))
  );

  const filteredByTag = useMemo(() => {
    if (!query.trim()) return byTag;
    const q = query.toLowerCase();
    const result: Record<string, ArticleIndexEntry[]> = {};
    for (const [tag, articles] of Object.entries(byTag)) {
      const matches = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q))
      );
      if (matches.length) result[tag] = matches;
    }
    return result;
  }, [byTag, query]);

  const totalCount = Object.values(byTag).reduce((n, arr) => n + arr.length, 0);
  const filteredCount = Object.values(filteredByTag).reduce((n, arr) => n + arr.length, 0);

  return (
    <aside className="w-[360px] border-r border-blue/15 bg-bg-soft flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-blue/10">
        <Link href="/" className="block group">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-blue-dark">
              Carrousel Studio
            </span>
          </div>
          <div className="font-display text-night text-2xl">Bel &amp; Blanc</div>
        </Link>
        <Link
          href="/patterns"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-muted hover:text-night"
        >
          <span>◆</span> Patterns narratifs
        </Link>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherche article, mot-clé…"
          className="w-full px-4 py-2.5 text-sm rounded-md border border-blue/20 bg-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
        />
        <div className="mt-2 text-[11px] text-ink-muted tracking-wider uppercase">
          {filteredCount} / {totalCount} articles
        </div>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {Object.entries(filteredByTag).map(([tag, articles]) => (
          <div key={tag} className="mb-3">
            <button
              type="button"
              onClick={() => setOpenTags((s) => ({ ...s, [tag]: !s[tag] }))}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold tracking-[0.28em] uppercase text-blue-dark hover:bg-blue-light rounded-md"
            >
              <span>
                {openTags[tag] ? "▾" : "▸"} {tag}
              </span>
              <span className="text-ink-muted font-normal">{articles.length}</span>
            </button>
            {openTags[tag] && (
              <ul className="mt-1">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/editor/${a.slug}`}
                      className="block px-3 py-2 text-sm rounded-md hover:bg-white text-night transition-colors"
                    >
                      {a.title.replace(/\.\s*$/, "")}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
