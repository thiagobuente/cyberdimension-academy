import { activatedCatalogCourses } from "@shared/activatedCatalogCourses";
import { consultoriaCourses } from "@shared/consultoriaCourses";
import type { ExternalContentReference } from "@shared/contentProvenance";

export type StarterCourseSlug = "fundamentos-ti" | "fundamentos-cyber-security" | "redes-para-cyber-security" | "linux-para-operacoes-de-seguranca" | (typeof activatedCatalogCourses)[number]["slug"] | (typeof consultoriaCourses)[number]["slug"];

export type StarterCourse = {
  slug: StarterCourseSlug;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  level: "Iniciante" | "Fundamental" | "Intermediário" | "Avançado";
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

const orbitStarterCourses: StarterCourse[] = [
  {
    slug: "fundamentos-ti",
    code: "ORBIT-01",
    title: "Fundamentos de TI para Segurança",
    shortTitle: "Fundamentos de TI",
    description: "A base prática para quem quer entrar em tecnologia e construir segurança com contexto, não por memorização.",
    level: "Iniciante",
    duration: "18 horas",
    lessons: 32,
    labs: 4,
    quizCount: 60,
    accent: "cyan",
    icon: "cpu",
    focus: "Computação, sistemas, redes, virtualização e colaboração técnica.",
    outcomes: ["Entender como computadores, sistemas operacionais e redes se conectam.", "Usar terminal, Git e virtualização para montar uma rotina técnica segura.", "Chegar preparado para os cursos de Cyber Security, Redes e Linux."],
    modules: [
      { title: "Como a computação funciona", lessons: 6, description: "Hardware, software, armazenamento e processos." },
      { title: "Sistemas operacionais", lessons: 7, description: "Windows, Linux, permissões e organização de arquivos." },
      { title: "Conexões que movem a internet", lessons: 8, description: "TCP/IP, DNS, HTTP/HTTPS e fundamentos de rede." },
      { title: "Seu ambiente de prática", lessons: 6, description: "VirtualBox, Docker, linha de comando e segurança básica." },
      { title: "Colaboração técnica", lessons: 5, description: "Git, GitHub e documentação de atividades." },
    ],
    labsList: [
      { title: "Monte seu laboratório local", description: "Planeje uma máquina virtual com checklist de recursos e rede.", objective: "Validar os recursos mínimos e o isolamento de rede antes de iniciar os estudos.", command: "verificar ambiente --vm --rede-isolada", output: "VM: pronta\nRAM: 4096 MB\nRede: NAT isolada\nStatus: ambiente seguro para prática" },
      { title: "Diagnóstico de conectividade", description: "Interprete DNS, IP e HTTP em um cenário guiado.", objective: "Seguir a sequência correta de diagnóstico sem alterar a infraestrutura.", command: "diagnosticar --dns academy.local --http", output: "IP local: 192.168.56.10\nDNS: academy.local -> 10.10.5.20\nHTTP: 200 OK\nConclusão: conectividade operacional" },
      { title: "Primeiros comandos", description: "Use CMD e Bash para navegar, inspecionar e documentar o ambiente.", objective: "Praticar descoberta não destrutiva de arquivos e diretórios.", command: "listar --diretorio /home/estudante --detalhes", output: "drwxr-xr-x notas\ndrwxr-xr-x laboratorios\n-rw-r--r-- checklist.md\nNenhum arquivo alterado." },
      { title: "Projeto de repositório", description: "Registre sua evolução técnica em um repositório de estudo.", objective: "Preparar uma estrutura de documentação reproduzível para os próximos laboratórios.", command: "iniciar-repositorio --nome cyber-notes", output: "Repositório criado: cyber-notes\nREADME.md adicionado\nEstrutura de anotações validada\nPronto para documentar evidências." },
    ],
    assessment: "Simulado de fundamentos e checklist de laboratório pessoal.",
  },
  {
    slug: "fundamentos-cyber-security",
    code: "ORBIT-02",
    title: "Fundamentos de Cyber Security",
    shortTitle: "Fundamentos de Cyber",
    description: "Aprenda a pensar como um profissional de segurança: ativos, riscos, controles, identidade e resposta.",
    level: "Fundamental",
    duration: "20 horas",
    lessons: 36,
    labs: 4,
    quizCount: 70,
    accent: "purple",
    icon: "shield",
    focus: "Princípios de segurança, risco, criptografia, identidade, privacidade e frameworks.",
    outcomes: ["Explicar CIA Triad, risco e controles em cenários reais.", "Diferenciar criptografia, hashes, PKI, certificados e MFA.", "Usar NIST e MITRE ATT&CK como linguagem de análise e defesa."],
    modules: [
      { title: "Pensamento de segurança", lessons: 7, description: "CIA Triad, ativos, ameaças, vulnerabilidades e controles." },
      { title: "Risco e pessoas", lessons: 6, description: "Gestão de risco, engenharia social e cultura de segurança." },
      { title: "Protegendo dados e identidades", lessons: 9, description: "Criptografia, hashes, PKI, certificados, IAM e MFA." },
      { title: "Governança e privacidade", lessons: 7, description: "LGPD, políticas, ISO 27001 e NIST." },
      { title: "Entendendo adversários", lessons: 7, description: "MITRE ATT&CK, Cyber Kill Chain e leitura de cenários." },
    ],
    labsList: [
      { title: "Mapa de riscos", description: "Classifique ativos e proponha controles para uma empresa simulada.", objective: "Priorizar riscos de acordo com impacto e probabilidade.", command: "avaliar-risco --ativo banco-clientes --cenario vazamento", output: "Ativo: banco-clientes\nImpacto: alto\nProbabilidade: média\nTratamento sugerido: MFA + criptografia + backup testado" },
      { title: "Análise de phishing", description: "Identifique sinais de engenharia social em mensagens fictícias.", objective: "Reconhecer indicadores de mensagem suspeita sem abrir anexos ou links.", command: "analisar-email --arquivo mensagem-suspeita.eml", output: "Remetente: domínio semelhante detectado\nLink: destino divergente\nUrgência: elevada\nResultado: provável phishing — reportar ao SOC" },
      { title: "Laboratório de identidade", description: "Compare autenticação, autorização, MFA e menor privilégio.", objective: "Aplicar o controle de acesso mínimo a uma conta simulada.", command: "revisar-acesso --usuario analista --perfil leitura", output: "Autenticação: MFA obrigatório\nAutorização: leitura de logs\nPrivilégios excessivos: removidos\nResultado: acesso mínimo aplicado" },
      { title: "Plano de resposta", description: "Transforme um alerta em ações de contenção e comunicação.", objective: "Ordenar ações iniciais de resposta sem comprometer evidências.", command: "orquestrar-resposta --incidente phishing-confirmado", output: "1. Preservar evidências\n2. Conter conta comprometida\n3. Comunicar responsáveis\n4. Registrar lições aprendidas" },
    ],
    assessment: "Simulado contextualizado e mapa de risco com plano de tratamento.",
  },
  {
    slug: "redes-para-cyber-security",
    code: "ORBIT-03",
    title: "Redes para Cyber Security",
    shortTitle: "Redes para Cyber",
    description: "Domine o caminho dos dados para identificar onde segmentar, observar e proteger uma infraestrutura.",
    level: "Fundamental",
    duration: "24 horas",
    lessons: 42,
    labs: 5,
    quizCount: 80,
    accent: "green",
    icon: "network",
    focus: "Endereçamento, switching, routing, controles de acesso, conectividade e troubleshooting.",
    outcomes: ["Interpretar IPv4, IPv6, TCP/IP, DNS e tráfego essencial.", "Explicar VLAN, ACL, NAT, VPN e segmentação como controles de segurança.", "Diagnosticar falhas de conectividade de modo estruturado."],
    modules: [
      { title: "Fundamentos de conectividade", lessons: 8, description: "Camadas, IPv4, IPv6, portas e protocolos." },
      { title: "Switching e segmentação", lessons: 9, description: "Switches, VLAN, STP e limites de broadcast." },
      { title: "Routing e acesso", lessons: 9, description: "Rotas, OSPF, NAT e listas de controle de acesso." },
      { title: "Conectividade moderna", lessons: 8, description: "Wireless, VPN, QoS e serviços de rede." },
      { title: "Troubleshooting seguro", lessons: 8, description: "Método, evidências, logs e documentação de incidentes." },
    ],
    labsList: [
      { title: "Desenhe uma rede segmentada", description: "Separe usuários, servidores e administração com regras claras.", objective: "Definir limites de confiança entre usuários, servidores e administração.", command: "segmentar --vlan usuarios,servidores,admin", output: "VLAN 10: usuários\nVLAN 20: servidores\nVLAN 99: administração\nTráfego entre zonas: restrito por política" },
      { title: "Controle de acesso", description: "Aplique regras de ACL em um cenário de laboratório.", objective: "Permitir somente o tráfego necessário para um serviço publicado.", command: "testar-acl --origem usuarios --destino servidor-web --porta 443", output: "HTTPS/443: permitido\nSSH/22: negado\nRDP/3389: negado\nResultado: política de menor privilégio confirmada" },
      { title: "Rota e tradução", description: "Analise o efeito de NAT e rotas na conectividade.", objective: "Interpretar a rota e identificar onde ocorre a tradução de endereço.", command: "inspecionar-rota --destino 8.8.8.8 --nat", output: "Gateway: 10.10.0.1\nNAT de saída: 203.0.113.10\nRota padrão: ativa\nConectividade externa: disponível" },
      { title: "VPN de cenário", description: "Planeje acesso remoto seguro sem expor serviços internos.", objective: "Validar os controles mínimos de um acesso remoto corporativo.", command: "validar-vpn --mfa --rede-interna", output: "MFA: obrigatório\nTúnel: criptografado\nAcesso: somente rede interna autorizada\nSplit tunneling: desabilitado" },
      { title: "Investigação de falha", description: "Resolva uma cadeia de erros de DNS e conectividade.", objective: "Coletar evidências para localizar a origem da falha de resolução.", command: "investigar-dns --host portal.interno", output: "Consulta primária: timeout\nServidor alternativo: respondeu\nCausa provável: DNS primário indisponível\nAção: registrar e escalar a ocorrência" },
    ],
    assessment: "Simulado técnico e projeto de segmentação documentado.",
    videoLearning: {
      provider: "YouTube",
      label: "Trilha de vídeo complementar: Redes de Computadores",
      attribution: "Vídeos públicos do Hardware Redes Brasil incorporados como material complementar. Os roteiros, capítulos, transcrições de apoio e atividades desta formação são autorais da CyberDimension Academy.",
      sourceUrl: "https://www.youtube.com/playlist?list=PLAp37wMSBouBnNup2tD-mC36JT96vHBZy",
      embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLAp37wMSBouBnNup2tD-mC36JT96vHBZy&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Fluxo de dados e endereçamento", duration: "≈ 18 min", focus: "Relacionar dispositivos, endereços e protocolos ao caminho de uma requisição.", chapters: [{ time: "00:00", title: "Rede como sistema", summary: "Identifique os elementos que cooperam para transportar dados." }, { time: "06:00", title: "Endereçamento", summary: "Diferencie endereço físico, IP, gateway e resolução de nomes." }, { time: "13:00", title: "Portas e contexto", summary: "Conecte portas a serviços e à superfície de exposição." }], transcript: [{ time: "00:00", text: "Uma rede permite que hosts troquem dados por caminhos e regras definidos." }, { time: "06:00", text: "Endereços IP identificam a interface lógica; o gateway encaminha tráfego entre redes." }, { time: "13:00", text: "Portas ajudam a diferenciar serviços e orientam políticas de filtragem." }] },
        { moduleIndex: 2, title: "Rotas, NAT e controle de acesso", duration: "≈ 20 min", focus: "Entender como uma decisão de rota e uma política de acesso influenciam a proteção.", chapters: [{ time: "00:00", title: "Decisão de rota", summary: "Observe como a tabela de rotas escolhe o próximo salto." }, { time: "07:00", title: "NAT em contexto", summary: "Diferencie tradução de endereços de um controle de segurança completo." }, { time: "14:00", title: "Regras mínimas", summary: "Use ACLs para permitir somente o fluxo necessário entre zonas." }], transcript: [{ time: "00:00", text: "Roteadores encaminham pacotes a partir de rotas conhecidas e da rota padrão." }, { time: "07:00", text: "NAT modifica endereços no caminho, mas não substitui segmentação e regras explícitas." }, { time: "14:00", text: "Uma ACL bem desenhada começa pelo fluxo necessário e registra as exceções." }] },
        { moduleIndex: 4, title: "Troubleshooting com evidências", duration: "≈ 19 min", focus: "Aplicar uma sequência de diagnóstico que preserve evidências e evite mudanças precipitadas.", chapters: [{ time: "00:00", title: "Hipótese e escopo", summary: "Defina o sintoma, o impacto e o que já é conhecido." }, { time: "06:00", title: "Testes seguros", summary: "Colete sinais de DNS, rota e conectividade sem alterar a infraestrutura." }, { time: "13:00", title: "Registro e escala", summary: "Documente a evidência para que outra pessoa possa reproduzir o diagnóstico." }], transcript: [{ time: "00:00", text: "Diagnosticar bem começa por delimitar o que falhou e quem foi afetado." }, { time: "06:00", text: "Testes de resolução, latência e rota ajudam a isolar o domínio do problema." }, { time: "13:00", text: "Evidências datadas e contexto claro tornam a escalada mais objetiva." }] },
      ],
    },
  },
  {
    slug: "linux-para-operacoes-de-seguranca",
    code: "ORBIT-04",
    title: "Linux para Operações de Segurança",
    shortTitle: "Linux para Segurança",
    description: "Construa fluência em terminal, serviços, logs e hardening para atuar com confiança em operações de segurança.",
    level: "Fundamental",
    duration: "22 horas",
    lessons: 38,
    labs: 5,
    quizCount: 70,
    accent: "blue",
    icon: "terminal",
    focus: "Bash, processos, serviços, SSH, firewall, logs, agendamento e hardening.",
    outcomes: ["Navegar e operar o terminal Linux com segurança.", "Inspecionar processos, serviços e logs relevantes para defesa.", "Aplicar controles básicos de hardening e documentar alterações."],
    modules: [
      { title: "Terminal com propósito", lessons: 8, description: "Navegação, arquivos, permissões, pipes e busca de informação." },
      { title: "Processos e serviços", lessons: 7, description: "Processos, systemd, contas e superfícies de exposição." },
      { title: "Acesso e rede", lessons: 8, description: "SSH, chaves, firewall e princípios de acesso remoto." },
      { title: "Observabilidade", lessons: 7, description: "Logs, auditoria, sinais de falha e coleta responsável." },
      { title: "Automação e hardening", lessons: 8, description: "Cron, scripts Bash seguros e checklist de endurecimento." },
    ],
    labsList: [
      { title: "Trilha de comandos", description: "Pratique descoberta e manipulação segura de arquivos.", objective: "Encontrar informações úteis no sistema sem modificar dados.", command: "find /var/log -type f --recentes", output: "/var/log/auth.log\n/var/log/syslog\n/var/log/nginx/access.log\nModo: somente leitura" },
      { title: "Serviço sob observação", description: "Inspecione processos e um serviço de laboratório.", objective: "Identificar o estado de um serviço e seus processos associados.", command: "systemctl status nginx --resumo", output: "nginx.service: active (running)\nProcessos: 3\nPorta escutada: 443\nSem falhas críticas no período" },
      { title: "Acesso SSH protegido", description: "Aplique chaves e controles de acesso a uma máquina simulada.", objective: "Revisar uma configuração de acesso remoto baseada em chaves.", command: "auditar-ssh --chaves --sem-senha", output: "PasswordAuthentication: no\nPermitRootLogin: no\nChave Ed25519: presente\nAcesso remoto: endurecido" },
      { title: "Leitura de logs", description: "Encontre eventos relevantes em registros de sistema.", objective: "Localizar tentativas de acesso que exigem investigação adicional.", command: "filtrar-log --evento ssh-falha --ultimas 24h", output: "Falhas de autenticação: 5\nIPs distintos: 2\nConta alvo: analyst\nPróximo passo: correlacionar com alerta de rede" },
      { title: "Hardening base", description: "Produza um checklist de configuração para um servidor de treino.", objective: "Verificar controles básicos de endurecimento antes de liberar um servidor.", command: "validar-hardening --perfil basico", output: "Atualizações: aplicadas\nFirewall: ativo\nSSH: endurecido\nLogs: centralização configurada\nResultado: checklist aprovado" },
    ],
    assessment: "Simulado de operações e relatório de hardening de laboratório.",
    videoLearning: {
      provider: "YouTube",
      label: "Trilha de vídeo complementar: Linux — Primeiros Passos",
      attribution: "Vídeos públicos do Curso em Vídeo incorporados como material complementar. Os roteiros, capítulos, transcrições de apoio e atividades desta formação são autorais da CyberDimension Academy.",
      sourceUrl: "https://www.youtube.com/playlist?list=PLHz_AreHm4dlIXleu20uwPWFOSswqLYbV",
      embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLHz_AreHm4dlIXleu20uwPWFOSswqLYbV&rel=0",
      sessions: [
        { moduleIndex: 0, title: "Terminal, arquivos e permissões", duration: "≈ 20 min", focus: "Construir segurança operacional ao navegar, consultar e proteger arquivos no terminal.", chapters: [{ time: "00:00", title: "Ambiente e diretórios", summary: "Reconheça diretórios essenciais e navegue sem alterar dados." }, { time: "07:00", title: "Leitura e busca", summary: "Use consulta e filtros para localizar informação com segurança." }, { time: "14:00", title: "Permissões", summary: "Interprete dono, grupo e modos de acesso antes de propor mudanças." }], transcript: [{ time: "00:00", text: "O terminal permite observar e operar sistemas com precisão quando há contexto e cuidado." }, { time: "07:00", text: "Comandos de leitura e busca reduzem a necessidade de alterações durante a investigação." }, { time: "14:00", text: "Permissões limitam ações por usuário e grupo e fazem parte do menor privilégio." }] },
        { moduleIndex: 2, title: "Acesso remoto e serviços", duration: "≈ 18 min", focus: "Relacionar chaves, SSH e serviços a uma superfície de acesso administrável.", chapters: [{ time: "00:00", title: "Serviços essenciais", summary: "Veja como serviços escutam portas e precisam de inventário." }, { time: "06:00", title: "SSH com chaves", summary: "Entenda por que chaves e a restrição de root fortalecem acesso remoto." }, { time: "12:00", title: "Firewall e exposição", summary: "Permita apenas os fluxos necessários ao serviço documentado." }], transcript: [{ time: "00:00", text: "Cada serviço ativo aumenta a responsabilidade de acompanhar portas, versão e finalidade." }, { time: "06:00", text: "Chaves SSH e a desativação de autenticação por senha reduzem superfícies comuns de ataque." }, { time: "12:00", text: "Um firewall usa regras explícitas para limitar tráfego de entrada e saída." }] },
        { moduleIndex: 4, title: "Rotina de hardening", duration: "≈ 22 min", focus: "Transformar controles de atualização, logs e configuração em um checklist verificável.", chapters: [{ time: "00:00", title: "Baseline", summary: "Estabeleça uma configuração esperada antes de procurar desvios." }, { time: "08:00", title: "Atualizações e logs", summary: "Mantenha correções e telemetria como parte da rotina operacional." }, { time: "15:00", title: "Automação responsável", summary: "Automatize tarefas repetitivas com revisão, registro e escopo limitado." }], transcript: [{ time: "00:00", text: "Hardening é a redução contínua de exposição por meio de escolhas documentadas." }, { time: "08:00", text: "Atualizações reduzem vulnerabilidades conhecidas, enquanto logs apoiam detecção e resposta." }, { time: "15:00", text: "Automação segura usa testes, controle de versão e limites claros de execução." }] },
      ],
    },
  },
];

export const starterCourses: StarterCourse[] = orbitStarterCourses;
export const functionalCourses: StarterCourse[] = [...orbitStarterCourses, ...activatedCatalogCourses, ...consultoriaCourses];

export function getStarterCourse(slug: string) {
  return functionalCourses.find((course) => course.slug === slug);
}
