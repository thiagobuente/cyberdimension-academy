import type { StarterCourse } from "@/data/courseCatalog";

export type AuthorialVideoLesson = {
  id: string;
  courseSlug: string;
  lessonNumber: number;
  title: string;
  duration: string;
  focus: string;
  chapters: readonly { time: string; title: string; summary: string }[];
  transcript: readonly { time: string; text: string }[];
  status: "roteiro_autoral" | "publicado";
  mediaUrl?: string;
};

const lessonFrames = [
  "Contexto e objetivo",
  "Conceito essencial",
  "Demonstração segura",
  "Leitura de evidências",
  "Decisão profissional",
  "Erro comum",
  "Checklist de prática",
  "Conexão com carreira",
  "Revisão guiada",
  "Desafio de aplicação",
] as const;

const durationFor = (index: number) => `${6 + (index % 4) * 2} min`;
const timeFor = (index: number) => `0${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`;

const publishedLessonDetails: Record<number, { duration: string; chapters: readonly { time: string; title: string; summary: string }[] }> = {
  2: {
    duration: "4 min 53 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Objetivo da aula e uso responsável de ferramentas de inteligência artificial." },
      { time: "00:42", title: "Modelo e ferramenta", summary: "Diferença entre o modelo e a aplicação que oferece a experiência ao estudante." },
      { time: "01:24", title: "Modalidades de IA", summary: "Texto, pesquisa, imagem, áudio, vídeo e programação com seus limites." },
      { time: "02:06", title: "Como escolher", summary: "Objetivo, dados, privacidade, formato e revisão humana." },
      { time: "02:48", title: "Verificação e limitações", summary: "Como lidar com erros, vieses, contexto perdido e referências inexistentes." },
      { time: "03:30", title: "Privacidade e responsabilidade", summary: "Menor privilégio, exemplos sintéticos e proteção de dados sensíveis." },
      { time: "04:11", title: "Desafio e resumo", summary: "Comparação de duas ferramentas para uma tarefa de cibersegurança." },
    ],
  },
  3: {
    duration: "5 min 27 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Como transformar uma instrução vaga em uma solicitação clara e segura." },
      { time: "00:47", title: "O que é um prompt", summary: "Contexto, objetivo, papel, restrições, dados de entrada e formato." },
      { time: "01:34", title: "Contexto, objetivo e papel", summary: "Como reduzir ambiguidades sem substituir a verificação humana." },
      { time: "02:20", title: "Prompt ruim e prompt melhorado", summary: "Evolução de uma pergunta genérica para uma instrução avaliável." },
      { time: "03:07", title: "Prompt profissional", summary: "Ambiente, limites, formato, autorização e declaração de incertezas." },
      { time: "03:54", title: "Refinamento e segurança", summary: "Observar, identificar lacunas, acrescentar contexto e revisar." },
      { time: "04:41", title: "Desafio e resumo", summary: "Transformação de uma solicitação vaga em um pedido profissional." },
    ],
  },
  4: {
    duration: "4 min 05 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Leitura de evidências com contexto, privacidade e revisão humana." },
      { time: "00:35", title: "Classificação das evidências", summary: "Relatórios, alertas, políticas e logs como registros observáveis." },
      { time: "01:10", title: "Privacidade antes do processamento", summary: "Remoção de credenciais, dados pessoais e conteúdo desnecessário." },
      { time: "01:45", title: "Fatos e interpretações", summary: "Separação entre o que foi encontrado e o que ainda precisa ser avaliado." },
      { time: "02:20", title: "Logs e políticas", summary: "Limites da inferência e importância de conferir as fontes originais." },
      { time: "02:55", title: "Produtividade verificável", summary: "Saídas pequenas, referências e registro da revisão humana." },
      { time: "03:30", title: "Desafio e resumo", summary: "Extração de fatos, lacunas e perguntas a partir de documento fictício." },
    ],
  },
  5: {
    duration: "3 min 48 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Programação assistida por IA sem abrir mão de testes e segurança." },
      { time: "00:32", title: "Tarefa pequena e contexto", summary: "Linguagem, versão, entradas, saídas, restrições e exemplos." },
      { time: "01:05", title: "Segredos e privacidade", summary: "Proteção de tokens, senhas, chaves, dados de clientes e código proprietário." },
      { time: "01:38", title: "Testes e casos de borda", summary: "Leitura do código, testes unitários, análise estática e revisão." },
      { time: "02:11", title: "APIs e dependências", summary: "Verificação de documentação, versões, licença e manutenção." },
      { time: "02:44", title: "Segurança e revisão humana", summary: "Validação de entrada, menor privilégio, logs seguros e limites da automação." },
      { time: "03:17", title: "Desafio e resumo", summary: "Implementação controlada de uma função com testes e análise de riscos." },
    ],
  },
  6: {
    duration: "3 min 14 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Erros comuns ao aplicar IA em cibersegurança e como substituí-los." },
      { time: "00:28", title: "Respostas convincentes não são prova", summary: "Fluência não garante verdade; confirme fontes e evidências." },
      { time: "00:55", title: "Limites da automação", summary: "Scanners e modelos podem perder contexto e lógica de negócio." },
      { time: "01:23", title: "Privacidade e autorização", summary: "Anonimize dados e defina escopo antes de qualquer ação." },
      { time: "01:51", title: "Vieses e manutenção", summary: "Trate falsos positivos, versões, referências e qualidade ao longo do tempo." },
      { time: "02:19", title: "Ciclo de decisão responsável", summary: "Definir, limitar, proteger, testar e registrar." },
      { time: "02:46", title: "Desafio e resumo", summary: "Revisão de uma resposta fictícia com riscos e premissas ocultas." },
    ],
  },
  7: {
    duration: "3 min 40 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Checklist para projetar aplicações de IA com segurança." },
      { time: "00:31", title: "Objetivo e dados", summary: "Defina propósito, usuário, classes de dados e retenção." },
      { time: "01:03", title: "Entradas não confiáveis", summary: "Valide formatos e considere prompt injection em documentos." },
      { time: "01:34", title: "Saídas e ações", summary: "Valide resultados e nunca execute comandos automaticamente." },
      { time: "02:06", title: "Acesso e segredos", summary: "Use menor privilégio, auditoria e chaves protegidas no servidor." },
      { time: "02:37", title: "Monitoramento e testes", summary: "Observe falhas, abuso, dependências, licenças e limites." },
      { time: "03:09", title: "Desafio e resumo", summary: "Desenho de controles para uma aplicação de alertas anonimizados." },
    ],
  },
  8: {
    duration: "2 min 57 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Conexão com carreira, RAG e IA com documentos." },
      { time: "00:25", title: "Documentos autorizados", summary: "Defina fontes, sensibilidade, atualização e descarte." },
      { time: "00:50", title: "Trechos e metadados", summary: "Preserve contexto, origem, página, versão e data." },
      { time: "01:16", title: "Busca avaliada", summary: "Combine busca e filtros de autorização para reduzir erros." },
      { time: "01:41", title: "Geração com fontes", summary: "Restrinja respostas ao contexto e cite evidências." },
      { time: "02:06", title: "Carreira e monitoramento", summary: "Avalie qualidade, custo, cobertura e rastreabilidade." },
      { time: "02:31", title: "Desafio e resumo", summary: "Teste perguntas com e sem evidência em documentos fictícios." },
    ],
  },
  9: {
    duration: "3 min 13 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Revisão guiada de agentes de inteligência artificial." },
      { time: "00:28", title: "Objetivo e ferramentas", summary: "Defina escopo, ferramentas permitidas e ações proibidas." },
      { time: "00:55", title: "Etapas observáveis", summary: "Torne planos, chamadas e decisões revisáveis." },
      { time: "01:23", title: "Dados externos", summary: "Trate documentos e resultados de ferramentas como não confiáveis." },
      { time: "01:50", title: "Limites e parada", summary: "Controle tempo, custo, tentativas e loops." },
      { time: "02:18", title: "Avaliação profissional", summary: "Teste casos normais, adversariais e recusas corretas." },
      { time: "02:45", title: "Desafio e resumo", summary: "Desenhe um agente de tickets sem ações irreversíveis." },
    ],
  },
  10: {
    duration: "4 min 20 s",
    chapters: [
      { time: "00:00", title: "Introdução", summary: "Desafio final conectando IA, segurança, governança e carreira." },
      { time: "00:37", title: "Problema e escopo", summary: "Defina usuários, perguntas, limites e decisões fora do sistema." },
      { time: "01:14", title: "Dados e arquitetura", summary: "Classifique dados e separe validação, recuperação, geração e revisão." },
      { time: "01:51", title: "Segurança e governança", summary: "Proteja chaves, aplique menor privilégio e estabeleça responsáveis." },
      { time: "02:28", title: "Testes adversariais", summary: "Avalie fontes, recusas, entradas ambíguas e efeitos colaterais." },
      { time: "03:05", title: "Carreira e portfólio", summary: "Conecte competências de IA a funções profissionais de segurança." },
      { time: "03:43", title: "Desafio final e encerramento", summary: "Entregue arquitetura, matriz de riscos, controles e reflexão humana." },
    ],
  },
};

export function getAuthorialVideoLessons(course: StarterCourse): AuthorialVideoLesson[] {
  const moduleTitles = course.modules.map((module) => module.title);
  return Array.from({ length: 10 }, (_, index) => {
    const moduleTitle = moduleTitles[index % Math.max(moduleTitles.length, 1)] ?? course.shortTitle;
    const frame = lessonFrames[index];
    const title = `${String(index + 1).padStart(2, "0")} · ${frame}: ${moduleTitle}`;
    const focus = `${course.focus} Nesta aula, o aluno conecta ${moduleTitle.toLocaleLowerCase("pt-BR")} a um cenário autoral e seguro de prática.`;
    const publishedDetails = course.slug === "ia-do-zero-ao-avancado" ? publishedLessonDetails[index + 1] : undefined;
    const chapters = publishedDetails?.chapters ?? [
      { time: "00:00", title: "Abertura e objetivo", summary: `O que observar em ${moduleTitle.toLocaleLowerCase("pt-BR")} e por que isso importa.` },
      { time: "02:00", title: "Explicação visual", summary: `Uma explicação curta, com linguagem profissional e exemplos controlados sobre ${course.shortTitle}.` },
      { time: "04:00", title: "Aplicação guiada", summary: "Conecte o conceito ao laboratório do curso sem executar ações contra sistemas reais." },
    ];
    return {
      id: `${course.slug}-video-${index + 1}`,
      courseSlug: course.slug,
      lessonNumber: index + 1,
      title,
      duration: publishedDetails?.duration ?? durationFor(index),
      focus,
      chapters,
      transcript: chapters.map((chapter) => ({ time: chapter.time, text: `${chapter.title}: ${chapter.summary}` })),
      status: course.slug === "ia-do-zero-ao-avancado" && index <= 9 ? "publicado" : "roteiro_autoral",
      mediaUrl:
        course.slug !== "ia-do-zero-ao-avancado"
          ? undefined
          : index === 0
            ? "/video-media/ai-academy-01-foundations_0311788c.mp4"
            : index === 1
              ? "/video-media/cyberdimension-aula-02_18823cd3.mp4"
              : index === 2
                ? "/video-media/cyberdimension-aula-03_fa9873d7.mp4"
                : index === 3
                  ? "/video-media/cyberdimension-aula-04_ca0f8d58.mp4"
                  : index === 4
                    ? "/video-media/cyberdimension-aula-05_28f3aaa3.mp4"
                    : index === 5
                      ? "/video-media/cyberdimension-aula-06_6b89804d.mp4"
                      : index === 6
                        ? "/video-media/cyberdimension-aula-07_18f73067.mp4"
                        : index === 7
                          ? "/video-media/cyberdimension-aula-08_d29221a4.mp4"
                          : index === 8
                            ? "/video-media/cyberdimension-aula-09_624100da.mp4"
                            : index === 9
                              ? "/video-media/cyberdimension-aula-10_5091ed9a.mp4"
                              : undefined,
    };
  });
}

export function getAuthorialVideoLesson(course: StarterCourse, lessonNumber: number) {
  return getAuthorialVideoLessons(course).find((lesson) => lesson.lessonNumber === lessonNumber) ?? getAuthorialVideoLessons(course)[0];
}

export function countAuthorialVideoLessons(course: StarterCourse) {
  return getAuthorialVideoLessons(course).length;
}

export function authorialVideoSearchText(course: StarterCourse) {
  return getAuthorialVideoLessons(course).map((lesson) => `${lesson.title} ${lesson.focus}`).join(" ");
}

export { timeFor };
