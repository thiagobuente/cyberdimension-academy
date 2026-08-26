import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { createEmailOpenId, hashPassword, normalizeEmail, verifyPassword } from "./emailAuth";
import { assessmentPassingScore, courseBadgeDefinitions, executeSafeLabCommand, getEarnedBadgeCodes, getOrbitCourseRequirements, getOrbitLabMetadata, getPublicAssessment, getPublicModuleQuiz, gradeAssessment, gradeModuleQuestion, gradeModuleQuiz, isLabEvidenceValid, orbitCourseSlugs } from "./orbitCourses";
import { storagePut } from "./storage";
import { buildTutorSystemPrompt, getTutorSafetyResponse, getTutorSuggestedPrompts, isTutorUnsafeRequest } from "./tutor";
import { getGrcAppliedAssessment, gradeGrcAppliedAssessment, grcAppliedCertificateTitle, grcAppliedLessonSlug, grcAppliedPassingScore, grcAppliedSectionIds } from "./grcAppliedLesson";
import { getTechnicalEnglishAssessment, gradeTechnicalEnglishAssessment, technicalEnglishCertificateTitle, technicalEnglishLessonSlug, technicalEnglishPassingScore, technicalEnglishSectionIds } from "./technicalEnglishCourse";
import { getWeeklyChallenge } from "../shared/weeklyChallenges";
import { cloudSecurityBadgeCode, cloudSecurityCourseSlugs, cloudSecurityTrackSlug, hasCompletedCloudSecurityTrack } from "../shared/cloudSecurityBadge";
import { getPublicVideoQuiz, gradeVideoQuiz } from "./videoQuizzes";
import { getPublicPodcastQuiz, gradePodcastQuiz } from "../shared/podcastQuizzes";
import { getEnglishVocabularyFavorites, toggleEnglishVocabularyFavorite, createEnglishInterviewAttempt, getFlashcardSrsState, recordFlashcardReview, FLASHCARD_SRS_MAX_STAGE, FLASHCARD_DRILL_BONUS_XP, getFlashcardDueTerms, advanceFlashcardStageAfterDrill } from "./db";
import { buildDrillQuestionsForUser, type FlashcardDrillQuestion } from "./flashcardDrill";
import { englishVocabulary, getEnglishTerm } from "../shared/englishVocabulary";
import { interviewQuestions, interviewRoles, getQuestionsByRole, type InterviewRole } from "../shared/englishInterviewSimulator";
import { AUDIO_LAB_SERIES } from "../shared/audioLabSeries";
import { audioLabEpisodes } from "../shared/audioLabEpisodes";
import { getAudioLabQuiz, getAudioLabCompetency, gradeAudioLabQuiz, AUDIO_LAB_QUIZ_XP_PER_CORRECT, quizBank } from "../shared/audioLabQuizzes";
import { podcastEpisodes } from "../shared/podcastEpisodes";
import { evaluatePodcastListenerBadges } from "../shared/podcastListenerBadges";
import { getConsecutivePerfectQuizCount, getQuizStreakMilestone } from "../shared/quizStreakRewards";
import { getPublicSpecialtySimulation, getSpecialtySimulation, gradeSpecialtySimulation, specialtySimulationSlugs, specialtySimulations } from "../shared/specialtySimulations";
import { APOSTILAS_GITHUB_URL, FREE_VIDEO_BADGE_MILESTONES, FREE_VIDEO_COURSE_CATEGORIES, FREE_VIDEO_COURSES, FREE_VIDEO_COURSES_SLUG, FREE_CATEGORY_BADGES, getCategoryBadgeForCategory, getFreeCoursesByCategory, type FreeVideoCourse } from "../shared/freeVideoCourses";
import { DAILY_STREAK_MILESTONES, getDayKeyForDate } from "../shared/studyStreak";
import { DOMAIN_MASTERY_XP } from "../shared/domainMastery";
import { CAREER_AREAS, CAREER_QUESTIONS, CAREER_XP_REWARD, gradeCareerQuiz, type CareerArea } from "../shared/careerQuiz";
import { PROJECT_XP_REWARD } from "../shared/cyberProjects";
import { invokeNvidiaTutor } from "./nvidia";

/** Cap on quiz attempts per Security+ domain to avoid database spam while allowing retakes. */
const MAX_QUIZ_ATTEMPTS_PER_DOMAIN = 10;

async function evaluateFreeCourseMilestones(userId: number, watchedCount: number) {
  const earned = FREE_VIDEO_BADGE_MILESTONES.filter((milestone) => watchedCount >= milestone.count);
  const existing = await db.getCourseAchievements(userId, FREE_VIDEO_COURSES_SLUG);
  const existingCodes = new Set(existing.map((entry) => entry.badgeCode));
  const newlyAwarded = earned
    .filter((milestone) => !existingCodes.has(milestone.code))
    .map((milestone) => ({ userId, courseSlug: FREE_VIDEO_COURSES_SLUG, badgeCode: milestone.code }));
  if (newlyAwarded.length > 0) {
    await db.awardCourseAchievements(newlyAwarded);
  }
  return {
    newlyAwarded: newlyAwarded.map((entry) => entry.badgeCode),
    milestoneXp: newlyAwarded
      .map((entry) => earned.find((milestone) => milestone.code === entry.badgeCode)?.xp ?? 0)
      .reduce<number>((sum, value) => sum + value, 0),
  };
}

/** Grants category completion badges for any category whose available courses were all watched. */
async function evaluateFreeCourseCategoryBadges(userId: number) {
  const rows = await db.getFreeVideoCourseProgress(userId);
  const watchedSlugs = new Set(rows.map((row) => row.courseSlug));
  const existing = await db.getCourseAchievements(userId, FREE_VIDEO_COURSES_SLUG);
  const existingCodes = new Set(existing.map((entry) => entry.badgeCode));
  const newlyAwarded: Array<{ userId: number; courseSlug: string; badgeCode: string }> = [];
  for (const badge of FREE_CATEGORY_BADGES) {
    if (existingCodes.has(badge.code)) continue;
    const categoryCourses = getFreeCoursesByCategory(badge.category).filter((course) => course.status === "disponivel");
    if (categoryCourses.length === 0) continue;
    const allWatched = categoryCourses.every((course) => watchedSlugs.has(course.slug));
    if (allWatched) {
      newlyAwarded.push({ userId, courseSlug: FREE_VIDEO_COURSES_SLUG, badgeCode: badge.code });
    }
  }
  if (newlyAwarded.length > 0) {
    await db.awardCourseAchievements(newlyAwarded);
  }
  return {
    newlyAwarded: newlyAwarded.map((entry) => entry.badgeCode),
    categoryXp: newlyAwarded
      .map((entry) => FREE_CATEGORY_BADGES.find((badge) => badge.code === entry.badgeCode)?.xp ?? 0)
      .reduce<number>((sum, value) => sum + value, 0),
  };
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

function parseQuestionOptions(options: unknown): string[] | null {
  try {
    const parsed = typeof options === "string" ? JSON.parse(options) : options;
    if (!Array.isArray(parsed) || parsed.length < 2 || parsed.some((option) => typeof option !== "string" || option.trim().length === 0)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function makeQuestionsSafeForStudy<T extends { options: unknown; correctAnswer: unknown }>(questions: T[]) {
  return questions.flatMap((question) => {
    const options = parseQuestionOptions(question.options);
    const correctAnswer = Number(question.correctAnswer);
    if (!options || !Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) return [];
    return [{ ...question, options, correctAnswer }];
  });
}

async function evaluateQuizStreakReward(userId: number, attemptType: "module" | "video", attemptId: number) {
  const attempts = await db.getAllCourseQuizAttemptsForStreak(userId);
  const currentStreak = getConsecutivePerfectQuizCount(attempts);
  const milestone = getQuizStreakMilestone(currentStreak);
  if (!milestone) return { currentStreak, bonusXp: 0, milestone: null };

  const claim = await db.claimQuizStreakReward({
    userId,
    attemptType,
    attemptId,
    streakLength: currentStreak,
    awardedXp: milestone.xp,
  });
  return {
    currentStreak,
    bonusXp: claim.claimed ? milestone.xp : 0,
    milestone: { label: milestone.label, xp: milestone.xp },
  };
}

async function syncCourseAchievements(userId: number, courseSlug: string) {
  const requirements = getOrbitCourseRequirements(courseSlug);
  if (!requirements) return [];
  const [modules, labs, assessment, certificate] = await Promise.all([
    db.getCourseModuleProgress(userId, courseSlug),
    db.getCourseLabProgress(userId, courseSlug),
    db.getCourseAssessment(userId, courseSlug),
    db.getCourseCertificateByUserAndSlug(userId, courseSlug),
  ]);
  const completedModules = new Set(modules.filter((item) => item.completed).map((item) => item.moduleIndex)).size;
  const completedLabs = new Set(labs.filter((item) => item.completed).map((item) => item.labIndex)).size;
  const badgeCodes = getEarnedBadgeCodes({
    completedModules,
    completedLabs,
    moduleCount: requirements.moduleCount,
    labCount: requirements.labCount,
    assessmentPassed: assessment?.passed ?? false,
    certified: Boolean(certificate),
  });
  await db.awardCourseAchievements(badgeCodes.map((badgeCode) => ({ userId, courseSlug, badgeCode, unlockedAt: new Date() })));
  await syncCloudSecurityTrackAchievement(userId);
  return db.getCourseAchievements(userId, courseSlug);
}

async function syncCloudSecurityTrackAchievement(userId: number) {
  const certificates = await Promise.all(cloudSecurityCourseSlugs.map((courseSlug) => db.getCourseCertificateByUserAndSlug(userId, courseSlug)));
  if (!hasCompletedCloudSecurityTrack(certificates.flatMap((certificate, index) => certificate ? [cloudSecurityCourseSlugs[index]] : []))) return;
  await db.awardCourseAchievements([{ userId, courseSlug: cloudSecurityTrackSlug, badgeCode: cloudSecurityBadgeCode, unlockedAt: new Date() }]);
}

async function getWeeklyChallengeStatus(userId: number) {
  const challenge = getWeeklyChallenge();
  const [modules, labs, videoProgress, reward] = await Promise.all([
    db.getCourseModuleProgress(userId, challenge.courseSlug),
    db.getCourseLabProgress(userId, challenge.courseSlug),
    db.getCourseVideoProgress(userId, challenge.courseSlug),
    db.getWeeklyChallengeReward(userId, challenge.weekKey),
  ]);
  const completed = challenge.activity === "module"
    ? modules.some((item) => item.moduleIndex === challenge.activityIndex && item.completed)
    : challenge.activity === "lab"
      ? labs.some((item) => item.labIndex === challenge.activityIndex && item.completed)
      : videoProgress.some((item) => item.moduleIndex === challenge.activityIndex && item.chapterIndex >= (challenge.chapterIndex ?? 0));
  return { challenge, completed, reward: reward ?? null };
}

const emailAccountInput = z.object({
  email: z.string().email("Informe um e-mail válido.").max(320),
  password: z.string().min(10, "A senha deve ter ao menos 10 caracteres.").max(128),
});

const studentEmailAccessInput = z.object({
  email: z.string().email("Informe um e-mail válido.").max(320),
});

const profileUpdateInput = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(255),
  avatarDataUrl: z.string().max(2_000_000).nullable().optional(),
});

const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

function verifyLoginRateLimit(email: string) {
  const current = loginAttempts.get(email);
  if (!current || current.resetAt <= Date.now()) return;
  if (current.attempts >= MAX_LOGIN_ATTEMPTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    });
  }
}

function recordFailedLogin(email: string) {
  const current = loginAttempts.get(email);
  const resetAt = current?.resetAt && current.resetAt > Date.now()
    ? current.resetAt
    : Date.now() + LOGIN_WINDOW_MS;
  loginAttempts.set(email, { attempts: (current?.attempts ?? 0) + 1, resetAt });
}

function clearLoginAttempts(email: string) {
  loginAttempts.delete(email);
}

function toPublicUser<T extends { passwordHash?: string | null }>(user: T) {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

async function startEmailSession(ctx: { req: Parameters<typeof getSessionCookieOptions>[0]; res: { cookie: Function } }, user: { openId: string; name: string | null }) {
  const token = await sdk.createSessionToken(user.openId, {
    expiresInMs: ONE_YEAR_MS,
    name: user.name ?? "Aluno CyberDimension",
  });
  ctx.res.cookie(COOKIE_NAME, token, {
    ...getSessionCookieOptions(ctx.req),
    maxAge: ONE_YEAR_MS,
  });
}

async function ensureInitialEmailAdmin() {
  if (!ENV.adminEmail || !ENV.adminPassword) return;
  const email = normalizeEmail(ENV.adminEmail);
  const existing = await db.getUserByEmail(email);
  if (existing?.passwordHash && existing.role === "admin" && existing.loginMethod === "email") return;

  await db.ensureEmailAdmin({
    openId: existing?.openId ?? createEmailOpenId(),
    email,
    passwordHash: await hashPassword(ENV.adminPassword),
    name: existing?.name ?? "Administrador CyberDimension",
  });
}

async function uploadProfileAvatar(userId: number, avatarDataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(avatarDataUrl);
  if (!match) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Envie uma imagem PNG, JPEG ou WebP válida." });
  }
  const contentType = match[1];
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0 || bytes.length > 1_000_000) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "A foto deve ter no máximo 1 MB." });
  }
  const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const uploaded = await storagePut(`profile-avatars/${userId}/avatar.${extension}`, bytes, contentType);
  return uploaded.url;
}

const ALLOWED_EVIDENCE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

const PORTFOLIO_MAX_BYTES = 4_000_000;

async function uploadPortfolioEvidence(
  userId: number,
  courseSlug: string,
  labIndex: number,
  dataUrl: string,
) {
  const match = /^data:(image\/(?:png|jpeg|webp)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Anexe uma evidência em PNG, JPEG, WebP ou PDF." });
  }
  const contentType = match[1];
  if (!ALLOWED_EVIDENCE_TYPES.has(contentType)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Tipo de arquivo não suportado no portfólio." });
  }
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0 || bytes.length > PORTFOLIO_MAX_BYTES) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "A evidência deve ter no máximo 4 MB." });
  }
  const extension = contentType === "application/pdf" ? "pdf" : contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const uploaded = await storagePut(
    `portfolio/${userId}/${courseSlug}/lab-${labIndex}/evidence.${extension}`,
    bytes,
    contentType,
  );
  return { url: uploaded.url, key: uploaded.key, mimeType: contentType };
}

async function startStudentEmailSession(
  ctx: { req: Parameters<typeof getSessionCookieOptions>[0]; res: { cookie: Function } },
  input: z.infer<typeof studentEmailAccessInput>,
) {
  const email = normalizeEmail(input.email);

  if (ENV.adminEmail && email === normalizeEmail(ENV.adminEmail)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Use a entrada administrativa para esta conta." });
  }

  let user = await db.getUserByEmail(email);
  if (!user) {
    const suggestedName = email.split("@")[0]?.trim().slice(0, 255) || "Aluno CyberDimension";
    user = await db.createEmailUser({
      openId: createEmailOpenId(),
      name: suggestedName,
      email,
      passwordHash: null,
    });
  }

  if (!user || user.role === "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Use a entrada administrativa para esta conta." });
  }
  await db.markUserSignedIn(user.id);
  await startEmailSession(ctx, user);
  return { user: toPublicUser(user) };
}

/** Free video course library (external YouTube content curated for students). */
export const freeCourses = router({
  catalog: publicProcedure.query(async () => ({
    courses: FREE_VIDEO_COURSES,
    categories: FREE_VIDEO_COURSE_CATEGORIES,
    apostilasUrl: APOSTILAS_GITHUB_URL,
    milestones: FREE_VIDEO_BADGE_MILESTONES,
  })),
  progress: protectedProcedure.query(async ({ ctx }) => {
    const [rows, watchedCount] = await Promise.all([
      db.getFreeVideoCourseProgress(ctx.user.id),
      db.countFreeVideoCoursesWatched(ctx.user.id),
    ]);
    const earnedMilestones = FREE_VIDEO_BADGE_MILESTONES
      .filter((milestone) => watchedCount >= milestone.count)
      .map((milestone) => milestone.code);
    const watchedSlugs = new Set(rows.map((row) => row.courseSlug));
    const earnedCategoryBadges = FREE_CATEGORY_BADGES.filter((badge) => {
      const categoryCourses = getFreeCoursesByCategory(badge.category).filter((course) => course.status === "disponivel");
      return categoryCourses.length > 0 && categoryCourses.every((course) => watchedSlugs.has(course.slug));
    }).map((badge) => badge.code);
    return {
      watchedSlugs: rows.map((row) => row.courseSlug),
      watchedSlugsUpdatedAt: rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.courseSlug] = row.updatedAt.getTime();
        return acc;
      }, {}),
      watchedCount,
      earnedMilestones,
      earnedCategoryBadges,
    };
  }),
  markWatched: protectedProcedure.input(z.object({
    courseSlug: z.string().trim().min(1).max(120),
  })).mutation(async ({ ctx, input }) => {
    const course: FreeVideoCourse | undefined = FREE_VIDEO_COURSES.find((candidate) => candidate.slug === input.courseSlug);
    if (!course || course.status !== "disponivel") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Curso não encontrado ou vídeo indisponível." });
    }
    const { alreadyWatched } = await db.markFreeVideoCourseWatched(ctx.user.id, course.slug, course.watchXp);
    const watchedCount = await db.countFreeVideoCoursesWatched(ctx.user.id);
    const milestoneResult = await evaluateFreeCourseMilestones(ctx.user.id, watchedCount);
    const categoryResult = await evaluateFreeCourseCategoryBadges(ctx.user.id);
    return {
      courseSlug: course.slug,
      alreadyWatched,
      xp: alreadyWatched ? 0 : course.watchXp,
      watchedCount,
      newlyAwardedMilestones: milestoneResult.newlyAwarded,
      milestoneXp: milestoneResult.milestoneXp,
      newlyAwardedCategoryBadges: categoryResult.newlyAwarded,
      categoryXp: categoryResult.categoryXp,
    };
  }),
  /** Removes a course from the learner's watched list (dashboard "continue watching"). */
  dismissWatched: protectedProcedure.input(z.object({
    courseSlug: z.string().trim().min(1).max(120),
  })).mutation(async ({ ctx, input }) => {
    const course: FreeVideoCourse | undefined = FREE_VIDEO_COURSES.find((candidate) => candidate.slug === input.courseSlug);
    if (!course) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Curso não encontrado." });
    }
    await db.removeFreeVideoCourseProgress(ctx.user.id, course.slug);
    const watchedCount = await db.countFreeVideoCoursesWatched(ctx.user.id);
    return { courseSlug: course.slug, watchedCount };
  }),
});

export const appRouter = router({
  freeCourses,
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user ? toPublicUser(opts.ctx.user) : null),
    register: publicProcedure.input(studentEmailAccessInput).mutation(async ({ ctx, input }) => startStudentEmailSession(ctx, input)),
    login: publicProcedure.input(emailAccountInput).mutation(async ({ ctx, input }) => {
      await ensureInitialEmailAdmin();
      const email = normalizeEmail(input.email);
      verifyLoginRateLimit(email);
      const user = await db.getUserByEmail(email);
      const passwordMatches = await verifyPassword(input.password, user?.passwordHash);
      if (!user || user.role !== "admin" || !passwordMatches) {
        recordFailedLogin(email);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha inválidos." });
      }

      clearLoginAttempts(email);
      await db.markUserSignedIn(user.id);
      await startEmailSession(ctx, user);
      return { user: toPublicUser(user) };
    }),
    accessWithEmail: publicProcedure.input(studentEmailAccessInput).mutation(async ({ ctx, input }) => startStudentEmailSession(ctx, input)),
    updateProfile: protectedProcedure.input(profileUpdateInput).mutation(async ({ ctx, input }) => {
      const avatarUrl = input.avatarDataUrl === undefined
        ? undefined
        : input.avatarDataUrl === null
          ? null
          : await uploadProfileAvatar(ctx.user.id, input.avatarDataUrl);
      const updated = await db.updateEmailUserProfile(ctx.user.id, { name: input.name, avatarUrl });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Conta não encontrada." });
      await startEmailSession(ctx, updated);
      return { user: toPublicUser(updated) };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  domains: router({
    list: publicProcedure.query(async () => {
      return db.getDomains();
    }),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getDomainById(input.id);
    }),
  }),

  content: router({
    stats: publicProcedure.query(async () => {
      return db.getContentStats();
    }),
  }),

  lessons: router({
    byDomain: protectedProcedure.input(z.object({ domainId: z.number() })).query(async ({ input }) => {
      return db.getLessonsByDomain(input.domainId);
    }),
    byId: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getLessonById(input.id);
    }),
    // Notas pessoais do aluno em uma aula (Modo Estudo)
    notes: protectedProcedure.input(z.object({ lessonId: z.number() })).query(async ({ ctx, input }) => {
      return db.getLessonNotes(ctx.user.id, input.lessonId);
    }),
    allNotes: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllLessonNotes(ctx.user.id);
    }),
    saveNote: protectedProcedure.input(z.object({
      lessonId: z.number(),
      title: z.string().trim().min(1, "Informe um título.").max(180),
      content: z.string().trim().min(1, "Escreva o conteúdo da nota.").max(20000),
    })).mutation(async ({ ctx, input }) => {
      await db.saveLessonNote({ userId: ctx.user.id, lessonId: input.lessonId, title: input.title, content: input.content });
      return db.getLessonNotes(ctx.user.id, input.lessonId);
    }),
    updateNote: protectedProcedure.input(z.object({
      noteId: z.number(),
      title: z.string().trim().min(1, "Informe um título.").max(180),
      content: z.string().trim().min(1, "Escreva o conteúdo da nota.").max(20000),
    })).mutation(async ({ ctx, input }) => {
      await db.updateLessonNote({ id: input.noteId, userId: ctx.user.id, title: input.title, content: input.content });
      return db.getAllLessonNotes(ctx.user.id);
    }),
    deleteNote: protectedProcedure.input(z.object({ noteId: z.number() })).mutation(async ({ ctx, input }) => {
      await db.removeLessonNote(ctx.user.id, input.noteId);
      return { deleted: true };
    }),
    // Trechos salvos (bookmarks) de aulas
    bookmarks: protectedProcedure.input(z.object({ lessonId: z.number().optional() })).query(async ({ ctx, input }) => {
      return db.getLessonBookmarks(ctx.user.id, input.lessonId);
    }),
    saveBookmark: protectedProcedure.input(z.object({
      lessonId: z.number(),
      excerpt: z.string().trim().min(1, "Selecione um trecho para salvar.").max(10000),
      context: z.string().trim().max(280).optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.saveLessonBookmark({ userId: ctx.user.id, lessonId: input.lessonId, excerpt: input.excerpt, context: input.context || null });
      return db.getLessonBookmarks(ctx.user.id, input.lessonId);
    }),
    deleteBookmark: protectedProcedure.input(z.object({ bookmarkId: z.number() })).mutation(async ({ ctx, input }) => {
      await db.removeLessonBookmark(ctx.user.id, input.bookmarkId);
      return { deleted: true };
    }),
  }),

  questions: router({
    byDomain: protectedProcedure.input(z.object({ domainId: z.number() })).query(async ({ input }) => {
      const questions = await db.getRandomQuestions(input.domainId, 10);
      return makeQuestionsSafeForStudy(questions);
    }),
    all: protectedProcedure.query(async () => {
      const questions = await db.getAllRandomQuestions(10);
      return makeQuestionsSafeForStudy(questions);
    }),
  }),

  quiz: router({
    submit: protectedProcedure.input(z.object({
      domainId: z.number(),
      score: z.number(),
      totalQuestions: z.number(),
      answers: z.array(z.object({
        questionId: z.number(),
        selectedAnswer: z.number(),
        correct: z.boolean(),
      })).min(1, "Envie ao menos uma resposta.").max(200, "Limite de respostas excedido."),
    })).mutation(async ({ ctx, input }) => {
      // Auditoria de integridade: recalcular o score no servidor a partir do banco de questões.
      // O score informado pelo cliente NUNCA é usado para badges, XP ou conclusões sem verificação.
      const answeredQuestionIds = Array.from(new Set(input.answers.map((answer) => answer.questionId)));
      const knownQuestions = answeredQuestionIds.length > 0
        ? await db.getQuestionsByIds(answeredQuestionIds)
        : [];
      const knownById = new Map(knownQuestions.map((question) => [question.id, question]));
      let verifiedScore = 0;
      let verifiedTotal = 0;
      for (const answer of input.answers) {
        const question = knownById.get(answer.questionId);
        if (!question) continue;
        verifiedTotal += 1;
        if (question.correctAnswer === answer.selectedAnswer) verifiedScore += 1;
      }
      if (verifiedTotal === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhuma resposta válida foi identificada neste envio." });
      }
      // Limite de tentativas por domínio: previne spam de envios inflando registros e consumo de banco.
      // Retentativas são permitidas — a pontuação válida considera a MELHOR tentativa (lógica de badge acima).
      if (input.domainId > 0) {
        const attemptCount = await db.countQuizAttemptsByUserAndDomain(ctx.user.id, input.domainId);
        if (attemptCount >= MAX_QUIZ_ATTEMPTS_PER_DOMAIN) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Limite de ${MAX_QUIZ_ATTEMPTS_PER_DOMAIN} tentativas atingido neste domínio. Continue sua formação em outra área ou revise o conteúdo.`,
          });
        }
      }
      const result = await db.saveQuizAttempt({
        userId: ctx.user.id,
        domainId: input.domainId,
        score: verifiedScore,
        totalQuestions: verifiedTotal,
        answers: JSON.stringify(input.answers),
      });
      // Award the domain mastery badge when the best attempt in this domain
      // reaches 80%+ with at least 10 answered questions.
      if (input.domainId > 0) {
        const history = await db.getQuizAttemptsByUserAndDomain(ctx.user.id, input.domainId);
        let bestPct = 0;
        let bestTotal = 0;
        for (const attempt of history) {
          if (attempt.totalQuestions >= 10 && attempt.totalQuestions > bestTotal) {
            const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);
            bestPct = pct;
            bestTotal = attempt.totalQuestions;
          }
        }
        const freshPct = verifiedTotal >= 10 ? Math.round((verifiedScore / verifiedTotal) * 100) : 0;
        if (freshPct > bestPct) {
          bestPct = freshPct;
          bestTotal = Math.max(bestTotal, verifiedTotal);
        }
        if (bestTotal >= 10 && bestPct >= 80) {
          await db.awardDomainMasteryBadge({ userId: ctx.user.id, domainId: input.domainId, bestScorePct: bestPct });
        }
      }
      return { id: result.id, verifiedScore, verifiedTotal };
    }),
    history: protectedProcedure.query(async ({ ctx }) => {
      const attempts = await db.getQuizAttemptsByUser(ctx.user.id);
      return attempts.map(a => ({
        ...a,
        answers: typeof a.answers === "string" ? JSON.parse(a.answers as unknown as string) : a.answers,
      }));
    }),
    historyByDomain: protectedProcedure.input(z.object({ userId: z.number(), domainId: z.number() })).query(async ({ ctx, input }) => {
      // Auditoria de autorização: cada aluno só acessa as próprias tentativas.
      return db.getQuizAttemptsByUserAndDomain(ctx.user.id, input.domainId);
    }),
    /** Returns the question ids answered incorrectly in the user's last qualifying attempt for the domain. */
    wrongQuestionIds: protectedProcedure.input(z.object({ domainId: z.number() })).query(async ({ ctx, input }) => {
      const attempts = await db.getQuizAttemptsByUserAndDomain(ctx.user.id, input.domainId);
      for (const attempt of attempts) {
        const answers: Array<{ questionId: number; selectedAnswer: number; correct: boolean }> =
          typeof attempt.answers === "string" ? JSON.parse(attempt.answers as unknown as string) : (attempt.answers ?? []);
        if (!Array.isArray(answers)) continue;
        const wrongIds = answers.filter((answer) => answer && typeof answer.questionId === "number" && !answer.correct)
          .map((answer) => answer.questionId);
        if (wrongIds.length > 0) {
          return { attemptId: attempt.id, domainId: attempt.domainId, wrongIds: Array.from(new Set(wrongIds)) };
        }
      }
      return { attemptId: null, domainId: input.domainId, wrongIds: [] };
    }),
  }),
  studyStreak: router({
    status: protectedProcedure.query(async ({ ctx }) => {
      const [dayKeys, rewards] = await Promise.all([
        db.getDailyStudyDayKeys(ctx.user.id),
        db.getDailyStreakRewardsByUser(ctx.user.id),
      ]);
      const todayKey = getDayKeyForDate();
      const { currentStreak } = db.computeCurrentStreak(dayKeys, new Date());
      const grantedToday = rewards.some((reward) => reward.dayKey === todayKey);
      const todayAwardedXp = rewards.filter((reward) => reward.dayKey === todayKey)
        .reduce((sum, reward) => sum + reward.awardedXp, 0);
      const earnedMilestones = DAILY_STREAK_MILESTONES
        .filter((milestone) => currentStreak >= milestone.length)
        .map((milestone) => milestone.label);
      const nextMilestone = DAILY_STREAK_MILESTONES.find((milestone) => milestone.length > currentStreak) ?? null;
      return { currentStreak, todayKey, grantedToday, todayAwardedXp, earnedMilestones, nextMilestone };
    }),
    markStudyDay: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.user.id;
      const todayKey = getDayKeyForDate();
      await db.recordDailyStudyActivity(userId, todayKey);
      const dayKeys = await db.getDailyStudyDayKeys(userId);
      const { currentStreak } = db.computeCurrentStreak(dayKeys, new Date());
      const milestones = DAILY_STREAK_MILESTONES.filter((milestone) => milestone.length <= currentStreak);
      let bonusXp = 0;
      for (const milestone of milestones) {
        const claim = await db.claimDailyStreakReward({
          userId,
          dayKey: todayKey,
          streakLength: milestone.length,
          awardedXp: milestone.xp,
        });
        if (claim.claimed) bonusXp += milestone.xp;
      }
      return { currentStreak, bonusXp };
    }),
  }),
  progress: router({
    lessonCount: protectedProcedure.input(z.object({ domainId: z.number() })).query(async ({ input }) => {
      return db.getLessonsCountByDomain(input.domainId);
    }),
    markComplete: protectedProcedure.input(z.object({ domainId: z.number(), lessonId: z.number().nullable().optional() })).mutation(async ({ ctx, input }) => {
      await db.saveProgress({
        userId: ctx.user.id,
        domainId: input.domainId,
        lessonId: input.lessonId || null,
        completed: true,
        completedAt: new Date(),
      });
      return { success: true };
    }),
    markIncomplete: protectedProcedure.input(z.object({ domainId: z.number(), lessonId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const lesson = await db.getLessonById(input.lessonId);
      if (!lesson || lesson.domainId !== input.domainId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Aula inválida para este domínio." });
      }
      await db.removeLessonProgress({ userId: ctx.user.id, domainId: input.domainId, lessonId: input.lessonId });
      return { success: true };
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getProgressByUser(ctx.user.id);
    }),
    byDomain: protectedProcedure.input(z.object({ userId: z.number(), domainId: z.number() })).query(async ({ ctx, input }) => {
      // Auditoria de autorização: cada aluno só acessa o próprio progresso.
      return db.getProgressByUserAndDomain(ctx.user.id, input.domainId);
    }),
  }),

  podcast: router({
    list: publicProcedure.query(() => podcastEpisodes),
    getProgress: protectedProcedure.query(async ({ ctx }) => db.getPodcastProgress(ctx.user.id)),
    saveProgress: protectedProcedure.input(z.object({
      episodeId: z.string().refine(
        (episodeId) => podcastEpisodes.some((episode) => episode.id === episodeId),
        "Episódio de Podcast inválido.",
      ),
      positionSeconds: z.number().int().min(0).max(4 * 60 * 60),
      completed: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const result = await db.savePodcastProgress({
        userId: ctx.user.id,
        episodeId: input.episodeId,
        positionSeconds: input.positionSeconds,
        completed: input.completed,
      });
            return {
        success: true,
        completed: result.completed,
        justCompleted: result.justCompleted,
        awardedXp: result.justCompleted ? 50 : 0,
      };
    }),
    quiz: protectedProcedure.input(z.object({
      episodeId: z.string().refine(
        (episodeId) => podcastEpisodes.some((episode) => episode.id === episodeId),
        "Episódio de Podcast inválido.",
      ),
    })).query(({ input }) => {
      const questions = getPublicPodcastQuiz(input.episodeId);
      return { questions };
    }),
    quizStatus: protectedProcedure.input(z.object({
      episodeId: z.string().refine(
        (episodeId) => podcastEpisodes.some((episode) => episode.id === episodeId),
        "Episódio de Podcast inválido.",
      ),
    })).query(async ({ ctx, input }) => {
      const latest = await db.getLatestPodcastQuizAttempt(ctx.user.id, input.episodeId);
      if (!latest) return { submitted: false };
      return {
        submitted: true,
        score: latest.score,
        totalQuestions: latest.totalQuestions,
        percentage: Math.round((latest.score / latest.totalQuestions) * 100),
      };
    }),
    submitQuiz: protectedProcedure.input(z.object({
      episodeId: z.string().refine(
        (episodeId) => podcastEpisodes.some((episode) => episode.id === episodeId),
        "Episódio de Podcast inválido.",
      ),
      answers: z.array(z.number().int().min(0).max(3)).min(5).max(5),
    })).mutation(async ({ ctx, input }) => {
      const grade = gradePodcastQuiz(input.episodeId, input.answers);
      if (!grade) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas para o quiz do episódio." });
      }
      const progress = await db.getPodcastProgress(ctx.user.id);
      const episodeProgress = progress.find((entry) => entry.episodeId === input.episodeId);
      if (!episodeProgress?.completed) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua a escuta do episódio antes de enviar o quiz de revisão." });
      }
      const attempt = await db.createPodcastQuizAttempt({
        userId: ctx.user.id,
        episodeId: input.episodeId,
        score: grade.score,
        totalQuestions: grade.totalQuestions,
        answers: input.answers,
      });
      const quizXp = Math.max(0, Math.min(grade.score, grade.totalQuestions)) * 10;
      return { ...grade, attemptId: attempt.id, quizXp };
    }),
    weeklyRanking: protectedProcedure.query(async () => db.getPodcastWeeklyRanking(20)),
    listenerBadges: protectedProcedure.query(async ({ ctx }) => {
      const earned = await db.getPodcastListenerBadges(ctx.user.id);
      return { badges: earned.map((entry) => ({ code: entry.badgeCode, awardedAt: entry.awardedAt })) };
    }),
    claimListenerBadges: protectedProcedure.mutation(async ({ ctx }) => {
      const progress = await db.getPodcastProgress(ctx.user.id);
      const completedEpisodeIds = new Set(
        progress.filter((entry) => entry.completed).map((entry) => entry.episodeId)
      );
      const perfectQuizEpisodeIds = new Set<string>();
      const progressByEpisode = new Map<string, boolean>();
      for (const entry of progress) progressByEpisode.set(entry.episodeId, entry.completed);
      for (const episode of podcastEpisodes) {
        if (!progressByEpisode.get(episode.id)) continue;
        const latest = await db.getLatestPodcastQuizAttempt(ctx.user.id, episode.id);
        if (latest && latest.score === latest.totalQuestions) {
          perfectQuizEpisodeIds.add(episode.id);
        }
      }
      const publishedEpisodeIds = new Set(podcastEpisodes.map((episode) => episode.id));
      const quizSubmittedEpisodeIds = new Set<string>();
      for (const episode of podcastEpisodes) {
        if (!progressByEpisode.get(episode.id)) continue;
        const latest = await db.getLatestPodcastQuizAttempt(ctx.user.id, episode.id);
        if (latest) quizSubmittedEpisodeIds.add(episode.id);
      }
      const alreadyAwarded = new Set((await db.getPodcastListenerBadges(ctx.user.id)).map((entry) => entry.badgeCode));
      const earned = evaluatePodcastListenerBadges(
        { completedEpisodeIds, perfectQuizEpisodeIds, quizSubmittedEpisodeIds, publishedEpisodeIds },
        alreadyAwarded
      );
      let xpGranted = 0;
      for (const badge of earned) {
        await db.awardPodcastListenerBadge({ userId: ctx.user.id, badgeCode: badge.code });
        xpGranted += badge.xp;
      }
      return { newlyAwarded: earned, xpGranted };
    }),
    englishVocabulary: protectedProcedure.query(async ({ ctx }) => ({
      terms: englishVocabulary,
      favorites: (await getEnglishVocabularyFavorites(ctx.user.id)).map((entry) => entry.termId),
    })),
    toggleEnglishFavorite: protectedProcedure.input(z.object({
      termId: z.string().trim().min(1).max(80).refine(
        (termId) => Boolean(getEnglishTerm(termId)),
        "Termo de vocabulário inválido.",
      ),
    })).mutation(async ({ ctx, input }) => {
      const result = await toggleEnglishVocabularyFavorite(ctx.user.id, input.termId);
      return result;
    }),
    flashcardSrsState: protectedProcedure.query(async ({ ctx }) => {
      const rows = await getFlashcardSrsState(ctx.user.id);
      return { states: rows.map((row) => ({ termId: row.termId, stage: row.stage, nextReviewAt: row.nextReviewAt, reviewCount: row.reviewCount, mastered: row.stage >= FLASHCARD_SRS_MAX_STAGE })) };
    }),
    recordFlashcardReview: protectedProcedure.input(z.object({
      termId: z.string().trim().min(1).max(80).refine(
        (termId) => Boolean(getEnglishTerm(termId)),
        "Termo de vocabulário inválido.",
      ),
      remembered: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const result = await recordFlashcardReview(ctx.user.id, input.termId, input.remembered);
      return {
        termId: input.termId,
        stage: result.stage,
        nextReviewAt: result.nextReviewAt,
        intervalDays: result.intervalDays,
        mastered: result.mastery,
        xp: result.mastery ? 10 : 5,
      };
    }),
    flashcardDrillQuestions: protectedProcedure.query(async ({ ctx }) => {
      const questions = await buildDrillQuestionsForUser(ctx.user.id);
      return { questions };
    }),
    submitFlashcardDrill: protectedProcedure.input(z.object({
      answers: z.array(z.object({ termId: z.string().trim().min(1).max(80), answerIndex: z.number().int().min(0).max(3) })).min(1).max(10),
    })).mutation(async ({ ctx, input }) => {
      for (const answer of input.answers) {
        if (!englishVocabulary.some((term) => term.id === answer.termId)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Termo de vocabulário inválido no simulado." });
        }
      }
      const dueRows = await getFlashcardDueTerms(ctx.user.id);
      const eligibleTermIds = new Set(dueRows.map((row) => row.termId));
      const questionsList = await buildDrillQuestionsForUser(ctx.user.id);
      const questionByTerm = new Map<string, FlashcardDrillQuestion>(questionsList.map((question) => [question.termId, question]));
      const results: { termId: string; correct: boolean; stage: number; mastered: boolean }[] = [];
      for (const answer of input.answers) {
        const question = englishVocabulary.find((term) => term.id === answer.termId);
        if (!question) continue;
        const isEligible = eligibleTermIds.has(answer.termId);
        const generated = questionByTerm.get(answer.termId);
        const correct = Boolean(generated) && isEligible && generated && generated.correctAnswer === answer.answerIndex;
        if (!isEligible || !correct) {
          results.push({ termId: answer.termId, correct: false, stage: 0, mastered: false });
          continue;
        }
        const drillRecord = await advanceFlashcardStageAfterDrill(ctx.user.id, answer.termId);
        results.push({ termId: answer.termId, correct, stage: drillRecord.stage, mastered: drillRecord.mastered });
      }
      return { results, bonusXpPerCorrect: FLASHCARD_DRILL_BONUS_XP, totalDue: dueRows.length };
    }),
    englishInterview: protectedProcedure.input(z.object({
      role: z.enum(["soc", "pentester", "network"] as const),
    })).query(async ({ input }) => ({
      role: input.role,
      questions: getQuestionsByRole(input.role as InterviewRole),
      roles: interviewRoles,
    })),
    submitEnglishInterviewAnswer: protectedProcedure.input(z.object({
      questionId: z.string().trim().min(1).max(80).refine(
        (questionId) => interviewQuestions.some((question) => question.id === questionId),
        "Pergunta de entrevista inválida.",
      ),
      answerText: z.string().trim().min(20, "Escreva ao menos vinte caracteres para receber o feedback.").max(4000),
    })).mutation(async ({ ctx, input }) => {
      const question = interviewQuestions.find((current) => current.id === input.questionId);
      if (!question) throw new TRPCError({ code: "BAD_REQUEST", message: "Pergunta de entrevista inválida." });
      const lowerAnswer = input.answerText.toLowerCase();
      const keywordsFound = question.keywords.filter((keyword) => lowerAnswer.includes(keyword.toLowerCase()));
      const score = keywordsFound.length;
      await createEnglishInterviewAttempt({
        userId: ctx.user.id,
        questionId: question.id,
        answerText: input.answerText.slice(0, 4000),
        keywordsFound,
        score,
      });
      return {
        question: {
          id: question.id,
          ideaScoreLabel: question.ideaScoreLabel,
          ideaScore: [...question.ideaScore],
          idealAnswerEn: question.idealAnswerEn,
          idealAnswerPt: question.idealAnswerPt,
          tips: question.tips,
          keywords: [...question.keywords],
        },
        keywordsFound,
        score,
        xp: Math.max(0, Math.min(score, 5)) * 10,
      };
    }),
    episodeFavorites: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.getPodcastEpisodeFavorites(ctx.user.id);
      return rows.map((row) => row.episodeId);
    }),
    toggleEpisodeFavorite: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100).refine(
        (episodeId) => podcastEpisodes.some((episode) => episode.id === episodeId),
        "Episódio inválido.",
      ),
    })).mutation(async ({ ctx, input }) => {
      const result = await db.togglePodcastEpisodeFavorite(ctx.user.id, input.episodeId);
      return result;
    }),
  }),
  weeklyChallenges: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const { challenge, completed, reward } = await getWeeklyChallengeStatus(ctx.user.id);
      return {
        ...challenge,
        completed,
        claimed: Boolean(reward),
        awardedXp: reward?.awardedXp ?? 0,
      };
    }),
    history: protectedProcedure.query(async ({ ctx }) => db.getWeeklyChallengeRewardsByUser(ctx.user.id)),
    claim: protectedProcedure.mutation(async ({ ctx }) => {
      const { challenge, completed, reward } = await getWeeklyChallengeStatus(ctx.user.id);
      if (reward) return { success: true, alreadyClaimed: true, awardedXp: reward.awardedXp };
      if (!completed) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua a atividade desta semana antes de resgatar o bônus de XP." });
      }
      const result = await db.claimWeeklyChallengeReward({
        userId: ctx.user.id,
        weekKey: challenge.weekKey,
        challengeKey: challenge.key,
        awardedXp: challenge.xp,
        claimedAt: new Date(),
      });
      return { success: true, alreadyClaimed: !result.claimed, awardedXp: result.reward?.awardedXp ?? challenge.xp };
    }),
  }),

  specialtySimulations: router({
    catalog: protectedProcedure.query(() => specialtySimulations.map((simulation) => ({
      slug: simulation.slug,
      title: simulation.title,
      subtitle: simulation.subtitle,
      durationMinutes: simulation.durationMinutes,
      passingScore: simulation.passingScore,
      totalQuestions: simulation.questions.length,
      recommendedCourses: simulation.recommendedCourses,
    }))),
    history: protectedProcedure.query(async ({ ctx }) => {
      const attempts = await db.getSpecialtySimulationAttemptsByUser(ctx.user.id);
      return attempts.map(({ answers: _answers, ...attempt }) => attempt);
    }),
    start: protectedProcedure.input(z.object({ simulationSlug: z.enum(specialtySimulationSlugs) })).mutation(async ({ ctx, input }) => {
      const simulation = getSpecialtySimulation(input.simulationSlug);
      const payload = getPublicSpecialtySimulation(input.simulationSlug);
      if (!simulation || !payload) throw new TRPCError({ code: "NOT_FOUND", message: "Simulado não encontrado." });
      const active = await db.getActiveSpecialtySimulationAttempt(ctx.user.id, input.simulationSlug);
      if (active) {
        return { attemptId: active.id, startedAt: active.startedAt, expiresAt: active.expiresAt, simulation: payload, resumed: true };
      }
      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + simulation.durationMinutes * 60_000);
      const attempt = await db.createSpecialtySimulationAttempt({
        userId: ctx.user.id,
        simulationSlug: input.simulationSlug,
        totalQuestions: simulation.questions.length,
        durationSeconds: simulation.durationMinutes * 60,
        startedAt,
        expiresAt,
      });
      return { attemptId: attempt.id, startedAt: attempt.startedAt, expiresAt: attempt.expiresAt, simulation: payload, resumed: false };
    }),
    submit: protectedProcedure.input(z.object({
      attemptId: z.number().int().positive(),
      answers: z.array(z.number().int().min(0).max(3)).max(20),
    })).mutation(async ({ ctx, input }) => {
      const attempt = await db.getSpecialtySimulationAttemptById(input.attemptId, ctx.user.id);
      if (!attempt) throw new TRPCError({ code: "NOT_FOUND", message: "Sessão de simulado não encontrada." });
      if (attempt.submittedAt) throw new TRPCError({ code: "CONFLICT", message: "Este simulado já foi enviado." });
      const simulation = getSpecialtySimulation(attempt.simulationSlug);
      if (!simulation) throw new TRPCError({ code: "BAD_REQUEST", message: "Especialidade inválida para esta sessão." });
      const normalizedAnswers = simulation.questions.map((_question, index) => input.answers[index] ?? -1);
      const grade = gradeSpecialtySimulation(simulation.slug, normalizedAnswers);
      if (!grade) throw new TRPCError({ code: "BAD_REQUEST", message: "Não foi possível corrigir esta sessão." });
      const submittedAt = new Date();
      const timedOut = submittedAt.getTime() >= attempt.expiresAt.getTime();
      const persisted = await db.submitSpecialtySimulationAttempt({
        id: attempt.id,
        userId: ctx.user.id,
        answers: normalizedAnswers,
        score: grade.score,
        passed: timedOut ? false : grade.passed,
        timedOut,
        submittedAt,
      });
      return { ...grade, passed: timedOut ? false : grade.passed, timedOut, expiresAt: attempt.expiresAt, attempt: persisted };
    }),
  }),

  portfolio: router({
    labEvidence: protectedProcedure.query(async ({ ctx }) => {
      const runs = await db.getVerifiedCourseLabRunsByUser(ctx.user.id);
      return runs.flatMap((run) => {
        const metadata = getOrbitLabMetadata(run.courseSlug, run.labIndex);
        if (!metadata || !run.verifiedAt) return [];
        return [{
          id: run.id,
          courseSlug: run.courseSlug,
          labIndex: run.labIndex,
          verifiedAt: run.verifiedAt,
          ...metadata,
        }];
      });
    }),
    evidenceCounts: protectedProcedure.query(async ({ ctx }) => db.getPortfolioEvidenceCountsByUser(ctx.user.id)),
    items: protectedProcedure.query(async ({ ctx }) => {
      const [items, labProgress] = await Promise.all([
        db.getPortfolioItemsByUser(ctx.user.id),
        db.getCourseLabProgressByUser(ctx.user.id),
      ]);
      const completedKeys = new Set(
        labProgress
          .filter((record) => record.completed)
          .map((record) => `${record.courseSlug}:${record.labIndex}`),
      );
      return items.map((item) => ({
        ...item,
        validLab: completedKeys.has(`${item.courseSlug}:${item.labIndex}`),
      }));
    }),
    attachEvidence: protectedProcedure.input(z.object({
      courseSlug: z.string().trim().min(1).max(120),
      labIndex: z.number().int().min(0).max(20),
      title: z.string().trim().min(2, "Dê um título para a evidência.").max(200),
      description: z.string().max(3000).optional(),
      evidenceDataUrl: z.string().max(6_000_000),
    })).mutation(async ({ ctx, input }) => {
      const proof = await db.getLabCompletedProof({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        labIndex: input.labIndex,
      });
      if (!proof) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Conclua o laboratório antes de anexar evidências ao portfólio.",
        });
      }
      const upload = await uploadPortfolioEvidence(
        ctx.user.id,
        input.courseSlug,
        input.labIndex,
        input.evidenceDataUrl,
      );
      await db.createPortfolioItem({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        labIndex: input.labIndex,
        title: input.title,
        description: input.description?.trim() || null,
        fileUrl: upload.url,
        fileKey: upload.key,
        mimeType: upload.mimeType,
      });
      return { success: true };
    }),
    removeEvidence: protectedProcedure.input(z.object({
      itemId: z.number().int().min(1),
    })).mutation(async ({ ctx, input }) => {
      const existing = await db.getPortfolioItemById(input.itemId);
      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Evidência não encontrada." });
      }
            await db.deletePortfolioItem({ userId: ctx.user.id, itemId: input.itemId });
      return { success: true };
    }),
    setPublic: protectedProcedure.input(z.object({ enabled: z.boolean() })).mutation(async ({ ctx, input }) => {
      const token = input.enabled ? crypto.randomUUID() : null;
      await db.refreshPortfolioPublicToken(ctx.user.id, token, input.enabled);
      return { enabled: input.enabled, token };
    }),
  }),
  portfolioPublic: router({
    projectsByToken: publicProcedure.input(z.object({ token: z.string().trim().min(1).max(64) })).query(async ({ input }) => db.getPublicProjectCompletionsByToken(input.token)),
    byToken: publicProcedure.input(z.object({ token: z.string().trim().min(1).max(64) })).query(async ({ input }) => {
      const gallery = await db.getPublicPortfolioByToken(input.token);
      if (!gallery) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Portfólio não encontrado ou não compartilhado." });
      }
      return gallery;
    }),
  }),
  formations: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      await syncCloudSecurityTrackAchievement(ctx.user.id);
      const [progress, certificates, achievements, streakRewards] = await Promise.all([
        db.getAllCourseProgressByUser(ctx.user.id),
        db.getCourseCertificatesByUser(ctx.user.id),
        db.getAllCourseAchievementsByUser(ctx.user.id),
        db.getQuizStreakRewardsByUser(ctx.user.id),
      ]);
      return { ...progress, certificates, achievements, streakRewards };
    }),
    readiness: protectedProcedure.query(async ({ ctx }) => {
      const [progress, quizResult] = await Promise.all([
        db.getAllCourseProgressByUser(ctx.user.id),
        db.getCareerQuizResultByUser(ctx.user.id),
      ]);
      return { ...progress, quizArea: quizResult?.topArea ?? null };
    }),
    progress: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs) })).query(async ({ ctx, input }) => {
      const [modules, moduleQuizAttempts, labs, certificate, assessment, attempts, achievements, videoProgress, favorites, videoNotes, videoQuizAttempts] = await Promise.all([
        db.getCourseModuleProgress(ctx.user.id, input.courseSlug),
        db.getCourseModuleQuizAttempts(ctx.user.id, input.courseSlug),
        db.getCourseLabProgress(ctx.user.id, input.courseSlug),
        db.getCourseCertificateByUserAndSlug(ctx.user.id, input.courseSlug),
        db.getCourseAssessment(ctx.user.id, input.courseSlug),
        db.getCourseAssessmentAttempts(ctx.user.id, input.courseSlug),
        db.getCourseAchievements(ctx.user.id, input.courseSlug),
        db.getCourseVideoProgress(ctx.user.id, input.courseSlug),
        db.getCourseFavorites(ctx.user.id),
        db.getCourseVideoNotes(ctx.user.id, input.courseSlug),
        db.getCourseVideoQuizAttempts(ctx.user.id, input.courseSlug),
      ]);
      return { modules, moduleQuizAttempts, labs, certificate: certificate ?? null, assessment: assessment ?? null, attempts, achievements, videoProgress, videoNotes, videoQuizAttempts, isFavorite: favorites.some((favorite) => favorite.courseSlug === input.courseSlug) };
    }),
    saveVideoProgress: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4), chapterIndex: z.number().int().min(0).max(20) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      await db.saveCourseVideoProgress({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        moduleIndex: input.moduleIndex,
        chapterIndex: input.chapterIndex,
      });
      return { success: true };
    }),
    saveVideoNote: protectedProcedure.input(z.object({
      courseSlug: z.enum(orbitCourseSlugs),
      moduleIndex: z.number().int().min(0).max(4),
      chapterIndex: z.number().int().min(0).max(20),
      content: z.string().trim().min(1, "Escreva uma nota antes de salvar.").max(5000, "A nota deve ter no máximo 5.000 caracteres."),
    })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      await db.saveCourseVideoNote({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        moduleIndex: input.moduleIndex,
        chapterIndex: input.chapterIndex,
        content: input.content,
      });
      return { success: true };
    }),
    removeVideoNote: protectedProcedure.input(z.object({
      courseSlug: z.enum(orbitCourseSlugs),
      moduleIndex: z.number().int().min(0).max(4),
      chapterIndex: z.number().int().min(0).max(20),
    })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      await db.removeCourseVideoNote(ctx.user.id, input.courseSlug, input.moduleIndex, input.chapterIndex);
      return { success: true };
    }),
    setFavorite: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), favorite: z.boolean() })).mutation(async ({ ctx, input }) => {
      if (input.favorite) await db.addCourseFavorite(ctx.user.id, input.courseSlug);
      else await db.removeCourseFavorite(ctx.user.id, input.courseSlug);
      return { favorite: input.favorite };
    }),
    assessment: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs) })).query(({ input }) => ({
      questions: getPublicAssessment(input.courseSlug),
      passingScore: assessmentPassingScore,
    })),
    videoQuiz: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4) })).query(({ input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      return { questions: getPublicVideoQuiz(input.courseSlug, input.moduleIndex) };
    }),
    submitVideoQuiz: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4), answers: z.array(z.number().int().min(0).max(3)).min(1).max(4) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      const result = gradeVideoQuiz(input.courseSlug, input.moduleIndex, input.answers);
      if (!requirements || input.moduleIndex >= requirements.moduleCount || !result) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas para o quiz da sessão em vídeo." });
      }
      const attempt = await db.createCourseVideoQuizAttempt({ userId: ctx.user.id, courseSlug: input.courseSlug, moduleIndex: input.moduleIndex, score: result.score, totalQuestions: result.totalQuestions, answers: input.answers });
      const streak = await evaluateQuizStreakReward(ctx.user.id, "video", attempt.id);
      return { ...result, streak };
    }),
    moduleQuiz: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4) })).query(({ input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      return { questions: getPublicModuleQuiz(input.courseSlug, input.moduleIndex) };
    }),
    submitModuleQuestion: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4), questionIndex: z.number().int().min(0).max(3), answer: z.number().int().min(0).max(3) })).mutation(({ input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      const result = gradeModuleQuestion(input.courseSlug, input.moduleIndex, input.questionIndex, input.answer);
      if (!requirements || input.moduleIndex >= requirements.moduleCount || !result) throw new TRPCError({ code: "BAD_REQUEST", message: "Resposta inválida para a questão do quiz de fixação." });
      return result;
    }),
    markModuleComplete: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.moduleIndex >= requirements.moduleCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Módulo inválido para esta formação." });
      const attempts = await db.getCourseModuleQuizAttempts(ctx.user.id, input.courseSlug);
      if (!attempts.some((attempt) => attempt.moduleIndex === input.moduleIndex)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Responda o quiz de fixação deste módulo antes de concluir a etapa." });
      }
      await db.saveCourseModuleProgress({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        moduleIndex: input.moduleIndex,
        completed: true,
        completedAt: new Date(),
      });
      const achievements = await syncCourseAchievements(ctx.user.id, input.courseSlug);
      return { success: true, achievements };
    }),
    submitModuleQuiz: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), moduleIndex: z.number().int().min(0).max(4), answers: z.array(z.number().int().min(0).max(3)).min(1).max(4) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      const result = gradeModuleQuiz(input.courseSlug, input.moduleIndex, input.answers);
      if (!requirements || input.moduleIndex >= requirements.moduleCount || !result) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas para o quiz de fixação." });
      }
      const attempt = await db.createCourseModuleQuizAttempt({ userId: ctx.user.id, courseSlug: input.courseSlug, moduleIndex: input.moduleIndex, score: result.score, totalQuestions: result.totalQuestions, answers: input.answers });
      const completed = result.score === result.totalQuestions;
      if (completed) {
        await db.saveCourseModuleProgress({ userId: ctx.user.id, courseSlug: input.courseSlug, moduleIndex: input.moduleIndex, completed: true, completedAt: new Date() });
      }
      const streak = await evaluateQuizStreakReward(ctx.user.id, "module", attempt.id);
      const achievements = completed ? await syncCourseAchievements(ctx.user.id, input.courseSlug) : [];
      return { ...result, completed, achievements, streak };
    }),
    runLab: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), labIndex: z.number().int().min(0).max(4), command: z.string().trim().min(1).max(500) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.labIndex >= requirements.labCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Laboratório inválido para esta formação." });
      const execution = executeSafeLabCommand(input.courseSlug, input.labIndex, input.command);
      const run = await db.createCourseLabRun({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        labIndex: input.labIndex,
        command: input.command,
        success: execution.success,
        output: execution.output,
      });
      return { runId: run.id, ...execution };
    }),
    verifyLab: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), labIndex: z.number().int().min(0).max(4), runId: z.number().int().positive(), answer: z.string().trim() })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements || input.labIndex >= requirements.labCount) throw new TRPCError({ code: "BAD_REQUEST", message: "Laboratório inválido para esta formação." });
      const run = await db.getCourseLabRunById(input.runId, ctx.user.id);
      if (!run || run.courseSlug !== input.courseSlug || run.labIndex !== input.labIndex || !run.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Execute a missão prática corretamente antes de enviar a evidência." });
      }
      if (!isLabEvidenceValid(input.answer)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Evidência incorreta. Revise o retorno do ambiente e tente novamente." });
      }
      await db.markCourseLabRunVerified(run.id, ctx.user.id);
      await db.saveCourseLabProgress({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        labIndex: input.labIndex,
        completed: true,
        completedAt: new Date(),
      });
      const achievements = await syncCourseAchievements(ctx.user.id, input.courseSlug);
      return { success: true, achievements };
    }),
    submitAssessment: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), answers: z.array(z.number().int().min(0).max(3)).min(1).max(10) })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      const result = gradeAssessment(input.courseSlug, input.answers);
      if (!requirements || !result) throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas para esta avaliação." });

      const [modules, labs] = await Promise.all([
        db.getCourseModuleProgress(ctx.user.id, input.courseSlug),
        db.getCourseLabProgress(ctx.user.id, input.courseSlug),
      ]);
      const completedModules = new Set(modules.filter((item) => item.completed).map((item) => item.moduleIndex)).size;
      const completedLabs = new Set(labs.filter((item) => item.completed).map((item) => item.labIndex)).size;
      if (completedModules < requirements.moduleCount || completedLabs < requirements.labCount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua os módulos e laboratórios guiados antes de iniciar a avaliação final." });
      }

      await Promise.all([
        db.createCourseAssessmentAttempt({ userId: ctx.user.id, courseSlug: input.courseSlug, score: result.score, totalQuestions: result.totalQuestions, answers: input.answers, passed: result.passed }),
        db.saveCourseAssessment({ userId: ctx.user.id, courseSlug: input.courseSlug, score: result.percentage, passed: result.passed, completedAt: new Date() }),
      ]);
      const achievements = await syncCourseAchievements(ctx.user.id, input.courseSlug);
      return { ...result, achievements };
    }),
    issueCertificate: protectedProcedure.input(z.object({ courseSlug: z.enum(orbitCourseSlugs), displayName: z.string().trim().min(2).max(120).optional() })).mutation(async ({ ctx, input }) => {
      const requirements = getOrbitCourseRequirements(input.courseSlug);
      if (!requirements) throw new TRPCError({ code: "BAD_REQUEST", message: "Formação inválida." });

      const existing = await db.getCourseCertificateByUserAndSlug(ctx.user.id, input.courseSlug);
      if (existing) {
        const achievements = await syncCourseAchievements(ctx.user.id, input.courseSlug);
        return { id: existing.id, identifier: existing.identifier, achievements };
      }

      const [moduleProgress, labProgress, assessment] = await Promise.all([
        db.getCourseModuleProgress(ctx.user.id, input.courseSlug),
        db.getCourseLabProgress(ctx.user.id, input.courseSlug),
        db.getCourseAssessment(ctx.user.id, input.courseSlug),
      ]);
      const completedModules = new Set(moduleProgress.filter((item) => item.completed).map((item) => item.moduleIndex)).size;
      const completedLabs = new Set(labProgress.filter((item) => item.completed).map((item) => item.labIndex)).size;
      if (completedModules < requirements.moduleCount || completedLabs < requirements.labCount || !assessment?.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Conclua os ${requirements.moduleCount} módulos, os ${requirements.labCount} laboratórios guiados e seja aprovado na avaliação final antes de emitir o certificado.`,
        });
      }

      const displayName = input.displayName?.trim();
      if (displayName) await db.updateEmailUserProfile(ctx.user.id, { name: displayName });
      const identifier = `CDA-${input.courseSlug.toUpperCase()}-U${ctx.user.id}-${Date.now()}`;
      const result = await db.createCourseCertificate({
        userId: ctx.user.id,
        courseSlug: input.courseSlug,
        courseTitle: requirements.title,
        studentName: displayName || ctx.user.name || ctx.user.email || "Aluno(a) CyberDimension",
        identifier,
      });
      const achievements = await syncCourseAchievements(ctx.user.id, input.courseSlug);
      return { id: result.id, identifier: result.identifier, achievements };
    }),
  }),

  grcApplied: router({
    assessment: protectedProcedure.query(() => ({
      questions: getGrcAppliedAssessment(),
      passingScore: grcAppliedPassingScore,
    })),
    state: protectedProcedure.query(async ({ ctx }) => {
      const [sections, attempts, certificate] = await Promise.all([
        db.getStandaloneLessonProgress(ctx.user.id, grcAppliedLessonSlug),
        db.getStandaloneLessonAssessmentAttempts(ctx.user.id, grcAppliedLessonSlug),
        db.getCourseCertificateByUserAndSlug(ctx.user.id, grcAppliedLessonSlug),
      ]);
      return { sections, attempts, certificate: certificate ?? null, totalSections: grcAppliedSectionIds.length, passingScore: grcAppliedPassingScore };
    }),
    markSectionComplete: protectedProcedure.input(z.object({ sectionId: z.enum(grcAppliedSectionIds) })).mutation(async ({ ctx, input }) => {
      await db.saveStandaloneLessonProgress({
        userId: ctx.user.id,
        lessonSlug: grcAppliedLessonSlug,
        sectionId: input.sectionId,
        completedAt: new Date(),
      });
      return { success: true };
    }),
    submitAssessment: protectedProcedure.input(z.object({ answers: z.array(z.number().int().min(0).max(3)).length(5) })).mutation(async ({ ctx, input }) => {
      const completedSections = await db.getStandaloneLessonProgress(ctx.user.id, grcAppliedLessonSlug);
      const completedIds = new Set(completedSections.map((section) => section.sectionId));
      if (grcAppliedSectionIds.some((sectionId) => !completedIds.has(sectionId))) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua os cinco módulos da aula antes de realizar a avaliação." });
      }

      const result = gradeGrcAppliedAssessment(input.answers);
      await db.createStandaloneLessonAssessmentAttempt({
        userId: ctx.user.id,
        lessonSlug: grcAppliedLessonSlug,
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: input.answers,
        passed: result.passed,
      });

      const existingCertificate = await db.getCourseCertificateByUserAndSlug(ctx.user.id, grcAppliedLessonSlug);
      let certificate = existingCertificate ? { id: existingCertificate.id, identifier: existingCertificate.identifier } : null;
      if (result.passed && !certificate) {
        const identifier = `CDA-GRC-APLICADO-U${ctx.user.id}-${Date.now()}`;
        const created = await db.createCourseCertificate({
          userId: ctx.user.id,
          courseSlug: grcAppliedLessonSlug,
          courseTitle: grcAppliedCertificateTitle,
          studentName: ctx.user.name || ctx.user.email || "Aluno(a) CyberDimension",
          identifier,
        });
        certificate = { id: created.id, identifier: created.identifier };
      }

      return { ...result, certificate };
    }),
  }),

  technicalEnglish: router({
    assessment: protectedProcedure.query(() => ({
      questions: getTechnicalEnglishAssessment(),
      passingScore: technicalEnglishPassingScore,
    })),
    state: protectedProcedure.query(async ({ ctx }) => {
      const [sections, attempts, certificate] = await Promise.all([
        db.getStandaloneLessonProgress(ctx.user.id, technicalEnglishLessonSlug),
        db.getStandaloneLessonAssessmentAttempts(ctx.user.id, technicalEnglishLessonSlug),
        db.getCourseCertificateByUserAndSlug(ctx.user.id, technicalEnglishLessonSlug),
      ]);
      return { sections, attempts, certificate: certificate ?? null, totalSections: technicalEnglishSectionIds.length, passingScore: technicalEnglishPassingScore };
    }),
    markSectionComplete: protectedProcedure.input(z.object({ sectionId: z.enum(technicalEnglishSectionIds) })).mutation(async ({ ctx, input }) => {
      await db.saveStandaloneLessonProgress({
        userId: ctx.user.id,
        lessonSlug: technicalEnglishLessonSlug,
        sectionId: input.sectionId,
        completedAt: new Date(),
      });
      return { success: true };
    }),
    submitAssessment: protectedProcedure.input(z.object({ answers: z.array(z.number().int().min(0).max(3)).length(10) })).mutation(async ({ ctx, input }) => {
      const completedSections = await db.getStandaloneLessonProgress(ctx.user.id, technicalEnglishLessonSlug);
      const completedIds = new Set(completedSections.map((section) => section.sectionId));
      if (technicalEnglishSectionIds.some((sectionId) => !completedIds.has(sectionId))) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua os seis módulos da aula antes de realizar a avaliação." });
      }

      const result = gradeTechnicalEnglishAssessment(input.answers);
      await db.createStandaloneLessonAssessmentAttempt({
        userId: ctx.user.id,
        lessonSlug: technicalEnglishLessonSlug,
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: input.answers,
        passed: result.passed,
      });

      const existingCertificate = await db.getCourseCertificateByUserAndSlug(ctx.user.id, technicalEnglishLessonSlug);
      let certificate = existingCertificate ? { id: existingCertificate.id, identifier: existingCertificate.identifier } : null;
      if (result.passed && !certificate) {
        const identifier = `CDA-ENG-TECH-U${ctx.user.id}-${Date.now()}`;
        const created = await db.createCourseCertificate({
          userId: ctx.user.id,
          courseSlug: technicalEnglishLessonSlug,
          courseTitle: technicalEnglishCertificateTitle,
          studentName: ctx.user.name || ctx.user.email || "Aluno(a) CyberDimension",
          identifier,
        });
        certificate = { id: created.id, identifier: created.identifier };
      }

      return { ...result, certificate };
    }),
  }),

  certificates: router({
    issue: protectedProcedure.input(z.object({ domainId: z.number(), displayName: z.string().trim().min(2).max(120).optional() })).mutation(async ({ ctx, input }) => {
      const lessonCount = await db.getLessonsCountByDomain(input.domainId);
      const completedProgress = await db.getProgressByDomainAndUser(input.domainId, ctx.user.id);
      const completedCount = completedProgress.filter(p => p.completed).length;
      if (completedCount < lessonCount) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Complete todas as ${lessonCount} lições antes de emitir o certificado. Você completou ${completedCount}.` });
      }
      const displayName = input.displayName?.trim();
      if (displayName) await db.updateEmailUserProfile(ctx.user.id, { name: displayName });
      const identifier = `CDA-${ctx.user.id}-${input.domainId}-${Date.now()}`;
      const result = await db.createCertificate({
        userId: ctx.user.id,
        domainId: input.domainId,
        identifier,
      });
      return { identifier: result.identifier, id: result.id };
    }),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const cert = await db.getCertificateById(input.id);
      if (!cert) return null;
      const d = await db.getDb();
      if (!d) return null;
      const { users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const userResult = await d.select().from(users).where(eq(users.id, cert.userId)).limit(1);
      const domain = await db.getDomainById(cert.domainId);
      return { ...cert, userName: userResult[0]?.name || userResult[0]?.email || "Unknown", domainTitle: domain?.title || "Unknown" };
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getCertificatesByUser(ctx.user.id);
    }),
    history: protectedProcedure.query(async ({ ctx }) => {
      const [legacyCertificates, formationCertificates, domainList] = await Promise.all([
        db.getCertificatesByUser(ctx.user.id),
        db.getCourseCertificatesByUser(ctx.user.id),
        db.getDomains(),
      ]);
      const domainsById = new Map(domainList.map((domain) => [domain.id, domain.title]));
      return [
        ...formationCertificates.map((certificate) => ({ id: certificate.id, identifier: certificate.identifier, title: certificate.courseTitle, issuedAt: certificate.issuedAt, type: "formation" as const, downloadUrl: `/certificate/course/${certificate.id}` })),
        ...legacyCertificates.map((certificate) => ({ id: certificate.id, identifier: certificate.identifier, title: domainsById.get(certificate.domainId) || "CompTIA Security+ SY0-701", issuedAt: certificate.issuedAt, type: "security-plus" as const, downloadUrl: `/certificate/${certificate.id}` })),
      ].sort((first, second) => new Date(second.issuedAt).getTime() - new Date(first.issuedAt).getTime());
    }),
    courseById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getCourseCertificateById(input.id);
    }),
    verify: publicProcedure.input(z.object({ identifier: z.string().trim() })).query(async ({ input }) => {
      if (!input.identifier) return null;
      const courseCertificate = await db.getCourseCertificateByIdentifier(input.identifier);
      if (courseCertificate) {
        return {
          identifier: courseCertificate.identifier,
          studentName: courseCertificate.studentName,
          courseTitle: courseCertificate.courseTitle,
          issuedAt: courseCertificate.issuedAt,
          type: "formation" as const,
        };
      }

      const legacyCertificate = await db.getCertificateByIdentifier(input.identifier);
      if (!legacyCertificate) return null;
      const d = await db.getDb();
      if (!d) return null;
      const { users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const userResult = await d.select().from(users).where(eq(users.id, legacyCertificate.userId)).limit(1);
      const domain = await db.getDomainById(legacyCertificate.domainId);
      return {
        identifier: legacyCertificate.identifier,
        studentName: userResult[0]?.name || userResult[0]?.email || "Aluno(a) CyberDimension",
        courseTitle: domain?.title || "CompTIA Security+ SY0-701",
        issuedAt: legacyCertificate.issuedAt,
        type: "security-plus" as const,
      };
    }),
  }),

  badges: router({
    verify: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
      const achievement = await db.getPublicCourseAchievement(input.id);
      if (!achievement) return null;
      const definition = courseBadgeDefinitions.find((badge) => badge.code === achievement.badgeCode);
      const course = getOrbitCourseRequirements(achievement.courseSlug);
      if (!definition || !course) return null;
      return {
        id: achievement.id,
        badgeCode: achievement.badgeCode,
        badgeTitle: definition.title,
        badgeDescription: definition.description,
        tier: definition.tier,
        courseTitle: course.title,
        studentName: achievement.studentName || "Aluno(a) CyberDimension",
        unlockedAt: achievement.unlockedAt,
      };
    }),
  }),

  tutor: router({
    chat: protectedProcedure.input(z.object({
      message: z.string().trim().min(2, "Escreva uma dúvida para conversar com o tutor.").max(1_200),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2_000),
      })).max(8).optional(),
      context: z.enum(["security-plus", "grc", "general"]).optional(),
      lessonContext: z.string().trim().max(3_000).optional(),
    })).mutation(async ({ input }) => {
      const suggestedPrompts = getTutorSuggestedPrompts(input.context);
      if (isTutorUnsafeRequest(input.message)) {
        return { response: getTutorSafetyResponse(), suggestedPrompts };
      }

      const domains = await db.getDomains();
      const history = input.history ?? [];

      const tutorMessages = [
        {
          role: "system" as const,
          content: buildTutorSystemPrompt(domains, input.lessonContext),
        },
        ...history,
        {
          role: "user" as const,
          content: input.message,
        },
      ];

      const nvidiaResponse = await invokeNvidiaTutor(tutorMessages);
      if (nvidiaResponse) return { response: nvidiaResponse, suggestedPrompts, provider: "nvidia" as const };

      const result = await invokeLLM({ messages: tutorMessages });
      const response = result.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua pergunta.";
      return { response: typeof response === "string" ? response : JSON.stringify(response), suggestedPrompts, provider: "builtin" as const };
    }),
  }),

  admin: router({
    podcastListening: adminProcedure.query(async () => db.getPodcastListeningReport()),
    stats: adminProcedure.query(async () => {
      return db.getPlatformStats();
    }),
    users: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),
    userProgress: adminProcedure.input(z.object({ userId: z.number(), domainId: z.number() })).query(async ({ input }) => {
      return db.getUserProgressByDomain(input.userId, input.domainId);
    }),
    certificates: adminProcedure.query(async () => {
      const d = await db.getDb();
      if (!d) return [];
      const { certificates, users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const allCerts = await d.select().from(certificates);
      return Promise.all(allCerts.map(async (c) => {
        const u = await d.select().from(users).where(eq(users.id, c.userId)).limit(1);
        const dom = await db.getDomainById(c.domainId);
        return { ...c, userName: u[0]?.name || u[0]?.email || "Unknown", domainTitle: dom?.title || "Unknown" };
      }));
    }),
    externalSources: adminProcedure.query(async () => {
      return db.getExternalContentSources();
    }),
    portfolioEvidence: adminProcedure.input(z.object({ search: z.string().trim().max(120).optional(), courseSlug: z.string().trim().max(120).optional() }).optional()).query(async ({ input }) => db.getAllPortfolioItemsWithFilters(input ?? {})),
    projectReviews: adminProcedure.query(async () => db.getAllProjectCompletionsWithUsers()),
    reviewProject: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["submitted", "in_review", "needs_changes", "approved"]), rubric: z.record(z.string(), z.number().int().min(0).max(4)), reviewerComment: z.string().trim().max(3000).optional() })).mutation(async ({ ctx, input }) => { await db.reviewProjectCompletion({ id: input.id, status: input.status, rubric: input.rubric, reviewerComment: input.reviewerComment?.trim() || null, reviewedByUserId: ctx.user.id }); return { success: true }; }),
    portfolioCourseSlugs: adminProcedure.query(async () => db.getPortfolioCourseSlugs()),
    removePortfolioEvidence: adminProcedure.input(z.object({
      itemId: z.number().int().min(1),
    })).mutation(async ({ input }) => {
      await db.deletePortfolioItemById(input.itemId);
      return { success: true };
    }),
    createExternalSource: adminProcedure.input(z.object({
      courseSlug: z.string().trim().max(120).optional(),
      category: z.enum(["YouTube", "Documentação", "Curso externo", "Artigo", "CTF", "Ferramenta", "Podcast", "Outro"]),
      title: z.string().trim().min(3).max(255),
      source: z.string().trim().min(2).max(255),
      license: z.string().trim().min(3).max(255),
      usage: z.string().trim().min(12).max(2000),
      href: z.string().trim().url().max(1000),
    })).mutation(async ({ ctx, input }) => {
      await db.createExternalContentSource({
        courseSlug: input.courseSlug || null,
        category: input.category,
        title: input.title,
        source: input.source,
        license: input.license,
        usage: input.usage,
        href: input.href,
        createdByUserId: ctx.user.id,
      });
      return { success: true };
    }),
  }),
  career: router({
    questions: publicProcedure.query(() => CAREER_QUESTIONS),
    submit: protectedProcedure
      .input(z.object({ answers: z.record(z.string(), z.enum(["soc", "pentest", "grc", "cloud", "forense", "engenharia"] as const)) }))
      .mutation(async ({ ctx, input }) => {
        const normalizedAnswers: Record<number, CareerArea> = {};
        for (const [rawKey, area] of Object.entries(input.answers)) {
          const key = Number(rawKey);
          if (!Number.isInteger(key) || key < 1 || key > CAREER_QUESTIONS.length) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas." });
          }
          normalizedAnswers[key] = area;
        }
        const answeredIds = Object.keys(normalizedAnswers).map(Number).sort((a, b) => a - b);
        const expectedIds = CAREER_QUESTIONS.map((question) => question.id);
        if (JSON.stringify(answeredIds) !== JSON.stringify(expectedIds)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Responda todas as questões do teste." });
        }
        const result = gradeCareerQuiz(normalizedAnswers);
        await db.saveCareerQuizResult({
          userId: ctx.user.id,
          topArea: result.topArea,
          topScore: result.topScore,
          runnerUpArea: result.runnerUpArea,
          runnerUpScore: result.runnerUpScore,
          scoresJson: JSON.stringify(result.scores),
          awardedXp: CAREER_XP_REWARD,
        });
        const topAreaInfo = CAREER_AREAS.find((area) => area.key === result.topArea);
        const displayName = ctx.user.name || ctx.user.email || "Aluno(a) CyberDimension";
        const identifier = `CDA-CAREER-${ctx.user.id}-${Date.now()}`;
        const courseSlug = "descubra-sua-carreira";
        const courseTitle = topAreaInfo
          ? `Descubra Sua Carreira · Perfil: ${topAreaInfo.label}`
          : "Descubra Sua Carreira";
        const certificate = await db.upsertCourseCertificate(
          ctx.user.id,
          courseSlug,
          courseTitle,
          displayName,
          identifier,
        );
        return { result, xp: CAREER_XP_REWARD, certificate };
      }),
    myResult: protectedProcedure.query(async ({ ctx }) => db.getCareerQuizResultByUser(ctx.user.id)),
    myCertificate: protectedProcedure.query(async ({ ctx }) =>
      db.getCourseCertificateByUserAndSlug(ctx.user.id, "descubra-sua-carreira"),
    ),
  }),
  /** Atualiza o nome do aluno em todos os certificados emitidos (perfil atualizado). */
  certificatesRefreshName: protectedProcedure.mutation(async ({ ctx }) => {
    const dbRef = await db.getDb();
    if (!dbRef) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco indisponível." });
    const { courseCertificates, users } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const liveUser = await dbRef.select().from(users).where(eq(users.id, ctx.user.id)).limit(1).then((rows) => rows[0]);
    const displayName = liveUser?.name || liveUser?.email || ctx.user.name || ctx.user.email || "Aluno(a) CyberDimension";
    await dbRef
      .update(courseCertificates)
      .set({ studentName: displayName })
      .where(eq(courseCertificates.userId, ctx.user.id));
    return { updated: true, studentName: displayName };
  }),
  cyberProjects: router({
    list: publicProcedure.query(async () => {
      const { cyberProjects } = await import("../client/src/data/cyberProjects");
      return cyberProjects.map(({ steps, ...project }) => project);
    }),
    details: publicProcedure.input(z.object({ projectId: z.string().trim().min(1).max(80) })).query(async ({ input }) => {
      const { cyberProjects } = await import("../client/src/data/cyberProjects");
      const project = cyberProjects.find((candidate) => candidate.id === input.projectId);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Projeto não encontrado." });
      return project;
    }),
    completions: protectedProcedure.query(async ({ ctx }) => db.getProjectCompletionsByUser(ctx.user.id)),
    complete: protectedProcedure.input(z.object({
      projectId: z.string().trim().min(1).max(80),
      summary: z.string().trim().max(3000).optional(),
      rubric: z.record(z.string(), z.number().int().min(0).max(4)).optional(),
    })).mutation(async ({ ctx, input }) => {
      const { cyberProjects } = await import("../client/src/data/cyberProjects");
      const project = cyberProjects.find((candidate) => candidate.id === input.projectId);
      if (!project) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Projeto não encontrado no programa Cyber Projects." });
      }
      await db.createProjectCompletion({
        userId: ctx.user.id,
        projectId: input.projectId,
        summary: input.summary || null,
        rubric: input.rubric ?? null,
      });
      return { success: true, xp: PROJECT_XP_REWARD, project: { id: project.id, title: project.title, area: project.area, level: project.level } };
    }),
      remove: protectedProcedure.input(z.object({ projectId: z.string().trim().min(1).max(80) })).mutation(async ({ ctx, input }) => {
      await db.removeProjectCompletion({ userId: ctx.user.id, projectId: input.projectId });
      return { success: true };
    }),
  }),
  ctf: router({
    list: publicProcedure.query(async () => {
      const catalog = await import("../shared/ctfCatalog");
      return catalog.getCtfCatalog().map((entry) => ({ ...entry }));
    }),
    completions: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.getCtfCompletionsByUser(ctx.user.id);
      return rows.map((row) => row.ctfId);
    }),
    /**
     * Perguntas de verificação dos desafios (sem expor as respostas).
     * Usadas no diálogo de verificação antes de conceder XP.
     */
    verification: publicProcedure.query(async () => {
      const catalog = await import("../shared/ctfCatalog");
      return catalog.CTF_VERIFICATION_QUESTIONS.map((question) => ({
        ctfId: question.ctfId,
        question: question.question,
        answerHint: question.answerHint,
      }));
    }),
    toggleComplete: protectedProcedure.input(z.object({
      ctfId: z.string().trim().min(1).max(80),
      completed: z.boolean(),
      answer: z.string().trim().min(1).max(300).optional(),
    })).mutation(async ({ ctx, input }) => {
      const catalog = await import("../shared/ctfCatalog");
      const entry = catalog.getCtf(input.ctfId);
      if (!entry) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Desafio CTF inválido." });
      }
      if (input.completed) {
        const verification = catalog.getCtfVerificationQuestion(input.ctfId);
        if (verification && !catalog.isCtfAnswerCorrect(input.ctfId, input.answer ?? "")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Resposta incorreta. Relembre o desafio na plataforma externa e tente a verificação novamente.",
          });
        }
        const result = await db.setCtfCompletion(ctx.user.id, input.ctfId);
        const totalCompleted = await db.countCtfCompletionsByUser(ctx.user.id);
        const milestone = getFirstCtfMilestone(totalCompleted);
        if (milestone) {
          await db.awardCourseAchievements([{ userId: ctx.user.id, courseSlug: "ctf-hub", badgeCode: milestone.code, unlockedAt: new Date() }]);
        }
        return {
          completed: true,
          xp: result.created ? entry.xp : 0,
          totalCompleted,
          milestone: milestone ? { code: milestone.code, label: milestone.label } : null,
        };
      }
      await db.unsetCtfCompletion(ctx.user.id, input.ctfId);
      const totalCompleted = await db.countCtfCompletionsByUser(ctx.user.id);
      return { completed: false, xp: 0, totalCompleted, milestone: null };
    }),
  }),
  audiolab: router({
    listSeries: publicProcedure.query(() => AUDIO_LAB_SERIES),
    episodes: publicProcedure
      .input(z.object({ series: z.string().trim().min(1).optional() }).optional())
      .query(({ input }) => {
        const filtered = input?.series
          ? audioLabEpisodes.filter((episode) => episode.series === input.series)
          : audioLabEpisodes;
        return { episodes: filtered, series: AUDIO_LAB_SERIES };
      }),
    getProgress: protectedProcedure.query(async ({ ctx }) => db.getAudioLabProgress(ctx.user.id)),
    saveProgress: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100),
      positionSeconds: z.number().int().min(0).max(4 * 60 * 60),
      completed: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const episode = audioLabEpisodes.find((episode) => episode.id === input.episodeId);
      if (!episode) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Episódio do Audio Lab inválido." });
      }
      const result = await db.saveAudioLabProgress({
        userId: ctx.user.id,
        episodeId: input.episodeId,
        positionSeconds: input.positionSeconds,
        completed: input.completed,
      });
      return {
        success: true,
        completed: result.completed,
        justCompleted: result.justCompleted,
        awardedXp: result.justCompleted ? 50 : 0,
      };
    }),
    quiz: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100),
    })).query(({ input }) => {
      const questions = getAudioLabQuiz(input.episodeId);
      if (!questions) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Quiz indisponível para este episódio." });
      }
      const competency = getAudioLabCompetency(input.episodeId);
      return { questions: questions.map((question) => ({ id: question.id, prompt: question.prompt, options: [...question.options] })), competency };
    }),
    quizStatus: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100),
    })).query(async ({ ctx, input }) => {
      const latest = await db.getLatestAudioLabQuizAttempt(ctx.user.id, input.episodeId);
      if (!latest) return { submitted: false };
      return {
        submitted: true,
        score: latest.score,
        totalQuestions: latest.totalQuestions,
        percentage: Math.round((latest.score / latest.totalQuestions) * 100),
      };
    }),
    submitQuiz: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100),
      answers: z.array(z.number().int().min(0).max(3)).min(5).max(5),
    })).mutation(async ({ ctx, input }) => {
      const episode = audioLabEpisodes.find((current) => current.id === input.episodeId);
      if (!episode) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Episódio do Audio Lab inválido." });
      }
      const entry = quizBank[input.episodeId];
      if (!entry) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Quiz indisponível para este episódio." });
      }
      const progress = await db.getAudioLabProgress(ctx.user.id);
      const episodeProgress = progress.find((current) => current.episodeId === input.episodeId);
      if (!episodeProgress?.completed) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Conclua a escuta do episódio antes de enviar o quiz de revisão." });
      }
      const grade = gradeAudioLabQuiz(input.episodeId, input.answers);
      if (!grade) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Respostas inválidas para o quiz do episódio." });
      }
      const attempt = await db.createAudioLabQuizAttempt({
        userId: ctx.user.id,
        episodeId: input.episodeId,
        score: grade.score,
        totalQuestions: grade.totalQuestions,
        answers: input.answers,
      });
      const quizXp = Math.max(0, Math.min(grade.score, grade.totalQuestions)) * AUDIO_LAB_QUIZ_XP_PER_CORRECT;
      return { ...grade, attemptId: attempt.id, quizXp, competency: entry.competency };
    }),
    favorites: protectedProcedure.query(async ({ ctx }) => {
      const favoriteRows = await db.getAudioLabFavorites(ctx.user.id);
      const validIds = new Set(audioLabEpisodes.map((episode) => episode.id));
      return {
        episodeIds: favoriteRows
          .map((row) => row.episodeId)
          .filter((episodeId) => validIds.has(episodeId)),
      };
    }),
    toggleFavorite: protectedProcedure.input(z.object({
      episodeId: z.string().trim().min(1).max(100).refine(
        (episodeId) => audioLabEpisodes.some((episode) => episode.id === episodeId),
        "Episódio do Audio Lab inválido.",
      ),
    })).mutation(async ({ ctx, input }) => db.toggleAudioLabFavorite(ctx.user.id, input.episodeId)),
    claimSeriesBadges: protectedProcedure.mutation(async ({ ctx }) => {
      const progress = await db.getAudioLabProgress(ctx.user.id);
      const progressByEpisode = new Map<string, boolean>();
      for (const entry of progress) progressByEpisode.set(entry.episodeId, entry.completed);
      const badgesToAward: { courseSlug: string; badgeCode: string }[] = [];
      for (const series of AUDIO_LAB_SERIES) {
        const seriesEpisodes = audioLabEpisodes.filter((episode) => episode.series === series.code);
        const completedCount = seriesEpisodes.filter((episode) => progressByEpisode.get(episode.id)).length;
        if (completedCount >= seriesEpisodes.length && seriesEpisodes.length > 0) {
          badgesToAward.push({ courseSlug: "audiolab", badgeCode: `audiolab-${series.code}-completion` });
        } else if (completedCount >= 10) {
          badgesToAward.push({ courseSlug: "audiolab", badgeCode: `audiolab-${series.code}-listener-10` });
        }
      }
      const alreadyAwarded = new Set(
        (await db.getCourseAchievements(ctx.user.id, "audiolab")).map((entry) => entry.badgeCode),
      );
      const newlyAwarded = badgesToAward.filter((badge) => !alreadyAwarded.has(badge.badgeCode));
      for (const badge of newlyAwarded) {
        await db.awardAudioLabBadge({ userId: ctx.user.id, courseSlug: badge.courseSlug, badgeCode: badge.badgeCode });
      }
      return { newlyAwarded, xpGranted: newlyAwarded.length * 75 };
    }),
  }),

});

function getFirstCtfMilestone(totalCompleted: number): { code: string; label: string } | null {
  if (totalCompleted === 1) return { code: "primeiro-flag", label: "Primeiro Flag" };
  if (totalCompleted === 10) return { code: "flag-hunter", label: "Flag Hunter" };
  return null;
}

export type AppRouter = typeof appRouter;
