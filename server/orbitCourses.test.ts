import { describe, expect, it } from "vitest";
import { assessmentPassingScore, executeSafeLabCommand, getEarnedBadgeCodes, getOrbitCourseRequirements, getPublicAssessment, gradeAssessment, isLabEvidenceValid, orbitCourseRequirements, orbitCourseSlugs } from "./orbitCourses";

describe("regras das formações CyberDimension", () => {
  it("mantém todas as formações com módulos e laboratórios exigidos para a certificação", () => {
    // 4 formações base + 56 cursos ativados do catálogo + 8 cursos de consultoria
    expect(orbitCourseSlugs).toHaveLength(68);
    expect(orbitCourseSlugs).toContain("gestao-projetos-seguranca-cibernetica");
    for (const slug of orbitCourseSlugs) {
      const requirements = orbitCourseRequirements[slug];
      expect(requirements.title).not.toHaveLength(0);
      expect(requirements.moduleCount).toBeGreaterThan(0);
      expect(requirements.labCount).toBeGreaterThan(0);
    }
  });

  it("não aceita formações fora do catálogo para emissão de certificado", () => {
    expect(getOrbitCourseRequirements("fundamentos-ti")?.moduleCount).toBe(5);
    expect(getOrbitCourseRequirements("windows-security")?.moduleCount).toBe(3);
    expect(getOrbitCourseRequirements("cloud-security-fundamentals")?.labCount).toBe(2);
    expect(getOrbitCourseRequirements("curso-inexistente")).toBeNull();
  });

  it("ativa cada curso especializado com avaliação explicativa e laboratório guiado", () => {
    const activatedSlugs = ["windows-security", "criptografia", "threat-intelligence", "fundamentos-pentest", "soc-analyst", "siem-na-pratica", "incident-response", "web-security-owasp", "grc-fundamentals", "iso-27001", "nist-cis-controls", "cloud-security-fundamentals", "aws-security-fundamentals", "azure-security-fundamentals", "digital-forensics-fundamentals", "devsecops-fundamentals", "network-security-zero-trust", "malware-analysis-fundamentals", "identidade-autenticacao-segura", "privacidade-protecao-dados", "active-directory-security", "vulnerability-management", "email-security-phishing-defense", "container-security", "threat-hunting-avancado", "security-architecture-threat-modeling", "ics-scada-security", "seguranca-pessoal-digital", "introducao-hacking-etico", "fundamentos-cloud-iniciante", "red-team-fundamentals", "api-security", "mobile-security", "database-security", "purple-team-operations", "red-team-operations", "seguranca-memoria-mitigacoes", "adversary-simulation", "security-program-management", "cloud-security-operations", "software-security-applied", "security-automation-operations", "detection-engineering", "iot-security-foundations", "software-supply-chain-security", "cyber-crisis-communication"];

    for (const slug of activatedSlugs) {
      const assessment = getPublicAssessment(slug);
      expect(assessment).toHaveLength(5);
      expect(assessment[0]).not.toHaveProperty("correctAnswer");
    }

    expect(executeSafeLabCommand("windows-security", 0, "inspecionar-windows --contas --grupos --somente-leitura")).toMatchObject({ success: true });
    expect(executeSafeLabCommand("aws-security-fundamentals", 0, "revisar-aws-iam --funcao relatorio --recurso bucket-treino")).toMatchObject({ success: true });
    expect(executeSafeLabCommand("identidade-autenticacao-segura", 0, "revisar-autenticacao --perfil colaborador --mfa obrigatorio")).toMatchObject({ success: true });
    expect(executeSafeLabCommand("cloud-security-operations", 0, "mapear-responsabilidade-cloud --cenario loja-treino --somente-leitura")).toMatchObject({ success: true });
  });

  it("ativa os cursos de consultoria com avaliação, módulos e laboratórios guiados", () => {
    const consultoriaSlugs = ["ai-security-fundamentals", "ai-red-team", "ai-security-governance", "it-fundamentals-cybersecurity", "wireshark-traffic-analysis", "identity-access-management", "security-awareness-social-engineering", "gestao-projetos-seguranca-cibernetica"];

    for (const slug of consultoriaSlugs) {
      const requirements = getOrbitCourseRequirements(slug);
      expect(requirements?.moduleCount).toBeGreaterThan(0);
      expect(requirements?.labCount).toBeGreaterThan(0);
      expect(getPublicAssessment(slug)).toHaveLength(5);
    }

    expect(executeSafeLabCommand("ai-security-fundamentals", 0, "classificar-dialogo --entrada conversa-lab.txt --tipo injection")).toMatchObject({ success: true });
    expect(executeSafeLabCommand("wireshark-traffic-analysis", 1, "gerar-relatorio --caso exfiltracao-dns --formato pdf")).toMatchObject({ success: true });
    expect(executeSafeLabCommand("ai-security-fundamentals", 0, "comando-inexistente")).toMatchObject({ success: false });
  });

  it("executa apenas a missão permitida e exige uma evidência válida para concluir o laboratório", () => {
    const allowedRun = executeSafeLabCommand("fundamentos-ti", 0, "verificar ambiente --vm --rede-isolada");
    const rejectedRun = executeSafeLabCommand("fundamentos-ti", 0, "rm -rf /");

    expect(allowedRun.success).toBe(true);
    expect(allowedRun.output).toContain("Execução segura concluída");
    expect(rejectedRun.success).toBe(false);
    expect(isLabEvidenceValid("registrar-evidencia")).toBe(true);
    expect(isLabEvidenceValid("ignorar-retorno")).toBe(false);
  });

  it("expõe avaliações sem o gabarito e calcula a aprovação pela nota mínima", () => {
    const questions = getPublicAssessment("fundamentos-ti");
    let perfectScore: ReturnType<typeof gradeAssessment>;
    let incorrectScore: ReturnType<typeof gradeAssessment>;
    for (let candidate = 0; candidate < 4 ** questions.length; candidate += 1) {
      const answers = questions.map((_, index) => Math.floor(candidate / (4 ** index)) % 4);
      const result = gradeAssessment("fundamentos-ti", answers);
      if (result?.percentage === 100) perfectScore = result;
      if (result && !result.passed) incorrectScore = result;
    }

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).not.toHaveProperty("correctOption");
    expect(perfectScore?.percentage).toBeGreaterThanOrEqual(assessmentPassingScore);
    expect(perfectScore?.passed).toBe(true);
    expect(incorrectScore?.passed).toBe(false);
  });

  it("concede badges de forma progressiva e somente certifica após aprovação", () => {
    const inProgress = getEarnedBadgeCodes({ completedModules: 1, completedLabs: 0, moduleCount: 5, labCount: 2, assessmentPassed: false, certified: false });
    const complete = getEarnedBadgeCodes({ completedModules: 5, completedLabs: 2, moduleCount: 5, labCount: 2, assessmentPassed: true, certified: true });

    expect(inProgress).toContain("first-module");
    expect(inProgress).not.toContain("assessment-passed");
    expect(complete).toEqual(expect.arrayContaining(["all-modules", "all-labs", "assessment-passed", "certified"]));
  });
});
