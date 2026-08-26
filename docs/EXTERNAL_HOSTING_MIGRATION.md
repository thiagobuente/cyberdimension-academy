# Migração da CyberDimension Academy para hospedagem externa

## Objetivo e status

Este documento registra o resultado da auditoria de portabilidade do projeto `cyberdimension-academy`. O código é um aplicativo fullstack React/TypeScript com servidor Node/Express/tRPC, banco MySQL/TiDB via Drizzle e conteúdo educacional compartilhado entre frontend e backend.

> **Conclusão principal:** o código-fonte pode ser levado para GitHub e para outro provedor, mas não é um pacote totalmente independente da Manus ainda. Os pontos que impedem uma migração imediata sem adaptação são o SDK de autenticação Manus, o Forge para storage e APIs internas, o proxy `/manus-storage/*`, o plugin de runtime do Vite e, opcionalmente, o proxy de mapas.

A migração segura deve ser feita por etapas: primeiro criar a infraestrutura equivalente, depois substituir os adaptadores, migrar dados e arquivos, executar os testes e somente então trocar o domínio.

## Inventário de dependências

| Área | Dependência atual | Evidência no código | Obrigatoriedade fora da Manus | O que migrar |
|---|---|---|---|---|
| Banco de dados | MySQL/TiDB por `DATABASE_URL` | `server/db.ts`, `drizzle/schema.ts`, `drizzle/*.sql` | Obrigatória | Criar uma instância MySQL compatível, aplicar as migrações em ordem e validar índices, enumerações, timestamps e dados de usuários/progresso |
| Sessão | JWT assinado por `JWT_SECRET` | `server/_core/sdk.ts` | Obrigatória | Manter segredo forte no servidor e revisar cookie, domínio, `Secure`, `HttpOnly`, `SameSite`, expiração e rotação |
| Login OAuth | Endpoints Manus em `OAUTH_SERVER_URL` | `server/_core/sdk.ts`, `server/_core/context.ts` | Obrigatória se o login OAuth continuar | Substituir `exchangeCodeForToken`, `getUserInfo` e `getUserInfoWithJwt` por um IdP escolhido, ou remover completamente o caminho OAuth Manus |
| Usuários por e-mail | Fluxos próprios e tabela `user` | `server/emailAuth.ts`, `server/routers.ts`, `drizzle/schema.ts` | Obrigatória | Preservar usuários, hashes e papéis; ajustar o contexto de requisição para autenticar a sessão própria, pois `createContext` ainda chama `sdk.authenticateRequest` |
| Storage | Presign Forge para S3 | `server/storage.ts` | Obrigatória para avatar, portfólio, evidências, áudio e outros uploads | Migrar objetos para S3 compatível, Cloudflare R2, MinIO ou serviço equivalente; substituir presign, URL pública/assinada, ACL, CORS e política de expiração |
| Proxy de arquivos | `/manus-storage/*` e `/podcast-audio/:key` | `server/_core/storageProxy.ts` | Obrigatória enquanto URLs antigas existirem | Criar um adaptador externo com as mesmas garantias de Range, `Content-Range`, `Accept-Ranges`, CORS, cache e autorização, ou atualizar todos os registros para URLs do novo storage |
| Forge backend | `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` | `server/_core/dataApi.ts`, `imageGeneration.ts`, `voiceTranscription.ts`, `map.ts`, `heartbeat.ts`, `storage.ts` | Parcial, mas crítica para recursos que usam Forge | Substituir cada serviço por API própria ou provedor escolhido; não transportar a chave Forge para o ambiente externo |
| IA Tutor | NVIDIA NIM direto + fallback interno | `server/nvidia.ts`, `server/_core/llm.ts`, `server/routers.ts` | Opcional, mas necessária para manter a experiência atual | Configurar a chave NVIDIA no servidor; implementar um fallback externo ou remover o fallback que depende do Forge/LLM interno |
| Transcrição de voz | Forge Voice Transcription | `server/_core/voiceTranscription.ts` | Opcional | Trocar por um provedor de transcrição compatível e manter limites, formato e tratamento de erro |
| Geração de imagens | Forge Image Generation | `server/_core/imageGeneration.ts` | Opcional | Trocar por um provedor de imagem ou manter somente assets estáticos já existentes |
| Mapas | Proxy Forge com chaves `VITE_FRONTEND_FORGE_*` | `client/src/components/Map.tsx`, `server/_core/map.ts` | Opcional, caso a funcionalidade de mapa seja mantida | Usar uma chave de mapa própria e carregar o SDK diretamente ou criar um proxy externo; nunca expor uma chave privilegiada no frontend |
| Notificações | APIs internas do Forge, quando chamadas | `server/_core/notification.ts` e routers | Opcional | Definir e-mail, notificações internas ou push como produto externo; configurar provedor e consentimento |
| E-mail | Resend, se configurado | `server/_core/env.ts`, `server/emailDelivery.ts` | Obrigatória para e-mails transacionais | Criar chave própria, remetente verificado, domínio SPF/DKIM/DMARC e variáveis `RESEND_API_KEY`/`RESEND_FROM_EMAIL` |
| Vídeos | Embeds externos, principalmente YouTube no-cookie | `client/src/pages/FreeVideoCourses.tsx` e catálogos | Opcional, mas depende dos termos do provedor | Revisar URLs, disponibilidade, licença, CSP, privacidade e política de conteúdo |
| LinkedIn | Links de compartilhamento no navegador | helpers de certificado/badge/portfólio | Não exige backend Manus | Validar URLs públicas e configurar domínio final para que os previews funcionem |
| QR Code | Geração local no navegador | `qrcode`, `CertificateDocument` | Não | Nenhuma migração de infraestrutura; atualizar apenas a URL pública de verificação |
| Tarefas agendadas | SDK Heartbeat Manus | `server/_core/heartbeat.ts` | Não há tarefa ativa identificada | O helper é infraestrutura disponível, mas a auditoria não encontrou chamadas da aplicação; recriar jobs apenas se forem adicionados no futuro |
| Runtime Vite | `vite-plugin-manus-runtime` e coletor `__manus__` | `vite.config.ts`, `client/public/__manus__` | Não para hospedagem externa | Executar o Vite externo sem o plugin Manus e sem o coletor de logs do preview |

## Variáveis de ambiente

### Obrigatórias no destino

| Variável | Uso | Tratamento de migração |
|---|---|---|
| `DATABASE_URL` | Conexão MySQL/TiDB | Criar nova URL, aplicar TLS/SSL e limitar acesso à aplicação |
| `JWT_SECRET` | Assinatura da sessão | Gerar um novo segredo aleatório; sessões antigas precisarão ser invalidadas se o segredo mudar |
| `ADMIN_EMAIL` | Identificação administrativa | Reconfigurar no gerenciador de secrets |
| `ADMIN_PASSWORD` | Acesso administrativo separado | Definir uma senha nova e forte; não reutilizar ou colocar no GitHub |
| `APP_BASE_URL` | Links absolutos de recuperação, certificados e compartilhamento | Usar o domínio definitivo com HTTPS |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | E-mail transacional, se habilitado | Criar conta e domínio/remetente próprios |

### Manus-específicas que não devem ser copiadas

`BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID` e qualquer token de integração Manus não devem ser transportados para produção externa como se fossem credenciais próprias. Eles devem ser substituídos por adaptadores e segredos do novo ambiente.

### Opcionais

`NVIDIA_API_KEY`, `NVIDIA_NIM_MODEL` e `NVIDIA_NIM_BASE_URL` podem ser mantidos para o IA Tutor. A chave deve permanecer exclusivamente no backend. `VITE_APP_TITLE`, `VITE_APP_LOGO`, `VITE_ANALYTICS_ENDPOINT` e `VITE_ANALYTICS_WEBSITE_ID` podem ser configurados conforme a nova identidade e ferramenta de analytics.

## Migração do banco de dados

A sequência recomendada é criar uma base vazia no destino, revisar `drizzle/schema.ts`, aplicar todas as migrações SQL de `drizzle/` em ordem numérica e só depois importar os dados. A migração deve preservar `user`, progresso de módulos e laboratórios, quizzes, certificados, favoritos, portfólio, episódios, notas, flashcards e registros administrativos.

Antes da troca, faça um backup lógico e um ensaio em uma base de homologação. Confirme especialmente que todos os campos de data permanecem em UTC, que os identificadores relacionados não mudaram e que as restrições únicas não rejeitam registros existentes.

## Migração de autenticação

A substituição mais importante está em `server/_core/sdk.ts` e `server/_core/context.ts`. Hoje o contexto de cada requisição tenta autenticar pelo SDK Manus antes de disponibilizar `ctx.user`. Hospedagem externa deve implementar um `authProvider` próprio que leia o cookie ou bearer token, valide a assinatura, carregue o usuário da tabela e mantenha a autorização `admin`/`user`.

Há dois caminhos viáveis:

| Caminho | Vantagem | Trabalho de migração |
|---|---|---|
| IdP externo gerenciado, como Auth0, Clerk, Keycloak ou Supabase Auth | OAuth, recuperação e sessões prontos | Mapear usuários, adaptar callback, cookies, webhooks e IDs externos |
| Autenticação própria do projeto | Mantém maior controle e aproveita os fluxos por e-mail existentes | Implementar sessão, recuperação, rate limiting, verificação de e-mail, rotação e proteção contra abuso |

A decisão deve ser tomada antes de migrar usuários. Não é seguro simplesmente trocar a URL OAuth e manter os formatos de token Manus.

## Migração de storage e uploads

`server/storage.ts` solicita URLs pré-assinadas ao Forge e retorna caminhos locais `/manus-storage/{key}`. O destino precisa oferecer uma API própria de presign para upload e download, ou usar o SDK de um storage S3-compatible diretamente no backend. Os metadados já armazenados no banco devem ser convertidos para o novo `bucket/key` ou URL correspondente.

A migração de arquivos deve incluir avatares, anexos do portfólio, evidências de laboratórios, áudios de podcast e qualquer arquivo criado por `storagePut`. Para áudio, a entrega deve suportar requisições Range, pois o player usa seek, buffer e download. Configure CORS apenas para os domínios necessários, `Content-Type` correto, cache de objetos imutáveis e autorização para arquivos privados.

## APIs e integrações

O código utiliza bibliotecas comuns que podem permanecer: React, Node, Express, tRPC, Drizzle, MySQL2, QRCode, Framer Motion, Recharts e dependências Radix. O pacote `@aws-sdk/client-s3` já está disponível para uma implementação externa, mas o código atual ainda usa o presign do Forge; a dependência por si só não realiza a migração.

As integrações de YouTube, LinkedIn e NVIDIA podem continuar fora da Manus com as próprias políticas e chaves. Já Data API, notificações, geração de imagem, transcrição e LLM interno exigem substitutos ou remoção controlada das funcionalidades correspondentes.

## Tarefas agendadas e processos em segundo plano

A presença de `server/_core/heartbeat.ts` não significa que existam jobs ativos. A auditoria não encontrou chamadas da aplicação para criar ou executar tarefas agendadas. Portanto, não há uma fila ou cron Manus para migrar neste momento. Se novos jobs forem adicionados, use o cron do provedor externo ou um worker com idempotência, logs, retry e lock distribuído.

## GitHub e pipeline

O repositório deve conter somente código, migrações, documentação, testes e configurações sem segredos. O arquivo `.env` real, tokens, dumps de produção, logs e artefatos de build devem permanecer fora do Git. Configure os secrets no GitHub Actions ou no gerenciador de secrets do provedor de hospedagem.

O pipeline mínimo deve instalar com `pnpm install --frozen-lockfile`, executar `pnpm run check`, executar `pnpm test` e gerar o build. A publicação deve ocorrer somente depois de configurar banco, storage, domínio, cookies, CORS e variáveis no ambiente de produção.

## Ordem recomendada de execução

1. Criar repositório privado no GitHub e configurar branch protegida.
2. Criar ambientes de desenvolvimento, homologação e produção no provedor externo.
3. Criar banco, storage, e-mail e chaves de APIs próprias.
4. Implementar o adaptador externo de autenticação e ajustar `createContext`.
5. Implementar o adaptador externo de storage e migrar objetos/URLs.
6. Substituir ou desativar Forge, mapas, LLM interno, transcrição, imagens e notificações conforme a decisão de produto.
7. Aplicar migrações e importar dados em homologação.
8. Executar testes, verificar uploads, áudio Range, login, recuperação, admin, certificados, favoritos e progresso.
9. Configurar domínio, TLS, CSP, CORS, cookies e monitoramento.
10. Fazer a troca de DNS somente depois do ensaio completo e manter rollback disponível.

## Limitações desta preparação

Esta preparação documenta e estrutura a migração, mas não escolhe um provedor externo nem substitui automaticamente autenticação, storage e APIs Manus. Esses pontos dependem de decisões de produto, contas, contratos e credenciais que não devem ser inventados ou gravados no repositório. O projeto permanece preservado para continuar funcionando na Manus enquanto os adaptadores externos são implementados.

## Referências internas

- `server/_core/env.ts` — contrato de variáveis de ambiente.
- `server/_core/sdk.ts` — autenticação, OAuth Manus e sessão JWT.
- `server/_core/context.ts` — criação do contexto tRPC.
- `server/storage.ts` — upload e presign via Forge.
- `server/_core/storageProxy.ts` — entrega de arquivos e streaming de áudio.
- `server/_core/heartbeat.ts` — SDK de jobs agendados.
- `vite.config.ts` — plugin de runtime e coletor de logs Manus.
- `client/src/components/Map.tsx` — proxy de mapas e variáveis frontend Forge.
