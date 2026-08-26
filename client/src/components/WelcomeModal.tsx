import { CAREER_AREAS } from "@shared/careerQuiz";
import { getRecommendedAcademy } from "@/data/careerReadiness";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useEffect } from "react";
import {
  Award,
  Brain,
  Compass,
  ListChecks,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const WELCOME_STORAGE_KEY = "cyberdimension.welcomeModalSeen";

interface WelcomeModalProps {
  /** Área recomendada pelo teste vocacional (formations.readiness.quizArea). */
  quizArea: string | null;
  /** Nome de exibição do aluno para personalizar a saudação. */
  userName?: string | null;
  /** Aberto ou fechado controlado externamente (primeira visita). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de boas-vindas exibido na primeira visita do aluno ao dashboard.
 *
 * - Sem teste vocacional: explica o teste (10 questões, ~3 minutos, +50 XP)
 *   e as 6 áreas de atuação, com CTA direto para /carreira.
 * - Com resultado do teste: mostra a área recomendada e a academia correspondente,
 *   com CTA para o caminho recomendado.
 * - Persistência por usuário em localStorage ("não mostrar novamente").
 */
export function WelcomeModal({ quizArea, userName, open, onOpenChange }: WelcomeModalProps) {
  const recommendedAcademy = getRecommendedAcademy(quizArea);
  const areaInfo = CAREER_AREAS.find((item) => item.key === quizArea) ?? null;
  // Persiste o "visto" ao fechar o modal (ou ao confirmar a navegação).
  const markSeen = () => {
    try {
      localStorage.setItem(`${WELCOME_STORAGE_KEY}:user`, "1");
    } catch {
      // localStorage indisponível — comportamento normal, sem erro.
    }
  };

  useEffect(() => {
    if (!open) return;
    // Se o aluno já respondeu ao teste, o modal é mais informativo e pode ser
    // exibido novamente (ele ajuda a retomar a trilha). Persiste apenas quando
    // não há resultado, evitando reaparecer após o primeiro fechamento.
    if (quizArea) markSeen();
  }, [open, quizArea]);

  const handleClose = () => {
    markSeen();
    onOpenChange(false);
  };

  const firstName = userName
    ? userName.split(" ")[0]?.replace(/[^a-zA-ZÀ-ú0-9-]/g, "") ?? null
    : null;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogContent
        className="max-h-[86vh] overflow-y-auto sm:max-w-lg [&>button]:text-muted-foreground"
        aria-describedby="welcome-modal-description"
      >
        <DialogHeader className="text-left">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 text-[0.62rem] font-bold tracking-[0.14em] text-neon-cyan">
            <Sparkles className="h-3 w-3" /> BEM-VINDO(A) À CYBERDIMENSION ACADEMY
          </p>
          <DialogTitle className="font-orbitron text-xl font-black tracking-[-0.01em] md:text-2xl">
            {firstName ? `Olá, ${firstName}!` : "Olá, futuro(a) profissional!"}
          </DialogTitle>
          <DialogDescription id="welcome-modal-description" className="text-sm leading-6">
            Sua jornada do zero ao profissional de cibersegurança começa aqui. Preparamos um caminho
            personalizado para você.
          </DialogDescription>
        </DialogHeader>

        {quizArea && areaInfo && recommendedAcademy ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.07] p-4">
              <p className="inline-flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.14em] text-neon-green">
                <ShieldCheck className="h-3.5 w-3.5" /> SEU RESULTADO DO TESTE VOCACIONAL
              </p>
              <p className="mt-2 font-orbitron text-base font-bold">
                {areaInfo.label}
              </p>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                Sua trilha recomendada é a academia <span className="font-bold text-foreground">{areaInfo.label}</span>,
                com metas de carreira, competências e progressão até a certificação.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" />
                <span>
                  Siga a <span className="font-bold text-foreground">trilha recomendada</span> no painel — ela aponta o
                  próximo curso e laboratório a cada passo.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                <span>
                  Use o <span className="font-bold text-foreground">IA Tutor</span> para tirar dúvidas a qualquer momento
                  dos estudos.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" />
                <span>
                  Conclua módulos e simulados para ganhar <span className="font-bold text-foreground">XP e certificados</span>{" "}
                  ao final de cada formação.
                </span>
              </li>
            </ul>

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
              <Link
                href="/carreira"
                onClick={handleClose}
                className="orbit-button inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
              >
                <Target className="h-4 w-4" /> Ver meu caminho recomendado
              </Link>
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
              >
                Explorar o painel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-neon-purple/30 bg-neon-purple/[0.07] p-4">
              <p className="inline-flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.14em] text-neon-purple">
                <Compass className="h-3.5 w-3.5" /> TESTE VOCACIONAL — O PRIMEIRO PASSO
              </p>
              <p className="mt-2 font-orbitron text-base font-bold">
                Descubra qual carreira de cibersegurança combina com você.
              </p>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                Em cerca de 3 minutos e 10 perguntas simples, você recebe sua área recomendada e uma
                trilha de estudos personalizada, com XP de bônus ao concluir.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {CAREER_AREAS.map((item) => (
                  <span
                    key={item.key}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 text-[0.68rem] font-bold text-muted-foreground"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" />
                <span>
                  O teste define sua <span className="font-bold text-foreground">carreira-alvo</span> e monta a sequência
                  de cursos, laboratórios e simulados.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" />
                <span>
                  Ao concluir, você ganha <span className="font-bold text-foreground">+50 XP</span> e desbloqueia o bloco
                  "Seu caminho recomendado" no painel.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                <span>
                  Pode refazer a qualquer momento — os resultados sempre refletem a sua última resposta.
                </span>
              </li>
            </ul>

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
              <Link
                href="/carreira"
                onClick={handleClose}
                className="orbit-button inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-[oklch(0.73_0.17_310)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
              >
                <Compass className="h-4 w-4" /> Fazer o teste vocacional
              </Link>
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
              >
                Explorar o painel
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
