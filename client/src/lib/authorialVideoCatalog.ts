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
      status: course.slug === "ia-do-zero-ao-avancado" && index <= 2 ? "publicado" : "roteiro_autoral",
      mediaUrl:
        course.slug !== "ia-do-zero-ao-avancado"
          ? undefined
          : index === 0
            ? "/video-media/ai-academy-01-foundations_0311788c.mp4"
            : index === 1
              ? "/video-media/cyberdimension-aula-02_18823cd3.mp4"
              : index === 2
                ? "/video-media/cyberdimension-aula-03_fa9873d7.mp4"
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
