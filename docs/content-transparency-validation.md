# Relatório de Transparência de Conteúdo e Validação

**Data:** 15 de agosto de 2026  
**Escopo:** evolução não destrutiva da CyberDimension Academy para uma experiência de escola online, com autoria e proveniência explícitas para materiais próprios e fontes externas.

## Arquitetura avaliada antes da alteração

A plataforma já possuía um catálogo unificado de formações, páginas separadas de catálogo, detalhes e estudo, além de um motor de progresso, laboratórios, quizzes, recompensas e certificados. A implementação preservou esses fluxos. Não houve remoção de cursos, tentativas, certificados, dados de progresso, rotas administrativas ou estruturas de banco existentes.

| Decisão | Elementos envolvidos | Resultado |
| --- | --- | --- |
| Reutilizado | Catálogo central, resolvedor de formações, páginas de curso/estudo, player incorporado, progresso, laboratório, quiz e certificação | Os comportamentos existentes permanecem compatíveis. |
| Estendido | Metadados do curso e das sessões de vídeo | Cursos podem declarar conteúdo autoral e referências externas com semântica consistente. |
| Criado | `contentProvenance.ts`, `ContentTransparency.tsx` e `LearningJourney.tsx` | A plataforma apresenta autoria, fonte, licença e finalidade pedagógica sem duplicar informações. |
| Corrigido | Alinhamento da jornada pedagógica ao lado do painel de transparência | A etapa visual não se estica em telas largas nem prejudica a leitura em dispositivos móveis. |

## Transparência implementada

Cada formação distingue explicitamente o que é produzido pela CyberDimension Academy do que é usado como referência complementar. Os materiais próprios incluem apostilas e aulas, cenários e código didático, laboratórios e projetos, além de quizzes e avaliações. Referências externas suportadas incluem vídeos do YouTube, documentações, artigos, cursos externos, CTFs e ferramentas.

| Campo exibido | Finalidade |
| --- | --- |
| Tipo de conteúdo | Diferencia material próprio de fonte externa. |
| Fonte | Informa a organização, canal ou referência de origem. |
| Licença | Registra a licença autoral aplicável ou a disponibilidade declarada pelo autor. |
| Uso | Explica como o recurso é empregado no percurso didático. |
| Complemento próprio | Deixa explícito que vídeos e referências externas não substituem aulas, materiais, práticas e avaliações autorais. |

O vídeo externo é apresentado como material incorporado por meio de fonte pública, enquanto a sequência de estudo, roteiro, transcrição de apoio, práticas, laboratório, quiz, progresso e certificação permanecem elementos próprios da escola.

## Jornada pedagógica apresentada ao estudante

> Trilha → Curso → Módulo → Aula → Vídeo → Material → Laboratório → Quiz → Progresso → Certificado

A jornada aparece no catálogo, na página de detalhes e durante o estudo. A visualização preserva a ideia de que o vídeo é uma etapa contextualizada, não o produto principal da formação.

## Validação executada

| Verificação | Resultado |
| --- | --- |
| Suíte automatizada | 120 testes aprovados e 1 teste explicitamente ignorado. |
| Tipagem TypeScript | Concluída sem erros com `tsc --noEmit`. |
| Catálogo e detalhes de curso | Revisados em desktop, incluindo os painéis de transparência e a jornada. |
| Área de estudo e vídeo incorporado | Revisada em desktop; a sessão externa permanece identificada como complementar. |
| Responsividade | Revisada em tela móvel de 375 px para detalhes e estudo; sem sobreposição de controles. |
| Progresso, quizzes e navegação | Cobertos pela suíte de fluxos de formação e preservados pelo uso do motor existente. |
| Permissões administrativas | Cobertas pelos testes de credenciais e acesso administrativo existentes. |

## Resultado

A CyberDimension Academy passa a comunicar de forma verificável que é uma escola com conteúdo próprio, prática guiada, avaliação e certificação. Recursos externos são agora referências transparentes e rastreáveis, com origem, licença e contexto de uso apresentados ao estudante. Nenhuma funcionalidade já ativa foi removida.
