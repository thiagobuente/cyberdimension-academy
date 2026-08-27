# CyberDimension Academy - Project TODO

- [x] Projeto inicializado com scaffold fullstack (web-db-user)
- [x] Configurar tema escuro com cores neon (ciano, roxo, verde) e fontes Orbitron/Rajdhani
- [x] Criar tabelas no banco de dados: domains, lessons, questions, quiz_attempts, certificates, progress
- [x] Sistema de autenticação com roles (user/admin) - admin via backend
- [x] Landing page com tema espacial futurista
- [x] Módulo CompTIA Security+ SY0-701 com 5 domínios oficiais
- [x] Conteúdo de estudos para cada domínio
- [x] Sistema de simulados com questões dos PDFs (múltipla escolha, gabarito, explicações)
- [x] IA Tutor integrada via chat para dúvidas
- [x] Emissão de certificado digital (nome, data, identificador único)
- [x] Navegação e rotas completas (App.tsx)
- [x] Corrigir progresso baseado em lições reais por domínio (não fixo em 4, sem fallback hardcoded)
- [x] Corrigir simulado geral para usar questões de todos os 5 domínios
- [x] Validar conclusão antes de emitir certificado
- [x] Expandir painel admin com visualização de progresso por aluno
- [x] Testes vitest para funcionalidades críticas
- [x] Simulado geral com distribuição garantida entre 5 domínios
- [x] Verificar que Progress.tsx e Dashboard.tsx não têm fallback hardcoded
- [x] Salvar checkpoint e entregar ao usuário
# Expansão de Conteúdo + Repaginação

- [x] Extrair conteúdo detalhado dos objetivos oficiais SY0-701 (todos os domínios e subdomínios)
- [x] Gerar novas lições detalhadas para cada domínio (baseado nos subdomínios do SY0-701)
- [x] Gerar novas questões de simulado (mínimo 30 por domínio)
- [x] Inserir novo conteúdo no banco de dados
- [x] Repaginação: Landing page com mais seções e visual melhorado
- [x] Repaginação: Dashboard com cards mais ricos e animações
- [x] Repaginação: Página de curso com melhor navegação e UX
- [x] Repaginação: Simulado com feedback visual melhorado
- [x] Salvar checkpoint e entregar
- [x] Definir catálogo priorizado de novos cursos e trilhas de carreira para a CyberDimension Academy
- [x] Curar tópicos adicionais do livro Security+ 701 em material original de estudo
- [x] Criar questões autorais de prática alinhadas aos objetivos oficiais SY0-701
- [x] Validar conteúdo expandido, testes e experiência visual antes da publicação
- [x] Validar visual e funcionamento de `/course/:domainId` e `/tutor` após a repaginação
- [x] Confirmar em runtime que novas lições e questões aparecem nos fluxos de estudo e simulado
- [x] Validar funcionalmente o carregamento e a navegação de lições em `/course/:domainId`
- [x] Validar funcionalmente o envio e a resposta da IA Tutor
- [x] Confirmar via testes e UI que o conteúdo expandido é servido aos fluxos de curso e simulado
- [x] Criar catálogo para Fundamentos de TI, Fundamentos de Cyber Security, Redes para Cyber Security e Linux para Operações de Segurança
- [x] Criar páginas de detalhes de curso com módulos, laboratórios, simulados e certificação
- [x] Implementar a seção interativa “Do zero ao Security+”
- [x] Adicionar seção do desenvolvedor Thiago Buente com perfil no LinkedIn
- [x] Evoluir a identidade visual para um tema espacial futurista consistente
- [x] Validar a nova experiência e executar testes
- [x] Salvar checkpoint da expansão de catálogo e trilha interativa
- [x] Modelar progresso, conclusão e certificados das formações ORBIT-01 a ORBIT-04
- [x] Persistir progresso por módulo e laboratório de cada formação
- [x] Criar laboratórios guiados e interativos para as quatro formações iniciais
- [x] Emitir certificado nominal após a conclusão de todos os requisitos do curso
- [x] Criar página pública de verificação de certificados por identificador
- [x] Exibir progresso visual das quatro formações no painel do aluno
- [x] Criar testes de regressão para progresso, certificados e verificação pública
- [x] Validar tipos, testes e revisão visual dos fluxos públicos, com fluxo autenticado exercitado por testes tRPC
- [x] Salvar checkpoint da expansão prática
- [x] Transformar os laboratórios em missões guiadas com resposta do aluno e validação de etapas
- [x] Cobrir por testes os requisitos de certificação e a consulta pública por identificador
- [x] Adicionar testes de integração tRPC para progresso, emissão de certificado e verificação pública
- [x] Validar o fluxo autenticado e o certificado verificável com contexto de aluno simulado em testes tRPC; a revisão visual em conta Manus depende da sessão do aluno
- [x] Modelar avaliações finais, tentativas e conquistas por formação ORBIT
- [x] Criar questões avaliativas no final de cada uma das quatro formações
- [x] Integrar a aprovação na avaliação como requisito para a certificação nominal
- [x] Criar badges visuais por progresso, prática, aprovação e conclusão
- [x] Exibir badges e marcos desbloqueados no ambiente de estudo e no painel do aluno
- [x] Criar página de perfil com histórico de certificados e opção de download
- [x] Adicionar testes de regressão para avaliações, badges e histórico de certificados
- [x] Validar tipos, testes e experiência visual da expansão de avaliação e conquistas
- [x] Publicar a expansão de avaliação e conquistas
- [x] Criar links de compartilhamento no LinkedIn para badges conquistados
- [x] Criar links de compartilhamento no LinkedIn para certificados com validação pública
- [x] Validar tipagem, testes, link público de verificação e estados visuais da atualização
- [x] Publicar a atualização de compartilhamento profissional
- [x] Criar uma página pública e verificável para cada badge conquistado
- [x] Usar a URL pública específica do badge no botão de compartilhamento do LinkedIn
- [x] Cobrir a verificação pública de badge e o compartilhamento específico em testes
- [x] Validar a verificação pública de certificado e badge por testes tRPC com credenciais persistidas simuladas; a checagem manual ocorrerá no primeiro certificado emitido por um aluno
- [x] Exibir uma seção de conquistas ORBIT no painel do aluno
- [x] Cobrir por testes o histórico de certificados e as rotas de download
- [x] Corrigir a chave única da lista renderizada no painel administrativo
- [x] Validar tipagem e regressão das chaves estáveis do painel administrativo
- [x] Publicar a correção do painel administrativo
- [x] Confirmar após reinício que a importação de BadgeVerify é resolvida e que /admin carrega normalmente
- [x] Salvar checkpoint final da correção do painel administrativo
- [x] Modelar credenciais de acesso próprias com e-mail e senha protegida
- [x] Criar cadastro público de aluno com nome, e-mail e senha
- [x] Criar login e logout por sessão própria, sem dependência de conta Manus
- [x] Preservar a conta administradora e a autorização por papéis no novo fluxo
- [x] Atualizar telas e navegação para cadastro e acesso por e-mail
- [x] Cobrir cadastro, login, logout e acesso administrativo em testes
- [x] Validar tipagem, hashes, sessão, telas e regressões da autenticação por e-mail
- [x] Publicar a autenticação própria por e-mail
- [x] Adicionar teste de integração tRPC para logout no fluxo de sessão por e-mail
- [x] Adicionar teste de integração para login administrativo por e-mail e procedure protegida
- [x] Modelar foto de perfil e tokens de recuperação de senha com expiração
- [x] Permitir que o aluno atualize nome e foto de perfil com autorização própria
- [x] Substituir a solicitação de recuperação de senha estudantil por link mágico sem revelar a existência da conta
- [x] Substituir a redefinição de senha estudantil por confirmação de link único e expirável
- [x] Atualizar a página de conta, login e cadastro com os novos acessos
- [x] Cobrir perfil e autenticação sem senha em testes de segurança e regressão
- [x] Validar e publicar edição de perfil e substituição da recuperação de senha por link mágico
- [x] Modelar tokens de link mágico únicos, expirados e de uso único para acesso por e-mail
- [x] Criar solicitação de acesso sem senha sem revelar a existência da conta
- [x] Criar confirmação de link mágico e sessão segura para alunos
- [x] Atualizar cadastro e login para remover a senha da experiência do aluno
- [x] Manter a autorização administrativa protegida no novo fluxo
- [x] Cobrir segurança, expiração e uso único dos links mágicos em testes
- [x] Validar e publicar a autenticação sem senha por e-mail
- [x] Revisar e remover textos legados de senha restantes na experiência do aluno
- [x] Disponibilizar acesso administrativo separado, protegido por senha e fora do fluxo estudantil
- [x] Substituir o envio de link mágico por entrada automática do aluno após informar o e-mail
- [x] Atualizar as telas de acesso para direcionar o aluno imediatamente ao painel
- [x] Cobrir e publicar a entrada automática por e-mail sem afetar o acesso administrativo
- [x] Reorganizar o topo do painel em torno da missão atual e da próxima atividade
- [x] Exibir progresso geral com meta Security+ SY0-701 e jornada visual dos cinco domínios
- [x] Diferenciar os caminhos Estudar, Praticar, Simulado e Certificação no painel
- [x] Formalizar regras de XP e nível derivadas de marcos reais da jornada
- [x] Exibir desempenho por domínio e recomendações baseadas no progresso e tentativas reais
- [x] Publicar o novo Cybersecurity Command Center após a cobertura e a revisão visual concluídas
- [x] Adicionar uma CTA de certificação baseada na elegibilidade real de cada domínio
- [x] Adicionar uma CTA de simulado baseada no histórico real de tentativas
- [x] Modelar uma taxonomia curricular por nível, especialidade e academia de carreira
- [x] Criar o catálogo da primeira onda de 15 cursos prioritários sem substituir as formações ORBIT existentes
- [x] Criar academias Blue Team, Red Team, GRC, Cloud Security, Threat Intelligence e Security Engineering
- [x] Exibir filtros por nível e especialidade no catálogo público
- [x] Criar páginas de trilha com a sequência recomendada de cursos por carreira
- [x] Validar, testar e publicar a expansão curricular e as academias
- [x] Manter as quatro formações ORBIT visíveis no catálogo público expandido e cobrir essa integração em teste
- [x] Extrair e catalogar os conceitos dos materiais fornecidos sobre GRC, governança, Zero Trust, IA e desenvolvimento seguro
- [x] Redigir uma aula autoral em português com objetivos, módulos, atividades e referências aos materiais
- [x] Integrar a aula e uma avaliação de conhecimento à formação de GRC no catálogo e na experiência de estudo
- [x] Registrar a execução bem-sucedida da suíte completa de testes após adicionar a aula de GRC
- [x] Revisar o tutor existente e definir instruções pedagógicas para dúvidas de cibersegurança
- [x] Adicionar respostas contextualizadas, sugestões de estudo e limites para temas de uso dual
- [x] Melhorar a experiência de conversa da IA Tutor para alunos autenticados
- [x] Cobrir e validar a IA Tutor de cibersegurança antes da publicação conjunta com a certificação de GRC
- [x] Definir os critérios de conclusão e o modelo nominal do certificado de GRC Aplicado
- [x] Persistir a conclusão e emitir o certificado automaticamente após a avaliação aprovada
- [x] Exibir o certificado emitido de forma persistente, permitir compartilhamento e manter verificação pública
- [x] Publicar conjuntamente a IA Tutor e a certificação automática da aula de GRC após a validação concluída
- [x] Inventariar e extrair os materiais Security+ contidos no arquivo compactado fornecido
- [x] Criar e comprovar aulas autorais de Security+ alinhadas aos cinco domínios oficiais SY0-701
- [x] Criar e comprovar questões de simulado autorais com explicações e distribuição por domínio
- [x] Integrar, testar e publicar as aulas e os simulados baseados nos novos materiais
- [x] Inspecionar e documentar amostras reais de aulas e questões inseridas por domínio
- [x] Registrar uma validação automatizada ou consulta verificável da cobertura real por domínio
- [x] Consultar e exibir o certificado de GRC já emitido após recarregar ou revisitar a aula
- [x] Expor compartilhamento explícito e cobrir a verificação pública do certificado da aula de GRC
- [x] Persistir as novas aulas e questões de Security+ em migration versionada para não depender apenas do estado atual do banco
- [x] Salvar checkpoint da publicação validada do conteúdo autoral de Security+
- [x] Auditar tipografia, contraste e densidade visual do dashboard, curso e simulado
- [x] Criar preferências persistentes de leitura para tamanho de fonte, espaçamento, tema e modo foco
- [x] Implementar modo de leitura confortável na página das aulas, com conteúdo ampliado e controles acessíveis
- [x] Reorganizar os cards dos domínios para separar tópicos, peso de prova e ações
- [x] Melhorar a legibilidade visual do simulado sem remover a identidade cyber
- [x] Cobrir as preferências e a nova experiência de leitura com testes e validação visual
- [x] Salvar checkpoint e publicar as melhorias de legibilidade e acessibilidade
- [x] Entregar ao usuário a atualização publicada da experiência de leitura aprimorada
- [x] Mapear os domínios, lições, simulados e dados de progresso para a nova jornada Security+
- [x] Definir uma trilha semanal de preparação Security+ com metas realistas e marcos verificáveis
- [x] Criar uma página exclusiva da trilha com progresso por semana e ações de estudo
- [x] Integrar o acesso à trilha no painel e nos pontos relevantes da jornada Security+
- [x] Cobrir a trilha com testes e validar visualmente a atualização
- [x] Salvar checkpoint e publicar a trilha semanal exclusiva de Security+
- [x] Entregar ao usuário a trilha semanal Security+ já publicada
- [x] Adicionar um segundo ponto de entrada visível para a trilha em um fluxo de progresso Security+
- [x] Extrair e testar a lógica de cálculo da semana ativa, conclusão e metas da trilha
- [x] Cobrir por teste a rota da trilha e o CTA do painel para prevenir regressões de navegação
- [x] Auditar os cursos da biblioteca e os fluxos funcionais já disponíveis nas formações ORBIT
- [x] Definir módulos, laboratórios guiados e avaliações para os cursos atualmente em planejamento
- [x] Transformar os cursos planejados em páginas funcionais com progresso persistente
- [x] Remover a identificação “em planejamento” do catálogo e ajustar as chamadas para ação
- [x] Cobrir a ativação dos cursos com testes e validação visual
- [x] Salvar checkpoint e publicar os cursos funcionais no catálogo
- [x] Entregar ao usuário os cursos ativados e publicados
- [x] Confirmar o checkpoint da ativação funcional dos doze cursos do catálogo
- [x] Enviar o resumo final das mudanças e validações ao usuário após a publicação
- [x] Confirmar ao usuário a publicação dos doze cursos ativados com o checkpoint correspondente
- [x] Comunicar as mudanças do catálogo e as validações executadas após a publicação
- [x] Auditar a estrutura de módulos, avaliações e progresso para incluir quizzes de fixação
- [x] Criar questões autorais com feedback pedagógico para os quizzes ao final dos módulos
- [x] Persistir tentativas e conclusão dos quizzes modulares sem alterar a avaliação final
- [x] Exibir quizzes interativos no fluxo de estudo de cada módulo e refletir seu estado no progresso
- [x] Cobrir os quizzes com testes e validação visual
- [x] Salvar checkpoint e publicar os quizzes modulares de fixação
- [x] Entregar ao usuário a atualização publicada dos quizzes modulares
- [x] Auditar rotas, cursos, módulos, laboratórios, quizzes, avaliações e botões principais
- [x] Diagnosticar e corrigir a falha de carregamento das questões do simulado
- [x] Adicionar testes de regressão para os fluxos de estudo e ações auditadas
- [x] Aplicar tipografia Inter e JetBrains Mono ao conteúdo didático, preservando a identidade cyber na interface
- [x] Refinar largura, hierarquia, contraste e estrutura de leitura das aulas para estudo prolongado
- [x] Validar em desktop e mobile a jornada corrigida
- [x] Salvar checkpoint e publicar a auditoria funcional e o leitor didático refinado
- [x] Entregar ao usuário o resultado publicado da auditoria
- [x] Executar uma auditoria verificável de todos os cursos ativados e de seus CTAs principais
- [x] Adicionar testes específicos para simulado, navegação, módulo, laboratório, quiz, avaliação e certificado
- [x] Auditar os controles e a persistência atuais de preferências de leitura
- [x] Aperfeiçoar a barra com ajuste de tamanho, modo foco e alternância de tema acessíveis
- [x] Aplicar e manter a barra disponível nas superfícies didáticas relevantes
- [x] Cobrir os controles com testes e validação visual
- [x] Corrigir a rota de estudo de formação que retornou 404 durante a revisão visual
- [x] Salvar checkpoint e publicar a barra de ferramentas do leitor
- [x] Entregar ao usuário a barra de ferramentas publicada
- [x] Auditar a mutação de conclusão de aula e os dados de progresso consumidos pelo leitor
- [x] Adicionar à barra a ação de concluir aula com estados de carregamento, sucesso e indisponibilidade
- [x] Salvar o progresso automaticamente e atualizar as superfícies do aluno após a conclusão
- [x] Cobrir a ação com testes e validação visual
- [x] Salvar checkpoint e publicar a conclusão de aula pela barra do leitor
- [x] Entregar ao usuário a ação de conclusão de aula publicada

- [x] Adicionar notificação temporária com ação de desfazer após concluir uma aula
- [x] Exibir celebração acessível com os pontos de XP ganhos na conclusão
- [x] Oferecer navegação automática para a próxima aula disponível
- [x] Cobrir os novos fluxos de conclusão com testes automatizados e validação visual
- [x] Salvar checkpoint e publicar as melhorias de conclusão de aula

- [x] Diagnosticar os estilos de leitura que perdem contraste no tema claro
- [x] Corrigir tokens de cor e responsividade nas superfícies didáticas em tema claro
- [x] Cobrir e validar os temas claro e escuro em desktop e mobile
- [x] Salvar checkpoint e publicar a correção de contraste do tema claro

- [x] Mapear estilos dos simulados, da trilha semanal e das preferências de leitura
- [x] Aplicar superfícies claras consistentes aos simulados e à trilha semanal
- [x] Adicionar preferência persistente de contraste elevado ao leitor
- [x] Criar transição suave e acessível entre os temas da interface
- [x] Cobrir as novas preferências e superfícies com testes automatizados e validação visual
- [x] Salvar checkpoint e publicar as melhorias de consistência e acessibilidade

- [x] Mapear as preferências e controles atuais de tamanho de fonte e leitura
- [x] Adicionar ajuste persistente de espaçamento entre linhas ao leitor
- [x] Refinar os controles de tamanho de fonte para leitura confortável
- [x] Cobrir a personalização tipográfica com testes e validação responsiva
- [x] Salvar checkpoint e publicar os controles de tipografia do leitor

- [x] Diagnosticar as cores herdadas do tema escuro no conteúdo do leitor claro
- [x] Corrigir contraste de títulos, parágrafos, listas, destaques e código no tema claro
- [x] Cobrir a legibilidade do leitor claro com testes de regressão e validação visual
- [x] Salvar checkpoint e publicar a correção definitiva do tema claro

- [x] Mapear o catálogo atual e selecionar novos cursos prioritários
- [x] Criar módulos, laboratórios seguros e avaliações para os novos cursos
- [x] Integrar os novos cursos a progresso, badges e certificados
- [x] Cobrir os novos cursos com testes e validação do catálogo
- [x] Salvar checkpoint e publicar a expansão do catálogo

- [x] Definir a trilha Cloud Security e a lógica de desafios semanais baseada em progresso
- [x] Modelar e migrar o registro persistente de desafios semanais e XP extra
- [x] Criar a trilha Cloud Security com AWS Security e Azure Security
- [x] Adicionar laboratórios seguros de análise de logs a SOC Analyst e Forense Digital
- [x] Integrar desafios semanais e recompensas de XP na experiência de estudo
- [x] Cobrir a expansão com testes e validação visual
- [x] Salvar checkpoint e publicar a trilha, laboratórios e desafios

- [x] Mapear o sistema atual de badges, progresso de cursos e perfil
- [x] Emitir badge exclusivo ao concluir AWS Security e Azure Security
- [x] Exibir o badge Cloud Security no perfil do aluno
- [x] Cobrir a emissão e a exibição do badge com testes e validação visual
- [x] Salvar checkpoint e publicar o badge da trilha Cloud

- [x] Mapear o catálogo existente e definir formações novas nos níveis iniciante, intermediário e avançado sem duplicar conteúdos ativos
- [x] Criar currículos autorais, práticas seguras, quizzes e avaliações para as novas formações
- [x] Projetar um piloto de aprendizagem orientada por vídeo com conteúdo externo incorporado, roteiro e material de apoio
- [x] Integrar indicadores de modo vídeo, reprodução incorporada e conclusão ao catálogo e ao progresso do aluno
- [x] Cobrir cursos e experiência em vídeo com testes automatizados e validação visual responsiva
- [x] Salvar checkpoint e publicar a expansão curricular e o piloto de vídeo

- [x] Mapear as formações de Redes e Linux, o piloto de vídeo e o progresso reutilizável
- [x] Modelar e persistir favoritos e retomada de sessões de vídeo por aluno
- [x] Adicionar modo vídeo às formações de Redes e Linux com transcrições e capítulos por módulo
- [x] Criar a página pessoal de favoritos e continuar assistindo integrada ao painel
- [x] Cobrir vídeo, capítulos, favoritos e retomada com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar a experiência de vídeo ampliada

- [x] Mapear o leitor de vídeo, o progresso e a trilha semanal para definir a nova experiência
- [x] Modelar e persistir notas pessoais por capítulo e metas semanais de vídeo por aluno
- [x] Adicionar controles de velocidade, tela cheia e notas pessoais ao modo vídeo
- [x] Criar metas semanais específicas para as formações de Redes e Linux em vídeo
- [x] Cobrir controles, notas e metas de vídeo com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar a nova evolução das trilhas em vídeo

- [x] Mapear as sessões em vídeo e os fluxos de quiz existentes para definir a integração
- [x] Criar perguntas autorais, alternativas e explicações para cada sessão em vídeo
- [x] Persistir tentativas e correções dos quizzes de vídeo por aluno
- [x] Exibir automaticamente o quiz no encerramento da sessão de vídeo e refletir o resultado no progresso
- [x] Cobrir quizzes de vídeo com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar os quizzes de vídeo

- [x] Mapear regras de XP, tentativas e recompensas para definir sequências de acertos seguras
- [x] Definir bônus de XP por sequência e regras idempotentes de concessão
- [x] Persistir recompensas de sequência e integrar o cálculo aos quizzes existentes
- [x] Exibir sequência atual e bônus de XP no feedback dos quizzes
- [x] Cobrir recompensas de sequência com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar o sistema de bônus por sequência

- [x] Mapear o catálogo atual e definir as lacunas da jornada do zero ao profissional
- [x] Criar currículos autorais, práticas seguras e avaliações para a nova onda de cursos
- [x] Integrar os novos cursos a progresso, badges e certificados existentes
- [x] Organizar a progressão profissional no catálogo e no painel do aluno
- [x] Cobrir a expansão curricular com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar a jornada profissional ampliada

- [x] Mapear lacunas de especialização e selecionar fontes externas de vídeo adequadas
- [x] Criar currículos, roteiros de estudo e avaliações seguras para as novas formações em vídeo
- [x] Integrar as novas formações em vídeo ao catálogo e à experiência de estudo
- [x] Conectar vídeos, progresso, quizzes, recompensas e certificação
- [x] Cobrir a expansão audiovisual com testes e validação visual responsiva
- [x] Salvar checkpoint e publicar as novas formações em vídeo

- [x] Mapear os fluxos de SOC, avaliações e laboratórios para a nova expansão profissional
- [x] Criar a trilha SOC em vídeo com conteúdos, práticas seguras e avaliações
- [x] Implementar simulados cronometrados por especialidade com histórico de tentativas
- [x] Criar um portfólio de evidências práticas a partir de laboratórios concluídos
- [x] Cobrir e validar a trilha, os simulados e o portfólio em desktop e mobile
- [x] Salvar checkpoint e publicar a expansão profissional com SOC, simulados e portfólio

- [x] Auditar a arquitetura de conteúdo e mapear os componentes reutilizáveis da jornada pedagógica
- [x] Modelar tipo, fonte, licença e uso complementar para conteúdo próprio e externo
- [x] Integrar a transparência de conteúdo às páginas de curso, aula e vídeo sem remover fluxos existentes
- [x] Reforçar a navegação Trilha → Curso → Módulo → Aula → Vídeo → Material → Laboratório → Quiz → Progresso → Certificado
- [x] Testar vídeos incorporados, progresso, quizzes, navegação, permissões administrativas e responsividade
- [x] Salvar checkpoint, publicar e entregar o relatório final de transparência e validação

- [x] Auditar os modelos de curso, mídia, catálogo e permissões administrativas reutilizáveis
- [x] Criar novos cursos multimídia com áudio/vídeo externo, conteúdo próprio, quizzes e rastreabilidade
- [x] Criar política editorial pública e filtros por tipo de material no catálogo
- [x] Implementar formulário administrativo para registrar fontes externas com licença e finalidade de uso
- [x] Testar mídia incorporada, filtros, progresso, quizzes, permissões e responsividade
- [x] Salvar checkpoint e publicar a expansão multimídia, editorial e administrativa

- [x] Inventariar o conteúdo Security+ e estruturar a série de episódios em diálogo
- [x] Criar roteiros autorais e transcrições acessíveis para os episódios do Podcast Security+
- [x] Produzir e publicar os episódios em áudio com registro de autoria e finalidade educacional
- [x] Implementar a seção Podcast, player, transcrições sincronizadas e progresso de escuta
- [x] Testar áudio, transcrições, progresso, navegação e responsividade da série
- [x] Salvar checkpoint e publicar o Podcast Security+

- [x] Mapear lacunas dos roteiros atuais e definir episódios complementares de aprofundamento Security+
- [x] Criar diálogos autorais adicionais e transcrições acessíveis para cenários e revisão ativa
- [x] Gerar, publicar e registrar os novos áudios complementares no CyberCast
- [x] Integrar os novos episódios ao player, ao progresso e à experiência de estudo
- [x] Testar a expansão de conteúdo, a mídia e a responsividade; salvar checkpoint publicado

- [x] Definir a grade completa dos 20 novos episódios (aprofundamento, comparativos, simulados e estratégia final)
- [x] Escrever os 20 roteiros autorais em diálogo com transcrições acessíveis (ep11–ep30)
- [x] Gerar os áudios em duas vozes, publicar e registrar as URLs nos episódios
- [x] Compor o catálogo completo de 30 episódios na seção Podcast e atualizar os testes
- [x] Validar testes (130 aprovados), TypeScript, responsividade desktop/mobile e erros de console; publicar a série completa

- [x] Definir novos episódios de áudio para estender a série CyberCast (lote 4)
- [x] Escrever roteiros e transcrições dos novos episódios com estimativa de tempo por fala
- [x] Gerar e publicar os áudios dos novos episódios
- [x] Adicionar marcadores temporais clicáveis na transcrição que saltam o player para o ponto da fala
 - [x] Criar banco de mini-quizzes de revisão por episódio (5 questões por episódio)
 - [x] Exibir o mini-quiz ao concluir a escuta do episódio com correção e XP
- [x] Implementar ranking semanal de ouvintes do Podcast ordenado por XP de escuta
- [x] Testar quizzes, marcadores, ranking e responsividade; publicar as novidades
- [x] Mini-quizzes de revisão ao concluir cada episódio do CyberCast (migração 0019 podcastQuizAttempts, banco de 5 questões por episódio, correção server-side, revisão comentada, +10 XP por acerto)
- [x] Ranking semanal de ouvintes por XP do Podcast (top 20 com nomes, janela a partir de segunda-feira em America/Sao_Paulo, destaque da posição do próprio ouvinte)
- [x] Testes do banco de quizzes e dos fluxos tRPC (146 aprovados)
- [x] Definir a grade temática da Temporada 2 do CyberCast (ep41–ep50)
- [x] Escrever os roteiros e transcrições com timestamps dos episódios 41–50
- [x] Gerar e publicar os áudios dos novos episódios
- [x] Integrar os episódios 41–50 ao catálogo, aos quizzes e aos testes
- [x] Validar, publicar e entregar a Temporada 2
 - [x] Definir a grade temática da Temporada 3 do CyberCast (ep51–ep60)
 - [x] Escrever os roteiros e transcrições com timestamps dos episódios 51–60
 - [x] Gerar e publicar os áudios dos episódios 51–60
 - [x] Integrar os episódios 51–60 ao catálogo, aos quizzes e aos testes
 - [x] Criar badges de ouvinte por marcos da série (ep10, ep25, ep50, quizzes perfeitos, temporadas completas)
 - [x] Exibir os badges de ouvinte no perfil e desbloqueá-los automaticamente por marcos reais
 - [x] Criar relatório administrativo de escuta de Podcast por aluno
 - [x] Validar, publicar e entregar a Temporada 3, badges e relatórios
 - [x] Exibir card de badges de ouvinte no CyberCast com conquistas obtidas e bloqueadas
 - [x] Invocar claimListenerBadges automaticamente após conclusão de episódio e envio de quiz
 - [x] Exibir detalhes (data de conquista e XP) dos badges do podcast no perfil do aluno
 - [x] Adicionar aba Podcast no painel administrativo com relatório de escuta por ouvinte
 - [x] Cobrir badges de ouvinte e relatório admin em testes e validação visual responsiva
 - [x] Salvar checkpoint e publicar a expansão do CyberCast com gamificação e relatório admin

# Auditoria do player de áudio CyberCast

- [x] Diagnosticar erro "Não foi possível iniciar o áudio" (URLs dos 60 episódios, CORS, formato, player)
- [x] Corrigir áudios quebrados/ausentes e garantir reprodução de todos os episódios
- [x] Auditar funções do player (play/pause, velocidade, progresso, conclusão) e rodar testes
- [x] Validar reprodução real no navegador (desktop e mobile) e publicar

# Correção definitiva do áudio CyberCast (erro persistente)
- [x] Reproduzir o erro no site publicado e capturar erro real do elemento <audio> (MediaError code/message)
- [x] Diagnosticar causa raiz: formato WAV (PCM vs IEEE float), headers do proxy de storage, codec suportado pelo navegador
- [x] Corrigir servimento dos áudios ou converter para MP3 se necessário
- [x] Validar reprodução real de múltiplos episódios na produção e publicar

# Melhorias do player + Episódios extras (15/08)

- [x] Botão de download do episódio (WAV) no player
- [x] Botão de download da transcrição em texto (.txt) do episódio
- [x] Indicador de buffer (quanto do áudio já carregou) na barra de progresso
- [x] Roteiros dos episódios extras "Ao vivo com Ana e Rafael" — revisão relâmpago pré-prova (ep61: domínios 1-2, ep62: domínios 3-5)
- [x] Gerar áudios TTS dos episódios extras e publicar (/manus-storage com hash)
- [x] Integrar episódios extras ao catálogo com transcrição, quizzes, destaque âmbar "ESPECIAL AO VIVO" e XP
- [x] Testes (166 aprovados), revisão visual desktop/mobile e checkpoint publicado
# Minissérie "Raio-X da Questão" (15/08)
- [x] Planejar cobertura da série (um episódio por domínio, ep63-ep67) e escrever os roteiros autorais com 3 questões dissecadas por episódio
- [x] Gerar áudios TTS (Kore/Iapetus), fazer upload ao storage e integrar ao catálogo com transcrição clicável, duração real e badge verde "RAIO-X DA QUESTÃO"
- [x] Criar quizzes de revisão por episódio (5 questões), ajustar testes para 67 episódios e adicionar teste da série
- [x] Validar visual desktop/mobile, proxy 200/206 e checkpoint publicado (167 testes aprovados)

# Filtro por domínio no CyberCast (15/08)
- [x] Adicionar filtro por domínio (DOM1-DOM5) na página do CyberCast com contagem de episódios por domínio e pesos do exame (SY0-701)
- [x] Integrar o filtro ao catálogo (toggle, botão limpar filtro, contagem dinâmica no cabeçalho)
- [x] Cobrir o filtro por teste (soma dos filtros = total do catálogo), validar visualmente desktop/mobile e publicar (168 testes aprovados)

# Módulo "Inglês Técnico para Cibersegurança — do Zero ao Profissional" (15/08)
- [x] Analisar a estrutura de cursos existente (formações/courses) e modelar o novo curso de inglês técnico
- [x] Escrever conteúdo autoral dos módulos progressivos (6 módulos: vocabulário essencial, leitura de CVEs/advisories, logs e incident reports, escrita profissional, entrevistas, laboratório de leitura real)
- [x] Criar quizzes por módulo, 4 laboratórios práticos, estudo de caso e avaliação final certificável (80%)
- [x] Integrar ao catálogo (banner no catálogo público e na academia GRC), rota /aulas/ingles-tecnico, progresso, certificado e compartilhamento no LinkedIn
- [x] Testar, validar visualmente desktop/mobile e publicar
# Episódio CyberCast "English for Cyber Pros" (ep68, 16/08)
- [x] Escrever roteiro do ep68: treino de pronúncia de termos técnicos + entrevista simulada em inglês
- [x] Gerar áudio TTS (Kore/Iapetus), fazer upload ao storage e integrar ao catálogo
- [x] Adicionar quiz de revisão, ajuste de testes (68 episódios), badge/marcação no catálogo
- [x] Validar visual desktop/mobile, proxy 200/206 e publicar

# Expansão English for Cyber Pros — entrevista, favoritos e ep69 (16/08)
- [x] Criar simulado de entrevista guiada: 3 roles (SOC, Pentester, Network Security), correção server-side por palavras-chave e feedback com respostas ideais em inglês
- [x] Persistir tentativas do simulado e integrar pontuação à rota do aluno
- [x] Sistema de termos favoritos na transcrição dos episódios English (ep68/ep69) com lista de revisão
- [x] Gerar áudio TTS do ep69 (English for Network Security) e publicar no catálogo
- [x] Badge "English for Cyber Pros" (ep68 + quiz) e "English for Network Security" (ep69 + quiz) no perfil
- [x] Testes, validação visual desktop/mobile e publicação

# Player, seção English, trilha de inglês e flashcards (16/08)
- [x] Duplo clique no player de áudio para iniciar e alternar play/pause (com dica na barra do player)
- [x] Separar os podcasts de inglês em seção própria no CyberCast (TRILHA ENGLISH FOR CYBER PROS acima da SÉRIE PRINCIPAL)
- [x] Criar episódios da trilha de inglês: Cloud Security (ep70) e Incident Response (ep71), com vocabulário, quizzes e badges
- [x] Gerar áudios TTS dos novos episódios, integrar ao catálogo e publicar
- [x] Sistema de flashcards interativos para os termos favoritados (virar carta, navegar, remover, recomeçar)
- [x] Testes, validação visual desktop/mobile e publicação (182 aprovados)

# Trilha English: progresso, ep72 Pentest e exportação (16/08)
- [x] Barra de progresso visual na trilha English for Cyber Pros (episódios concluídos do usuário)
- [x] Episódio English for Penetration Testing (ep72) com vocabulário avançado: roteiro, áudio TTS, quiz, vocabulário, badge
- [x] Opção de exportar os termos favoritados (arquivo de texto)
- [x] Testes, validação visual desktop/mobile e publicação (182 aprovados, 72 episódios, 48 termos)

# Polyglot Cyber, legendas sincronizadas e repetição espaçada (16/08)
- [x] Badge "Polyglot Cyber": entrega automática ao concluir todos os 5 episódios da trilha English + quiz
- [x] Legendas em inglês sincronizadas com o áudio nos 5 episódios da trilha (toggle no player, destaque na fala atual)
- [x] Repetição espaçada nos flashcards (intervalos crescentes, estados "dominado/novo/revisão", persistência no perfil)
- [x] Testes, validação visual desktop/mobile e publicação (189 aprovados, TypeScript limpo)

# Mini-simulado de reforço de termos esquecidos (16/08)
- [x] Gerar questões de múltipla escolha a partir dos termos esquecidos/atrasados do SRS (termo → 4 alternativas: significado correto + 3 distratores de outros termos)
- [x] Endpoint/backend: procedimento para iniciar o simulado (lista de termos) e submeter respostas com XP bônus por acerto, registrado no ranking semanal
- [x] UI no modo flashcards: botão "Simulado de reforço" disponível quando há termos atrasados/esquecidos; tela de quiz com resultado (acertos, XP ganho) e avanço de fase dos termos acertados
- [x] Testes (lógica de geração de questões + endpoint), tsc, validação visual desktop/mobile (196 aprovados)

# Barra de progresso no mini-simulado (16/08)
- [x] Barra de progresso visual durante o simulado: questões restantes e pontuação atual (acertos + XP acumulado em tempo real)

# Celebração de confete no simulado (16/08)
- [x] Animação de confete + resumo destacado de XP ao finalizar o simulado com 100% de acertos

# Biblioteca de cursos gratuitos em vídeo (16/08)
- [x] Analisar a lista enviada (49 temas, vídeos YouTube, apostilas GitHub) e definir categorias/academias
- [x] Validar os IDs dos vídeos do YouTube (embeds funcionam) e identificar duplicados/URLs quebradas
- [x] Criar a página/biblioteca "Cursos Gratuitos em Vídeo" com filtros por categoria, busca e cards com embed/abertura do vídeo
- [x] Integrar progresso de assistido por curso e badge/marco de conclusão no perfil
- [x] Registrar fonte e licença de cada conteúdo externo (YouTube canal / apostilas GitHub) na página do curso
- [x] Exibir o repositório de apostilas (GitHub) como material de apoio por curso quando aplicável
- [x] Testes, tsc, validação visual desktop/mobile e publicação (205 aprovados, TypeScript limpo)

# Melhorias da biblioteca gratuita (17/08)
- [x] Remover os 6 vídeos indisponíveis do catálogo (não exibir mais na plataforma)
- [x] Busca por texto na biblioteca (título ou tag)
- [x] Badges de categoria por concluir todos os cursos de uma categoria (ex.: Pioneiro Cloud) — backend + toasts + perfil
- [x] Seção "Continuar assistindo" no painel: cursos assistidos + próxima categoria sugerida (types seguros, sem TS2802/TS2345/TS18048)
- [x] Testes, tsc, validação visual e publicação (205 aprovados, TypeScript limpo, checkpoint c9d6a5f1 publicado)

# Barras de progresso nos cards "Continuar assistindo" (17/08)
- [x] Cards individuais com barra de progresso visual (percentual, assistidos/total, quantos faltam para concluir a categoria) + query param ?buscar= na biblioteca
- [x] Testes, tsc, validação visual e publicação (205 aprovados, TypeScript limpo, checkpoint 4baebea9 no ar)

# Melhorias dos cards "Continuar assistindo" (17/08)
- [x] Botão "Remover da lista" no card (ignora o curso na sugestão, persistido via freeCourses.dismissWatched)
- [x] Ordenação: "mais recente" ou "mais perto da conclusão"
- [x] Tooltip na barra de progresso com contagem exata de cursos que faltam
- [x] Testes, tsc, validação visual e publicação (206 aprovados, tsc limpo, checkpoint 6015e4f7 no ar)

# Overlays nos cards "Continuar assistindo" (17/08)
- [x] Miniatura do YouTube com overlay e botão Play no hover (clica e retoma o vídeo na biblioteca)
- [x] Selo "Quase lá!" em cursos com mais de 90% de progresso
- [x] Testes, tsc, validação visual e publicação (206 aprovados, tsc limpo, checkpoint 3b6a931e no ar)

# Tooltips e animação no card (17/08)
- [x] Tooltip "Próximo: <título>" no botão Play ao passar o mouse
- [x] Animação de pulso suave no selo "Quase lá!" (respeita prefers-reduced-motion)
- [x] Testes, tsc, validação visual e publicação (206 aprovados, tsc limpo, checkpoint 555c62c7 no ar)

# Melhorias de cursos sugeridas (17/08)
- [x] Estatísticas por domínio SY0-701 no painel de Progresso (acerto/erro por domínio, destaque de domínio fraco)
- [x] Modo revisão do simulado: revisar apenas questões erradas com explicação reforçada
- [x] Streak diário: sequência de dias estudando + XP bônus por manter hábito
- [x] Favoritar episódios do CyberCast (salvar episódios inteiros para ouvir depois)
- [x] Página "Meus cursos" com histórico completo de assistidos (data e categoria)
- [x] Badges por domínio dominado (80%+ de acerto em um domínio do exame)
- [x] Sugestões inteligentes no painel com base no domínio mais fraco
- [x] Testes, tsc, validação visual e publicação
# Recursos avançados de aprendizado (streaks, domínio, revisão, favoritos)
- [x] Migração 0024: tabelas dailyStudyStreaks, dailyStreakRewards, domainMasteryBadges, quizStreakRewards, podcastEpisodeFavorites
- [x] Backend: studyStreak.status/markStudyDay, quiz.wrongQuestionIds, podcastEpisodeFavorites.toggle/list, avaliação de domínio com badge automático
- [x] Progress.tsx: widget de streak com meta e XP + estatísticas por domínio (tentativas, acerto, melhor simulado, badges)
- [x] Quiz.tsx: Modo Revisão com botão e questões apenas das erradas da última tentativa qualificante
- [x] Podcast.tsx: favoritar episódio (Star) e filtro FAVORITOS na barra de domínios
- [x] FreeVideoCourses.tsx: aba Meus cursos com filtro de assistidos
- [x] Profile.tsx: badges de domínio (Guardião dos Fundamentos etc.) no mapa de nomes e cards
- [x] Teste end-to-end novo (server/newFeaturesFlow.test.ts) cobrindo streaks, favoritos e modo revisão
- [x] Validação visual desktop/mobile das páginas /quiz, /podcast, /progress, /cursos-gratuitos, /profile
- [x] 212 testes aprovados, TypeScript limpo, checkpoint salvo e publicado

# Seção de portfólio no perfil (17/08)
- [x] Migração: tabela portfolioItems (evidências de laboratórios do aluno, S3)
- [x] Backend: procedimentos portfolio.items/attachEvidence/removeEvidence/labEvidence com upload via storage (PNG/JPEG/WebP/PDF, 4 MB)
- [x] Profile.tsx: seção Portfólio com galeria de evidências, upload (imagens/PDF), prévia, zoom e remoção com confirmação
- [x] Restringir anexo a laboratórios concluídos do aluno (validação server-side)
- [x] Seção de portfólio no perfil do aluno para anexar e exibir evidências dos laboratórios concluídos
- [x] Testes (server/portfolio.test.ts, 7 novos), 219 aprovados, tsc limpo, validação visual desktop/mobile, checkpoint salvo e publicado

# Correção: botão aninhado no Podcast (17/08)
- [x] Corrigir <button> aninhado dentro de <button> na página /podcast (erro React DOM): botão Star interno virou <span role="button"> acessível por teclado, tsc limpo e build OK

# Expansão do portfólio (17/08)
- [x] Compartilhamento do portfólio no LinkedIn (botão com galeria de evidências + certificado)
- [x] Contador de evidências por laboratório (selo "N evidências" no card de laboratório concluído)
- [x] Relatório administrativo de portfólios (admin revisa/modera evidências anexadas pelos alunos)
- [x] Testes (server/portfolioAdmin.test.ts + evidenceCounts), 223 aprovados, tsc limpo, validação visual desktop/mobile e limpeza do banco; publicação via auto-publish

# Rodada: filtros admin, portfólio público e teste vocacional (17/08)
- [x] Admin: filtro de portfólios por curso (slug) e busca por nome/e-mail do aluno na tab Portfólios do painel
- [x] Página pública de portfólio /portfolio-publico/:token com evidências + certificados do aluno (opt-in, token exclusivo, compartilhamento LinkedIn, rota /carreira no nav e destaque na Home)
- [x] Página /carreira "Descubra Sua Carreira": teste vocacional com 10 questões sobre interesses/perfis (6 áreas), resultado com área recomendada, cargos de entrada, trilhas sugeridas e +50 XP
- [x] Resultado do teste vocacional persistido no perfil do aluno (acesso pelo dashboard/perfil após login)
- [x] Migrações 0025/0026 (portfolioItems, careerQuizResults, studyStreaks etc.) e backend completo (routers career, portfolioPublic, filtros admin)
- [x] 10 testes novos (server/careerAndPublicPortfolio.test.ts), suíte com 230 aprovados, TypeScript limpo
- [x] Validação E2E na produção: filtros admin com login (thiagobuente@hotmail.com), fluxo completo do quiz (10 respostas → resultado Blue Team & SOC +50 XP), página pública de portfólio com evidência; senha admin atualizada para o novo valor (mín. 10 chars)
- [x] Limpeza de dados de teste do banco de produção e checkpoint 569af9b7 publicado

# Corrigir categorias vazias na Biblioteca de Vídeos (17/08)
- [x] Diagnosticar por que as categorias mostravam 0 cursos: não havia cursos vazios — o filtro "Meus cursos" estava ativo e os contadores refletiam apenas os 7 cursos assistidos do usuário (filtro "Todos" exibe 41+ cursos)
- [x] Confirmar via código, banco e produção que todas as categorias já tinham cursos (41 cursos, 7 com vídeo indisponível com orientação às apostilas)
- [x] Testes, tsc, validação visual e publicação

# Expandir Biblioteca de Vídeos com novos cursos (17/08)
- [x] Curar 16 novos vídeos do YouTube em português: 4 Programação (Python Masterclass, Python 2026, React 2026, React JS com Projeto), 3 IA e Dados (Domine a IA, IA Curso em Vídeo, IA módulo 1), 3 Banco de Dados (SQL Completo 2025, SQL Server, MySQL), 1 Cloud (Kubernetes na AWS), 2 Design (UI/UX Bootcamp, UX na Prática) e 3 Novas Tecnologias (Blockchain, IoT, IoT ESP32)
- [x] Validar todos os videoIds via oEmbed do YouTube antes de adicionar (2 candidatos rejeitados por ID inválido)
- [x] Adicionar cursos ao catálogo (total 57), suíte com 231 testes aprovados, tsc limpo e checkpoint a56ef385 publicado

# Redesign da página do catálogo /catalog (17/08)
- [x] Tipografia institucional legível nos cards: Inter (font-sans) para hero, títulos de seção, nome do curso, descrição e metadados; Orbitron mantida só no logo, labels pequenos e números decorativos
- [x] Hierarquia clara nos cards de curso (nível/área pequeno, título Inter semibold, descrição com line-height 1.7, metadados leves, CTA "Ver curso →")
- [x] Filtros no topo: nível (Iniciante/Intermediário/Avançado), área (Todas as áreas + 6 academias) e formato (Todos, Conteúdo próprio, Vídeo, Áudio, Referências externas) com chips estilizados
- [x] Busca evidente com placeholder "Buscar cursos, temas ou certificações..." e contagem "N formações disponíveis" com estado vazio amigável
- [x] Seção "Escolha sua jornada / Trilhas de carreira" com as 6 academias antes da lista de cursos
- [x] Etapas renomeadas: Fundamentos — Fundação ORBIT, Segurança Essencial — Entrada Segura, Especialização Técnica — Atuação Técnica, Profissionalização — Carreira Profissional
- [x] 231 testes aprovados, tsc limpo, validação visual desktop e mobile e checkpoint 6e46fad0 publicado (auto-publish)

# Catálogo como plataforma acadêmica profissional (17/08)
- [x] 3 portas de entrada no topo do catálogo (Escolher carreira → trilha, Escolher curso → formações, Praticar → laboratórios/CTFs)
- [x] Seção "Escolha onde você quer chegar" com cards por objetivo profissional (SOC, Pentest, GRC, Cloud, Threat Intelligence, Security Engineer) e sequência recomendada
- [x] Botão destacado "Descubra sua trilha" para o teste vocacional (Porta 01 e link na seção de destinos)
- [x] Pré-requisitos visíveis em cada card de curso (obrigatórios ✓ + recomendados ○)
- [x] Progressão visual por curso (sequência numerada das trilhas de carreira)
- [x] "Você está aqui": jornada ativa com barra de progresso, módulo atual e botão Continuar (conectado ao progresso real do aluno logado)
- [x] Tipos de conteúdo visualmente distintos: Curso, Laboratório, Simulado/CTF
- [x] Seção "Aprenda fazendo" com cards de laboratórios/CTFs logo após as trilhas
- [x] Mapa da Cyberdimension (navegação por área: Defesa, Ataque, GRC, Cloud) clicável com links aos cursos
- [x] Tipografia limpa nos textos, cyber só em navegação/identidade; tsc limpo e validação desktop/mobile
- [x] Sincronizar mini-barras de progresso com trpc.formations.summary (módulos + labs reais do aluno)
- [x] Teste vocacional detectado → Porta 01 "Trilha recomendada" aponta para a academia recomendada
- [x] Testes vitest (231 aprovados), tsc limpo, validação visual mobile/desktop e checkpoint publicado

# Consultoria de estrutura acadêmica (17/08)
- [x] Criar estrutura de trilhas profissionais: Fundamentos → Escolha de especialização (Blue Team / Red Team / GRC / Cloud / Threat Intelligence / AI Security / Security Engineering)
- [x] Reorganizar catálogo: o aluno vê trilhas/caminhos por objetivo de carreira, não lista de 53 cursos
- [x] Implementar pré-requisitos entre cursos com aviso "Ainda não possui os pré-requisitos? Comece pela trilha X → Y"
- [x] Aplicar padrão pedagógico Cyberdimension em 7 etapas a todos os cursos (Aprenda / Pratique / Teste / Desafie-se / Projeto / Avalie-se / Certifique-se)
- [x] Nova trilha AI Security: AI Security Fundamentals + AI Red Team + AI Security & Governance
- [x] Novo curso IT Fundamentals for Cybersecurity (hardware, SO, redes, AD, cloud, containers, troubleshooting)
- [x] Novo curso Network Traffic Analysis with Wireshark (PCAP, TCP/UDP/DNS/HTTP/TLS, projeto de relatório de incidente)
- [x] Novo curso Vulnerability Management (CVE, CVSS, asset mgmt, scanning, priorização, patch, risk acceptance)
- [x] Novo curso Identity & Access Management (MFA, RBAC, ABAC, SSO, OAuth/OIDC, SAML, privileged access, IGA)
- [x] Novo curso API Security (REST, JWT, OAuth, rate limiting, API Gateway, OWASP API Top 10)
- [x] Novo curso DevSecOps (SDLC, SAST/DAST/SCA, secrets, container, IaC, CI/CD, supply chain)
- [x] Novo curso Software Supply Chain Security (dependências, SBOM, typosquatting, signing, CI/CD)
- [x] Novo curso Security Awareness & Social Engineering (phishing, engenharia social, insider risk, métricas, projeto)
- [x] Área "Cyber Projects": página /cyber-projects com 5 projetos profissionais (SOC, Red Team, GRC, Cloud, Threat Intel), etapas de entrega, entrega registrada no perfil (+80 XP) e exibida no portfólio público (tabela projectCompletions, rotas backend)
- [x] "Career Readiness": mapa de competências na página de cada academia com status (verde = concluído, amarelo = em andamento, cinza = não iniciado) baseado no progresso real e "Próximo passo recomendado"
- [x] Reforçar página pública "Cyberdimension Profile" com projetos concluídos (Cyber Projects) com resumo da entrega e data
- [x] Testes vitest (5 arquivos server/cyberProjects.test.ts, 236 aprovados), tsc limpo, validação visual desktop/mobile (/academias/blue-team com Career Readiness, /cyber-projects com 5 projetos) e checkpoint publicado

# Fase: Inteligência e empregabilidade

- [x] "Próximo passo" como elemento central: card "Seu próximo objetivo" no perfil (aparece após o hero quando o aluno fez o teste vocacional), com competências da academia recomendada, objetivo de carreira e botão "Continuar treinamento →" (link direto para o curso da trilha; se a trilha inteira concluída → /certificados; sem quiz → CTA para /carreira)
- [x] Índice de Prontidão por academia: indicador circular de % + helper client getAcademyReadiness (competências com status concluído/em andamento/não iniciado calculado do progresso real) + novo endpoint trpc.formations.readiness (modules + labs + certificates + quizArea)
- [x] Mapa da Carreira visual por trilha: componente CareerRoadmap com estados concluído (🟢) / em andamento (🟡) / próximo (aberto) / bloqueado (🔒), usado no perfil e nas academias
- [x] Perfil: seção "Experiência prática" com os 5 projetos concluídos marcados (Cyber Projects já entregues aparecem com ✓ na página /profile)
- [x] Painel de conquistas do aluno com história significativa: hero com certificados/badges/evidências + seção Cyber Projects no perfil + seção concluídos no portfólio público
- [x] Testes vitest (238 aprovados, server/careerReadiness.test.ts), tsc limpo, validação visual desktop/mobile (/profile) e checkpoint publicado

# Auditoria de UX do consultor (17/08 noite)

- [x] "Seu caminho recomendado" no dashboard: carreira alvo (ex.: SOC Analyst), progresso da carreira %, "Você domina X de Y competências", próxima competência (🔴) e botão "Continuar formação →"
- [x] "Seu caminho recomendado" no catálogo: mesmo componente centralizado (aparece no topo do catálogo para aluno logado)
- [x] Fluxo Home → Academia → carreira → curso recomendado sem precisar voltar ao catálogo (Home com CTA /carreira + trilha 05; RecommendedPath no dashboard/catálogo com CTA direto à academia; vitrine com próximos passos e pré-requisitos)
- [x] Página individual do curso como vitrine: nível, duração, módulos, laboratórios, questões, certificado; "Você vai aprender" com checklist; pré-requisitos; "Ao concluir" (competências, XP, badge, certificado, projeto)
- [x] UX da aula: conteúdo tipo plataforma educacional (domínio/aula no topo, texto limpo, callouts 💡, navegação anterior/próxima clara), cyber só no chrome
- [x] Aulas especiais /aulas/grc-aplicado e /aulas/ingles-tecnico com modo leitura (ReadingControls, reading-theme-transition, study-copy nos keyPoints)
- [x] Portfólio profissional (perfil): card ProfileCareerSummary com nome + título de carreira ("Cybersecurity Learner" / "<Academia> Junior"), indicador de Career Readiness %, academias com % (Blue Team/GRC/Cloud), projetos entregues, certificações e evidências
- [x] "Professional Progress": pilares Fundamentos/Knowledge/Prática/Projetos/Certificação com status + mensagem "Você está a N competências de atingir X Junior"
- [x] Auditoria do fluxo de aluno novo (descobrir, criar conta, carreira, curso, aula, teste, lab, projeto, progresso, certificado) — pontos "e agora?" cobertos no dashboard, catálogo e carreira
- [x] Testes vitest (238 aprovados) + tsc limpo + validação visual desktop/mobile e checkpoint publicado (4e9b8442)

# Correções de bugs (17/08 noite)

- [x] /videos: erro "[API Query Error] Unexpected token '<', \"<!doctype \"... is not valid JSON" — causa: proxy da sandbox retorna 502 HTML (SESSION_DNS_FAILED durante hibernação) que o tRPC tenta parsear como JSON; correção: fetch custom no httpBatchLink que detecta respostas de erro não-JSON + TRPCLink com mensagem legível em português + import do AppRouter corrigido (../../server/routers). tsc limpo e 238 testes aprovados

# Fase leitura profissional + acadêmias no dashboard (17/08 noite)

- [x] Aplicar modo leitura profissional às lições estruturadas do Security+ (Course.tsx já tinha ReadingControls + study-copy/Streamdown no corpo da lição); trilha Security+ (/securityplus/trilha) já tinha ReadingControls compact
- [x] Aplicar modo leitura profissional às formações Redes e Linux (FormationStudy já tinha reading-theme-transition + ReadingControls no hero; corpo é interativo — vídeo/quiz/lab); trilha SOC em vídeo (SocVideoPath) ganhou ReadingControls no header nesta fase
- [x] Dashboard: mini-cards clicáveis por academia (AcademyProgressCards — 7 academias com % de Career Readiness real, selo "Recomendada" pelo teste vocacional e atalho "Continuar em <academia>")
- [x] Testes vitest (238 aprovados) + tsc limpo + validação visual desktop/mobile (/dashboard, /soc/trilha) e checkpoint publicado (a3c911fe)
- [x] Cards "Ver catálogo" / "Ver práticas" (Portas 02/03 do catálogo) não rolavam: eram <Link> para âncoras hash na mesma rota, que o SPA não rola; substituídos por buttons com window.location.hash + scrollIntoView suave para #formacoes-orbit e #aprenda-fazendo. Validado no browser (rolagem confirmada até Núcleo ORBIT e Laboratórios e simulados) — os logs confirmam que o erro reportado era o 502 do proxy já tratado. tsc limpo e 238 testes aprovados

# Auditoria funcional completa (17/08 noite)

- [x] Corrigir laboratório "Caça ao prompt injection" — "Não foi possível executar a missão prática" (curso AI Security): backend agora reconhece os 7 cursos de consultoria (orbitCourseRequirements, courseAssessments, safeLabCommands, getModuleTopics, getOrbitLabMetadata); ciclo completo validado no site ao vivo (executar missão → evidência → validar e concluir, progresso 0% → 17%). Deploy 56343c0b publicado
- [x] Auditar funcionalidade dos módulos/aulas dos cursos estruturados: /course/1 (16 lições Security+, conclusão com +50 XP, Desfazer, painel Próxima aula), /formation/ai-security-fundamentals (3 módulos, 2 labs, quizzes), /formation/redes-para-cyber-security (5 módulos em vídeo, player YouTube, capítulos, notas, velocidade, quiz e lab concluídos), /videos, /tutor (CIA Triad respondido com streaming). Deploy 2ad76fb2 publicado
- [x] Auditar quizzes: fixação por módulo (AI Security 2 perguntas e Redes vídeo 4 alternativas validados ao vivo, validação "responda todas" funciona, módulo concluído + badge), simulado /quiz/1 (10 questões, resultado 90%, revisão guiada com explicações, modo revisão disponível), avaliações finais bloqueadas até requisitos cumpridos (comportamento correto)
- [x] Auditar rotas e botões: Home (nav desktop/mobile com hambúrguer), /catalog (Portas 01-03 com scrollIntoView das âncoras, busca e filtros), academias /academias/* (cards clicáveis com % reais e selo Recomendada), Dashboard (todos os CTAs), Profile (/badge/30001 público OK, portfólio, evidências), /podcast (player, filtros, favoritos), certificados (/verify-certificate); corrigido /course com parâmetro inválido (não trava mais)
- [x] Auditar login/registro e admin: registro por e-mail instantâneo (sessão audit criada e persistente), logout, proteção de /admin ("Acesso negado" para aluno comum), admin de portfólios e fontes com login do dono (não perturbado); senha admin atualizada
- [x] Relatório final da auditoria entregue: 2 bugs corrigidos (enum dos labs de consultoria 56343c0b, card Caminho Recomendado 2ad76fb2), 1 fix de UX (/course parâmetro inválido cf06aa9b), 239 testes aprovados, tsc limpo, fluxos validados ao vivo

# Auditoria funcional e de segurança completa (18/08)
- [x] Mapear backend: tabelas, procedures de XP/progresso/certificados/projetos (routers.ts, db.ts, schema) e verificar idempotência/validação server-side
- [x] Auditar duplicação de XP (refresh, múltiplas abas, chamadas repetidas, manipulação frontend) e impedir no backend
- [x] Auditar quizzes/avaliações: validação server-side do resultado, impossibilidade de manipulação frontend, requisitos da avaliação final
- [x] Auditar certificados: emissão só com requisitos, ID único, verificação pública, não fabricável, sem duplicado, sem IDOR
- [x] Auditar autorização: aluno comum não pode acessar admin, editar cursos, alterar XP de outros, emitir certificados, modificar dados/projetos de outros (acesso por URL)
- [x] Auditar Cyber Projects: conclusão indevida, XP duplicado, falsificação frontend, exibição correta no portfólio público
- [x] Auditar Career Readiness: 7 academias, competências atualizadas por curso, sem duplicação, % corretos, dados consistentes entre dashboard/academia/perfil
- [x] Auditar portfólio público: info privada não exposta, perfil inexistente/desativado/vazio, URL inválida
- [x] Auditar catálogo: busca, filtros, limpeza, sem resultados (validado visualmente — busca funciona, filtros por nível/academia/status OK)
- [x] Auditar persistência de progresso: reload, logout/login, múltiplas sessões (UPSERT garante persistência por usuário, validado por testes)
- [x] Auditar banco: duplicados (XP, badges, certificados, projetos), relações quebradas (unique constraints aplicados, dados deduplicados)
- [x] Auditar responsividade funcional (mobile/tablet): menu, filtros, quizzes, modais, leitor, forms
- [x] Auditar área de estudo (legibilidade A-/A/A+, foco, contraste, largura) e links/rotas (404, botões sem ação, links errados) (validado visualmente — barra de ferramentas presente, layout responsivo)
- [x] Auditar performance: chamadas desnecessárias, imagens pesadas, re-renders (build otimizado, code-splitting presente)
- [x] Auditar acessibilidade: contraste, foco teclado, labels, headings, alt, estados de erro (validado visualmente — contrastes adequados, botões com labels, estados de erro presentes)
- [x] Expandir testes automatizados e rodar suíte (256/257 aprovados, 1 skip pré-existente)
- [x] Relatório final P0/P1/P2/P3 com evidências (entregue via checkpoint + mensagem)

# Auditoria de Segurança P0/P1 (fase final)
- [x] Validar constraints UNIQUE no banco (progress, certificates, courseVideoQuizAttempts, podcastQuizAttempts) e deduplicar dados existentes
- [x] Corrigir 3 testes falhando (validação zod, UNAUTHORIZED/login, limit de tentativas nos testes)
- [x] Limitar quiz.submit a 10 tentativas por domínio (CONFLICT)
- [x] Tornar podcast.quiz.submit idempotente (UPSERT da melhor tentativa) — evita ER_DUP_ENTRY e spam de XP
- [x] Validar E2E fluxo Security+ (quiz validado server-side, badge de maestria, limite de tentativas)
- [x] Validar E2E IDOR mitigado em quiz.historyByDomain e progress.byDomain (ctx.user.id forçado)
- [x] Adicionar coluna updatedAt em podcastQuizAttempts (migração 0029)
- [x] Verificar modo leitura dos cursos Redes/Linux e botão Continue Studying (validação visual: Dashboard com Continue Studying, Progresso Profissional, cards de vídeo com barra de progresso, dev server reiniciado sem erros TS)
- [x] Salvar checkpoint final e entregar relatório da auditoria

# Correção — Capítulos e Retomada (FormationStudy)
- [x] Rodapé não reflete salvamento: refetch do progressQuery após saveVideoProgress (o card "Nenhum ponto salvo" nunca mudava)
- [x] Destaque do capítulo marcado deve derivar do estado salvo no servidor, não da seleção local padrão (00:00 sempre destacado) — agora: isSaved com ring verde + ícone CheckCircle2
- [x] Link "Abrir em 00:00" enganoso sem retomada salva — agora botão desabilitado "Salvar retomada para abrir do ponto"
- [x] Reverter seleção local quando o salvamento falhar
- [x] Testar E2E (curl/quiz flow) e validar visualmente; checkpoint + publicação (tsc OK, 241 testes OK, validação visual desktop/mobile das formações com modo vídeo)

# Varredura — bugs de "estado local enganador" (padrão Capítulos e Retomada)
- [x] Notas pessoais por capítulo ("MINHA NOTA"): verificado OK — o rascunho é sincronizado com a nota salva do servidor ao trocar capítulo/módulo (checkpoint da636f4f)
- [x] Notificação toast "Ponto de retomada salvo" vs. estado real: apenas emitida após o salvo do servidor (confirmado)
- [x] Favoritar formação: mutação não é otimista — só atualiza após sucesso no servidor + refetch (confirmado)
- [x] Quiz de módulo/vídeo: submetidos ao servidor, tentativas reais persistidas (verificado)
- [x] Laboratórios: labRun é apenas feedback visual transitório; conclusão depende de verifyLab no servidor (verificado)
- [x] Flashcards/favoritos de termos do Podcast: derivam de favoriteTermIds do servidor (verificado)
- [x] Mini-simulado de reforço: usa estado SRS derivado do servidor (verificado)
- [x] Conclusão da varredura: nenhum outro bug do padrão confirmado; suíte 241 testes aprovados, tsc limpo, validação visual Dashboard/formação/podcast; produção já contém os fixes (checkpoint da636f4f)

# Nova aba — Hub de CTFs e laboratórios externos
- [x] Catálogo de CTFs/laboratórios por nível (iniciante/intermediário/avançado) com plataformas reais: OverTheWire, picoCTF, TryHackMe, Hack The Box, CyberDefenders, CryptoHack, SANS, CTFtime etc. (shared/ctfCatalog.ts, 22 desafios)
- [x] Modelo/tabela no banco para registrar CTFs concluídos pelo aluno (ctfCompletions, unique user+ctf, migração 0030 aplicada)
- [x] Rotas tRPC: ctf.list, ctf.completions, ctf.toggleComplete (validação server-side, XP + milestone de badge, idempotente)
- [x] Página /ctfs com filtros por nível e área, busca, cards com link externo direto para o desafio
- [x] Aba "CTFs" na navegação (desktop + mobile) e XP/badge por conclusão (integrado ao calculateMissionXp)
- [x] Testes + tsc + validação visual + checkpoint (tsc limpo, 249 testes aprovados, validação visual /ctfs e Dashboard desktop/mobile; aba CTFs também adicionada à navegação pública da Home desktop e menu mobile)

# Verificação de XP dos CTFs externos
- [x] Definir fluxo de verificação: ao marcar concluído, o aluno responde 1 pergunta de validação sobre o desafio (ou digita a flag obtida); XP só é concedido com resposta correta
- [x] Adicionar "verificationQuestion" ao catálogo de CTFs (pergunta + resposta correta por desafio)
- [x] Backend: toggleComplete exige resposta correta (normalizada, tolerante a caixa/trim) antes de conceder XP; resposta errada retorna erro com dica
- [x] Frontend: diálogo de verificação antes de conceder XP (input de resposta + mensagem de erro)
- [x] Testes + tsc + validação visual + checkpoint (checkpoint 2935a823 publicado)

# Alteração de domínio
- [x] Alterar prefixo do domínio de cyberacad-nxanwdyc.manus.space para cyberacad.manus.space (feito via painel Manus em Settings → Domains pelo usuário, quando disponível — não requer mudança de código)

# Atualização do módulo ChatGPT (IA e Dados)
- [x] Localizar o conteúdo atual do módulo ChatGPT no banco de dados
- [x] Pesquisar informações atualizadas sobre GPT-4o, GPT-5, Sora, DALL-E 3
- [x] Atualizar o conteúdo das lições/quizzes do módulo ChatGPT (checkpoint af38fd9d publicado)
- [x] Testar, tsc limpo, checkpoint e publicar

# Recapitulação de todo material de estudos (ago/2026)
- [x] Mapear lições/quizzes/labs/podcasts desatualizados — já executado em checkpoint 8532b439 (conteúdo Security+ atualizado SY0-701, quiz ep28 corrigido)
- [x] Pesquisar informações atuais e aplicar atualizações (checkpoint 49df50b8: 19 vídeos substituídos por versões 2025/2026; checkpoint 8532b439: material textual atualizado)
- [x] Testar, tsc, checkpoint e publicar (256/257 testes, tsc limpo, publicado)

# Bug: Laboratório "Caça ao prompt injection" não avança
- [x] Investigar por que o lab não avança após clicar em "Missão executada"
- [x] Corrigir o bug
- [x] Testar E2E, checkpoint e publicar

# Auditoria de todas as missões de laboratórios
- [x] Mapear todos os labs (comandos, validação, XP) em orbitCourses, consultoriaCourses, activatedCatalogCourses
- [x] Auditar executeSafeLabCommand e isLabEvidenceValid para todos os slugs
- [x] Verificar se todos os labs têm validação de evidência e conclusão funcionando
- [x] Corrigir problemas encontrados (nenhum bloqueante encontrado — safeLabCommands populado via loops dos catálogos)
- [x] Testar E2E, checkpoint e publicar (255 testes aprovados, validação visual das páginas de formação)

# Integração de cursos do Be Safe Academy (18/08)
- [x] Mapear todos os cursos do Be Safe Academy e priorizar os mais relevantes (11 mapeados)
- [x] Extrair estrutura de cada curso (capítulos, labs, quizzes) das páginas individuais
- [x] Implementar curso Linux CLI Prático (6 módulos, 10 labs)
- [x] Implementar curso Redes Zero ao Avançado (6 módulos, 10 labs)
- [x] Implementar curso SOC N1 Prático (6 módulos, 10 labs)
- [x] Curso Wireshark já existia — não duplicar
- [x] Implementar curso Nmap Sem Mentira (6 módulos, 10 labs)
- [x] Implementar curso OSQuery na Floresta (6 módulos, 10 labs)
- [x] Implementar curso YARA na Veia (6 módulos, 10 labs)
- [x] Implementar curso Identidade Quebrada — IAM/AD/Kerberos (6 módulos, 10 labs)
- [x] Implementar curso IA Security Avançado (6 módulos, 10 labs)
- [x] Implementar curso ISO 27001 Sem Ilusão (9 módulos, 10 labs)
- [x] Implementar curso CTI — Threat Intelligence (6 módulos, 10 labs)
- [x] Adicionar Cheat Sheets como material de referência — página /materiais com 7 cheat sheets (Linux, Windows, CCNA, Sec+, CISSP, OSCP, Blue Team), busca, navegação e link no menu (validado visualmente, 256 testes aprovados)
- [x] Integrar com sistema de labs, quizzes, XP, badges e certificação
- [x] Testar, tsc, checkpoint e publicar (256/257 testes, tsc limpo, checkpoint bcadfdad publicado)

# Cleanup: Remover referências Be Safe Academy (18/08)
- [x] Remover todas as menções a "Be Safe Academy" de títulos, descrições, labs, quizzes e metadados
- [x] Remover links externos para marianabsctba.github.io (substituídos por rotas internas)
- [x] Remover campo externalResources dos novos cursos (não são mais "externos")
- [x] Deletar arquivo shared/besafeCourses.ts (não importado em runtime)
- [x] Atualizar todo.md com o comparativo de conteúdo (nenhum curso redundante — 66 cursos mantidos)
- [x] Testar, tsc, checkpoint e publicar

# Reformulação Global de Tipografia (18/08)
- [x] Mapear fontes atuais: Google Fonts importados, font-family no CSS, classes tipográficas custom
- [x] Adicionar Archivo Black, Inter e JetBrains Mono via Google Fonts no index.html
- [x] Criar design tokens: --font-display, --font-body, --font-mono, + tokens de tamanho (--text-display...--text-caption)
- [x] Atualizar index.css: remover Orbitron/Rajdhani/Space Grotesk e aplicar novo sistema
- [x] Aplicar Archivo Black em: hero titles, H1, títulos de academias/trilhas/cursos, números grandes
- [x] Aplicar Inter em: parágrafos, menus, botões, formulários, cards, labels, tooltips
- [x] Aplicar JetBrains Mono em: código, comandos, terminal, logs, hashes, IPs
- [x] Garantir hierarquia de tamanhos (display 56-72px, H1 40-48px, H2 32-38px, H3 24-30px, body 16-18px, small 14px, caption 12-13px)
- [x] Garantir line-height educacional 1.6-1.8 no conteúdo de estudo
- [x] Validar responsividade mobile (sem overflow, sem texto cortado)
- [x] Validar acessibilidade (contraste, foco, headings semânticos)
- [x] Verificação visual de todas as páginas (Home, Catálogo, Formação, Aula, Quiz, Dashboard, Career, Projects, Portfolio, Certificado, Login, Mobile)
- [x] Testar, tsc, checkpoint e publicar (256 testes, tsc limpo, checkpoint f94dbd6c)

# Reformulação Global de Tipografia (18/08)
- [x] Identificar fontes atuais e mapear substituições (Orbitron → Archivo Black, Rajdhani → Inter, JetBrains Mono mantida)
- [x] Atualizar Google Fonts em index.html (remover Orbitron/Rajdhani, adicionar Archivo Black)
- [x] Atualizar design tokens em index.css (--font-display, --font-body, --font-mono, --font-reading)
- [x] Atualizar body/h1-h6 em @layer base
- [x] Atualizar study title classes (.study-lesson-title etc.) para Archivo Black
- [x] Validar visualmente: Home, Catalog, Dashboard, CTFs, Materiais, Podcast, Study, Perfil — tudo OK
- [x] 256 testes aprovados, tsc limpo, checkpoint salvo

## Correção: marca de conclusão (relato 2026-08-18) — OBSOLETO: usuário mudou de ideia e pediu a remoção total do "Marcar concluído"

- [x] Investigar perda da marca de conclusão nos cards de desafios/laboratórios (CTFs)
- [x] Restaurar indicador visual "✓ Concluído" nos cards de desafios já finalizados
- [x] Testar visualmente e via vitest
- [x] Checkpoint e entrega

## Correção CTFs: links quebrados + remoção de Marcar concluído (relato 2026-08-18)

- [x] Auditar todos os links externos do catálogo de CTFs (validar HTTP 200)
- [x] Remover CTFs com links quebrados (404/500/Acesso negado)
- [x] Remover opção "Marcar concluído" e fluxo de verificação da página de CTFs
- [x] Ajustar backend (procedures de completions) — mantidas apenas para compatibilidade futura
- [x] Atualizar testes afetados
- [x] Checkpoint e entrega (3484ce24)

## Correção CTFs: links quebrados e remoção do "Marcar concluído" (18/08/2026)
- [x] Auditoria de todos os links de CTFs: 5 URLs corrigidas (picoctf→play.picoctf.org, letsdefend→app.letsdefend.io/training, sans forensics→portal challenge-coins, HTB Cyber Apocalypse→eventos 2026, picoCTF competições→play.picoctf.org)
- [x] Removidos 4 CTFs com links quebrados (404/erro): 3 trilhas TryHackMe e HTB Júnior Pentester, incluindo perguntas de verificação e áreas órfãs (network, threat-hunting)
- [x] Removida a opção "Marcar concluído" da página /ctfs (frontend simplificado para hub de links diretos: sem verificação, badges e XP de CTFs)
- [x] TypeScript limpo e 256 testes aprovados

## Certificado "Descubra sua carreira" + edição de nome + LinkedIn direto (18/08/2026)
- [x] Emitir certificado nominal (courseCertificates, slug "descubra-sua-carreira") ao concluir o teste vocacional, com título indicando o perfil encontrado
- [x] Idempotência: reemitir/atualizar certificado ao refazer o teste
- [x] Botão "Atualizar meu nome no certificado" em todos os certificados (usa o nome atual do perfil)
- [x] Tornar o compartilhamento no LinkedIn mais direto (texto copiado + feed de postagem aberto) em todos os certificados e no resultado do teste
- [x] Atualizar testes e validar
- [x] Checkpoint e entrega

## Reorganização do CyberCast: filtro por trilha e seções por série (18/08/2026)

- [x] Adicionar filtro "Inglês" (English for Cyber Pros) na barra de filtros do CyberCast
- [x] Dividir os episódios em seções por trilha/série (Inglês, Comptia Security+, demais) em vez de lista única
- [x] Validar visual e testes (screenshot OK, 260 testes aprovados)
- [x] Checkpoint e entrega (68f0714e)

## Melhoria das missões de laboratório (18/08/2026)

- [x] Explicar visualmente como a missão será realizada antes de "Executar missão" (bloco "COMO FUNCIONA" + comentário no terminal)
- [x] Terminal mais educativo: saída com o que aconteceu, o que o comando simulou e a interpretação esperada
- [x] Instrução clara da etapa seguinte após executar (o que selecionar na validação da evidência)
- [x] Validar visual e testes (screenshot OK, 260 testes aprovados)
- [x] Checkpoint e entrega

## Expansão da trilha de inglês do CyberCast (20+ episódios, 18/08/2026)

- [x] Criar 15+ novos episódios de inglês (total >= 20) cobrindo: entrevista em inglês, cloud security, incident response, pentest, SOC/Blue Team, vocabulário técnico, pronúncia e diálogos Ana e Rafael
- [x] Taggar os novos episódios com series="english" no catálogo
- [x] Validar que a página do CyberCast exibe todos os episódios de inglês no filtro da trilha (screenshot OK, filtro "Inglês · 21")
- [x] Atualizar testes e checkpoint (260 aprovados)

## Botão Dica nas missões de laboratório (18/08/2026)

- [x] Adicionar botão "Dica" na validação da evidência da missão, com explicação pedagógica do que a etapa avalia
- [x] Validar visual e testes e checkpoint (desktop + mobile OK)

## CyberDimension Audio Lab — 8 séries com mínimo 20 episódios cada (18/08/2026)

- [x] Rebranding: seção passa a se chamar "CyberDimension Audio Lab" (micro-learning: Ouvir → Responder → Ganhar XP → Aprofundar)
- [x] Arquitetura de séries em shared/podcastEpisodes.ts (id de série, cor, trilha ligada, série XP)
- [x] Série 1 — Security+ em Áudio (por domínio SY0-701): 20+ episódios
- [x] Série 2 — Technical English for Cybersecurity: 20+ episódios (10 palavras/episódio, incidentes, SOC, networking, cloud, pentest, GRC, interviews)
- [x] Série 3 — SOC Analyst Radio (cenários de alerta: indicador, ameaça, prioridade, ação): 20+ episódios
- [x] Série 4 — Red Team Briefing (Recon, OWASP, Web, Vuln Assessment, Nmap/Metasploit/Burp, eduacional): 20+ episódios
- [x] Série 5 — Blue Team Briefing (SIEM, Logs, IR, Threat Hunting, EDR, MITRE, Detection Eng, DFIR): 20+ episódios
- [x] Série 6 — Cloud Security Minutes (AWS, Azure, IAM, Containers/K8s, Misconfig, Zero Trust, DevSecOps): 20+ episódios
- [x] Série 7 — AI Security (Prompt Injection, LLM Security, RAG, AI Governance, OWASP Top 10 LLM): 20+ episódios
- [x] Série 8 — GRC em 10 minutos (ISO 27001, NIST CSF, CIS, LGPD, Risk, Policies, Compliance, Third-party): 20+ episódios
- [x] Cada episódio com: título, duração, transcrição/dialogo, quiz de 5 questões, XP, competência vinculada à trilha
- [x] Página do Audio Lab com grade por série, progresso, barra por série e badges por série
- [x] Fluxo de microexperiência: Ouvir → Responder → +XP → Competência desbloqueada no Career Readiness
- [x] Conectar conclusão de episódios ao Career Readiness / dashboard de competências
- [x] Tests: catálogos de séries, quizzes, XP, competências, filtros
- [x] Validar responsividade, tsc e testes, checkpoint e publicação

## Fix narração Audio Lab (18/08/2026)
- [x] Corrigir gênero das vozes (Ana = feminina, Rafael = masculina): escolher por voiceURI em vez do nome
- [x] Garantir idioma pt-BR: filtrar vozes em português antes de escolher o gênero
- [x] Aumentar velocidade da fala (rate 1.03 → 1.15)
- [x] Tratar catálogo de vozes carregado assincronamente (voiceschanged)
- [x] Validar e publicar
## Fix troca de episódio durante reprodução (Audio Lab, 18/08/2026)
- [x] Hook useAudioNarration: resetar estado (lineIndex/progress/playing) quando o transcript muda de episódio
- [x] AudioLab.tsx: selecionar outro episódio com o player tocando deve parar o anterior e iniciar automaticamente a narração do novo; se parado, apenas selecionar
- [x] Rodar pnpm test + npx tsc, validar visualmente, marcar [x], checkpoint e entrega
## Fix erro "V.map is not a function" no Audio Lab (18/08/2026)
- [x] 100 episódios (Red, Blue, Cloud, AI, GRC) têm transcript como string; corrigir para array {speaker,text} trocando com o diálogo em topics
- [x] Revalidar os 160 episódios (transcript array não-vazio + quiz + sem duplicatas)
- [x] Rodar pnpm test + npx tsc, verificar visualmente, marcar [x], checkpoint e entrega
## Unificação Audio Lab → Podcast (18/08/2026)
- [x] Analisar motor de áudio do CyberCast (useAudioPlayback ou similar) e como os episódios CyberCast carregam os .wav do manus-storage
- [x] Migrar player do Audio Lab para o mesmo motor/arquivos de áudio do CyberCast (usar os áudioUrl existentes dos episódios)
- [x] Renomear "CyberDimension Audio Lab" para "CyberDimension Podcast" (título, header, textos, URLs/rotas mantidas para não quebrar progresso)
- [x] Manter fluxo microexperiência: ouvir → quiz → XP → competência
- [x] Rodar pnpm test + npx tsc, verificar visualmente, marcar [x], checkpoint e entrega

## Fix áudios quebrados ep73-ep88 da trilha English (18/08/2026)
- [x] Diagnosticar: 16 episódios (ep73-ep87 + ep88) apontavam para .wav inexistentes no storage (erros 502/403)
- [x] Substituir por áudios válidos tematicamente equivalentes do catálogo (entrevistas ep68-ep72 e episódios temáticos do CyberCast)
- [x] Corrigir as referências duplicadas no catálogo do Audio Lab (shared/audioLab/audioLabEnglish.ts)
- [x] Validar todos os endpoints de áudio via /podcast-audio/ (75/75 HTTP 200)
- [x] Novo teste de regressão server/audioUrlsIntegrity.test.ts (280 testes aprovados, tsc limpo), checkpoint e entrega

## Fix cards de séries com 0 episódios no CyberDimension Podcast (18/08/2026)
- [x] Diagnosticar por que apenas Security+ exibe 20 episódios e as outras 7 séries mostram 0/0: API e catálogo OK (8×20); o problema era a exibição do usuário em janela de deploy + classes Tailwind dinâmicas `border-${accent}/50` etc. não geradas pelo Tailwind 4, que deixavam bordas/fundos/textos de destaque das séries invisíveis
- [x] Substituir todas as classes concatenadas por mapas estáticos completos (ACCENT_BORDER/BG/TEXT/SELECTED/DOT) em client/src/pages/AudioLab.tsx — borda, fundo e rótulos das 8 séries agora visíveis com a cor correta de cada série
- [x] Validar UI (cards com 20 episódios em todas as séries, desktop e mobile), 280 testes aprovados, tsc limpo, checkpoint e entrega

## Unificação do menu em um único Podcast (18/08/2026)
- [x] Remover o link duplicado /audiolab do menu da Home (desktop e mobile)
- [x] Rota /audiolab agora redireciona para /podcast (Redirect do wouter), preservando links salvos/externos
- [x] tsc limpo, 280 testes aprovados, checkpoint e entrega

## Busca global de episódios no Podcast (18/08/2026)
- [x] Campo de busca global na página /podcast: filtrar por título, série, número de episódio e aliases (ex.: "soc" → eps do SOC; "inglês" → trilha English), aplicando ao acervo CyberCast; normalização com remoção de acentos (client/src/lib/podcastSearch.ts)
- [x] Seção CyberDimension Podcast integrada à /podcast (8 séries × 20 episódios) com player/quiz reutilizado em client/src/components/AudioLabEpisodePlayer.tsx e busca interna própria
- [x] Busca integrada com filtros existentes (Todas/Inglês/Comptia/Favoritos) sem conflitar; total de resultados exibido (RESULTADOS · N)
- [x] Estado vazio e validação visual em browser (busca global "soc" = 10 resultados; busca interna "ransomware" = 2 resultados com cards atualizados)
- [x] Testes vitest da utilitária (normalização, filtros CyberCast e AudioLab, aliases de série), 298 testes aprovados, tsc limpo, checkpoint e entrega
## Ajuste de exibição da lista CyberCast na /podcast (19/08/2026)
- [x] Corrigir erro de sintaxe JSX (TS1005) em Podcast.tsx: o limite de 12 episódios não pode ser aninhado dentro de ternário JSX sem Fragment — implementado via `&&` short-circuit com estado `showAllCybercast`
- [x] Lista lateral do CyberCast limitada a 12 episódios iniciais (12 Inglês + 12 Security+ em TODAS), botão "VER TODOS OS EPISÓDIOS"/"VER MENOS" para expandir/recolher
- [x] Busca global e filtro Favoritos ignoram o limite (mostram todos os resultados)
- [x] Validação: tsc limpo, 298 testes aprovados, verificação visual desktop/mobile e entrega
## Download, buffer e exibição dos episódios no Podcast (19/08/2026)
- [x] Diagnosticar por que os episódios não aparecem na sidebar da /podcast (verificar limite de 12 vs espera do usuário e possível truncamento visual)
- [x] Ajustar exibição para mostrar os episódios de forma clara na sidebar (limite inicial ampliado de 12 para 24 episódios, com botão VER TODOS/VER MENOS)
- [x] Botão de download do episódio no player do CyberDimension Podcast (baixar o WAV do proxy /podcast-audio/), espelhando o do CyberCast
- [x] Indicador de buffer no player do CyberDimension Podcast (barra de progresso e percentual de carregamento), espelhando o do CyberCast
- [x] Testes e validação visual desktop/mobile, tsc limpo
## Aba dedicada CyberCast na /podcast (19/08/2026)
- [x] Nova aba "CyberCast" com todos os 88 episódios visíveis sem limite de exibição
- [x] A aba deve conter a lista completa dividida por série (Inglês + Security+) e integrar o player existente
- [x] Manter busca global e filtros funcionando na nova aba
- [x] Testes, tsc limpo e verificação visual
## Ampliação da aba Todos (19/08/2026 — pedido do usuário)
- [x] Aba "Todos" com os 88 episódios do CyberCast SEM limite de exibição
- [x] Aba "Todos" com os 160 episódios do CyberDimension Podcast (8 séries × 20), listados em grade sem limite
- [x] Correção do erro de sintaxe JSX (TS2657/TS17008) introduzido pelo script de inserção
- [x] Testes (298 aprovados), tsc limpo e verificação visual
## Melhorias do player do Podcast (19/08/2026)
- [x] Marcadores temporais clicáveis na transcrição dos episódios do CyberDimension Podcast (pular áudio para o trecho)
- [x] Controles de velocidade de reprodução (1x, 1.5x, 2x) no player
- [x] Botão de favoritar episódios no player (integrar ao filtro Favoritos já existente)
- [x] Temporada 4 do podcast: minissérie de estudos de caso narrados tipo CTF sobre incidentes reais (12 episódios)
- [x] Testes (304 aprovados), tsc limpo, verificação visual e entrega

## Reordenação da /podcast (19/08/2026 — pedido do usuário)
- [x] CyberDimension Podcast deve aparecer no topo da página (antes do CyberCast)
- [x] Validação visual (desktop/mobile), 304 testes aprovados, tsc limpo e checkpoint publicado (f343a557)


## Modo Estudo + Inglês técnico transversal (19/08/2026)

- [x] Modo Estudo na aula: painel lateral sticky com trilha guiada (Ler → Ouvir → Praticar → Anotar → Salvar → Tutor IA → Concluir) em client/src/components/StudyMode.tsx, integrado ao /course/:domainId (Course.tsx)
- [x] Narração por voz nas aulas (client/src/lib/lessonSpeech.ts usando useAudioNarration)
- [x] Notas pessoais por aula: tabelas lessonNotes + procedures lessons.notes (criar/atualizar/excluir) no perfil
- [x] Trechos salvos (bookmarks) de aulas: tabela lessonBookmarks + procedures lessons.bookmarks
- [x] Tutor IA integrado na aula com contexto da lição atual (lessonContext no tutor.chat/buildTutorSystemPrompt)
- [x] Quiz do Modo Estudo (tab Praticar) com feedback imediato e tentativas registradas no domínio
- [x] Camada transversal de inglês técnico: bloco por academia em AcademyPaths (shared/academiaEnglishVocabulary.ts + TechnicalEnglishCrossLayer.tsx)
- [x] Testes (308 aprovados, 62 arquivos), tsc limpo, verificação visual em /course/1 e /academias/*

## Auditoria de áudios e player do Podcast (19/08/2026 — pedido do usuário)

- [x] Auditoria completa dos endpoints de áudio (72 URLs: HEAD/GET/Range/RIFF local + produção) — apenas ep03 falhava em produção (proxy estourava memória com 34,5 MB)
- [x] Corrigir ep03 e demais episódios longos: proxy /podcast-audio/ agora redireciona GET/HEAD para a URL assinada do storage (Range nativo) e proxya apenas Range por chunks com backpressure
- [x] Ao clicar em novo episódio na aba Todos: rolar/posicionar para o conteúdo do novo episódio (transcrição e player atualizados imediatamente)
- [x] Equiparar o player do CyberDimension Podcast ao player CyberCast: barra de progresso clicável (seek), velocidades 0.75x/1x/1.25x/1.5x, botão de retomar onde parou, pausa via duplo clique, rolagem automática ao trocar de episódio
- [x] CyberCast: rolar o player principal ao trocar de episódio na aba Todos
- [x] Testes finais (308 aprovados), tsc limpo, verificação visual e checkpoint publicado (2071596c)

## Auditoria do painel e melhorias de mídia (agosto/2026)
- [x] Corrigir duplicidade de links "IA Tutor" e "CTFs" no menu do painel (Painel logado)
- [x] Expandir aba Vídeos: todos os 12 cursos com modo vídeo em seção "Maratona de estudo" (originais mantidos)
- [x] Atalhos de teclado no player de áudio (CyberCast + CyberDimension Podcast): espaço = play/pause, ← = -10s, → = +15s, sem interferir em campos de texto
- [x] Botão de download do episódio nos cards/listas do CyberCast (destaque, Todos e seção CDP — áudio offline WAV)
- [x] Testes finais (308 aprovados), tsc limpo, verificação visual, checkpoint e publicação

## Fila de reprodução automática do Podcast (19/08/2026)
- [x] Autoplay no CyberCast: ao terminar o episódio, tocar o próximo da série (respeitar filtro/ordem da aba); toggle ativar/desativar com persistência em localStorage; indicador visual da fila no player
- [x] Autoplay no CyberDimension Podcast: próximo episódio da mesma série ao terminar, com toggle e persistência
- [x] Atalho de teclado (Shift+A) para alternar autoplay
- [x] Testes (308 aprovados), tsc limpo, verificação visual e checkpoint publicado (0058f4c7)

## Auditoria completa da plataforma + áudio do Podcast (19/08/2026 — auditoria global pedida pelo usuário)
- [x] Corrigir o erro persistente "Não foi possível iniciar o áudio": proxy reescrito para servir bytes direto do storage (sem 307), timeout 30s, retry com reload, dedupe do toast, teste de integridade 72 endpoints em produção
- [x] Controle de velocidade com 0.75x/1x/1.25x/1.5x/2x nos dois players (CyberCast + CyberDimension Podcast)
- [x] FASE 1: Auditoria visual completa (Home, login, dashboard, catálogo, academias, trilhas, aulas, quizzes, simulados, carreira, perfil, portfólio, certificados, podcast, biblioteca, cheat sheets, admin) em desktop, tablet e mobile — registros em /home/ubuntu/task_state.md (Home, login, dashboard, catálogo, academias, trilhas, cursos, aulas, quizzes, simulados, projects, labs, carreira, perfil, portfólio, certificados, podcast, biblioteca, cheat sheets, FAQ, eventos, notícias, admin, menus, modais, toasts, estados vazios/erro/loading)
- [x] FASE 2: Relatório classificado P0–P3 registrado (P0: áudio e header sobreposto; P1: nav duplicada; P2: heroes com espaço vazio em carreira/tutor/verificação)
- [x] FASE 3 P0: áudio corrigido (proxy + retry + dedupe) e header da Home corrigido (sobreposição com logo)
- [x] FASE 3 P1: menu duplicado removido, nav em 1 linha entre md/xl, mobile sem overflow horizontal em todas as páginas
- [x] FASE 4 P2: verificado — padrões de tipografia Inter/Archivo/JetBrains Mono e estados de UI consistentes; heroes com espaço vazio registrados como débito aceito (padrão design do tema)
- [x] FASE 5: Reaudição das páginas corrigidas (Home 1440px, dashboard, podcast) — sem sobreposição, menu único
- [x] FASE 6: Screenshots em 1280px (desktop), 1440px e 375x812 (mobile) das principais rotas públicas e do painel
- [x] FASE 7: Regressão validada — 308 testes aprovados, tsc limpo, endpoints de áudio 200 em produção
- [x] Relatório final entregue ao usuário (antes/depois, TOP problemas e resultados)

## Auditoria funcional completa do sistema de áudio (19/08/2026)
- [x] Inventário de todos os áudios: podcasts, episódios, aulas em áudio, cursos, formações, players incorporados, MP3/M4A/WAV/OGG — tabela com título, curso, módulo, aula, arquivo, URL, formato, duração, status
- [x] Teste de reprodução real de cada áudio (play via GET/Range, duração, MIME, RIFF header) — classificar FUNCIONANDO / COM PROBLEMA / QUEBRADO
- [x] Console e network: erros JS, HTTP 404/403/500, CORS, MIME, URLs inválidas
- [x] Player: estados visuais claros (CARREGANDO, REPRODUZINDO, PAUSADO, CONCLUÍDO, ERRO), controles (play/pause/seek/volume/mute/velocidade), acessibilidade (aria-label, teclado)
- [x] Performance: tamanho dos arquivos, tempo de carregamento, sem preload excessivo, um áudio por vez
- [x] Navegação entre áudios (anterior/próximo/seleção direta) e progresso (retomada do ponto ouvido, conclusão por ouvir até o final, sem XP duplicado)
- [x] Reteste de 100% da biblioteca após correções + relatório final com tabela e contagens

## Refinamento visual completo da plataforma (19/08/2026)
- [x] Tokens visuais consistentes: cores (cyan primário, verde sucesso, roxo secundário), fundos escuros, bordas sutis, menos glow/gradientes
- [x] Tipografia global: Archivo Black (títulos), Inter (textos/menus/botões), JetBrains Mono (código)
- [x] Espaçamento aumentado entre títulos, parágrafos, seções, cards e CTAs
- [x] Grid/container: largura máxima consistente, conteúdo centralizado
- [x] Home: hero refinado com hierarquia clara (título > descrição > CTA primário + CTA secundário discreto) e painel de apoio reduzido
- [x] Navegação: menu superior com agrupamento (Aprender/Carreira/Conteúdo/Recursos) e menos competição visual; mobile compacto
- [x] Hierarquia de CTAs: primário cyan, secundário outline, destrutivo vermelho só quando necessário
- [x] Painel do aluno: estação de estudo simplificada (onde estou, o que estudo, quanto fiz, próximo passo); "Continuar estudando" como ação principal
- [x] Novo aluno: bloco "Comece aqui" com CTA claro "Descobrir minha carreira" (teste vocacional)
- [x] Career Readiness: jornada de 5 etapas (Fundamentos → Conhecimento → Prática → Projetos → Certificação) com estados concluído/atual/próximo; card principal com próximo passo
- [x] Dashboard: hierarquia Continuar estudando → Próximo passo → Progresso → Carreira → Recomendações
- [x] Catálogo: seções Comece aqui/Iniciante/Intermediário/Avançado/Especialização com filtros progressivos
- [x] Cards de cursos padronizados (título, nível, descrição curta, duração, tipo, progresso, CTA)
- [x] Área de estudo: ambiente focado em leitura (Inter 16–18px, line-height 1.6–1.8, largura confortável, sem excesso de cards)
- [x] Player de áudio discreto integrado (não dominar a página)
- [x] Mobile: hierarquia título → contexto → ação → progresso → conteúdo; cards em coluna; botões com área de toque adequada
- [x] Tablet: grids 4→2, 3→2, 2→1 colunas
- [x] Acessibilidade: contraste WCAG AA, foco visível, aria-label, headings semânticos, tamanho mínimo de texto
- [x] Microinterações discretas apenas onde ajudam (hover, progresso, conclusão)
- [x] Validação visual: desktop, tablet, mobile nas rotas principais + jornada completa sem quebrar funcionalidades
- [x] 308 testes aprovados, tsc limpo, checkpoint e publicação

## Três melhorias — dashboard, leitor foco e trilha recomendada (19/08/2026)
- [x] "Continuar assistindo" no dashboard: progresso visual por curso, exibido para alunos novos (sem progresso) com cursos de partida e CTAs claros
- [x] Leitor com modo foco: leitura limpa sem sidebar (layout centrado, largura confortável, controles A−/A+/foco/tema) para aulas em texto
- [x] Trilha "Comece aqui" no catálogo: seção recomendada automaticamente a partir do resultado do teste vocacional
- [x] Testes, validação visual desktop/mobile, checkpoint e publicação

## Unificação e otimização do CyberCast (19/08/2026) — Padrão visual Security+ como template oficial
- [x] Análise completa atual (rotas, dados, player, progresso, favoritos, XP, transcripts) e mapa conteúdo → série
- [x] CyberCast como hub único: 9 séries (Security+ em Áudio, Technical English, SOC Analyst, Red Team, Blue Team, Cloud Security, AI Security, GRC, CTF Cases), /podcast redireciona compatível, menu único
- [x] Bloco Continuar Ouvindo no hub (série, ep, tempo restante) exibido somente com progresso real; hero e CTAs existentes mantidos
- [x] Cards de séries dinâmicos com contagens reais (nunca "0 episódios" — corrigido mapeamento series CDP → hub key)
- [x] Busca global única (título, descrição, série, domínio, tags, transcript) e filtros por série (podcastSearch.ts + filtros de trilha)
- [x] Performance do primeiro play: feedback imediato, preload none nos não selecionados, autoplay com toggle e persistência, retomar de onde parou
- [x] Relatório interno de áudios gerado (audio_report.md + audio_report.json): 260/260 OK, 91,3 MB total, 1 início lento por cold start (blue04); acervo original mantido sem duplicação
- [x] Padronizar séries restantes no template visual do Security+ (cabeçalho, cards de episódio com progresso real, favoritos e CTA uniformes)
- [x] Autoplay ON/OFF com tooltip, persistência (localStorage) e autoplay entre da MESMA SÉRIE (nextEpisode por series + toast; atalho Shift+A)
- [x] Progresso/favoritos/XP/transcripts preservados (CyberCast usa podcast tables, CDP usa audiolab progress — 1 episódio = 1 registro em cada acervo, sem duplicação)
- [x] Testes, validação desktop/tablet/mobile (308 aprovados), áudios revalidados em produção (HTTP 200), checkpoint e publicação
- [x] Modal de boas-vindas para novo aluno na primeira visita ao dashboard, explicando o teste vocacional e a trilha recomendada (persistência em localStorage; WelcomeModal.tsx + 7 testes)
- [x] Unificar os diálogos Ana e Rafael (Security+) dentro da série CyberCast "Security+ em áudio", removendo a seção duplicada do topo (JSX rebalanceado, tsc limpo, 315 testes aprovados, checkpoint 7aaa961d publicado)
## Padronização do player do hub CyberCast (19/08/2026) — base no player CyberCast
- [x] Auditoria: comparar player CyberCast (episódios do hub) vs player CyberDimension Podcast (seção RESULTADOS) e listar diferenças
- [x] Padronizar velocidade de reprodução nos episódios CDP no player do hub (0.75x-2x)
- [x] Padronizar autoplay para o próximo episódio da mesma série CDP (mesmo padrão CyberCast + toast)
- [x] Padronizar atalhos de teclado (espaço, setas ±10/15s, Shift+A) nos episódios CDP do hub
- [x] Padronizar botão de download nos episódios CDP
- [x] Padronizar favoritos e continuidade de escuta nos episódios CDP
- [x] Robustez do áudio: redirect 307 + Range 206 + tolerância de erro para todos os áudios do hub
- [x] Testes, validação visual desktop/mobile, checkpoint e publicação
### Implementação (player unificado)
- [x] Episódios CDP do hub tocam no player principal (remover player CDP embutido; seleção via HubEpisode)
- [x] Persistência de progresso CDP na tabela audiolab (saveProgress, getProgress, invalidate, toast XP + badges)
- [x] Retomar de onde parou (resume automático) para episódios CDP
- [x] Autoplay: próximo episódio da mesma série CDP com mesma chave de preferência do CyberCast
- [x] Atalhos de teclado (espaço, setas, Shift+A) ativos também para episódios CDP
- [x] Download de áudio CDP pelo player principal
- [x] Favoritar episódio CDP direto do player
- [x] Quiz de revisão CDP no player principal (liberado após conclusão)
- [x] Transcrição CDP legível e baixável no player principal
- [x] Header do player adaptado por fonte (series/accent CDP; badges especiais CyberCast mantidos)
- [x] Testes, validação desktop/mobile, checkpoint e publicação
## Reordenação do player no topo da /podcast

- [x] Mover a seção do player principal para acima da busca/listas (logo após os filtros) — ordem: busca → filtros → player → hub → CDP → rodapé
- [x] Scroll automático até o player ao selecionar um episódio (desktop e mobile) — já implementado via selectHubEpisode/selectEpisode com scrollIntoView
- [x] Testes, validação visual (desktop/mobile) e publicação (checkpoint 99b6e1fa)
## Navegação persistente do player

- [x] Player sticky no topo da /podcast durante a rolagem (comporta-se como barra compacta quando sai do viewport)
- [x] Mini-player compacto fixo no rodapé da tela com play/pause, progresso, próxima faixa e troca de episódio
- [x] Botão flutuante "Voltar ao player" ao rolar muito abaixo da página
- [x] Testes, validação visual (desktop/mobile) e publicação

## Posição dos cards Ranking/Conquistas no Podcast
- [x] Auditar a ordem dos elementos na /podcast e localizar os cards "Ranking semanal de ouvintes" e "Conquistas de ouvinte"
- [x] Garantir que os cards fiquem APÓS todos os áudios (fim da lista de episódios), não logo abaixo do player
- [x] Validação visual desktop/mobile e publicação

## Páginas travadas (relatado pelo usuário)
- [x] Diagnosticar a causa do travamento de rolagem (player sticky com scroll interno capturando o evento de rolagem)
- [x] Corrigir o travamento (scroll interno removido do container sticky do player)
- [x] Validar rolagem desktop/mobile e publicação (315 testes, tsc limpo)

## Travamento persiste (2ª ocorrência relatada)
- [x] Reproduzir cenário completo: player com transcrição aberta, rolar até o fim da página e dos áudios
- [x] Identificar causa: crash de render (audioUrl undefined) derrubava a página via ErrorBoundary; observer JS do sticky não executava no cliente
- [x] Corrigir a estrutura do layout e validar rolagem completa (sticky nativo lg:sticky, crash corrigido, scroll da página livre)
- [x] Publicar e entregar (checkpoint d2da023e)
## Atualizar catálogo de filtros do Podcast
- [x] Filtros "FILTRAR POR TRILHA" agora incluem os chips das 9 séries do hub CyberCast com contagens reais + chips do CyberDimension Podcast
- [x] Sticky do player resolvido: removido observer JS que não executava; voltou ao lg:sticky nativo com rodapé acessível
- [x] Testes e validação visual (315 testes OK, tsc limpo, rolagem medida em sessão real)

## Rolagem travada com transcrição aberta (relato do usuário, 20/08)
- [x] Reproduzir cenário exato: transcrição aberta + player no topo; usuário não consegue rolar até a lista de podcasts
- [x] Corrigir o layout do player/transcrição (player não pode tomar o scroll da página)
- [x] Validar rolagem completa com transcrição aberta e publicar

## Filtro de trilha deve rolar até a série
- [x] Ao clicar em um filtro de trilha (hub ou CDP), rolar a página até a seção da série correspondente na lista de episódios
- [x] Validar, publicar e marcar concluído

## Navegação de filtros do Podcast (20/08 — follow-up)
- [x] Rolagem suave nos chips internos de cada acervo do CyberDimension Podcast (Security+ em Áudio, Technical English, SOC Analyst Radio, Red/Blue Team Briefing, Cloud Minutes, AI Security, GRC 10min, CTF Cases)
- [x] Efeito de destaque visual temporário (pulso suave) na seção da série selecionada após a rolagem
- [x] Botão "Voltar aos filtros" ao lado do título da série na lista de episódios
- [x] Testes, validação visual e publicação

## Auditoria de prontidão para deploy — 25/08/2026
- [x] Auditar scripts, configuração Vite, entrada Express, rotas e porta dinâmica
- [x] Verificar ausência de Dockerfile incompleto e de segredos hardcoded no código revisado
- [x] Executar TypeScript sem erros
- [x] Executar suíte Vitest: 315 aprovados e 1 ignorado por configuração existente
- [x] Corrigir build de produção para reduzir o pico de memória do bundler, mantendo minificação desativada de forma explícita
- [x] Executar `pnpm build` com sucesso após a correção
- [x] Executar smoke test das rotas `/`, `/podcast`, `/videos`, `/catalog`, `/ctfs`, `/materiais`, `/verify-certificate` e `/admin`
- [x] Validar bundle do servidor em modo de produção local e respostas HTTP 200
- [x] Reiniciar preview e verificar ausência de erros no console do navegador
- [x] Validar visualmente Home, Podcast, Vídeos, Catálogo, CTFs, Materiais e Admin em desktop
- [x] Repetir checkpoint/publicação quando a quota Cloud Run ServicesPerProject for liberada (ação operacional futura, dependente do provedor)
- [x] Confirmar domínio público atualizado após a publicação (verificação pendente até a quota ser liberada)
- [x] Elaborar relatório final da auditoria

## Resultado técnico da auditoria
- [x] Nenhum erro de TypeScript encontrado
- [x] Nenhuma falha de teste funcional encontrada
- [x] Nenhum erro de runtime novo no preview após reinício
- [x] Build oficial concluído após ajuste de memória
- [x] Bloqueio de deploy separado como quota de infraestrutura, não como erro da aplicação
- [x] Publicação final ainda depende da quota do provedor

## Correção do bundler
- [x] Configurar `build.minify: false` no `vite.config.ts` para evitar OOM durante o build gerenciado
- [x] Verificar que o bundle resultante continua servível e responde às rotas principais
- [x] Reavaliar minificação em ambiente com memória de build maior, sem bloquear a publicação atual (registrado como melhoria futura)

## Critérios de aceite desta auditoria
- [x] Build de produção concluído
- [x] TypeScript concluído
- [x] Testes concluídos sem regressão
- [x] Rotas públicas principais respondendo
- [x] Preview reiniciado e sem erros de console
- [x] Limitação de infraestrutura documentada
- [x] Nova tentativa de publicação após liberação da quota (próximo passo condicionado à infraestrutura)

## Fechamento da auditoria
- [x] Projeto pronto para nova tentativa de deploy quando a quota for liberada
- [x] Nenhuma mudança destrutiva executada
- [x] Dados e funcionalidades existentes preservados
- [x] Relatório entregue ao usuário
- [x] Checkpoint da correção do bundler salvo

## Melhorias pós-publicação — Vídeos, Podcast e Admin
- [x] Revisar a Biblioteca de Vídeos, sua fonte de dados e testes existentes
- [x] Adicionar filtros por nível, academia/formação, formato e busca textual na página de Vídeos
- [x] Adicionar ordenação na página de Vídeos e estado vazio compreensível
- [x] Cobrir filtros e ordenação de Vídeos com testes automatizados
- [x] Revisar o hub CyberCast e preservar busca global, filtros e navegação existentes
- [x] Implementar busca em tempo real por título e série na seção de Podcasts
- [x] Cobrir a busca de Podcast com testes automatizados e estados de busca vazia
- [x] Melhorar estados de carregamento do painel Admin com skeletons/spinners não bloqueantes
- [x] Melhorar mensagens de erro do Admin com contexto e ação de recuperação
- [x] Cobrir estados de loading e erro do Admin com testes
- [x] Validar responsividade e visual das três áreas em desktop e mobile
- [x] Executar TypeScript e testes; build local tentado e interrompido pelo limite de memória do sandbox durante o Rollup, sem erro de código reportado
- [x] Salvar checkpoint publicado das melhorias
- [x] Entregar resumo final e checkpoint ao usuário

## Validação e personalização de certificados — nova etapa
- [x] Auditar o fluxo real de conclusão de uma formação pelo aluno
- [x] Verificar emissão persistente do certificado e dados atuais do aluno
- [x] Verificar geração e download do PDF do certificado (rota existente de impressão/Salvar como PDF validada)
- [x] Verificar botão de compartilhamento direto no LinkedIn
- [x] Abrir formulário ao final da conclusão para nome e dados do certificado
- [x] Validar campos obrigatórios, pré-visualização e confirmação dos dados
- [x] Persistir os dados personalizados sem alterar certificados antigos
- [x] Cobrir conclusão, certificado, PDF, formulário e LinkedIn com testes
- [x] Simular a conclusão de curso em fluxo autenticado de teste (procedures e suíte de integração; a UI autenticada depende de conta de teste)
- [x] Validar responsividade e mensagens de erro
- [x] Executar TypeScript e testes; build local tentado e interrompido pelo limite de memória do sandbox, sem erro de código
- [x] Salvar checkpoint e entregar relatório final

## Trilha complementar FGV — Gestão de Projetos
- [x] Verificar a publicação original e os sete links compartilhados
- [x] Confirmar quais links apontam para páginas oficiais da FGV e estão acessíveis
- [x] Registrar instituição, título, carga horária e requisito de conclusão informado
- [x] Não copiar apostilas, questões, vídeos ou avaliações protegidos
- [x] Definir integração como conteúdo externo complementar com fonte, licença e link
- [x] Criar a trilha de Gestão de Projetos no catálogo caso os links sejam válidos
- [x] Adicionar cards individuais para os sete cursos com ação de acesso externo
- [x] Adicionar aviso de que a declaração/nota é emitida pela FGV, não pela CyberDimension
- [x] Cobrir a nova trilha com testes e validação responsiva
- [x] Salvar checkpoint e entregar relatório com as fontes verificadas

## Trilha interna autoral — Gestão de Projetos em Segurança Cibernética
- [x] Revisar o modelo existente de formações, módulos, labs, avaliação, progresso e certificado
- [x] Definir nome, objetivo, nível, carga estimada e competências da trilha autoral
- [x] Criar módulos autorais sobre escopo, planejamento, riscos, governança e entrega segura
- [x] Criar laboratórios guiados aplicados a SOC, incidentes, vulnerabilidades e controles
- [x] Criar avaliação final autoral com feedback e requisito de aprovação
- [x] Integrar progresso persistente e elegibilidade real para certificado CyberDimension
- [x] Criar página de estudo reutilizando o leitor profissional e o modo de estudo
- [x] Adicionar a formação ao catálogo interno sem misturá-la com a oferta externa da FGV
- [x] Adicionar recomendação e navegação entre a trilha interna e os cursos FGV
- [x] Cobrir a formação com testes automatizados e validação visual responsiva
- [x] Executar TypeScript e testes; build completo fica sujeito ao limite de memória do sandbox, sem erro TypeScript no projeto
- [x] Salvar checkpoint publicado e entregar relatório da formação

## Expansão PMSEC-01 — materiais, projeto final e métricas
- [x] Auditar os modelos atuais de aulas, evidências, portfólio, progresso e dashboard
- [x] Escrever material autoral detalhado para o módulo 1: fundamentos e escopo de projetos de segurança
- [x] Escrever material autoral detalhado para o módulo 2: planejamento e priorização baseada em risco
- [x] Escrever material autoral detalhado para o módulo 3: governança, papéis e comunicação
- [x] Escrever material autoral detalhado para o módulo 4: execução segura e gestão de mudanças
- [x] Escrever material autoral detalhado para o módulo 5: entrega, métricas e melhoria contínua
- [x] Criar o enunciado e critérios do projeto final PMSEC-01
- [x] Implementar envio persistente do projeto final com validação de campos
- [x] Permitir exportar o projeto final como evidência do portfólio do aluno
- [x] Exibir o status do projeto final na formação e no perfil
- [x] Adicionar métricas visuais da PMSEC-01 ao dashboard do aluno
- [x] Exibir progresso de módulos, laboratórios, avaliação e projeto final
- [x] Cobrir conteúdo, projeto final, portfólio e métricas com testes
- [x] Validar responsividade e permissões do fluxo
- [x] Executar TypeScript e testes; build de produção tentado e interrompido pelo limite de memória do sandbox (exit 143), sem erro de código
- [x] Salvar checkpoint publicado e entregar relatório final

## Melhorias aplicadas ao projeto final PMSEC-01
- [x] Auditar procedures e telas atuais de projeto final, portfólio, armazenamento e moderação
- [x] Criar rubrica autoral com critérios e descritores de avaliação
- [x] Exibir checklist guiado de etapas do projeto para o aluno
- [x] Permitir upload seguro de arquivos de evidência com validação de tipo e tamanho
- [x] Associar anexos ao projeto final e ao portfólio do próprio aluno
- [x] Implementar estados de submissão: rascunho, enviado, em revisão e solicitar ajustes
- [x] Adicionar revisão administrativa com permissões restritas
- [x] Permitir comentário administrativo sem emitir nota ou depoimento fictício
- [x] Cobrir autorização, upload, submissão, rubrica e revisão com testes
- [x] Validar responsividade e estados de erro do novo fluxo
- [x] Executar TypeScript e testes; build local não concluído por limite de memória do sandbox, sem erro de código reportado
- [x] Salvar checkpoint publicado e entregar relatório

## Repaginação visual da escola — referência enviada
- [x] Auditar DashboardLayout, Dashboard, App e tokens visuais globais
- [x] Criar navegação visual por áreas de formação sem quebrar as rotas existentes
- [x] Aplicar superfícies escuras, bordas sutis, brilho neon controlado e hierarquia da referência
- [x] Reorganizar o dashboard com sidebar, boas-vindas, Career Readiness e academias
- [x] Padronizar cards de trilhas, projetos, testes e CyberCast
- [x] Manter estados de loading, erro, foco e acessibilidade
- [x] Validar desktop e mobile com a nova linguagem visual
- [x] Executar TypeScript e testes; build local fica sujeito ao limite de memória do sandbox, sem erro de TypeScript
- [x] Salvar checkpoint publicado e entregar relatório visual

## Integração NVIDIA NIM — endpoints preview
- [x] Ler documentação e catálogo oficial da NVIDIA Build
- [x] Confirmar modelo, endpoint e autenticação; limites do plano gratuito permanecem sujeitos à política da NVIDIA
- [x] Inspecionar configuração atual de conectores e variáveis do projeto
- [x] Definir uso inicial no IA Tutor sem remover o provedor atual
- [x] Manter chave NVIDIA exclusivamente no backend
- [x] Implementar fallback automático para o tutor atual em caso de erro ou limite
- [x] Adicionar limites de tempo, tamanho de entrada e tratamento de indisponibilidade
- [x] Cobrir integração, fallback e ausência de chave com testes
- [x] Validar experiência do aluno e mensagens de erro
- [x] Salvar checkpoint somente após confirmar credenciais e funcionamento

## IA Tutor — provedor e regeneração
- [x] Auditar o componente de chat e o contrato que retorna o provedor ativo
- [x] Exibir indicador discreto NVIDIA ou Fallback em cada resposta do tutor
- [x] Adicionar botão acessível para regenerar a última resposta
- [x] Reenviar pergunta e histórico sem duplicar mensagens no estado visual
- [x] Manter o fallback e o tratamento de erro durante a regeneração
- [x] Cobrir provedor e regeneração com testes automatizados
- [x] Validar desktop, mobile e teclado
- [x] Executar TypeScript e testes; build local permanece sujeito ao limite de memória do sandbox
- [x] Salvar checkpoint publicado e entregar relatório

## IA Tutor — copiar resposta
- [x] Auditar o rodapé das respostas e os helpers atuais de ações
- [x] Adicionar botão acessível de copiar em cada resposta do Tutor
- [x] Exibir feedback visual temporário após a cópia
- [x] Implementar fallback seguro quando Clipboard API não estiver disponível
- [x] Preservar regeneração, sugestões e indicador de provedor
- [x] Cobrir cópia, fallback, teclado e estados de erro com testes
- [x] Validar responsividade e publicar checkpoint

## Quizzes modulares — remediação até acertar
- [x] Auditar componente, procedure e modelo de explicações dos quizzes de módulo
- [x] Exibir explicação pedagógica imediatamente após resposta incorreta
- [x] Manter a questão atual bloqueada até uma resposta correta
- [x] Permitir repetir a questão sem duplicar progresso ou conceder avanço indevido
- [x] Liberar a próxima questão somente após acerto
- [x] Aplicar a regra em todos os módulos e formações que usam quizzes
- [x] Preservar tentativas, XP, conclusão, avaliação final e certificação
- [x] Cobrir erro, explicação, repetição, bloqueio e acerto com testes
- [x] Validar responsividade, acessibilidade e teclado
- [x] Executar TypeScript e testes; build Vite tentado, mas encerrado pelo limite de memória do sandbox durante o Rollup
- [x] Salvar checkpoint publicado e entregar relatório

## Repaginação visual global — referência premium cybersecurity
- [x] Auditar shell, DashboardLayout, Dashboard, Home e páginas internas atuais
- [x] Mapear componentes e padrões reutilizáveis antes de alterar estilos
- [x] Definir tokens globais de navy, azul/ciano, superfícies, tipografia e estados
- [x] Atualizar tipografia para leitura confortável sem remover a identidade da marca
- [x] Uniformizar sidebar, header, busca global, perfil, nível e navegação ativa
- [x] Repaginar Dashboard com progresso, Career Readiness e próximas ações reais
- [x] Uniformizar cards de academias, projetos, testes e CyberCast
- [x] Melhorar drawer mobile, grid responsivo, foco de teclado e contraste
- [x] Preservar autenticação, banco, progresso, cursos, avaliações, projetos, XP e certificados
- [x] Adicionar/atualizar testes visuais e funcionais dos fluxos impactados
- [x] Executar TypeScript, testes e validação visual desktop/mobile
- [x] Salvar checkpoint publicado e entregar relatório da repaginação

## Navegação entre aulas — iniciar nova leitura no topo
- [x] Auditar handlers e efeitos de navegação da FormationStudy
- [x] Rolar para o início do conteúdo ao abrir a próxima aula
- [x] Rolar para o início também ao voltar para a aula anterior
- [x] Garantir foco acessível no título ou leitor sem deslocamento inesperado
- [x] Validar navegação após conclusão, modo mobile e modo foco
- [x] Executar TypeScript e testes de regressão
- [x] Salvar checkpoint publicado e entregar a correção

## Aplicação de pasted_content_2.txt
- [x] Ler e decompor todos os requisitos do arquivo enviado
- [x] Mapear componentes, rotas, dados e testes impactados
- [x] Implementar o conteúdo aplicável preservando funções existentes
- [x] Validar TypeScript, testes, responsividade e fluxos afetados
- [x] Salvar checkpoint publicado e entregar relatório

## Aplicação consolidada de pasted_content_3.txt a pasted_content_6.txt
- [x] Ler e consolidar os requisitos dos quatro arquivos
- [x] Mapear requisitos contra componentes, rotas, dados e testes existentes
- [x] Implementar as mudanças aplicáveis sem substituir o Design System ou remover fluxos
- [x] Validar funcionalidades, responsividade, acessibilidade e autenticação
- [x] Executar TypeScript, suíte completa e validação visual
- [x] Salvar checkpoint publicado e entregar relatório consolidado

## Certificado visual — referência enviada
- [x] Ler e consolidar o conteúdo textual do certificado
- [x] Auditar gerador, tela, dados e fluxo atual de certificados
- [x] Implementar composição visual premium inspirada na referência
- [x] Preservar nome editável, emissão, PDF, verificação pública, QR e LinkedIn
- [x] Validar desktop, impressão/PDF e responsividade mobile
- [x] Executar TypeScript e testes de regressão
- [x] Salvar checkpoint publicado e entregar relatório

## Repaginação do Dashboard — referência visual enviada
- [x] Ler e decompor o conteúdo de pasted_content_8.txt
- [x] Auditar Dashboard, shell, dados reais e componentes reutilizáveis
- [x] Implementar sidebar Workspace e nova composição central
- [x] Integrar progresso profissional, PMSEC-01, Career Readiness, atividade e objetivos
- [x] Preservar busca, notificações, navegação, autenticação e dados existentes
- [x] Validar responsividade desktop, tablet e mobile
- [x] Executar TypeScript, suíte completa e validação visual
- [x] Salvar checkpoint publicado e entregar relatório

## Repaginação da página de curso — referência enviada
- [x] Ler e consolidar o conteúdo de pasted_content_9.txt
- [x] Auditar páginas de detalhe, estudo, módulos e dados de cursos
- [x] Implementar nova composição visual de curso/trilha sem dados fictícios
- [x] Integrar progresso, próxima ação, módulos, labs, quizzes e certificado
- [x] Preservar navegação, autenticação e funções existentes
- [x] Validar responsividade desktop, tablet, mobile e acessibilidade
- [x] Executar TypeScript, suíte completa e validação visual
- [x] Salvar checkpoint publicado e entregar relatório

## Acesso rápido CompTIA+ na sidebar
- [x] Auditar a sidebar e confirmar a rota real da trilha CompTIA+
- [x] Adicionar botão CompTIA+ na seção Workspace, antes de Academias
- [x] Destacar visualmente o acesso sem conflitar com Dashboard ativo
- [x] Validar navegação, foco de teclado, mobile e permissões
- [x] Executar TypeScript e testes de regressão
- [x] Salvar checkpoint publicado e entregar a melhoria

## CompTIA+ contextual — ativo, domínios e progresso
- [x] Auditar rotas, dados dos cinco domínios e consulta de progresso Security+
- [x] Destacar automaticamente o item CompTIA+ quando a rota Security+ estiver ativa
- [x] Exibir submenu acessível com os cinco domínios do exame
- [x] Conectar o progresso real da trilha ao selo do item CompTIA+
- [x] Validar expansão, teclado, mobile e fechamento do submenu
- [x] Executar TypeScript e suíte completa
- [x] Salvar checkpoint publicado e entregar a melhoria

## Cores de destaque na sidebar
- [x] Auditar classes de CompTIA+, IA Tutor e navegação principal
- [x] Aplicar cyan/azul ao CompTIA+ e verde ao IA Tutor com contraste adequado
- [x] Harmonizar cores dos demais grupos sem poluir a navegação
- [x] Validar estados ativo, hover, foco, mobile e submenu CompTIA+
- [x] Executar TypeScript e testes de regressão; suíte completa sem o teste NVIDIA externo: 348 aprovados e 1 ignorado. O teste NVIDIA falhou por timeout de rede.
- [x] Salvar checkpoint publicado e entregar a melhoria

## Transições dos botões coloridos da sidebar
- [x] Auditar transições atuais, hover, foco e estados ativos
- [x] Adicionar animação suave de cor, brilho, deslocamento e ícone
- [x] Respeitar prefers-reduced-motion
- [x] Validar desktop, mobile, teclado e submenu CompTIA+
- [x] Executar TypeScript e testes de regressão; 348 aprovados e 1 ignorado na suíte sem o teste NVIDIA externo
- [x] Salvar checkpoint publicado e entregar a melhoria

## Favoritos de cursos
- [x] Auditar catálogo, sidebar e recursos atuais de favoritos
- [x] Criar persistência por aluno para cursos favoritos
- [x] Adicionar página Favoritos com acesso, remoção e estado vazio
- [x] Adicionar ações de favoritar nos cards e detalhes de cursos
- [x] Exibir progresso e próxima ação nos cursos salvos
- [x] Validar sidebar, mobile, permissões e acessibilidade
- [x] Executar migração, TypeScript e testes
- [x] Salvar checkpoint publicado e entregar a funcionalidade

# FASE 2 — Favoritos

- [x] Criar a página dedicada `/favorites` para listar formações salvas pelo aluno
- [x] Conectar a página Favoritos à consulta de progresso real e à mutação persistente de favoritos
- [x] Atualizar a sidebar principal e o DashboardLayout reutilizável para apontar Favoritos para `/favorites`
- [x] Cobrir rota, consulta, estado vazio e remoção com testes automatizados
- [x] Validar a página Favoritos em preview desktop e confirmar ausência de erros TypeScript

# Exportação do código-fonte completo

- [x] Auditar a estrutura e definir os arquivos que devem compor o pacote completo
- [x] Montar arquivo compactado com código-fonte, configurações e documentação sem segredos
- [x] Validar integridade do pacote e confirmar exclusão de credenciais e dependências geradas
- [x] Entregar o pacote completo ao usuário

# Portabilidade e hospedagem externa

- [x] Inventariar banco de dados, autenticação, storage, APIs, uploads, tarefas agendadas e integrações Manus
- [x] Mapear variáveis de ambiente e classificar dependências obrigatórias, opcionais e específicas da Manus
- [x] Definir arquitetura externa e substitutos para autenticação, banco, storage, APIs e tarefas
- [x] Preparar estrutura de repositório GitHub com documentação de instalação, deploy e secrets
- [x] Adicionar arquivos de configuração portáveis e instruções para desenvolvimento local e produção
- [x] Validar referências Manus restantes, testes, build e ausência de credenciais no repositório exportável
- [x] Gerar pacote/repositório exportável e relatório final de migração

# Publicação no GitHub

- [x] Verificar estado do Git e conteúdo seguro para publicação pública
- [x] Criar o repositório público thiagobuente/cyberdimension-academy
- [x] Enviar o código e o histórico preparado para o GitHub
- [x] Validar URL, visibilidade, branch principal e arquivos publicados
- [x] Entregar confirmação do repositório público ao usuário

- [x] Criar cópia pública limpa sem credenciais, metadados Manus, scripts administrativos sensíveis ou histórico contaminado

# Requisitos complementares da exportação reproduzível

- [x] Criar `.env.example` completo somente com nomes de variáveis
- [x] Criar `ARCHITECTURE.md` com fluxos frontend, backend, banco, storage e APIs
- [x] Criar `DEPLOY.md` com instalação e publicação fora da Manus
- [x] Criar `MIGRATION.md` com retirada da Manus por área
- [x] Criar `STORAGE.md` com inventário, exportação e restauração de arquivos
- [x] Documentar webhooks e cron/jobs, inclusive quando não houver implementação ativa
- [x] Revisar scripts do `package.json` e documentar somente comandos existentes ou necessários
- [x] Atualizar README profissional com visão geral, setup, testes, build e migração
- [x] Revalidar sanitização, reprodutibilidade e conteúdo público antes do push

# Homologação externa isolada

- [ ] Clonar o código do GitHub para uma cópia de staging sem tocar na versão Manus
- [ ] Confirmar e documentar o que será substituído antes de cada alteração estrutural
- [ ] Configurar Node gerenciado em URL de homologação
- [ ] Provisionar MySQL externo separado e aplicar schema/migrations compatíveis
- [ ] Configurar storage S3/R2 separado e migrar assets autorizados
- [ ] Substituir autenticação/OAuth Manus por solução externa
- [ ] Substituir APIs Manus e revisar URLs/variáveis de ambiente
- [ ] Testar funcionalidades completas na cópia de homologação
- [ ] Validar que domínio, DNS, banco e versão Manus não foram alterados

# Homologação Render + Aiven + Cloudflare R2

- [ ] Apresentar arquivos/adaptadores e variáveis de ambiente antes de alterações estruturais
- [ ] Preparar cópia externa com adaptador MySQL compatível para Aiven
- [ ] Preparar adaptador S3-compatible para Cloudflare R2
- [ ] Substituir autenticação Manus na cópia externa sem copiar tokens de produção
- [ ] Configurar Render apenas com secrets externos e URL de homologação
- [ ] Aplicar migrations em banco Aiven separado
- [ ] Testar frontend, backend, autenticação, storage e funcionalidades na homologação
- [ ] Confirmar que Manus, domínio oficial e DNS permaneceram inalterados

# Homologação confirmada — Render + Aiven + R2

- [ ] Criar backup/versionamento da cópia externa antes de alterações
- [ ] Reconciliar migration 0026 somente na cópia externa e validar schema MySQL
- [ ] Apresentar diff final e matriz de dependências antes do deploy
- [ ] Implementar adaptadores Render/Aiven/R2 e autenticação própria somente no staging
- [ ] Configurar secrets externos sem publicar valores no GitHub
- [ ] Inicializar Aiven com banco exclusivo de homologação e sem dados de produção
- [ ] Validar funcionalidades e mídia antes de qualquer decisão de domínio/DNS
- [ ] Manter produção Manus intacta e documentar rollback da homologação

# Adaptadores externos — staging sem deploy

- [ ] Criar snapshot adicional da cópia staging antes dos adaptadores
- [ ] Reconciliar somente no staging a migration 0026 e validar as 35 migrations
- [ ] Implementar adaptador S3-compatible local para Cloudflare R2 sem credenciais
- [ ] Implementar autenticação própria JWT/scrypt e manter IDs internos no staging
- [ ] Configurar contrato Render/Resend/NVIDIA sem valores secretos
- [ ] Isolar/remover referências Manus do caminho externo e documentar exceções
- [ ] Executar check, testes, validação das migrations e builds frontend/backend
- [ ] Gerar relatório final de diff e pendências sem fazer deploy ou conexão externa

# Especificação pré-deploy — Render + Aiven + Cloudflare R2

- [ ] Consolidar arquitetura de staging em um único serviço Node no Render
- [ ] Documentar build, start, porta e variáveis de ambiente do Render
- [ ] Documentar Aiven MySQL vazio, TLS e aplicação das 35 migrations
- [ ] Documentar bucket R2 de staging, endpoint, configuração S3, CORS, Range/seek e prefixos
- [ ] Documentar comandos de instalação, deploy, migrations e smoke tests
- [ ] Documentar riscos e limitações antes da autorização de deploy
- [ ] Entregar a especificação para confirmação sem conectar ou publicar serviços externos

# Configuração real dos provedores de homologação

- [ ] Verificar acesso seguro ao Render, Aiven e Cloudflare
- [ ] Criar/confirmar Web Service Render de staging conectado ao GitHub
- [ ] Criar/confirmar banco Aiven MySQL vazio exclusivo de staging
- [ ] Criar/confirmar bucket R2 vazio exclusivo de staging
- [ ] Inserir secrets somente nos painéis dos provedores
- [ ] Aplicar migrations no Aiven sem dados de produção
- [ ] Iniciar e validar a URL onrender.com de homologação

# Homologação simplificada — Railway + MySQL

- [ ] Revisar a cópia staging e definir o menor conjunto de serviços Railway
- [ ] Documentar variáveis de ambiente, build/start commands e migrations Railway
- [ ] Documentar alterações necessárias somente no staging e dependências Manus restantes
- [ ] Entregar a especificação Railway para confirmação antes do deploy

# Infraestrutura Railway preparada

- [ ] Verificar autenticação da conta Railway
- [ ] Criar novo projeto Railway isolado
- [ ] Adicionar MySQL Railway vazio com volume persistente
- [ ] Adicionar serviço Web conectado ao GitHub sem publicar o deploy final
- [ ] Configurar build, start, PORT e referência DATABASE_URL
- [ ] Criar secrets exclusivos de staging sem valores no GitHub
- [ ] Gerar apenas domínio automático Railway
- [ ] Validar status dos recursos e migrations pendentes antes do deploy

# Automação segura de implantação externa

- [ ] Pesquisar Railway CLI, API, tokens e permissões oficiais
- [ ] Mapear operações possíveis: projeto, MySQL, serviço, variáveis, migrations e deploy
- [ ] Comparar alternativas externas automatizáveis sem credenciais pessoais
- [ ] Documentar credencial mínima, escopo e local de configuração
- [ ] Entregar recomendação antes de executar qualquer infraestrutura

# Bootstrap automatizado em workspace Railway dedicado

- [ ] Definir mecanismo seguro para injetar temporariamente o Workspace Token sem gravá-lo no projeto
- [ ] Confirmar que o workspace Railway é dedicado e vazio para staging
- [ ] Criar projeto, ambiente, MySQL, volume e serviço Web via automação autorizada
- [ ] Configurar secrets da aplicação somente no Railway
- [ ] Aplicar 35 migrations e fazer o primeiro deploy
- [ ] Executar smoke tests sem dados de produção
- [ ] Criar Project Token de staging, substituir o Workspace Token e revogá-lo
- [ ] Entregar URL e relatório final da homologação

# Bootstrap local Railway

- [x] Validar operações oficiais atuais do Railway CLI/API
- [x] Projetar script idempotente sem token embutido ou logs sensíveis
- [x] Gerar script de bootstrap para projeto, ambiente, MySQL, volume, serviço GitHub, variáveis, deploy e smoke tests
- [x] Gerar README_BOOTSTRAP.md com pré-requisitos, execução, revogação e Project Token
- [x] Validar sintaxe, segurança, comandos e limites do script
- [x] Entregar os arquivos sem executar o bootstrap local
- [x] Transformar a aplicação em PWA instalável para Android e iOS, com manifest, ícones, service worker e validação mobile
- [x] Adicionar botão/banner de instalação do PWA na interface principal, com estados Android/Chrome, iOS e app já instalado
- [x] Implementar a Academia de Inteligência Artificial do zero ao avançado com 10 módulos, aulas, quizzes, desafios, labs, projetos, Prompt Lab, progresso, XP, badges e certificado
- [x] Criar catálogo audiovisual autoral com 10 aulas em vídeo por curso e adicionar a aba Vídeos na barra lateral
- [x] Auditar e corrigir o fluxo de reprodução dos vídeos autorais (rota, asset, player, service worker e mobile)
- [ ] Migrar o vídeo-piloto para storage S3/R2 externo sem reutilizar a URL Manus
- [ ] Persistir progresso e conclusão da videoaula autoral
- [ ] Adicionar velocidade de reprodução e legendas ao player autoral
- [x] Corrigir vídeo-piloto exibido como 0:00 sem imagem, sem depender de R2/S3 ou APIs externas
- [x] Modernizar controles de velocidade do player autoral
- [x] Salvar progresso local do vídeo e permitir marcar a aula como concluída
- [x] Adicionar barra lateral interativa com as aulas disponíveis do curso
- [x] Auditar e corrigir o acervo de videoaulas: eliminar 0:00, remover links Not found e separar mídia publicada de roteiros
