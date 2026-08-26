import { and, asc, count, countDistinct, desc, eq, gte, gt, inArray, isNotNull, isNull, lte, or, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, domains, lessons, questions, quizAttempts, progress, certificates, InsertDomain, InsertLesson, InsertQuestion, InsertQuizAttempt, InsertProgress, InsertCertificate, courseModuleProgress, courseModuleQuizAttempts, courseLabProgress, courseLabRuns, courseCertificates, courseAssessments, courseAssessmentAttempts, courseAchievements, standaloneLessonProgress, standaloneLessonAssessmentAttempts, InsertCourseModuleProgress, InsertCourseModuleQuizAttempt, InsertCourseLabProgress, InsertCourseLabRun, InsertCourseCertificate, InsertCourseAssessment, InsertCourseAssessmentAttempt, InsertCourseAchievement, InsertStandaloneLessonProgress, InsertStandaloneLessonAssessmentAttempt, passwordResetTokens, magicLinkTokens, weeklyChallengeRewards, InsertWeeklyChallengeReward, courseFavorites, courseVideoProgress, InsertCourseVideoProgress, courseVideoNotes, InsertCourseVideoNote, courseVideoQuizAttempts, InsertCourseVideoQuizAttempt, specialtySimulationAttempts, InsertSpecialtySimulationAttempt } from "../drizzle/schema";
import { quizStreakRewards, InsertQuizStreakReward, podcastEpisodeFavorites, dailyStudyStreaks, dailyStreakRewards, InsertDailyStreakReward, domainMasteryBadges, InsertDomainMasteryBadge } from "../drizzle/schema";
import { externalContentSources, InsertExternalContentSource, podcastProgress, InsertPodcastProgress, podcastQuizAttempts, InsertPodcastQuizAttempt, podcastListenerBadges, InsertPodcastListenerBadge, englishVocabularyFavorites, InsertEnglishVocabularyFavorite, englishInterviewAttempts, InsertEnglishInterviewAttempt, flashcardSrsAttempts, freeVideoCourseProgress, portfolioItems, InsertPortfolioItem, careerQuizResults, InsertCareerQuizResult, projectCompletions, InsertProjectCompletion, ctfCompletions, InsertCtfCompletion, audioLabProgress, InsertAudioLabProgress, audioLabQuizAttempts, InsertAudioLabQuizAttempt, audioLabFavorites, InsertAudioLabFavorite, lessonNotes, InsertLessonNote, lessonBookmarks, InsertLessonBookmark } from "../drizzle/schema";
import { ENV } from './_core/env';
import { activatedCatalogCourses } from "../shared/activatedCatalogCourses";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "passwordHash", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmailUser(input: {
  openId: string;
  name: string;
  email: string;
  passwordHash?: string | null;
  role?: "user" | "admin";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(users).values({
    openId: input.openId,
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash ?? null,
    loginMethod: "email",
    role: input.role ?? "user",
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(input.openId);
  if (!user) throw new Error("Email user was not created");
  return user;
}

export async function ensureEmailAdmin(input: {
  openId: string;
  email: string;
  passwordHash: string;
  name: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserByEmail(input.email);
  if (existing) {
    if (!existing.passwordHash || existing.role !== "admin" || existing.loginMethod !== "email") {
      await db
        .update(users)
        .set({
          passwordHash: input.passwordHash,
          loginMethod: "email",
          role: "admin",
          lastSignedIn: new Date(),
        })
        .where(eq(users.id, existing.id));
    }
    const refreshed = await getUserByEmail(input.email);
    if (!refreshed) throw new Error("Admin email user was not updated");
    return refreshed;
  }

  return createEmailUser({ ...input, role: "admin" });
}

export async function markUserSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function updateEmailUserProfile(userId: number, input: { name: string; avatarUrl?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const update: { name: string; avatarUrl?: string | null } = { name: input.name };
  if (input.avatarUrl !== undefined) update.avatarUrl = input.avatarUrl;
  await db.update(users).set(update).where(eq(users.id, userId));
  return getUserByOpenId((await db.select({ openId: users.openId }).from(users).where(eq(users.id, userId)).limit(1))[0]?.openId ?? "");
}

export async function createPasswordResetToken(input: { userId: number; tokenHash: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  await db.update(passwordResetTokens).set({ usedAt: now }).where(and(eq(passwordResetTokens.userId, input.userId), isNull(passwordResetTokens.usedAt)));
  await db.insert(passwordResetTokens).values({ ...input, createdAt: now });
}

export async function consumePasswordResetToken(input: { tokenHash: string; passwordHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  const token = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, input.tokenHash)).limit(1);
  const found = token[0];
  if (!found || found.usedAt || found.expiresAt <= now) return undefined;

  const result = await db.update(passwordResetTokens)
    .set({ usedAt: now })
    .where(and(eq(passwordResetTokens.id, found.id), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, now)));
  if (!result[0]?.affectedRows) return undefined;

  await db.update(users).set({ passwordHash: input.passwordHash }).where(eq(users.id, found.userId));
  return getUserByOpenId((await db.select({ openId: users.openId }).from(users).where(eq(users.id, found.userId)).limit(1))[0]?.openId ?? "");
}

export async function createMagicLinkToken(input: { userId: number; tokenHash: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  await db.update(magicLinkTokens)
    .set({ usedAt: now })
    .where(and(eq(magicLinkTokens.userId, input.userId), isNull(magicLinkTokens.usedAt)));
  await db.insert(magicLinkTokens).values({ ...input, createdAt: now });
}

export async function consumeMagicLinkToken(input: { tokenHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  const records = await db.select().from(magicLinkTokens).where(eq(magicLinkTokens.tokenHash, input.tokenHash)).limit(1);
  const record = records[0];
  if (!record || record.usedAt || record.expiresAt <= now) return undefined;

  const result = await db.update(magicLinkTokens)
    .set({ usedAt: now })
    .where(and(eq(magicLinkTokens.id, record.id), isNull(magicLinkTokens.usedAt), gt(magicLinkTokens.expiresAt, now)));
  if (!result[0]?.affectedRows) return undefined;

  const user = await db.select().from(users).where(eq(users.id, record.userId)).limit(1);
  return user[0];
}

// Domains
export async function getDomains() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(domains).orderBy(domains.order);
}

export async function getDomainById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(domains).where(eq(domains.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Lesson notes & bookmarks (Modo Estudo)
export async function getLessonNotes(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessonNotes)
    .where(and(eq(lessonNotes.userId, userId), eq(lessonNotes.lessonId, lessonId)))
    .orderBy(desc(lessonNotes.updatedAt));
}

export async function saveLessonNote(entry: InsertLessonNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(lessonNotes).values(entry);
}

export async function updateLessonNote(input: { id: number; userId: number; title: string; content: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(lessonNotes)
    .set({ title: input.title, content: input.content })
    .where(and(eq(lessonNotes.id, input.id), eq(lessonNotes.userId, input.userId)));
}

export async function removeLessonNote(userId: number, noteId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(lessonNotes).where(and(eq(lessonNotes.id, noteId), eq(lessonNotes.userId, userId)));
}

export async function getAllLessonNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessonNotes).where(eq(lessonNotes.userId, userId)).orderBy(desc(lessonNotes.updatedAt));
}

export async function getLessonBookmarks(userId: number, lessonId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (lessonId === undefined) {
    return db.select().from(lessonBookmarks)
      .where(eq(lessonBookmarks.userId, userId))
      .orderBy(desc(lessonBookmarks.createdAt));
  }
  return db.select().from(lessonBookmarks)
    .where(and(eq(lessonBookmarks.userId, userId), eq(lessonBookmarks.lessonId, lessonId)))
    .orderBy(desc(lessonBookmarks.createdAt));
}

export async function saveLessonBookmark(entry: InsertLessonBookmark) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(lessonBookmarks).values(entry);
}

export async function removeLessonBookmark(userId: number, bookmarkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(lessonBookmarks).where(and(eq(lessonBookmarks.id, bookmarkId), eq(lessonBookmarks.userId, userId)));
}

// Lessons
export async function getLessonsByDomain(domainId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.domainId, domainId)).orderBy(lessons.order);
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Questions
export async function getQuestionsByDomain(domainId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions).where(eq(questions.domainId, domainId));
}
export async function getQuestionsByIds(ids: number[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];
  return db.select().from(questions).where(inArray(questions.id, ids));
}

export async function getAllRandomQuestions(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  // Get questions from all 5 domains with balanced distribution
  const allQuestions = await db.select().from(questions);
  const byDomain: Record<number, typeof allQuestions> = {};
  for (const q of allQuestions) {
    if (!byDomain[q.domainId]) byDomain[q.domainId] = [];
    byDomain[q.domainId].push(q);
  }
  // Shuffle each domain's questions
  const shuffled: Record<number, typeof allQuestions> = {};
  for (const [domainId, qs] of Object.entries(byDomain)) {
    shuffled[Number(domainId)] = qs.sort(() => Math.random() - 0.5);
  }
  // Distribute questions across domains proportionally
  const result: typeof allQuestions = [];
  const domainIds = Object.keys(shuffled).map(Number);
  const perDomain = Math.ceil(limit / domainIds.length);
  for (const dId of domainIds) {
    const take = Math.min(perDomain, shuffled[dId].length);
    result.push(...shuffled[dId].slice(0, take));
  }
  // If we have more than limit, trim; if less, add more
  if (result.length > limit) {
    return result.sort(() => Math.random() - 0.5).slice(0, limit);
  }
  // Fill remaining from random pool
  const usedIds = new Set(result.map(q => q.id));
  const remaining = allQuestions.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
  for (const q of remaining) {
    if (result.length >= limit) break;
    result.push(q);
  }
  return result.sort(() => Math.random() - 0.5);
}

export async function getRandomQuestions(domainId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions).where(eq(questions.domainId, domainId)).limit(limit);
}

// Quiz Attempts
export async function saveQuizAttempt(attempt: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quizAttempts).values(attempt);
  return { id: result[0].insertId };
}

export async function getQuizAttemptsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)).orderBy(desc(quizAttempts.createdAt));
}

export async function getQuizAttemptsByUserAndDomain(userId: number, domainId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.domainId, domainId)))
    .orderBy(desc(quizAttempts.createdAt));
}
/** Total quiz attempts recorded by a student in one Security+ study domain. */
export async function countQuizAttemptsByUserAndDomain(userId: number, domainId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ total: count() }).from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.domainId, domainId)));
  return rows[0]?.total ?? 0;
}

// Progress
export async function saveProgress(entry: InsertProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(progress).values(entry);
}

export async function removeLessonProgress(input: { userId: number; domainId: number; lessonId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(progress).where(and(
    eq(progress.userId, input.userId),
    eq(progress.domainId, input.domainId),
    eq(progress.lessonId, input.lessonId),
  ));
}

export async function getProgressByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(progress).where(eq(progress.userId, userId));
}

export async function getProgressByUserAndDomain(userId: number, domainId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.domainId, domainId)));
}

export async function getLessonsCountByDomain(domainId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(lessons).where(eq(lessons.domainId, domainId));
  return result[0]?.count ?? 0;
}

export async function getContentStats() {
  const db = await getDb();
  if (!db) return { totalDomains: 0, totalLessons: 0, totalQuestions: 0 };

  const [domainCount, lessonCount, questionCount] = await Promise.all([
    db.select({ count: count() }).from(domains),
    db.select({ count: count() }).from(lessons),
    db.select({ count: count() }).from(questions),
  ]);

  return {
    totalDomains: domainCount[0]?.count ?? 0,
    totalLessons: lessonCount[0]?.count ?? 0,
    totalQuestions: questionCount[0]?.count ?? 0,
  };
}

export async function getProgressByDomainAndUser(domainId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(progress)
    .where(and(eq(progress.domainId, domainId), eq(progress.userId, userId)));
}

// Certificates
export async function createCertificate(cert: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(certificates).values(cert);
  return { id: result[0].insertId, identifier: cert.identifier };
}

export async function getCertificateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCertificateByIdentifier(identifier: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.identifier, identifier)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCertificatesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issuedAt));
}

// ORBIT formation progress and certificates
export async function saveCourseModuleProgress(entry: InsertCourseModuleProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(courseModuleProgress).values(entry).onDuplicateKeyUpdate({
    set: { completed: entry.completed, completedAt: entry.completedAt ?? null },
  });
}

export async function saveCourseLabProgress(entry: InsertCourseLabProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(courseLabProgress).values(entry).onDuplicateKeyUpdate({
    set: { completed: entry.completed, completedAt: entry.completedAt ?? null },
  });
}

export async function createCourseLabRun(entry: InsertCourseLabRun) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseLabRuns).values(entry);
  return { id: result[0].insertId };
}

export async function getCourseLabRunById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseLabRuns)
    .where(and(eq(courseLabRuns.id, id), eq(courseLabRuns.userId, userId)))
    .limit(1);
  return result[0];
}

export async function markCourseLabRunVerified(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(courseLabRuns)
    .set({ verifiedAt: new Date() })
    .where(and(eq(courseLabRuns.id, id), eq(courseLabRuns.userId, userId)));
}

export async function getCourseModuleProgress(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseModuleProgress).where(and(eq(courseModuleProgress.userId, userId), eq(courseModuleProgress.courseSlug, courseSlug)));
}

export async function createCourseModuleQuizAttempt(entry: InsertCourseModuleQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseModuleQuizAttempts).values(entry);
  return { id: result[0].insertId };
}

export async function getCourseModuleQuizAttempts(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseModuleQuizAttempts)
    .where(and(eq(courseModuleQuizAttempts.userId, userId), eq(courseModuleQuizAttempts.courseSlug, courseSlug)))
    .orderBy(desc(courseModuleQuizAttempts.createdAt));
}

export async function createCourseVideoQuizAttempt(entry: InsertCourseVideoQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseVideoQuizAttempts).values(entry);
  return { id: result[0].insertId };
}

export async function getCourseVideoQuizAttempts(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseVideoQuizAttempts)
    .where(and(eq(courseVideoQuizAttempts.userId, userId), eq(courseVideoQuizAttempts.courseSlug, courseSlug)))
    .orderBy(desc(courseVideoQuizAttempts.createdAt));
}

export async function getAllCourseQuizAttemptsForStreak(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const [moduleAttempts, videoAttempts] = await Promise.all([
    db.select().from(courseModuleQuizAttempts).where(eq(courseModuleQuizAttempts.userId, userId)),
    db.select().from(courseVideoQuizAttempts).where(eq(courseVideoQuizAttempts.userId, userId)),
  ]);
  return [
    ...moduleAttempts.map((attempt) => ({ ...attempt, attemptType: "module" as const })),
    ...videoAttempts.map((attempt) => ({ ...attempt, attemptType: "video" as const })),
  ].sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime() || left.id - right.id);
}

export async function getQuizStreakRewardForAttempt(userId: number, attemptType: string, attemptId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quizStreakRewards)
    .where(and(eq(quizStreakRewards.userId, userId), eq(quizStreakRewards.attemptType, attemptType), eq(quizStreakRewards.attemptId, attemptId)))
    .limit(1);
  return result[0];
}

export async function getQuizStreakRewardsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizStreakRewards)
    .where(eq(quizStreakRewards.userId, userId))
    .orderBy(desc(quizStreakRewards.createdAt));
}

export async function claimQuizStreakReward(entry: InsertQuizStreakReward) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getQuizStreakRewardForAttempt(entry.userId, entry.attemptType, entry.attemptId);
  if (existing) return { claimed: false, reward: existing };
  await db.insert(quizStreakRewards).values(entry).onDuplicateKeyUpdate({
    set: { streakLength: entry.streakLength },
  });
  const reward = await getQuizStreakRewardForAttempt(entry.userId, entry.attemptType, entry.attemptId);
  return { claimed: true, reward };
}

export async function getCourseLabProgress(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseLabProgress).where(and(eq(courseLabProgress.userId, userId), eq(courseLabProgress.courseSlug, courseSlug)));
}

export async function getAllCourseProgressByUser(userId: number) {
  const db = await getDb();
  if (!db) return { modules: [], labs: [], certificates: [], favorites: [], videoProgress: [], videoNotes: [], streakRewards: [] };
  const [modules, labs, certs, favorites, videoProgress, videoNotes, streakRewards] = await Promise.all([
    db.select().from(courseModuleProgress).where(eq(courseModuleProgress.userId, userId)),
    db.select().from(courseLabProgress).where(eq(courseLabProgress.userId, userId)),
    db.select().from(courseCertificates).where(eq(courseCertificates.userId, userId)),
    db.select().from(courseFavorites).where(eq(courseFavorites.userId, userId)).orderBy(desc(courseFavorites.createdAt)),
    db.select().from(courseVideoProgress).where(eq(courseVideoProgress.userId, userId)).orderBy(desc(courseVideoProgress.updatedAt)),
    db.select().from(courseVideoNotes).where(eq(courseVideoNotes.userId, userId)).orderBy(desc(courseVideoNotes.updatedAt)),
    getQuizStreakRewardsByUser(userId),
  ]);
  return { modules, labs, certificates: certs, favorites, videoProgress, videoNotes, streakRewards };
}

export async function getCourseVideoProgress(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseVideoProgress)
    .where(and(eq(courseVideoProgress.userId, userId), eq(courseVideoProgress.courseSlug, courseSlug)))
    .orderBy(desc(courseVideoProgress.updatedAt));
}

export async function saveCourseVideoProgress(entry: InsertCourseVideoProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(courseVideoProgress).values(entry).onDuplicateKeyUpdate({
    set: { chapterIndex: entry.chapterIndex, updatedAt: new Date() },
  });
}

export async function getCourseVideoNotes(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseVideoNotes)
    .where(and(eq(courseVideoNotes.userId, userId), eq(courseVideoNotes.courseSlug, courseSlug)))
    .orderBy(desc(courseVideoNotes.updatedAt));
}

export async function saveCourseVideoNote(entry: InsertCourseVideoNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(courseVideoNotes).values(entry).onDuplicateKeyUpdate({
    set: { content: entry.content, updatedAt: new Date() },
  });
}

export async function removeCourseVideoNote(userId: number, courseSlug: string, moduleIndex: number, chapterIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(courseVideoNotes).where(and(
    eq(courseVideoNotes.userId, userId),
    eq(courseVideoNotes.courseSlug, courseSlug),
    eq(courseVideoNotes.moduleIndex, moduleIndex),
    eq(courseVideoNotes.chapterIndex, chapterIndex),
  ));
}

export async function getCourseFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseFavorites)
    .where(eq(courseFavorites.userId, userId))
    .orderBy(desc(courseFavorites.createdAt));
}

export async function addCourseFavorite(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(courseFavorites).values({ userId, courseSlug }).onDuplicateKeyUpdate({
    set: { courseSlug },
  });
}

export async function removeCourseFavorite(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(courseFavorites)
    .where(and(eq(courseFavorites.userId, userId), eq(courseFavorites.courseSlug, courseSlug)));
}

export async function saveCourseAssessment(entry: InsertCourseAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(courseAssessments)
    .where(and(eq(courseAssessments.userId, entry.userId), eq(courseAssessments.courseSlug, entry.courseSlug)))
    .limit(1);

  if (existing[0]) {
    const previouslyPassed = existing[0].passed || entry.passed;
    await db.update(courseAssessments)
      .set({ score: Math.max(existing[0].score, entry.score), passed: previouslyPassed, completedAt: entry.completedAt ?? new Date() })
      .where(eq(courseAssessments.id, existing[0].id));
    return { id: existing[0].id, passed: previouslyPassed };
  }

  const result = await db.insert(courseAssessments).values(entry);
  return { id: result[0].insertId, passed: entry.passed };
}

export async function getCourseAssessment(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseAssessments)
    .where(and(eq(courseAssessments.userId, userId), eq(courseAssessments.courseSlug, courseSlug)))
    .limit(1);
  return result[0];
}

export async function createCourseAssessmentAttempt(entry: InsertCourseAssessmentAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseAssessmentAttempts).values(entry);
  return { id: result[0].insertId };
}

export async function getCourseAssessmentAttempts(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseAssessmentAttempts)
    .where(and(eq(courseAssessmentAttempts.userId, userId), eq(courseAssessmentAttempts.courseSlug, courseSlug)))
    .orderBy(desc(courseAssessmentAttempts.createdAt));
}

export async function saveStandaloneLessonProgress(entry: InsertStandaloneLessonProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(standaloneLessonProgress).values(entry).onDuplicateKeyUpdate({
    set: { completedAt: entry.completedAt ?? new Date() },
  });
}

export async function getStandaloneLessonProgress(userId: number, lessonSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(standaloneLessonProgress)
    .where(and(eq(standaloneLessonProgress.userId, userId), eq(standaloneLessonProgress.lessonSlug, lessonSlug)));
}

export async function createStandaloneLessonAssessmentAttempt(entry: InsertStandaloneLessonAssessmentAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(standaloneLessonAssessmentAttempts).values(entry);
  return { id: result[0].insertId };
}

export async function getStandaloneLessonAssessmentAttempts(userId: number, lessonSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(standaloneLessonAssessmentAttempts)
    .where(and(eq(standaloneLessonAssessmentAttempts.userId, userId), eq(standaloneLessonAssessmentAttempts.lessonSlug, lessonSlug)))
    .orderBy(desc(standaloneLessonAssessmentAttempts.createdAt));
}

export async function awardCourseAchievements(entries: InsertCourseAchievement[]) {
  const db = await getDb();
  if (!db || entries.length === 0) return;
  for (const entry of entries) {
    await db.insert(courseAchievements).values(entry).onDuplicateKeyUpdate({ set: { badgeCode: entry.badgeCode } });
  }
}

export async function getCourseAchievements(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseAchievements)
    .where(and(eq(courseAchievements.userId, userId), eq(courseAchievements.courseSlug, courseSlug)))
    .orderBy(desc(courseAchievements.unlockedAt));
}

export async function getAllCourseAchievementsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseAchievements).where(eq(courseAchievements.userId, userId)).orderBy(desc(courseAchievements.unlockedAt));
}

// Weekly engagement challenges
export async function getWeeklyChallengeReward(userId: number, weekKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(weeklyChallengeRewards)
    .where(and(eq(weeklyChallengeRewards.userId, userId), eq(weeklyChallengeRewards.weekKey, weekKey)))
    .limit(1);
  return result[0];
}

export async function getWeeklyChallengeRewardsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(weeklyChallengeRewards)
    .where(eq(weeklyChallengeRewards.userId, userId))
    .orderBy(desc(weeklyChallengeRewards.claimedAt));
}

export async function claimWeeklyChallengeReward(entry: InsertWeeklyChallengeReward) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getWeeklyChallengeReward(entry.userId, entry.weekKey);
  if (existing) return { claimed: false, reward: existing };

  await db.insert(weeklyChallengeRewards).values(entry).onDuplicateKeyUpdate({
    set: { challengeKey: entry.challengeKey },
  });
  const reward = await getWeeklyChallengeReward(entry.userId, entry.weekKey);
  return { claimed: true, reward };
}

export async function getPublicCourseAchievement(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({
    id: courseAchievements.id,
    courseSlug: courseAchievements.courseSlug,
    badgeCode: courseAchievements.badgeCode,
    unlockedAt: courseAchievements.unlockedAt,
    studentName: users.name,
  })
    .from(courseAchievements)
    .innerJoin(users, eq(courseAchievements.userId, users.id))
    .where(eq(courseAchievements.id, id))
    .limit(1);
  return result[0];
}

export async function createCourseCertificate(cert: InsertCourseCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseCertificates).values(cert);
  return { id: result[0].insertId, identifier: cert.identifier };
}

/**
 * Cria ou atualiza o certificado de um curso para o aluno (idempotente).
 * Se o certificado já existe, atualiza o nome do aluno e o identificador
 * sem mudar a data de emissão original.
 */
export async function upsertCourseCertificate(
  userId: number,
  courseSlug: string,
  courseTitle: string,
  studentName: string,
  identifier: string,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getCourseCertificateByUserAndSlug(userId, courseSlug);
  if (existing) {
    await db
      .update(courseCertificates)
      .set({ studentName, identifier, courseTitle })
      .where(eq(courseCertificates.id, existing.id));
    return { id: existing.id, identifier, created: false };
  }
  const result = await db.insert(courseCertificates).values({
    userId,
    courseSlug,
    courseTitle,
    studentName,
    identifier,
  });
  return { id: result[0].insertId, identifier, created: true };
}

export async function getCourseCertificateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseCertificates).where(eq(courseCertificates.id, id)).limit(1);
  return result[0];
}

export async function getCourseCertificateByIdentifier(identifier: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseCertificates).where(eq(courseCertificates.identifier, identifier)).limit(1);
  return result[0];
}

export async function getCourseCertificateByUserAndSlug(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseCertificates)
    .where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseSlug, courseSlug)))
    .limit(1);
  return result[0];
}

export async function getCourseCertificatesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseCertificates).where(eq(courseCertificates.userId, userId)).orderBy(desc(courseCertificates.issuedAt));
}

export async function createSpecialtySimulationAttempt(entry: InsertSpecialtySimulationAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(specialtySimulationAttempts).values(entry);
  const created = await getSpecialtySimulationAttemptById(result[0].insertId, entry.userId);
  if (!created) throw new Error("Simulation attempt could not be created");
  return created;
}

export async function getSpecialtySimulationAttemptById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(specialtySimulationAttempts)
    .where(and(eq(specialtySimulationAttempts.id, id), eq(specialtySimulationAttempts.userId, userId)))
    .limit(1);
  return result[0];
}

export async function getActiveSpecialtySimulationAttempt(userId: number, simulationSlug: string, now = new Date()) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(specialtySimulationAttempts)
    .where(and(
      eq(specialtySimulationAttempts.userId, userId),
      eq(specialtySimulationAttempts.simulationSlug, simulationSlug),
      isNull(specialtySimulationAttempts.submittedAt),
      gt(specialtySimulationAttempts.expiresAt, now),
    ))
    .orderBy(desc(specialtySimulationAttempts.startedAt))
    .limit(1);
  return result[0];
}

export async function submitSpecialtySimulationAttempt(input: {
  id: number;
  userId: number;
  answers: number[];
  score: number;
  passed: boolean;
  timedOut: boolean;
  submittedAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(specialtySimulationAttempts)
    .set({ answers: input.answers, score: input.score, passed: input.passed, timedOut: input.timedOut, submittedAt: input.submittedAt })
    .where(and(
      eq(specialtySimulationAttempts.id, input.id),
      eq(specialtySimulationAttempts.userId, input.userId),
      isNull(specialtySimulationAttempts.submittedAt),
    ));
  return getSpecialtySimulationAttemptById(input.id, input.userId);
}

export async function getSpecialtySimulationAttemptsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(specialtySimulationAttempts)
    .where(eq(specialtySimulationAttempts.userId, userId))
    .orderBy(desc(specialtySimulationAttempts.startedAt));
}

export async function getVerifiedCourseLabRunsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: courseLabRuns.id,
    courseSlug: courseLabRuns.courseSlug,
    labIndex: courseLabRuns.labIndex,
    verifiedAt: courseLabRuns.verifiedAt,
  }).from(courseLabRuns)
    .where(and(eq(courseLabRuns.userId, userId), eq(courseLabRuns.success, true), isNotNull(courseLabRuns.verifiedAt)))
    .orderBy(desc(courseLabRuns.verifiedAt));
}

// Admin queries
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.lastSignedIn));
}

export async function getUserProgressByDomain(userId: number, domainId: number) {
  const db = await getDb();
  if (!db) return { completed: 0, total: 0, bestScore: 0 };
  const total = await getLessonsCountByDomain(domainId);
  const completed = await db.select({ count: count() }).from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.domainId, domainId), eq(progress.completed, true)));
  const attempts = await db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.domainId, domainId)))
    .orderBy(desc(quizAttempts.createdAt)).limit(1);
  const bestScore = attempts.length > 0 ? Math.round((attempts[0].score / attempts[0].totalQuestions) * 100) : 0;
  return { completed: completed[0]?.count ?? 0, total, bestScore };
}

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return null;
  const userCount = await db.select({ count: count() }).from(users);
  const certCount = await db.select({ count: count() }).from(certificates);
  const attemptCount = await db.select({ count: count() }).from(quizAttempts);
  const domainCount = await db.select({ count: count() }).from(domains);
  const lessonCount = await db.select({ count: count() }).from(lessons);
  const questionCount = await db.select({ count: count() }).from(questions);
  return {
    totalUsers: userCount[0]?.count ?? 0,
    totalCertificates: certCount[0]?.count ?? 0,
    totalQuizAttempts: attemptCount[0]?.count ?? 0,
    totalDomains: domainCount[0]?.count ?? 0,
    totalLessons: lessonCount[0]?.count ?? 0,
    totalQuestions: questionCount[0]?.count ?? 0,
  };
}

export async function createExternalContentSource(input: InsertExternalContentSource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(externalContentSources).values(input);
}

export async function getExternalContentSources() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(externalContentSources).orderBy(desc(externalContentSources.createdAt));
}

// Podcast listening progress
export async function getPodcastProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(podcastProgress)
    .where(eq(podcastProgress.userId, userId))
    .orderBy(desc(podcastProgress.updatedAt));
}

export async function savePodcastProgress(entry: InsertPodcastProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(podcastProgress)
    .where(and(eq(podcastProgress.userId, entry.userId), eq(podcastProgress.episodeId, entry.episodeId)))
    .limit(1);
  const previous = existing[0];
  const completed = Boolean(entry.completed) || Boolean(previous?.completed);
  const completedAt = completed ? previous?.completedAt ?? new Date() : null;

  await db.insert(podcastProgress).values({
    ...entry,
    completed,
    completedAt,
  }).onDuplicateKeyUpdate({
    set: {
      positionSeconds: entry.positionSeconds,
      completed,
      completedAt,
      updatedAt: new Date(),
    },
  });

  return {
    justCompleted: completed && !previous?.completed,
    completed,
    positionSeconds: entry.positionSeconds,
  };
}

/** Latest review-quiz attempt recorded by a student for a Podcast episode. */
export async function getLatestPodcastQuizAttempt(userId: number, episodeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const attempts = await db.select().from(podcastQuizAttempts)
    .where(and(eq(podcastQuizAttempts.userId, userId), eq(podcastQuizAttempts.episodeId, episodeId)))
    .orderBy(desc(podcastQuizAttempts.id)).limit(1);
  return attempts[0] ?? null;
}

export async function createPodcastQuizAttempt(entry: InsertPodcastQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Idempotent insert: the unique index (userId, episodeId) caps submissions at one
  // recorded review attempt per episode per student — a retake overwrites only if
  // it improves the recorded score, which keeps quiz XP and the weekly ranking honest.
  const existing = await getLatestPodcastQuizAttempt(entry.userId, entry.episodeId);
  if (existing) {
    const betterScore = entry.score > existing.score;
    if (!betterScore) return { id: existing.id };
    await db.update(podcastQuizAttempts)
      .set({ score: entry.score, totalQuestions: entry.totalQuestions, answers: entry.answers, updatedAt: new Date() })
      .where(and(eq(podcastQuizAttempts.userId, entry.userId), eq(podcastQuizAttempts.episodeId, entry.episodeId)));
    return { id: existing.id };
  }
  const result = await db.insert(podcastQuizAttempts).values(entry);
  return { id: Number(result[0].insertId) };
}

/**
 * Weekly listener leaderboard built from Podcast listening XP (completed
 * episodes) plus quiz bonus XP, restricted to the current ISO week in the
 * America/Sao_Paulo timezone.
 */
export async function getPodcastWeeklyRanking(limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const weekStart = getWeekStartForListenerRanking();

  const rows = await db.select().from(podcastProgress)
    .where(and(eq(podcastProgress.completed, true), gte(podcastProgress.completedAt, weekStart)));

  const episodeXp = new Map<number, number>();
  for (const row of rows) {
    episodeXp.set(row.userId, (episodeXp.get(row.userId) ?? 0) + 50);
  }

  const quizRows = await db.select().from(podcastQuizAttempts)
    .where(gte(podcastQuizAttempts.createdAt, weekStart));
  for (const row of quizRows) {
    const bonus = Math.max(0, Math.min(row.score, row.totalQuestions)) * 10;
    episodeXp.set(row.userId, (episodeXp.get(row.userId) ?? 0) + bonus);
  }

  const userIds = Array.from(episodeXp.keys());
  const userRows = userIds.length > 0
    ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds))
    : [];
  const userNames = new Map(userRows.map((row) => [row.id, row.name]));
  const ranking = Array.from(episodeXp.entries())
    .map(([userId, xp]) => ({ userId, xp, name: userNames.get(userId) ?? "Ouvinte" }))
    .sort((first, second) => second.xp - first.xp)
    .slice(0, limit);
  return { weekKey: buildWeekKey(weekStart), ranking };
}

/** Computes an ISO-like week key (YYYY-Www) from the Monday that starts the ranking window. */
function buildWeekKey(monday: Date): string {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(monday);
  const dayOfYear = Math.floor((monday.getTime() - new Date(monday.getFullYear(), 0, 1).getTime()) / 86_400_000) + 1;
  const weekOfYear = Math.ceil((dayOfYear + new Date(monday.getFullYear(), 0, 1).getDay()) / 7);
  return `${year}-W${String(weekOfYear).padStart(2, "0")}`;
}

/** Monday 00:00 (America/Sao_Paulo) of the current week, the sliding start of the ranking window. */
function getWeekStartForListenerRanking() {
  const saoPauloString = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
  const local = new Date(saoPauloString);
  const day = local.getDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(local.getFullYear(), local.getMonth(), local.getDate() - diff, 0, 0, 0, 0);
}

/** Badges already earned by a listener in the CyberCast series (idempotent lookup). */
export async function getPodcastListenerBadges(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(podcastListenerBadges)
    .where(eq(podcastListenerBadges.userId, userId))
    .orderBy(desc(podcastListenerBadges.id));
}
/** Grants an earned listener badge, silently skipping when already held. */
/* ---------- Podcast episode favorites ---------- */

export async function getPodcastEpisodeFavorites(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(podcastEpisodeFavorites).where(eq(podcastEpisodeFavorites.userId, userId));
}

export async function togglePodcastEpisodeFavorite(userId: number, episodeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(podcastEpisodeFavorites)
    .where(and(eq(podcastEpisodeFavorites.userId, userId), eq(podcastEpisodeFavorites.episodeId, episodeId)))
    .limit(1);
  if (existing.length > 0) {
    await db.delete(podcastEpisodeFavorites).where(eq(podcastEpisodeFavorites.id, existing[0].id));
    return { favorite: false };
  }
  await db.insert(podcastEpisodeFavorites).values({ userId, episodeId });
  return { favorite: true };
}

/* ---------- Daily study streaks ---------- */

export async function recordDailyStudyActivity(userId: number, dayKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(dailyStudyStreaks).values({ userId, dayKey }).onDuplicateKeyUpdate({ set: { dayKey } });
}

export async function getDailyStudyDayKeys(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select({ dayKey: dailyStudyStreaks.dayKey })
    .from(dailyStudyStreaks)
    .where(eq(dailyStudyStreaks.userId, userId))
    .orderBy(asc(dailyStudyStreaks.dayKey));
  return rows.map((row) => row.dayKey);
}

export function computeCurrentStreak(dayKeys: string[], today: Date = new Date()): { currentStreak: number; currentDayKey: string } {
  const set = new Set(dayKeys);
  let streak = 0;
  const cursor = new Date(today);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { currentStreak: streak, currentDayKey: today.toISOString().slice(0, 10) };
}

export async function claimDailyStreakReward(entry: InsertDailyStreakReward) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(dailyStreakRewards)
    .where(and(eq(dailyStreakRewards.userId, entry.userId), eq(dailyStreakRewards.dayKey, entry.dayKey)))
    .limit(1);
  if (existing.length > 0) return { claimed: false, entry: existing[0] };
  await db.insert(dailyStreakRewards).values(entry);
  return { claimed: true, entry: { ...entry, createdAt: new Date() } };
}

export async function getDailyStreakRewardsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(dailyStreakRewards).where(eq(dailyStreakRewards.userId, userId));
}

/* ---------- Domain mastery badges ---------- */

export async function getDomainMasteryBadges(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(domainMasteryBadges).where(eq(domainMasteryBadges.userId, userId));
}

export async function awardDomainMasteryBadge(entry: InsertDomainMasteryBadge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(domainMasteryBadges).values(entry).onDuplicateKeyUpdate({ set: { bestScorePct: entry.bestScorePct } });
}

export async function awardPodcastListenerBadge(entry: InsertPodcastListenerBadge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(podcastListenerBadges).values(entry);
    return { awarded: true };
  } catch (error) {
    if (isDuplicateKeyError(error)) return { awarded: false };
    throw error;
  }
}
function isDuplicateKeyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : "";
  return message.includes("Duplicate entry");
}
/**
 * Administrative listening report: one row per user who interacted with the
 * Podcast section, aggregating completed episodes, quiz attempts, podcast XP
 * (listening plus quiz bonus) and the most recent activity timestamp.
 */
export async function getPodcastListeningReport() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const progressRows = await db.select().from(podcastProgress)
    .where(eq(podcastProgress.completed, true));
  const quizRows = await db.select().from(podcastQuizAttempts);
  const byUser = new Map<number, { completed: number; quizAttempts: number; quizScore: number; quizTotal: number; lastActivity: Date }>();
  const touch = (userId: number, at: Date) => {
    const bucket = byUser.get(userId) ?? { completed: 0, quizAttempts: 0, quizScore: 0, quizTotal: 0, lastActivity: at };
    bucket.lastActivity = at.getTime() > bucket.lastActivity.getTime() ? at : bucket.lastActivity;
    byUser.set(userId, bucket);
  };
  for (const row of progressRows) {
    const bucket = byUser.get(row.userId) ?? { completed: 0, quizAttempts: 0, quizScore: 0, quizTotal: 0, lastActivity: row.completedAt ?? new Date() };
    bucket.completed += 1;
    touch(row.userId, row.completedAt ?? new Date());
  }
  for (const row of quizRows) {
    const bucket = byUser.get(row.userId) ?? { completed: 0, quizAttempts: 0, quizScore: 0, quizTotal: 0, lastActivity: row.createdAt };
    bucket.quizAttempts += 1;
    bucket.quizScore += row.score;
    bucket.quizTotal += row.totalQuestions;
    touch(row.userId, row.createdAt);
  }
  const userIds = Array.from(byUser.keys());
  const userRows = userIds.length > 0
    ? await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(inArray(users.id, userIds))
    : [];
  const userById = new Map(userRows.map((row) => [row.id, row]));
  const listeners = Array.from(byUser.entries()).map(([userId, stats]) => {
    const user = userById.get(userId);
    const listeningXp = stats.completed * 50;
    const quizBonus = Math.max(0, Math.min(stats.quizScore, stats.quizTotal)) * 10;
    return {
      userId,
      name: user?.name ?? "Ouvinte",
      email: user?.email ?? null,
      completedEpisodes: stats.completed,
      quizAttempts: stats.quizAttempts,
      quizPercentage: stats.quizTotal > 0 ? Math.round((stats.quizScore / stats.quizTotal) * 100) : null,
      podcastXp: listeningXp + quizBonus,
      lastActivityAt: stats.lastActivity,
    };
  });
  listeners.sort((first, second) => second.podcastXp - first.podcastXp);
  return { listeners };
}

/** Lists the learner's favorite English vocabulary terms, most recent first. */
export async function getEnglishVocabularyFavorites(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(englishVocabularyFavorites)
    .where(eq(englishVocabularyFavorites.userId, userId))
    .orderBy(desc(englishVocabularyFavorites.createdAt));
}
/** Toggles a vocabulary favorite: inserts when absent, deletes when held. */
export async function toggleEnglishVocabularyFavorite(userId: number, termId: string): Promise<{ favorited: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(englishVocabularyFavorites)
    .where(and(eq(englishVocabularyFavorites.userId, userId), eq(englishVocabularyFavorites.termId, termId)))
    .limit(1);
  if (existing.length > 0) {
    await db.delete(englishVocabularyFavorites)
      .where(and(eq(englishVocabularyFavorites.userId, userId), eq(englishVocabularyFavorites.termId, termId)));
    return { favorited: false };
  }
  await db.insert(englishVocabularyFavorites).values({ userId, termId });
  return { favorited: true };
}
/** Spaced-repetition intervals (in days) for the flashcard mastery ladder. */
export const FLASHCARD_SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const FLASHCARD_SRS_MAX_STAGE = FLASHCARD_SRS_INTERVAL_DAYS.length - 1;

/** Computes the next stage and review date for a flashcard review. */
export function computeFlashcardNextStage(currentStage: number, remembered: boolean): { stage: number; intervalDays: number } {
  if (remembered) {
    const nextStage = Math.min(FLASHCARD_SRS_MAX_STAGE, currentStage + 1);
    return { stage: nextStage, intervalDays: FLASHCARD_SRS_INTERVAL_DAYS[nextStage] ?? 30 };
  }
  const previousStage = Math.max(0, currentStage - 1);
  return { stage: previousStage, intervalDays: FLASHCARD_SRS_INTERVAL_DAYS[previousStage] ?? 0 };
}

/** Lists the learner's spaced-repetition state across vocabulary terms. */
export async function getFlashcardSrsState(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(flashcardSrsAttempts)
    .where(eq(flashcardSrsAttempts.userId, userId))
    .orderBy(desc(flashcardSrsAttempts.updatedAt));
}

/** Records a flashcard review: upserts the row and moves the stage ladder. */
export async function recordFlashcardReview(userId: number, termId: string, remembered: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(flashcardSrsAttempts)
    .where(and(eq(flashcardSrsAttempts.userId, userId), eq(flashcardSrsAttempts.termId, termId)))
    .limit(1);
  const currentStage = existing.length > 0 ? existing[0].stage : 0;
  const currentCount = existing.length > 0 ? (existing[0].reviewCount ?? 0) : 0;
  const { stage, intervalDays } = computeFlashcardNextStage(currentStage, remembered);
  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  if (existing.length > 0) {
    await db.update(flashcardSrsAttempts).set({ stage, reviewCount: currentCount + 1, nextReviewAt })
      .where(and(eq(flashcardSrsAttempts.userId, userId), eq(flashcardSrsAttempts.termId, termId)));
  } else {
    await db.insert(flashcardSrsAttempts).values({ userId, termId, stage, nextReviewAt, reviewCount: 1 });
  }
  return { stage, nextReviewAt, intervalDays, mastery: stage >= FLASHCARD_SRS_MAX_STAGE };
}

/** Spaced-repetition bonus xp awarded per correct answer in the reinforcement drill. */
export const FLASHCARD_DRILL_BONUS_XP = 15;
export const FLASHCARD_DRILL_MAX_QUESTIONS = 8;

/** Lists the learner's favorite terms that are behind schedule or still forgotten:
 * due for review (nextReviewAt in the past), overdue by more than three days, or brand new (stage zero). */
export async function getFlashcardDueTerms(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  const rows = await db.select().from(flashcardSrsAttempts)
    .where(and(
      eq(flashcardSrsAttempts.userId, userId),
      lte(flashcardSrsAttempts.nextReviewAt, now),
    ))
    .orderBy(asc(flashcardSrsAttempts.nextReviewAt));
  return rows.filter((row) => row.stage < FLASHCARD_SRS_MAX_STAGE);
}

/** Advances a flashcard stage after a correct drill answer (no demotion: one missed option does not reset the ladder). */
export async function advanceFlashcardStageAfterDrill(userId: number, termId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(flashcardSrsAttempts)
    .where(and(eq(flashcardSrsAttempts.userId, userId), eq(flashcardSrsAttempts.termId, termId)))
    .limit(1);
  const currentStage = existing.length > 0 ? existing[0].stage : 0;
  if (currentStage >= FLASHCARD_SRS_MAX_STAGE) return { stage: FLASHCARD_SRS_MAX_STAGE, nextReviewAt: existing[0]?.nextReviewAt ?? new Date(), intervalDays: 30, mastered: true };
  const nextStage = currentStage + 1;
  const intervalDays = FLASHCARD_SRS_INTERVAL_DAYS[nextStage] ?? 30;
  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  if (existing.length > 0) {
    await db.update(flashcardSrsAttempts).set({ stage: nextStage, reviewCount: (existing[0].reviewCount ?? 0) + 1, nextReviewAt })
      .where(and(eq(flashcardSrsAttempts.userId, userId), eq(flashcardSrsAttempts.termId, termId)));
  } else {
    await db.insert(flashcardSrsAttempts).values({ userId, termId, stage: nextStage, nextReviewAt, reviewCount: 1 });
  }
  return { stage: nextStage, nextReviewAt, intervalDays, mastered: nextStage >= FLASHCARD_SRS_MAX_STAGE };
}

/** Persists a guided interview simulation attempt. */
export async function createEnglishInterviewAttempt(entry: InsertEnglishInterviewAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(englishInterviewAttempts).values(entry);
}

/** Persists the learner's watch progress across the free video course library. */
export async function getFreeVideoCourseProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(freeVideoCourseProgress)
    .where(and(eq(freeVideoCourseProgress.userId, userId), eq(freeVideoCourseProgress.watched, 1)))
    .orderBy(desc(freeVideoCourseProgress.updatedAt));
}

export async function getFreeVideoCourseProgressBySlugs(userId: number, courseSlugs: string[]) {
  const db = await getDb();
  if (!db || courseSlugs.length === 0) return [];
  return db.select().from(freeVideoCourseProgress)
    .where(and(
      eq(freeVideoCourseProgress.userId, userId),
      inArray(freeVideoCourseProgress.courseSlug, courseSlugs),
    ));
}

/** Marks a free course as watched and grants the configured XP once per course. */
export async function markFreeVideoCourseWatched(userId: number, courseSlug: string, xp: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(freeVideoCourseProgress)
    .where(and(
      eq(freeVideoCourseProgress.userId, userId),
      eq(freeVideoCourseProgress.courseSlug, courseSlug),
    ))
    .limit(1);
  const alreadyWatched = existing.length > 0 && existing[0].watched === 1;
  if (!alreadyWatched) {
    if (existing.length > 0) {
      await db.update(freeVideoCourseProgress).set({ watched: 1, xpGranted: xp })
        .where(and(
          eq(freeVideoCourseProgress.userId, userId),
          eq(freeVideoCourseProgress.courseSlug, courseSlug),
        ));
    } else {
      await db.insert(freeVideoCourseProgress).values({ userId, courseSlug, watched: 1, xpGranted: xp });
    }
  }
  return { alreadyWatched };
}

/** Removes a course from the learner's watched list (dashboard "continue watching"). */
export async function removeFreeVideoCourseProgress(userId: number, courseSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(freeVideoCourseProgress)
    .where(and(
      eq(freeVideoCourseProgress.userId, userId),
      eq(freeVideoCourseProgress.courseSlug, courseSlug),
    ));
}

export async function countFreeVideoCoursesWatched(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(freeVideoCourseProgress)
    .where(and(eq(freeVideoCourseProgress.userId, userId), eq(freeVideoCourseProgress.watched, 1)));
  return rows.length;
}

// Portfolio evidence items (lab completion proofs)
export async function createPortfolioItem(item: InsertPortfolioItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(portfolioItems).values(item);
  return { id: result[0].insertId };
}

export async function getPortfolioItemsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems)
    .where(eq(portfolioItems.userId, userId))
    .orderBy(desc(portfolioItems.createdAt));
}

export async function getLabCompletedProof(input: { userId: number; courseSlug: string; labIndex: number }) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseLabProgress)
    .where(and(
      eq(courseLabProgress.userId, input.userId),
      eq(courseLabProgress.courseSlug, input.courseSlug),
      eq(courseLabProgress.labIndex, input.labIndex),
    ))
    .limit(1);
  return result[0]?.completed ? result[0] : undefined;
}

export async function deletePortfolioItem(input: { userId: number; itemId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(portfolioItems).where(and(
    eq(portfolioItems.id, input.itemId),
    eq(portfolioItems.userId, input.userId),
  ));
}

export async function getCourseLabProgressByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseLabProgress).where(eq(courseLabProgress.userId, userId));
}

export async function getPortfolioItemById(itemId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(portfolioItems)
    .where(eq(portfolioItems.id, itemId))
    .limit(1);
  return result[0];
}

export async function removePortfolioTestUsers() {
  const db = await getDb();
  if (!db) return;
  await db.delete(portfolioItems).where(sql`userId IN (SELECT id FROM users WHERE email LIKE 'portfolio-test-%@example.test')`);
  await db.delete(users).where(sql`email LIKE 'portfolio-test-%@example.test'`);
}

export async function removeCareerQuizTestUsers() {
  const db = await getDb();
  if (!db) return;
  await db.delete(careerQuizResults).where(sql`userId IN (SELECT id FROM users WHERE email LIKE 'career-portfolio-test-%@example.test')`);
  await db.delete(users).where(sql`email LIKE 'career-portfolio-test-%@example.test'`);
}

export async function getPortfolioEvidenceCountsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      courseSlug: portfolioItems.courseSlug,
      labIndex: portfolioItems.labIndex,
      count: count(portfolioItems.id),
    })
    .from(portfolioItems)
    .where(eq(portfolioItems.userId, userId))
    .groupBy(portfolioItems.courseSlug, portfolioItems.labIndex);
  return rows;
}

export async function getAllPortfolioItemsWithUsers() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: portfolioItems.id,
      userId: portfolioItems.userId,
      userName: users.name,
      userEmail: users.email,
      courseSlug: portfolioItems.courseSlug,
      labIndex: portfolioItems.labIndex,
      title: portfolioItems.title,
      description: portfolioItems.description,
      fileUrl: portfolioItems.fileUrl,
      fileKey: portfolioItems.fileKey,
      mimeType: portfolioItems.mimeType,
      createdAt: portfolioItems.createdAt,
    })
    .from(portfolioItems)
    .innerJoin(users, eq(portfolioItems.userId, users.id))
    .orderBy(desc(portfolioItems.createdAt));
}

export async function deletePortfolioItemById(itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(portfolioItems).where(eq(portfolioItems.id, itemId));
}
/**
 * Admin moderation helpers for the portfolio tab.
 * Optional filters narrow the list by course slug and student name/e-mail.
 */
export async function getAllPortfolioItemsWithFilters(filters: { search?: string; courseSlug?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.courseSlug) conditions.push(eq(portfolioItems.courseSlug, filters.courseSlug));
  if (filters.search) {
    const needle = `%${filters.search.trim()}%`;
    conditions.push(or(like(users.name, needle), like(users.email, needle)));
  }
  return db
    .select({
      id: portfolioItems.id,
      userId: portfolioItems.userId,
      userName: users.name,
      userEmail: users.email,
      courseSlug: portfolioItems.courseSlug,
      labIndex: portfolioItems.labIndex,
      title: portfolioItems.title,
      description: portfolioItems.description,
      fileUrl: portfolioItems.fileUrl,
      fileKey: portfolioItems.fileKey,
      mimeType: portfolioItems.mimeType,
      createdAt: portfolioItems.createdAt,
    })
    .from(portfolioItems)
    .innerJoin(users, eq(portfolioItems.userId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(portfolioItems.createdAt));
}
const PORTFOLIO_COURSE_TITLES: Record<string, string> = {
  ...Object.fromEntries(activatedCatalogCourses.map((course) => [course.slug, course.title])),
  "ingles-tecnico-ciberseguranca": "Inglês Técnico para Cibersegurança — do Zero ao Profissional",
};
export async function getPortfolioCourseSlugs() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.selectDistinct({ courseSlug: portfolioItems.courseSlug }).from(portfolioItems);
  return rows
    .map((row) => ({ courseSlug: row.courseSlug, title: PORTFOLIO_COURSE_TITLES[row.courseSlug] ?? row.courseSlug }))
    .sort((left, right) => left.title.localeCompare(right.title, "pt-BR"));
}
/**
 * Public portfolio gallery resolved by an opt-in token on the user record.
 * Returns the profile, evidence items and issued course certificates.
 */
export async function getPublicPortfolioByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const owner = await db.select().from(users).where(and(eq(users.portfolioPublicToken, token), eq(users.portfolioPublicEnabled, true))).limit(1);
  if (!owner[0]) return null;
  const evidence = await db.select({
    id: portfolioItems.id,
    courseSlug: portfolioItems.courseSlug,
    labIndex: portfolioItems.labIndex,
    title: portfolioItems.title,
    description: portfolioItems.description,
    fileUrl: portfolioItems.fileUrl,
    mimeType: portfolioItems.mimeType,
    createdAt: portfolioItems.createdAt,
  }).from(portfolioItems).where(eq(portfolioItems.userId, owner[0].id)).orderBy(desc(portfolioItems.createdAt));
  const badges = await db.select().from(courseCertificates).where(eq(courseCertificates.userId, owner[0].id)).orderBy(desc(courseCertificates.issuedAt));
  return { userName: owner[0].name ?? "Aluno", avatarUrl: owner[0].avatarUrl, evidence, badges };
}
export async function refreshPortfolioPublicToken(userId: number, token: string | null, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(users).set({ portfolioPublicToken: token, portfolioPublicEnabled: enabled }).where(eq(users.id, userId));
}
/**
 * Career discovery quiz results (one row per student, upserted).
 */
export async function saveCareerQuizResult(entry: InsertCareerQuizResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(careerQuizResults).values(entry).onDuplicateKeyUpdate({ set: { topArea: entry.topArea, topScore: entry.topScore, runnerUpArea: entry.runnerUpArea, runnerUpScore: entry.runnerUpScore, scoresJson: entry.scoresJson, completedAt: new Date() } });
}
export async function getCareerQuizResultByUser(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(careerQuizResults).where(eq(careerQuizResults.userId, userId)).limit(1);
  return rows[0] ?? null;
}

/**
 * Cyber Projects completions: marks a hands-on project as delivered by the
 * student with an optional summary of what was produced.
 */
export async function createProjectCompletion(entry: InsertProjectCompletion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(projectCompletions).values(entry).onDuplicateKeyUpdate({ set: { summary: entry.summary ?? undefined, rubric: entry.rubric ?? undefined, status: "submitted", reviewerComment: null, reviewedByUserId: null, reviewedAt: null, completedAt: new Date() } });
}

export async function getProjectCompletionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectCompletions).where(eq(projectCompletions.userId, userId)).orderBy(desc(projectCompletions.completedAt));
}

export async function getAllProjectCompletionsWithUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: projectCompletions.id, userId: projectCompletions.userId, userName: users.name, userEmail: users.email, projectId: projectCompletions.projectId, summary: projectCompletions.summary, status: projectCompletions.status, rubric: projectCompletions.rubric, reviewerComment: projectCompletions.reviewerComment, reviewedAt: projectCompletions.reviewedAt, completedAt: projectCompletions.completedAt }).from(projectCompletions).innerJoin(users, eq(projectCompletions.userId, users.id)).orderBy(desc(projectCompletions.completedAt));
}

export async function reviewProjectCompletion(input: { id: number; status: string; rubric: unknown; reviewerComment: string | null; reviewedByUserId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projectCompletions).set({ status: input.status, rubric: input.rubric, reviewerComment: input.reviewerComment, reviewedByUserId: input.reviewedByUserId, reviewedAt: new Date() }).where(eq(projectCompletions.id, input.id));
}

export async function getPublicProjectCompletionsByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const owner = await db.select().from(users).where(and(eq(users.portfolioPublicToken, token), eq(users.portfolioPublicEnabled, true))).limit(1);
  if (!owner[0]) return null;
  return db.select().from(projectCompletions).where(eq(projectCompletions.userId, owner[0].id)).orderBy(desc(projectCompletions.completedAt));
}

export async function removeProjectCompletion(input: { userId: number; projectId: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(projectCompletions).where(and(
    eq(projectCompletions.userId, input.userId),
    eq(projectCompletions.projectId, input.projectId),
  ));
}

/**
 * CTF hub: marks a curated external CTF challenge as completed for the learner,
 * idempotent by the (userId, ctfId) unique constraint.
 */
export async function setCtfCompletion(userId: number, ctfId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(ctfCompletions).values({ userId, ctfId });
    return { created: true };
  } catch (error) {
    if (isDuplicateKeyError(error)) return { created: false };
    throw error;
  }
}
export async function unsetCtfCompletion(userId: number, ctfId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(ctfCompletions).where(and(eq(ctfCompletions.userId, userId), eq(ctfCompletions.ctfId, ctfId)));
}
export async function getCtfCompletionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ctfCompletions).where(eq(ctfCompletions.userId, userId)).orderBy(desc(ctfCompletions.completedAt));
}
export async function countCtfCompletionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ count: count() }).from(ctfCompletions).where(eq(ctfCompletions.userId, userId));
  return Number(rows[0]?.count ?? 0);
}

// CyberDimension Audio Lab — listening progress
export async function getAudioLabProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(audioLabProgress)
    .where(eq(audioLabProgress.userId, userId))
    .orderBy(desc(audioLabProgress.updatedAt));
}
export async function getAudioLabFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(audioLabFavorites)
    .where(eq(audioLabFavorites.userId, userId))
    .orderBy(desc(audioLabFavorites.createdAt));
}

export async function toggleAudioLabFavorite(userId: number, episodeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(audioLabFavorites)
    .where(and(eq(audioLabFavorites.userId, userId), eq(audioLabFavorites.episodeId, episodeId)))
    .limit(1);
  if (existing.length > 0) {
    await db.delete(audioLabFavorites).where(eq(audioLabFavorites.id, existing[0].id));
    return { favorite: false };
  }
  await db.insert(audioLabFavorites).values({ userId, episodeId });
  return { favorite: true };
}

export async function saveAudioLabProgress(entry: InsertAudioLabProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(audioLabProgress)
    .where(and(eq(audioLabProgress.userId, entry.userId), eq(audioLabProgress.episodeId, entry.episodeId)))
    .limit(1);
  const previous = existing[0];
  const completed = Boolean(entry.completed) || Boolean(previous?.completed);
  const completedAt = completed ? previous?.completedAt ?? new Date() : null;
  await db.insert(audioLabProgress).values({
    ...entry,
    completed,
    completedAt,
  }).onDuplicateKeyUpdate({
    set: {
      positionSeconds: entry.positionSeconds,
      completed,
      completedAt,
      updatedAt: new Date(),
    },
  });
  return {
    justCompleted: completed && !previous?.completed,
    completed,
    positionSeconds: entry.positionSeconds,
  };
}
/** Latest review-quiz attempt recorded by a student for an Audio Lab episode. */
export async function getLatestAudioLabQuizAttempt(userId: number, episodeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const attempts = await db.select().from(audioLabQuizAttempts)
    .where(and(eq(audioLabQuizAttempts.userId, userId), eq(audioLabQuizAttempts.episodeId, episodeId)))
    .orderBy(desc(audioLabQuizAttempts.id)).limit(1);
  return attempts[0] ?? null;
}
export async function createAudioLabQuizAttempt(entry: InsertAudioLabQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getLatestAudioLabQuizAttempt(entry.userId, entry.episodeId);
  if (existing) {
    const betterScore = entry.score > existing.score;
    if (!betterScore) return { id: existing.id };
    await db.update(audioLabQuizAttempts)
      .set({ score: entry.score, totalQuestions: entry.totalQuestions, answers: entry.answers, updatedAt: new Date() })
      .where(and(eq(audioLabQuizAttempts.userId, entry.userId), eq(audioLabQuizAttempts.episodeId, entry.episodeId)));
    return { id: existing.id };
  }
  const result = await db.insert(audioLabQuizAttempts).values(entry);
  return { id: Number(result[0].insertId) };
}
/** Idempotent achievement award for Audio Lab series badges (reuses courseAchievements). */
export async function awardAudioLabBadge(entry: InsertCourseAchievement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courseAchievements).values(entry).onDuplicateKeyUpdate({
    set: { badgeCode: entry.badgeCode, unlockedAt: entry.unlockedAt ?? new Date() },
  });
  return entry.badgeCode;
}

export async function deleteAudioLabProgress(userId: number, episodeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(audioLabProgress).where(and(eq(audioLabProgress.userId, userId), eq(audioLabProgress.episodeId, episodeId)));
}
