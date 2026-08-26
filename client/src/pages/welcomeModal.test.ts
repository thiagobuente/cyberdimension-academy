import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = readFileSync(resolve(process.cwd(), "client/src/components/WelcomeModal.tsx"), "utf8");
const dashboardSource = readFileSync(resolve(process.cwd(), "client/src/pages/Dashboard.tsx"), "utf8");

describe("modal de boas-vindas do novo aluno", () => {
  it("existe o componente WelcomeModal com os dois fluxos (novo aluno e com resultado do teste)", () => {
    expect(modalSource).toContain("TESTE VOCACIONAL — O PRIMEIRO PASSO");
    expect(modalSource).toContain("Fazer o teste vocacional");
    expect(modalSource).toContain("SEU RESULTADO DO TESTE VOCACIONAL");
    expect(modalSource).toContain("Ver meu caminho recomendado");
  });

  it("explica o teste vocacional (duração, questões e XP de bônus)", () => {
    ["3 minutos", "10 perguntas", "+50 XP"].forEach((text) => expect(modalSource).toContain(text));
  });

  it("apresenta as seis áreas de carreira do teste vocacional via CAREER_AREAS", () => {
    ["item.label", "CAREER_AREAS.map", "item.key"].forEach((fragment) => expect(modalSource).toContain(fragment));
    const quizSource = readFileSync(resolve(process.cwd(), "shared/careerQuiz.ts"), "utf8");
    ["soc", "pentest", "grc", "cloud", "forense", "engenharia"].forEach((area) => expect(quizSource).toContain(`key: "${area}"`));
  });

  it("persiste a primeira visita em localStorage e não reaparece após fechar", () => {
    expect(modalSource).toContain("cyberdimension.welcomeModalSeen");
    expect(modalSource).toContain(`\${WELCOME_STORAGE_KEY}:user`);
    expect(modalSource).toContain("localStorage.setItem");
    expect(modalSource).toContain("onOpenChange(false)");
    expect(dashboardSource).toContain("localStorage.getItem");
    expect(dashboardSource).toContain("setWelcomeOpen(true)");
  });

  it("personaliza a saudação com o primeiro nome do aluno", () => {
    expect(modalSource).toContain("Olá, ${firstName}!");
    expect(modalSource).toContain('userName.split(" ")[0]');
  });

  it("o Dashboard monta o modal na primeira visita com quizArea e nome do usuário", () => {
    expect(dashboardSource).toContain("import { WelcomeModal }");
    expect(dashboardSource).toContain("<WelcomeModal");
    expect(dashboardSource).toContain("quizArea={readinessQuery.data?.quizArea ?? null}");
    expect(dashboardSource).toContain("userName={user?.name ?? null}");
    expect(dashboardSource).toContain("cyberdimension.welcomeModalSeen");
  });

  it("abre o modal somente após autenticação e com atraso suave", () => {
    expect(dashboardSource).toContain("setTimeout(() =>");
    expect(dashboardSource).toContain("setWelcomeOpen(true)");
    expect(dashboardSource).toContain("if (!isAuthenticated) return");
  });
});
