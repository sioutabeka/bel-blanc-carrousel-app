import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, listArticlesByTag } from "@/lib/articles";
import Sidebar from "@/app/_components/Sidebar";
import ExtractButton from "@/app/_components/ExtractButton";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, byTag] = await Promise.all([
    getArticle(slug),
    listArticlesByTag(),
  ]);

  if (!article) notFound();

  return (
    <div className="flex min-h-screen">
      <Sidebar byTag={byTag} />

      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Header — info article (lecture confortable) */}
        <div className="px-12 pt-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-dark">
                {article.tag}
              </span>
              <span className="text-ink-muted">·</span>
              <span className="text-[11px] tracking-wider uppercase text-ink-muted">
                {article.reading_time}
              </span>
            </div>

            <h1 className="font-display text-night text-5xl leading-[1.0] mb-4">
              {article.title.replace(/\.\s*$/, "")}.
            </h1>

            <p className="font-serif italic text-xl text-ink-muted mb-8 leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Zone carrousel — pleine largeur */}
        <div className="px-12 pb-10">
          <ExtractButton slug={article.slug} />
        </div>

        {/* Footer — sections debug et liens */}
        <div className="px-12 pb-12">
          <div className="max-w-3xl">
            <details className="mb-6 border border-blue/15 rounded-md bg-white">
              <summary className="px-4 py-3 cursor-pointer text-night font-semibold hover:bg-blue-light/40 rounded-md text-sm">
                <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-dark mr-2">
                  Source
                </span>
                Sections de l'article ({article.sections.length})
              </summary>
              <div className="px-4 pb-4 space-y-2 text-sm">
                {article.sections.map((s, i) => (
                  <div key={i} className="py-2 border-t border-blue/10">
                    <div className="font-semibold text-night mb-1">
                      <span className="font-serif italic text-blue-dark mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.heading}
                    </div>
                    <div className="text-xs text-ink leading-relaxed">
                      {s.content?.slice(0, 300) || (
                        <em className="text-ink-muted">— vide</em>
                      )}
                      {s.content && s.content.length > 300 && "…"}
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <div className="text-xs text-ink-muted pt-6 border-t border-blue/15">
              <Link href="/" className="hover:text-night">
                ← retour à l'accueil
              </Link>
              <span className="mx-2">·</span>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-night"
              >
                voir l'article original ↗
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
