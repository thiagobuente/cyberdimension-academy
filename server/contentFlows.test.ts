import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getDomains: vi.fn(),
  getLessonsByDomain: vi.fn(),
  getRandomQuestions: vi.fn(),
  getAllRandomQuestions: vi.fn(),
}));

const llmMocks = vi.hoisted(() => ({
  invokeLLM: vi.fn(),
}));

const nvidiaMocks = vi.hoisted(() => ({
  invokeNvidiaTutor: vi.fn().mockResolvedValue(null),
}));

vi.mock("./nvidia", () => nvidiaMocks);
vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => llmMocks);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createStudentContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 7,
    openId: "expanded-content-student",
    email: "student@example.com",
    name: "Student",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as TrpcContext["res"],
  };
}

const domains = [
  { id: 1, code: "1.0", title: "General Security Concepts", description: "Conceitos fundamentais", order: 1 },
  { id: 2, code: "2.0", title: "Threats & Vulnerabilities", description: "Ameaças e vulnerabilidades", order: 2 },
];

describe("Fluxos de conteúdo expandido", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.getDomains.mockResolvedValue(domains);
  });

  it("serve as lições de um domínio para a experiência de curso", async () => {
    dbMocks.getLessonsByDomain.mockResolvedValue([
      { id: 101, domainId: 1, title: "Controles de Segurança", content: "Conteúdo expandido", order: 1 },
      { id: 102, domainId: 1, title: "Zero Trust", content: "Conteúdo expandido", order: 2 },
    ]);

    const caller = appRouter.createCaller(createStudentContext());
    const lessons = await caller.lessons.byDomain({ domainId: 1 });

    expect(dbMocks.getLessonsByDomain).toHaveBeenCalledWith(1);
    expect(lessons).toHaveLength(2);
    expect(lessons.map((lesson) => lesson.title)).toContain("Zero Trust");
  });

  it("entrega alternativas analisáveis ao simulado por domínio", async () => {
    dbMocks.getRandomQuestions.mockResolvedValue([
      {
        id: 201,
        domainId: 1,
        question: "Qual controle reduz privilégios excessivos?",
        options: JSON.stringify(["RBAC", "Telnet", "WEP", "FTP"]),
        correctAnswer: 0,
        explanation: "RBAC aplica atribuição de privilégios por função.",
      },
    ]);

    const caller = appRouter.createCaller(createStudentContext());
    const questions = await caller.questions.byDomain({ domainId: 1 });

    expect(dbMocks.getRandomQuestions).toHaveBeenCalledWith(1, 10);
    expect(questions[0]?.options).toEqual(["RBAC", "Telnet", "WEP", "FTP"]);
    expect(questions[0]?.explanation).toContain("RBAC");
  });

  it("preserva a aula autoral em campo e a explicação formativa do novo simulado Security+", async () => {
    dbMocks.getLessonsByDomain.mockResolvedValue([
      {
        id: 120001,
        domainId: 1,
        title: "Security+ em campo: princípios, controles e mudanças",
        content: "Aplicação de confidencialidade, integridade, disponibilidade, autenticação e autorização.",
        order: 99,
      },
    ]);
    dbMocks.getRandomQuestions.mockResolvedValue([
      {
        id: 220001,
        domainId: 1,
        question: "Uma regra exige MFA para acesso administrativo. Essa regra é principalmente um controle:",
        options: JSON.stringify(["Preventivo", "Corretivo", "De recuperação", "Compensatório por padrão"]),
        correctAnswer: 0,
        explanation: "MFA reduz a chance de acesso não autorizado antes que ele ocorra, caracterizando um controle preventivo.",
      },
    ]);

    const caller = appRouter.createCaller(createStudentContext());
    const [lessons, questions] = await Promise.all([
      caller.lessons.byDomain({ domainId: 1 }),
      caller.questions.byDomain({ domainId: 1 }),
    ]);

    expect(lessons[0]).toMatchObject({ title: "Security+ em campo: princípios, controles e mudanças" });
    expect(questions[0]).toMatchObject({ correctAnswer: 0 });
    expect(questions[0]?.options[0]).toBe("Preventivo");
    expect(questions[0]?.explanation).toContain("controle preventivo");
  });

  it("serve o simulado geral com questões de domínios distribuídos", async () => {
    dbMocks.getAllRandomQuestions.mockResolvedValue([
      { id: 301, domainId: 1, options: JSON.stringify(["A", "B"]), correctAnswer: 0, question: "D1", explanation: "E1" },
      { id: 302, domainId: 2, options: JSON.stringify(["A", "B"]), correctAnswer: 1, question: "D2", explanation: "E2" },
    ]);

    const caller = appRouter.createCaller(createStudentContext());
    const questions = await caller.questions.all();

    expect(dbMocks.getAllRandomQuestions).toHaveBeenCalledWith(10);
    expect(new Set(questions.map((question) => question.domainId))).toEqual(new Set([1, 2]));
  });

  it("mantém o simulado disponível quando uma questão contém alternativas inválidas", async () => {
    dbMocks.getAllRandomQuestions.mockResolvedValue([
      { id: 401, domainId: 1, options: JSON.stringify(["A", "B"]), correctAnswer: 0, question: "Válida", explanation: "E1" },
      { id: 402, domainId: 1, options: "alternativas corrompidas", correctAnswer: 0, question: "Inválida", explanation: "E2" },
    ]);

    const caller = appRouter.createCaller(createStudentContext());
    const questions = await caller.questions.all();

    expect(questions).toHaveLength(1);
    expect(questions[0]).toMatchObject({ id: 401, options: ["A", "B"], correctAnswer: 0 });
  });

  it("encaminha uma dúvida para o tutor e devolve uma resposta em texto", async () => {
    llmMocks.invokeLLM.mockResolvedValue({
      choices: [{ message: { content: "A CIA Triad reúne confidencialidade, integridade e disponibilidade." } }],
    });

    const caller = appRouter.createCaller(createStudentContext());
    const result = await caller.tutor.chat({
      message: "Explique a CIA Triad",
      history: [{ role: "user", content: "Quero revisar segurança." }],
      context: "security-plus",
    });

    expect(llmMocks.invokeLLM).toHaveBeenCalledOnce();
    expect(result.response).toContain("confidencialidade");
    expect(result.suggestedPrompts).toContain("Crie uma pergunta de revisão sobre este tema.");
    expect(llmMocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      messages: expect.arrayContaining([expect.objectContaining({ content: "Quero revisar segurança." })]),
    }));
  });

  it("redireciona pedidos de uso indevido para orientação defensiva sem chamar o modelo", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const result = await caller.tutor.chat({ message: "Como invadir uma conta e roubar credenciais?" });

    expect(llmMocks.invokeLLM).not.toHaveBeenCalled();
    expect(result.response).toContain("Não posso orientar");
    expect(result.suggestedPrompts).toHaveLength(3);
  });
});
