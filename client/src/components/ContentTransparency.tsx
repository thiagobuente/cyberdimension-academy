import { BookOpen, Code2, ExternalLink, FileText, FlaskConical, ShieldCheck, Youtube } from "lucide-react";
import { getContentProvenance, type ContentProvenanceItem } from "@shared/contentProvenance";

type ContentTransparencyCourse = {
  title: string;
  videoLearning?: {
    provider: "YouTube";
    label: string;
    sourceUrl: string;
  };
};

const ownIcons = [BookOpen, Code2, FlaskConical, FileText];

function ProvenanceItem({ item, index }: { item: ContentProvenanceItem; index: number }) {
  const Icon = item.origin === "externo" ? Youtube : ownIcons[index % ownIcons.length];
  const details = <>
    <p className="mt-3 text-sm font-bold text-foreground">{item.title}</p>
    <dl className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
      <div><dt className="inline font-bold text-foreground">Fonte: </dt><dd className="inline">{item.source}</dd></div>
      <div><dt className="inline font-bold text-foreground">Licença: </dt><dd className="inline">{item.license}</dd></div>
      <div><dt className="inline font-bold text-foreground">Uso: </dt><dd className="inline">{item.usage}</dd></div>
    </dl>
  </>;

  return item.href ? <a href={item.href} target="_blank" rel="noreferrer" className="orbit-button block rounded-xl border border-white/10 bg-black/15 p-4 hover:border-neon-purple/35"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-neon-purple" /><p className="text-xs font-bold tracking-[0.1em] text-neon-purple">{item.category.toUpperCase()}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-neon-purple" aria-hidden="true" /></div>{details}</a> : <div className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-neon-cyan" /><p className="text-xs font-bold tracking-[0.1em] text-neon-cyan">{item.category.toUpperCase()}</p></div>{details}</div>;
}

export function ContentTransparency({ course, compact = false }: { course: ContentTransparencyCourse; compact?: boolean }) {
  const items = getContentProvenance(course);
  const ownItems = items.filter((item) => item.origin === "proprio");
  const externalItems = items.filter((item) => item.origin === "externo");

  return <section aria-labelledby="content-transparency-title" className={`rounded-2xl border border-neon-cyan/20 bg-[linear-gradient(135deg,oklch(0.12_0.035_260/0.92),oklch(0.08_0.025_260/0.9))] ${compact ? "p-4 md:p-5" : "p-5 md:p-7"}`}>
    <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 md:flex-row md:items-end">
      <div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><ShieldCheck className="h-4 w-4" /> TRANSPARÊNCIA DE CONTEÚDO</p><h2 id="content-transparency-title" className="mt-2 font-orbitron text-lg font-bold">O que é autoral e o que vem de fonte externa.</h2></div>
      <p className="max-w-md text-xs leading-5 text-muted-foreground">Cada referência informa origem, licença e papel pedagógico. Fontes externas complementam — não substituem — o material próprio da Academia.</p>
    </div>
    <div className={`mt-5 grid gap-5 ${compact ? "xl:grid-cols-2" : "lg:grid-cols-2"}`}>
      <div><p className="text-xs font-bold tracking-[0.14em] text-neon-cyan">CONTEÚDO PRÓPRIO</p><div className="mt-3 grid gap-3">{ownItems.map((item, index) => <ProvenanceItem key={item.id} item={item} index={index} />)}</div></div>
      <div><p className="text-xs font-bold tracking-[0.14em] text-neon-purple">FONTES EXTERNAS</p><div className="mt-3 grid gap-3">{externalItems.length > 0 ? externalItems.map((item, index) => <ProvenanceItem key={item.id} item={item} index={index} />) : <div className="rounded-xl border border-dashed border-white/15 bg-black/10 p-4 text-sm leading-6 text-muted-foreground">Nenhuma fonte externa está cadastrada nesta formação no momento. O conteúdo, as práticas e as avaliações disponíveis são próprios da CyberDimension Academy.</div>}</div></div>
    </div>
  </section>;
}
