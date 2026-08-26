/**
 * Camada transversal de inglês técnico por academia.
 * Exibe o vocabulário contextualizado da área em que o aluno está estudando
 * e conecta com a trilha "Inglês técnico para cibersegurança".
 */
import { ArrowUpRight, Languages } from "lucide-react";
import { getAcademyEnglishVocabulary, ACADEMY_ENGLISH_VOCABULARY } from "@shared/academiaEnglishVocabulary";
import type { AcademySlug } from "@/data/curriculumCatalog";

const sectionHeader = {
  "blue-team": "TECHNICAL ENGLISH · BLUE TEAM",
  "red-team": "TECHNICAL ENGLISH · RED TEAM",
  grc: "TECHNICAL ENGLISH · GRC",
  "cloud-security": "TECHNICAL ENGLISH · CLOUD",
  "threat-intelligence": "TECHNICAL ENGLISH · THREAT INTELLIGENCE",
  "security-engineering": "TECHNICAL ENGLISH · SECURITY ENGINEERING",
  "ai-security": "TECHNICAL ENGLISH · AI SECURITY",
} as const;

export function TechnicalEnglishCrossLayer({ academySlug }: { academySlug: AcademySlug }) {
  const terms = getAcademyEnglishVocabulary(academySlug);
  const header = sectionHeader[academySlug] ?? "TECHNICAL ENGLISH";
  void ACADEMY_ENGLISH_VOCABULARY;
  if (terms.length === 0) return null;

  return (
    <section
      data-testid="technical-english-cross-layer"
      aria-label="Inglês técnico desta academia"
      className="border-b border-neon-purple/20 bg-neon-purple/[0.035] py-10"
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple">
              <Languages className="h-4 w-4" /> {header}
            </p>
            <h2 className="mt-2 font-orbitron text-xl font-bold">Vocabulário de inglês desta área</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Termos essenciais em inglês para atuar profissionalmente neste domínio.
              Pratique cada termo no curso completo de inglês técnico.
            </p>
          </div>
          <a
            href="/aulas/ingles-tecnico"
            className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-purple/30 bg-neon-purple/10 px-5 py-3 font-bold text-neon-purple"
          >
            Curso de inglês completo <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {terms.map((term: { id: string; term: string; phonetic: string; meaning: string; exampleEn: string }) => (
            <article
              key={term.id}
              data-testid={`english-term-${term.id}`}
              className="rounded-xl border border-neon-purple/25 bg-black/15 p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-orbitron text-sm font-bold text-foreground">{term.term}</p>
                <span className="text-[0.7rem] italic text-neon-purple/80">{term.phonetic}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{term.meaning}</p>
              <p className="mt-2 text-[0.7rem] leading-4 text-foreground/70">“{term.exampleEn}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
