import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { copyTutorResponse, getRegenerationTarget, getTutorProviderLabel, type TutorChatMessage, type TutorProvider } from "@/lib/tutorChat";
import { Streamdown } from "streamdown";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Send,
  Check,
  Copy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Message = TutorChatMessage & { suggestedPrompts?: string[]; provider?: TutorProvider };

const suggestedPrompts = [
  { icon: Lightbulb, label: "Explique um conceito", prompt: "Explique a CIA Triad com um exemplo prático." },
  { icon: ShieldCheck, label: "Revisar uma defesa", prompt: "Como MFA reduz o risco de acesso não autorizado?" },
  { icon: BookOpen, label: "GRC e Zero Trust", prompt: "Como relacionar governança, risco e Zero Trust em uma organização?" },
];

export default function Tutor() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.tutor.chat.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  const contextFor = (message: string) =>
    message.toLowerCase().match(/grc|governan|zero trust|compliance|risco|ia/) ? "grc" as const : "security-plus" as const;

  const requestResponse = async (message: string, history: Message[], replaceIndex?: number) => {
    const result = await chatMutation.mutateAsync({
      message,
      history: history.slice(-8).map(({ role, content }) => ({ role, content })),
      context: contextFor(message),
    });
    const assistantMessage: Message = {
      role: "assistant",
      content: result.response,
      suggestedPrompts: result.suggestedPrompts,
      provider: result.provider,
    };
    setMessages((current) => replaceIndex === undefined
      ? [...current, assistantMessage]
      : current.map((item, index) => index === replaceIndex ? assistantMessage : item));
  };

  const handleSend = async (messageOverride?: string) => {
    const message = (messageOverride ?? input).trim();
    if (!message || chatMutation.isPending) return;

    setInput("");
    const history = messages;
    setMessages((current) => [...current, { role: "user", content: message }]);
    try {
      await requestResponse(message, history);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Não consegui processar sua pergunta agora. Tente reformular ou envie novamente em alguns instantes." }]);
    }
  };

  const handleCopy = async (assistantIndex: number, content: string) => {
    const copied = await copyTutorResponse(content);
    if (!copied) return;
    setCopiedIndex(assistantIndex);
    window.setTimeout(() => setCopiedIndex((current) => current === assistantIndex ? null : current), 1800);
  };

  const handleRegenerate = async (assistantIndex: number) => {
    if (chatMutation.isPending) return;
    const target = getRegenerationTarget(messages, assistantIndex);
    if (!target) return;

    setRegeneratingIndex(assistantIndex);
    try {
      await requestResponse(target.prompt, messages.slice(0, target.userIndex), assistantIndex);
    } catch {
      setMessages((current) => current.map((item, index) => index === assistantIndex
        ? { ...item, content: "Não consegui regenerar esta explicação agora. Tente novamente em alguns instantes.", provider: undefined }
        : item));
    } finally {
      setRegeneratingIndex(null);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />

      <header className="relative z-20 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Voltar ao painel</span><span className="sm:hidden">Painel</span></Link>
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10"><Brain className="h-4 w-4 text-neon-purple" /></span><span><span className="block font-orbitron text-xs font-bold">IA TUTOR</span><span className="mt-0.5 block text-[0.65rem] font-bold tracking-[0.14em] text-neon-green">ONLINE</span></span></div>
        </div>
      </header>

      <main className="container relative flex min-h-0 flex-1 flex-col py-5 md:py-7">
        <section className="module-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 bg-black/10 px-5 py-4 sm:flex-row sm:items-center md:px-7">
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-neon-cyan/10"><MessageSquare className="h-4 w-4 text-neon-cyan" /></span><div><p className="font-orbitron text-sm font-bold">Central de dúvidas</p><p className="mt-1 text-xs text-muted-foreground">Security+, GRC, Zero Trust, IA segura e desenvolvimento seguro</p></div></div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-neon-green sm:self-auto"><span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_10px_oklch(0.78_0.2_150)]" /> TUTOR DISPONÍVEL</div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-7">
            {messages.length === 0 && (
              <div className="mx-auto flex min-h-[24rem] max-w-3xl flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-neon-purple/30 bg-gradient-to-br from-neon-cyan/15 to-neon-purple/20 shadow-[0_0_35px_oklch(0.65_0.25_280/0.16)]"><Brain className="h-8 w-8 text-neon-cyan" /></span>
                <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple"><Sparkles className="h-3.5 w-3.5" /> ORIENTAÇÃO SOB DEMANDA</p>
                <h1 className="mt-3 font-orbitron text-xl font-bold md:text-2xl">Qual conceito vamos explorar hoje?</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">Peça explicações, conecte conceitos, revise decisões de segurança ou monte um plano de preparação. O tutor responde em português brasileiro e prioriza práticas defensivas e éticas.</p>
                <div className="mt-8 grid w-full gap-3 text-left md:grid-cols-3">{suggestedPrompts.map((item, index) => { const Icon = item.icon; const accent = index === 1 ? "text-neon-purple" : index === 2 ? "text-neon-green" : "text-neon-cyan"; return <button key={item.label} onClick={() => void handleSend(item.prompt)} className="orbit-button rounded-xl border border-white/10 bg-black/15 p-4 hover:border-neon-cyan/30 hover:bg-white/[0.045]"><Icon className={`h-5 w-5 ${accent}`} /><p className="mt-4 text-sm font-bold">{item.label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.prompt}</p></button>; })}</div>
              </div>
            )}

            {messages.length > 0 && <div className="mx-auto max-w-3xl space-y-5">{messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-neon-purple/25 bg-neon-purple/10"><Brain className="h-4 w-4 text-neon-purple" /></span>}
                <article className={`max-w-[82%] rounded-2xl px-4 py-3.5 text-sm leading-6 md:text-base ${message.role === "user" ? "rounded-tr-md bg-neon-cyan text-[oklch(0.1_0.02_260)] shadow-[0_0_20px_oklch(0.85_0.2_195/0.12)]" : "rounded-tl-md border border-white/10 bg-black/20 text-foreground"}`}>
                  {message.role === "assistant" && <div className="mb-2 flex flex-wrap items-center gap-2 text-[0.62rem] font-bold tracking-[0.13em]"><span className="text-neon-cyan">IA TUTOR</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.08em] text-muted-foreground" title="Provedor que gerou esta resposta">{getTutorProviderLabel(message.provider)}</span></div>}
                  {message.role === "assistant" ? <Streamdown>{message.content}</Streamdown> : <p className="whitespace-pre-wrap">{message.content}</p>}
                  {message.role === "assistant" && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <button type="button" onClick={() => void handleCopy(index, message.content)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-neon-cyan/30 hover:text-neon-cyan" aria-label="Copiar resposta" title="Copiar resposta">
                        {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />} {copiedIndex === index ? "Copiado" : "Copiar"}
                      </button>
                      <button type="button" onClick={() => void handleRegenerate(index)} disabled={chatMutation.isPending} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-neon-cyan/30 hover:text-neon-cyan disabled:cursor-not-allowed disabled:opacity-50" aria-label="Regenerar resposta">
                        {regeneratingIndex === index ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-neon-cyan" /> : <RotateCcw className="h-3.5 w-3.5" />} Regenerar resposta
                      </button>
                      {message.suggestedPrompts?.map((prompt) => <button key={prompt} onClick={() => void handleSend(prompt)} disabled={chatMutation.isPending} className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-2.5 py-1.5 text-left text-xs font-semibold text-neon-cyan hover:bg-neon-cyan/10 disabled:cursor-not-allowed disabled:opacity-50">{prompt}</button>)}
                    </div>
                  )}
                </article>
              </div>
            ))}
            {chatMutation.isPending && <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-neon-purple/25 bg-neon-purple/10"><Brain className="h-4 w-4 text-neon-purple" /></span><div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/10 bg-black/20 px-4 py-3.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-purple [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-green [animation-delay:240ms]" /><span className="ml-1 text-[0.65rem] text-muted-foreground">Consultando tutor…</span></div></div>}
            </div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-black/10 p-4 md:px-7 md:py-5">
            <div className="mx-auto flex max-w-3xl gap-2 rounded-2xl border border-white/12 bg-[oklch(0.075_0.025_260/0.82)] p-1.5 focus-within:border-neon-cyan/45 focus-within:shadow-[0_0_22px_oklch(0.85_0.2_195/0.09)]">
              <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void handleSend(); } }} placeholder="Pergunte sobre conceitos, ataques, defesas ou sua trilha..." className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground md:text-base" />
              <button onClick={() => void handleSend()} disabled={!input.trim() || chatMutation.isPending} className="orbit-button grid h-10 w-10 place-items-center rounded-xl bg-neon-cyan text-[oklch(0.1_0.02_260)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Enviar pergunta"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl px-3 text-[0.68rem] text-muted-foreground">Use o tutor como apoio de estudo. Ele não fornece instruções ofensivas; pratique apenas em ambientes autorizados e confira conceitos nas lições e objetivos oficiais.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
