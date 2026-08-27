import type { ActivatedCatalogCourse } from "./activatedCatalogCourses";

const modules = [
  { title: "Fundamentos de Inteligência Artificial", lessons: 15, description: "Da história da IA à diferença entre modelos, aplicações e agentes: dados, tokens, contexto, inferência, redes neurais, NLP, visão computacional e limites dos modelos." },
  { title: "Ferramentas de Inteligência Artificial", lessons: 10, description: "Escolha responsável de ferramentas de texto, imagem, áudio, vídeo e programação, com contexto, verificação de respostas, privacidade e uso responsável." },
  { title: "Engenharia de Prompts", lessons: 12, description: "Anatomia de instruções eficazes, zero-shot, few-shot, decomposição, chaining, schemas, templates, refinamento e context engineering." },
  { title: "IA para Produtividade", lessons: 10, description: "Pesquisa, resumo, análise documental, planejamento, reuniões, estudos, comunicação profissional e desafios com evidências verificáveis." },
  { title: "IA para Programação", lessons: 12, description: "Geração e explicação de código, debugging, refatoração, testes, documentação, code review, SQL, APIs, Git e segurança no código." },
  { title: "IA Aplicada à Cibersegurança", lessons: 12, description: "Uso defensivo de IA em SOC, IOC, logs, phishing, CVEs, SIEM, anomalias, threat hunting e relatórios, sempre com dados sintéticos e laboratórios seguros." },
  { title: "APIs e Aplicações com IA", lessons: 12, description: "Requests, responses, JSON, autenticação, streaming, tokens, custos, rate limits e tratamento de erros em JavaScript, TypeScript e Python." },
  { title: "RAG e IA com Documentos", lessons: 12, description: "Ingestão, chunking, embeddings, recuperação, similaridade, bancos vetoriais, fontes e estratégias para reduzir alucinações." },
  { title: "Agentes de Inteligência Artificial", lessons: 12, description: "Tools, function calling, memória, planejamento, workflows, multiagentes, human-in-the-loop, guardrails, observabilidade e avaliação." },
  { title: "IA Avançada, Segurança, Governança e Mercado", lessons: 14, description: "Fine-tuning, modelos abertos, quantização, LoRA, LLMOps, prompt injection, privacidade, LGPD, NIST AI RMF, riscos, auditoria e carreiras." },
] as const;

const labs = [
  { title: "Mapa de conceitos de IA", description: "Organize um cenário de treinamento em modelo, aplicação, agente, dados e inferência.", objective: "Distinguir componentes de uma solução de IA sem confundir modelo com produto.", command: "mapear-ia --cenario assistente-estudo --modo didatico", output: "Modelo: componente de inferência\nAplicação: interface e regras\nDados: contexto fornecido\nRisco: resposta sem fonte — exigir verificação" },
  { title: "Avaliação de ferramentas", description: "Compare ferramentas fictícias para uma tarefa de resumo com critérios de privacidade e qualidade.", objective: "Selecionar uma ferramenta proporcional ao objetivo, aos dados e às restrições do cenário.", command: "avaliar-ferramenta --tarefa resumo --dados internos --criterios privacidade,qualidade", output: "Opções avaliadas: 4\nDados sensíveis: restringir envio\nCritério decisivo: política de retenção\nResultado: usar ambiente aprovado e revisar saída" },
  { title: "Refinamento de prompt", description: "Transforme uma instrução vaga em um prompt estruturado e verificável.", objective: "Aplicar contexto, objetivo, restrições, formato e critérios de qualidade.", command: "refinar-prompt --entrada vaga.txt --saida estruturada.json", output: "Contexto: definido\nObjetivo: mensurável\nFormato: tabela\nCritérios: fontes, incertezas e próximos passos\nResultado: prompt revisado" },
  { title: "Resumo executivo com evidências", description: "Converta um documento de treinamento em resumo, riscos, perguntas e ações.", objective: "Usar IA para acelerar leitura mantendo rastreabilidade e revisão humana.", command: "analisar-documento --arquivo politica-treino.txt --saida executivo", output: "Resumo: gerado\nRiscos: 4 identificados\nPerguntas: 6 propostas\nAções: 5 organizadas\nRevisão humana: obrigatória" },
  { title: "Code review seguro assistido por IA", description: "Revise um trecho fictício procurando validação ausente, segredos e tratamento de erros.", objective: "Usar IA como apoio sem aceitar código sem testes, revisão e validação humana.", command: "revisar-codigo --arquivo exemplo.ts --foco seguranca,testes", output: "Entrada externa: validar\nSegredo literal: não detectado\nTestes ausentes: 2\nRecomendação: revisar diff e executar suíte" },
  { title: "Triagem defensiva com IA", description: "Classifique alertas sintéticos de phishing, IOC e logon anômalo.", objective: "Apoiar triagem sem transformar uma sugestão de modelo em decisão automática.", command: "triagem-ia --arquivo alertas-sinteticos.json --modo defensivo", output: "Alertas: 8\nPrioridade alta: 2\nEvidência insuficiente: 3\nAção: correlacionar com telemetria e manter revisão humana" },
  { title: "Primeira integração de API", description: "Modele uma aplicação que recebe entrada e retorna resposta estruturada de um modelo.", objective: "Desenhar limites, erros e segredos sem incluir chaves reais.", command: "projetar-api-ia --linguagem typescript --modo seguro", output: "Request: validado\nResponse: schema definido\nSegredo: variável de ambiente\nRate limit: configurado\nLogs: sem conteúdo sensível" },
  { title: "RAG com fontes", description: "Planeje ingestão e recuperação de documentos sintéticos com indicação de fontes.", objective: "Exigir contexto recuperado e apresentar a origem das evidências na resposta.", command: "avaliar-rag --colecao documentos-treino --exigir-fontes", output: "Documentos: 12\nChunks: 48\nFontes recuperadas: 3\nResposta sem suporte: bloqueada\nResultado: revisão de citações necessária" },
  { title: "Agente com ferramentas autorizadas", description: "Defina ferramentas permitidas, limites, aprovação humana e formato de saída.", objective: "Construir um fluxo de agente previsível, observável e reversível.", command: "desenhar-agente --tarefa relatorio --tools leitura,formatacao --human-loop", output: "Tools permitidas: 2\nAções destrutivas: bloqueadas\nAprovação humana: antes da publicação\nTrace: habilitado\nStatus: desenho aprovado" },
  { title: "Threat model de aplicação de IA", description: "Avalie prompt injection, vazamento, abuso de ferramentas, privacidade e governança.", objective: "Priorizar riscos e controles para uma solução de IA antes da operação.", command: "modelar-risco-ia --app assistente-treino --framework nist-ai-rmf", output: "Riscos: 7\nPrioridade alta: prompt injection e dados sensíveis\nControles: 9 recomendados\nAção: validar, monitorar e documentar residual" },
] as const;

const assessmentQuestions = [
  { id: "ai-1", prompt: "Qual é a diferença mais adequada entre um modelo e uma aplicação de IA?", options: ["O modelo realiza inferência; a aplicação acrescenta interface, regras e contexto", "São sempre sinônimos", "A aplicação é apenas o conjunto de dados", "O modelo é sempre um usuário"], correctAnswer: 0, explanation: "O modelo é um componente que produz inferências; a aplicação organiza interação, regras, dados e controles ao redor dele." },
  { id: "ai-2", prompt: "Um prompt profissional deve conter, entre outros elementos:", options: ["Contexto, objetivo, restrições e formato esperado", "Somente uma pergunta curta", "Uma credencial real", "Instruções sem critério de revisão"], correctAnswer: 0, explanation: "Contexto e critérios claros tornam a saída mais verificável e adequada ao objetivo." },
  { id: "ai-3", prompt: "Ao usar IA para programação, a prática mais segura é:", options: ["Revisar, testar e validar o código antes de integrá-lo", "Aceitar toda saída automaticamente", "Colocar secrets no prompt", "Remover os testes para ganhar velocidade"], correctAnswer: 0, explanation: "A IA é apoio; revisão humana, testes e análise de segurança continuam necessários." },
  { id: "ai-4", prompt: "Em uma triagem de segurança assistida por IA, uma sugestão do modelo deve ser:", options: ["Correlacionada com evidências e revisada por uma pessoa", "Tratada como prova absoluta", "Usada para apagar logs", "Publicada sem contexto"], correctAnswer: 0, explanation: "Modelos podem errar; decisões defensivas exigem contexto, evidências e responsabilidade humana." },
  { id: "ai-5", prompt: "O principal objetivo de um pipeline RAG com fontes é:", options: ["Recuperar contexto relevante e indicar a origem utilizada", "Eliminar toda necessidade de revisão", "Treinar um modelo do zero sempre", "Ocultar os documentos recuperados"], correctAnswer: 0, explanation: "RAG conecta a resposta a documentos recuperados, e a apresentação das fontes ajuda a verificar o resultado." },
  { id: "ai-6", prompt: "Um agente de IA seguro deve ter:", options: ["Ferramentas autorizadas, limites, observabilidade e aprovação quando necessário", "Acesso irrestrito a todos os sistemas", "Memória sem controles", "Ações destrutivas automáticas"], correctAnswer: 0, explanation: "Limites e supervisão reduzem o risco de ações inesperadas ou fora do escopo." },
  { id: "ai-7", prompt: "Qual cuidado é essencial ao integrar uma API de IA?", options: ["Manter chaves fora do código e tratar limites e erros", "Publicar a chave no frontend", "Ignorar custos", "Registrar prompts sensíveis em logs públicos"], correctAnswer: 0, explanation: "Segredos devem ser gerenciados fora do código; limites, custos, erros e dados precisam ser tratados explicitamente." },
  { id: "ai-8", prompt: "Prompt injection é um risco relacionado a:", options: ["Instruções não confiáveis que tentam alterar o comportamento esperado do sistema", "Apenas falhas de hardware", "Compressão de imagens", "Disponibilidade de DNS"], correctAnswer: 0, explanation: "Entradas podem tentar substituir instruções, induzir o uso indevido de ferramentas ou provocar exposição de dados." },
  { id: "ai-9", prompt: "O NIST AI RMF é usado na trilha para apoiar:", options: ["Gestão de riscos e uso confiável de sistemas de IA", "Criação de senhas pessoais", "Substituição de testes de software", "Remoção de governança"], correctAnswer: 0, explanation: "O framework organiza linguagem e práticas para identificar, medir e gerenciar riscos de IA." },
  { id: "ai-10", prompt: "A melhor forma de reduzir alucinações em uma solução com documentos é:", options: ["Exigir contexto recuperado, fontes, incertezas e revisão", "Pedir respostas mais longas sem fontes", "Ocultar limitações", "Aceitar qualquer resposta fluente"], correctAnswer: 0, explanation: "Rastreabilidade, contexto e explicitação de incerteza ajudam a avaliar a confiabilidade da saída." },
] as const;

export const aiAcademyCourse = {
  slug: "ia-do-zero-ao-avancado" as const,
  code: "AI-ACADEMY-01",
  title: "Academia de Inteligência Artificial — Do Zero ao Avançado",
  shortTitle: "Academia de IA",
  level: "Avançado",
  duration: "70 horas",
  lessons: 121,
  labs: labs.length,
  quizCount: assessmentQuestions.length,
  accent: "cyan",
  icon: "cpu",
  description: "Uma trilha progressiva de fundamentos e engenharia de prompts até APIs, RAG, agentes, segurança, governança e aplicações profissionais.",
  focus: "Aprender IA com prática responsável: Aprender → Praticar → Testar → Construir.",
  outcomes: ["Explicar fundamentos de IA, modelos, aplicações, agentes e limitações.", "Construir prompts, integrações, fluxos RAG e agentes com controles.", "Avaliar riscos de segurança, privacidade, governança e uso profissional de IA."],
  modules,
  labsList: labs,
  assessment: "Avaliação final em dez partes: fundamentos, prompts, produtividade, programação, APIs, RAG, agentes, segurança, governança e projeto final.",
  assessmentQuestions,
} satisfies ActivatedCatalogCourse;

export const aiAcademyPromptLab = [
  { title: "Prompt de explicação didática", category: "Aprender", prompt: "Explique [conceito] para [público], use um exemplo seguro, declare incertezas e finalize com três perguntas de revisão." },
  { title: "Prompt de análise com fontes", category: "Pesquisar", prompt: "Analise o material fornecido, separe fatos de inferências, cite os trechos usados e liste o que precisa de verificação humana." },
  { title: "Prompt de code review", category: "Programar", prompt: "Revise este código procurando validação ausente, segredos, tratamento de erros, testes faltantes e riscos de segurança. Não reescreva sem explicar o motivo." },
  { title: "Prompt de triagem defensiva", category: "Cibersegurança", prompt: "Classifique este alerta sintético por prioridade, evidências, hipóteses e próximos passos. Não execute ações e destaque dados faltantes." },
  { title: "Prompt de desenho de agente", category: "Construir", prompt: "Desenhe um agente para [tarefa] com ferramentas permitidas, limites, aprovação humana, logs, condições de parada e critérios de sucesso." },
  { title: "Prompt de avaliação RAG", category: "RAG", prompt: "Responda somente com base no contexto recuperado, indique as fontes, sinalize lacunas e diga explicitamente quando o material não sustentar uma conclusão." },
] as const;

export const aiAcademyProjects = [
  { title: "Assistente de estudos com prompts", level: "Iniciante", deliverable: "Biblioteca de prompts versionada, critérios de qualidade e exemplos avaliados." },
  { title: "Dashboard de análise com IA", level: "Iniciante", deliverable: "Fluxo de resumo de dados sintéticos com revisão humana e registro de decisões." },
  { title: "Code review assistido por IA", level: "Intermediário", deliverable: "Checklist, testes, relatório de riscos e diff revisado em um repositório de treinamento." },
  { title: "RAG com documentação técnica", level: "Intermediário", deliverable: "Pipeline de documentos sintéticos com fontes, métricas de recuperação e casos sem resposta." },
  { title: "Agente defensivo com governança", level: "Avançado", deliverable: "Desenho de agente com tools autorizadas, human-in-the-loop, threat model e plano de monitoramento." },
] as const;

export const aiAcademyModuleTitles = modules.map((module) => module.title);
