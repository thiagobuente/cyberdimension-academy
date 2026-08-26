# Storage, uploads e arquivos

## Modelo atual

O código separa metadados persistidos no banco dos bytes armazenados externamente. `server/storage.ts` chama o serviço Forge para obter URLs pré-assinadas de upload e download e retorna caminhos `/manus-storage/{key}`. `server/_core/storageProxy.ts` atende esses caminhos e também expõe `/podcast-audio/:key` para reprodução com Range.

## Categorias de arquivos

| Categoria | Origem | Referência esperada | Requer migração |
|---|---|---|---|
| Avatares | Atualização de perfil | URL/key no perfil do usuário | Sim, se houver arquivos enviados |
| Evidências de laboratório | Portfólio do aluno | URL/key associada à evidência | Sim |
| Anexos de projeto | Portfólio e formação PMSEC | URL/key em metadados do projeto | Sim |
| Áudios de podcast | Catálogos CyberCast/Audio Lab | `audioUrl` e key do objeto | Sim |
| Imagens e assets | Interface e catálogos | URL estática ou key | Revisar individualmente |
| Certificados e QR | Certificado gerado pelo cliente | URL pública e dados do certificado | QR é regenerado; arquivos devem ser avaliados |
| PDFs e materiais | Conteúdo educacional | Referências em catálogo/aula | Revisar licença antes de versionar |

## O que entra no Git

Arquivos pequenos, autorais, livres de dados pessoais e com licença compatível podem ser versionados. Código, conteúdo textual, schemas, migrações, testes, configurações sem valores e documentação devem ficar no Git. Arquivos grandes, uploads de alunos, áudio gerado, documentos licenciados de terceiros e dados pessoais não devem ser colocados no repositório público sem autorização expressa.

## O que não entra no Git

Não publique `.env`, tokens, chaves, dumps de produção, fotos de alunos, evidências privadas, certificados contendo dados pessoais, áudio privado, `node_modules`, `dist`, logs ou arquivos internos do ambiente Manus. A cópia pública preparada remove os scripts administrativos que continham credenciais e o arquivo de configuração interno do projeto.

## Exportação do storage Manus

A exportação precisa ser executada com acesso administrativo ao storage original, fora do código público. Para cada objeto, registre pelo menos `key`, tamanho, MIME type, checksum, data, visibilidade e referência de banco. Baixe os objetos para uma área temporária protegida, valide checksums e envie-os para o novo bucket mantendo a estrutura de keys sempre que possível.

Não copie URLs pré-assinadas antigas para o banco: elas expiram. Conserve apenas a key lógica e gere URLs novas no destino. Se o banco atual tiver `/manus-storage/` em campos de URL, converta esses valores para `storage://bucket/key` ou para o formato interno do novo adaptador.

## Configuração externa recomendada

Use um bucket S3-compatible privado, uma chave de serviço somente no backend, presign de PUT/GET, CORS limitado ao domínio da aplicação e políticas de lifecycle. Para arquivos públicos de catálogo, use CDN ou URL pública somente quando a licença permitir. Para evidências e dados de alunos, prefira URLs assinadas de curta duração e autorização por usuário/admin.

O adaptador externo deve substituir `storagePut`, `storageGet`, `storageGetSignedUrl` e as rotas do proxy. Para podcasts, preserve suporte a `GET`, `HEAD`, `OPTIONS`, `Range`, `Accept-Ranges`, `Content-Range`, `Content-Length`, `Content-Type` e download. Teste reprodução, seek, buffer e download em desktop e mobile.

## Restauração

Para restaurar em outro ambiente, crie o bucket, aplique CORS e políticas, carregue os objetos pela lista de inventário, atualize as referências no banco em transação e execute uma verificação de links. O processo deve ser idempotente: repetir a cópia não pode duplicar registros nem corromper objetos.

## Retenção e privacidade

Defina prazo de retenção para uploads de alunos, fluxo de exclusão, auditoria de acesso e responsável pelo atendimento de solicitações de privacidade. O repositório público deve conter somente documentação do procedimento, nunca os arquivos reais nem identificadores que permitam acesso sem autorização.
