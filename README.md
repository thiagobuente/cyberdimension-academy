# CyberDimension Academy

Plataforma fullstack de ensino de cibersegurança com trilhas do nível iniciante ao avançado, aulas autorais, laboratórios guiados, quizzes, progresso persistente, certificados, favoritos, portfólio, CyberCast e IA Tutor.

> Este repositório é uma exportação de código reproduzível. Ele contém a aplicação e suas migrações, mas a instalação externa ainda exige substituir os adaptadores ligados à Manus descritos na documentação.

## Visão geral

A aplicação usa um frontend React servido junto de um backend Node/Express. O navegador chama a API tRPC; o backend aplica regras de negócio, autenticação e autorização, consulta o banco por Drizzle e acessa storage e APIs externas por adaptadores. O conteúdo curricular autoral está versionado no código e o banco guarda os dados operacionais do aluno.

## Tecnologias

React 19, TypeScript, TSX, Vite, Tailwind CSS 4, Radix UI, React Query, Wouter, Node.js, Express 4, tRPC 11, Drizzle ORM, MySQL/TiDB, MySQL2, Zod, Vitest, QRCode, Recharts, Framer Motion, NVIDIA NIM opcional e Resend opcional.

## Estrutura

```text
client/                 frontend React, páginas, componentes, hooks e estilos
server/                 backend, routers, banco, auth, storage e integrações
drizzle/                schema, relações e migrações SQL
shared/                 tipos e utilitários compartilhados
scripts/                scripts de conteúdo e manutenção não sensíveis
docs/                   arquitetura, deploy, storage, migração e GitHub
.github/workflows/      CI de tipos, testes e build
CONFIGURATION_TEMPLATE.txt
```

## Requisitos

Use Node.js 22, pnpm 10 e um banco MySQL/TiDB compatível. Para recursos completos, configure também um storage S3-compatible, provedor de autenticação, e-mail transacional e APIs opcionais. A infraestrutura Manus não é requisito para entender o código, mas alguns adaptadores atuais ainda dependem dela em runtime.

## Configuração local

```bash
git clone https://github.com/thiagobuente/cyberdimension-academy.git
cd cyberdimension-academy
pnpm install --frozen-lockfile
cp docs/ENVIRONMENT_VARIABLES.example.txt .env
# preencha os valores localmente; nunca faça commit do .env
pnpm db:push
pnpm dev
```

Abra `http://localhost:3000`. O template de variáveis e as regras de secrets estão em `CONFIGURATION_TEMPLATE.txt` e `docs/DEPLOY.md`.

## Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `pnpm dev` | Executa o servidor em desenvolvimento com reload |
| `pnpm build` | Gera o frontend e empacota o backend |
| `MANUS_RUNTIME=false pnpm run build` | Build externo sem ativar plugins de runtime/preview Manus |
| `pnpm start` | Inicia `dist/index.js` em produção |
| `pnpm check` | Verifica TypeScript sem emitir arquivos |
| `pnpm test` | Executa a suíte Vitest |
| `pnpm format` | Formata arquivos com Prettier |
| `pnpm db:push` | Gera e aplica migrações Drizzle |

Não existem comandos `lint` ou `seed` dedicados no `package.json` atual. Scripts de conteúdo presentes em `scripts/` devem ser revisados e executados individualmente; não há seed de produção autorizado neste repositório.

## Banco de dados

O schema está em `drizzle/schema.ts`, as relações em `drizzle/relations.ts` e as migrações em `drizzle/`. A aplicação usa `DATABASE_URL`. O banco guarda usuários, credenciais, progresso, aulas, quizzes, certificados, badges, favoritos, portfólio, laboratórios e episódios. Não publique dados pessoais ou dumps. Consulte `docs/ARCHITECTURE.md` e `docs/DEPLOY.md` para a sequência de criação, migração e validação.

## Frontend e backend

O frontend está em `client/src/` e o backend começa em `server/_core/index.ts`. As rotas tRPC estão em `server/routers.ts`; o contexto é construído por `server/_core/context.ts`; o acesso a dados fica em `server/db.ts`. A aplicação é um monólito executável, portanto frontend e backend podem ser publicados juntos. O provedor deve encaminhar `/api/trpc` ao processo Node e preservar fallback para a aplicação web.

## Autenticação e autorização

O projeto separa aluno e administrador por role e usa procedures protegidas/administrativas. O contexto atual ainda passa pelo SDK em `server/_core/sdk.ts`, que conhece OAuth Manus e sessões JWT. Em infraestrutura externa, implemente o adaptador próprio ou conecte um IdP, migre os identificadores e configure cookies, recuperação de acesso, rotação de sessão e rate limiting. Não reutilize tokens Manus.

## Storage e uploads

Avatares, evidências, anexos, áudios e outros arquivos usam a abstração em `server/storage.ts`. O fluxo atual obtém presigned URLs pelo Forge e expõe `/manus-storage/*` e `/podcast-audio/:key`. Em ambiente externo, use um bucket S3-compatible e preserve presign, autorização, CORS, cache, Range e `Content-Range`. O procedimento está em `docs/STORAGE.md`.

## APIs, embeds e integrações

NVIDIA NIM pode atender o IA Tutor diretamente pelo backend. Resend pode entregar e-mails. YouTube é usado por embeds de conteúdo externo, sujeito às políticas e licenças do provedor. Links LinkedIn e QR Codes são gerados no cliente. Mapas, transcrição, geração de imagens, notificações, Data API, OAuth e storage Forge precisam de substitutos externos ou desativação controlada. O inventário completo está em `docs/EXTERNAL_HOSTING_MIGRATION.md`.

## Webhooks e jobs

Não foram identificados webhooks de negócio ativos nem chamadas de jobs da aplicação durante a auditoria. O helper Heartbeat presente em `server/_core/heartbeat.ts` é infraestrutura do template e não representa um agendamento ativo. Se novos processos forem adicionados, registre frequência, comando, payload, autenticação, retry, lock e observabilidade.

## Build e deploy

O workflow `.github/workflows/ci.yml` executa instalação com lockfile, TypeScript, testes e build. Use `MANUS_RUNTIME=false` fora da Manus. O guia passo a passo está em `docs/DEPLOY.md`; a retirada por área está em `docs/MIGRATION.md`; a arquitetura está em `docs/ARCHITECTURE.md`.

## Testes

A suíte validada possui 350 testes aprovados e 1 ignorado por depender de configuração externa. O teste NVIDIA externo pode exigir uma chave e rede disponíveis. Execute:

```bash
pnpm run check
pnpm exec vitest run --exclude server/nvidia.health.test.ts --pool=forks --poolOptions.forks.singleFork=true
```

## Segurança pública

Nunca publique `.env`, tokens, chaves, senhas, private keys, URLs de banco com senha, dados de alunos, dumps, logs, artefatos de build ou credenciais de serviços. Antes do push, revise `git diff --cached`, execute secret scanning e configure secrets somente no GitHub Actions ou no provedor de hospedagem.

## Migração da Manus

A migração completa não é apenas copiar o frontend. É necessário criar banco e storage externos, substituir autenticação/OAuth, atualizar URLs de mídia, trocar APIs Forge, configurar e-mail/IA/mapas quando usados, revisar domínio e DNS e executar validação ponta a ponta. Veja `docs/MIGRATION.md`.

## Documentação complementar

- `docs/ARCHITECTURE.md` — arquitetura, módulos e fluxo de dados.
- `docs/DEPLOY.md` — instalação e deploy externo.
- `docs/MIGRATION.md` — retirada da Manus por área.
- `docs/STORAGE.md` — inventário e migração de arquivos.
- `docs/EXTERNAL_HOSTING_MIGRATION.md` — matriz completa de dependências Manus.
- `docs/GITHUB_SETUP.md` — publicação e secrets no GitHub.
- `docs/EXPORT_MANIFEST.md` — conteúdo e exclusões da exportação.
- `docs/ENVIRONMENT_VARIABLES.example.txt` — nomes de variáveis sem valores reais.
