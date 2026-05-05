import { listArticlesByTag, getMeta } from "@/lib/articles";
import Sidebar from "./_components/Sidebar";

export default async function Home() {
  const [byTag, meta] = await Promise.all([listArticlesByTag(), getMeta()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar byTag={byTag} />

      <main className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-blue-light text-blue-dark text-xs font-bold tracking-[0.28em] uppercase">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Bel &amp; Blanc · Carrousel Studio
          </div>

          <h1 className="font-display text-night text-6xl leading-[0.98] mb-6">
            {meta.count} articles, prêts à <em className="font-serif text-blue-dark">devenir des carrousels.</em>
          </h1>

          <p className="font-serif italic text-xl text-ink-muted mb-8">
            Choisis un article dans la barre latérale pour démarrer.
          </p>

          <div className="text-sm text-ink-muted">
            <p className="mb-2">{meta.context}</p>
            <p className="italic">Tonalité : {meta.tone}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
