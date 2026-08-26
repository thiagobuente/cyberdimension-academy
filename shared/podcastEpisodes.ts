import type { ContentProvenanceItem } from "./contentProvenance";
import { podcastDeepDiveEpisodes } from "./podcastDeepDiveEpisodes";
import { podcastFullSeriesEpisodes } from "./podcastFullSeriesEpisodes";
import { podcastBatchFourEpisodes } from "./podcastBatchFourEpisodes";
import { podcastSeasonTwoEpisodes } from "./podcastSeasonTwoEpisodes";
import { podcastSeasonThreeEpisodes } from "./podcastSeasonThreeEpisodes";
import { podcastBonusEpisodes } from "./podcastBonusEpisodes";
import { podcastRaioxEpisodes } from "./podcastRaioxEpisodes";
import { ep68Transcript } from "./podcastEp68English";
import { ep69Episode, ep69Transcript } from "./podcastEp69NetworkSecurity";
import { ep70Episode, ep70Transcript } from "./podcastEp70CloudSecurity";
import { ep71Episode, ep71Transcript } from "./podcastEp71IncidentResponse";
import { ep72Episode, ep72Transcript } from "./podcastEp72PenetrationTesting";
import { englishExpansionEpisodes } from "./podcastEnglishExpansion";

export type PodcastSpeaker = "Ana" | "Rafael";

export interface PodcastLine {
  speaker: PodcastSpeaker;
  text: string;
  /** Segundo de início estimado da fala no áudio final. Presente nos episódios com marcadores temporais. */
  timestampSeconds?: number;
}

export interface PodcastEpisode {
  id: string;
  domainCode: "DOM1" | "DOM2" | "DOM3" | "DOM4" | "DOM5";
  domainTitle: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  audioUrl?: string;
  transcript: readonly PodcastLine[];
  topics: readonly string[];
  examWeight: string;
  provenance: ContentProvenanceItem;
  /** Série/trilha do episódio para filtros e seções na página do CyberCast. "english" = English for Cyber Pros; "securityplus" = série principal Security+. */
  series?: string;
}

const podcastProvenance = (id: string, title: string): ContentProvenanceItem => ({
  id: `podcast-${id}`,
  origin: "proprio",
  category: "Podcast educacional próprio",
  title,
  source: "CyberDimension Academy",
  license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
  usage: "Diálogo didático em áudio e transcrição acessível para revisão aprofundada da CompTIA Security+ SY0-701.",
});

const podcastCoreEpisodes: readonly PodcastEpisode[] = [
  {
    id: "ep01-general-security",
    domainCode: "DOM1",
    domainTitle: "General Security Concepts",
    episodeNumber: 1,
    title: "Fundamentos que sustentam a defesa",
    description: "Ana e Rafael conectam controles, CIA, AAA, Zero Trust, mudanças e criptografia em uma visão prática para a prova.",
    duration: "~15 min",
    audioUrl: "/manus-storage/ep01-general-security_4058e666.wav",
    topics: [
      "controles de segurança",
      "CIA e princípios fundamentais",
      "AAA, identidade e acesso",
      "Zero Trust e gestão de mudanças",
      "criptografia, hashing e PKI",
      "protocolos seguros",
    ],
    examWeight: "12% do exame",
    provenance: podcastProvenance("ep01-general-security", "CyberCast 01 — Fundamentos que sustentam a defesa"),
    transcript: [
      {
        speaker: "Ana",
        text: "Bem-vindos ao CyberCast Security+. Eu sou a Ana, e hoje vamos construir o alicerce de todo o exame: os conceitos gerais de segurança. Este domínio vale doze por cento da prova, mas aparece como pano de fundo em quase todas as questões. Não pense nele como uma lista isolada de siglas. Pense em decisões: o que precisamos proteger, de quem, com qual controle e como confirmar que a proteção continua funcionando.",
      },
      {
        speaker: "Rafael",
        text: "Então, mesmo tendo o menor peso, eu não deveria deixar para revisar por último. Quando a questão fala em acesso, confidencialidade, mudança de servidor ou certificado, ela está misturando conceitos desse domínio, certo?",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Vamos começar pelo que a Security+ chama de controles de segurança. Controle é uma salvaguarda para reduzir risco. Ele pode ser administrativo, operacional, técnico ou físico. Uma política de senha é administrativa; treinamento e inspeção de crachá são operacionais; firewall, criptografia e autenticação multifator são técnicos; uma porta com fechadura e uma câmera são físicos. Na prova, escolha o controle que resolve a necessidade descrita, não simplesmente o mais sofisticado.",
      },
      {
        speaker: "Rafael",
        text: "E também existem os nomes preventivo, detectivo e corretivo. Eles são uma segunda classificação?",
      },
      {
        speaker: "Ana",
        text: "Sim. Essas categorias descrevem a função. Um controle preventivo tenta impedir o evento, como a regra que bloqueia uma porta indevida. Um detectivo revela que algo aconteceu ou está acontecendo, como alertas de login anormal. Um corretivo ajuda a restaurar um estado seguro, como a remoção de malware e a recuperação de um backup. A prova também pode mencionar controles dissuasórios, que desencorajam, compensatórios, usados quando o ideal não é possível, e diretivos, que orientam o comportamento, como procedimentos e avisos.",
      },
      {
        speaker: "Rafael",
        text: "Se uma empresa não consegue implementar autenticação multifator em um sistema antigo e coloca monitoramento reforçado, aprovação adicional e acesso só por VPN, isso seria uma compensação?",
      },
      {
        speaker: "Ana",
        text: "Boa leitura. A multifator seria o controle desejado, mas as salvaguardas alternativas podem reduzir o risco residual. Só não confunda compensar com aceitar o risco sem agir. A decisão precisa ser documentada, aprovada e reavaliada. A Security+ valoriza defesa em profundidade: controles diferentes, em camadas, de modo que a falha de um não entregue o ambiente inteiro ao incidente.",
      },
      {
        speaker: "Ana",
        text: "O objetivo dos controles aparece na tríade CIA: confidencialidade, integridade e disponibilidade. Confidencialidade limita o acesso a quem tem autorização. Integridade garante que a informação permaneça correta e completa, sem alteração não autorizada. Disponibilidade assegura que sistemas e dados estejam acessíveis quando necessários. Criptografia de dados em trânsito favorece confidencialidade; assinatura digital e hashes apoiam integridade; redundância, backup testado e tolerância a falhas favorecem disponibilidade.",
      },
      {
        speaker: "Rafael",
        text: "Eu sempre vejo questões em que duas alternativas parecem boas. Há uma forma de separar CIA de outros princípios, como autenticidade e não repúdio?",
      },
      {
        speaker: "Ana",
        text: "Use o verbo da situação. Se a preocupação é manter segredo, pense em confidencialidade. Se é provar que o conteúdo não mudou, integridade. Se é continuar operando durante falha, disponibilidade. Autenticidade responde se uma identidade, mensagem ou sistema é genuíno. Não repúdio gera evidência de que uma parte realizou uma ação e não pode negá-la de modo plausível; assinaturas digitais, logs protegidos e carimbos de tempo ajudam nisso. Privacidade, por sua vez, trata do tratamento apropriado de dados pessoais.",
      },
      {
        speaker: "Ana",
        text: "Agora conecte CIA a AAA: autenticação, autorização e accounting, ou contabilização. Autenticação verifica quem você é. Autorização define o que você pode fazer depois de identificado. Accounting registra ações relevantes para auditoria e investigação. Uma senha ou fator biométrico participa da autenticação; uma permissão de leitura em uma pasta é autorização; um registro de acesso com horário e origem serve para accounting. Uma questão que pede o princípio do menor privilégio está falando de autorização: conceder só o acesso necessário.",
      },
      {
        speaker: "Rafael",
        text: "E identificação vem antes da autenticação? O usuário diz quem afirma ser, e depois prova?",
      },
      {
        speaker: "Ana",
        text: "Isso mesmo. Identificação é a alegação, como informar um nome de usuário. Autenticação é a verificação dessa alegação. Os fatores clássicos são algo que você sabe, algo que possui, algo que é, algo que faz e algum lugar onde está. Multifator exige fatores de categorias diferentes; duas senhas não formam MFA. Métodos como SSO reduzem a repetição de credenciais, enquanto federação permite que uma organização confie em um provedor de identidade externo, normalmente usando padrões como SAML ou OpenID Connect.",
      },
      {
        speaker: "Ana",
        text: "Nos protocolos, lembre-se do propósito. RADIUS costuma centralizar autenticação de acesso a rede; TACACS+ é comum na administração de equipamentos e separa melhor autenticação, autorização e accounting; LDAP consulta diretórios de identidade. OAuth é voltado a autorização delegada, permitindo que uma aplicação receba um escopo limitado sem conhecer a senha do usuário. OpenID Connect acrescenta uma camada de identidade ao OAuth. Para transporte seguro, TLS protege muitas comunicações modernas e substitui o antigo SSL.",
      },
      {
        speaker: "Rafael",
        text: "Então OAuth não é, por si só, um protocolo para provar quem eu sou. Ele autoriza um aplicativo a agir dentro de um escopo, e o OpenID Connect pode informar a identidade. Essa pegadinha parece provável.",
      },
      {
        speaker: "Ana",
        text: "Muito provável. Outro modelo recorrente é o controle de acesso. DAC permite que o dono do recurso decida permissões; MAC usa rótulos e uma autoridade central, comum em contextos mais rígidos; RBAC associa permissões a funções; ABAC avalia atributos, como cargo, horário, localização e classificação do dado. Quando a questão descreve políticas dinâmicas e contexto, ABAC tende a ser a resposta. Quando fala em cargo de analista, gestor ou suporte, RBAC normalmente se encaixa melhor.",
      },
      {
        speaker: "Ana",
        text: "O modelo Zero Trust amplia essa disciplina. Ele não significa que nada pode funcionar, nem que uma VPN sozinha resolve tudo. Significa verificar explicitamente, aplicar menor privilégio e assumir que uma violação pode existir. Em vez de confiar automaticamente porque alguém está dentro da rede, a organização avalia identidade, postura do dispositivo, sensibilidade do recurso e contexto. Microsegmentação, autenticação forte, inventário de ativos e monitoramento contínuo tornam essa estratégia prática.",
      },
      {
        speaker: "Rafael",
        text: "Então uma pessoa autenticada pode continuar sendo reavaliada se mudar de dispositivo, tentar acessar um dado sensível ou apresentar comportamento incomum. A confiança não é permanente.",
      },
      {
        speaker: "Ana",
        text: "Perfeito. E segurança não pode bloquear a operação por surpresa. É por isso que existe gestão de mudanças. Uma mudança segura começa com solicitação e justificativa, análise de impacto e risco, aprovação adequada, plano de implementação, teste, janela de manutenção, comunicação, documentação e plano de reversão. Se uma atualização causar indisponibilidade, o rollback reduz danos. Na prova, desconfie de alternativas que sugerem implantar direto em produção sem validação, aprovação ou contingência.",
      },
      {
        speaker: "Ana",
        text: "Chegamos à criptografia. Criptografia simétrica usa a mesma chave para cifrar e decifrar; é eficiente para grandes volumes de dados. Criptografia assimétrica usa um par de chaves: a pública pode ser distribuída, e a privada deve ser protegida. Ela apoia troca segura de chaves, assinaturas digitais e alguns fluxos de autenticação. Em uma conexão TLS, os mecanismos assimétricos ajudam a estabelecer segurança, e a sessão normalmente usa chaves simétricas pela eficiência.",
      },
      {
        speaker: "Rafael",
        text: "E hash não é criptografia reversível. Um hash transforma uma entrada em um resumo de tamanho fixo e serve para verificar integridade. Para senha, entram sal e algoritmos apropriados de derivação, não um hash simples e rápido.",
      },
      {
        speaker: "Ana",
        text: "Correto. Hashing é unidirecional por projeto. O sal reduz o risco de que hashes iguais revelem senhas iguais e dificulta ataques pré-computados. HMAC combina chave secreta e função de hash para verificar integridade e autenticidade de uma mensagem. Já a assinatura digital aplica a chave privada do emissor sobre um resumo; a chave pública correspondente permite verificar a assinatura. Ela fornece integridade, autenticidade e apoio ao não repúdio, mas não torna o conteúdo secreto por si só.",
      },
      {
        speaker: "Ana",
        text: "A PKI, infraestrutura de chave pública, organiza confiança em certificados. Uma autoridade certificadora, a CA, emite certificados que vinculam uma identidade a uma chave pública. Há autoridades raiz, intermediárias e cadeias de confiança. O solicitante gera uma chave privada e uma solicitação de assinatura de certificado, a CSR. Antes de confiar, o cliente valida a cadeia, o nome, a data de validade e o status de revogação, por exemplo via CRL ou OCSP. HSM, TPM e serviços de gestão de chaves ajudam a proteger material criptográfico sensível.",
      },
      {
        speaker: "Rafael",
        text: "Para fechar, eu resumiria assim: controles reduzem risco; CIA define o que proteger; AAA e modelos de acesso definem quem pode fazer o quê; Zero Trust mantém a verificação contínua; mudanças evitam surpresas; e criptografia, hashes e PKI protegem dados e confiança. Na prova, preciso relacionar a necessidade ao mecanismo, não decorar siglas soltas.",
      },
      {
        speaker: "Ana",
        text: "Excelente síntese. Ao revisar, crie pares mentais: segredo e criptografia; alteração e integridade; continuidade e redundância; identidade e autenticação; permissão e autorização; evidência e accounting; chave pública e certificado; chave privada e assinatura. No próximo episódio, vamos olhar para quem ameaça o ambiente, como os ataques se apresentam e como transformar sinais dispersos em mitigação responsável."
      },
    ],
  },
  {
    id: "ep02-threats-vulnerabilities",
    domainCode: "DOM2",
    domainTitle: "Threats & Vulnerabilities",
    episodeNumber: 2,
    title: "Entender ameaças para decidir a mitigação",
    description: "Ana e Rafael analisam atores, vetores, engenharia social, vulnerabilidades, indicadores, inteligência e defesas proporcionais.",
    duration: "~16 min",
    audioUrl: "/manus-storage/ep02-threats-vulnerabilities_87bb6e0d.wav",
    topics: [
      "atores e motivações",
      "vetores de ataque e engenharia social",
      "vulnerabilidades e exposição",
      "indicadores de atividade maliciosa",
      "segurança de aplicações",
      "inteligência de ameaças e mitigação",
    ],
    examWeight: "22% do exame",
    provenance: podcastProvenance("ep02-threats-vulnerabilities", "CyberCast 02 — Entender ameaças para decidir a mitigação"),
    transcript: [
      {
        speaker: "Ana",
        text: "Este é o segundo episódio do CyberCast Security+. O domínio Threats and Vulnerabilities vale vinte e dois por cento da prova e exige raciocínio de cenário. A questão pode contar uma história curta sobre uma pessoa, um dispositivo, uma mensagem ou um log. Seu trabalho é separar ator de ameaça, vetor de ataque, vulnerabilidade, indicador e controle. Quando esses conceitos se misturam, a alternativa correta parece confusa; quando você os separa, a decisão fica muito mais objetiva.",
      },
      {
        speaker: "Rafael",
        text: "Vamos começar pelo ator. Ator de ameaça é quem ou o que causa risco, enquanto vetor é o caminho usado para chegar ao alvo?",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Atores podem ser indivíduos internos, grupos criminosos organizados, ativistas, concorrentes desleais, agentes estatais, fornecedores comprometidos ou pessoas sem grande experiência técnica. A motivação ajuda a interpretar o cenário: ganho financeiro, espionagem, ideologia, vingança, curiosidade ou interrupção operacional. Um ator estatal pode ter recursos e persistência altos; um insider já conhece processos e dados; um grupo criminoso pode buscar escala e monetização. Não é para estereotipar: é para definir riscos e controles proporcionais.",
      },
      {
        speaker: "Rafael",
        text: "E a ameaça interna não é necessariamente mal-intencionada. Alguém pode errar, expor dados por descuido ou instalar software não autorizado. A consequência de segurança existe mesmo sem intenção criminosa.",
      },
      {
        speaker: "Ana",
        text: "Perfeito. Shadow IT, configurações improvisadas e credenciais compartilhadas criam exposição sem que a pessoa se enxergue como atacante. A prova também diferencia ameaça de vulnerabilidade. Ameaça é algo com potencial de explorar uma fraqueza. Vulnerabilidade é a fraqueza: software sem atualização, configuração permissiva, senha fraca, serviço legado, privilégio excessivo ou processo sem revisão. Risco surge da combinação entre probabilidade e impacto de uma ameaça explorar uma vulnerabilidade.",
      },
      {
        speaker: "Ana",
        text: "Os vetores são os caminhos. E-mail, páginas web, redes sem fio, mídia removível, aplicações expostas, APIs, dispositivos móveis, conexões remotas, cadeia de fornecedores e acesso físico são exemplos. Um phishing chega por e-mail; uma falha em aplicativo pode ser explorada pelo navegador; uma credencial vazada pode ser reutilizada em um portal; uma atualização comprometida de fornecedor pode introduzir risco pela cadeia de suprimentos. A mesma ameaça pode ter vetores diferentes, e o mesmo vetor pode ser usado por atores distintos.",
      },
      {
        speaker: "Rafael",
        text: "Então, se uma questão descreve uma ligação fingindo ser do suporte e pedindo um código de autenticação, o vetor é engenharia social por voz, e não simplesmente malware. O controle mais adequado pode ser conscientização e verificação fora de banda.",
      },
      {
        speaker: "Ana",
        text: "Isso. Engenharia social manipula decisões humanas. Phishing é a mensagem fraudulenta em massa; spear phishing é direcionado; whaling mira pessoas de alto perfil; smishing usa mensagem de texto; vishing usa voz. Pretexting cria uma história para obter informação ou ação. Baiting oferece uma isca aparentemente útil. Tailgating explora a entrada física seguindo alguém autorizado. Uma defesa madura combina treinamento contextual, processos de confirmação, filtro de mensagens, MFA resistente a phishing, limitação de privilégios e cultura em que pedir ajuda não gera punição automática.",
      },
      {
        speaker: "Rafael",
        text: "O objetivo é reduzir chance de sucesso sem culpar a pessoa. Se o processo permite uma alteração financeira só com um e-mail inesperado, a falha é também de controle organizacional.",
      },
      {
        speaker: "Ana",
        text: "Exato. Agora, vulnerabilidades técnicas. Sistemas sem patch podem conter falhas conhecidas; configurações padrão ou permissões abertas ampliam a superfície de ataque; aplicações mal projetadas podem falhar na validação de entrada, na autenticação, na sessão ou na autorização. Vulnerabilidade de dia zero é uma falha sem correção disponível ou conhecida publicamente no momento do abuso. CVE é um identificador público de vulnerabilidade, enquanto CVSS é uma forma de expressar severidade; nenhum dos dois substitui a análise de contexto do ativo da empresa.",
      },
      {
        speaker: "Ana",
        text: "Em segurança de aplicações, a prova espera que você reconheça classes de risco, não que execute ataques. Entrada sem validação pode levar a injeções; saída sem codificação adequada pode favorecer script entre sites; controle de acesso falho pode expor funções ou dados; dependências desatualizadas podem trazer vulnerabilidades; APIs sem autenticação, autorização, limitação e registro adequados ampliam risco. O caminho seguro é desenvolvimento com requisitos de segurança, revisão de código, testes, gestão de dependências, validação no lado do servidor e correções priorizadas.",
      },
      {
        speaker: "Rafael",
        text: "E quando falamos de malware, eu deveria reconhecer o objetivo e o comportamento. Ransomware busca impedir acesso até que haja extorsão; spyware coleta dados; trojan se disfarça de legítimo; worm se propaga; rootkit tenta ocultar presença; botnet reúne dispositivos controlados. Mas, em uma questão, o melhor passo costuma ser isolar e seguir resposta a incidentes, não agir impulsivamente.",
      },
      {
        speaker: "Ana",
        text: "Muito bem. Indicadores de atividade maliciosa são pistas, não sentenças isoladas. Consumo anormal de CPU, processos desconhecidos, alterações em arquivos críticos, criação inesperada de contas, falhas repetidas de autenticação, tráfego de saída incomum, consultas DNS estranhas, mudanças em regras de segurança e alertas de EDR merecem investigação. Um indicador de comprometimento, ou IOC, pode ser um hash, domínio, endereço, certificado ou padrão observado. Já uma TTP, tática, técnica e procedimento, descreve comportamento mais amplo do adversário.",
      },
      {
        speaker: "Rafael",
        text: "Ou seja, bloquear um domínio pode ajudar hoje, mas entender a técnica de persistência ou de movimentação lateral ajuda a montar detecções mais duráveis. É por isso que frameworks como MITRE ATT&CK aparecem como referência de comportamento.",
      },
      {
        speaker: "Ana",
        text: "Sim. Inteligência de ameaças transforma dados em contexto acionável. Fontes podem ser internas, como tickets, logs e incidentes anteriores, ou externas, como alertas de fornecedores, comunidades e relatórios. A qualidade importa: uma informação deve ser avaliada por relevância, confiabilidade, atualidade e aplicabilidade. A inteligência estratégica informa decisões de liderança; a tática apoia controles e detecções; a operacional ajuda a entender campanhas em curso; a técnica traz IOCs e detalhes observáveis. Não se trata de colecionar feeds, mas de melhorar decisões.",
      },
      {
        speaker: "Ana",
        text: "Quando uma vulnerabilidade é encontrada, priorize. Inventarie o ativo, confirme se ele está exposto, avalie criticidade, impacto para o negócio, existência de exploração conhecida, controles já presentes e urgência da correção. O ciclo de gestão de vulnerabilidades inclui descoberta, validação, classificação, priorização, remediação, verificação e reporte. Atualizar é importante, mas pode exigir teste, janela de mudança e plano de reversão. Para risco imediato, uma mitigação temporária, como segmentar ou desabilitar um serviço, pode ser apropriada enquanto a correção é preparada.",
      },
      {
        speaker: "Rafael",
        text: "Isso evita a armadilha de dizer que todo item com CVSS alto deve ser corrigido antes de qualquer outro. Um sistema crítico exposto, com exploração ativa, merece prioridade maior que um item semelhante isolado e protegido por várias camadas.",
      },
      {
        speaker: "Ana",
        text: "Correto. Mitigação pode ser técnica, processual e humana. Hardening remove serviços e privilégios desnecessários. Segmentação limita alcance. EDR e antimalware ajudam a detectar e conter comportamentos suspeitos. Firewall de aplicação pode reduzir exposição de alguns riscos web. Backup imutável e testado sustenta recuperação. MFA reduz o impacto de senha comprometida. Princípio do menor privilégio diminui o dano de uma conta abusada. Monitoramento e logs confiáveis tornam a investigação possível. Uma única ferramenta raramente resolve tudo.",
      },
      {
        speaker: "Ana",
        text: "Também considere ataques à cadeia de suprimentos. Um fornecedor, biblioteca, serviço gerenciado ou atualização pode introduzir risco no ambiente. A resposta inclui avaliação de terceiros, inventário de componentes, requisitos contratuais de segurança, assinatura e validação de atualizações, segmentação, monitoramento e planos de contingência. Em qualquer cenário, evite respostas absolutas: bloquear toda a internet ou desligar sistemas críticos sem avaliar impacto pode criar um novo problema de disponibilidade.",
      },
      {
        speaker: "Rafael",
        text: "Vou usar uma sequência para resolver questões: identificar quem está envolvido, qual caminho foi usado, qual fraqueza existe, quais sinais foram vistos e qual controle reduz melhor o risco sem quebrar a operação. Depois verifico se a alternativa fala de prevenção, detecção, contenção ou recuperação.",
      },
      {
        speaker: "Ana",
        text: "Excelente. Guarde também estes pares: ameaça explora vulnerabilidade; vetor é o caminho; IOC é evidência observável; TTP é padrão de comportamento; CVE identifica uma falha; CVSS ajuda a estimar severidade; mitigação reduz exposição; remediação elimina ou corrige a causa. No próximo episódio, vamos desenhar a arquitetura que mantém identidades, redes, nuvem e dispositivos protegidos mesmo quando o ambiente é híbrido e distribuído."
      },
    ],
  },
  {
    id: "ep03-security-architecture",
    domainCode: "DOM3",
    domainTitle: "Security Architecture",
    episodeNumber: 3,
    title: "Arquitetura que protege sem travar o negócio",
    description: "Ana e Rafael percorrem redes, IAM, nuvem, dispositivos, resiliência e Zero Trust para montar uma defesa em profundidade.",
    duration: "~15 min",
    audioUrl: "/manus-storage/ep03-security-architecture_d3ce9cfb.wav",
    topics: [
      "design de rede seguro",
      "IAM e controle de acesso",
      "cloud, containers, mobile e IoT",
      "Wi-Fi, VPN e NAC",
      "resiliência, backup e recuperação",
      "arquitetura híbrida e Zero Trust",
    ],
    examWeight: "18% do exame",
    provenance: podcastProvenance("ep03-security-architecture", "CyberCast 03 — Arquitetura que protege sem travar o negócio"),
    transcript: [
      {
        speaker: "Ana",
        text: "No terceiro episódio do CyberCast Security+, vamos tratar Security Architecture, dezoito por cento do exame. Arquitetura não é uma coleção de caixas e linhas num diagrama. É o conjunto de decisões que define como pessoas, aplicações, dados, redes e dispositivos interagem de forma segura e resiliente. A melhor arquitetura não é necessariamente a mais cara; é a que atende o risco, o negócio, a operação e a capacidade de recuperação sem depender de uma única barreira.",
      },
      {
        speaker: "Rafael",
        text: "Então, quando a prova descreve uma organização híbrida, com usuários remotos, aplicações na nuvem e dados sensíveis, eu devo buscar uma combinação de camadas, não uma tecnologia milagrosa.",
      },
      {
        speaker: "Ana",
        text: "Isso. Comece pela segmentação. Uma rede plana permite que um problema em uma área alcance muitas outras. Segmentação separa zonas conforme função, criticidade e nível de confiança: usuários, servidores, administração, convidados, desenvolvimento, produção e sistemas industriais, por exemplo. VLANs, sub-redes, listas de controle e firewalls ajudam a criar limites. Microsegmentação vai além, controlando comunicações mais específicas entre cargas de trabalho. O objetivo é reduzir movimento lateral e facilitar aplicação de políticas.",
      },
      {
        speaker: "Rafael",
        text: "Mas segmentar não significa deixar cada setor isolado sem comunicação. Precisamos permitir os fluxos necessários e negar o restante, documentando dependências de negócio.",
      },
      {
        speaker: "Ana",
        text: "Correto. Essa lógica é conhecida como deny by default ou negação por padrão: somente o tráfego explicitamente necessário é permitido. Uma DMZ é outro padrão de arquitetura. Serviços que precisam receber conexões externas, como um portal público, podem ficar em uma zona separada, com regras restritas entre internet, DMZ e rede interna. Assim, a exposição inevitável de um serviço não dá acesso direto aos sistemas mais sensíveis. A questão costuma valorizar redução de superfície de ataque e separação de confiança.",
      },
      {
        speaker: "Ana",
        text: "Os controles de rede também precisam ter papéis claros. Firewall filtra tráfego conforme regras. Um firewall de próxima geração pode agregar inspeção e reconhecimento de aplicações. IDS detecta padrões ou anomalias e alerta; IPS pode bloquear de acordo com a política. Proxy intermedeia acesso, ajuda a controlar navegação e pode aplicar políticas. Network Access Control, ou NAC, avalia identidade e postura do dispositivo antes ou durante a entrada na rede. Nenhum deles elimina a necessidade de registro, revisão e resposta operacional.",
      },
      {
        speaker: "Rafael",
        text: "NAC seria útil quando uma empresa quer garantir que só dispositivos gerenciados, atualizados e com proteção ativa usem a rede corporativa. Se o equipamento não atende, pode ir para uma rede de remediação ou receber acesso limitado.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Em conectividade sem fio, segurança começa no desenho. Rede de convidados deve ser separada da corporativa. Protocolos modernos de proteção Wi-Fi, autenticação forte e gerenciamento central reduzem risco. Evite confundir esconder o nome da rede com controle robusto: não é uma defesa suficiente. Para acesso remoto, VPN cria um túnel protegido entre cliente e ambiente, mas não deve conceder confiança irrestrita. Com autenticação multifator, postura de dispositivo, menor privilégio e segmentação, a VPN se torna uma parte de uma estratégia maior, não a estratégia inteira.",
      },
      {
        speaker: "Ana",
        text: "Isso nos leva a identidade. Em arquitetura moderna, identidade é um perímetro importante, mas não o único. IAM, Identity and Access Management, organiza o ciclo de vida das contas: criação, alteração, concessão, revisão e remoção de acesso. Uma conta precisa refletir uma pessoa, serviço ou processo legítimo; contas genéricas prejudicam rastreabilidade. RBAC facilita conceder permissões por função. ABAC permite decisões mais contextuais. Recertificações de acesso e desprovisionamento rápido reduzem privilégios acumulados e contas órfãs.",
      },
      {
        speaker: "Rafael",
        text: "E contas privilegiadas exigem atenção especial, porque uma única credencial administrativa comprometida pode afetar muitos sistemas. Aí entra PAM, com cofre, aprovação, sessões monitoradas e privilégio temporário.",
      },
      {
        speaker: "Ana",
        text: "Muito bem. Privileged Access Management reduz risco de administração ao evitar uso permanente e indiscriminado de credenciais de alto impacto. O princípio de separação de funções também importa: quem solicita, aprova e executa uma mudança crítica não deveria, idealmente, ser a mesma pessoa. SSO torna a experiência mais simples e reduz repetição de senhas, enquanto federação permite estender confiança entre domínios. Entretanto, centralizar identidade aumenta a importância de disponibilidade, logs e proteção desse provedor.",
      },
      {
        speaker: "Ana",
        text: "Agora, nuvem. O modelo de responsabilidade compartilhada é recorrente. O provedor protege partes da infraestrutura conforme o serviço contratado, mas o cliente continua responsável por identidades, configurações, dados, permissões e uso seguro da plataforma. Em IaaS, o cliente costuma gerenciar mais componentes do que em SaaS. A pergunta correta não é apenas 'está na nuvem?', e sim 'quem protege qual camada?'. Erros de configuração e permissões excessivas continuam sendo riscos mesmo em provedores maduros.",
      },
      {
        speaker: "Rafael",
        text: "Portanto, um armazenamento em nuvem exposto por política pública indevida não é necessariamente falha do provedor. É um problema de configuração, governança e monitoramento do cliente.",
      },
      {
        speaker: "Ana",
        text: "Isso mesmo. Para workloads em nuvem, aplique identidade forte, contas separadas por ambiente, rede privada quando adequada, registros de auditoria, criptografia e gestão de chaves. Em containers, a imagem, o registro, as dependências, os segredos e a orquestração precisam de controle. Imagens mínimas e verificadas reduzem superfície de ataque; segredos não devem ficar expostos em código ou imagens; permissões de runtime precisam ser restritas. Container não é automaticamente seguro apenas por estar isolado: ele depende da configuração e do ecossistema.",
      },
      {
        speaker: "Ana",
        text: "Dispositivos móveis, IoT e sistemas embarcados introduzem outras limitações. Podem ter poucos recursos, ciclo de atualização irregular ou função operacional sensível. Inventário, segmentação, configurações seguras, atualização viável, controle de acesso e monitoramento são essenciais. Para celulares corporativos, MDM ou UEM pode aplicar criptografia, bloqueio, postura e remoção seletiva de dados corporativos. Para IoT, muitas vezes a arquitetura mais segura é separar o dispositivo em uma rede controlada e limitar estritamente com quem ele conversa.",
      },
      {
        speaker: "Rafael",
        text: "Então não basta dizer 'coloque um sensor IoT na rede'. Antes eu preciso saber qual dado ele trata, qual serviço precisa alcançar, como será atualizado, quem administra e qual é o plano se o fabricante encerrar suporte.",
      },
      {
        speaker: "Ana",
        text: "Perfeita abordagem. Arquitetura é também gestão de ciclo de vida. Agora vamos falar de dados. Classificação determina o nível de proteção esperado: público, interno, confidencial ou restrito, conforme a política da organização. O dado deve ser protegido em repouso, em trânsito e, quando aplicável, em uso. Criptografia, controle de acesso, tokenização, mascaramento e prevenção de perda de dados podem ser escolhidos conforme o contexto. O princípio é minimizar coleta e retenção: não manter informação sensível sem necessidade operacional ou legal.",
      },
      {
        speaker: "Ana",
        text: "Resiliência é a capacidade de continuar ou retomar serviços. Alta disponibilidade usa redundância para reduzir interrupções: componentes duplicados, balanceamento, múltiplas zonas ou caminhos alternativos. Tolerância a falhas procura manter a operação mesmo quando uma parte falha. Um site alternativo pode ser cold, warm ou hot, dependendo de infraestrutura, dados e prontidão. RTO, objetivo de tempo de recuperação, define quanto tempo o serviço pode ficar indisponível. RPO, objetivo de ponto de recuperação, define quanta perda de dados é aceitável.",
      },
      {
        speaker: "Rafael",
        text: "Se um sistema tem RPO de uma hora, a estratégia precisa limitar a perda de dados a aproximadamente uma hora. Se o RTO é baixo, um backup guardado sem teste talvez não seja suficiente para a necessidade do negócio.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Backup não é sinônimo de recuperação. É preciso definir escopo, frequência, proteção, retenção, cópias fora do ambiente principal e, principalmente, testar restaurações. A regra três-dois-um é uma referência útil: três cópias, em dois tipos de mídia, uma fora do local principal. Em cenários de extorsão, cópias isoladas ou imutáveis podem reduzir o risco de que o próprio backup seja alterado. Mas o teste revela se a organização consegue recuperar dados íntegros dentro do tempo prometido.",
      },
      {
        speaker: "Ana",
        text: "Uma arquitetura híbrida integra recursos locais e serviços em nuvem. Ela exige visibilidade consistente, identidade integrada, segmentação, proteção de dados, conectividade segura e governança de configuração. O Zero Trust conecta todas essas decisões: verificação explícita, menor privilégio e suposição de violação. Em vez de conceder acesso amplo porque o dispositivo está no escritório, a política considera usuário, dispositivo, recurso, risco e comportamento. Esse modelo é especialmente útil quando o perímetro tradicional deixa de representar onde o trabalho acontece.",
      },
      {
        speaker: "Rafael",
        text: "Para questões de arquitetura, vou perguntar: quais ativos são mais críticos, onde estão as fronteiras de confiança, que comunicações são necessárias, como identidade é validada, como o acesso é limitado, como dados são protegidos e como o serviço se recupera. A alternativa correta deve reduzir risco em camadas e respeitar a operação.",
      },
      {
        speaker: "Ana",
        text: "Esse é o mapa mental certo. Lembre os pares: segmentação reduz alcance; DMZ separa exposição pública; NAC avalia entrada na rede; IAM governa acesso; PAM protege privilégios; responsabilidade compartilhada define papéis na nuvem; MDM gerencia dispositivos móveis; RTO mede tempo, RPO mede perda de dados; e Zero Trust substitui confiança implícita por decisões contínuas. No próximo episódio, entramos no domínio de maior peso: operações de segurança, onde sinais, processos e evidências se transformam em resposta coordenada."
      },
    ],
  },
  {
    id: "ep04-security-operations",
    domainCode: "DOM4",
    domainTitle: "Security Operations",
    episodeNumber: 4,
    title: "Da detecção à recuperação: operação baseada em evidências",
    description: "Ana e Rafael ligam monitoramento, SIEM, resposta a incidentes, ativos, forense, automação e recuperação em uma rotina operacional madura.",
    duration: "~15 min",
    audioUrl: "/manus-storage/ep04-security-operations_90f7cff1.wav",
    topics: [
      "monitoramento e baseline",
      "SIEM, SOAR e evidências",
      "resposta a incidentes",
      "gestão de ativos e vulnerabilidades",
      "forense e cadeia de custódia",
      "backup, recuperação e automação",
    ],
    examWeight: "28% do exame",
    provenance: podcastProvenance("ep04-security-operations", "CyberCast 04 — Da detecção à recuperação"),
    transcript: [
      {
        speaker: "Ana",
        text: "Chegamos ao domínio com maior peso na Security+: Security Operations, vinte e oito por cento da prova. Aqui, conhecimento técnico vira rotina confiável. Operações de segurança envolvem saber o que existe no ambiente, estabelecer como o comportamento normal se parece, coletar sinais úteis, investigar com método, responder de modo proporcional, preservar evidências e restaurar serviços. Uma ferramenta sozinha não é uma operação; pessoas, processos, dados e tecnologia precisam trabalhar juntos.",
      },
      {
        speaker: "Rafael",
        text: "Então o primeiro desafio é visibilidade. Se não sei quais ativos, contas, dados e serviços existem, não consigo proteger, monitorar ou recuperar direito.",
      },
      {
        speaker: "Ana",
        text: "Perfeito. Gestão de ativos cobre hardware, software, dados, identidades e serviços. Um inventário registra proprietário, localização lógica ou física, criticidade, versão, ciclo de vida e dependências. Sem ele, patching deixa lacunas, licenças ficam fora de controle e incidentes demoram mais para ser contidos. A configuração também importa: uma baseline define o estado aprovado de um sistema. Comparar o estado atual com a baseline ajuda a detectar mudanças não autorizadas, desvios e degradação de segurança.",
      },
      {
        speaker: "Ana",
        text: "Monitoramento começa com telemetria bem escolhida. Logs de identidade mostram autenticações e alterações de privilégio. Logs de endpoint mostram processos e eventos relevantes. Logs de rede mostram conexões e padrões. Logs de aplicações e nuvem revelam ações em serviços e dados. Para serem úteis, precisam de horário sincronizado, integridade, retenção adequada, acesso controlado e contexto. Registrar tudo sem priorização cria ruído; registrar pouco demais deixa pontos cegos. O desenho deve seguir risco e objetivos de detecção.",
      },
      {
        speaker: "Rafael",
        text: "E baseline não é uma regra imutável. Ela representa o comportamento esperado, mas precisa ser revisada quando o negócio muda. Um pico de tráfego pode ser ataque ou uma campanha legítima; o contexto é que decide.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Um SIEM centraliza, normaliza e correlaciona eventos de várias fontes. Ele pode encontrar relações que uma pessoa não veria em logs isolados, como falhas de login seguidas por acesso bem-sucedido de origem incomum e criação de nova permissão. Mas correlação não é verdade automática: alertas precisam de triagem. O analista verifica ativos envolvidos, usuário, horário, histórico, inteligência de ameaças, impacto potencial e falsos positivos. Métricas como volume de alertas e tempo de resposta ajudam a melhorar o processo.",
      },
      {
        speaker: "Ana",
        text: "SOAR, Security Orchestration, Automation and Response, complementa esse trabalho. Ele conecta ferramentas e playbooks para automatizar etapas repetitivas: enriquecer um alerta, consultar contexto, abrir um ticket, notificar responsáveis ou executar uma ação previamente aprovada. Automação reduz tempo e inconsistência, mas deve ter limites. Ações de alto impacto, como isolar um ativo crítico, precisam de critérios, validação e possibilidade de reversão. Automatizar um processo ruim apenas torna o erro mais rápido.",
      },
      {
        speaker: "Rafael",
        text: "Então playbook é uma sequência padronizada para um tipo de evento, enquanto runbook tende a ser um guia operacional mais detalhado. Ambos evitam que a resposta dependa só da memória de alguém sob pressão.",
      },
      {
        speaker: "Ana",
        text: "Ótima distinção. Um playbook de phishing pode orientar triagem da mensagem, validação de destinatários, preservação de evidências, remoção segura e comunicação. Um runbook pode detalhar responsáveis, sistemas, aprovações, comandos autorizados e critérios de escalonamento. A Security+ cobra o ciclo de resposta a incidentes: preparação; detecção e análise; contenção; erradicação; recuperação; e lições aprendidas. Às vezes os nomes variam, mas o raciocínio permanece: preparar antes, entender antes de destruir evidências, limitar impacto, remover causa, restaurar e melhorar.",
      },
      {
        speaker: "Rafael",
        text: "Se vejo um possível comprometimento, não devo sair apagando arquivos ou reiniciando máquinas sem pensar. Primeiro sigo o plano, preservo o que for relevante, registro decisões e contenho de acordo com o impacto e a criticidade.",
      },
      {
        speaker: "Ana",
        text: "Isso é essencial. A contenção pode ser de curto prazo, para limitar dano rapidamente, e de longo prazo, para manter uma solução sustentável enquanto a causa é tratada. Isolar uma estação não é igual a desligar indiscriminadamente uma rede inteira. A decisão avalia propagação, continuidade do negócio, evidências, dependências e segurança das pessoas. Depois, erradicação remove persistência, vulnerabilidade explorada, credenciais ou componentes maliciosos identificados. Recuperação restaura serviços de fontes confiáveis e reforça monitoramento para confirmar que o ambiente voltou a um estado seguro.",
      },
      {
        speaker: "Ana",
        text: "Forense digital tem como foco coletar e analisar evidências de maneira que preserve sua utilidade técnica e, quando necessário, jurídica. Cadeia de custódia registra quem coletou, quando, como, onde a evidência foi armazenada e cada transferência ou acesso. Integridade pode ser demonstrada com hashes de imagens ou arquivos de evidência. A regra é minimizar alterações no material original e documentar o método. A análise pode observar memória, disco, logs, rede e artefatos de aplicação, sempre dentro de autorização e escopo apropriados.",
      },
      {
        speaker: "Rafael",
        text: "Na prova, se a alternativa fala em preservar potencial evidência, documentar a cadeia de custódia e usar uma cópia de trabalho, ela tende a ser melhor que uma ação que modifica o sistema sem registro.",
      },
      {
        speaker: "Ana",
        text: "Correto. Gestão de vulnerabilidades também é uma operação contínua. Descoberta identifica ativos e fraquezas; validação reduz falsos positivos; priorização considera exposição, criticidade, exploração ativa e controles existentes; remediação aplica patch, troca configuração, remove software ou substitui componente; verificação confirma o resultado. Scanner é uma fonte importante, mas não substitui inventário, análise de risco e gestão de mudanças. Uma vulnerabilidade pode ser mitigada temporariamente por segmentação ou desabilitação de serviço até que a correção definitiva seja testada.",
      },
      {
        speaker: "Ana",
        text: "Em operações, dados também precisam de ciclo de vida. Classificação orienta proteção; retenção define por quanto tempo dados e logs ficam disponíveis; descarte seguro elimina informação quando não é mais necessária. Sanitização pode significar limpeza, purga, destruição física ou outros métodos conforme mídia, política e risco. A ideia é que apagar um arquivo de uma interface não garante que o dado não exista em backups, snapshots ou registros. A organização deve tratar descarte e retenção como processos auditáveis.",
      },
      {
        speaker: "Rafael",
        text: "E backup entra antes do incidente. A resposta pode depender de cópias protegidas, mas o plano precisa definir RTO, RPO, responsáveis e testes. Caso contrário, a descoberta de que um backup não restaura chega tarde demais.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Continuidade operacional inclui backups, redundância, planos de recuperação de desastre, comunicação de crise e exercícios. Recuperar não é só ligar sistemas: é validar dados, dependências, identidade, integrações e segurança antes de declarar normalidade. Depois do incidente, as lições aprendidas analisam o que funcionou, o que falhou, como reduzir tempo de detecção e resposta, quais controles devem mudar e quem precisa ser informado. Isso fecha o ciclo e transforma um evento difícil em melhoria mensurável.",
      },
      {
        speaker: "Ana",
        text: "Ferramentas de endpoint, rede, nuvem e identidade geram sinais complementares. EDR foca visibilidade e resposta em endpoints; sistemas de detecção de rede observam tráfego; DLP tenta reduzir saída indevida de dados; CASB ou controles de segurança de acesso à nuvem ajudam a aplicar políticas sobre uso de serviços cloud; scanners identificam vulnerabilidades. Na prova, escolha a ferramenta pela necessidade expressa. Se o problema é atividade suspeita em uma estação, uma resposta focada em endpoint costuma ser mais direta que uma solução apenas de filtragem web.",
      },
      {
        speaker: "Rafael",
        text: "E métricas evitam medir só quantidade. Número de alertas fechados não prova eficácia se os mais críticos demoram. Faz mais sentido olhar cobertura, qualidade das detecções, tempo médio de detectar, investigar, conter e recuperar, além de recorrência de causas.",
      },
      {
        speaker: "Ana",
        text: "Perfeito. Métricas precisam informar decisão, não apenas gerar relatório. Uma operação madura reduz ruído, prioriza pelo risco, documenta ações e preserva capacidade de aprender. Guarde a sequência: inventariar, estabelecer baseline, coletar e correlacionar, triar, responder com playbooks, preservar evidências, recuperar com segurança e revisar lições. No próximo episódio, fecharemos a série principal com governança, risco, conformidade, auditoria e treinamento: os elementos que tornam segurança sustentável ao longo do tempo."
      },
    ],
  },
  {
    id: "ep05-program-management",
    domainCode: "DOM5",
    domainTitle: "Program Management",
    episodeNumber: 5,
    title: "Governança que transforma segurança em prática contínua",
    description: "Ana e Rafael fecham a preparação explorando governança, risco, auditoria, privacidade, terceiros e a cultura que sustenta controles.",
    duration: "~15 min",
    audioUrl: "/manus-storage/ep05-program-management_f9ca8788.wav",
    topics: [
      "governança e políticas",
      "gestão de riscos",
      "conformidade e auditoria",
      "métricas e reporte",
      "terceiros, privacidade e dados",
      "pessoas, treinamento e conscientização",
    ],
    examWeight: "20% do exame",
    provenance: podcastProvenance("ep05-program-management", "CyberCast 05 — Governança que transforma segurança em prática contínua"),
    transcript: [
      {
        speaker: "Ana",
        text: "Bem-vindos ao quinto episódio do CyberCast Security+. Program Management representa vinte por cento do exame e mostra por que segurança não é só tecnologia. Um firewall pode estar bem configurado e ainda assim falhar como estratégia se não houver responsabilidade, política, gestão de risco, treinamento, orçamento, auditoria e melhoria contínua. Governança cria direção e prestação de contas. Gestão de risco ajuda a escolher prioridades. Conformidade demonstra aderência a requisitos. Pessoas transformam tudo isso em comportamento diário.",
      },
      {
        speaker: "Rafael",
        text: "Então este domínio liga o trabalho técnico à organização. Em vez de perguntar apenas como bloquear algo, eu preciso entender quem decide, por que a decisão é necessária e como provar que ela funcionou.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Comecemos pela hierarquia documental. Uma política expressa uma intenção ou regra de alto nível, aprovada pela liderança. Um padrão estabelece requisitos específicos e obrigatórios para aplicar a política. Um procedimento descreve passos repetíveis para realizar uma atividade. Uma diretriz, ou guideline, recomenda uma boa prática, mas tende a ser mais flexível. Por exemplo, uma política pode exigir proteção de dados sensíveis; o padrão pode exigir criptografia aprovada; o procedimento descreve como configurar e revisar; a diretriz sugere hábitos complementares de trabalho seguro.",
      },
      {
        speaker: "Rafael",
        text: "Se a questão pede uma regra abrangente, devo pensar em política. Se pede uma configuração técnica mínima obrigatória, padrão. Se pede instruções passo a passo, procedimento. Essa diferença evita muitas respostas por semelhança de palavras.",
      },
      {
        speaker: "Ana",
        text: "Boa regra. Governança define também papéis. A liderança estabelece direção, apetite de risco e recursos. O gestor de segurança traduz isso em programa, controles, métricas e comunicação. Donos de ativos entendem valor e criticidade do que administram. Donos de dados definem classificação e uso apropriado. Equipes técnicas implementam e operam. Auditoria avalia com independência. Quando responsabilidades ficam vagas, controles podem existir no papel e não funcionar na prática. Responsabilidade precisa ser atribuída, comunicada e revisada.",
      },
      {
        speaker: "Ana",
        text: "Gestão de risco começa identificando ativos, ameaças, vulnerabilidades, impactos e controles existentes. Um risco pode ser descrito como a possibilidade de um evento afetar objetivos. A análise qualitativa usa categorias como baixo, médio e alto; a quantitativa tenta estimar valores, frequência e perdas. Não é necessário decorar uma fórmula para compreender o objetivo: apoiar decisões coerentes. Um sistema de folha de pagamento e um portal de teste não têm o mesmo impacto, mesmo que compartilhem uma vulnerabilidade semelhante.",
      },
      {
        speaker: "Rafael",
        text: "E apetite de risco é quanto risco a organização aceita de modo amplo, enquanto tolerância é a variação aceitável em uma situação ou objetivo mais específico. Isso ajuda a decidir quando um risco pode ser aceito e quando precisa de tratamento.",
      },
      {
        speaker: "Ana",
        text: "Perfeito. Há quatro respostas clássicas a risco: mitigar, reduzindo probabilidade ou impacto com controles; transferir, por exemplo com contrato ou seguro, sem eliminar a responsabilidade de gestão; evitar, interrompendo a atividade que cria exposição inaceitável; e aceitar, quando o risco residual está dentro do apetite e a decisão é registrada. Aceitar não é ignorar. Exige justificativa, proprietário, prazo de revisão e aprovação adequada. A prova costuma preferir alternativas que tratam risco proporcionalmente e documentam a decisão.",
      },
      {
        speaker: "Ana",
        text: "Business Impact Analysis, ou BIA, ajuda a entender consequências de interrupções. Ela identifica processos críticos, dependências, impactos financeiros, legais, reputacionais e operacionais, além de objetivos como RTO e RPO. A análise de risco olha ameaças e vulnerabilidades; a BIA olha consequência para o negócio. Juntas, elas informam continuidade, recuperação de desastre, priorização de controles e comunicação com a liderança. Um plano de continuidade eficiente não é uma pasta esquecida: ele é exercitado, atualizado e conectado à realidade do negócio.",
      },
      {
        speaker: "Rafael",
        text: "Então, se uma aplicação suporta atendimento emergencial, seu RTO pode ser muito menor que o de um sistema de relatórios internos. A prioridade de recuperação deve refletir impacto, e não preferência pessoal da equipe técnica.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Conformidade reúne obrigações legais, regulatórias, contratuais e internas. Em proteção de dados, a organização deve entender quais dados pessoais trata, para qual finalidade, por quanto tempo, com qual base legítima e quais controles limitam acesso, exposição e uso indevido. Privacidade by design incentiva considerar esses requisitos desde o início de um produto ou processo, em vez de tentar corrigir tudo depois. Minimização de dados, classificação, retenção e descarte seguro reduzem tanto o risco quanto o custo de uma exposição.",
      },
      {
        speaker: "Ana",
        text: "Auditoria é uma avaliação estruturada de aderência, controle e evidência. Uma auditoria interna pode ajudar a organização a avaliar seus próprios processos. Uma auditoria externa fornece perspectiva independente ou atende exigência de cliente, certificação, regulação ou contrato. O auditor procura evidências: políticas aprovadas, registros de treinamento, logs, relatórios de acesso, resultados de testes, atas de revisão, inventários e documentação de exceções. A melhor postura não é esconder falhas; é demonstrar que elas foram identificadas, tratadas, acompanhadas e aprendidas.",
      },
      {
        speaker: "Rafael",
        text: "A evidência precisa ser confiável, atual e ligada ao requisito. Dizer que existe uma política não prova que ela foi comunicada, seguida ou revisada. É preciso mostrar o ciclo completo.",
      },
      {
        speaker: "Ana",
        text: "Sim. Métricas tornam esse ciclo visível. KPI mede desempenho de uma atividade ou objetivo, como percentual de treinamentos concluídos ou tempo de aplicação de correções críticas. KRI indica aumento de exposição ou tendência de risco, como crescimento de contas privilegiadas sem revisão ou de tentativas de fraude. Métricas devem ter definição, dono, periodicidade, contexto e ação esperada. Um painel que apenas coleciona números não melhora segurança; um painel bem usado orienta decisão, investimento e priorização.",
      },
      {
        speaker: "Ana",
        text: "Terceiros precisam entrar no programa de risco. Fornecedores podem acessar dados, hospedar serviços, desenvolver software, processar pagamentos ou fornecer componentes essenciais. Antes da contratação, a organização avalia criticidade, práticas de segurança, privacidade, continuidade, subcontratados e histórico. Contratos podem estabelecer requisitos, notificação de incidentes, direito de auditoria, proteção de dados, níveis de serviço e retorno ou descarte de informações ao fim da relação. Transferir uma atividade para fora não transfere todo o risco para fora.",
      },
      {
        speaker: "Rafael",
        text: "E documentos como SLA, acordo de nível de serviço, definem expectativa mensurável de serviço. Um MOU registra entendimento entre partes. Mas nenhum documento substitui validação contínua de que o fornecedor realmente atende ao que prometeu.",
      },
      {
        speaker: "Ana",
        text: "Muito bem. Agora, pessoas. Segurança começa no ciclo de vida do colaborador: verificação apropriada conforme política e lei, onboarding com acesso mínimo, treinamento, mudanças de função com revisão de permissões e offboarding rápido, com remoção de acesso e devolução de ativos. Separação de funções, férias obrigatórias ou rotação podem reduzir algumas formas de fraude e aumentar revisão independente. As medidas devem ser proporcionais, respeitar privacidade e seguir legislação e política da organização.",
      },
      {
        speaker: "Ana",
        text: "Conscientização não é um curso anual marcado como concluído. É comunicação contínua, relevante para a função e medida por comportamento. Simulações éticas de phishing, orientações para reportar mensagens suspeitas, treinamento para administradores, práticas de mesa para resposta a incidentes e revisão de políticas podem criar memória organizacional. A cultura desejada faz com que as pessoas relatem erros e dúvidas cedo. Se o ambiente pune todo relato, os sinais chegam tarde e o risco cresce em silêncio.",
      },
      {
        speaker: "Rafael",
        text: "Isso muda a visão: uma pessoa que comunica um possível erro rapidamente é parte da defesa. O programa deve tornar o caminho seguro também o caminho mais fácil de seguir.",
      },
      {
        speaker: "Ana",
        text: "Exatamente. Comunicação de risco adapta a linguagem ao público. A liderança precisa de impacto, tendência, decisões e recursos necessários. Equipes técnicas precisam de requisitos, procedimentos e contexto operacional. Usuários precisam de orientações claras e acionáveis. Em uma crise, comunicação deve ser coordenada, factual e definida por papéis; mensagens improvisadas podem criar problemas legais, reputacionais e operacionais. Também é importante preservar confidencialidade de detalhes sensíveis durante a apuração.",
      },
      {
        speaker: "Ana",
        text: "Para a prova, conecte os termos aos propósitos. Política dá direção; padrão define o mínimo obrigatório; procedimento descreve execução; risco orienta prioridade; BIA mostra impacto; auditoria examina evidência; conformidade atende obrigações; KPI mede desempenho; KRI sinaliza exposição; terceiro amplia a superfície de risco; treinamento reforça comportamento; e governança mantém responsabilidade e melhoria contínua. Segurança sustentável acontece quando essas peças se apoiam, e não quando cada área trabalha isolada.",
      },
      {
        speaker: "Rafael",
        text: "Fechando a série: primeiro entendi princípios, controles, identidade e criptografia. Depois aprendi a ler atores, vetores, vulnerabilidades e indicadores. Em seguida, vi como arquitetura protege redes, nuvem e dispositivos. Depois, como operações detectam, respondem e recuperam. Agora vejo como governança, risco, auditoria e pessoas tornam tudo repetível. A Security+ cobra integração, não memorização desconectada.",
      },
      {
        speaker: "Ana",
        text: "É essa a conclusão. Use os cinco episódios como revisão ativa: pause, explique o conceito com suas palavras, relacione-o a uma questão e procure qual objetivo ele protege. Depois siga para as aulas, quizzes, laboratórios seguros e simulados da CyberDimension Academy. O podcast é uma trilha de reforço, não um atalho isolado. Obrigada por estudar com a gente, Rafael, e a você que nos acompanha. Boa preparação e decisões de segurança cada vez mais conscientes."
      },
    ],
  },
];

export const podcastEpisodes: readonly PodcastEpisode[] = [
  ...podcastCoreEpisodes,
  ...podcastDeepDiveEpisodes,
  ...podcastFullSeriesEpisodes,
  ...podcastBatchFourEpisodes,
  ...podcastSeasonTwoEpisodes,
  ...podcastSeasonThreeEpisodes,
  ...podcastBonusEpisodes,
  ...podcastRaioxEpisodes,
  {
    id: "ep68-english-for-cyber-pros",
    domainCode: "DOM1",
    domainTitle: "General Security Concepts",
    episodeNumber: 68,
    title: "ESPECIAL: English for Cyber Pros — pronúncia técnica e entrevista simulada",
    description: "Edição especial de inglês técnico: Ana e Rafael treinam a pronúncia dos termos mais cobrados em inglês (phishing, ransomware, threat, breach) e simulam uma entrevista completa para vaga internacional de SOC Analyst, com vocabulário, respostas modelo e dicas de prática.",
    audioUrl: "/manus-storage/ep68-english-for-cyber-pros_bae9287d.wav",
    duration: "5m10s",
    topics: ["inglês técnico", "pronúncia", "entrevista de emprego", "SOC Analyst", "vocabulário profissional"],
    examWeight: "Competência profissional complementar",
    provenance: {
      id: "podcast-ep68-english-for-cyber-pros",
      origin: "proprio",
      category: "Podcast educacional próprio",
      title: "CyberCast 68 — English for Cyber Pros: pronúncia técnica e entrevista simulada",
      source: "CyberDimension Academy",
      license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
      usage: "Episódio especial autoral em áudio e transcrição acessível sobre inglês técnico para entrevistas internacionais em cibersegurança.",
    },
    transcript: ep68Transcript,
    series: "english",
  },
  {
    ...ep69Episode,
    transcript: ep69Transcript,
    series: "english",
  },
  {
    ...ep70Episode,
    transcript: ep70Transcript,
    series: "english",
  },
  {
    ...ep71Episode,
    transcript: ep71Transcript,
    series: "english",
  },
  {
    ...ep72Episode,
    transcript: ep72Transcript,
    series: "english",
  },
  ...englishExpansionEpisodes.map((episode) => ({
    ...episode,
    series: "english" as const,
  })),
];

export const getPodcastEpisode = (episodeId: string) =>
  podcastEpisodes.find((episode) => episode.id === episodeId);

export function getPodcastTtsScript(episode: PodcastEpisode) {
  const dialogue = episode.transcript
    .map((line) => `${line.speaker}: ${line.text}`)
    .join("\n\n");

  return `TTS the following educational conversation in Brazilian Portuguese. Use a clear, natural, calm podcast delivery. Ana is a confident female cybersecurity educator. Rafael is a curious adult male learner. Keep speaker identities distinct, pronounce technical terms carefully, and pause gently between turns:\n\n${dialogue}`;
}
