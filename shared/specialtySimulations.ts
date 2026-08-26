export type SpecialtySimulationQuestion = {
  id: string;
  prompt: string;
  options: readonly string[];
  correctAnswer: number;
  explanation: string;
};

export type SpecialtySimulation = {
  slug: "soc-operations" | "cloud-security" | "application-security";
  title: string;
  subtitle: string;
  durationMinutes: number;
  passingScore: number;
  recommendedCourses: readonly string[];
  questions: readonly SpecialtySimulationQuestion[];
};

export const specialtySimulations: readonly SpecialtySimulation[] = [
  {
    slug: "soc-operations",
    title: "Simulado SOC Operations",
    subtitle: "Triagem, telemetria, escalonamento e resposta com foco defensivo.",
    durationMinutes: 18,
    passingScore: 70,
    recommendedCourses: ["soc-analyst", "siem-na-pratica", "incident-response", "detection-engineering"],
    questions: [
      { id: "soc-sim-1", prompt: "Um alerta de SIEM deve ser tratado inicialmente como:", options: ["Um sinal que exige contexto", "Um incidente confirmado", "Uma falha do sistema", "Uma solicitação de acesso"], correctAnswer: 0, explanation: "Alertas são sinais para investigação; sua prioridade e gravidade precisam de validação por evidências." },
      { id: "soc-sim-2", prompt: "Qual conjunto de dados ajuda mais a validar um logon incomum?", options: ["Identidade, horário, origem e atividade posterior", "Somente a cor do alerta", "O nome do analista", "A senha do usuário"], correctAnswer: 0, explanation: "Contexto de identidade, tempo, origem e comportamento posterior ajuda a calibrar a investigação." },
      { id: "soc-sim-3", prompt: "O objetivo de normalizar logs é:", options: ["Facilitar comparação e correlação entre fontes", "Eliminar retenção", "Substituir analistas", "Apagar duplicidades automaticamente"], correctAnswer: 0, explanation: "Campos consistentes permitem busca e correlação entre tecnologias diferentes." },
      { id: "soc-sim-4", prompt: "Em um escalonamento, a informação mais útil é:", options: ["Evidências, incertezas e decisão solicitada", "Apenas a urgência", "Credenciais do ambiente", "Uma conclusão sem fonte"], correctAnswer: 0, explanation: "Um escalonamento acionável preserva contexto para que outra equipe possa decidir com segurança." },
      { id: "soc-sim-5", prompt: "Uma contenção responsável precisa considerar:", options: ["Impacto operacional, evidências e coordenação", "Ação isolada sem comunicar", "Exclusão de registros", "Apenas velocidade"], correctAnswer: 0, explanation: "Conter sem avaliar contexto pode prejudicar a operação e a investigação." },
      { id: "soc-sim-6", prompt: "Uma regra de detecção madura deve informar:", options: ["Sinal, dados necessários e próximo passo de triagem", "Que todo alerta é incidente", "A exclusão de logs", "Como elevar privilégios"], correctAnswer: 0, explanation: "A regra orienta a triagem, mas não substitui análise contextual." },
      { id: "soc-sim-7", prompt: "Uma hipótese de threat hunting é melhor quando:", options: ["É testável e possui critérios claros", "Acusa uma pessoa", "Exige acesso externo", "Não possui escopo"], correctAnswer: 0, explanation: "Hipóteses investigáveis conectam comportamento, fontes e critérios de confirmação ou enfraquecimento." },
      { id: "soc-sim-8", prompt: "Lições aprendidas efetivas geram:", options: ["Ações acompanháveis de melhoria", "Culpabilização", "Exclusão do histórico", "Fim da documentação"], correctAnswer: 0, explanation: "Aprendizado operacional deve se transformar em ajustes com responsável, prazo e evidência." },
    ],
  },
  {
    slug: "cloud-security",
    title: "Simulado Cloud Security",
    subtitle: "Identidade, responsabilidade compartilhada, postura, logs e resposta em nuvem.",
    durationMinutes: 18,
    passingScore: 70,
    recommendedCourses: ["fundamentos-cloud-iniciante", "cloud-security-fundamentals", "aws-security-fundamentals", "azure-security-fundamentals", "cloud-security-operations"],
    questions: [
      { id: "cloud-sim-1", prompt: "O modelo de responsabilidade compartilhada significa que:", options: ["Cliente e provedor possuem responsabilidades diferentes", "O provedor protege tudo", "O cliente não precisa de controles", "Não existem riscos"], correctAnswer: 0, explanation: "A divisão depende do serviço, mas identidade, dados e configurações geralmente exigem decisões do cliente." },
      { id: "cloud-sim-2", prompt: "Uma prática de IAM alinhada a menor privilégio é:", options: ["Conceder apenas as permissões necessárias", "Usar uma conta compartilhada", "Manter chaves permanentes sem revisão", "Dar privilégios administrativos por padrão"], correctAnswer: 0, explanation: "Permissões mínimas e revisáveis reduzem impacto de exposição ou uso indevido." },
      { id: "cloud-sim-3", prompt: "Logs de auditoria em nuvem são importantes porque:", options: ["Apoiam investigação e rastreabilidade", "Substituem backups", "Eliminam MFA", "Impedem atualizações"], correctAnswer: 0, explanation: "Eventos de identidade e configuração oferecem evidências para investigar mudanças e atividades." },
      { id: "cloud-sim-4", prompt: "Uma postura de segurança cloud deve priorizar:", options: ["Configurações, identidades e exposição verificáveis", "Apenas custo", "Somente páginas públicas", "Credenciais longas"], correctAnswer: 0, explanation: "Postura segura depende de configurações observáveis e correção de desvios relevantes." },
      { id: "cloud-sim-5", prompt: "Criptografia em repouso protege principalmente:", options: ["Dados armazenados contra acesso indevido", "A velocidade da internet", "A tela do usuário", "A auditoria de logs"], correctAnswer: 0, explanation: "Criptografia de dados armazenados precisa ser acompanhada por bom controle de chaves e acesso." },
      { id: "cloud-sim-6", prompt: "Em uma suspeita de credencial comprometida, um primeiro passo seguro é:", options: ["Revisar atividades e aplicar contenção coordenada", "Publicar a chave", "Apagar os logs", "Desativar auditoria"], correctAnswer: 0, explanation: "A resposta precisa preservar contexto, limitar risco e seguir o procedimento do ambiente." },
      { id: "cloud-sim-7", prompt: "A segmentação de rede em nuvem ajuda a:", options: ["Reduzir caminhos desnecessários entre workloads", "Substituir identidade", "Desativar registros", "Tornar dados públicos"], correctAnswer: 0, explanation: "Limites de rede complementam identidade e controles de aplicação para reduzir exposição." },
      { id: "cloud-sim-8", prompt: "Uma revisão de acesso deve verificar:", options: ["Papéis, necessidade, prazo e evidência de aprovação", "Somente nomes de usuários", "Apenas a última senha", "A cor do console"], correctAnswer: 0, explanation: "Revisões periódicas mantêm privilégios alinhados a funções e reduzem permissões residuais." },
    ],
  },
  {
    slug: "application-security",
    title: "Simulado Segurança de Aplicações",
    subtitle: "Identidade, autorização, validação, segredos e observabilidade no ciclo de desenvolvimento.",
    durationMinutes: 18,
    passingScore: 70,
    recommendedCourses: ["web-security-owasp", "api-security", "database-security", "mobile-security", "software-security-applied"],
    questions: [
      { id: "app-sim-1", prompt: "Autenticação responde principalmente à pergunta:", options: ["Quem é a entidade", "O que ela pode fazer", "Onde o log fica", "Qual banco usar"], correctAnswer: 0, explanation: "Autenticação estabelece identidade; autorização decide quais ações são permitidas." },
      { id: "app-sim-2", prompt: "Uma falha de autorização pode ocorrer quando:", options: ["O servidor não valida o acesso ao recurso solicitado", "A senha possui MFA", "Há logs suficientes", "O navegador está atualizado"], correctAnswer: 0, explanation: "A autorização deve ser verificada no servidor para cada recurso e ação relevante." },
      { id: "app-sim-3", prompt: "Consultas parametrizadas ajudam a:", options: ["Separar dados de instruções na consulta", "Expor credenciais", "Remover backups", "Desativar auditoria"], correctAnswer: 0, explanation: "Parâmetros reduzem o risco de que uma entrada seja interpretada como instrução da consulta." },
      { id: "app-sim-4", prompt: "Segredos de aplicação devem ser:", options: ["Armazenados em mecanismo apropriado e com acesso controlado", "Incluídos no repositório", "Expostos em logs", "Compartilhados em chats"], correctAnswer: 0, explanation: "Segredos exigem armazenamento, rotação e acesso mínimos para evitar exposição acidental." },
      { id: "app-sim-5", prompt: "Validação de entrada deve ocorrer:", options: ["No servidor, conforme a regra de negócio", "Somente no navegador", "Apenas após gravar os dados", "Nunca para APIs"], correctAnswer: 0, explanation: "Validação no servidor é essencial porque clientes podem ser alterados ou contornados." },
      { id: "app-sim-6", prompt: "Logs de segurança de uma aplicação devem evitar:", options: ["Registrar segredos e dados sensíveis desnecessários", "Registrar ações relevantes", "Associar eventos a contexto", "Ter horário consistente"], correctAnswer: 0, explanation: "Observabilidade útil preserva privacidade e reduz o risco de vazamento por logs." },
      { id: "app-sim-7", prompt: "Uma dependência de software deve ser tratada com:", options: ["Inventário, atualização e avaliação de risco", "Confiança implícita", "Ausência de versão", "Instalação sem revisão"], correctAnswer: 0, explanation: "Conhecer versões e acompanhar vulnerabilidades ajuda a reduzir risco na cadeia de software." },
      { id: "app-sim-8", prompt: "Threat modeling durante o desenvolvimento apoia:", options: ["Antecipar abusos e priorizar controles", "Substituir testes", "Eliminar requisitos", "Publicar segredos"], correctAnswer: 0, explanation: "Modelagem de ameaças conecta ativos, cenários de abuso e controles adequados desde o desenho." },
    ],
  },
] as const;

export const specialtySimulationSlugs = specialtySimulations.map((simulation) => simulation.slug) as [SpecialtySimulation["slug"], ...SpecialtySimulation["slug"][]];

export function getSpecialtySimulation(slug: string) {
  return specialtySimulations.find((simulation) => simulation.slug === slug);
}

export function getPublicSpecialtySimulation(slug: string) {
  const simulation = getSpecialtySimulation(slug);
  if (!simulation) return null;
  return { ...simulation, questions: simulation.questions.map(({ correctAnswer: _correctAnswer, explanation: _explanation, ...question }) => question) };
}

export function gradeSpecialtySimulation(slug: string, answers: number[]) {
  const simulation = getSpecialtySimulation(slug);
  if (!simulation || answers.length !== simulation.questions.length) return null;
  const score = simulation.questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  const percentage = Math.round((score / simulation.questions.length) * 100);
  return { score, totalQuestions: simulation.questions.length, percentage, passed: percentage >= simulation.passingScore, review: simulation.questions.map((question, index) => ({ id: question.id, correct: answers[index] === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation })) };
}
