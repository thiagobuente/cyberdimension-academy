/**
 * Biblioteca de cursos gratuitos em vídeo (conteúdo externo).
 *
 * Fonte: canal do YouTube indicado pelo autor do material enviado em 16/08/2026.
 * Apostilas de apoio: https://github.com/jorgegil1905/Apostilas-das-Aulas
 * Licença de cada vídeo: conforme disponibilizada pelo autor e pela plataforma YouTube.
 * Uso: vídeo incorporado via YouTube como referência complementar; o acompanhamento,
 * os marcos e as trilhas da CyberDimension Academy permanecem autorais.
 *
 * IDs validados via oEmbed do YouTube em 16/08/2026. Seis temas da lista original
 * estavam com ID inválido ou vídeo removido e entraram como "vídeo indisponível"
 * (sem embed, com link para o material de apostilas).
 */

export type FreeCourseStatus = "disponivel" | "indisponivel";

export type FreeVideoCourse = {
  slug: string;
  title: string;
  category: string;
  description: string;
  videoId: string | null;
  status: FreeCourseStatus;
  watchXp: number;
  minutes: string;
  tags: string[];
};

export const FREE_VIDEO_COURSE_CATEGORIES = [
  "Todos",
  "Programação",
  "Inteligência Artificial e Dados",
  "Banco de Dados",
  "Cloud e Infraestrutura",
  "Mainframe",
  "Design e Métodos",
  "Novas Tecnologias",
] as const;

export const FREE_VIDEO_COURSES: readonly FreeVideoCourse[] = [
  {
    slug: "agentes-inteligentes",
    title: "Agentes Inteligentes",
    category: "Inteligência Artificial e Dados",
    description: "IA — Agentes Inteligentes: o que são, como agem e onde se encaixam no ecossistema de inteligência artificial.",
    videoId: "OTOBS4pSXXA",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["IA", "agentes"],
  }
  ,
  {
    slug: "assembly",
    title: "Assembly",
    category: "Programação",
    description: "Introdução ao Assembly e aos registradores da CPU: a base de tudo que o processador executa.",
    videoId: "yw1VpPaPU9U",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["assembly", "registradores", "baixo nível"],
  }
  ,
  {
    slug: "aws",
    title: "AWS",
    category: "Cloud e Infraestrutura",
    description: "AWS Full Course 2026 — computação em nuvem da Amazon: EC2, S3, IAM, VPC, RDS e os primeiros conceitos para operar infraestrutura.",
    videoId: "K2RaupM_fng",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["cloud", "aws", "infraestrutura"],
  }
  ,
  {
    slug: "chatgpt",
    title: "ChatGPT & GPT-5",
    category: "Inteligência Artificial e Dados",
    description: "GPT-5 — o modelo padrão do ChatGPT: como funciona o sistema unificado da OpenAI com raciocínio adaptativo, raciocínio profundo, agentes e casos de uso.",
    videoId: "boJG84Jcf-4",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["IA", "chatgpt", "gpt-5", "openai"],
  },
  {
    slug: "chatgpt-2026",
    title: "Curso de ChatGPT 2026",
    category: "Inteligência Artificial e Dados",
    description: "Curso completo e atualizado de ChatGPT 2026: do básico ao avançado, prompts, ferramentas e aplicações profissionais com GPT-5.",
    videoId: "czwzYb-y138",
    status: "disponivel",
    watchXp: 10,
    minutes: "~1h30",
    tags: ["chatgpt", "gpt-5", "prompts", "openai"],
  },
  {
    slug: "sora-video-ia",
    title: "Sora — Gerador de Vídeo com IA",
    category: "Inteligência Artificial e Dados",
    description: "Sora da OpenAI — como criar vídeos com inteligência artificial a partir de texto: guia completo para produzir vídeos de até 1 minuto em 1080p.",
    videoId: "i3we9T_VaN4",
    status: "disponivel",
    watchXp: 10,
    minutes: "~15 min",
    tags: ["sora", "vídeo", "IA generativa", "openai"],
  },
  {
    slug: "sora-2-tutorial",
    title: "Sora 2 — Como Usar",
    category: "Inteligência Artificial e Dados",
    description: "Sora 2 — a nova geração de geração de vídeo da OpenAI: como obter acesso, testar na prática e criar vídeos realistas com IA.",
    videoId: "_fvk7uwipeA",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["sora", "sora 2", "vídeo", "IA", "openai"],
  }
  ,
  {
    slug: "cics",
    title: "CICS",
    category: "Mainframe",
    description: "Treinamento em CICS no Mainframe: o sistema de processamento de transações da IBM.",
    videoId: "2SQ7w_Jemt8",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["mainframe", "cics", "transações"],
  }
  ,
  {
    slug: "cobol",
    title: "COBOL",
    category: "Mainframe",
    description: "COBOL — aula de introdução à linguagem que sustenta sistemas críticos do mundo financeiro.",
    videoId: "b3PPTWZ89ME",
    status: "disponivel",
    watchXp: 10,
    minutes: "~45 min",
    tags: ["mainframe", "cobol"],
  }
  ,
  {
    slug: "control-m",
    title: "Control-M",
    category: "Mainframe",
    description: "Introdução ao Control-M para Mainframe: orquestração de jobs e automação de fluxos em produção.",
    videoId: "gIMzlIUmaxw",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["mainframe", "control-m", "batch"],
  }
  ,
  {
    slug: "cloud-paas-iaas-saas",
    title: "Cloud, PaaS, IaaS e SaaS",
    category: "Cloud e Infraestrutura",
    description: "Introdução aos modelos de serviço em nuvem: PaaS, IaaS e SaaS e quando usar cada um.",
    videoId: "EU1dayIw44o",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["cloud", "paas", "iaas", "saas"],
  }
  ,
  {
    slug: "cnpj-alfa",
    title: "CNPJ Alfa em COBOL, Java e Python",
    category: "Programação",
    description: "Projeto prático CNPJ Alfa implementado em COBOL, Java e Python: a mesma regra de negócio em três linguagens.",
    videoId: "gm94C-ROt9M",
    status: "disponivel",
    watchXp: 10,
    minutes: "~60 min",
    tags: ["cobol", "java", "python", "projeto"],
  }
  ,
  {
    slug: "db2",
    title: "DB2",
    category: "Banco de Dados",
    description: "Curso de DB2 — introdução ao banco de dados relacional da IBM, amplamente usado em mainframes.",
    videoId: "zi23-0tgtR8",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["db2", "sql", "ibm"],
  }
  ,
  {
    slug: "deep-learning",
    title: "Deep Learning",
    category: "Inteligência Artificial e Dados",
    description: "Deep Learning Full Course 2026 — redes neurais, backpropagation, CNNs, transformers e as últimas novidades em IA generativa.",
    videoId: "u3V-a8Gf_4E",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["deep learning", "redes neurais"],
  }
  ,
  {
    slug: "devops",
    title: "DEVOPS",
    category: "Cloud e Infraestrutura",
    description: "DevOps Full Course 2026 — cultura de colaboração entre dev e ops: CI/CD, infraestrutura como código, containers e automação.",
    videoId: "MGspTJ5eUH0",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["devops", "ci-cd"],
  }
  ,
  {
    slug: "design-thinking",
    title: "Design Thinking",
    category: "Design e Métodos",
    description: "Design Thinking e Agile Frameworks 2026 — empatia, definição, ideação, prototipação e teste com práticas ágeis modernas.",
    videoId: "FhEC8a5iwhQ",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["design", "metodologia"],
  }
  ,
  {
    slug: "docker",
    title: "Docker",
    category: "Cloud e Infraestrutura",
    description: "Docker e Kubernetes — curso completo em 10 horas: containerização, orquestração, deployments, services e escalabilidade.",
    videoId: "sBBFo2JMpno",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["docker", "containers"],
  }
  ,
  {
    slug: "fluxograma",
    title: "Fluxograma",
    category: "Programação",
    description: "Fluxograma — introdução à representação visual de algoritmos e fluxos de decisão.",
    videoId: "T-HmXbljaxY",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["lógica", "algoritmos"],
  }
  ,
  {
    slug: "git-github",
    title: "Git e GitHub",
    category: "Cloud e Infraestrutura",
    description: "Git e GitHub — curso completo para iniciantes: versionamento, commits, branches, pull requests e colaboração profissional.",
    videoId: "kYofz4QDX-Y",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["git", "github", "versionamento"],
  }
  ,
  {
    slug: "html",
    title: "HTML",
    category: "Programação",
    description: "HTML5 e CSS do zero — curso 2026: estrutura de páginas, layouts modernos, responsividade e primeiros projetos integrados.",
    videoId: "ocPlUHgbTwY",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["html", "web"],
  }
  ,
  {
    slug: "java",
    title: "Java",
    category: "Programação",
    description: "Java — conteúdo programático e roteiro para o curso: visão geral da linguagem e do ecossistema.",
    videoId: "zHT7bBUte4w",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["java", "orientação a objetos"],
  }
  ,
  {
    slug: "javascript",
    title: "JavaScript",
    category: "Programação",
    description: "JavaScript — introdução, aula 1: a linguagem que roda em navegadores e servidores.",
    videoId: "ASBz45KcE5k",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["javascript", "web"],
  }
  ,
  {
    slug: "jcl",
    title: "JCL",
    category: "Mainframe",
    description: "Introdução ao JCL — a linguagem de controle de jobs do mainframe, que orquestra a execução de programas.",
    videoId: "46UgQc4MB2I",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["mainframe", "jcl", "batch"],
  }
  ,
  {
    slug: "linux-ubuntu",
    title: "Linux Ubuntu",
    category: "Cloud e Infraestrutura",
    description: "Linux — do básico ao avançado: instalação, comandos essenciais e o cotidiano do sistema operacional no desktop e servidor.",
    videoId: "NtFAKcDkuQQ",
    status: "disponivel",
    watchXp: 10,
    minutes: "~45 min",
    tags: ["linux", "ubuntu"],
  }
  ,
  {
    slug: "linux-opensuse",
    title: "Linux OpenSUSE",
    category: "Cloud e Infraestrutura",
    description: "Linux — curso completo para iniciantes em 2026: comandos essenciais, sistema de arquivos, permissões e administração do sistema.",
    videoId: "xEckAK9pYyY",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["linux", "suse"],
  }
  ,
  {
    slug: "machine-learning",
    title: "Machine Learning",
    category: "Inteligência Artificial e Dados",
    description: "Machine Learning Full Course 2026 — fundamentos, algoritmos supervisionados e não supervisionados, NLP e projetos com dados reais.",
    videoId: "8xZEbktfnCc",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["ml", "dados"],
  }
  ,
  {
    slug: "mainframe",
    title: "Mainframe",
    category: "Mainframe",
    description: "Cursos de Mainframe gratuitos e com certificado: visão geral da plataforma IBM Z.",
    videoId: "OKMbMVK_DnQ",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["mainframe", "ibm z"],
  }
  ,
  {
    slug: "metodologia-agil",
    title: "Metodologia Ágil",
    category: "Design e Métodos",
    description: "Manifesto Ágil — introdução aos valores e princípios do desenvolvimento ágil de software.",
    videoId: "84omXRXDNKs",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["ágil", "scrum", "metodologia"],
  }
  ,
  {
    slug: "mysql",
    title: "MySQL",
    category: "Banco de Dados",
    description: "MySQL — prática junto de HTML e PHP: modelagem, consultas e operações no banco open source.",
    videoId: "6d2Rr4pg0EI",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["mysql", "sql"],
  }
  ,
  {
    slug: "nodejs",
    title: "Node.js",
    category: "Programação",
    description: "Node.js — série completa do iniciante ao avançado: APIs, módulos, async/await e ecossistema npm com projetos práticos.",
    videoId: "LKThSUn2q5k",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["node", "javascript", "backend"],
  }
  ,
  {
    slug: "normalizacao-banco-de-dados",
    title: "Normalização de Banco de Dados",
    category: "Banco de Dados",
    description: "Normalização de banco de dados relacional: formas normais e o combate à redundância.",
    videoId: "e9nUsPIf_H8",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["normalização", "modelo relacional"],
  }
  ,
  {
    slug: "novas-tecnologias",
    title: "Novas Tecnologias",
    category: "Novas Tecnologias",
    description: "As novas tecnologias do mundo atual: panorama do que está transformando o mercado.",
    videoId: "Dv5GS8-EWrM",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["tendências", "inovação"],
  }
  ,
  {
    slug: "php",
    title: "PHP",
    category: "Programação",
    description: "PHP — exercício prático junto de HTML e MySQL: server-side scripting para a web.",
    videoId: "HHqyfE2YrsI",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["php", "web"],
  }
  ,
  {
    slug: "power-bi",
    title: "Power BI",
    category: "Inteligência Artificial e Dados",
    description: "Power BI Full Course 2026 — dashboards interativos, DAX, conexão a fontes de dados e relatórios corporativos do início ao fim.",
    videoId: "imjqNDtfdGs",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["power bi", "dashboards", "analytics"],
  }
  ,
  {
    slug: "python",
    title: "Python",
    category: "Programação",
    description: "Python — aula 2: sintaxe, estruturas de dados e primeiros programas.",
    videoId: "29X3ytFxVxE",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["python"],
  }
  ,
  {
    slug: "registradores",
    title: "Registradores",
    category: "Programação",
    description: "Registradores e suas utilizações: as unidades de memória rápida dentro da CPU.",
    videoId: "eKMGWzcaKfI",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["hardware", "cpu"],
  }
  ,
  {
    slug: "sgdb",
    title: "SGBD — Sistemas de Gerenciamento de Banco de Dados",
    category: "Banco de Dados",
    description: "SGBD — sistema gerenciador de banco de dados: conceitos, arquitetura e exemplos.",
    videoId: "rECGFfugvfM",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["sgbd", "dados"],
  }
  ,
  {
    slug: "sistema-binario",
    title: "Sistema Binário",
    category: "Programação",
    description: "Mainframe e sistema binário: como computadores representam e processam informação em base 2.",
    videoId: "_3ugrCDW6FU",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["binário", "fundamentos"],
  }
  ,
  {
    slug: "sistema-conta-corrente",
    title: "Sistema Conta Corrente",
    category: "Mainframe",
    description: "Mainframe — Cobol: projeto de sistema de contas correntes em aula prática.",
    videoId: "O44Fl9p947Q",
    status: "disponivel",
    watchXp: 10,
    minutes: "~60 min",
    tags: ["cobol", "projeto", "mainframe"],
  }
  ,
  {
    slug: "tso",
    title: "TSO",
    category: "Mainframe",
    description: "TSO — Time Sharing Option do mainframe: interação interativa com o sistema (aula do bloco JCL do canal).",
    videoId: "ux3qyhFdQFc",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["mainframe", "tso", "jcl"],
  }
  ,
  {
    slug: "ux-ui",
    title: "UX/UI",
    category: "Design e Métodos",
    description: "UX/UI Design — curso completo 2026: pesquisa com usuários, personas, wireframes, protótipos e boas práticas de interfaces.",
    videoId: "BP9xV2_iUNk",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["ux", "ui", "design"],
  }
  ,
  {
    slug: "windows-12",
    title: "Windows 12",
    category: "Cloud e Infraestrutura",
    description: "Windows 12 (26H2) — as novidades do sistema operacional da Microsoft com IA integrada, módulos e recursos atualizados.",
    videoId: "qUE-hSuXhXY",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["windows", "sistema operacional"],
  }
  ,
  {
    slug: "wordpress",
    title: "WordPress",
    category: "Cloud e Infraestrutura",
    description: "Curso Completo de WordPress 2026 — do zero ao avançado: instalação, temas, Elementor, plugins e gestão de conteúdo profissional.",
    videoId: "IvSHSPhJc0Q",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["wordpress", "cms", "web"],
  }
  ,
  {
    slug: "iso8583",
    title: "ISO 8583",
    category: "Novas Tecnologias",
    description: "ISO 8583 — o que é e como funciona: o padrão de mensagens usado em transações financeiras.",
    videoId: "dcXTIY2QURM",
    status: "disponivel",
    watchXp: 10,
    minutes: "~35 min",
    tags: ["financeiro", "mensageria"],
  },
  {
    slug: "python-masterclass",
    title: "Python Masterclass",
    category: "Programação",
    description: "Curso Completo de Python do zero ao avançado: sintaxe, estruturas de dados, orientação a objetos e projetos práticos.",
    videoId: "-VeVq64Fgw0",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["python", "masterclass", "do zero ao avançado"],
  },
  {
    slug: "python-2026",
    title: "Python 2026 para Iniciantes",
    category: "Programação",
    description: "Curso Completo de Python 2026 com exercícios: da instalação do ambiente aos primeiros projetos com código real.",
    videoId: "WexDtLkN77k",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["python", "exercícios", "iniciantes"],
  },
  {
    slug: "react-2026",
    title: "React 2026 para Iniciantes",
    category: "Programação",
    description: "Curso de React para completos iniciantes: hooks, componentes, estado e a primeira aplicação funcional.",
    videoId: "2RWsLmu8yVc",
    status: "disponivel",
    watchXp: 10,
    minutes: "~1h30",
    tags: ["react", "hooks", "front-end"],
  },
  {
    slug: "react-projeto",
    title: "React JS com Projeto",
    category: "Programação",
    description: "Curso de React JS do básico ao avançado com projeto prático: componentes, rotas e deploy da aplicação.",
    videoId: "ERflhpiMc1o",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["react", "projeto", "deploy"],
  },
  {
    slug: "dominar-ia",
    title: "Domine a IA",
    category: "Inteligência Artificial e Dados",
    description: "Aprenda a dominar a IA: curso completo com ChatGPT, Gemini, Claude e Copilot aplicados ao dia a dia profissional.",
    videoId: "HcB2qiQTXgg",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["chatgpt", "gemini", "copilot"],
  },
  {
    slug: "cursoemvideo-ia",
    title: "IA com Curso em Vídeo",
    category: "Inteligência Artificial e Dados",
    description: "Curso grátis de Inteligência Artificial do Curso em Vídeo: resumo do programa, objetivos e por onde começar os estudos de IA.",
    videoId: "jQMbuK6URws",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["ia", "introdução"],
  },
  {
    slug: "ia-modulo-1",
    title: "IA: O que Vamos Aprender",
    category: "Inteligência Artificial e Dados",
    description: "Curso de IA módulo 1 (Curso em Vídeo): para quem o curso foi criado, os objetivos e como usar ChatGPT e Gemini na prática.",
    videoId: "xUarb_lxPUc",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["ia", "prompt", "gemini"],
  },
  {
    slug: "sql-completo-2025",
    title: "SQL Completo 2025",
    category: "Banco de Dados",
    description: "Curso Completo de SQL com PostgreSQL — do zero ao avançado: modelagem, consultas, joins e administração do banco.",
    videoId: "9cAKQWodpvM",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["sql", "desafios", "prática"],
  },
  {
    slug: "sql-server",
    title: "SQL Server do Básico ao Avançado",
    category: "Banco de Dados",
    description: "SQL Full Course 2026: consultas, joins, agregações, subqueries, normalização e administração de banco do básico ao avançado.",
    videoId: "dtOCwqDUF1w",
    status: "disponivel",
    watchXp: 10,
    minutes: "~2h",
    tags: ["sql server", "queries", "administração"],
  },
  {
    slug: "mysql-curso",
    title: "MySQL — O que é um Banco de Dados",
    category: "Banco de Dados",
    description: "Curso MySQL aula 1: como surgiram os bancos de dados, o modelo relacional e a instalação do MySQL Workbench.",
    videoId: "Ofktsne-utM",
    status: "disponivel",
    watchXp: 10,
    minutes: "~30 min",
    tags: ["mysql", "relacional", "workbench"],
  },
  {
    slug: "kubernetes-aws",
    title: "Kubernetes na AWS",
    category: "Cloud e Infraestrutura",
    description: "Kubernetes on AWS explicado em 60 minutos: clusters gerenciados com Amazon EKS, pods, serviços e escalabilidade.",
    videoId: "SO3L2A8K8xA",
    status: "disponivel",
    watchXp: 10,
    minutes: "~1h",
    tags: ["kubernetes", "eks", "containers"],
  },
  {
    slug: "uiux-bootcamp",
    title: "UI/UX Design Bootcamp",
    category: "Design e Métodos",
    description: "UI/UX Design Full Course 2026 — do iniciante ao avançado: design thinking, interfaces responsivas, Figma e teste com usuários.",
    videoId: "P3z_BtloU4M",
    status: "disponivel",
    watchXp: 10,
    minutes: "~1h30",
    tags: ["ui", "ux", "protótipos"],
  },
  {
    slug: "ux-na-pratica",
    title: "UX Design na Prática",
    category: "Design e Métodos",
    description: "Cursos gratuitos de UX Design: fundamentos de experiência do usuário, fluxos e boas práticas de design.",
    videoId: "Kmknqm3LnUY",
    status: "disponivel",
    watchXp: 10,
    minutes: "~40 min",
    tags: ["ux", "experiência do usuário"],
  },
  {
    slug: "blockchain",
    title: "Desvendando a Blockchain",
    category: "Novas Tecnologias",
    description: "Blockchain Full Course 2026 — criptografia, blocos, consenso, smart contracts, Web3 e as aplicações além das criptomoedas.",
    videoId: "rbXCEj2F6Vs",
    status: "disponivel",
    watchXp: 10,
    minutes: "~45 min",
    tags: ["blockchain", "criptografia", "consenso"],
  },
  {
    slug: "iot",
    title: "Internet das Coisas",
    category: "Novas Tecnologias",
    description: "IoT — o que é e como funciona: sensores, conectividade e casos reais de Internet das Coisas no mundo.",
    videoId: "bmGUCLks3qQ",
    status: "disponivel",
    watchXp: 10,
    minutes: "~25 min",
    tags: ["iot", "sensores", "conectividade"],
  },
  {
    slug: "iot-esp32",
    title: "IoT com ESP32",
    category: "Novas Tecnologias",
    description: "ESP32 primeiros passos: introdução à Internet das Coisas com hardware maker, projetos práticos de robótica e automação.",
    videoId: "OY-GmPdd59U",
    status: "disponivel",
    watchXp: 10,
    minutes: "~20 min",
    tags: ["esp32", "maker", "hardware"],
  },
];

export const APOSTILAS_GITHUB_URL = "https://github.com/jorgegil1905/Apostilas-das-Aulas";

export function getFreeCourseBySlug(slug: string): FreeVideoCourse | undefined {
  return FREE_VIDEO_COURSES.find((course) => course.slug === slug);
}

export const FREE_VIDEO_XP_PER_WATCH = 10;

export const FREE_VIDEO_BADGE_MILESTONES = [
  { count: 10, code: "free-courses-10", title: "Colecionador Gratuito I", description: "Assistiu a 10 cursos da biblioteca gratuita em vídeo.", xp: 25 },
  { count: 20, code: "free-courses-20", title: "Colecionador Gratuito II", description: "Assistiu a 20 cursos da biblioteca gratuita em vídeo.", xp: 40 },
  { count: 30, code: "free-courses-30", title: "Colecionador Gratuito III", description: "Assistiu a 30 cursos da biblioteca gratuita em vídeo.", xp: 60 },
] as const;

export const FREE_VIDEO_COURSES_SLUG = "cursos-gratuitos";

/**
 * Category completion badges: unlocked when the learner has watched every
 * available course of a category. "Todos" is not a real category.
 */
export type FreeCategoryBadge = {
  category: string;
  code: string;
  title: string;
  description: string;
  xp: number;
};

function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const FREE_CATEGORY_BADGES: readonly FreeCategoryBadge[] = FREE_VIDEO_COURSE_CATEGORIES
  .filter((category) => category !== "Todos")
  .map((category) => {
    const available = FREE_VIDEO_COURSES.filter((course) => course.category === category && course.status === "disponivel");
    return {
      category,
      code: `free-category-${slugifyCategory(category)}`,
      title: `Pioneiro ${category}`,
      description: available.length > 1
        ? `Concluiu todos os ${available.length} cursos de ${category} da biblioteca gratuita.`
        : `Concluiu o curso de ${category} da biblioteca gratuita.`,
      xp: 30,
    } as const;
  });

export function getCategoryBadgeForCategory(category: string): FreeCategoryBadge | undefined {
  return FREE_CATEGORY_BADGES.find((badge) => badge.category === category);
}

export function getFreeCoursesByCategory(category: string): readonly FreeVideoCourse[] {
  return FREE_VIDEO_COURSES.filter((course) => course.category === category);
}

