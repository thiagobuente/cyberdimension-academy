import { useMemo, useState } from "react";
import { ExternalLink, Search, Filter, Flag, TrendingUp, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CTF_AREAS, CTF_LEVELS, CTF_AREA_LABELS, CTF_LEVEL_LABELS, type CtfArea, type CtfEntry, type CtfLevel } from "@shared/ctfCatalog";
function levelStyles(level: CtfLevel) {
  switch (level) {
    case "iniciante":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/25";
    case "intermediario":
      return "bg-amber-500/10 text-amber-300 border-amber-500/25";
    case "avancado":
      return "bg-rose-500/10 text-rose-300 border-rose-500/25";
  }
}

function areaStyles(area: CtfArea) {
  switch (area) {
    case "linux":
      return "bg-cyan-500/10 text-cyan-300 border-cyan-500/25";
    case "web":
      return "bg-violet-500/10 text-violet-300 border-violet-500/25";
    case "crypto":
      return "bg-indigo-500/10 text-indigo-300 border-indigo-500/25";
    case "forense":
      return "bg-orange-500/10 text-orange-300 border-orange-500/25";
    case "malware":
      return "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25";
    case "blue-team":
      return "bg-sky-500/10 text-sky-300 border-sky-500/25";
    case "red-team":
      return "bg-pink-500/10 text-pink-300 border-pink-500/25";
  }
}

export default function Ctfs() {
  const { isAuthenticated } = useAuth();
  const [levelFilter, setLevelFilter] = useState<CtfLevel | null>(null);
  const [areaFilter, setAreaFilter] = useState<CtfArea | null>(null);
  const [search, setSearch] = useState("");

  const catalogQuery = trpc.ctf.list.useQuery();
  const catalog = catalogQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return catalog.filter((entry) => {
      if (levelFilter && entry.level !== levelFilter) return false;
      if (areaFilter && entry.area !== areaFilter) return false;
      if (!term) return true;
      return (
        entry.title.toLowerCase().includes(term) ||
        entry.platform.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term)
      );
    });
  }, [catalog, levelFilter, areaFilter, search]);

  const handleOpen = (entry: CtfEntry) => {
    window.open(entry.url, "_blank", "noopener,noreferrer");
  };

  const platforms = useMemo(() => {
    const seen = new Map<string, string>();
    catalog.forEach((entry) => {
      if (!seen.has(entry.platform)) seen.set(entry.platform, entry.platformUrl);
    });
    return Array.from(seen.entries());
  }, [catalog]);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E6EAF0]">
      <header className="border-b border-white/5 bg-[#0D1326]/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">Hub de Laboratórios Práticos</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">CTFs — Capture The Flag</h1>
            <p className="max-w-3xl text-sm text-[#AAB4C3] sm:text-base">
              A CyberDimension Academy te ensina a teoria; os CTFs treinam a prática. Este hub reúne os melhores desafios
              externos e gratuitos da comunidade. Clique em <span className="text-cyan-300">“Abrir desafio”</span> para ir
              direto à plataforma, crie sua conta lá e evolua no seu próprio ritmo.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm">
              <Flag className="h-4 w-4 shrink-0 text-cyan-300" />
              <span className="text-[#AAB4C3]">
                Faça login na CyberDimension Academy para acessar seus cursos, laboratórios guiados e conquistas — o progresso
                de cada plataforma externa é registrado na própria plataforma.
              </span>
              <Button asChild size="sm" variant="default">
                <a href="/login">Entrar</a>
              </Button>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-white/5 bg-[#121A33] px-4 py-3">
              <p className="text-xs text-[#AAB4C3]">Desafios disponíveis</p>
              <p className="mt-1 text-xl font-semibold text-cyan-300">
                {catalogQuery.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${catalog.length} desafios`}
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-[#121A33] px-4 py-3">
              <p className="text-xs text-[#AAB4C3]">Plataformas parceiras</p>
              <p className="mt-1 text-xl font-semibold text-emerald-300">
                {catalogQuery.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${platforms.length} plataformas`}
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-[#121A33] px-4 py-3">
              <p className="text-xs text-[#AAB4C3]">Nível de entrada</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-300">
                <TrendingUp className="h-4 w-4" /> Iniciante
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-[#121A33] px-4 py-3">
              <p className="text-xs text-[#AAB4C3]">Custo</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-amber-300">
                <Flag className="h-4 w-4" /> Gratuito
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 rounded-xl border border-white/5 bg-[#121A33] p-4 lg:w-72">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AAB4C3]">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </p>

            <div className="mt-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6478]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar desafio, plataforma…"
                  className="w-full rounded-lg border border-white/10 bg-[#0B1020] py-2 pl-9 pr-3 text-sm text-[#E6EAF0] placeholder:text-[#5B6478] focus:border-cyan-400/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-[#AAB4C3]">Nível</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(CTF_LEVELS as CtfLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      levelFilter === level
                        ? levelStyles(level)
                        : "border-white/10 text-[#AAB4C3] hover:border-white/25 hover:text-[#E6EAF0]"
                    }`}
                  >
                    {CTF_LEVEL_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-[#AAB4C3]">Área</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(CTF_AREAS as CtfArea[]).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setAreaFilter(areaFilter === area ? null : area)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      areaFilter === area
                        ? areaStyles(area)
                        : "border-white/10 text-[#AAB4C3] hover:border-white/25 hover:text-[#E6EAF0]"
                    }`}
                  >
                    {CTF_AREA_LABELS[area]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-white/5 pt-4">
              <p className="text-xs font-medium text-[#AAB4C3]">Plataformas</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {platforms.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-cyan-300 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {catalogQuery.isLoading ? (
              <div className="flex items-center justify-center gap-3 py-24 text-sm text-[#AAB4C3]">
                <Loader2 className="h-5 w-5 animate-spin" /> Carregando catálogo de CTFs…
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-[#121A33] px-6 py-16 text-center">
                <Flag className="mx-auto h-8 w-8 text-[#5B6478]" />
                <p className="mt-3 text-sm text-[#AAB4C3]">Nenhum desafio corresponde aos filtros selecionados.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(""); setLevelFilter(null); setAreaFilter(null); }}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((entry) => (
                  <article key={entry.id} className="flex flex-col rounded-xl border border-white/5 bg-[#121A33] p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${levelStyles(entry.level)}`}>
                        {CTF_LEVEL_LABELS[entry.level]}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${areaStyles(entry.area)}`}>
                        {CTF_AREA_LABELS[entry.area]}
                      </span>
                    </div>

                      <h2 className="mt-3 text-base font-semibold">{entry.title}</h2>
                      <p className="mt-1.5 text-xs text-[#AAB4C3]">
                        <a
                          href={entry.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:underline"
                        >
                          {entry.platform}
                        </a>
                        <span className="ml-2 inline-flex items-center gap-1 text-amber-300/90">
                          <TrendingUp className="h-3 w-3" /> {entry.xp} XP
                        </span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#C8CFDC]">{entry.description}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                        <Button
                          size="sm"
                          onClick={() => handleOpen(entry)}
                          className="gap-1.5"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Abrir desafio
                        </Button>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
