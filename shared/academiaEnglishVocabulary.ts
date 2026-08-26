/**
 * Vocabulário técnico de inglês transversal por academia.
 * Cada academia exibe uma camada "Technical English" com termos
 * contextualizados à área que o aluno está estudando.
 * Os termos derivam do vocabulário dos episódios "English for Cyber Pros"
 * (shared/englishVocabulary.ts) e são organizados por domínio de carreira.
 */
import { englishVocabulary, type EnglishTerm } from "./englishVocabulary";
import type { AcademySlug } from "@/data/curriculumCatalog";

const byTerm = new Map(englishVocabulary.map((term) => [term.term.toLowerCase(), term]));

function pickTerm(termId: string): EnglishTerm | null {
  return byTerm.get(termId.toLowerCase()) ?? null;
}

/**
 * Termos de inglês técnico mapeados para cada academia da plataforma.
 * Cada academia tem sua lista própria (6–8 termos) extraída do vocabulário
 * global, selecionada para o contexto de carreira daquela rota.
 */
export const ACADEMY_ENGLISH_VOCABULARY: Readonly<
  Record<AcademySlug, ReadonlyArray<EnglishTerm | null>>
> = {
  "blue-team": [
    pickTerm("triage"),
    pickTerm("escalate"),
    pickTerm("containment"),
    pickTerm("indicator of compromise"),
    pickTerm("packet capture"),
    pickTerm("volatile memory"),
    pickTerm("root cause"),
    pickTerm("eradicate"),
  ],
  "red-team": [
    pickTerm("reconnaissance"),
    pickTerm("enumeration"),
    pickTerm("exploit"),
    pickTerm("privilege escalation"),
    pickTerm("credential dumping"),
    pickTerm("persistence"),
    pickTerm("proof of concept"),
    pickTerm("rules of engagement"),
  ],
  grc: [
    pickTerm("compliance"),
    pickTerm("enforce"),
    pickTerm("baseline"),
    pickTerm("mitigation"),
    pickTerm("remediation"),
    pickTerm("segment"),
  ],
  "cloud-security": [
    pickTerm("IAM"),
    pickTerm("KMS"),
    pickTerm("misconfiguration"),
    pickTerm("shared responsibility"),
    pickTerm("encrypt"),
    pickTerm("rate limiting"),
  ],
  "threat-intelligence": [
    pickTerm("indicator of compromise"),
    pickTerm("threat"),
    pickTerm("mitigation"),
    pickTerm("escalate"),
    pickTerm("root cause"),
    pickTerm("compromise"),
  ],
  "security-engineering": [
    pickTerm("encrypt"),
    pickTerm("breach"),
    pickTerm("leaked"),
    pickTerm("segment"),
    pickTerm("VPN"),
    pickTerm("mitigation"),
  ],
  "ai-security": [
    pickTerm("threat"),
    pickTerm("compromise"),
    pickTerm("leaked"),
    pickTerm("breach"),
    pickTerm("enforce"),
    pickTerm("remediation"),
  ],
} as const;

/** Filtra valores nulos mantendo apenas termos que existem no vocabulário. */
export function getAcademyEnglishVocabulary(slug: AcademySlug): ReadonlyArray<EnglishTerm> {
  const terms = ACADEMY_ENGLISH_VOCABULARY[slug] as ReadonlyArray<EnglishTerm | null>;
  return terms.filter((term): term is EnglishTerm => term !== null);
}
