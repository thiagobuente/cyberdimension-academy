import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, BriefcaseBusiness, ChevronRight, Command, Layers3, Mic2, Search, X } from "lucide-react";
import { Link } from "wouter";
import { functionalCourses } from "@/data/courseCatalog";
import { academies, curriculumCourses } from "@/data/curriculumCatalog";
import { cyberProjects } from "@/data/cyberProjects";
import { podcastEpisodes } from "@shared/podcastEpisodes";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  kind: "Curso" | "Trilha" | "Academia" | "Projeto" | "CyberCast";
  href: string;
};

const kindIcon = {
  Curso: BookOpen,
  Trilha: Layers3,
  Academia: Command,
  Projeto: BriefcaseBusiness,
  CyberCast: Mic2,
} as const;

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function highlight(text: string, term: string) {
  if (!term.trim()) return text;
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((part, index) => normalize(part) === normalize(term) ? <mark key={`${part}-${index}`} className="bg-neon-cyan/20 text-neon-cyan">{part}</mark> : part);
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<SearchItem[]>(() => [
    ...functionalCourses.map((course) => ({ id: `course-${course.slug}`, title: course.title, subtitle: `${course.level} · ${course.focus}`, kind: "Curso" as const, href: `/formacoes/${course.slug}/estudar` })),
    ...curriculumCourses.map((course) => ({ id: `curriculum-${course.id}`, title: course.title, subtitle: `${course.level} · ${course.description}`, kind: "Trilha" as const, href: course.existingSlug ? `/formacoes/${course.existingSlug}/estudar` : "/catalog" })),
    ...academies.map((academy) => ({ id: `academy-${academy.slug}`, title: academy.name, subtitle: academy.tagline, kind: "Academia" as const, href: `/academias/${academy.slug}` })),
    ...cyberProjects.map((project) => ({ id: `project-${project.id}`, title: project.title, subtitle: `${project.area} · ${project.level}`, kind: "Projeto" as const, href: "/cyber-projects" })),
    ...podcastEpisodes.map((episode) => ({ id: `podcast-${episode.id}`, title: episode.title, subtitle: `${episode.series} · ${episode.description}`, kind: "CyberCast" as const, href: "/podcast" })),
  ], []);

  const results = useMemo(() => {
    const term = normalize(debouncedQuery.trim());
    if (!term) return [];
    return items.filter((item) => normalize(`${item.title} ${item.subtitle} ${item.kind}`).includes(term)).slice(0, 8);
  }, [debouncedQuery, items]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <div className="relative w-full lg:max-w-md">
    <div className={`dashboard-search flex h-10 items-center gap-3 rounded-xl border px-3 text-sm transition-colors ${open ? "border-neon-cyan/45" : "border-white/10"}`}>
      <Search className="h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" />
      <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) window.location.href = results[0].href; }} placeholder="Buscar conteúdos, trilhas..." aria-label="Buscar cursos, trilhas, academias, projetos e CyberCast" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      {query && <button type="button" onClick={() => { setQuery(""); setDebouncedQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground" aria-label="Limpar busca"><X className="h-4 w-4" /></button>}
      <kbd className="hidden rounded-md border border-white/10 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground xl:block">⌘ K</kbd>
    </div>
    {open && query.trim() && <>
      <button type="button" aria-label="Fechar resultados da busca" className="fixed inset-0 z-20 cursor-default lg:hidden" onClick={() => setOpen(false)} />
      <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-2xl border border-white/12 bg-[oklch(0.09_0.03_260/0.98)] p-2 shadow-2xl shadow-black/40">
        {debouncedQuery !== query && <p className="px-3 py-3 text-xs text-muted-foreground">Buscando no catálogo...</p>}
        {debouncedQuery === query && results.length === 0 && <p className="px-3 py-4 text-sm text-muted-foreground">Nenhum conteúdo encontrado para “{query}”.</p>}
        {debouncedQuery === query && results.map((item) => { const Icon = kindIcon[item.kind]; return <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:outline-none"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{highlight(item.title, query)}</strong><span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.kind} · {highlight(item.subtitle, query)}</span></span><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></Link>; })}
      </div>
    </>}
  </div>;
}
