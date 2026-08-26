# Publicação no GitHub e configuração de produção

## Antes do primeiro push

Crie um repositório privado no GitHub e revise o conteúdo local. Não envie `.env`, logs, `dist/`, `node_modules/`, dumps de produção, tokens, chaves de API ou arquivos administrativos sensíveis. O `.gitignore` do projeto já cobre os principais artefatos, mas a revisão manual continua obrigatória.

```bash
git init
git add .
git status
# confirme que nenhum segredo ou arquivo .env aparece na lista
git commit -m "chore: prepare CyberDimension Academy for external hosting"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Se o projeto já possuir histórico Git, não execute `git init` novamente. Apenas revise o diff, crie um commit separado para a preparação de portabilidade e envie a branch.

## Secrets no GitHub

Configure os valores no provedor de hospedagem ou em **Settings → Secrets and variables → Actions**. Os nomes esperados podem ser consultados em `server/_core/env.ts` e em `CONFIGURATION_TEMPLATE.txt` quando este arquivo estiver incluído na exportação.

As variáveis mínimas para uma implantação externa são `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `APP_BASE_URL`. Para e-mail transacional, configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL`. Para o IA Tutor baseado em NVIDIA, configure `NVIDIA_API_KEY`, `NVIDIA_NIM_MODEL` e, se necessário, `NVIDIA_NIM_BASE_URL`.

Não copie variáveis `BUILT_IN_FORGE_*`, `VITE_FRONTEND_FORGE_*`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` ou `VITE_APP_ID` da Manus para produção externa sem antes implementar os adaptadores equivalentes descritos em `EXTERNAL_HOSTING_MIGRATION.md`.

## Pipeline incluído

O workflow `.github/workflows/ci.yml` instala dependências com lockfile, verifica o TypeScript, executa a suíte sem o teste que depende de NVIDIA externo e tenta gerar o build. O workflow não contém secrets de produção. Para um pipeline de deploy, adicione uma segunda etapa somente depois de escolher o provedor, o método de migração do banco e a política de rollback.

## Proteção recomendada

Ative revisão obrigatória de pull request, branch `main` protegida, secret scanning, dependabot, autenticação multifator e permissões mínimas para Actions. Use ambientes separados para homologação e produção, com secrets diferentes.

## Checklist pós-push

Confirme que o CI termina sem erros, que o banco de homologação recebeu as migrações, que o login externo funciona, que upload/download e áudio com Range funcionam, que cookies usam HTTPS, que CORS e CSP permitem somente os domínios necessários e que os links de certificados, portfólio e LinkedIn usam o domínio definitivo.
