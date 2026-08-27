import { activatedCatalogCourses } from "@shared/activatedCatalogCourses";
import { consultoriaCourses } from "@shared/consultoriaCourses";
import { aiAcademyCourse } from "@shared/aiAcademyCourse";

const baseCourseRequirements = {
  "fundamentos-ti": {
    title: "Fundamentos de TI para Segurança",
    moduleCount: 5,
    labCount: 4,
  },
  "fundamentos-cyber-security": {
    title: "Fundamentos de Cyber Security",
    moduleCount: 5,
    labCount: 4,
  },
  "redes-para-cyber-security": {
    title: "Redes para Cyber Security",
    moduleCount: 5,
    labCount: 5,
  },
  "linux-para-operacoes-de-seguranca": {
    title: "Linux para Operações de Segurança",
    moduleCount: 5,
    labCount: 5,
  },
} as const;

export const orbitCourseRequirements: Record<string, { title: string; moduleCount: number; labCount: number }> = {
  ...baseCourseRequirements,
  ...Object.fromEntries(activatedCatalogCourses.map((course) => [course.slug, { title: course.title, moduleCount: course.modules.length, labCount: course.labsList.length }])),
  ...Object.fromEntries(consultoriaCourses.map((course) => [course.slug, { title: course.title, moduleCount: course.modules.length, labCount: course.labsList.length }])),
  [aiAcademyCourse.slug]: { title: aiAcademyCourse.title, moduleCount: aiAcademyCourse.modules.length, labCount: aiAcademyCourse.labsList.length },
};

export const orbitCourseSlugs = Object.keys(orbitCourseRequirements) as [string, ...string[]];

export type OrbitCourseSlug = keyof typeof baseCourseRequirements;

export const assessmentPassingScore = 70;

type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: readonly string[];
  correctAnswer: number;
  explanation: string;
};

type ModuleTopic = {
  title: string;
  description: string;
  lessons: number;
};

const baseCourseModules: Record<string, readonly ModuleTopic[]> = {
  "fundamentos-ti": [
    { title: "Como a computação funciona", lessons: 6, description: "Hardware, software, armazenamento e processos." },
    { title: "Sistemas operacionais", lessons: 7, description: "Windows, Linux, permissões e organização de arquivos." },
    { title: "Conexões que movem a internet", lessons: 8, description: "TCP/IP, DNS, HTTP/HTTPS e fundamentos de rede." },
    { title: "Seu ambiente de prática", lessons: 6, description: "VirtualBox, Docker, linha de comando e segurança básica." },
    { title: "Colaboração técnica", lessons: 5, description: "Git, GitHub e documentação de atividades." },
  ],
  "fundamentos-cyber-security": [
    { title: "Pensamento de segurança", lessons: 7, description: "CIA Triad, ativos, ameaças, vulnerabilidades e controles." },
    { title: "Risco e pessoas", lessons: 6, description: "Gestão de risco, engenharia social e cultura de segurança." },
    { title: "Protegendo dados e identidades", lessons: 9, description: "Criptografia, hashes, PKI, certificados, IAM e MFA." },
    { title: "Governança e privacidade", lessons: 7, description: "LGPD, políticas, ISO 27001 e NIST." },
    { title: "Entendendo adversários", lessons: 7, description: "MITRE ATT&CK, Cyber Kill Chain e leitura de cenários." },
  ],
  "redes-para-cyber-security": [
    { title: "Fundamentos de conectividade", lessons: 8, description: "Camadas, IPv4, IPv6, portas e protocolos." },
    { title: "Switching e segmentação", lessons: 9, description: "Switches, VLAN, STP e limites de broadcast." },
    { title: "Routing e acesso", lessons: 9, description: "Rotas, OSPF, NAT e listas de controle de acesso." },
    { title: "Conectividade moderna", lessons: 8, description: "Wireless, VPN, QoS e serviços de rede." },
    { title: "Troubleshooting seguro", lessons: 8, description: "Método, evidências, logs e documentação de incidentes." },
  ],
  "linux-para-operacoes-de-seguranca": [
    { title: "Terminal com propósito", lessons: 8, description: "Navegação, arquivos, permissões, pipes e busca de informação." },
    { title: "Processos e serviços", lessons: 7, description: "Processos, systemd, contas e superfícies de exposição." },
    { title: "Acesso e rede", lessons: 8, description: "SSH, chaves, firewall e princípios de acesso remoto." },
    { title: "Observabilidade", lessons: 7, description: "Logs, auditoria, sinais de falha e coleta responsável." },
    { title: "Automação e hardening", lessons: 8, description: "Cron, scripts Bash seguros e checklist de endurecimento." },
  ],
};

const courseAssessments: Record<string, readonly AssessmentQuestion[]> = {
  "fundamentos-ti": [
    { id: "ti-1", prompt: "Qual componente executa instruções e coordena o processamento de um computador?", options: ["CPU", "SSD", "RAM", "Placa de rede"], correctAnswer: 0, explanation: "A CPU interpreta e executa instruções de programas." },
    { id: "ti-2", prompt: "Qual prática reduz o risco de perda de arquivos essenciais?", options: ["Desativar atualizações", "Manter backups testados", "Usar a mesma senha", "Apagar logs"], correctAnswer: 1, explanation: "Backups testados permitem recuperação confiável após falhas." },
    { id: "ti-3", prompt: "Qual protocolo é normalmente usado para acessar páginas web protegidas?", options: ["FTP", "HTTP", "HTTPS", "Telnet"], correctAnswer: 2, explanation: "HTTPS protege a comunicação web com TLS." },
    { id: "ti-4", prompt: "Qual é uma característica de uma máquina virtual?", options: ["Compartilha recursos de hardware de forma isolada", "Exige outro prédio", "Não usa sistema operacional", "Substitui backups"], correctAnswer: 0, explanation: "A virtualização permite ambientes isolados sobre o mesmo hardware físico." },
    { id: "ti-5", prompt: "Por que registrar mudanças técnicas em um repositório é útil?", options: ["Para ocultar o histórico", "Para rastrear alterações e colaborar", "Para apagar versões", "Para desligar a rede"], correctAnswer: 1, explanation: "O controle de versão registra o histórico e favorece a colaboração." },
  ],
  "fundamentos-cyber-security": [
    { id: "cyber-1", prompt: "Qual princípio limita permissões ao mínimo necessário?", options: ["Defesa em profundidade", "Menor privilégio", "Disponibilidade", "Ofuscação"], correctAnswer: 1, explanation: "Menor privilégio reduz a superfície de impacto de uma conta." },
    { id: "cyber-2", prompt: "O que melhor descreve phishing?", options: ["Falha elétrica", "Engenharia social para induzir ações", "Backup criptografado", "Atualização de software"], correctAnswer: 1, explanation: "Phishing usa mensagens enganosas para obter dados ou induzir ações." },
    { id: "cyber-3", prompt: "Qual controle ajuda a reduzir o risco de acesso indevido a uma conta?", options: ["MFA", "Senha compartilhada", "Porta aberta", "Log desativado"], correctAnswer: 0, explanation: "A autenticação multifator adiciona uma camada de verificação." },
    { id: "cyber-4", prompt: "Após identificar um incidente confirmado, qual ação é adequada?", options: ["Ignorar evidências", "Seguir o processo de resposta a incidentes", "Publicar credenciais", "Reiniciar tudo sem registrar"], correctAnswer: 1, explanation: "Um processo estruturado orienta contenção, análise e recuperação." },
    { id: "cyber-5", prompt: "Qual objetivo da classificação de dados?", options: ["Aplicar proteção compatível com a sensibilidade", "Eliminar todos os arquivos", "Aumentar privilégios", "Evitar inventário"], correctAnswer: 0, explanation: "Classificar dados permite aplicar controles proporcionais ao seu valor e risco." },
  ],
  "redes-para-cyber-security": [
    { id: "redes-1", prompt: "Qual prática separa segmentos de rede para reduzir movimentação lateral?", options: ["Segmentação", "Broadcast irrestrito", "Senha única", "Desativar firewall"], correctAnswer: 0, explanation: "A segmentação limita a propagação de acessos e ameaças." },
    { id: "redes-2", prompt: "Uma ACL é usada principalmente para:", options: ["Definir regras de tráfego", "Criar backups", "Editar arquivos", "Instalar memória"], correctAnswer: 0, explanation: "Listas de controle de acesso permitem ou negam fluxos conforme regras." },
    { id: "redes-3", prompt: "Qual serviço traduz nomes de domínio em endereços IP?", options: ["DNS", "NTP", "SMTP", "DHCP"], correctAnswer: 0, explanation: "DNS resolve nomes, como portal.interno, para endereços IP." },
    { id: "redes-4", prompt: "Qual recurso cria um túnel protegido para acesso remoto?", options: ["VPN", "Hub", "Proxy aberto", "Broadcast"], correctAnswer: 0, explanation: "VPN estabelece um canal protegido sobre uma rede não confiável." },
    { id: "redes-5", prompt: "Por que revisar rotas e NAT é importante em uma investigação?", options: ["Para entender o caminho e a tradução do tráfego", "Para excluir logs", "Para trocar todos os cabos", "Para remover MFA"], correctAnswer: 0, explanation: "Rotas e NAT explicam como tráfego sai, chega e é traduzido." },
  ],
  "linux-para-operacoes-de-seguranca": [
    { id: "linux-1", prompt: "Qual diretório costuma armazenar registros de eventos em Linux?", options: ["/var/log", "/tmp", "/home", "/opt"], correctAnswer: 0, explanation: "Logs de sistema e serviços são normalmente armazenados em /var/log." },
    { id: "linux-2", prompt: "Qual comando consulta o estado de um serviço no systemd?", options: ["systemctl status", "chmod status", "grep start", "nano service"], correctAnswer: 0, explanation: "systemctl status apresenta o estado e os eventos recentes de um serviço." },
    { id: "linux-3", prompt: "Qual prática fortalece o acesso SSH?", options: ["Usar chaves e desativar login por senha quando possível", "Compartilhar a chave privada", "Abrir qualquer origem", "Usar root para tudo"], correctAnswer: 0, explanation: "Chaves e controles de acesso reduzem exposição de credenciais." },
    { id: "linux-4", prompt: "Qual princípio é indicado para contas administrativas?", options: ["Menor privilégio", "Acesso permanente a todos", "Senha em texto puro", "Sem logs"], correctAnswer: 0, explanation: "Contas administrativas devem ter somente os privilégios necessários." },
    { id: "linux-5", prompt: "Por que filtrar eventos de falha de SSH é útil?", options: ["Para identificar padrões de tentativa de acesso", "Para apagar evidências", "Para bloquear backups", "Para ignorar incidentes"], correctAnswer: 0, explanation: "Analisar falhas pode revelar tentativas indevidas e orientar respostas." },
  ],
};

for (const course of activatedCatalogCourses) {
  courseAssessments[course.slug] = course.assessmentQuestions;
}
for (const course of consultoriaCourses) {
  courseAssessments[course.slug] = course.assessmentQuestions;
}
courseAssessments[aiAcademyCourse.slug] = aiAcademyCourse.assessmentQuestions;

export const courseBadgeDefinitions = [
  { code: "first-module", title: "Primeiro Salto", description: "Concluiu o primeiro módulo da formação.", tier: "cyan" },
  { code: "all-modules", title: "Mapa Estelar", description: "Concluiu toda a rota de módulos.", tier: "violet" },
  { code: "first-lab", title: "Explorador de Laboratório", description: "Validou a primeira missão prática.", tier: "green" },
  { code: "all-labs", title: "Operador Prático", description: "Concluiu todos os laboratórios guiados.", tier: "green" },
  { code: "assessment-passed", title: "Mestre da Missão", description: "Aprovado na avaliação final.", tier: "violet" },
  { code: "certified", title: "Orbit Certified", description: "Conquistou o certificado nominal da formação.", tier: "cyan" },
] as const;

const safeLabCommands: Record<string, readonly string[]> = {
  "fundamentos-ti": [
    "verificar ambiente --vm --rede-isolada",
    "diagnosticar --dns academy.local --http",
    "listar --diretorio /home/estudante --detalhes",
    "iniciar-repositorio --nome cyber-notes",
  ],
  "fundamentos-cyber-security": [
    "avaliar-risco --ativo banco-clientes --cenario vazamento",
    "analisar-email --arquivo mensagem-suspeita.eml",
    "revisar-acesso --usuario analista --perfil leitura",
    "orquestrar-resposta --incidente phishing-confirmado",
  ],
  "redes-para-cyber-security": [
    "segmentar --vlan usuarios,servidores,admin",
    "testar-acl --origem usuarios --destino servidor-web --porta 443",
    "inspecionar-rota --destino 8.8.8.8 --nat",
    "validar-vpn --mfa --rede-interna",
    "investigar-dns --host portal.interno",
  ],
  "linux-para-operacoes-de-seguranca": [
    "find /var/log -type f --recentes",
    "systemctl status nginx --resumo",
    "auditar-ssh --chaves --sem-senha",
    "filtrar-log --evento ssh-falha --ultimas 24h",
    "validar-hardening --perfil basico",
  ],
};

for (const course of activatedCatalogCourses) {
  safeLabCommands[course.slug] = course.labsList.map((lab) => lab.command);
}
for (const course of consultoriaCourses) {
  safeLabCommands[course.slug] = course.labsList.map((lab) => lab.command);
}
safeLabCommands[aiAcademyCourse.slug] = aiAcademyCourse.labsList.map((lab) => lab.command);

export function executeSafeLabCommand(slug: string, labIndex: number, command: string) {
  const requirements = getOrbitCourseRequirements(slug);
  const expectedCommand = requirements ? safeLabCommands[slug]?.[labIndex] : undefined;
  if (!requirements || !expectedCommand) return { success: false, output: "Missão de laboratório não encontrada." };
  if (command.trim() !== expectedCommand) {
    return {
      success: false,
      output: "Comando não reconhecido pelo ambiente seguro. Revise a missão e execute somente o comando indicado para esta etapa.",
    };
  }
  const course = activatedCatalogCourses.find((item) => item.slug === slug) ?? consultoriaCourses.find((item) => item.slug === slug) ?? (aiAcademyCourse.slug === slug ? aiAcademyCourse : undefined);
  const lab = course?.labsList[labIndex];
  const simResult = lab?.output ?? "Resultado da simulação registrado no ambiente de laboratório.";
  return {
    success: true,
    output: `Execução segura concluída.\nMissão: ${requirements.title} · laboratório ${String(labIndex + 1).padStart(2, "0")}\nSimulação executada em ambiente isolado (sem alteração em infraestrutura real).\nResultado da simulação:\n${simResult}\nComo concluir esta etapa: selecione abaixo a alternativa correta (registrar a evidência e documentar a execução) e clique em "Validar e concluir".`,
  };
}

export function isLabEvidenceValid(answer: string) {
  return answer === "registrar-evidencia";
}

export function getPublicAssessment(slug: string) {
  const questions = courseAssessments[slug as OrbitCourseSlug] ?? [];
  return questions.map(({ correctAnswer: _correctAnswer, explanation: _explanation, ...question }) => question);
}

function getModuleTopics(slug: string): readonly ModuleTopic[] {
  const base = baseCourseModules[slug];
  if (base) return base;
  const activatedCourse = activatedCatalogCourses.find((course) => course.slug === slug);
  if (activatedCourse) return activatedCourse.modules;
  if (slug === aiAcademyCourse.slug) return aiAcademyCourse.modules;
  return consultoriaCourses.find((course) => course.slug === slug)?.modules ?? [];
}

function getModuleQuiz(slug: string, moduleIndex: number): readonly AssessmentQuestion[] {
  const topics = getModuleTopics(slug);
  const topic = topics[moduleIndex];
  if (!topic) return [];
  const alternativeTopics = topics.filter((_, index) => index !== moduleIndex).slice(0, 3);
  const focusOptions = [topic.description, ...alternativeTopics.map((item) => item.description)];
  while (focusOptions.length < 4) focusOptions.push("Conteúdo de outro módulo da formação.");
  return [
    {
      id: `${slug}-module-${moduleIndex + 1}-focus`,
      prompt: `Qual conjunto de conceitos sintetiza melhor o módulo “${topic.title}”?`,
      options: focusOptions,
      correctAnswer: 0,
      explanation: `Este módulo consolida ${topic.description.toLowerCase()} Retome suas ${topic.lessons} lições antes de seguir.`,
    },
    {
      id: `${slug}-module-${moduleIndex + 1}-practice`,
      prompt: `Ao aplicar “${topic.title}” em um ambiente de estudo, qual conduta é mais adequada?`,
      options: [
        "Ignorar o escopo do laboratório para testar rapidamente em qualquer ambiente.",
        "Usar o laboratório guiado, registrar evidências e respeitar o escopo autorizado.",
        "Desativar controles para diminuir o número de alertas.",
        "Compartilhar credenciais para concluir a atividade com mais rapidez.",
      ],
      correctAnswer: 1,
      explanation: "A prática de segurança deve manter escopo autorizado, evidências e controles. O laboratório guiado existe para exercitar o conceito sem tocar em infraestrutura real.",
    },
  ];
}

export function getPublicModuleQuiz(slug: string, moduleIndex: number) {
  return getModuleQuiz(slug, moduleIndex).map(({ correctAnswer: _correctAnswer, explanation: _explanation, ...question }) => question);
}

export function gradeModuleQuestion(slug: string, moduleIndex: number, questionIndex: number, answer: number) {
  const question = getModuleQuiz(slug, moduleIndex)[questionIndex];
  if (!question || !Number.isInteger(answer) || answer < 0 || answer >= question.options.length) return null;
  const correct = answer === question.correctAnswer;
  return { questionId: question.id, correct, correctAnswer: question.correctAnswer, explanation: question.explanation };
}

export function gradeModuleQuiz(slug: string, moduleIndex: number, answers: number[]) {
  const questions = getModuleQuiz(slug, moduleIndex);
  if (questions.length === 0 || answers.length !== questions.length) return null;
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  return {
    score,
    totalQuestions: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    review: questions.map((question, index) => ({ id: question.id, correct: answers[index] === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation })),
  };
}

export function gradeAssessment(slug: string, answers: number[]) {
  const questions = courseAssessments[slug as OrbitCourseSlug];
  if (!questions || answers.length !== questions.length) return null;
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);
  return {
    score,
    totalQuestions: questions.length,
    percentage,
    passed: percentage >= assessmentPassingScore,
    review: questions.map((question, index) => ({ id: question.id, correct: answers[index] === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation })),
  };
}

export function getEarnedBadgeCodes(input: { completedModules: number; completedLabs: number; moduleCount: number; labCount: number; assessmentPassed: boolean; certified: boolean }) {
  const badges: string[] = [];
  if (input.completedModules >= 1) badges.push("first-module");
  if (input.completedModules >= input.moduleCount) badges.push("all-modules");
  if (input.completedLabs >= 1) badges.push("first-lab");
  if (input.completedLabs >= input.labCount) badges.push("all-labs");
  if (input.assessmentPassed) badges.push("assessment-passed");
  if (input.certified) badges.push("certified");
  return badges;
}

export function getOrbitCourseRequirements(slug: string) {
  return orbitCourseRequirements[slug as OrbitCourseSlug] ?? null;
}

export function getOrbitLabMetadata(slug: string, labIndex: number) {
  const course = getOrbitCourseRequirements(slug);
  if (!course || labIndex < 0 || labIndex >= course.labCount) return null;
  const activatedCourse = activatedCatalogCourses.find((item) => item.slug === slug);
  const consultoriaCourse = consultoriaCourses.find((item) => item.slug === slug);
  const lab = activatedCourse?.labsList[labIndex] ?? consultoriaCourse?.labsList[labIndex];
  return {
    courseTitle: course.title,
    labTitle: lab?.title ?? `Laboratório guiado ${labIndex + 1}`,
    objective: lab?.objective ?? "Prática orientada e validada em ambiente educacional seguro.",
  };
}
