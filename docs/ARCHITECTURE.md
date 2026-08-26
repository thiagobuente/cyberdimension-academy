# Arquitetura da CyberDimension Academy

## Visão geral

A CyberDimension Academy é uma aplicação web fullstack monolítica em TypeScript. O frontend React é servido pelo mesmo processo Node/Express que expõe a API tRPC. O banco é MySQL/TiDB acessado por Drizzle ORM. Arquivos de usuário e mídia são tratados por uma abstração de storage, atualmente ligada ao Forge da Manus.

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
        ├── Storage abstraction ───► S3/Forge atual
        └── Integrações externas ──► NVIDIA, Resend, YouTube, LinkedIn, mapas
```

## Frontend

O ponto de entrada é `client/src/main.tsx`, com rotas e shells em `client/src/App.tsx`. As páginas estão em `client/src/pages/`, componentes reutilizáveis em `client/src/components/`, hooks em `client/src/hooks/`, contexto de tema em `client/src/contexts/` e o cliente tRPC em `client/src/lib/trpc.ts`.

O frontend usa React 19, TypeScript/TSX, Vite, Tailwind CSS 4, Radix UI, React Query, Wouter, Recharts, Framer Motion e Lucide. O conteúdo educacional e catálogos autorais ficam em arquivos TypeScript sob `client/src/data/` e são consumidos pelas páginas e pelos testes.

## Backend

O servidor inicia em `server/_core/index.ts`. O contexto tRPC é criado em `server/_core/context.ts`; cada requisição tenta obter um usuário e expõe `ctx.user` para procedures públicas, protegidas e administrativas. As regras de negócio estão em `server/routers.ts` e helpers em `server/db.ts` e arquivos de domínio do diretório `server/`.

A API é tipada com tRPC 11 e usa SuperJSON para serializar datas. O Express também registra callback OAuth, proxy de storage e streaming de áudio. O servidor deve receber a porta do ambiente de hospedagem; não deve assumir uma porta fixa em produção.

## Banco de dados

O esquema declarativo está em `drizzle/schema.ts`, as relações em `drizzle/relations.ts` e as migrações em `drizzle/`. A conexão usa `DATABASE_URL` e `mysql2`. O banco contém entidades para usuários, credenciais, tokens de acesso, cursos, lições, módulos, perguntas, tentativas, progresso, certificados, badges, favoritos, portfólio, laboratórios, episódios e recursos relacionados.

A aplicação não depende de RLS, views, triggers ou procedures externas identificadas na auditoria. A autorização é aplicada nas procedures e no modelo de roles. Em uma migração, revisar as constraints e índices diretamente no SQL gerado antes de aplicar em produção.

## Autenticação

A implementação atual combina fluxos próprios por e-mail com a camada de sessão do template. `server/_core/context.ts` delega a autenticação a `server/_core/sdk.ts`, que valida JWT e ainda conhece endpoints OAuth Manus. Para uma hospedagem externa, o contexto deve usar um adaptador próprio ou IdP escolhido, mantendo o carregamento do usuário, o papel `admin`/`user`, expiração, cookies seguros e proteção contra abuso.

A troca de provedor não é apenas uma alteração de URL: o callback, o formato dos tokens, o identificador externo do usuário, a sincronização e a recuperação de acesso precisam ser mapeados. Consulte `docs/MIGRATION.md` antes de migrar contas.

## Storage e mídia

`server/storage.ts` solicita presigned URLs ao Forge e retorna caminhos locais `/manus-storage/{key}`. `server/_core/storageProxy.ts` converte esses caminhos em redirects assinados e mantém uma rota especial `/podcast-audio/:key` para Range, buffer, seek e download de áudio.

Fora da Manus, o adaptador deve usar um bucket S3-compatible e preservar a separação entre metadados no banco e bytes no storage. O streaming deve manter `Accept-Ranges`, `Content-Range`, `Content-Length`, `Content-Type`, CORS restrito e autorização adequada.

## Integrações externas

O IA Tutor pode usar NVIDIA NIM por endpoint OpenAI-compatible, com a chave somente no backend. O envio de e-mail pode usar Resend. Vídeos usam embeds externos, principalmente YouTube no-cookie. Certificados, badges e portfólios geram links para o LinkedIn no navegador. A geração de QR Code é local.

Mapas, transcrição, geração de imagens, notificações e Data API são pontos ligados às APIs Forge e precisam de substitutos ou remoção controlada fora da Manus. O inventário completo está em `docs/EXTERNAL_HOSTING_MIGRATION.md`.

## Jobs e webhooks

A base contém o helper `server/_core/heartbeat.ts`, mas não foram encontradas chamadas ativas da aplicação para criar jobs. Também não foi identificado um catálogo de webhooks de negócio ativo. Se forem adicionados no futuro, registrar endpoint, método, autenticação, payload, idempotência, retries, logs e comando de execução em `docs/DEPLOY.md`.

## Fluxo de dados típico

No login, o cliente chama o endpoint tRPC correspondente, o backend valida a sessão e carrega o usuário. Ao concluir uma aula, a procedure grava progresso e XP no banco; o frontend invalida ou atualiza o cache e pode liberar quiz, certificado ou badge. Ao favoritar um curso, a procedure grava a relação por usuário e a página de Favoritos consulta a relação junto com o progresso real.

Ao enviar uma evidência, o backend deve validar o usuário e o tipo de arquivo, armazenar os bytes no storage e persistir apenas a referência no banco. A reprodução de podcast usa a referência do episódio, o proxy de áudio e o suporte a Range.

## Fronteira de portabilidade

O código de domínio, UI, testes, schema Drizzle e catálogo são portáveis. Os adaptadores em `server/_core/sdk.ts`, `server/storage.ts`, `server/_core/storageProxy.ts`, `server/_core/dataApi.ts`, `server/_core/voiceTranscription.ts`, `server/_core/imageGeneration.ts`, `server/_core/map.ts`, `server/_core/heartbeat.ts` e `vite.config.ts` contêm conhecimento específico da Manus ou do ambiente gerenciado. Esses arquivos devem ser substituídos ou parametrizados durante a migração, sem apagar os fluxos de negócio.
