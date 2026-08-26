# Validação editorial — Security+ SY0-701

## Origem e método

As novas aulas e questões foram criadas de forma autoral a partir do pacote de estudo fornecido e mapeadas aos objetivos oficiais do exame CompTIA Security+ SY0-701 presentes no mesmo pacote. Os textos não reproduzem as apostilas: usam cenários, passos de decisão e justificativas próprios. A verificação foi feita diretamente no conteúdo persistido nas tabelas `lessons` e `questions` em 14 de agosto de 2026.

| Domínio SY0-701 | Nova aula persistida | Evidência de alinhamento |
|---|---|---|
| DOM1 — General Security Concepts | **Security+ em campo: princípios, controles e mudanças** | Aplica confidencialidade, integridade, disponibilidade, autenticação, autorização e responsabilização a uma decisão de acesso remoto. |
| DOM2 — Threats & Vulnerabilities | **Security+ em campo: modelagem de ameaças e mitigação** | Usa um portal de fornecedores para identificar caminhos de ataque, vulnerabilidades, impacto e tratamento do risco. |
| DOM3 — Security Architecture | **Security+ em campo: arquitetura híbrida e Zero Trust** | Trabalha acesso a SaaS, API interna e arquivos confidenciais, com redução de confiança implícita e movimento lateral. |
| DOM4 — Security Operations | **Security+ em campo: detecção, resposta e preservação de evidências** | Orienta validação de alertas, classificação, contenção reversível, preservação de evidências e lições aprendidas. |
| DOM5 — Program Management | **Security+ em campo: governança, risco e conformidade aplicada** | Conecta risco de terceiros, cláusulas de segurança, monitoramento, continuidade e descarte a objetivos de negócio. |

## Amostras reais de questões e explicações

| Domínio | Questão autoral | Resposta correta | Justificativa persistida |
|---|---|---|---|
| DOM1 | Uma regra exige MFA para acesso administrativo. Essa regra é principalmente um controle: | Preventivo | MFA reduz a chance de acesso não autorizado antes que ele ocorra. |
| DOM2 | Qual medida reduz melhor o risco de upload de arquivo malicioso em um portal? | Validação de tipo, análise antimalware e isolamento do processamento | Os controles complementares reduzem a exposição do serviço a anexos maliciosos. |
| DOM3 | Qual controle mais fortalece a autenticação contra phishing em uma aplicação corporativa? | MFA resistente a phishing com vínculo criptográfico à origem | Métodos resistentes a phishing reduzem a coleta e a reutilização de credenciais em páginas falsas. |
| DOM4 | Em um playbook de resposta a incidente, qual item deve ser definido antes do evento? | Critérios de escalonamento e responsabilidades | Playbooks definem responsabilidades, escalonamento e passos repetíveis antecipadamente. |
| DOM5 | O que diferencia risco residual de risco inerente? | Risco residual permanece após aplicar controles | O risco inerente é avaliado antes dos controles; o residual é o que permanece depois do seu efeito. |

## Consulta de validação executada

> Foram consultadas as cinco aulas cujo título começa com `Security+ em campo:` e a questão mais recente de cada domínio. A consulta confirmou uma aula nova e uma questão com explicação em cada domínio. A distribuição de questões retornada no banco após a inclusão foi: DOM1 38, DOM2 42, DOM3 36, DOM4 36 e DOM5 36.

## Reprodutibilidade

O conjunto completo foi preservado em `drizzle/0009_securityplus_field_content.sql`. A migração é idempotente: identifica cada aula por domínio e título e cada questão por domínio e enunciado antes de inserir. Ela contém as cinco aulas **Security+ em campo:** e 25 questões formativas, sendo cinco questões por domínio. O teste `server/securityPlusContentMigration.test.ts` valida essa cobertura no repositório.

Este registro é uma evidência editorial e operacional da integração realizada; não substitui os objetivos oficiais do exame nem implica afiliação com a CompTIA.
