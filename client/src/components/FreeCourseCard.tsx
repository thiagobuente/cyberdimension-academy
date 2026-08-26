import { ArrowUpRight, Play, Video, X } from "lucide-react";
import { Link } from "wouter";

export type ContinueWatchCard = {
  slug: string;
  title: string;
  category: string;
  progressPct: number;
  watched: number;
  total: number;
  remaining: number;
  videoId?: string | null;
};

type FreeCourseCardProps = {
  card: ContinueWatchCard;
  onDismiss: (slug: string) => void;
};

const NEARLY_THERE_PCT = 90;

export function FreeCourseCard({ card, onDismiss }: FreeCourseCardProps) {
  const thumbnailUrl = card.videoId ? `https://i.ytimg.com/vi/${card.videoId}/hqdefault.jpg` : null;
  const videoLink = `/cursos-gratuitos?buscar=${encodeURIComponent(card.title.toLowerCase())}`;
  const nearlyThere = card.progressPct >= NEARLY_THERE_PCT && card.remaining > 0;

  return (
    <article className="module-card rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.07] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.12em] text-neon-cyan/80">
            {card.category}
          </p>
          <h3 className="mt-1 truncate font-orbitron text-sm font-bold" title={card.title}>
            {card.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {nearlyThere ? (
            <span className="nearly-there-pulse rounded-full border border-neon-green/40 bg-neon-green/10 px-2 py-0.5 text-[0.65rem] font-bold text-neon-green">
              Quase lá!
            </span>
          ) : null}
          <span className="rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2 py-0.5 text-[0.68rem] font-bold text-neon-cyan">
            {card.progressPct}%
          </span>
          <button
            type="button"
            title="Remover da lista"
            onClick={() => onDismiss(card.slug)}
            className="grid h-6 w-6 place-items-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-neon-purple/40 hover:text-neon-purple"
            aria-label={`Remover ${card.title} da lista`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {thumbnailUrl ? (
        <a
          href={videoLink}
          className="relative mt-3 block aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black/30"
          aria-label={`Retomar ${card.title}`}
        >
          <img
            src={thumbnailUrl}
            alt={`Miniatura de ${card.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 opacity-60 transition-opacity duration-200 group-hover:opacity-80" />
          <div className="play-overlay pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-neon-cyan/60 bg-neon-cyan/25 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <Play className="h-5 w-5 text-neon-cyan" fill="currentColor" />
            </span>
            <span className="absolute -bottom-8 left-1/2 z-10 w-64 -translate-x-1/2 whitespace-nowrap rounded-md border border-neon-cyan/40 bg-[oklch(0.13_0.04_260/0.97)] px-2.5 py-1.5 text-center text-[0.65rem] font-bold text-foreground shadow-lg">
              <span className="text-neon-cyan">Próximo:</span> {card.title}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
              style={{ width: `${card.progressPct}%` }}
            />
          </div>
        </a>
      ) : null}

      <div className="group relative mt-3">
        <div className="flex cursor-default items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green transition-[width] duration-500"
              style={{ width: `${card.progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[0.68rem] font-bold text-muted-foreground">
            {card.watched}/{card.total}
          </span>
        </div>
        <div className="pointer-events-none absolute -top-11 left-1/2 z-10 w-64 -translate-x-1/2 rounded-lg border border-neon-cyan/40 bg-[oklch(0.13_0.04_260/0.97)] px-3 py-2 text-center text-[0.68rem] leading-4 font-bold text-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
          <span className="text-neon-cyan">
            {card.remaining > 0
              ? `Faltam ${card.remaining} curso${card.remaining === 1 ? "" : "s"} para concluir a categoria`
              : "Categoria concluída"}
          </span>
          <span className="mt-0.5 block text-muted-foreground">
            {card.progressPct}% da categoria ·{" "}
            {card.remaining > 0 ? `${card.remaining} restante${card.remaining === 1 ? "" : "s"}` : "0 restantes"}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[0.7rem] leading-5 text-muted-foreground">
        {card.remaining > 0
          ? `Faltam ${card.remaining} curso${card.remaining === 1 ? "" : "s"} para concluir a categoria.`
          : "Categoria concluída. Explore outra na biblioteca."}
      </p>

      <div className="mt-3 flex justify-between gap-2">
        <a
          href={videoLink}
          className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-3 py-2 text-[0.7rem] font-bold text-neon-cyan"
        >
          <Video className="h-3.5 w-3.5" />
          {card.progressPct > 0 ? "Continuar" : "Começar"}
        </a>
        <Link
          href="/cursos-gratuitos"
          className="inline-flex items-center gap-1 px-2 py-2 text-[0.68rem] font-bold text-muted-foreground hover:text-neon-cyan"
        >
          Explorar <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
