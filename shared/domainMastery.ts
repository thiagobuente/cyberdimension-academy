/**
 * Domain mastery badge definitions: one badge per SY0-701 domain awarded when
 * the learner's best quiz attempt in that domain reaches the mastery threshold.
 */
export const DOMAIN_MASTERY_THRESHOLD = 80;
export const DOMAIN_MASTERY_MIN_QUESTIONS = 10;
export const DOMAIN_MASTERY_XP = 50;

export const domainMasteryBadgeCode = (domainId: number): string => `domain-mastery-${domainId}`;

export const domainMasteryBadgeMeta: Record<string, { name: string; description: string }> = {
  "domain-mastery-1": { name: "Guardião dos Fundamentos", description: "Dominou os conceitos básicos de segurança (Domínio 1.0) com 80% ou mais de acerto." },
  "domain-mastery-2": { name: "Engenheiro de Ameaças", description: "Dominou ameaças, vulnerabilidades e mitigação (Domínio 2.0) com 80% ou mais de acerto." },
  "domain-mastery-3": { name: "Arquiteto de Segurança", description: "Dominou a engenharia de segurança (Domínio 3.0) com 80% ou mais de acerto." },
  "domain-mastery-4": { name: "Mestre da Operação", description: "Dominou as operações de segurança (Domínio 4.0) com 80% ou mais de acerto." },
  "domain-mastery-5": { name: "Oficial de Gestão", description: "Dominou gestão e operação do programa (Domínio 5.0) com 80% ou mais de acerto." },
};
