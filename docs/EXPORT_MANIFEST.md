# Manifesto do repositório exportável

Este repositório contém o código-fonte da CyberDimension Academy e a documentação necessária para sua revisão e migração. O conteúdo inclui `client/`, `server/`, `shared/`, `drizzle/`, `scripts/`, testes, migrações, configurações, catálogo, documentação editorial e workflow de CI.

O repositório não deve conter `.env`, tokens, chaves de API, credenciais de administrador, dumps de produção, logs, `node_modules/`, `dist/`, caches ou metadados internos do ambiente Manus. O arquivo `CONFIGURATION_TEMPLATE.txt` é apenas uma referência de nomes; ele não substitui o gerenciador de secrets.

A preparação externa inclui o parâmetro `MANUS_RUNTIME=false` no Vite para não ativar plugins de runtime/preview Manus durante o build externo. Isso não elimina os acoplamentos de autenticação, storage e APIs. A lista completa de substituições está em `docs/EXTERNAL_HOSTING_MIGRATION.md`.

O CI foi configurado em `.github/workflows/ci.yml` para instalar com lockfile, verificar tipos, executar testes e tentar o build. A publicação real deve ser adicionada somente depois de escolher o provedor, configurar os secrets e concluir a migração de banco, autenticação e storage.
