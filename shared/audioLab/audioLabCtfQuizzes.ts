/**
 * CyberDimension Audio Lab — quizzes da Temporada 4 "CTF Cases".
 * Cada caso tem um quiz de 5 questões no padrão do CyberCast; completar o
 * episódio desbloqueia a competência correspondente no Career Readiness.
 */
import type { AudioLabQuizQuestion, AudioLabCompetency } from "../audioLabQuizzes";

type CtfQuizBankEntry = {
  questions: readonly AudioLabQuizQuestion[];
  competency: AudioLabCompetency;
};

function q(id: string, prompt: string, options: readonly string[], correctAnswer: number, explanation: string): AudioLabQuizQuestion {
  return { id, prompt, options, correctAnswer, explanation };
}

export const ctfQuizBank: Record<string, CtfQuizBankEntry> = {
  "audio-ctf01-ctf-primeiro-flag": {
    questions: [
      q("audio-ctf01-q1", "Qual é a primeira etapa da metodologia CTF apresentada no caso?", ["Exploração imediata", "Definição do escopo autorizado", "Brute force", "Divulgação do placar"], 1, "O escopo define o que pode ser atacado antes de qualquer enumeração ou exploração."),
      q("audio-ctf01-q2", "O que a enumeração busca antes da exploração?", ["Flags aleatórias", "Portas, serviços e versões expostos", "Senhas do administrador", "O placar do adversário"], 1, "A enumeração mapeia a superfície de ataque: portas, serviços e versões, base para a exploração controlada."),
      q("audio-ctf01-q3", "No caso estudado, o que transformou o CTF em prova de portfólio?", ["A velocidade da resolução", "A documentação do caminho: comandos, resultados e decisões", "O número de flags coletadas", "O uso da ferramenta mais avançada"], 1, "Documentar comandos, resultados e decisões torna o CTF evidência de capacidade profissional."),
      q("audio-ctf01-q4", "O que cada flag coletada representa?", ["Um ponto no placar apenas", "Uma evidência de conquista validada", "Um bug descoberto", "Uma permissão de administrador"], 1, "Cada flag é prova verificável de uma etapa concluída com sucesso."),
      q("audio-ctf01-q5", "Segundo o caso, o que importa mais do que o placar?", ["A ferramenta usada", "A quantidade de flags", "O aprendizado da trilha e a documentação", "O tempo de execução"], 2, "A jornada documentada vale mais que o resultado: portfólio se constrói com trilha, não placar."),
    ],
    competency: { code: "ctf-cases-metodologia", label: "Metodologia CTF", area: "Security Operations" },
  },
  "audio-ctf02-pentest-escopo-autorizado": {
    questions: [
      q("audio-ctf02-q1", "O que legitima um teste de intrusão?", ["A habilidade do pentester", "O contrato assinado com regras de engajamento", "O uso de ferramentas open source", "A ausência de denúncia"], 1, "Sem regras de engajamento assinadas não existe pentest legítimo."),
      q("audio-ctf02-q2", "O que as regras de engajamento definem?", ["O preço do serviço", "O que pode ser testado, quando, de onde e o que nunca tocar", "A ferramenta obrigatória", "O prazo de patch"], 1, "Regras de engajamento delimitam escopo, janelas, origens e restrições absolutas."),
      q("audio-ctf02-q3", "Qual é a ordem correta do ciclo de execução do pentest?", ["Exploração, escopo, relatório", "Reconhecimento, varredura, prova de conceito, documentação", "Relatório, varredura, reconhecimento", "Exploração, relatório, escopo"], 1, "Reconhecimento e varredura precedem a prova de conceito; a documentação acompanha tudo."),
      q("audio-ctf02-q4", "O que decide o valor de negócio do relatório de pentest?", ["A quantidade de exploits listados", "A tradução dos achados em risco e priorização de correção", "O tamanho do documento", "Os logos das ferramentas usadas"], 1, "Negócio decide com base em risco real e prioridades, não em lista de exploits."),
      q("audio-ctf02-q5", "Por que lista de exploits sem priorização é insuficiente?", ["Porque ocupa muito espaço", "Porque não gera ação de correção orientada", "Porque é ilegal", "Porque expõe vulnerabilidades"], 1, "Sem priorização, a organização não sabe o que corrigir primeiro e nada muda de verdade."),
    ],
    competency: { code: "ctf-cases-pentest", label: "Pentest Autorizado", area: "Security Operations" },
  },
  "audio-ctf03-analista-blue-team": {
    questions: [
      q("audio-ctf03-q1", "Como geralmente começa um caso de blue team?", ["Com um alerta crítico já confirmado", "Com um sinal pequeno e aparentemente irrelevante", "Com um ataque DDoS massivo", "Com uma auditoria agendada"], 1, "Casos começam com anomalias pequenas: um log estranho, um processo inesperado."),
      q("audio-ctf03-q2", "Qual é a primeira regra do analista diante de uma anomalia?", ["Descartar se for única", "Investigar e buscar contexto: ativos, usuários e histórico", "Reiniciar o sistema", "Aguardar mais alertas"], 1, "A anomalia ganha significado quando cruzada com contexto de ativos, usuários e comportamento."),
      q("audio-ctf03-q3", "O que caracteriza o método de investigação apresentado?", ["Esperar a confirmação automática", "Hipótese, verificação, nova hipótese", "Confiar na ferramenta", "Ignorar até escalar"], 1, "A investigação avança em ciclos de hipótese e verificação, nunca por confirmação passiva."),
      q("audio-ctf03-q4", "Quando o alerta deixou de ser curiosidade no caso estudado?", ["Na primeira ocorrência", "Quando três sinais independentes apontaram para a mesma estação", "Após o fim do plantão", "Quando o SIEM reiniciou"], 1, "Sinais independentes convergentes elevaram o alerta a incidente em investigação."),
      q("audio-ctf03-q5", "Por que o escalonamento no caso foi considerado bem feito?", ["Porque o analista resolveu tudo sozinho", "Porque o analista escalou na hora certa em vez de travar na investigação isolada", "Porque ignorou o alerta", "Porque apagou os logs"], 1, "Escalar na hora certa é competência: ninguém resolve tudo sozinho, e o tempo conta."),
    ],
    competency: { code: "ctf-cases-blue-team", label: "Análise Blue Team", area: "Security Operations" },
  },
  "audio-ctf04-custodia-evidencia": {
    questions: [
      q("audio-ctf04-q1", "Por que a corrente de custódia pode valer mais que a evidência?", ["Porque é mais barata", "Porque evidencia quem achou, quando, onde e o que ocorreu com o material", "Porque substitui o hash", "Porque é opcional"], 1, "Sem histórico de custódia, a evidência perde valor probatório independentemente do conteúdo."),
      q("audio-ctf04-q2", "Qual o papel do hash de integridade na coleta?", ["Criptografar a evidência", "Prover um resumo criptográfico que permite verificar integridade futura", "Comprimir o arquivo", "Anonimizar dados"], 1, "O hash permite que qualquer verificação futura confirme que a evidência não foi alterada."),
      q("audio-ctf04-q3", "O que indica divergência de hashes na verificação?", ["Que a evidência é antiga", "Que a evidência está comprometida", "Que o hash está errado", "Nada; é esperado"], 1, "Hashes divergentes significam alteração do material e comprometem a evidência."),
      q("audio-ctf04-q4", "O que cada transferência de evidência deve documentar?", ["Apenas a data", "Data, hora, finalidade e assinatura de quem recebeu", "Só o nome do arquivo", "O hash antigo"], 1, "Cada transferência registra quando, por que e por quem, formando a cadeia completa."),
      q("audio-ctf04-q5", "Quando a cadeia de custódia deve começar?", ["Na análise laboratorial", "No primeiro toque sobre o material", "Na audiência", "Ao redigir o laudo"], 1, "A custódia começa no primeiro contato; a perícia acontece depois."),
    ],
    competency: { code: "ctf-cases-forense", label: "Custódia e Forense", area: "Security Operations" },
  },
  "audio-ctf05-forense-disco-memoria": {
    questions: [
      q("audio-ctf05-q1", "Por que o atacante não foi detectado pela análise de disco?", ["O disco estava criptografado", "Ele limpou arquivos, logs e desinstalou o malware do disco", "O disco foi substituído", "A análise de disco é ineficaz"], 1, "O atacante apagou rastros no disco; o que sobreviveu foi a execução ativa na RAM."),
      q("audio-ctf05-q2", "O que a análise de memória RAM revela que o disco não mostra?", ["Arquivos deletados", "Processos injetados, handles suspeitos e conexões abertas em execução", "Backups antigos", "Configurações de rede salvas"], 1, "Memória é a fotografia do sistema em atividade: processos injetados e conexões em tempo real."),
      q("audio-ctf05-q3", "Qual a ordem correta de coleta forense no caso?", ["Disco, depois memória", "Memória antes do disco", "Qualquer ordem serve", "Só disco"], 1, "A memória se coleta primeiro porque desligar ou manipular a máquina destrói essa evidência."),
      q("audio-ctf05-q4", "Como o caso descreve as fontes de evidência?", ["Disco e memória contam a mesma coisa", "Disco conta a história; memória conta o agora", "Memória não é evidência", "Disco sempre basta"], 1, "Cada fonte tem papel: disco narra o passado, memória captura o presente."),
      q("audio-ctf05-q5", "O que foi a chave do caso estudado?", ["O log de rede", "O processo oculto encontrado na análise de memória", "A senha do administrador", "O horário do ataque"], 1, "O processo oculto na RAM abriu o caminho para toda a investigação."),
    ],
    competency: { code: "ctf-cases-memoria", label: "Forense de Memória", area: "Security Operations" },
  },
  "audio-ctf06-malware-familia": {
    questions: [
      q("audio-ctf06-q1", "Onde a amostra de malware deve ser analisada?", ["Na estação do analista", "Em sandbox isolada, nunca no ambiente real", "No servidor de produção", "Em qualquer máquina com antivírus"], 1, "Análise dinâmica exige isolamento: sandbox dedicada, nunca ambiente real."),
      q("audio-ctf06-q2", "O que a análise dinâmica observa?", ["O tamanho do arquivo", "O que o arquivo cria, modifica e com quem se comunica", "O nome do autor", "A data de criação"], 1, "Comportamento é o foco: criações, modificações e comunicações em execução."),
      q("audio-ctf06-q3", "Por que classificar o malware por família é valioso?", ["Para organizar o antivírus", "Para reconhecer táticas: onde se esconde, como persiste e o que rouba", "Para nomear amostras", "Para cumprir relatório"], 1, "A família revela o padrão de comportamento esperado e orienta a resposta."),
      q("audio-ctf06-q4", "O que aconteceu com os IOC extraídos da amostra no caso?", ["Foram descartados", "Bateram com campanha documentada, elevando o incidente a evento de inteligência", "Ficaram em quarentena", "Foram enviados ao atacante"], 1, "A conexão com campanha conhecida transforma caso local em inteligência acionável."),
      q("audio-ctf06-q5", "Qual a sequência correta apresentada no caso?", ["Família, sandbox, IOC", "Isolamento, análise dinâmica, classificação por família, publicação de IOC", "IOC, família, isolamento", "Relatório, análise, IOC"], 1, "Isolar, analisar comportamento, classificar e publicar indicadores é o fluxo completo."),
    ],
    competency: { code: "ctf-cases-malware", label: "Análise de Malware", area: "Threat Intelligence" },
  },
  "audio-ctf07-pcap-trafego": {
    questions: [
      q("audio-ctf07-q1", "O que entregou o atacante na análise de tráfego?", ["Um arquivo grande", "Requisições DNS pequenas em intervalo exato com domínios sempre diferentes", "Um download de vídeo", "Uma varredura de portas"], 1, "O padrão de DNS tunneling: pequenas requisições regulares com nomes sempre distintos."),
      q("audio-ctf07-q2", "Por que o DNS tunneling passa despercebido pelo firewall?", ["Porque usa portas altas", "Porque tráfego DNS é esperado e normalmente liberado", "Porque é criptografado em TLS", "Porque usa UDP bloqueado"], 1, "DNS é esperado no ambiente; o túnel se esconde no comportamento legítimo."),
      q("audio-ctf07-q3", "O que a reconstrução da sessão revelou?", ["Tráfego normal", "Conteúdo de exfiltração embarcado nos nomes de domínio", "Configuração de DHCP", "Updates de sistema"], 1, "A reconstrução mostrou os dados exfiltrados escondidos nos próprios nomes de domínio."),
      q("audio-ctf07-q4", "Como a resposta bloqueou o túnel sem derrubar o serviço?", ["Bloqueando todo o DNS", "Com correlação: linha de base, detecção de anomalia e bloqueio seletivo", "Desligando o firewall", "Mudando o provedor"], 1, "Bloqueio seletivo baseado em anomalia preserva o serviço legítimo."),
      q("audio-ctf07-q5", "Qual o princípio de detecção apresentado no caso?", ["Tudo que é DNS é suspeito", "Desvio da linha de base de tráfego é indício", "Alertas automáticos bastam", "Bloquear por padrão"], 1, "Linha de base define o normal; o desvio dela é o que merece investigação."),
    ],
    competency: { code: "ctf-cases-pcap", label: "Análise de Tráfego", area: "Security Operations" },
  },
  "audio-ctf08-deteccao-sigma": {
    questions: [
      q("audio-ctf08-q1", "O que capturou o atacante que voltou após seis meses?", ["O antivírus novo", "Uma regra Sigma escrita contra a técnica conhecida do primeiro incidente", "A demissão do admin", "O backup diário"], 1, "A regra Sigma mapeada à técnica já usada detectou a reincidência em minutos."),
      q("audio-ctf08-q2", "Qual é a grande vantagem das regras Sigma?", ["São gratuitas", "Portabilidade: uma regra vira consulta em SIEM, EDR e log puro", "São automáticas", "Dispensam teste"], 1, "Uma autoria portável para várias plataformas de detecção."),
      q("audio-ctf08-q3", "O que foi feito antes de ativar a regra no caso?", ["Nada; foi ativada direto", "Teste em logs históricos para validar sem falso positivo", "Compra de ferramenta", "Treinamento externo"], 1, "Validação em dados históricos evita falso positivo e calibra a regra antes do uso."),
      q("audio-ctf08-q4", "Contra o que a regra Sigma do caso foi escrita?", ["O endereço IP do atacante", "O padrão da técnica: comandos, processos filhos e caminho de persistência", "O nome do malware", "A porta de saída"], 1, "Regra genérica contra a técnica (não contra IOCs frágeis) acompanha variações do ataque."),
      q("audio-ctf08-q5", "Qual a definição de boa detecção segundo o caso?", ["A que mais dispara", "A que dispara certo", "A mais barata", "A mais complexa"], 1, "Detecção boa é precisa: dispara quando deve, sem inundar o time com ruído."),
    ],
    competency: { code: "ctf-cases-deteccao", label: "Engenharia de Detecção", area: "Security Operations" },
  },
  "audio-ctf09-cloud-k8s": {
    questions: [
      q("audio-ctf09-q1", "Qual foi o primeiro sinal do incidente cloud?", ["Ataque DDoS", "Fatura mensal dez vezes maior", "Falha de login", "Queda de rede"], 1, "O custo disparado revelou o uso indevido de recursos computacionais."),
      q("audio-ctf09-q2", "Quais foram as duas falhas que permitiram o ataque?", ["Pod sem limite de recursos e token de serviço com permissão excessiva", "Firewall desligado e VPN ativa", "Backup ausente e DNS exposto", "Senha fraca e MFA ausente"], 1, "Recursos ilimitados e credencial superprivilegiada abriram a porta para o cryptomining."),
      q("audio-ctf09-q3", "Além do custo, qual era o maior risco do token comprometido?", ["Nenhum; só afetava o pod", "Alcance de buckets, bancos e outras contas do ambiente", "A lentidão do sistema", "O aumento de storage"], 1, "O token dava acesso a todo o ambiente cloud, não só ao cluster afetado."),
      q("audio-ctf09-q4", "Qual foi a sequência de remediação no caso?", ["Reiniciar o cluster", "Revogar o token, aplicar limites de recursos, restringir permissões e auditar pods similares", "Aumentar o orçamento", "Migrar para outra nuvem"], 1, "Remediação completa: credencial revogada, recursos limitados, permissões reduzidas e auditoria."),
      q("audio-ctf09-q5", "Qual a lição central do caso sobre nuvem?", ["Nuvem é insegura por natureza", "Nuvem mal configurada é insegura; configuração errada, não a plataforma", "Containers devem ser evitados", "Kubernetes não é pronto para produção"], 1, "A insegurança veio da configuração, não da tecnologia em si."),
    ],
    competency: { code: "ctf-cases-cloud", label: "Segurança Cloud", area: "Cloud Security" },
  },
  "audio-ctf10-pam-privilegios": {
    questions: [
      q("audio-ctf10-q1", "Qual foi a descoberta do caso de identidade?", ["Uma conta de administrador local sem dono", "Um servidor desligado", "Um backup corrompido", "Uma política desatualizada"], 1, "Contas privilegiadas sem dono são portas dos fundos permanentes do ambiente."),
      q("audio-ctf10-q2", "De onde normalmente vêm contas de administrador sem dono?", ["De invasões externas", "De migrações, provedores antigos ou projetos abandonados", "Do fabricante do sistema", "Do backup"], 1, "Sobras de migrações e projetos abandonados são a origem clássica."),
      q("audio-ctf10-q3", "O que agravava o risco no caso estudado?", ["A conta estava desativada", "A senha estava em arquivo de texto no servidor", "O firewall bloqueava acesso", "A conta usava MFA"], 1, "Senha em texto plano no servidor entregava as chaves a qualquer usuário básico."),
      q("audio-ctf10-q4", "O que um PAM bem implantado faz com contas privilegiadas?", ["Mantém todas ativas", "Rotaciona senhas automaticamente, grava sessões e libera acesso sob demanda com aprovação", "Remove todos os administradores", "Bloqueia o ambiente"], 1, "Gestão de acesso privilegiado controla o ciclo completo: senhas, sessões e aprovações."),
      q("audio-ctf10-q5", "Qual o princípio sobre privilégios apresentado no caso?", ["Privilégio é direito adquirido", "Privilégio é exceção, nunca rotina", "Privilégio deve ser permanente", "Privilégio é irrelevante"], 1, "Acesso elevado deve ser temporário, justificado e revisado continuamente."),
    ],
    competency: { code: "ctf-cases-iam", label: "Identidade e Privilégios", area: "Security Fundamentals" },
  },
  "audio-ctf11-incidentes-reais": {
    questions: [
      q("audio-ctf11-q1", "Qual foi o ponto de entrada do incidente real estudado?", ["Uma vulnerabilidade zero-day no firewall", "Um e-mail de phishing com anexo malicioso", "Acesso físico à sala do servidor", "Um insider malicioso"], 1, "Um phishing comum com anexo explorando software desatualizado iniciou a cadeia."),
      q("audio-ctf11-q2", "Por que o atacante permaneceu semanas sem ser visto?", ["Porque usava VPN corporativa", "Porque os sinais existiam nos logs, mas ninguém os correlacionava", "Porque apagou tudo em minutos", "Porque o SIEM estava desligado"], 1, "A falha foi de detecção: logs com sinais, mas sem correlação ativa."),
      q("audio-ctf11-q3", "Quando a resposta veio, o que já havia acontecido?", ["O phishing tinha parado", "O ransomware já estava implantado", "O atacante tinha sido preso", "O backup tinha sido testado"], 1, "A resposta tardia encontrou o ransomware já posicionado no ambiente."),
      q("audio-ctf11-q4", "Quais lições a indústria aplicou depois de incidentes como esse?", ["Desligar o e-mail corporativo", "Patch management rotineiro, segmentação de rede e caça proativa a ameaças", "Terceirizar a segurança", "Reduzir o monitoramento"], 1, "As três frentes: atualizar, segmentar para conter movimento lateral e caçar proativamente."),
      q("audio-ctf11-q5", "Qual a vantagem de estudar incidentes reais?", ["Memorizar nomes de empresas", "Evitar vivê-los: aprender com os erros alheios antes que virem os seus", "Criticar as vítimas", "Aumentar o medo"], 1, "Incidentes reais são a escola mais dura; estudá-los é a prevenção mais barata."),
    ],
    competency: { code: "ctf-cases-ir", label: "Resposta a Incidentes", area: "Security Operations" },
  },
  "audio-ctf12-triagem-soc": {
    questions: [
      q("audio-ctf12-q1", "O que define a prioridade de um alerta na triagem?", ["A hora em que chegou", "O contexto de negócio: ativos, dados e indicadores ativos", "A cor do painel", "O número de ocorrências no dia"], 1, "Alerta sem contexto não tem prioridade; o negócio define o que importa mais."),
      q("audio-ctf12-q2", "No caso, quantos dos trinta alertas caíram como falso positivo ou informational?", ["Dois", "Vinte e oito", "Nenhum", "Todos os trinta"], 1, "A filtragem disciplinada eliminou 28 dos 30 alertas como ruído."),
      q("audio-ctf12-q3", "O que protege o tempo do analista na triagem?", ["Ignorar alertas antigos", "A filtragem disciplinada de falsos positivos e informational", "Acelerar tudo ao máximo", "Escalonar tudo"], 1, "Filtrar com método é o que preserva a capacidade de investigação do time."),
      q("audio-ctf12-q4", "O que aconteceu com os dois alertas que sobraram?", ["Um era atividade legítima de administração; o outro, tentativa real de intrusão", "Ambos eram falsos positivos", "Ambos exigiram shutdown", "Foram ignorados"], 1, "Triagem certa separa o legítimo do malicioso antes da resposta completa."),
      q("audio-ctf12-q5", "Qual a síntese do caso em uma frase?", ["Trinta alertas, zero casos", "Trinta alertas, um caso real tratado com playbook e evidências", "Alertas não importam", "Tudo era incidente"], 1, "Volume alto não é problema; a triagem transforma trinta alertas em um caso tratado."),
    ],
    competency: { code: "ctf-cases-triagem", label: "Triagem em SOC", area: "Security Operations" },
  },
};
