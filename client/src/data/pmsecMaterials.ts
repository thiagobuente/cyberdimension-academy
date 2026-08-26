export type PmsecLessonMaterial = {
  title: string;
  concept: string;
  practice: string;
  checkpoint: string;
};

export type PmsecModuleMaterial = {
  moduleIndex: number;
  title: string;
  objective: string;
  keyTerms: string[];
  lessons: PmsecLessonMaterial[];
};

export const pmsecMaterials: PmsecModuleMaterial[] = [
  {
    moduleIndex: 0,
    title: "Fundamentos de projetos de segurança",
    objective: "Transformar um problema de segurança em uma iniciativa executável, com objetivo verificável, escopo controlado e critérios claros de aceite.",
    keyTerms: ["problema", "objetivo", "escopo", "entregável", "stakeholder", "critério de aceite"],
    lessons: [
      { title: "Do sintoma ao problema", concept: "Um projeto começa por uma necessidade observável, não por uma ferramenta. Separe sintoma, causa provável, impacto e hipótese de melhoria antes de propor a solução.", practice: "Escreva um problema de triagem de alertas usando contexto, evidência disponível, impacto para a operação e o que ainda precisa ser investigado.", checkpoint: "Consigo explicar por que o problema importa sem prescrever uma tecnologia específica?" },
      { title: "Objetivo e resultado esperado", concept: "O objetivo descreve a mudança que o projeto pretende produzir. Um bom objetivo é específico o suficiente para orientar decisões e mensurável o bastante para ser avaliado.", practice: "Converta a meta vaga ‘melhorar o SOC’ em um objetivo com população, indicador, horizonte e condição de sucesso.", checkpoint: "O objetivo permite decidir se uma entrega foi aceita?" },
      { title: "Escopo e fora de escopo", concept: "Escopo protege o projeto contra crescimento silencioso. Registre o que será entregue, o que não será entregue, dependências e premissas.", practice: "Monte um quadro de escopo para uma melhoria de detecção, incluindo integrações permitidas, sistemas excluídos e limites de operação.", checkpoint: "Uma nova solicitação pode ser comparada ao escopo antes de ser aceita?" },
      { title: "Entregáveis e critérios de aceite", concept: "Entregáveis são resultados verificáveis, como um playbook revisado ou um relatório de validação. Critérios de aceite descrevem a evidência mínima para considerar cada resultado concluído.", practice: "Defina quatro entregáveis para um projeto de logs e escreva um critério de aceite objetivo para cada um.", checkpoint: "Outra pessoa consegue revisar a evidência sem depender de interpretação?" },
      { title: "Mapa de stakeholders e kickoff", concept: "Stakeholders influenciam, executam, aprovam ou recebem o resultado. O kickoff alinha propósito, decisões, canais, cadência e próximos passos.", practice: "Crie um mapa simples com patrocinador, responsável, consultados e informados para um projeto de resposta a incidentes.", checkpoint: "Cada decisão importante tem responsável e canal de registro?" },
    ],
  },
  {
    moduleIndex: 1,
    title: "Planejamento e priorização baseada em risco",
    objective: "Planejar trabalho de segurança priorizando risco, dependências, capacidade da equipe e valor de redução de exposição.",
    keyTerms: ["risco", "probabilidade", "impacto", "dependência", "prioridade", "backlog"],
    lessons: [
      { title: "Risco como linguagem de decisão", concept: "Risco conecta um evento possível a uma consequência. Registrar risco não significa prever o futuro; significa tornar incertezas discutíveis e atribuir resposta.", practice: "Liste riscos de uma migração de logs e diferencie evento de risco, impacto e causa.", checkpoint: "O risco descreve uma incerteza concreta e acionável?" },
      { title: "Matriz de probabilidade e impacto", concept: "Uma matriz simples ajuda a ordenar conversas, mas não substitui julgamento. Registre a justificativa da classificação e o risco residual após a resposta.", practice: "Classifique cinco riscos de um projeto de IAM, justifique as notas e destaque quais exigem decisão do patrocinador.", checkpoint: "A prioridade tem justificativa auditável?" },
      { title: "Backlog e dependências", concept: "O backlog transforma resultados em trabalho sequenciado. Dependências técnicas, legais, operacionais e de pessoas podem mudar a ordem ideal.", practice: "Quebre um projeto de melhoria de vulnerabilidades em itens menores e desenhe as dependências entre inventário, priorização, correção e validação.", checkpoint: "Se uma tarefa atrasar, sei quais entregas serão afetadas?" },
      { title: "Capacidade e roadmap", concept: "Um roadmap responsável considera capacidade real, janelas de mudança, sazonalidade e trabalho operacional. Datas devem ser hipóteses revisáveis, não promessas isoladas.", practice: "Distribua as entregas de um projeto em três marcos, reservando capacidade para incidentes e validação.", checkpoint: "O plano contempla trabalho não planejado sem esconder o risco?" },
      { title: "Decisão de priorização", concept: "Priorizar é escolher o próximo melhor investimento diante de restrições. Compare redução de risco, esforço, dependências, urgência e reversibilidade.", practice: "Ordene quatro iniciativas de segurança e escreva um registro de decisão que explique a escolha e as alternativas adiadas.", checkpoint: "Consigo explicar o que não será feito agora e por quê?" },
    ],
  },
  {
    moduleIndex: 2,
    title: "Governança, papéis e comunicação",
    objective: "Criar governança proporcional que facilite decisões, prestação de contas e comunicação entre segurança, tecnologia e negócio.",
    keyTerms: ["RACI", "decisão", "escalonamento", "cadência", "status", "governança"],
    lessons: [
      { title: "Governança sem burocracia", concept: "Governança é o conjunto de regras que permite decidir, acompanhar e corrigir. Ela deve ser proporcional ao risco e ao impacto da iniciativa.", practice: "Defina quais decisões precisam de aprovação formal e quais podem ser tomadas pelo responsável técnico.", checkpoint: "A governança acelera decisões em vez de apenas criar reuniões?" },
      { title: "Matriz RACI aplicada", concept: "RACI explicita quem executa, aprova, contribui e precisa ser informado. Uma atividade não deve ter múltiplos aprovadores sem necessidade.", practice: "Monte uma RACI para uma mudança de regra de detecção envolvendo SOC, infraestrutura, jurídico e comunicação.", checkpoint: "Cada entrega tem exatamente um accountable claro?" },
      { title: "Comunicação por público", concept: "Liderança precisa de impacto, risco e decisão; equipes técnicas precisam de contexto, evidência e ação; usuários precisam de orientação compreensível.", practice: "Reescreva o mesmo status de projeto em versões executiva, técnica e operacional.", checkpoint: "Cada público recebe apenas o nível de detalhe necessário para agir?" },
      { title: "Escalonamento e conflitos", concept: "Escalonar não é transferir responsabilidade; é levar uma decisão ao nível que possui autoridade, contexto ou capacidade para resolvê-la.", practice: "Defina gatilhos de escalonamento para severidade, atraso, risco residual e dependência externa.", checkpoint: "O time sabe quando decidir, quando consultar e quando escalar?" },
      { title: "Ritmo de acompanhamento", concept: "Cadências curtas mantêm impedimentos visíveis. Um status útil combina avanço, próximo passo, riscos, decisões necessárias e mudança de escopo.", practice: "Crie um modelo semanal de status para um projeto de resposta a incidentes.", checkpoint: "O status permite uma decisão ou ação concreta?" },
    ],
  },
  {
    moduleIndex: 3,
    title: "Execução segura e gestão de mudanças",
    objective: "Executar entregas de segurança com testes, controle de mudanças, rollback e observabilidade suficientes para reduzir risco operacional.",
    keyTerms: ["mudança", "janela", "rollback", "teste", "runbook", "observabilidade"],
    lessons: [
      { title: "Preparar antes de mudar", concept: "Uma mudança segura tem plano, responsável, escopo, pré-condições, evidência de teste, janela e critério explícito para interromper.", practice: "Preencha um plano de mudança para uma regra de detecção com pré-checagens e comunicação.", checkpoint: "Existe uma condição objetiva para não executar?" },
      { title: "Teste e validação", concept: "Teste deve aproximar o comportamento esperado e revelar efeitos colaterais. Em segurança, valide detecção, falso positivo, desempenho e cobertura.", practice: "Defina casos de teste para uma alteração de parser de logs e identifique o resultado esperado de cada caso.", checkpoint: "O teste cobre sucesso e falha previsível?" },
      { title: "Janela e rollback", concept: "Rollback é uma decisão preparada, não uma esperança. Registre como reverter, quem autoriza, tempo estimado e como verificar o retorno ao estado seguro.", practice: "Escreva um plano de rollback para uma política de acesso que possa bloquear usuários legítimos.", checkpoint: "A equipe consegue voltar a um estado conhecido?" },
      { title: "Execução e registro", concept: "Durante a execução, registre horário, operador, evidências e desvios. O registro permite aprendizado e prestação de contas sem depender de memória.", practice: "Simule um diário de mudança com três eventos: execução, desvio e decisão de continuar.", checkpoint: "Outra pessoa consegue reconstruir o que ocorreu?" },
      { title: "Observabilidade pós-mudança", concept: "Monitoramento pós-mudança confirma resultado e captura regressões. Defina sinais, período de observação, responsável e ação de resposta.", practice: "Crie um plano de observação de 60 minutos para uma mudança em alertas do SOC.", checkpoint: "Se a mudança piorar o serviço, saberemos rapidamente?" },
    ],
  },
  {
    moduleIndex: 4,
    title: "Entrega, métricas e melhoria contínua",
    objective: "Encerrar o projeto com aceite, handover, métricas úteis, riscos residuais e um ciclo de aprendizado que melhore a próxima iniciativa.",
    keyTerms: ["aceite", "handover", "KPI", "KRI", "risco residual", "retrospectiva"],
    lessons: [
      { title: "Aceite baseado em evidência", concept: "Aceite confirma que o resultado atende aos critérios acordados. Diferencie entrega concluída, benefício observado e pendência aceita.", practice: "Monte uma lista de aceite para um playbook de incidente e associe cada item à evidência correspondente.", checkpoint: "O aceite está ligado ao critério definido no início?" },
      { title: "Handover para a operação", concept: "Handover transfere contexto, responsabilidade e capacidade de sustentação. Inclua runbook, contatos, limites, treinamento e próximos ciclos.", practice: "Crie um roteiro de handover para uma nova detecção entregue ao SOC.", checkpoint: "A operação consegue sustentar o resultado sem depender do projeto?" },
      { title: "KPIs e KRIs", concept: "KPIs acompanham desempenho; KRIs sinalizam exposição ou deterioração. Uma métrica deve ter definição, fonte, periodicidade e responsável.", practice: "Defina dois KPIs e dois KRIs para um projeto de melhoria de triagem, evitando métricas de vaidade.", checkpoint: "A métrica muda alguma decisão ou comportamento?" },
      { title: "Riscos residuais e pendências", concept: "Todo projeto termina com riscos que permanecem. Registre impacto, responsável, prazo, condição de revisão e decisão de aceitar, mitigar ou transferir.", practice: "Redija um registro de encerramento com duas pendências e três riscos residuais.", checkpoint: "O que ficou aberto está visível para quem assume a operação?" },
      { title: "Retrospectiva e próximo ciclo", concept: "Retrospectiva converte experiência em melhoria: preservar o que funcionou, corrigir o que falhou e testar uma mudança no próximo ciclo.", practice: "Conduza uma retrospectiva curta com evidências do projeto e escolha uma melhoria para experimentar.", checkpoint: "A próxima equipe terá uma orientação prática, não apenas opiniões?" },
    ],
  },
];

export function getPmsecModuleMaterial(moduleIndex: number) {
  return pmsecMaterials.find((module) => module.moduleIndex === moduleIndex);
}
