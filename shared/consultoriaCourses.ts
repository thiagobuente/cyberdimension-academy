import type { ActivatedCatalogCourse } from "./activatedCatalogCourses";

/**
 * Nova onda de cursos da consultoria acadêmica (17/08):
 * AI Security Fundamentals, AI Red Team, AI Security & Governance,
 * IT Fundamentals for Cybersecurity, Network Traffic Analysis with Wireshark,
 * Identity & Access Management, Security Awareness & Social Engineering.
 *
 * Padrão pedagógico Cyberdimension em 7 etapas:
 * Aprenda → Pratique → Teste → Desafie-se → Projeto → Avalie-se → Certifique-se.
 * O conteúdo detalhado (módulos, laboratórios, questões) é produzido pela própria academia.
 */
export const consultoriaCourseSlugs = [
  "ai-security-fundamentals",
  "ai-red-team",
  "ai-security-governance",
  "it-fundamentals-cybersecurity",
  "wireshark-traffic-analysis",
  "identity-access-management",
  "security-awareness-social-engineering",
  "gestao-projetos-seguranca-cibernetica",
] as const satisfies readonly string[];

export const consultoriaCourses = [
  {
    slug: "ai-security-fundamentals", code: "AI-SEC-01", title: "AI Security Fundamentals", shortTitle: "AI Security", level: "Iniciante", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "green", icon: "cpu",
    description: "Fundamentos de IA e LLMs, riscos de segurança em sistemas inteligentes, prompt injection, jailbreaks, data leakage e o OWASP Top 10 for LLM Applications.", focus: "Compreender os riscos de segurança específicos da era da IA antes de se especializar.",
    outcomes: ["Explicar como LLMs funcionam e onde surgem riscos de segurança.", "Identificar prompt injection, jailbreak e data leakage em cenários guiados.", "Aplicar o OWASP Top 10 for LLM Applications a sistemas reais.", "Entender governança básica de uso de IA nas organizações."],
    modules: [
      { title: "IA e LLMs na prática", lessons: 4, description: "Como funcionam modelos, tokens, contexto e onde a IA aparece no dia a dia corporativo." },
      { title: "Riscos de segurança em IA", lessons: 4, description: "Prompt injection, jailbreaks, data leakage, alucinação e abuso de modelo." },
      { title: "OWASP Top 10 for LLM e governança básica", lessons: 4, description: "As dez principais vulnerabilidades de aplicações com LLM e políticas de uso responsável." },
    ],
    labsList: [
      { title: "Caça ao prompt injection", description: "Analise diálogos simulados e identifique tentativas de injeção de instrução.", objective: "Reconhecer padrões de injection direto e indireto sem executar o ataque em sistemas reais.", command: "classificar-dialogo --entrada conversa-lab.txt --tipo injection", output: "Mensagens analisadas: 12\nInjection detectado: 3 (direto: 2, indireto: 1)\nConfiança: alta\nPróximo passo: registrar padrão no playbook de defesa" },
      { title: "Inventário de riscos de IA", description: "Mapeie riscos de um sistema simulado que usa LLM com dados sensíveis.", objective: "Relacionar riscos do OWASP LLM Top 10 aos controles existentes.", command: "mapear-riscos-ia --sistema assistente-virtual --dados pessoais", output: "Riscos mapeados: 6\nCríticos: data leakage, injection indireto\nControles existentes: 2\nLacunas: filtro de saída, monitoramento de uso" },
    ],
    assessment: "Avaliação de riscos de IA, LLMs, OWASP Top 10 for LLM e governança básica.",
    assessmentQuestions: [
      { id: "ai-1", prompt: "Prompt injection ocorre quando:", options: ["Um modelo lê instruções maliciosas como se fossem legítimas", "O modelo gera texto longo", "O token expira", "O usuário esquece a senha"], correctAnswer: 0, explanation: "Injection acontece quando instruções embutidas no conteúdo enganam o modelo." },
      { id: "ai-2", prompt: "Data leakage em sistemas de IA significa:", options: ["Exposição de dados sensíveis pela resposta ou pelo treinamento do modelo", "Download rápido de dados", "Criptografia forte", "Backup redundante"], correctAnswer: 0, explanation: "Vazamento de dados pode ocorrer quando o modelo reproduz informações protegidas." },
      { id: "ai-3", prompt: "Jailbreak é uma tentativa de:", options: ["Fazer o modelo ignorar suas restrições de segurança", "Atualizar o firmware", "Mudar a interface", "Reduzir o consumo de energia"], correctAnswer: 0, explanation: "Jailbreak busca contornar as guardrails definidas pelo provedor do modelo." },
      { id: "ai-4", prompt: "O OWASP Top 10 for LLM Applications é:", options: ["Uma lista das vulnerabilidades mais relevantes em aplicações que usam LLMs", "Um antivírus", "Um banco de dados", "Um sistema operacional"], correctAnswer: 0, explanation: "Ele orienta times sobre os riscos prioritários a tratar em sistemas com IA." },
      { id: "ai-5", prompt: "Uma política de uso responsável de IA deve incluir:", options: ["Limites de dados, aprovação humana e monitoramento de uso", "Acesso irrestrito a tudo", "Proibição total de IA", "Ignorar logs"], correctAnswer: 0, explanation: "Governança equilibra uso produtivo com controles e supervisão adequados." },
    ],
  },
  {
    slug: "ai-red-team", code: "AI-RT-01", title: "AI Red Team", shortTitle: "AI Red Team", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "green", icon: "terminal",
    description: "Testes de segurança de LLMs autorizados, prompt injection em laboratório, data exfiltration em ambientes controlados, avaliação de agentes e segurança de RAG.", focus: "Avaliar sistemas de IA com método, escopo e responsabilidade em ambientes isolados.",
    outcomes: ["Planejar testes de segurança de LLM com escopo e autorização definidos.", "Aplicar técnicas de injection em laboratório para validar defesas.", "Avaliar riscos de sistemas RAG e agentes de IA.", "Relatar achados de forma responsável para fortalecimento da defesa."],
    modules: [
      { title: "Red teaming de IA: método e escopo", lessons: 4, description: "Autorização, limites, ambiente isolado e ética dos testes com modelos de IA." },
      { title: "Injection, exfiltration e agentes", lessons: 4, description: "Técnicas guiadas em laboratório: injeção direta e indireta, extração de dados e abuso de agentes." },
      { title: "Segurança de RAG e relatório de achados", lessons: 4, description: "Riscos de sistemas de retrieval-augmented generation e comunicação responsável dos resultados." },
    ],
    labsList: [
      { title: "Injection controlada em laboratório", description: "Execute casos de teste predefinidos contra um modelo simulado para validar filtros.", objective: "Medir quantos padrões de injection os filtros de defesa detectam.", command: "testar-filtros --ambiente isolado --casos 20", output: "Casos executados: 20\nFiltros acionados: 17\nFalhas a corrigir: 3\nRelatório: salvo para revisão defensiva" },
      { title: "Avaliação de um sistema RAG simulado", description: "Analise o comportamento de um assistente com base de conhecimento simulada.", objective: "Identificar riscos de contexto não autorizado e recuperação insegura.", command: "avaliar-rag --fonte base-simulada --verificar isolacao", output: "Riscos identificados: 4\nContexto não autorizado: 2\nRecomendação: revisar filtros de retrieval e limites de contexto" },
    ],
    assessment: "Avaliação de testes autorizados de LLMs, agentes, RAG e relatório responsável.",
    assessmentQuestions: [
      { id: "airt-1", prompt: "O que define um teste de red teaming responsável de IA?", options: ["Autorização, escopo e ambiente isolado", "Testar em produção sem aviso", "Invadir sistemas reais", "Coletar dados de clientes"], correctAnswer: 0, explanation: "Toda simulação ofensiva exige autorização explícita e isolamento." },
      { id: "airt-2", prompt: "Ao avaliar um sistema RAG, um risco comum é:", options: ["Retrieval de documentos fora do escopo autorizado", "Máquina lenta", "Fonte de luz excessiva", "Falta de emojis"], correctAnswer: 0, explanation: "Contextos indevidos podem expor informações não autorizadas ao modelo." },
      { id: "airt-3", prompt: "Data exfiltration controlada em laboratório serve para:", options: ["Validar se defesas detectam tentativas de extração", "Roubar dados reais", "Desativar backups", "Apagar logs"], correctAnswer: 0, explanation: "Testes controlados medem a eficácia das defesas sem expor dados reais." },
      { id: "airt-4", prompt: "Agentes de IA exigem atenção extra porque:", options: ["Podem executar ações externas com autonomia", "São sempre inseguros", "Não usam rede", "Só geram texto estático"], correctAnswer: 0, explanation: "A autonomia de ação amplia a superfície de risco e exige limites claros." },
      { id: "airt-5", prompt: "Um relatório responsável de red teaming de IA deve:", options: ["Documentar método, achados e recomendações defensivas", "Publicar exploits na internet", "Ocultar falhas críticas", "Ignorar o escopo autorizado"], correctAnswer: 0, explanation: "O objetivo final é fortalecer a defesa, não expor vulnerabilidades indevidamente." },
    ],
  },
  {
    slug: "ai-security-governance", code: "AI-GOV-01", title: "AI Security & Governance", shortTitle: "AI Governance", level: "Avançado", duration: "18 horas", lessons: 15, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "AI Risk Management, governança, controles, segurança de dados, políticas de uso de IA e o NIST AI RMF aplicados a programas de segurança.", focus: "Estruturar governança de IA corporativa com risco mensurável e controles auditáveis.",
    outcomes: ["Aplicar o NIST AI RMF (Govern, Map, Measure, Manage) a um programa real.", "Desenhar controles e políticas de uso de IA alinhados a dados sensíveis.", "Medir e comunicar riscos de IA para decisões executivas.", "Integrar governança de IA à governança geral de segurança."],
    modules: [
      { title: "NIST AI RMF e mapeamento de riscos", lessons: 5, description: "As quatro funções do RMF aplicadas a sistemas de IA com dados críticos." },
      { title: "Controles e políticas de uso de IA", lessons: 5, description: "Políticas, aprovação, classificação de dados e limites de uso por área." },
      { title: "Medição, auditoria e melhoria contínua", lessons: 5, description: "Métricas de risco, auditoria de modelos e evolução do programa de IA." },
    ],
    labsList: [
      { title: "Mapa de riscos de IA corporativa", description: "Construa um inventário de sistemas de IA de uma empresa fictícia com níveis de risco.", objective: "Priorizar ações com base em impacto e probabilidade.", command: "mapear-inventario-ia --empresa ficticia-corp --aprovado", output: "Sistemas inventariados: 9\nRisco alto: 2 (RH-analytica, atendimento-LLM)\nAções prioritárias: 5\nStatus: encaminhado à governança" },
      { title: "Política de uso de IA", description: "Redija seções de uma política corporativa de IA com aprovação simulada.", objective: "Definir dados permitidos, ferramentas aprovadas e responsabilidades.", command: "redigir-politica --escopo uso-interno --dados classificacao", output: "Seções redigidas: 6\nDados proibidos sem aprovação: PII e registros médicos\nFerramentas aprovadas: 3\nComitê revisor: constituído" },
    ],
    assessment: "Avaliação de governança de IA, NIST AI RMF, controles e políticas.",
    assessmentQuestions: [
      { id: "aigov-1", prompt: "As quatro funções do NIST AI RMF são:", options: ["Govern, Map, Measure e Manage", "Scan, Fix, Deploy, Sleep", "Codar, Testar, Publicar", "Vender, Comprar, Trocar"], correctAnswer: 0, explanation: "Govern governança, Map mapeamento, Measure medição e Manage gestão." },
      { id: "aigov-2", prompt: "Uma política de uso de IA deve definir:", options: ["Quais dados podem ser usados e por quais ferramentas", "Que todos podem usar qualquer IA", "Que IA é proibida para sempre", "Nada, é opcional"], correctAnswer: 0, explanation: "Classificação de dados e ferramentas aprovadas são o núcleo da política." },
      { id: "aigov-3", prompt: "Medir riscos de IA permite:", options: ["Priorizar controles e comunicar riscos à diretoria", "Eliminar todos os riscos", "Ignorar auditorias", "Acelerar deploy sem revisão"], correctAnswer: 0, explanation: "Métricas sustentam decisões e melhoria contínua do programa." },
      { id: "aigov-4", prompt: "Governança de IA deve se integrar a:", options: ["Governança geral de segurança e privacidade", "Nenhum outro processo", "Somente TI", "Somente RH"], correctAnswer: 0, explanation: "IA afeta segurança, privacidade, jurídico e negócio simultaneamente." },
      { id: "aigov-5", prompt: "Auditoria de modelos de IA verifica:", options: ["Conformidade, risco e eficácia dos controles", "Velocidade da internet", "Cores da interface", "Horários de almoço"], correctAnswer: 0, explanation: "Auditoria valida se os controles definidos estão funcionando na prática." },
    ],
  },
  {
    slug: "it-fundamentals-cybersecurity", code: "IT-FUND-01", title: "IT Fundamentals for Cybersecurity", shortTitle: "Fundamentos de TI", level: "Iniciante", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "cpu",
    description: "Hardware, sistemas operacionais, processos, arquivos, virtualização, redes, servidores, Active Directory, cloud e containers: a infraestrutura que toda segurança protege.", focus: "Entender a infraestrutura antes de protegê-la — a base que reduz a dificuldade de todos os cursos seguintes.",
    outcomes: ["Explicar como hardware, SO e virtualização sustentam aplicações.", "Compreender redes, servidores e identidade corporativa (AD).", "Diferenciar cloud e containers e suas responsabilidades.", "Aplicar troubleshooting básico para resolver problemas com método."],
    modules: [
      { title: "Máquinas, sistemas e arquivos", lessons: 5, description: "Hardware, sistemas operacionais, processos, arquivos e permissões essenciais." },
      { title: "Redes, servidores e identidade", lessons: 5, description: "TCP/IP, DNS, DHCP, servidores e Active Directory no dia a dia corporativo." },
      { title: "Virtualização, cloud e containers", lessons: 4, description: "VMs, nuvem (IaaS/PaaS/SaaS), containers e troubleshooting com método." },
    ],
    labsList: [
      { title: "Inventário de infraestrutura", description: "Levante os ativos de uma empresa fictícia: estações, servidores e serviços.", objective: "Construir a base de qualquer programa de segurança: saber o que existe.", command: "inventariar-ativos --empresa ficticia-ltda --formato relatorio", output: "Estações: 42\nServidores: 6\nServiços críticos: DNS, AD, e-mail\nLacuna: inventário de impressoras pendente" },
      { title: "Troubleshooting guiado", description: "Resolva incidentes simulados seguindo método: observar, isolar, corrigir, documentar.", objective: "Aplicar o ciclo de troubleshooting a problemas reais de conectividade.", command: "resolver-incidente --caso sem-internet --metodo ciclico", output: "Causa raiz: DNS com falha\nCorreção aplicada: servidor secundário ativado\nTempo total: 38 min\nDocumentação: registrada" },
    ],
    assessment: "Avaliação de infraestrutura de TI: hardware, SO, redes, AD, cloud e troubleshooting.",
    assessmentQuestions: [
      { id: "it-1", prompt: "Um processo no sistema operacional é:", options: ["Um programa em execução com recursos alocados", "Um documento impresso", "Um tipo de cabo", "Uma senha"], correctAnswer: 0, explanation: "Processos são instâncias de programas que o SO gerencia em execução." },
      { id: "it-2", prompt: "O Active Directory é usado principalmente para:", options: ["Gerenciar identidades, grupos e políticas em redes corporativas", "Editar vídeos", "Jogar online", "Imprimir fotos"], correctAnswer: 0, explanation: "AD centraliza autenticação e autorização das contas corporativas." },
      { id: "it-3", prompt: "Em cloud, o modelo IaaS significa:", options: ["Infraestrutura como serviço", "Internet a serviço", "Interface avançada simples", "Identidade automatizada"], correctAnswer: 0, explanation: "IaaS fornece máquinas, rede e armazenamento gerenciados pelo provedor." },
      { id: "it-4", prompt: "Containers diferem de máquinas virtuais porque:", options: ["Compartilham o kernel do host e são mais leves", "São mais pesados", "Não usam Linux", "Exigem monitor físico"], correctAnswer: 0, explanation: "Containers compartilham o kernel, tornando o empacotamento mais ágil." },
      { id: "it-5", prompt: "O primeiro passo do troubleshooting é:", options: ["Observar e coletar informações sobre o problema", "Reinstalar tudo imediatamente", "Desligar a rede", "Culpar o usuário"], correctAnswer: 0, explanation: "Diagnóstico começa pela observação antes de qualquer correção." },
    ],
  },
  {
    slug: "wireshark-traffic-analysis", code: "WIRE-01", title: "Network Traffic Analysis with Wireshark", shortTitle: "Wireshark", level: "Intermediário", duration: "14 horas", lessons: 12, labs: 2, quizCount: 5, accent: "cyan", icon: "network",
    description: "Captura de tráfego, TCP, UDP, DNS, HTTP, TLS e ARP: análise de PCAP para identificar comportamento suspeito e investigar incidentes.", focus: "Ler o tráfego da rede como um analista de Blue Team.",
    outcomes: ["Capturar e filtrar tráfego de rede com método.", "Analisar TCP, UDP, DNS, HTTP e TLS em capturas reais de laboratório.", "Identificar comportamento suspeito em PCAPs.", "Produzir um relatório de incidente baseado em evidências de tráfego."],
    modules: [
      { title: "Captura e filtros essenciais", lessons: 4, description: "Interfaces, captura responsável e filtros de exibição que economizam horas." },
      { title: "Protocolos na prática", lessons: 4, description: "TCP handshakes, DNS, HTTP e TLS: o que observar e o que significa." },
      { title: "Investigação de incidente com PCAP", lessons: 4, description: "Do alerta ao relatório: identificar exfiltração, C2 e abuso de protocolo." },
    ],
    labsList: [
      { title: "Caça ao tráfego suspeito", description: "Analise um PCAP de laboratório e separe tráfego normal de anômalo.", objective: "Aplicar filtros para encontrar comunicação não esperada.", command: "filtrar-pcap --arquivo captura-lab.pcap --filtro suspeito", output: "Pacotes analisados: 12.408\nConexões anômalas: 2\nDestino externo suspeito: 198.51.100.7:4444\nStatus: escalado para triagem" },
      { title: "Relatório de incidente de rede", description: "Produza um relatório a partir de uma captura de incidente simulado.", objective: "Documentar linha do tempo, indicadores e recomendações.", command: "gerar-relatorio --caso exfiltracao-dns --formato pdf", output: "Linha do tempo: 6 eventos\nIOCs: 1 IP, 2 domínios\nRecomendação: bloqueio e monitoramento\nRelatório: entregue" },
    ],
    assessment: "Avaliação de análise de tráfego, protocolos e investigação com PCAP.",
    assessmentQuestions: [
      { id: "wire-1", prompt: "O handshake TCP inicial envolve:", options: ["SYN, SYN-ACK, ACK", "PING, PONG, DONE", "GET, POST, PUT", "START, STOP, END"], correctAnswer: 0, explanation: "O three-way handshake estabelece a conexão TCP entre cliente e servidor." },
      { id: "wire-2", prompt: "Um filtro de exibição típico no Wireshark para DNS é:", options: ["dns", "tcp == 80", "http.host", "arp"], correctAnswer: 0, explanation: "O filtro dns mostra apenas pacotes e conversas do protocolo DNS." },
      { id: "wire-3", prompt: "Um pico de requisições DNS para domínios aleatórios pode indicar:", options: ["DNS tunneling ou exfiltração de dados", "Internet rápida", "Backup normal", "Atualização do sistema"], correctAnswer: 0, explanation: "Padrões incomuns de DNS são um sinal clássico de exfiltração." },
      { id: "wire-4", prompt: "TLS impede que um observador externo:", options: ["Leia o conteúdo criptografado da sessão", "Veja os endereços IP", "Conte os pacotes", "Desligue o roteador"], correctAnswer: 0, explanation: "TLS cifra o conteúdo, embora metadados (IPs, volumes) permaneçam visíveis." },
      { id: "wire-5", prompt: "Um relatório de incidente baseado em PCAP deve conter:", options: ["Linha do tempo, IOCs, evidências e recomendações", "Apenas prints de tela", "Opiniões sem dados", "Somente o nome do autor"], correctAnswer: 0, explanation: "Evidências datadas e indicadores acionáveis sustentam a resposta." },
    ],
  },
  {
    slug: "identity-access-management", code: "IAM-01", title: "Identity & Access Management", shortTitle: "IAM", level: "Intermediário", duration: "16 horas", lessons: 14, labs: 2, quizCount: 5, accent: "blue", icon: "shield",
    description: "Autenticação, autorização, MFA, RBAC, ABAC, SSO, federação, OAuth, OpenID Connect, SAML, acesso privilegiado e governança de identidade.", focus: "A identidade é o novo perímetro: controle de acesso sólido em toda a organização.",
    outcomes: ["Diferenciar autenticação, autorização e federação.", "Projetar controle de acesso com RBAC e ABAC.", "Integrar aplicações com OAuth, OIDC e SAML.", "Governar acesso privilegiado e o ciclo de vida de identidades."],
    modules: [
      { title: "Autenticação forte e autorização", lessons: 5, description: "MFA, senhas, RBAC, ABAC e o princípio do menor privilégio." },
      { title: "SSO, federação e protocolos", lessons: 5, description: "OAuth 2.0, OpenID Connect, SAML e federação entre organizações." },
      { title: "Acesso privilegiado e governança de identidade", lessons: 4, description: "PAM, revisão de acessos, ciclo de vida (joiner-mover-leaver) e IGA." },
    ],
    labsList: [
      { title: "Desenho de matriz de acessos", description: "Construa uma matriz de funções e permissões para uma empresa fictícia.", objective: "Aplicar menor privilégio e separação de funções.", command: "desenhar-matriz --empresa ficticia --funcoes 6 --verificar separacao", output: "Funções: 6\nPermissões atribuídas: 34\nViolações de separação: 0\nStatus: pronto para aprovação" },
      { title: "Fluxo OAuth/OIDC simulado", description: "Siga o fluxo de autorização e descubra onde controles falham.", objective: "Entender tokens, escopos e validação de identidade federada.", command: "simular-oauth --fluxo codigo --verificar escopos", output: "Fluxo: authorization code\nEscopos solicitados: 3\nToken validado: sim\nObservação: expiração de refresh configurada" },
    ],
    assessment: "Avaliação de identidade, protocolos de federação e governança de acessos.",
    assessmentQuestions: [
      { id: "iam-1", prompt: "Autenticação responde à pergunta:", options: ["Quem é você?", "O que você pode fazer?", "Onde está o servidor?", "Quanto custa?"], correctAnswer: 0, explanation: "Autenticação verifica identidade; autorização define permissões." },
      { id: "iam-2", prompt: "RBAC atribui permissões com base em:", options: ["Funções organizacionais do usuário", "Cor do crachá", "Horário do almoço", "Tamanho da fonte"], correctAnswer: 0, explanation: "Funções (roles) agrupam permissões de forma gerenciável." },
      { id: "iam-3", prompt: "O OpenID Connect acrescenta ao OAuth 2.0:", options: ["Camada de identidade com id_token", "Um banco de dados", "Criptografia quântica", "Uma nova internet"], correctAnswer: 0, explanation: "OIDC adiciona autenticação ao framework de autorização do OAuth." },
      { id: "iam-4", prompt: "Acesso privilegiado (PAM) exige:", options: ["Controle, gravação e revisão das sessões administrativas", "Senhas compartilhadas", "Acesso eterno sem revisão", "Ignorar logs"], correctAnswer: 0, explanation: "Contas privilegiadas concentram risco e precisam de supervisão rigorosa." },
      { id: "iam-5", prompt: "No ciclo joiner-mover-leaver, um ponto crítico é:", options: ["Revogar acessos imediatamente na saída", "Manter contas de ex-funcionários", "Nunca revisar acessos", "Dar admin a todos"], correctAnswer: 0, explanation: "O desligamento sem revogação é uma das maiores causas de incidentes." },
    ],
  },
  {
    slug: "security-awareness-social-engineering", code: "AWARE-01", title: "Security Awareness & Social Engineering", shortTitle: "Awareness", level: "Iniciante", duration: "12 horas", lessons: 10, labs: 2, quizCount: 5, accent: "green", icon: "shield",
    description: "Phishing, engenharia social, segurança de e-mail, senhas, MFA, insider risk, comportamento e treinamento com métricas.", focus: "O fator humano é a camada mais atacada: transforme pessoas na primeira linha de defesa.",
    outcomes: ["Reconhecer phishing, vishing e técnicas de engenharia social.", "Aplicar hábitos seguros de senha, MFA e e-mail.", "Identificar sinais de insider risk sem vigilância abusiva.", "Projetar e medir um programa de awareness corporativo."],
    modules: [
      { title: "Engenharia social na prática", lessons: 4, description: "Phishing, pretexting, urgência e como os atacantes exploram confiança." },
      { title: "Hábitos seguros do dia a dia", lessons: 3, description: "Senhas, MFA, e-mail seguro e proteção de dispositivos pessoais e corporativos." },
      { title: "Programas de awareness e métricas", lessons: 3, description: "Treinamento, simulações, insider risk e indicadores de evolução cultural." },
    ],
    labsList: [
      { title: "Triagem de mensagens suspeitas", description: "Classifique uma caixa de mensagens simulada entre legítimas e phishing.", objective: "Aplicar sinais de detecção: remetente, urgência, links e pedidos incomuns.", command: "classificar-mensagens --caixa simulada --itens 20", output: "Mensagens analisadas: 20\nPhishing identificado: 6\nFalsos positivos evitados: 2\nTempo médio por mensagem: 41s" },
      { title: "Programa de awareness para empresa fictícia", description: "Projete um programa de conscientização com metas e métricas.", objective: "Definir treinamentos, simulações e indicadores de melhoria.", command: "projetar-programa --empresa ficticia-corp --periodo 12m", output: "Treinamentos: 4 por ano\nSimulações: mensais\nMeta: taxa de cliques abaixo de 4%\nMétrica base: 9% (atual)" },
    ],
    assessment: "Avaliação de engenharia social, hábitos seguros e programas de awareness.",
    assessmentQuestions: [
      { id: "aware-1", prompt: "Urgência extrema em uma mensagem ('clique agora!') é um sinal de:", options: ["Possível engenharia social", "Boa prática", "E-mail oficial sempre", "Sistema rápido"], correctAnswer: 0, explanation: "Atacantes usam urgência para reduzir a reflexão da vítima." },
      { id: "aware-2", prompt: "MFA protege principalmente contra:", options: ["Uso indevido mesmo com senha vazada", "Falhas de energia", "Backup lento", "Tela quebrada"], correctAnswer: 0, explanation: "O segundo fator compensa senhas comprometidas." },
      { id: "aware-3", prompt: "Insider risk significa risco proveniente de:", options: ["Pessoas dentro da organização, intencional ou não", "Apenas hackers externos", "Servidores na nuvem", "Impressoras"], correctAnswer: 0, explanation: "Funcionários e parceiros podem causar incidentes por erro ou intenção." },
      { id: "aware-4", prompt: "Um bom programa de awareness é medido por:", options: ["Queda na taxa de cliques em simulações ao longo do tempo", "Número de pôsteres na parede", "Horas de reunião", "Cor do crachá"], correctAnswer: 0, explanation: "Métricas de comportamento mostram evolução cultural real." },
      { id: "aware-5", prompt: "Antes de agir sob uma solicitação incomum, é prudente:", options: ["Verificar o pedido por um canal conhecido e confiável", "Obedecer imediatamente", "Ignorar para sempre", "Encaminhar para desconhecidos"], correctAnswer: 0, explanation: "Verificação independente interrompe a maioria dos golpes." },
    ],
  },
  {
    slug: "gestao-projetos-seguranca-cibernetica", code: "PMSEC-01", title: "Gestão de Projetos em Segurança Cibernética", shortTitle: "Projetos de Segurança", level: "Intermediário", duration: "20 horas", lessons: 25, labs: 5, quizCount: 10, accent: "blue", icon: "shield",
    description: "Planeje e entregue iniciativas de segurança com escopo claro, riscos priorizados, governança proporcional e evidências que conectam decisão técnica a resultado de negócio.", focus: "Transformar necessidades de segurança em projetos executáveis, mensuráveis e alinhados ao risco.",
    outcomes: ["Definir escopo, entregáveis, dependências e critérios de aceite para um projeto de segurança.", "Priorizar riscos, controles e decisões com base em impacto, probabilidade e evidências.", "Organizar governança, comunicação e mudanças sem criar burocracia desnecessária.", "Conduzir um projeto aplicado de melhoria de segurança do kickoff à entrega e retrospectiva."],
    modules: [
      { title: "Fundamentos de projetos de segurança", lessons: 5, description: "Problema, objetivo, escopo, partes interessadas, entregáveis e critérios de sucesso em iniciativas de segurança." },
      { title: "Planejamento e priorização baseada em risco", lessons: 5, description: "Backlog, dependências, esforço, impacto, probabilidade e priorização de controles." },
      { title: "Governança, papéis e comunicação", lessons: 5, description: "RACI, fóruns de decisão, comunicação executiva, evidências e gestão de expectativas." },
      { title: "Execução segura e gestão de mudanças", lessons: 5, description: "Mudanças controladas, janelas, rollback, qualidade, incidentes e acompanhamento de indicadores." },
      { title: "Entrega, métricas e melhoria contínua", lessons: 5, description: "Aceite, handover, resultados, riscos residuais, lições aprendidas e evolução do programa." },
    ],
    labsList: [
      { title: "Termo de abertura de um projeto SOC", description: "Transforme um problema de triagem de alertas em um projeto com objetivo e escopo verificáveis.", objective: "Definir contexto, patrocinador, entregáveis, fora de escopo e critério de aceite sem prometer resultados não mensuráveis.", command: "criar-termo --projeto melhoria-triagem-soc --escopo inicial", output: "Objetivo: reduzir atrasos de triagem\nEntregáveis: fluxo, playbook e indicador\nFora de escopo: substituir o SIEM\nAceite: fluxo revisado e teste documentado" },
      { title: "Matriz de risco de uma migração", description: "Priorize riscos de um projeto de migração de logs para uma plataforma de análise.", objective: "Relacionar probabilidade, impacto, responsável, resposta e risco residual.", command: "priorizar-riscos --projeto migracao-logs --metodo impacto-probabilidade", output: "Riscos registrados: 8\nPrioridade alta: 3\nRespostas: mitigar, transferir e aceitar\nRisco residual: documentado para aprovação" },
      { title: "RACI para resposta a incidentes", description: "Distribua responsabilidades entre SOC, infraestrutura, jurídico e comunicação.", objective: "Evitar lacunas e sobreposição de responsabilidade durante uma resposta coordenada.", command: "montar-raci --processo resposta-incidente --equipes soc,infra,juridico,comms", output: "Papéis atribuídos: responsável, aprovador, consultado e informado\nConflitos: 1 resolvido\nEscalonamento: definido por severidade" },
      { title: "Mudança controlada em regra de detecção", description: "Planeje uma alteração de regra com teste, janela, rollback e observabilidade.", objective: "Demonstrar que uma mudança operacional pode ser executada com controle e reversibilidade.", command: "planejar-mudanca --servico deteccao --tipo regra --rollback preparado", output: "Teste prévio: aprovado\nJanela: registrada\nRollback: validado\nMonitoramento pós-mudança: 60 minutos" },
      { title: "Relatório de encerramento e handover", description: "Apresente resultados, pendências e riscos residuais para a operação.", objective: "Concluir o projeto com evidência, aceite formal e próximos passos claros.", command: "encerrar-projeto --projeto melhoria-seguranca --handover operacao", output: "Entregáveis aceitos: 4/4\nPendências: 2 com responsáveis\nRiscos residuais: 3 registrados\nHandover: concluído e documentado" },
    ],
    assessment: "Avaliação autoral sobre planejamento, risco, governança, mudanças e entrega de projetos de segurança.",
    assessmentQuestions: [
      { id: "pmsec-1", prompt: "Qual é a melhor forma de evitar que um projeto de segurança cresça sem controle?", options: ["Definir escopo, fora de escopo e critérios de aceite", "Aceitar toda solicitação imediatamente", "Remover os critérios de sucesso", "Evitar registrar decisões"], correctAnswer: 0, explanation: "Escopo e critérios de aceite tornam as expectativas verificáveis e ajudam a controlar mudanças." },
      { id: "pmsec-2", prompt: "Ao priorizar riscos de um projeto, o responsável deve combinar principalmente:", options: ["Impacto, probabilidade e resposta planejada", "Apenas a opinião da pessoa mais antiga", "Quantidade de reuniões e tamanho do time", "Cor do dashboard"], correctAnswer: 0, explanation: "A priorização precisa relacionar exposição ao risco com uma resposta e um responsável." },
      { id: "pmsec-3", prompt: "Qual artefato clarifica quem executa, aprova, é consultado e é informado?", options: ["RACI", "Hash", "NAT", "Tabela ARP"], correctAnswer: 0, explanation: "A matriz RACI distribui responsabilidades e reduz lacunas de comunicação." },
      { id: "pmsec-4", prompt: "Uma mudança em uma regra de detecção deve ser acompanhada de:", options: ["Teste, janela, plano de rollback e monitoramento", "Alteração direta sem registro", "Desativação dos logs", "Acesso administrativo compartilhado"], correctAnswer: 0, explanation: "Mudanças controladas precisam ser reversíveis, observáveis e autorizadas." },
      { id: "pmsec-5", prompt: "O encerramento responsável de um projeto inclui:", options: ["Aceite, handover, pendências e riscos residuais documentados", "Apagar evidências para encerrar mais rápido", "Ignorar a operação", "Declarar sucesso sem validação"], correctAnswer: 0, explanation: "A entrega só é sustentável quando a operação recebe contexto, evidências e próximos passos." },
    ],
  },
] as const satisfies readonly ActivatedCatalogCourse[];
