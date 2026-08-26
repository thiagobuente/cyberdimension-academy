export const grcAppliedLessonSlug = "grc-aplicado-governanca-zero-trust";
export const grcAppliedCertificateTitle = "GRC Aplicado: Governança, Zero Trust e IA Segura";
export const grcAppliedSectionIds = ["decisao", "risco-politica", "zero-trust", "secure-sdlc", "ia"] as const;
export const grcAppliedPassingScore = 80;

const assessment = [
  {
    id: "governanca-dados",
    question: "Qual prática reduz o risco de áreas tomarem decisões com números incompatíveis?",
    options: ["Aumentar o volume de relatórios", "Definir glossário, dado mestre e responsável formal", "Arquivar todos os relatórios antigos", "Restringir o uso de dashboards"],
    correctIndex: 1,
  },
  {
    id: "psi-shelfware",
    question: "Qual sinal indica que uma PSI provavelmente virou shelfware?",
    options: ["A política possui versão e aprovação", "A equipe conhece o canal de exceção", "As regras não são lembradas nem usadas nas decisões", "Há métricas de conscientização"],
    correctIndex: 2,
  },
  {
    id: "zero-trust-contexto",
    question: "No modelo Zero Trust, qual afirmação é mais adequada?",
    options: ["Estar na rede interna basta para acessar recursos", "Toda sessão é autorizada pelo endereço IP", "O acesso considera identidade, contexto e risco do recurso", "O firewall de borda elimina a necessidade de controles adicionais"],
    correctIndex: 2,
  },
  {
    id: "secure-sdlc-evidencia",
    question: "Qual item é uma evidência útil de desenvolvimento seguro?",
    options: ["Uma promessa verbal da equipe", "Registro de revisão de código e resultado de teste de segurança", "Apenas o nome do framework usado", "Um diagrama sem responsável"],
    correctIndex: 1,
  },
  {
    id: "ia-guardrails",
    question: "Qual controle ajuda a reduzir o risco no uso interno de IA?",
    options: ["Permitir qualquer dado em qualquer ferramenta", "Eliminar a revisão humana", "Definir dados permitidos, guardrails e critérios de revisão", "Usar somente prompts longos"],
    correctIndex: 2,
  },
] as const;

export function getGrcAppliedAssessment() {
  return assessment.map(({ correctIndex: _correctIndex, ...question }) => question);
}

export function gradeGrcAppliedAssessment(answers: number[]) {
  const correctAnswers = assessment.filter((question, index) => answers[index] === question.correctIndex).length;
  const score = Math.round((correctAnswers / assessment.length) * 100);
  return { score, totalQuestions: assessment.length, passed: score >= grcAppliedPassingScore };
}
