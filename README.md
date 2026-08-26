# CyberDimension Academy

A **CyberDimension Academy** é uma plataforma educacional fullstack para estudo estruturado de cibersegurança. O projeto organiza academias, trilhas, cursos, aulas, laboratórios, avaliações e recursos de acompanhamento em uma aplicação web única, com conteúdo curricular versionado no código e dados operacionais persistidos em MySQL/TiDB.

> Este repositório é um projeto educacional e de portfólio. Ele permite estudar a arquitetura, executar a aplicação localmente e propor melhorias. A versão atual ainda possui adaptadores específicos da infraestrutura Manus; a independência completa exige a migração descrita na documentação.

## Sobre o projeto

A plataforma foi estruturada para apoiar uma jornada progressiva de aprendizagem, do nível iniciante ao avançado. O aluno pode navegar por academias e trilhas, estudar cursos e aulas, praticar em laboratórios guiados, responder quizzes e avaliações, acompanhar progresso e XP, registrar projetos e consultar certificados e conquistas.

O catálogo também inclui conteúdos em áudio no **CyberCast**, recursos de preparação para a trilha CompTIA Security+ SY0-701, módulo de inglês técnico para cibersegurança, Career Readiness, portfólio e um IA Tutor integrado de forma opcional.

## Objetivos

- oferecer aprendizado estruturado em cibersegurança;
- apoiar a preparação e o desenvolvimento de competências;
- acompanhar progresso, conclusão e marcos de aprendizagem;
- conectar estudo teórico a projetos e laboratórios práticos;
- avaliar conhecimento por quizzes e simulados;
- organizar a jornada do aluno por academias, trilhas e recomendações.

## Principais funcionalidades

As funcionalidades abaixo estão representadas no código, no schema, nas rotas tRPC, nos catálogos compartilhados ou nos testes do repositório.

| Área | Recursos disponíveis |
|---|---|
| **Academias e trilhas** | Catálogo por nível e especialidade, academias de Blue Team, Red Team, GRC, Cloud Security, Threat Intelligence e Security Engineering, além da trilha Security+ semanal. |
| **Cursos e aulas** | Formações ORBIT, cursos curriculares adicionais, aulas estruturadas, modo de leitura, preferências de fonte e espaçamento, modo foco e tema claro/escuro. |
| **Prática** | Laboratórios e missões guiadas, desafios, projetos, evidências de laboratório e área de portfólio. |
| **Avaliações** | Quizzes modulares, simulados, avaliações finais, feedback pedagógico, tentativas persistidas e reforço por questões. |
| **Progresso e gamificação** | Progresso por curso e domínio, conclusão de aulas, XP, níveis, badges, sequências e desafios semanais. |
| **Certificados** | Emissão nominal condicionada aos requisitos da formação, histórico, verificação pública, impressão/PDF pelo navegador e compartilhamento no LinkedIn. |
| **CyberCast** | Biblioteca de episódios de áudio organizada por séries, player com seek, velocidade, favoritos, download, transcrição e quizzes de revisão. |
| **Dashboards e perfil** | Dashboard do aluno, seção “Continuar assistindo”, Favoritos, perfil, certificados, portfólio e Career Readiness. |
| **Administração** | Área administrativa protegida por role, visualização de progresso, filtros e moderação de evidências de portfólio. |
| **IA Tutor** | Chat contextual para dúvidas de cibersegurança, com suporte opcional ao NVIDIA NIM e fallback controlado conforme a configuração disponível. |

## Arquitetura

A aplicação é um monólito web em TypeScript. O frontend React é servido pelo mesmo processo Node/Express que expõe a API tRPC.

```text
Navegador React/TSX
        │
        │ tRPC em /api/trpc
        ▼
Node.js + Express + tRPC
        │
        ├── Contexto de autenticação e autorização
        ├── Routers e regras de negócio
        ├── Drizzle ORM ───────────► MySQL/TiDB
        ├── Abstração de storage ──► Forge/S3 conforme o ambiente
        └── Integrações externas ──► NVIDIA, Resend, YouTube, LinkedIn e mapas
```

O frontend começa em `client/src/main.tsx`, com rotas e shells em `client/src/App.tsx`. O backend começa em `server/_core/index.ts`; o contexto tRPC fica em `server/_core/context.ts`, as procedures e regras principais em `server/routers.ts` e os helpers de banco em `server/db.ts`.

O schema declarativo está em `drizzle/schema.ts`, as relações em `drizzle/relations.ts` e as **35 migrations SQL versionadas** em `drizzle/`, com sequência de `0000` a `0034`. A conexão usa `DATABASE_URL`, Drizzle ORM e `mysql2`.

A autenticação combina fluxos próprios por e-mail com a camada de sessão do template. O contexto ainda conhece OAuth Manus por meio de `server/_core/sdk.ts`; portanto, uma instalação externa precisa substituir ou parametrizar esse adaptador antes de ser considerada independente.

O storage é acessado por `server/storage.ts` e `server/_core/storageProxy.ts`. A implementação atual usa endpoints Forge da Manus para presigned URLs, caminhos `/manus-storage/*` e streaming de áudio com Range. Uma futura migração S3-compatible deve preservar autorização, CORS, `Accept-Ranges`, `Content-Range`, `Content-Length` e `Content-Type`.

Os testes automatizados usam Vitest. A API é tipada com tRPC 11 e datas são serializadas com SuperJSON.

## Stack tecnológica

- **Frontend:** React 19, TypeScript/TSX, Vite, Tailwind CSS 4, Radix UI, React Query, Wouter, Recharts, Framer Motion e Lucide React.
- **Backend:** Node.js, Express 4, tRPC 11, SuperJSON, Zod e TSX.
- **Persistência:** MySQL/TiDB, MySQL2, Drizzle ORM e Drizzle Kit.
- **Autenticação e segurança:** cookies de sessão, JWT, fluxos por e-mail e `jose`; o hash de credenciais usa a implementação existente no backend.
- **Integrações opcionais:** NVIDIA NIM, Resend, YouTube, LinkedIn e serviços de mapas conforme a configuração do ambiente.
- **Qualidade:** TypeScript, Vitest, Prettier e GitHub Actions.
- **Licença declarada no projeto:** MIT, conforme `package.json`.

## Estrutura do projeto

```text
client/
  src/
    components/       componentes reutilizáveis e UI
    contexts/         contexto de tema e preferências
    data/             catálogos e dados curriculares do frontend
    hooks/            hooks compartilhados
    lib/              cliente tRPC e utilitários
    pages/            páginas e fluxos da aplicação
    App.tsx           rotas e shells principais
    main.tsx          ponto de entrada do frontend
  public/             arquivos pequenos de configuração

drizzle/
  schema.ts           tabelas e tipos declarativos
  relations.ts        relações Drizzle
  *.sql               35 migrations versionadas
  meta/               metadados do histórico Drizzle

server/
  _core/              servidor, contexto, sessão, integrações e runtime
  db.ts               helpers de acesso ao banco
  routers.ts          procedures tRPC e regras de negócio
  *.ts                módulos de domínio e testes Vitest

shared/                tipos, catálogos, quizzes e regras compartilhadas
docs/                  arquitetura, deploy, storage, migração e fontes
scripts/               scripts públicos de manutenção não sensíveis
.github/workflows/     validação automatizada de tipos, testes e build
```

## Como executar localmente

### Pré-requisitos

Use Node.js 22, pnpm 10 e um banco MySQL/TiDB compatível. A aplicação espera que `DATABASE_URL` esteja configurada antes dos comandos do Drizzle.

### Instalação

```bash
git clone https://github.com/thiagobuente/cyberdimension-academy.git
cd cyberdimension-academy
pnpm install --frozen-lockfile
cp docs/ENVIRONMENT_VARIABLES.example.txt .env
```

Preencha o `.env` apenas localmente, com valores próprios para desenvolvimento. Não versione esse arquivo.

### Banco e migrations

Configure `DATABASE_URL` apontando para um banco MySQL/TiDB de desenvolvimento e execute:

```bash
pnpm db:push
```

O comando existente no `package.json` chama o Drizzle Kit para gerar e aplicar as migrations. As migrations versionadas ficam em `drizzle/`; a sequência atual contém 35 arquivos, de `0000` a `0034`.

### Iniciar a aplicação

```bash
pnpm dev
```

Abra `http://localhost:3000`. Para gerar o bundle de produção e iniciar o servidor empacotado:

```bash
pnpm run build
pnpm start
```

Em uma instalação externa, o build pode ser executado com `MANUS_RUNTIME=false` para não ativar os plugins específicos de runtime/preview Manus:

```bash
MANUS_RUNTIME=false pnpm run build
```

### Verificações e testes

```bash
pnpm check
pnpm test
```

A validação registrada no checkpoint atual executou **350 testes aprovados e 1 ignorado**. Esse resultado documenta aquela execução e não constitui garantia permanente para alterações futuras.

## Variáveis de ambiente

O repositório fornece `docs/ENVIRONMENT_VARIABLES.example.txt` e `CONFIGURATION_TEMPLATE.txt` como templates sem credenciais reais. Os valores devem ser configurados localmente ou no ambiente de hospedagem.

| Variável | Finalidade |
|---|---|
| `NODE_ENV` | Define o ambiente de execução do Node. |
| `MANUS_RUNTIME` | Controla a ativação de plugins específicos do runtime Manus; em builds externos, pode ser `false`. |
| `APP_BASE_URL` | URL base usada pelos fluxos que precisam construir links da aplicação. |
| `DATABASE_URL` | String de conexão MySQL/TiDB usada pelo Drizzle. |
| `JWT_SECRET` | Segredo para assinatura e validação de sessões JWT. |
| `ADMIN_EMAIL` | E-mail da conta administrativa configurada no ambiente. |
| `ADMIN_PASSWORD` | Senha da conta administrativa configurada no ambiente. |
| `RESEND_API_KEY` | Chave opcional para envio de e-mails pelo Resend. |
| `RESEND_FROM_EMAIL` | Remetente usado pelo Resend. |
| `NVIDIA_API_KEY` | Chave opcional para o NVIDIA NIM. |
| `NVIDIA_NIM_MODEL` | Modelo usado pelo NVIDIA NIM. |
| `NVIDIA_NIM_BASE_URL` | Endpoint OpenAI-compatible do NVIDIA NIM. |
| `VITE_APP_TITLE` | Título da aplicação exposto ao frontend. |
| `VITE_APP_LOGO` | Referência opcional de logo para o frontend. |
| `VITE_ANALYTICS_ENDPOINT` | Endpoint opcional de analytics. |
| `VITE_ANALYTICS_WEBSITE_ID` | Identificador opcional do site no analytics. |
| `VITE_APP_ID` | Identificador do aplicativo OAuth Manus, usado apenas quando a instalação permanece na Manus. |
| `OAUTH_SERVER_URL` | URL do servidor OAuth Manus, usado apenas para compatibilidade Manus. |
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth Manus no frontend. |
| `OWNER_OPEN_ID` | Identificador do proprietário no ambiente Manus. |
| `BUILT_IN_FORGE_API_URL` | Endpoint das APIs Forge Manus. |
| `BUILT_IN_FORGE_API_KEY` | Credencial server-side das APIs Forge Manus. |
| `VITE_FRONTEND_FORGE_API_URL` | Endpoint Forge exposto ao frontend. |
| `VITE_FRONTEND_FORGE_API_KEY` | Credencial Forge destinada ao frontend quando exigida pelo runtime Manus. |

As variáveis OAuth, Forge e `OWNER_OPEN_ID` são mantidas no template para compatibilidade e documentação da instalação atual; não representam uma implementação externa já concluída.

## Banco de dados

O banco atual é **MySQL/TiDB**, acessado por Drizzle ORM e `mysql2`. O schema e as relações são mantidos em TypeScript, enquanto as migrations SQL são versionadas em `drizzle/`.

Atualmente existem **35 migrations**, numeradas consecutivamente de `0000` a `0034`, incluindo `drizzle/0026_public_portfolio_career.sql`. O repositório não depende de RLS, views, triggers ou procedures externas identificadas na documentação de arquitetura. A autorização de negócio é aplicada nas procedures tRPC e no campo de role dos usuários.

Não há seed de produção autorizado nem comando `seed` dedicado no `package.json`. Scripts públicos de manutenção devem ser avaliados individualmente antes de qualquer execução.

## Testes

A suíte utiliza Vitest e cobre fluxos de autenticação, cursos, conteúdo, progresso, quizzes, certificados, portfólio, podcasts, IA Tutor, catálogo, acessibilidade e contratos de layout.

A última validação registrada no projeto reportou **350 testes aprovados e 1 ignorado**. O teste ignorado depende de configuração externa. Execute novamente `pnpm check` e `pnpm test` após qualquer alteração relevante.

## Segurança

Secrets, senhas reais, tokens, chaves privadas, URLs de banco com credenciais, dados de alunos, dumps e arquivos `.env` reais não devem ser versionados. O repositório contém apenas nomes de variáveis, placeholders documentais e configurações de teste não produtivas.

Credenciais sensíveis devem ser configuradas por variáveis de ambiente ou pelo secret manager do ambiente de execução. Antes de abrir um pull request, revise o diff, procure por material sensível e confirme que nenhum dado pessoal desnecessário foi adicionado.

Os laboratórios de segurança devem ser usados somente em ambientes próprios ou explicitamente autorizados. O projeto tem finalidade educacional e não substitui autorização, revisão ou controles de segurança para uso em produção.

## Dependências específicas da Manus

A versão publicada neste repositório ainda contém pontos específicos da infraestrutura Manus. Essa limitação é documentada deliberadamente para que futuros responsáveis consigam planejar a substituição sem confundir o código de domínio com os adaptadores de plataforma.

| Componente | Localização principal | Situação atual |
|---|---|---|
| OAuth e sessão | `server/_core/sdk.ts`, `server/_core/context.ts`, `server/_core/oauth.ts` | O contexto ainda conhece OAuth Manus e endpoints relacionados. |
| Storage e mídia | `server/storage.ts`, `server/_core/storageProxy.ts` | Usa Forge/prefixos `/manus-storage/*` e rota de áudio com Range. |
| APIs internas | `server/_core/dataApi.ts`, `server/_core/notification.ts`, `server/_core/imageGeneration.ts`, `server/_core/voiceTranscription.ts` | Dependem de APIs Forge ou precisam de substitutos externos quando utilizados. |
| Mapas | `server/_core/map.ts`, `client/src/components/Map.tsx` | Integração depende da configuração de mapas disponível no ambiente. |
| Runtime e preview | `vite.config.ts`, `MANUS_RUNTIME` | O build externo pode desativar o plugin de runtime com `MANUS_RUNTIME=false`. |

A migração externa deve preservar IDs internos, regras de negócio, autorização, referências de mídia, suporte a Range e dados de progresso. Consulte [`docs/EXTERNAL_HOSTING_MIGRATION.md`](docs/EXTERNAL_HOSTING_MIGRATION.md), [`docs/MIGRATION.md`](docs/MIGRATION.md) e [`docs/STORAGE.md`](docs/STORAGE.md) antes de trocar qualquer adaptador.

## Migração e deploy externo

O projeto foi preparado e documentado para futura hospedagem externa, mas **nenhuma infraestrutura externa é declarada como funcionando por este repositório**. Render, Railway, Aiven, Cloudflare R2 e outros provedores podem ser opções de arquitetura futura, porém sua configuração, provisionamento, secrets, migração de dados e validação ponta a ponta não fazem parte desta entrega documental.

Uma migração responsável deve criar ambientes separados, configurar um MySQL compatível, substituir autenticação e storage, revisar integrações, aplicar as 35 migrations em banco vazio, executar testes e validar cursos, aulas, progresso, quizzes, certificados, podcasts, uploads e administração antes de qualquer mudança de domínio ou DNS.

## Roadmap

- [x] Plataforma educacional funcional no código atual
- [x] Academias, cursos e trilhas
- [x] Aulas, laboratórios e avaliações
- [x] Projetos, progresso e gamificação
- [x] Certificados e verificação pública
- [x] Testes automatizados
- [x] Documentação de arquitetura, execução e migração
- [x] Repositório público sanitizado para estudo
- [ ] Independência completa da infraestrutura Manus
- [ ] Hospedagem externa independente validada ponta a ponta

## Contribuição

Para estudar e propor melhorias:

```bash
git clone https://github.com/thiagobuente/cyberdimension-academy.git
cd cyberdimension-academy
pnpm install --frozen-lockfile
cp docs/ENVIRONMENT_VARIABLES.example.txt .env
# configure um banco de desenvolvimento e DATABASE_URL
pnpm db:push
pnpm check
pnpm test
```

Leia [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) antes de alterar contratos, schema ou adaptadores. Mudanças de banco devem atualizar `drizzle/schema.ts`, gerar a migration correspondente e manter o histórico consistente. Pull requests devem explicar o impacto, incluir testes e não conter secrets, dados pessoais ou artefatos de produção.

## Licença

O `package.json` declara a licença **MIT**. Consulte o campo `license` do projeto antes de redistribuir alterações ou adicionar materiais externos com regras próprias.

## Aviso educacional

A CyberDimension Academy é um projeto educacional e de portfólio. Conteúdo, exemplos, laboratórios e integrações devem ser verificados antes de uso em ambiente de produção. Testes de segurança devem ocorrer somente com autorização explícita e dentro do escopo permitido.

## Projeto

**CyberDimension Academy** — plataforma open source de estudo e experimentação em cibersegurança.

Repositório: [github.com/thiagobuente/cyberdimension-academy](https://github.com/thiagobuente/cyberdimension-academy)

Documentação complementar:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitetura e fluxos principais;
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — instalação e deploy documentados;
- [`docs/MIGRATION.md`](docs/MIGRATION.md) — retirada da Manus por área;
- [`docs/STORAGE.md`](docs/STORAGE.md) — storage, mídia e migração;
- [`docs/EXTERNAL_HOSTING_MIGRATION.md`](docs/EXTERNAL_HOSTING_MIGRATION.md) — matriz de dependências externas;
- [`docs/ENVIRONMENT_VARIABLES.example.txt`](docs/ENVIRONMENT_VARIABLES.example.txt) — template de variáveis sem valores reais;
- [`docs/EXPORT_MANIFEST.md`](docs/EXPORT_MANIFEST.md) — manifesto da exportação pública.
