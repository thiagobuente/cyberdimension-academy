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
  status: "roteiro_autoral";
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

export function getAuthorialVideoLessons(course: StarterCourse): AuthorialVideoLesson[] {
  const moduleTitles = course.modules.map((module) => module.title);
  return Array.from({ length: 10 }, (_, index) => {
    const moduleTitle = moduleTitles[index % Math.max(moduleTitles.length, 1)] ?? course.shortTitle;
    const frame = lessonFrames[index];
    const title = `${String(index + 1).padStart(2, "0")} · ${frame}: ${moduleTitle}`;
    const focus = `${course.focus} Nesta aula, o aluno conecta ${moduleTitle.toLocaleLowerCase("pt-BR")} a um cenário autoral e seguro de prática.`;
    const chapters = [
      { time: "00:00", title: "Abertura e objetivo", summary: `O que observar em ${moduleTitle.toLocaleLowerCase("pt-BR")} e por que isso importa.` },
      { time: "02:00", title: "Explicação visual", summary: `Uma explicação curta, com linguagem profissional e exemplos controlados sobre ${course.shortTitle}.` },
      { time: "04:00", title: "Aplicação guiada", summary: "Conecte o conceito ao laboratório do curso sem executar ações contra sistemas reais." },
    ];
    return {
      id: `${course.slug}-video-${index + 1}`,
      courseSlug: course.slug,
      lessonNumber: index + 1,
      title,
      duration: durationFor(index),
      focus,
      chapters,
      transcript: chapters.map((chapter) => ({ time: chapter.time, text: `${chapter.title}: ${chapter.summary}` })),
      status: "roteiro_autoral",
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
