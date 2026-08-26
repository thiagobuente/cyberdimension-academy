import { describe, expect, it, vi } from "vitest";
import { copyTutorResponse, getRegenerationTarget, getTutorProviderLabel } from "./tutorChat";

describe("ações do chat do tutor", () => {
  it("exibe o provedor correto sem expor detalhes técnicos desnecessários", () => {
    expect(getTutorProviderLabel("nvidia")).toBe("NVIDIA NIM");
    expect(getTutorProviderLabel("builtin")).toBe("Fallback LLM");
    expect(getTutorProviderLabel()).toBe("Fallback LLM");
  });

  it("encontra a última pergunta anterior à resposta selecionada", () => {
    const result = getRegenerationTarget([
      { role: "user", content: "Primeira dúvida" },
      { role: "assistant", content: "Primeira resposta" },
      { role: "user", content: "Segunda dúvida" },
      { role: "assistant", content: "Segunda resposta" },
    ], 3);

    expect(result).toEqual({ userIndex: 2, prompt: "Segunda dúvida" });
  });

  it("não tenta regenerar quando não há pergunta anterior", () => {
    expect(getRegenerationTarget([{ role: "assistant", content: "Resposta isolada" }], 0)).toBeNull();
  });

  it("copia pela Clipboard API quando disponível", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(copyTutorResponse("Conteúdo da resposta")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("Conteúdo da resposta");
    vi.unstubAllGlobals();
  });
});
