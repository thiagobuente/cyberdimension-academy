# Deploy fora da Manus

## Pré-requisitos

Use Node.js 22 ou compatível com o projeto, pnpm 10, um banco MySQL compatível, um storage S3-compatible, um domínio com DNS gerenciável e um gerenciador de secrets. O provedor pode ser um serviço Node gerenciado, uma VM ou uma plataforma de containers. O processo deve executar o backend e servir o build do frontend pelo mesmo processo, como definido em `package.json`.

## Preparação do servidor

Crie um ambiente separado para homologação e produção. Instale Node.js e pnpm, clone o repositório, configure um usuário sem privilégios de root para a aplicação e defina logs, reinício automático, backup e monitoramento. Não coloque secrets no repositório nem em arquivos públicos.

```bash
git clone https://github.com/thiagobuente/cyberdimension-academy.git
cd cyberdimension-academy
pnpm install --frozen-lockfile
cp docs/ENVIRONMENT_VARIABLES.example.txt .env
# edite .env somente localmente ou use o gerenciador de secrets do provedor
```

## Banco e migrações

Crie um banco MySQL/TiDB vazio, configure `DATABASE_URL` com TLS e execute as migrações em uma janela controlada. O comando existente é `pnpm db:push`; ele gera e aplica migrações pelo Drizzle. Em produção, revise o SQL gerado e prefira executar migrações como etapa explícita de release. Faça backup antes e valide usuários, progresso, certificados, favoritos, portfólio, quizzes e episódios.

```bash
pnpm db:push
```

Seeds ou scripts de carga somente devem ser executados quando existirem e após revisão. Não execute seed com dados reais de alunos em uma instalação pública.

## Storage

Configure bucket, região, CORS, presign, lifecycle e chave de serviço no backend. Antes de subir a aplicação, implemente o adaptador que substitui o Forge descrito em `STORAGE.md`. Migre os objetos e converta referências `/manus-storage/` para keys do novo bucket.

## Variáveis

Configure `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `APP_BASE_URL`. Adicione Resend e NVIDIA somente quando os serviços estiverem contratados e testados. Não configure variáveis Manus em uma instalação externa sem implementar os substitutos correspondentes.

## Build e inicialização

O build atual é:

```bash
MANUS_RUNTIME=false pnpm run build
NODE_ENV=production APP_BASE_URL=https://SEU-DOMINIO.example node dist/index.js
```

A porta deve ser fornecida pelo ambiente de hospedagem; o processo não deve depender de uma porta fixa. O comando `start` existente inicia `dist/index.js`. O build externo foi preparado para não ativar os plugins de runtime/preview Manus, mas os adaptadores de autenticação, storage e Forge ainda precisam ser substituídos antes da produção externa.

## Domínio, HTTPS e segurança

Aponte o DNS para o provedor escolhido, ative TLS gerenciado, defina `APP_BASE_URL` com HTTPS e revise `Secure`, `HttpOnly`, `SameSite`, CORS, CSP e limites de upload. Restrinja o painel admin por autenticação, não exponha credenciais em URLs e mantenha backups criptografados.

## Webhooks e jobs

A auditoria não identificou webhooks de negócio ativos nem jobs da aplicação que chamem o Heartbeat. Se um provedor futuro exigir webhook, documente origem, URL, método, assinatura, payload, idempotência e resposta antes de habilitá-lo. Para jobs, registre frequência, comando, timeout, retries e lock; execute via cron/worker do provedor externo.

## Validação pós-deploy

Execute `pnpm run check` e `pnpm test -- --exclude server/nvidia.health.test.ts --pool=forks --poolOptions.forks.singleFork=true`. Teste cadastro/login, recuperação de acesso, permissões admin, leitura, progresso, quiz, certificado, favoritos, portfólio, upload, download, áudio com seek/Range, embeds, IA Tutor, links LinkedIn, versão mobile e restauração de sessão.

## Troubleshooting

Se houver erro `Unexpected token '<'`, verifique se o proxy/API está encaminhando `/api/trpc` para o backend e não para o fallback HTML. Se o áudio não iniciar, valide MIME, CORS, redirects, Range e `Content-Range`. Se a sessão falhar, confirme `JWT_SECRET`, domínio do cookie, HTTPS, relógio do servidor e o adaptador de autenticação. Se uploads falharem, valide presign, bucket, CORS, tamanho e autorização.
