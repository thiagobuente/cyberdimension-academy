import { useMemo, useState } from "react";
import { Bell, Check, CheckCheck, Filter, Trash2, Trophy, Target, BookOpen, Mic2, Sparkles, Settings2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";

type NotificationKind = "progresso" | "certificado" | "xp" | "cybercast" | "carreira";
type AcademyNotification = { id: string; kind: NotificationKind; title: string; description: string; href: string; unread: boolean };

const STORAGE_KEY = "cyberdimension.notifications.read";
const kindLabels: Record<NotificationKind | "todas", string> = { todas: "Todas", progresso: "Progresso", certificado: "Certificados", xp: "XP e conquistas", cybercast: "CyberCast", carreira: "Carreira" };
const kindIcon: Record<NotificationKind, typeof Bell> = { progresso: BookOpen, certificado: Trophy, xp: Sparkles, cybercast: Mic2, carreira: Target };

export default function Notifications() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const progressQuery = trpc.progress.list.useQuery(undefined, { enabled: Boolean(user) });
  const certificatesQuery = trpc.certificates.list.useQuery(undefined, { enabled: Boolean(user) });
  const podcastProgressQuery = trpc.podcast.getProgress.useQuery(undefined, { enabled: Boolean(user) });
  const formationsQuery = trpc.formations.summary.useQuery(undefined, { enabled: Boolean(user) });
  const [filter, setFilter] = useState<NotificationKind | "todas">("todas");
  const [readIds, setReadIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]; } catch { return []; }
  });
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const notifications = useMemo<AcademyNotification[]>(() => {
    const progress = progressQuery.data ?? [];
    const certificates = certificatesQuery.data ?? [];
    const podcastCount = (podcastProgressQuery.data ?? []).length;
    const completedDomains = new Set(progress.filter((entry) => entry.completed && entry.lessonId).map((entry) => entry.domainId));
    const completedFormations = (formationsQuery.data?.certificates ?? []).length;
    const base: AcademyNotification[] = [];
    if (completedDomains.size) base.push({ id: "progress-domains", kind: "progresso", title: "Seu progresso está avançando", description: `${completedDomains.size} domínio(s) já possuem lições concluídas. Continue a jornada pelo próximo conteúdo.`, href: "/progress", unread: !readIds.includes("progress-domains") });
    if (completedFormations || certificates.length) base.push({ id: "certificates-earned", kind: "certificado", title: "Certificados disponíveis", description: `${certificates.length + completedFormations} certificado(s) registrado(s) na sua conta.`, href: "/profile", unread: !readIds.includes("certificates-earned") });
    if (podcastCount) base.push({ id: "cybercast-available", kind: "cybercast", title: "CyberCast disponível para estudo", description: `${podcastCount} episódio(s) já aparecem no seu histórico de áudio.`, href: "/podcast", unread: !readIds.includes("cybercast-available") });
    base.push({ id: "career-next-step", kind: "carreira", title: "Continue construindo sua carreira", description: "Revise seu próximo objetivo e escolha uma trilha alinhada à área que deseja seguir.", href: "/carreira", unread: !readIds.includes("career-next-step") });
    return base;
  }, [certificatesQuery.data, formationsQuery.data, podcastProgressQuery.data, progressQuery.data, readIds]);

  const visible = notifications.filter((notification) => filter === "todas" || notification.kind === filter).filter((notification) => !dismissedIds.includes(notification.id));
  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const persistRead = (ids: string[]) => { setReadIds(ids); localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); };
  const markRead = (id: string) => persistRead(Array.from(new Set([...readIds, id])));
  const markAllRead = () => persistRead(Array.from(new Set([...readIds, ...notifications.map((notification) => notification.id)])));

  if (!user) return null;
  return <DashboardLayout><div className="min-h-screen space-canvas text-foreground"><main className="container relative py-7 md:py-10"><div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><Bell className="h-4 w-4" /> CENTRAL DA ACADEMY</p><h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Notificações</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Acompanhe atualizações do seu progresso, certificados, XP, CyberCast e recomendações de carreira.</p></div><Link href="/dashboard" className="text-sm font-bold text-neon-cyan hover:underline">Voltar ao painel</Link></div>
    <section className="academy-panel mt-7 rounded-2xl p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan"><Bell className="h-4 w-4" /></span><p className="text-sm font-bold">{unreadCount ? `${unreadCount} não lida(s)` : "Tudo em dia"}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={markAllRead} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"><CheckCheck className="h-3.5 w-3.5" /> Marcar todas como lidas</button><button type="button" onClick={() => setPreferencesOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground" aria-expanded={preferencesOpen}><Settings2 className="h-3.5 w-3.5" /> Preferências</button></div></div>{preferencesOpen && <div className="mt-4 border-t border-white/10 pt-4"><p className="text-sm font-bold">Quais notificações quero receber?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">As preferências ficam disponíveis nesta central; eventos são gerados a partir do progresso real e do conteúdo da sua conta.</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries(kindLabels).filter(([key]) => key !== "todas").map(([key, label]) => <span key={key} className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs font-bold text-neon-cyan">{label}</span>)}</div></div>}</section>
    <div className="mt-5 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filtrar notificações"><Filter className="mr-1 h-4 w-4 text-muted-foreground" />{Object.entries(kindLabels).map(([key, label]) => <button key={key} type="button" onClick={() => setFilter(key as NotificationKind | "todas")} aria-pressed={filter === key} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${filter === key ? "border-neon-cyan/45 bg-neon-cyan/12 text-neon-cyan" : "border-white/10 text-muted-foreground hover:text-foreground"}`}>{label}</button>)}</div>
    <section className="mt-4 space-y-3" aria-live="polite">{visible.length === 0 ? <div className="academy-panel rounded-2xl p-8 text-center"><Bell className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-3 text-lg font-bold">Nenhuma notificação neste filtro</h2><p className="mt-2 text-sm text-muted-foreground">Quando houver uma atualização relevante, ela aparecerá aqui.</p></div> : visible.map((notification) => { const Icon = kindIcon[notification.kind]; return <div key={notification.id} className={`academy-panel flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center ${notification.unread ? "border-neon-cyan/25" : "opacity-75"}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan"><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{notification.title} {notification.unread && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-neon-cyan" aria-label="Não lida" />}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.description}</p></div><div className="flex shrink-0 flex-wrap gap-2"><Link href={notification.href} onClick={() => markRead(notification.id)} className="inline-flex items-center gap-2 rounded-lg bg-neon-cyan px-3 py-2 text-xs font-bold text-[oklch(0.1_0.02_260)]"><Check className="h-3.5 w-3.5" /> Abrir</Link>{notification.unread && <button type="button" onClick={() => markRead(notification.id)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">Marcar como lida</button>}<button type="button" onClick={() => setDismissedIds((ids) => [...ids, notification.id])} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-muted-foreground hover:text-red-200" aria-label={`Dispensar ${notification.title}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div>; })}</section></div></main></div></DashboardLayout>;
}
