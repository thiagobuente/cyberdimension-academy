# Relatório de expansão multimídia, fontes e validação

## Objetivo

Esta entrega amplia a CyberDimension Academy como uma escola online de cibersegurança. Os novos recursos preservam a regra editorial da plataforma: vídeos e referências externas são complementares, enquanto aulas, laboratórios, quizzes, avaliações, progresso e certificados continuam sendo conteúdos e fluxos próprios da Academy.

## Alterações implementadas

| Área | Entrega | Resultado |
| --- | --- | --- |
| Cursos multimídia | Segurança de IoT e Dispositivos Conectados; Segurança da Cadeia de Suprimentos de Software; Comunicação e Gestão de Crise Cibernética | Cada formação possui módulos autorais, laboratórios seguros, avaliação, quiz de vídeo, certificação e rastreabilidade de conteúdo. |
| Áudio próprio | Audioguias narrados em português brasileiro | Os audioguias são exibidos no leitor como material de apoio acessível, com origem e finalidade identificadas. |
| Vídeo externo | Referências incorporadas por meio de players externos | O vídeo é identificado como complementar e não substitui o conteúdo didático próprio. |
| Política editorial | Nova página pública de política de conteúdo, fontes e licenças | A página explica classificação, uso complementar, critérios e compromisso de transparência. |
| Catálogo | Filtros por conteúdo próprio, vídeo, áudio e referências externas | O aluno pode escolher formações pela experiência de material disponível. |
| Administração | Registro de fontes externas persistente e protegido | Administradores registram título, tipo, autor/fonte, URL, licença, curso opcional e finalidade pedagógica. |

## Arquitetura preservada

Os seguintes recursos existentes foram reutilizados sem mudanças destrutivas: motor de formações, progresso por aula, persistência de laboratórios, certificação, XP, badges, quizzes modulares, quizzes de vídeo, notas, favoritos e retomada de sessões. A gestão administrativa de fontes foi adicionada como uma tabela independente, sem alterar registros de alunos, certificados ou progresso.

> **Fluxo pedagógico consolidado:** Trilha → Curso → Módulo → Aula → Vídeo/Audioguia → Material → Laboratório → Quiz → Progresso → Conclusão → Certificado.

## Transparência de origem e licença

O componente de proveniência distingue explicitamente conteúdo próprio, audioguias próprios, vídeos externos e demais referências externas. Para cada referência, a plataforma apresenta a origem, a licença ou termo de uso disponível e a finalidade educacional. O padrão exibido é:

> **Fonte:** plataforma, canal, autor ou organização responsável.  
> **Licença:** conforme termo ou licença disponibilizada pela fonte.  
> **Uso:** referência externa incorporada ou indicada como apoio.  
> **Conteúdo complementar:** materiais próprios da CyberDimension Academy.

As referências externas de vídeo adotadas pelas formações continuam documentadas em `docs/video-sources.md`.

## Validação executada

| Verificação | Resultado |
| --- | --- |
| Suíte automatizada | 123 testes aprovados e 1 teste ignorado. |
| TypeScript | Sem erros. |
| Player de audioguia | Renderizado no leitor da formação de IoT e vinculado a ativo estático publicado. |
| Vídeos incorporados | O leitor mantém a estrutura de vídeo externo, capítulos, transcrição, progresso e quiz. |
| Filtros e política | Validados nas rotas públicas `/catalog` e `/politica-de-conteudo`. |
| Administração | O formulário de fontes foi validado visualmente em `/admin` e protegido pelo escopo administrativo. |
| Responsividade | Catálogo, política, leitor multimídia e administração revisados em desktop e mobile. |

## Resultados e manutenção

A plataforma deixa de apresentar o YouTube como o centro do produto e passa a enquadrá-lo como um recurso de apoio. Novas fontes externas devem ser registradas pela área administrativa antes de sua associação a uma formação, mantendo autor, licença e finalidade pedagógica auditáveis. Novos cursos podem reutilizar os campos de vídeo, audioguia e proveniência sem mudanças no fluxo de progresso ou no banco de certificados.
