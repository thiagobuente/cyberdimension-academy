export type ContentOrigin = "proprio" | "externo";

export type ContentProvenanceItem = {
  id: string;
  origin: ContentOrigin;
  category: string;
  title: string;
  source: string;
  license: string;
  usage: string;
  href?: string;
};

export type ExternalContentReference = {
  category: "Documentação" | "Curso externo" | "Artigo" | "CTF" | "Ferramenta";
  title: string;
  source: string;
  license: string;
  usage: string;
  href: string;
};

type CourseWithVideoReference = {
  title: string;
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
    sourceUrl: string;
  };
};

const ownLearningMaterials: Omit<ContentProvenanceItem, "id">[] = [
  {
    origin: "proprio",
    category: "Apostilas e aulas próprias",
    title: "Roteiro didático e material de apoio CyberDimension",
    source: "CyberDimension Academy",
    license: "Conteúdo educacional próprio; uso de estudo dentro da plataforma.",
    usage: "Explica os objetivos de cada módulo, organiza a sequência de estudo e contextualiza os conceitos.",
  },
  {
    origin: "proprio",
    category: "Código e cenários próprios",
    title: "Exemplos controlados, comandos simulados e cenários de análise",
    source: "CyberDimension Academy",
    license: "Material autoral para fins educacionais e prática segura.",
    usage: "Demonstra raciocínios técnicos em ambiente controlado, sem orientar ações fora de escopo ou não autorizadas.",
  },
  {
    origin: "proprio",
    category: "Laboratórios e projetos próprios",
    title: "Laboratórios guiados e evidências práticas da formação",
    source: "CyberDimension Academy",
    license: "Material autoral para fins educacionais e registro de progresso do aluno.",
    usage: "Transforma o conteúdo estudado em prática segura e, quando validado, em evidência privada de portfólio.",
  },
  {
    origin: "proprio",
    category: "Quizzes e avaliações próprias",
    title: "Questões autorais, explicações e critérios de certificação",
    source: "CyberDimension Academy",
    license: "Conteúdo educacional próprio; reprodução ou redistribuição não autorizada não é permitida.",
    usage: "Reforça a aprendizagem, mede a evolução e compõe os requisitos da certificação nominal.",
  },
];

export function getContentProvenance(course: CourseWithVideoReference): ContentProvenanceItem[] {
  const own = ownLearningMaterials.map((item) => ({ ...item, id: `own-${item.category}` }));
  const audio: ContentProvenanceItem[] = course.audioGuide
    ? [{
        id: `audio-${course.audioGuide.sourceUrl}`,
        origin: "proprio",
        category: "Audioguia próprio",
        title: course.audioGuide.label,
        source: course.audioGuide.narration,
        license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
        usage: `${course.audioGuide.description} Duração aproximada: ${course.audioGuide.duration}.`,
        href: course.audioGuide.sourceUrl,
      }]
    : [];
  const external: ContentProvenanceItem[] = course.videoLearning
    ? [{
        id: `youtube-${course.videoLearning.sourceUrl}`,
        origin: "externo",
        category: "YouTube · vídeo incorporado",
        title: course.videoLearning.label,
        source: `YouTube — ${course.videoLearning.label}`,
        license: "Conforme disponibilizada pelo autor e pela plataforma YouTube.",
        usage: "Vídeo incorporado como referência complementar; os roteiros, transcrições de apoio, laboratórios e avaliações da Academia permanecem autorais.",
        href: course.videoLearning.sourceUrl,
      }]
    : [];

  const complementaryResources: ContentProvenanceItem[] = (course.externalResources ?? []).map((resource) => ({
    id: `external-${resource.category}-${resource.href}`,
    origin: "externo",
    ...resource,
  }));

  return [...own, ...audio, ...external, ...complementaryResources];
}

export function getContentProvenanceSummary(course: CourseWithVideoReference) {
  const items = getContentProvenance(course);
  return {
    ownCount: items.filter((item) => item.origin === "proprio").length,
    externalCount: items.filter((item) => item.origin === "externo").length,
  };
}
