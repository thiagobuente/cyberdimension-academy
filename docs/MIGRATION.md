# Migração da Manus para outra infraestrutura

## Princípio

A migração deve manter a aplicação atual funcionando até que a instalação externa seja validada. Faça um ensaio em homologação, mantenha backups e use uma janela de troca com rollback. Não apague banco, objetos ou domínios antes de confirmar a nova instalação.

## Código

Clone o repositório público, instale com o lockfile e aplique `MANUS_RUNTIME=false` no build. O código de domínio, páginas, componentes, catálogo, testes, schema e migrações já está versionado. Os adaptadores que conhecem a Manus ficam documentados para substituição: `server/_core/sdk.ts`, `server/_core/context.ts`, `server/storage.ts`, `server/_core/storageProxy.ts`, `server/_core/dataApi.ts`, `server/_core/voiceTranscription.ts`, `server/_core/imageGeneration.ts`, `server/_core/map.ts`, `server/_core/heartbeat.ts` e `vite.config.ts`.

## Banco

Exporte o banco de produção por método seguro e criptografado, sem colocar o dump no GitHub. Crie a base externa, aplique as migrações Drizzle, valide o schema e importe dados preservando relações. Faça uma reconciliação de contagens e amostras para usuários, progresso, quizzes, certificados, favoritos, portfólio, áudio e conteúdo.

Durante a transição, suspenda escritas ou use uma estratégia de dual-write somente se ela for implementada e testada. Não altere IDs sem mapear todas as referências.

## Storage

Liste objetos do storage atual por key, MIME, tamanho e checksum. Migre avatares, evidências, anexos, podcasts, áudios, imagens e materiais legais para um bucket externo. Atualize URLs Manus no banco e troque o proxy por um adaptador S3-compatible. URLs pré-assinadas antigas não devem ser reutilizadas.

O procedimento detalhado está em `STORAGE.md`. Arquivos de terceiros devem ser reavaliados quanto a licença e direito de redistribuição antes de exportar.

## Autenticação

Escolha entre um IdP externo e autenticação própria. Migre o identificador externo, e-mail, nome, papel e estado da conta; não migre tokens OAuth Manus como se fossem tokens do novo provedor. Substitua callback, validação de sessão, recuperação de acesso e `createContext`.

Se o segredo JWT mudar, todas as sessões atuais devem expirar. Configure cookies com domínio correto, HTTPS, `Secure`, `HttpOnly` e `SameSite`. Teste também o papel administrativo e a separação entre aluno e admin.

## APIs

Substitua o Forge por serviços próprios ou provedores externos. A matriz em `EXTERNAL_HOSTING_MIGRATION.md` indica a finalidade, arquivos e variáveis de cada integração. Para NVIDIA e Resend, crie chaves próprias. Para mapas, transcrição e geração de imagens, escolha serviços equivalentes ou desative as funcionalidades com estados claros.

Não publique nem reutilize `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_KEY`, tokens OAuth, chaves administrativas ou qualquer credencial copiada do ambiente Manus.

## Webhooks

A auditoria não identificou endpoints de webhook de negócio ativos. O callback `/api/oauth/callback` é parte da integração OAuth atual, não um webhook genérico; ele deve ser substituído ou removido ao trocar o provedor de autenticação. Ao adicionar integrações externas, documente assinatura, origem, payload e idempotência.

## Jobs

O helper Heartbeat está presente, mas não há chamadas ativas da aplicação identificadas. Não há job para exportar neste momento. Se forem criados no futuro, recrie-os no scheduler externo com timezone definido, lock, retry, timeout, observabilidade e execução idempotente.

## Domínio e DNS

Mantenha o domínio Manus até validar a instalação externa. Configure o novo domínio no provedor, ative HTTPS, atualize `APP_BASE_URL`, revise callback OAuth, URLs de verificação, certificados, portfólio e compartilhamento LinkedIn. Reduza TTL do DNS antes da troca e aumente-o após estabilização.

## Variáveis de ambiente

Crie secrets novos no provedor externo. Use `docs/ENVIRONMENT_VARIABLES.example.txt` como referência segura; a plataforma Manus não permite criar diretamente um arquivo chamado `.env.example` no projeto, portanto renomeie uma cópia do template somente fora da Manus se esse nome for necessário. Nunca use o arquivo de exemplo em produção.

## Critérios de conclusão

A migração só deve ser considerada concluída quando a instalação externa passar por login e logout, recuperação de acesso, autorização admin, CRUD/progresso, quizzes, certificados, favoritos, portfolio, uploads, áudio com Range, embeds, IA Tutor, links públicos, mobile, CI, backup e rollback. Depois disso, desative gradualmente os endpoints Manus e monitore erros e acessos residuais.
