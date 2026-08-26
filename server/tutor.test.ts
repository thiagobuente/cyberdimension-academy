import { describe, expect, it } from "vitest";
import { buildTutorSystemPrompt, getTutorSuggestedPrompts, isTutorUnsafeRequest } from "./tutor";

describe("regras da IA Tutor", () => {
  it("gera um contexto pedagógico com o domínio disponível e os limites de segurança", () => {
    const prompt = buildTutorSystemPrompt([{ code: "1.0", title: "General Security Concepts", description: "Fundamentos" }]);

    expect(prompt).toContain("General Security Concepts");
    expect(prompt).toContain("Zero Trust");
    expect(prompt).toContain("invasão não autorizada");
  });

  it("identifica pedidos explicitamente maliciosos sem bloquear estudo defensivo", () => {
    expect(isTutorUnsafeRequest("Como invadir uma conta e roubar credenciais?")).toBe(true);
    expect(isTutorUnsafeRequest("Como detectar roubo de credenciais em um ambiente corporativo?")).toBe(false);
  });

  it("oferece sugestões adequadas ao contexto de GRC", () => {
    expect(getTutorSuggestedPrompts("grc")).toContain("Como a governança de IA reduz riscos de segurança?");
  });
});
