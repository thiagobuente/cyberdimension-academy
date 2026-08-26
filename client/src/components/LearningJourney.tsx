import { Award, BookOpen, CheckCircle2, CirclePlay, ClipboardCheck, FlaskConical, GraduationCap, Lightbulb, Map, Sword, Trophy } from "lucide-react";

const journeySteps = [
  { label: "Aprenda", Icon: BookOpen },
  { label: "Pratique", Icon: FlaskConical },
  { label: "Teste", Icon: ClipboardCheck },
  { label: "Desafie-se", Icon: Sword },
  { label: "Projeto", Icon: Lightbulb },
  { label: "Avalie-se", Icon: CheckCircle2 },
  { label: "Certifique-se", Icon: Award },
] as const;

export function LearningJourney({ hasVideo, compact = false }: { hasVideo: boolean; compact?: boolean }) {
  return <section aria-labelledby="learning-journey-title" className={`self-start rounded-2xl border border-neon-green/20 bg-neon-green/[0.045] ${compact ? "p-4" : "p-5 md:p-6"}`}>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-green"><Trophy className="h-4 w-4" /> EXPERIÊNCIA DE ESCOLA</p><h2 id="learning-journey-title" className="mt-2 font-orbitron text-lg font-bold">Trilha → Curso → Laboratório → Quiz → Projeto → Certificado.</h2></div><p className="max-w-sm text-xs leading-5 text-muted-foreground">O padrão pedagógico da Cyberdimension em sete etapas: conteúdo, prática, teste, desafio, projeto, avaliação e certificado. Vídeo e material complementar enriquecem o estudo.</p></div>
    <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-xs font-bold"><li className="rounded-lg border border-neon-green/25 bg-neon-green/10 px-2.5 py-1.5 text-neon-green"><GraduationCap className="mr-1 inline h-3.5 w-3.5" />Trilha</li>{journeySteps.map(({ label, Icon }, index) => <li key={label} className="flex items-center gap-2"><span className="text-muted-foreground" aria-hidden="true">→</span><span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${label === "Aprenda" ? "border-neon-green/40 bg-neon-green/15 text-neon-green" : "border-white/10 bg-black/15 text-foreground"}`}><Icon className="h-3.5 w-3.5" />{label}{index === 0 && hasVideo && " + Vídeo"}</span></li>)}</ol>
  </section>;
}
