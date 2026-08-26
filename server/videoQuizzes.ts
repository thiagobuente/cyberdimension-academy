export type VideoQuizQuestion = {
  id: string;
  prompt: string;
  options: readonly string[];
  correctAnswer: number;
  explanation: string;
};

const videoQuizBank: Record<string, Record<number, readonly VideoQuizQuestion[]>> = {
  "identidade-autenticacao-segura": {
    0: [
      { id: "iam-video-0-auth", prompt: "Qual pergunta a autenticação responde antes de liberar uma conta?", options: ["Quem está tentando acessar?", "Qual backup deve ser usado?", "Qual é a velocidade da rede?", "Quanto espaço há em disco?"], correctAnswer: 0, explanation: "Autenticação verifica a identidade apresentada. Depois dela, a autorização define os acessos permitidos." },
      { id: "iam-video-0-audit", prompt: "Além de autenticar, qual prática ajuda a tornar decisões de acesso auditáveis?", options: ["Registrar eventos de acesso", "Compartilhar contas", "Desativar alertas", "Usar uma senha comum"], correctAnswer: 0, explanation: "Registros de acesso criam evidências sobre quem realizou uma ação e quando ela aconteceu." },
    ],
    1: [
      { id: "iam-video-1-mfa", prompt: "Qual controle reduz o impacto de uma senha exposta?", options: ["MFA", "Conta compartilhada", "Sem logs", "Senha reutilizada"], correctAnswer: 0, explanation: "MFA exige uma verificação adicional e dificulta o uso indevido de uma senha isoladamente." },
      { id: "iam-video-1-recovery", prompt: "Uma recuperação de conta segura deve:", options: ["Exigir verificações proporcionais", "Ignorar todos os fatores", "Enviar a senha em texto aberto", "Desativar o MFA permanentemente"], correctAnswer: 0, explanation: "A recuperação não deve contornar os controles principais; ela precisa validar a identidade de forma apropriada." },
    ],
    2: [
      { id: "iam-video-2-least-privilege", prompt: "O princípio do menor privilégio recomenda:", options: ["Conceder somente o acesso necessário", "Dar administração a todos", "Remover registros", "Compartilhar credenciais"], correctAnswer: 0, explanation: "Limitar permissões reduz a superfície de impacto de erros e comprometimentos." },
      { id: "iam-video-2-review", prompt: "Quando uma revisão de acesso deve ganhar prioridade?", options: ["Em mudança de função ou desligamento", "Quando a tela muda de cor", "Ao limpar o cache", "Ao trocar o wallpaper"], correctAnswer: 0, explanation: "Mudanças no vínculo ou na função podem deixar permissões excessivas ativas e exigem revisão rápida." },
    ],
  },
  "redes-para-cyber-security": {
    0: [
      { id: "network-video-0-gateway", prompt: "Qual elemento encaminha tráfego entre redes diferentes?", options: ["Gateway", "Nome do host", "Cabo de vídeo", "Área de trabalho"], correctAnswer: 0, explanation: "O gateway é o próximo salto usado para alcançar redes fora do segmento local." },
      { id: "network-video-0-ports", prompt: "No contexto de rede, portas ajudam principalmente a:", options: ["Diferenciar serviços e orientar políticas", "Substituir endereços IP", "Criptografar qualquer tráfego", "Eliminar a necessidade de logs"], correctAnswer: 0, explanation: "Portas identificam serviços em um host e permitem que regras sejam criadas para os fluxos necessários." },
    ],
    2: [
      { id: "network-video-2-nat", prompt: "Qual afirmação descreve corretamente o NAT?", options: ["Traduz endereços, mas não substitui regras de acesso", "Elimina a necessidade de segmentação", "É um antivírus de rede", "Substitui registros de auditoria"], correctAnswer: 0, explanation: "NAT altera endereços no caminho. Segmentação e ACLs continuam necessárias para limitar os fluxos." },
      { id: "network-video-2-acl", prompt: "Uma ACL de menor privilégio deve começar por:", options: ["Permitir apenas o fluxo necessário", "Liberar todas as portas", "Bloquear toda a observabilidade", "Aceitar exceções sem registro"], correctAnswer: 0, explanation: "Uma regra defensiva parte do serviço necessário e documenta exceções para reduzir exposição." },
    ],
    4: [
      { id: "network-video-4-scope", prompt: "Qual é um primeiro passo adequado em troubleshooting?", options: ["Definir sintoma, impacto e escopo", "Alterar todas as rotas", "Desativar os logs", "Reiniciar sem investigar"], correctAnswer: 0, explanation: "Delimitar o problema evita mudanças precipitadas e orienta a coleta de evidências." },
      { id: "network-video-4-evidence", prompt: "Por que registrar evidências de DNS, rota e conectividade?", options: ["Para tornar o diagnóstico reproduzível", "Para evitar qualquer escalonamento", "Para remover o contexto", "Para dispensar testes"], correctAnswer: 0, explanation: "Evidências datadas e contextualizadas ajudam outras pessoas a validar e continuar o diagnóstico." },
    ],
  },
  "linux-para-operacoes-de-seguranca": {
    0: [
      { id: "linux-video-0-readonly", prompt: "Durante uma investigação inicial no Linux, qual abordagem reduz o risco de alteração indevida?", options: ["Priorizar comandos de leitura e busca", "Apagar logs antigos", "Executar mudanças sem registro", "Alterar permissões de todos os arquivos"], correctAnswer: 0, explanation: "Consultas e filtros preservam evidências enquanto você entende o contexto antes de qualquer mudança." },
      { id: "linux-video-0-permissions", prompt: "Permissões de arquivos contribuem diretamente para:", options: ["Menor privilégio por usuário e grupo", "Aumentar acesso administrativo", "Eliminar proprietários", "Desativar auditoria"], correctAnswer: 0, explanation: "Permissões definem quais ações cada usuário ou grupo pode realizar e reduzem acesso excessivo." },
    ],
    2: [
      { id: "linux-video-2-ssh", prompt: "Qual combinação fortalece o acesso SSH de um servidor?", options: ["Chaves e restrição de login root", "Senha compartilhada e root liberado", "Sem firewall e sem logs", "Conta genérica para todos"], correctAnswer: 0, explanation: "Chaves e a restrição de acesso privilegiado reduzem vetores comuns de acesso remoto indevido." },
      { id: "linux-video-2-firewall", prompt: "No hardening de rede, um firewall deve:", options: ["Permitir apenas os fluxos necessários", "Liberar todo o tráfego por padrão", "Substituir a atualização do sistema", "Desabilitar inventário de serviços"], correctAnswer: 0, explanation: "Regras explícitas limitam entradas e saídas ao que é necessário para o serviço documentado." },
    ],
    4: [
      { id: "linux-video-4-logs", prompt: "Atualizações e logs atuam juntos porque:", options: ["Reduzem vulnerabilidades conhecidas e apoiam detecção", "Eliminam a necessidade de política", "Permitem ignorar alertas", "Dispensam inventário"], correctAnswer: 0, explanation: "Correções diminuem exposição a falhas conhecidas, enquanto logs dão visibilidade a eventos relevantes." },
      { id: "linux-video-4-automation", prompt: "Qual característica torna uma automação de hardening mais responsável?", options: ["Testes, registro e escopo limitado", "Execução irrestrita em produção", "Ausência de revisão", "Uso de credenciais compartilhadas"], correctAnswer: 0, explanation: "Automação segura é testada, documentada e limitada ao ambiente e às ações autorizadas." },
    ],
  },
  "cloud-security-operations": {
    0: [
      { id: "cloudops-video-0-shared", prompt: "No modelo de responsabilidade compartilhada, a organização continua responsável por:", options: ["Configurações, identidades e dados sob seu controle", "A segurança física de todos os datacenters", "Dispensar inventário de ativos", "Eliminar registros de auditoria"], correctAnswer: 0, explanation: "A responsabilidade depende do serviço, mas identidade, dados e configurações do cliente normalmente exigem governança da organização." },
      { id: "cloudops-video-0-inventory", prompt: "Por que inventariar recursos de nuvem é importante?", options: ["Para saber o que deve ser protegido e por quem", "Para substituir o MFA", "Para evitar qualquer registro", "Para publicar configurações"], correctAnswer: 0, explanation: "Inventário liga recursos, dados, responsáveis e controles a decisões de proteção verificáveis." },
    ],
    1: [
      { id: "cloudops-video-1-iam", prompt: "Uma identidade em nuvem deve receber:", options: ["Somente as permissões necessárias e revisáveis", "Acesso administrativo permanente", "Uma chave compartilhada", "Exceção sem prazo"], correctAnswer: 0, explanation: "Menor privilégio, revisão e rastreabilidade reduzem a exposição associada a identidades e credenciais." },
      { id: "cloudops-video-1-logs", prompt: "Logs de alterações de configuração ajudam principalmente a:", options: ["Reconstruir contexto e investigar desvios", "Substituir backups", "Eliminar políticas", "Aumentar permissões"], correctAnswer: 0, explanation: "Registros de auditoria mostram quem mudou o quê, quando e em qual recurso, apoiando triagem e resposta." },
    ],
    2: [
      { id: "cloudops-video-2-response", prompt: "Antes de alterar um recurso diante de um alerta, a equipe deve:", options: ["Preservar evidências e avaliar impacto com os responsáveis", "Excluir todos os logs", "Alterar recursos aleatoriamente", "Publicar detalhes da ocorrência"], correctAnswer: 0, explanation: "Ações coordenadas evitam perda de evidência e reduzem o risco de interrupção indevida de serviços." },
      { id: "cloudops-video-2-improve", prompt: "Uma melhoria de postura fica mais sustentável quando possui:", options: ["Ação, responsável, prazo e evidência de validação", "Apenas uma intenção genérica", "Logs apagados", "Privilégios extras"], correctAnswer: 0, explanation: "Responsáveis e evidências tornam a correção rastreável e verificável ao longo do tempo." },
    ],
  },
  "software-security-applied": {
    0: [
      { id: "appsec-video-0-assets", prompt: "O primeiro passo para discutir segurança no desenho de uma funcionalidade é:", options: ["Identificar ativos, fluxos e limites de confiança", "Escolher uma biblioteca sem contexto", "Desativar logs", "Adicionar uma senha compartilhada"], correctAnswer: 0, explanation: "Ativos e fluxos mostram o que precisa de proteção e onde as decisões de controle devem atuar." },
      { id: "appsec-video-0-threats", prompt: "Uma ameaça bem formulada deve orientar:", options: ["Um controle ou teste verificável", "Uma conclusão sem dados", "A remoção da documentação", "O compartilhamento de segredos"], correctAnswer: 0, explanation: "Perguntas de segurança úteis podem ser convertidas em requisitos, revisões e critérios de teste." },
    ],
    1: [
      { id: "appsec-video-1-validation", prompt: "Validação no servidor é essencial porque:", options: ["O cliente não é uma fronteira de confiança", "O navegador sempre é inviolável", "Elimina autorização", "Substitui a revisão de código"], correctAnswer: 0, explanation: "A aplicação precisa aplicar regras de formato e negócio em uma camada que controla a operação protegida." },
      { id: "appsec-video-1-authorization", prompt: "Após autenticar uma pessoa, o sistema ainda deve:", options: ["Verificar se ela pode acessar aquele recurso ou ação", "Liberar tudo automaticamente", "Desativar registros", "Exibir erros internos"], correctAnswer: 0, explanation: "Autenticação identifica; autorização limita operações conforme o papel, o recurso e o contexto." },
    ],
    2: [
      { id: "appsec-video-2-dependencies", prompt: "Conhecer dependências de uma aplicação permite:", options: ["Avaliar versões e priorizar correções quando necessário", "Eliminar qualquer teste", "Remover autorização", "Ocultar componentes"], correctAnswer: 0, explanation: "Inventário de componentes dá visibilidade para analisar impacto e tratar vulnerabilidades conhecidas." },
      { id: "appsec-video-2-gates", prompt: "Um gate de segurança no pipeline deve produzir:", options: ["Evidências para uma decisão de entrega", "Senhas expostas", "Uma substituição permanente para revisão humana", "Ausência de registro"], correctAnswer: 0, explanation: "Automação cria consistência, mas resultados precisam ser interpretados no contexto da mudança e do risco." },
    ],
  },
  "security-automation-operations": {
    0: [
      { id: "auto-video-0-scope", prompt: "Antes de criar uma rotina automatizada, deve-se definir:", options: ["Objetivo, escopo, responsável e condição de parada", "Privilégios máximos", "Execução em produção", "Nenhum registro"], correctAnswer: 0, explanation: "Definições explícitas evitam automações ambíguas e facilitam avaliação de risco e impacto." },
      { id: "auto-video-0-least", prompt: "O menor privilégio em automação significa:", options: ["Conceder somente o acesso necessário à tarefa", "Usar uma conta administradora para tudo", "Compartilhar credenciais", "Remover limites de diretório"], correctAnswer: 0, explanation: "Permissões restritas limitam o dano possível se uma rotina falhar ou for usada de forma indevida." },
    ],
    1: [
      { id: "auto-video-1-input", prompt: "Validar parâmetros de uma rotina ajuda a:", options: ["Impedir ações fora do formato esperado", "Aumentar escopo automaticamente", "Apagar logs", "Dispensar testes"], correctAnswer: 0, explanation: "Entradas verificadas reduzem erros e impedem que dados inesperados alterem o comportamento planejado." },
      { id: "auto-video-1-logging", prompt: "Um log de automação de qualidade deve:", options: ["Registrar contexto e resultado sem expor segredos", "Conter senhas em texto puro", "Existir somente quando falha", "Omitir identificadores de execução"], correctAnswer: 0, explanation: "A rastreabilidade precisa equilibrar investigação, privacidade e proteção de credenciais." },
    ],
    2: [
      { id: "auto-video-2-test", prompt: "Por que testar automações em ambiente controlado?", options: ["Para observar efeitos antes de um uso autorizado", "Para dispensar revisão", "Para coletar dados reais", "Para aumentar privilégios"], correctAnswer: 0, explanation: "Dados sintéticos e ambientes de treinamento tornam testes repetíveis e reduzem impacto operacional." },
      { id: "auto-video-2-rollback", prompt: "Um plano de reversão é importante porque:", options: ["Permite responder a efeitos inesperados de forma controlada", "Elimina a necessidade de documentação", "Substitui backups", "Deve apagar registros"], correctAnswer: 0, explanation: "Reversão planejada reduz risco e dá à equipe uma forma conhecida de retornar ao estado esperado." },
    ],
  },
  "detection-engineering": {
    0: [
      { id: "det-video-0-usecase", prompt: "Um caso de uso de detecção deve relacionar:", options: ["Comportamento, ativo, risco e dados necessários", "Somente uma ferramenta", "Uma conclusão sem evidências", "A exclusão de telemetria"], correctAnswer: 0, explanation: "Casos de uso conectam a necessidade de defesa aos eventos que podem confirmar ou descartar uma hipótese." },
      { id: "det-video-0-quality", prompt: "A qualidade de telemetria depende, entre outros fatores, de:", options: ["Cobertura, campos úteis e sincronização de horário", "Cor do dashboard", "Tamanho do escritório", "Número de apresentações"], correctAnswer: 0, explanation: "Eventos completos, consistentes e temporalmente confiáveis permitem correlação e investigação mais precisa." },
    ],
    1: [
      { id: "det-video-1-signal", prompt: "Uma regra de detecção deve deixar claro:", options: ["Qual sinal observa e o que ainda precisa ser investigado", "Que o incidente está confirmado", "Que logs devem ser apagados", "Que nenhuma revisão será necessária"], correctAnswer: 0, explanation: "Alertas são sinais para triagem; eles devem apoiar uma decisão, sem confundir observação com conclusão." },
      { id: "det-video-1-synthetic", prompt: "Dados sintéticos são úteis para validar uma regra porque:", options: ["Permitem testes repetíveis sem expor dados reais", "Confirmam ataques externos", "Eliminam autorização", "Substituem telemetria"], correctAnswer: 0, explanation: "Cenários sintéticos ajudam a ajustar lógica e contexto de maneira segura e reproduzível." },
    ],
    2: [
      { id: "det-video-2-triage", prompt: "Uma detecção madura deve indicar:", options: ["Um próximo passo de triagem e fontes de evidência", "Uma ação destrutiva automática", "A remoção de todos os registros", "Um veredito definitivo"], correctAnswer: 0, explanation: "Playbooks e evidências esperadas ajudam analistas a validar sinais com segurança e consistência." },
      { id: "det-video-2-versioning", prompt: "Versionar uma regra de detecção permite:", options: ["Rastrear ajustes, revisar resultados e reverter mudanças", "Ocultar alterações", "Eliminar responsáveis", "Desligar testes"], correctAnswer: 0, explanation: "Histórico de versões facilita colaboração, auditoria e melhoria contínua de lógica defensiva." },
    ],
  },
  "soc-analyst": {
    0: [
      { id: "soc-video-0-mission", prompt: "A finalidade central de um SOC é:", options: ["Observar sinais e orientar resposta proporcional ao risco", "Apagar alertas rapidamente", "Compartilhar credenciais", "Substituir todas as equipes"], correctAnswer: 0, explanation: "Um SOC combina pessoas, processos e telemetria para detectar, investigar e apoiar respostas responsáveis." },
      { id: "soc-video-0-shift", prompt: "Uma passagem de turno de qualidade deve registrar:", options: ["Fatos, pendências e próxima ação segura", "Apenas uma opinião", "Senhas de contas", "Eventos sem horário"], correctAnswer: 0, explanation: "A continuidade operacional depende de contexto verificável e próximos passos claros." },
    ],
    1: [
      { id: "soc-video-1-alert", prompt: "Um alerta deve ser tratado inicialmente como:", options: ["Um sinal que precisa de contexto", "Um incidente confirmado", "Uma evidência para apagar", "Uma permissão administrativa"], correctAnswer: 0, explanation: "O alerta orienta a investigação, mas ainda precisa de validação com evidências." },
      { id: "soc-video-1-enrichment", prompt: "Ao enriquecer um alerta, o analista deve priorizar:", options: ["Fontes relevantes para validar a hipótese", "Todos os dados disponíveis sem propósito", "Credenciais pessoais", "Mudanças irreversíveis"], correctAnswer: 0, explanation: "Enriquecimento responsável seleciona dados que ajudam a confirmar ou enfraquecer uma hipótese." },
    ],
    2: [
      { id: "soc-video-2-playbook", prompt: "Um playbook serve principalmente para:", options: ["Guiar etapas repetíveis sem dispensar análise", "Substituir evidências", "Confirmar todo alerta automaticamente", "Remover registros"], correctAnswer: 0, explanation: "Playbooks oferecem consistência, mas o contexto do caso continua exigindo julgamento profissional." },
      { id: "soc-video-2-escalation", prompt: "Um escalonamento útil inclui:", options: ["Evidências, incertezas e decisão solicitada", "Somente urgência", "Credenciais de sistema", "Logs excluídos"], correctAnswer: 0, explanation: "Contexto acionável permite que a próxima pessoa continue o caso com segurança e clareza." },
    ],
  },
  "siem-na-pratica": {
    0: [
      { id: "siem-video-0-source", prompt: "Uma fonte de log é mais útil quando:", options: ["Ajuda a responder uma pergunta de investigação", "Não possui horário", "É apagada após coleta", "Substitui o analista"], correctAnswer: 0, explanation: "A qualidade de telemetria começa ao relacionar dados a uma decisão de segurança verificável." },
      { id: "siem-video-0-quality", prompt: "Qual elemento contribui para uma linha do tempo confiável?", options: ["Horários sincronizados e campos completos", "Eventos sem origem", "Logs temporários sem contexto", "Apenas opiniões"], correctAnswer: 0, explanation: "Timestamps comparáveis e campos úteis tornam a investigação reproduzível." },
    ],
    1: [
      { id: "siem-video-1-normalization", prompt: "Normalizar logs facilita:", options: ["Comparar eventos de fontes distintas", "Eliminar retenção", "Desativar alertas", "Aumentar privilégios"], correctAnswer: 0, explanation: "Campos consistentes permitem pesquisa, correlação e análise entre diferentes tecnologias." },
      { id: "siem-video-1-correlation", prompt: "Uma correlação de SIEM deve ser vista como:", options: ["Hipótese priorizada para investigar", "Prova definitiva de incidente", "Substituta de logs", "Permissão para apagar evidências"], correctAnswer: 0, explanation: "A regra relaciona sinais de interesse, mas a análise ainda precisa confirmar o contexto." },
    ],
    2: [
      { id: "siem-video-2-fact", prompt: "Em uma investigação, é importante separar:", options: ["Fatos observáveis e inferências", "Senhas e logs", "Alertas e registros", "Ativos e identidades"], correctAnswer: 0, explanation: "Essa separação deixa claras as evidências disponíveis e o que ainda demanda validação." },
      { id: "siem-video-2-close", prompt: "Ao encerrar uma análise, a documentação deve conter:", options: ["Evidências, confiança e próximos passos", "Apenas o nome do alerta", "Dados pessoais desnecessários", "Nenhum registro"], correctAnswer: 0, explanation: "Encerramentos documentados apoiam auditoria, continuidade e melhoria dos controles." },
    ],
  },
  "incident-response": {
    0: [
      { id: "ir-video-0-prepare", prompt: "Preparação para incidentes inclui:", options: ["Papéis, canais e critérios de acionamento", "Acesso irrestrito", "Exclusão preventiva de logs", "Mudanças sem aprovação"], correctAnswer: 0, explanation: "Papéis e procedimentos conhecidos reduzem improviso quando uma ocorrência precisa ser avaliada." },
      { id: "ir-video-0-evidence", prompt: "Ao receber um sinal de incidente, a equipe deve primeiro:", options: ["Preservar contexto e delimitar o que precisa ser investigado", "Publicar detalhes", "Apagar todos os eventos", "Reiniciar recursos sem análise"], correctAnswer: 0, explanation: "Evidências e escopo ajudam a orientar uma resposta proporcional e auditável." },
    ],
    1: [
      { id: "ir-video-1-contain", prompt: "Uma contenção responsável deve considerar:", options: ["Impacto operacional, evidências e coordenação", "Ação isolada sem contexto", "Remoção de registros", "Acesso compartilhado"], correctAnswer: 0, explanation: "Conter impacto sem avaliar efeitos pode prejudicar a operação e a investigação." },
      { id: "ir-video-1-eradicate", prompt: "Erradicação busca:", options: ["Tratar causa e artefatos com validação", "Ocultar a ocorrência", "Substituir o playbook", "Encerrar sem verificar"], correctAnswer: 0, explanation: "Depois de conter, a equipe precisa tratar causas e validar que o risco foi reduzido." },
    ],
    2: [
      { id: "ir-video-2-recovery", prompt: "Recuperação bem executada inclui:", options: ["Retorno controlado e monitoramento", "Retorno imediato sem validação", "Exclusão de evidências", "Dispensa de comunicação"], correctAnswer: 0, explanation: "Monitoramento e validação confirmam que o serviço retornou de modo seguro e estável." },
      { id: "ir-video-2-lessons", prompt: "Uma lição aprendida deve resultar em:", options: ["Melhoria com responsável, prazo e evidência", "Culpabilização individual", "Ausência de registro", "Acesso extra permanente"], correctAnswer: 0, explanation: "Ações acompanháveis transformam aprendizado em redução de risco sustentada." },
    ],
  },
  "threat-hunting-avancado": {
    0: [
      { id: "hunt-video-0-hypothesis", prompt: "Uma hipótese de hunting deve ter:", options: ["Comportamento, fontes e critérios de validação", "Uma acusação pronta", "Acesso a sistemas externos", "Uma ação sem escopo"], correctAnswer: 0, explanation: "Hipóteses bem formuladas são investigáveis e deixam claro como podem ser confirmadas ou enfraquecidas." },
      { id: "hunt-video-0-scope", prompt: "O escopo de um hunting responsável deve ser:", options: ["Autorizado e delimitado", "Ilimitado", "Oculto da organização", "Baseado em dados de terceiros"], correctAnswer: 0, explanation: "Atividades defensivas devem respeitar finalidade, autorização, privacidade e ambiente definido." },
    ],
    1: [
      { id: "hunt-video-1-telemetry", prompt: "A telemetria selecionada para hunting deve:", options: ["Ajudar a responder à hipótese com contexto", "Substituir critérios de investigação", "Ser sempre a maior possível", "Eliminar registros antigos"], correctAnswer: 0, explanation: "O valor dos dados depende de sua relevância, qualidade e capacidade de apoiar uma decisão." },
      { id: "hunt-video-1-correlation", prompt: "Correlacionar eventos em hunting significa:", options: ["Ganhar contexto sem assumir confirmação automática", "Declarar incidente imediatamente", "Excluir fontes duplicadas", "Conceder privilégios"], correctAnswer: 0, explanation: "A relação entre eventos orienta investigação, mas não elimina a necessidade de validação." },
    ],
    2: [
      { id: "hunt-video-2-confidence", prompt: "Ao comunicar um achado, é importante indicar:", options: ["Evidências, limites e nível de confiança", "Somente uma conclusão absoluta", "Dados sigilosos sem necessidade", "Ausência de recomendação"], correctAnswer: 0, explanation: "Confiança e limitações permitem decisões mais calibradas pela equipe responsável." },
      { id: "hunt-video-2-improve", prompt: "Uma detecção derivada de hunting deve ser:", options: ["Validada, versionada e acompanhada", "Aplicada sem teste", "Usada para apagar logs", "Tratada como verdade permanente"], correctAnswer: 0, explanation: "Validação e acompanhamento ajudam a reduzir ruído e manter a utilidade defensiva da regra." },
    ],
  },
  "iot-security-foundations": {
    0: [
      { id: "iot-video-0-inventory", prompt: "Qual prática oferece uma base mais segura para proteger dispositivos conectados?", options: ["Manter inventário, responsável e finalidade de cada dispositivo", "Conectar qualquer dispositivo sem registro", "Usar uma senha igual em todos os equipamentos", "Desativar atualizações"], correctAnswer: 0, explanation: "Inventário e responsabilidade permitem priorizar controles, atualizações e monitoramento de forma verificável." },
      { id: "iot-video-0-defaults", prompt: "Por que credenciais padrão em dispositivos IoT exigem atenção?", options: ["Podem ser conhecidas ou facilmente encontradas por terceiros", "Elas reforçam automaticamente o MFA", "Eliminam a necessidade de logs", "Substituem a segmentação"], correctAnswer: 0, explanation: "Credenciais padrão ampliam exposição; elas devem ser substituídas conforme o processo autorizado do fabricante." },
    ],
    1: [
      { id: "iot-video-1-segment", prompt: "Qual é o objetivo de segmentar dispositivos IoT em uma rede?", options: ["Limitar comunicações ao que é necessário", "Dar acesso total à rede corporativa", "Desativar observabilidade", "Eliminar identidades"], correctAnswer: 0, explanation: "Segmentação reduz movimento lateral e restringe fluxos aos serviços e destinos aprovados." },
      { id: "iot-video-1-monitor", prompt: "A telemetria de um dispositivo conectado ajuda principalmente a:", options: ["Identificar desvios de comportamento e apoiar investigação", "Eliminar a necessidade de atualização", "Compartilhar dados pessoais sem contexto", "Substituir políticas"], correctAnswer: 0, explanation: "Eventos e métricas relevantes ajudam a entender o comportamento esperado e detectar mudanças que exigem análise." },
    ],
    2: [
      { id: "iot-video-2-update", prompt: "Uma atualização responsável de firmware deve considerar:", options: ["Compatibilidade, janela de mudança e plano de reversão", "Aplicação sem teste em todos os dispositivos", "Exclusão de registros", "Desativação de backups"], correctAnswer: 0, explanation: "Mudanças planejadas reduzem interrupções e preservam a capacidade de recuperar o serviço se necessário." },
      { id: "iot-video-2-review", prompt: "Ao revisar risco de um dispositivo, a equipe deve relacionar:", options: ["Ativo, dados, conectividade, impacto e responsável", "Somente a marca do equipamento", "Uma senha compartilhada", "A cor do gabinete"], correctAnswer: 0, explanation: "Contexto operacional e de dados permite decisões proporcionais sobre controles e prioridade de tratamento." },
    ],
  },
  "software-supply-chain-security": {
    0: [
      { id: "supply-video-0-components", prompt: "Qual informação uma SBOM ajuda a organizar?", options: ["Componentes e dependências usados por um software", "Senhas de produção", "Logs apagados", "Acesso administrativo irrestrito"], correctAnswer: 0, explanation: "Uma SBOM dá visibilidade sobre componentes para apoiar análise de impacto e decisões de atualização." },
      { id: "supply-video-0-risk", prompt: "Ao avaliar um componente de terceiros, é importante considerar:", options: ["Finalidade, versão, manutenção e impacto no produto", "Apenas sua popularidade", "Excluir a documentação", "Ignorar licenças"], correctAnswer: 0, explanation: "O risco depende do contexto de uso, do histórico de manutenção e do impacto de uma falha ou mudança." },
    ],
    1: [
      { id: "supply-video-1-integrity", prompt: "Verificar integridade de artefatos de build ajuda a:", options: ["Confirmar que o pacote corresponde ao processo esperado", "Eliminar qualquer revisão", "Compartilhar segredos", "Dispensar testes"], correctAnswer: 0, explanation: "Evidências de integridade reduzem o risco de introduzir artefatos inesperados no processo de entrega." },
      { id: "supply-video-1-access", prompt: "O acesso ao pipeline de entrega deve seguir qual princípio?", options: ["Menor privilégio com rastreabilidade", "Acesso permanente para todos", "Credenciais genéricas compartilhadas", "Nenhuma revisão"], correctAnswer: 0, explanation: "Acesso limitado e auditável reduz a superfície de alteração indevida em builds e publicações." },
    ],
    2: [
      { id: "supply-video-2-response", prompt: "Quando uma dependência requer tratamento, uma resposta responsável começa por:", options: ["Confirmar contexto, versão afetada e impacto", "Atualizar sem avaliar compatibilidade", "Ocultar o achado", "Remover todos os logs"], correctAnswer: 0, explanation: "Confirmar exposição e impacto ajuda a priorizar e planejar correções com segurança operacional." },
      { id: "supply-video-2-evidence", prompt: "Qual registro fortalece a governança da cadeia de software?", options: ["Decisão, responsável, evidência e data de revisão", "Somente uma mensagem informal", "Ausência de histórico", "Segredos no repositório"], correctAnswer: 0, explanation: "Registros estruturados permitem rastrear decisões e demonstrar como riscos foram avaliados e tratados." },
    ],
  },
  "cyber-crisis-communication": {
    0: [
      { id: "crisis-video-0-roles", prompt: "Em uma crise cibernética, papéis definidos ajudam a:", options: ["Evitar mensagens conflitantes e acelerar decisões coordenadas", "Eliminar a necessidade de evidências", "Publicar informações sem validação", "Substituir o plano de resposta"], correctAnswer: 0, explanation: "Papéis, canais e critérios de aprovação ajudam a manter a comunicação clara e proporcional ao contexto." },
      { id: "crisis-video-0-facts", prompt: "Uma atualização inicial responsável deve distinguir:", options: ["Fatos confirmados, hipóteses e próximos passos", "Rumores e conclusões definitivas", "Senhas e logs", "Nenhum dado relevante"], correctAnswer: 0, explanation: "Separar fatos de hipóteses preserva confiança e evita que informações não verificadas orientem decisões." },
    ],
    1: [
      { id: "crisis-video-1-audience", prompt: "Por que adaptar uma comunicação ao público destinatário?", options: ["Cada público precisa de contexto e ação compatíveis", "Para retirar todas as evidências", "Para evitar aprovações", "Para ignorar obrigações"], correctAnswer: 0, explanation: "Equipes técnicas, liderança e pessoas afetadas podem precisar de informações diferentes, sem expor dados além do necessário." },
      { id: "crisis-video-1-approval", prompt: "Antes de publicar uma mensagem externa, o processo deve prever:", options: ["Revisão por responsáveis definidos e registro da decisão", "Envio sem validação", "Exclusão do histórico", "Compartilhamento de dados sigilosos"], correctAnswer: 0, explanation: "Aprovação coordenada reduz riscos legais, operacionais e de comunicação durante uma ocorrência." },
    ],
    2: [
      { id: "crisis-video-2-lessons", prompt: "Após uma simulação ou incidente, uma lição aprendida útil deve gerar:", options: ["Ações com responsável, prazo e evidência de acompanhamento", "Culpabilização sem análise", "Nenhum registro", "Mais privilégios permanentes"], correctAnswer: 0, explanation: "Ações rastreáveis transformam aprendizados em melhorias verificáveis para pessoas, processo e tecnologia." },
      { id: "crisis-video-2-practice", prompt: "Exercícios de mesa servem principalmente para:", options: ["Treinar decisões, comunicação e lacunas do plano em cenário seguro", "Executar mudanças em produção", "Dispensar o plano de resposta", "Substituir evidências técnicas"], correctAnswer: 0, explanation: "Tabletops permitem praticar coordenação e revisar procedimentos sem expor sistemas a riscos desnecessários." },
    ],
  },
};

export function getVideoQuiz(courseSlug: string, moduleIndex: number): readonly VideoQuizQuestion[] {
  return videoQuizBank[courseSlug]?.[moduleIndex] ?? [];
}

export function getPublicVideoQuiz(courseSlug: string, moduleIndex: number) {
  return getVideoQuiz(courseSlug, moduleIndex).map(({ correctAnswer: _correctAnswer, explanation: _explanation, ...question }) => question);
}

export function gradeVideoQuiz(courseSlug: string, moduleIndex: number, answers: number[]) {
  const questions = getVideoQuiz(courseSlug, moduleIndex);
  if (questions.length === 0 || answers.length !== questions.length) return null;
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  return {
    score,
    totalQuestions: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    review: questions.map((question, index) => ({ id: question.id, correct: answers[index] === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation })),
  };
}
