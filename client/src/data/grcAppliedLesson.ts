export type GrcLessonSection = {
  id: string;
  label: string;
  title: string;
  objective: string;
  keyPoints: string[];
  practice: string;
};

export const grcAppliedLesson = {
  id: "grc-aplicado-governanca-zero-trust",
  title: "GRC aplicado: governança de dados, Zero Trust e desenvolvimento seguro",
  subtitle: "Da decisão de negócio ao controle técnico: uma missão integrada de governança, risco e segurança.",
  duration: "70 min",
  level: "Intermediário",
  objectives: [
    "Relacionar governança de dados, risco, política de segurança e controles técnicos.",
    "Aplicar o princípio Zero Trust a uma decisão de acesso baseada em risco.",
    "Identificar evidências de desenvolvimento seguro alinhadas à ISO/IEC 27001.",
    "Propor uma resposta prática para Shadow AI e dados inconsistentes.",
  ],
  sections: [
    {
      id: "decisao",
      label: "Módulo 01",
      title: "Governança começa pela decisão confiável",
      objective: "Distinguir conformidade documental de governança que apoia decisões.",
      keyPoints: [
        "Um indicador só apoia uma decisão quando possui definição, origem, qualidade e responsável conhecidos.",
        "Glossário, dado mestre e responsável formal evitam que áreas usem números diferentes para o mesmo conceito.",
        "GRC integra objetivos, riscos, controles, evidências e melhoria contínua; não é apenas uma lista de obrigações.",
      ],
      practice: "Escolha um indicador crítico da sua organização. Registre: definição, sistema de origem, responsável pela qualidade e decisão que ele influencia.",
    },
    {
      id: "risco-politica",
      label: "Módulo 02",
      title: "Política de segurança que funciona",
      objective: "Traduzir riscos reais em regras compreensíveis e operáveis.",
      keyPoints: [
        "Uma PSI eficaz nasce do mapeamento de riscos e define regras, exceções, responsáveis, consequências e métricas.",
        "Políticas que ficam arquivadas e não aparecem no trabalho diário se tornam shelfware: existem para auditoria, não para proteção.",
        "Shadow IT e Shadow AI são sinais para investigar necessidades de negócio, controles insuficientes e canais de uso aprovados.",
      ],
      practice: "Teste dos 30 segundos: uma pessoa da equipe sabe localizar a política, citar uma regra e explicar o canal de exceção? Se não, proponha uma melhoria objetiva.",
    },
    {
      id: "zero-trust",
      label: "Módulo 03",
      title: "Zero Trust: proteger o recurso, não o perímetro",
      objective: "Aplicar verificação contínua em um cenário híbrido de acesso a dados.",
      keyPoints: [
        "O perímetro não é mais um critério suficiente de confiança diante de nuvem, mobilidade, BYOD e identidades distribuídas.",
        "Zero Trust reduz confiança implícita e toma decisões com identidade, dispositivo, contexto, risco e sensibilidade do recurso.",
        "A adoção deve ser progressiva: mapear ativos e fluxos, priorizar um caso de uso, medir maturidade e expandir controles.",
      ],
      practice: "Para um painel com dados sensíveis, defina três sinais de decisão de acesso: identidade, postura do dispositivo e contexto. Indique qual resposta cabe a cada desvio: bloquear, exigir autenticação adicional ou limitar sessão.",
    },
    {
      id: "secure-sdlc",
      label: "Módulo 04",
      title: "Desenvolvimento seguro como evidência",
      objective: "Conectar Secure SDLC, controles e evidências auditáveis.",
      keyPoints: [
        "Shift left significa tratar requisitos e riscos de segurança desde o planejamento, sem dispensar verificações antes da produção.",
        "No ciclo de desenvolvimento, a organização pode manter evidências como requisitos de segurança, revisão de código, análise de dependências, testes e aprovação de mudanças.",
        "A Declaração de Aplicabilidade (SoA) conecta os controles selecionados à justificativa, à implementação e à evidência esperada no SGSI.",
      ],
      practice: "Para uma nova API de parceiros, escreva uma evidência por etapa: requisito de segurança, revisão, teste e autorização para produção.",
    },
    {
      id: "ia",
      label: "Módulo 05",
      title: "IA com governança e supervisão humana",
      objective: "Usar IA como apoio operacional sem transferir a ela a responsabilidade pela decisão.",
      keyPoints: [
        "Ferramentas de IA podem apoiar classificação, análise, sumarização e priorização, mas dados sensíveis exigem regras de uso, autorização e revisão humana.",
        "Prompt injection, exposição indevida de dados, respostas imprecisas e uso de ferramentas autônomas são riscos que exigem guardrails e avaliação contínua.",
        "A governança de IA deve definir finalidade, dados permitidos, responsáveis, critérios de qualidade, trilha de auditoria e resposta a incidentes.",
      ],
      practice: "Crie uma regra de uso seguro para um assistente de IA interno: quais dados não podem ser enviados, quem aprova novos casos de uso e quando a saída exige revisão humana?",
    },
  ] satisfies GrcLessonSection[],
  caseStudy: {
    title: "Missão integrada: Energia Nova",
    situation: "Uma empresa de energia digital consolida dados de clientes, medidores e parceiros em um painel na nuvem. Equipes remotas usam planilhas paralelas; um fornecedor lançou uma API; parte do time começou a usar IA pública para resumir ocorrências.",
    tasks: [
      "Defina um dado crítico, seu responsável e a decisão que ele afeta.",
      "Liste um risco de negócio e um controle de política para reduzir o risco.",
      "Escolha um recurso sensível e descreva uma decisão Zero Trust para seu acesso.",
      "Indique uma evidência de Secure SDLC e uma regra para uso seguro de IA.",
    ],
  },
  knowledgeCheck: [
    {
      question: "Qual prática reduz o risco de áreas tomarem decisões com números incompatíveis?",
      options: ["Aumentar o volume de relatórios", "Definir glossário, dado mestre e responsável formal", "Arquivar todos os relatórios antigos", "Restringir o uso de dashboards"],
      correctIndex: 1,
      rationale: "A governança esclarece definições, origem e responsabilidade do dado para que a organização decida sobre uma referência confiável.",
    },
    {
      question: "Qual sinal indica que uma PSI provavelmente virou shelfware?",
      options: ["A política possui versão e aprovação", "A equipe conhece o canal de exceção", "As regras não são lembradas nem usadas nas decisões", "Há métricas de conscientização"],
      correctIndex: 2,
      rationale: "Uma política deixa de proteger quando não é localizada, compreendida e aplicada no cotidiano das equipes.",
    },
    {
      question: "No modelo Zero Trust, qual afirmação é mais adequada?",
      options: ["Estar na rede interna basta para acessar recursos", "Toda sessão é autorizada pelo endereço IP", "O acesso considera identidade, contexto e risco do recurso", "O firewall de borda elimina a necessidade de controles adicionais"],
      correctIndex: 2,
      rationale: "Zero Trust substitui confiança implícita por decisões explícitas e contínuas, adequadas ao recurso e ao contexto.",
    },
    {
      question: "Qual item é uma evidência útil de desenvolvimento seguro?",
      options: ["Uma promessa verbal da equipe", "Registro de revisão de código e resultado de teste de segurança", "Apenas o nome do framework usado", "Um diagrama sem responsável"],
      correctIndex: 1,
      rationale: "Evidências demonstram que o controle foi executado e permitem rastreabilidade para gestão e auditoria.",
    },
    {
      question: "Qual controle ajuda a reduzir o risco no uso interno de IA?",
      options: ["Permitir qualquer dado em qualquer ferramenta", "Eliminar a revisão humana", "Definir dados permitidos, guardrails e critérios de revisão", "Usar somente prompts longos"],
      correctIndex: 2,
      rationale: "O uso responsável de IA depende de finalidade, proteção de dados, limites operacionais e supervisão proporcional ao risco.",
    },
  ],
  sources: [
    "Fundamentos de IA aplicados à Cibersegurança (TI Exames, 2026)",
    "Governança de Dados como alicerce para o compliance",
    "Governança de Dados apoiando o Setor Energético Brasileiro",
    "Masterclass CISM 2026",
    "Desenvolvimento seguro em conformidade com a ISO/IEC 27001",
    "PSI que funciona",
    "Masterclass GRC: O Novo Perfil Profissional",
    "ABNT NBR ISO/IEC 38500:2025 — Governança de TI para a Organização",
    "Aula Aberta NIST Zero Trust",
  ],
};
