import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, mediumtext, json, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  portfolioPublicToken: varchar("portfolioPublicToken", { length: 64 }),
  portfolioPublicEnabled: boolean("portfolioPublicEnabled").default(false),
}, (table) => [
  uniqueIndex("users_email_unique").on(table.email),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Single-use, hashed reset tokens for accounts authenticated by e-mail.
 */
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Single-use, hashed magic-link tokens for passwordless student access.
 */
export const magicLinkTokens = mysqlTable("magicLinkTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicLinkToken = typeof magicLinkTokens.$inferSelect;
export type InsertMagicLinkToken = typeof magicLinkTokens.$inferInsert;

/**
 * Course domains for CompTIA Security+ SY0-701
 */
export const domains = mysqlTable("domains", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  percentage: int("percentage").notNull(),
  order: int("order").notNull().default(0),
  icon: varchar("icon", { length: 50 }).default("shield"),
});

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = typeof domains.$inferInsert;

/**
 * Lessons within each domain
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  domainId: int("domainId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: mediumtext("content").notNull(),
  order: int("order").notNull().default(0),
  duration: int("duration").default(0),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Quiz questions
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  domainId: int("domainId").notNull(),
  question: mediumtext("question").notNull(),
  options: json("options").notNull(),
  correctAnswer: int("correctAnswer").notNull(),
  explanation: mediumtext("explanation"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Quiz attempts - tracks user quiz results
 */
export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainId: int("domainId").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  // Auditoria: limite de tentativas por domínio para conter inflação de XP — máximo 10 envios por domínio.
  index("quiz_attempts_user_domain").on(table.userId, table.domainId),
]);

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

/**
 * User progress tracking
 */
export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainId: int("domainId").notNull(),
  lessonId: int("lessonId"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => [
  uniqueIndex("progress_user_domain_lesson").on(table.userId, table.domainId, table.lessonId),
]);

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

/**
 * Certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainId: int("domainId").notNull(),
  identifier: varchar("identifier", { length: 50 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("certificates_user_domain").on(table.userId, table.domainId),
]);

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Progress by module in the four foundational ORBIT formations.
 */
export const courseModuleProgress = mysqlTable("courseModuleProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  moduleIndex: int("moduleIndex").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => [
  uniqueIndex("course_module_progress_user_course_module").on(table.userId, table.courseSlug, table.moduleIndex),
]);

export type CourseModuleProgress = typeof courseModuleProgress.$inferSelect;
export type InsertCourseModuleProgress = typeof courseModuleProgress.$inferInsert;

/**
 * Immutable attempts for the short knowledge check that closes each course module.
 */
export const courseModuleQuizAttempts = mysqlTable("courseModuleQuizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  moduleIndex: int("moduleIndex").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseModuleQuizAttempt = typeof courseModuleQuizAttempts.$inferSelect;
export type InsertCourseModuleQuizAttempt = typeof courseModuleQuizAttempts.$inferInsert;

/**
 * Completion records for guided labs in the ORBIT formations.
 */
export const courseLabProgress = mysqlTable("courseLabProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  labIndex: int("labIndex").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => [
  uniqueIndex("course_lab_progress_user_course_lab").on(table.userId, table.courseSlug, table.labIndex),
]);

export type CourseLabProgress = typeof courseLabProgress.$inferSelect;
export type InsertCourseLabProgress = typeof courseLabProgress.$inferInsert;

/**
 * Safe sandbox runs recorded before a guided lab can be marked as complete.
 */
export const courseLabRuns = mysqlTable("courseLabRuns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  labIndex: int("labIndex").notNull(),
  command: varchar("command", { length: 500 }).notNull(),
  success: boolean("success").default(false).notNull(),
  output: mediumtext("output").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  ranAt: timestamp("ranAt").defaultNow().notNull(),
});

export type CourseLabRun = typeof courseLabRuns.$inferSelect;
export type InsertCourseLabRun = typeof courseLabRuns.$inferInsert;

/**
 * Final assessment state for each foundational formation.
 */
export const courseAssessments = mysqlTable("courseAssessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  score: int("score").notNull(),
  passed: boolean("passed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => [
  uniqueIndex("course_assessment_user_course").on(table.userId, table.courseSlug),
]);

export type CourseAssessment = typeof courseAssessments.$inferSelect;
export type InsertCourseAssessment = typeof courseAssessments.$inferInsert;

/**
 * Immutable record of each final assessment attempt, used for review and progression history.
 */
export const courseAssessmentAttempts = mysqlTable("courseAssessmentAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  passed: boolean("passed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseAssessmentAttempt = typeof courseAssessmentAttempts.$inferSelect;
export type InsertCourseAssessmentAttempt = typeof courseAssessmentAttempts.$inferInsert;

/**
 * Completion state for standalone lessons that can grant their own certificate.
 */
export const standaloneLessonProgress = mysqlTable("standaloneLessonProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonSlug: varchar("lessonSlug", { length: 120 }).notNull(),
  sectionId: varchar("sectionId", { length: 120 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("standalone_lesson_progress_user_section").on(table.userId, table.lessonSlug, table.sectionId),
]);

export type StandaloneLessonProgress = typeof standaloneLessonProgress.$inferSelect;
export type InsertStandaloneLessonProgress = typeof standaloneLessonProgress.$inferInsert;

/**
 * Immutable assessments submitted for standalone lessons.
 */
export const standaloneLessonAssessmentAttempts = mysqlTable("standaloneLessonAssessmentAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonSlug: varchar("lessonSlug", { length: 120 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  passed: boolean("passed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StandaloneLessonAssessmentAttempt = typeof standaloneLessonAssessmentAttempts.$inferSelect;
export type InsertStandaloneLessonAssessmentAttempt = typeof standaloneLessonAssessmentAttempts.$inferInsert;

/**
 * Visual learning milestones granted to a student per ORBIT formation.
 */
export const courseAchievements = mysqlTable("courseAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  badgeCode: varchar("badgeCode", { length: 80 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_achievement_user_course_badge").on(table.userId, table.courseSlug, table.badgeCode),
]);

export type CourseAchievement = typeof courseAchievements.$inferSelect;
export type InsertCourseAchievement = typeof courseAchievements.$inferInsert;

/**
 * Weekly bonus XP claimed only after server-side verification of the required study activity.
 */
export const weeklyChallengeRewards = mysqlTable("weeklyChallengeRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  weekKey: varchar("weekKey", { length: 16 }).notNull(),
  challengeKey: varchar("challengeKey", { length: 80 }).notNull(),
  awardedXp: int("awardedXp").notNull(),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("weekly_challenge_reward_user_week").on(table.userId, table.weekKey),
]);

export type WeeklyChallengeReward = typeof weeklyChallengeRewards.$inferSelect;
export type InsertWeeklyChallengeReward = typeof weeklyChallengeRewards.$inferInsert;

/**
 * Personal video-learning controls: a saved course watchlist and the most recent
 * learning chapter selected for each video-enabled formation.
 */
export const courseFavorites = mysqlTable("courseFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_favorite_user_course").on(table.userId, table.courseSlug),
]);

export type CourseFavorite = typeof courseFavorites.$inferSelect;
export type InsertCourseFavorite = typeof courseFavorites.$inferInsert;

/**
 * Notas pessoais do aluno em aulas da trilha (Modo Estudo).
 */
export const lessonNotes = mysqlTable("lessonNotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  content: mediumtext("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("lesson_notes_user_idx").on(table.userId),
  index("lesson_notes_user_lesson_idx").on(table.userId, table.lessonId),
]);

export type LessonNote = typeof lessonNotes.$inferSelect;
export type InsertLessonNote = typeof lessonNotes.$inferInsert;

/**
 * Trechos salvos (bookmarks) de aulas — Modo Estudo.
 */
export const lessonBookmarks = mysqlTable("lessonBookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  excerpt: mediumtext("excerpt").notNull(),
  context: varchar("context", { length: 280 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("lesson_bookmarks_user_idx").on(table.userId),
]);

export type LessonBookmark = typeof lessonBookmarks.$inferSelect;
export type InsertLessonBookmark = typeof lessonBookmarks.$inferInsert;

export const courseVideoProgress = mysqlTable("courseVideoProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  moduleIndex: int("moduleIndex").notNull(),
  chapterIndex: int("chapterIndex").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("course_video_progress_user_course_module").on(table.userId, table.courseSlug, table.moduleIndex),
]);

export type CourseVideoProgress = typeof courseVideoProgress.$inferSelect;
export type InsertCourseVideoProgress = typeof courseVideoProgress.$inferInsert;

/**
 * Immutable attempts for the short knowledge check that closes each video session.
 */
export const courseVideoQuizAttempts = mysqlTable("courseVideoQuizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  moduleIndex: int("moduleIndex").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_video_quiz_user_module").on(table.userId, table.courseSlug, table.moduleIndex),
]);

export type CourseVideoQuizAttempt = typeof courseVideoQuizAttempts.$inferSelect;
export type InsertCourseVideoQuizAttempt = typeof courseVideoQuizAttempts.$inferInsert;

/**
 * Immutable XP grants emitted only when a student reaches a perfect-quiz streak
 * milestone. The unique source attempt prevents duplicate grants on retries.
 */
export const quizStreakRewards = mysqlTable("quizStreakRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  attemptType: varchar("attemptType", { length: 24 }).notNull(),
  attemptId: int("attemptId").notNull(),
  streakLength: int("streakLength").notNull(),
  awardedXp: int("awardedXp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("quiz_streak_reward_attempt").on(table.userId, table.attemptType, table.attemptId),
]);

export type QuizStreakReward = typeof quizStreakRewards.$inferSelect;
export type InsertQuizStreakReward = typeof quizStreakRewards.$inferInsert;

/**
 * Private study notes maintained by a student for an individual video chapter.
 */
export const courseVideoNotes = mysqlTable("courseVideoNotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  moduleIndex: int("moduleIndex").notNull(),
  chapterIndex: int("chapterIndex").notNull(),
  content: mediumtext("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("course_video_note_user_chapter").on(table.userId, table.courseSlug, table.moduleIndex, table.chapterIndex),
]);

export type CourseVideoNote = typeof courseVideoNotes.$inferSelect;
export type InsertCourseVideoNote = typeof courseVideoNotes.$inferInsert;

/**
 * Server-timed specialty simulations. A session starts on the backend so refreshes
 * and local-clock changes do not extend the allowed duration.
 */
export const specialtySimulationAttempts = mysqlTable("specialtySimulationAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  simulationSlug: varchar("simulationSlug", { length: 80 }).notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  submittedAt: timestamp("submittedAt"),
  answers: json("answers"),
  score: int("score"),
  passed: boolean("passed").default(false).notNull(),
  timedOut: boolean("timedOut").default(false).notNull(),
});

export type SpecialtySimulationAttempt = typeof specialtySimulationAttempts.$inferSelect;
export type InsertSpecialtySimulationAttempt = typeof specialtySimulationAttempts.$inferInsert;

/**
 * Nominal certificates issued when all course requirements are complete.
 */
export const courseCertificates = mysqlTable("courseCertificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  courseTitle: varchar("courseTitle", { length: 255 }).notNull(),
  studentName: varchar("studentName", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 80 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_certificate_user_course").on(table.userId, table.courseSlug),
]);

export type CourseCertificate = typeof courseCertificates.$inferSelect;
export type InsertCourseCertificate = typeof courseCertificates.$inferInsert;

/**
 * Governed registry of external learning sources. Content keeps its source,
 * license statement, pedagogical purpose and optional course association.
 */
export const externalContentSources = mysqlTable("externalContentSources", {
  id: int("id").autoincrement().primaryKey(),
  courseSlug: varchar("courseSlug", { length: 120 }),
  category: varchar("category", { length: 40 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  license: varchar("license", { length: 255 }).notNull(),
  usage: text("usage").notNull(),
  href: varchar("href", { length: 1000 }).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExternalContentSource = typeof externalContentSources.$inferSelect;
export type InsertExternalContentSource = typeof externalContentSources.$inferInsert;

/**
 * Per-student listening position and completion state for the authored Podcast.
 */
export const podcastProgress = mysqlTable("podcastProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  positionSeconds: int("positionSeconds").notNull().default(0),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("podcast_progress_user_episode").on(table.userId, table.episodeId),
]);

export type PodcastProgress = typeof podcastProgress.$inferSelect;
export type InsertPodcastProgress = typeof podcastProgress.$inferInsert;

/**
 * Review-quiz attempts submitted at the end of each authored Podcast episode.
 */
export const podcastQuizAttempts = mysqlTable("podcastQuizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("podcast_quiz_user_episode").on(table.userId, table.episodeId),
]);

export type PodcastQuizAttempt = typeof podcastQuizAttempts.$inferSelect;
export type InsertPodcastQuizAttempt = typeof podcastQuizAttempts.$inferInsert;

/**
 * Listener badges of the CyberCast series: earned once per user, idempotent,
 * awarded for milestones such as completed episodes, perfect quizzes or a
 * full season completed with quizzes at 100%.
 */
export const podcastListenerBadges = mysqlTable("podcastListenerBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeCode: varchar("badgeCode", { length: 80 }).notNull(),
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("podcast_listener_badge_user_code").on(table.userId, table.badgeCode),
]);

export type PodcastListenerBadge = typeof podcastListenerBadges.$inferSelect;
export type InsertPodcastListenerBadge = typeof podcastListenerBadges.$inferInsert;

/**
 * Vocabulary favorites from the English for Cyber Pros special episodes.
 * Learners mark terms in the transcript and review them later.
 */
export const englishVocabularyFavorites = mysqlTable("englishVocabularyFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  termId: varchar("termId", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("english_vocab_favorite_user_term").on(table.userId, table.termId),
]);

export type EnglishVocabularyFavorite = typeof englishVocabularyFavorites.$inferSelect;
export type InsertEnglishVocabularyFavorite = typeof englishVocabularyFavorites.$inferInsert;

/**
 * Favorite CyberCast episodes saved by learners for later listening.
 */
export const podcastEpisodeFavorites = mysqlTable("podcastEpisodeFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("podcast_episode_favorite_user_episode").on(table.userId, table.episodeId),
]);

export type PodcastEpisodeFavorite = typeof podcastEpisodeFavorites.$inferSelect;
export type InsertPodcastEpisodeFavorite = typeof podcastEpisodeFavorites.$inferInsert;

/**
 * Daily study streaks: one row per user per day when they complete study
 * activity (quiz, lesson, podcast or free video).
 */
export const dailyStudyStreaks = mysqlTable("dailyStudyStreaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dayKey: varchar("dayKey", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("daily_study_streak_user_day").on(table.userId, table.dayKey),
]);

export type DailyStudyStreak = typeof dailyStudyStreaks.$inferSelect;
export type InsertDailyStudyStreak = typeof dailyStudyStreaks.$inferInsert;

/**
 * Immutable XP grants emitted when a daily study streak milestone is reached.
 */
export const dailyStreakRewards = mysqlTable("dailyStreakRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dayKey: varchar("dayKey", { length: 10 }).notNull(),
  streakLength: int("streakLength").notNull(),
  awardedXp: int("awardedXp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("daily_streak_reward_user_day").on(table.userId, table.dayKey),
]);

export type DailyStreakReward = typeof dailyStreakRewards.$inferSelect;
export type InsertDailyStreakReward = typeof dailyStreakRewards.$inferInsert;

/**
 * Domain mastery badges: awarded once per user per SY0-701 domain when their
 * best quiz attempt in that domain reaches the mastery threshold (80%).
 */
export const domainMasteryBadges = mysqlTable("domainMasteryBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainId: int("domainId").notNull(),
  bestScorePct: int("bestScorePct").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("domain_mastery_badge_user_domain").on(table.userId, table.domainId),
]);

export type DomainMasteryBadge = typeof domainMasteryBadges.$inferSelect;
export type InsertDomainMasteryBadge = typeof domainMasteryBadges.$inferInsert;

/**
 * Guided interview simulation attempts for the English special episodes.
 * Each attempt records the role, question answered, keywords found in the
 * learner's written answer and the server-side feedback score.
 */
export const englishInterviewAttempts = mysqlTable("englishInterviewAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questionId: varchar("questionId", { length: 80 }).notNull(),
  answerText: text("answerText").notNull(),
  keywordsFound: json("keywordsFound").notNull(),
  score: int("score").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EnglishInterviewAttempt = typeof englishInterviewAttempts.$inferSelect;
export type InsertEnglishInterviewAttempt = typeof englishInterviewAttempts.$inferInsert;

/**
 * Spaced-repetition state for English vocabulary flashcards (English for
 * Cyber Pros track). Each learner-term row tracks a mastery stage, a
 * computed next-review date and review counts.
 *
 * Stages follow a growing interval ladder: 0 = new card, 1 = +1 day, 2 = +3
 * days, 3 = +7 days, 4 = +14 days, 5 = mastered (+30 days, caps there).
 */
export const flashcardSrsAttempts = mysqlTable("flashcardSrsAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  termId: varchar("termId", { length: 80 }).notNull(),
  stage: int("stage").notNull().default(0),
  nextReviewAt: timestamp("nextReviewAt").notNull(),
  reviewCount: int("reviewCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("flashcard_srs_user_term").on(table.userId, table.termId),
]);

export type FlashcardSrsAttempt = typeof flashcardSrsAttempts.$inferSelect;
export type InsertFlashcardSrsAttempt = typeof flashcardSrsAttempts.$inferInsert;

/**
 * Watch progress for the free video course library (external YouTube content
 * curated for students). One row per learner-course, recording the watched
 * flag and the XP granted when the student finishes a course video.
 */
export const freeVideoCourseProgress = mysqlTable("freeVideoCourseProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  watched: int("watched").notNull().default(0),
  xpGranted: int("xpGranted").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("free_video_progress_user_slug").on(table.userId, table.courseSlug),
]);
export type FreeVideoCourseProgress = typeof freeVideoCourseProgress.$inferSelect;
export type InsertFreeVideoCourseProgress = typeof freeVideoCourseProgress.$inferInsert;
/**
 * Portfolio evidence items attached by the student to completed guided labs.
 * Stores the S3 reference of the uploaded file (screenshot, report PDF) plus
 * a short description so the student can showcase lab work on their profile.
 */
export const portfolioItems = mysqlTable("portfolioItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  labIndex: int("labIndex").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: mediumtext("description"),
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull().default("image/png"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("portfolio_user_idx").on(table.userId),
  index("portfolio_user_course_lab_idx").on(table.userId, table.courseSlug, table.labIndex),
]);
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;

export const careerQuizResults = mysqlTable("careerQuizResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  topArea: varchar("topArea", { length: 64 }).notNull(),
  topScore: int("topScore").notNull(),
  runnerUpArea: varchar("runnerUpArea", { length: 64 }),
  runnerUpScore: int("runnerUpScore"),
  scoresJson: json("scoresJson"),
  awardedXp: int("awardedXp").notNull().default(0),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [
  index("career_quiz_user_idx").on(table.userId),
]);
export type CareerQuizResult = typeof careerQuizResults.$inferSelect;
export type InsertCareerQuizResult = typeof careerQuizResults.$inferInsert;

/**
 * Completion records for the hands-on Cyber Projects program: each row
 * marks a student project (SOC report, incident response, security audit)
 * as submitted with its deliverable metadata so it can be shown on the
 * student's public portfolio alongside lab evidence.
 */
export const projectCompletions = mysqlTable("projectCompletions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: varchar("projectId", { length: 80 }).notNull(),
  summary: mediumtext("summary"),
  status: varchar("status", { length: 24 }).default("submitted").notNull(),
  rubric: json("rubric"),
  reviewerComment: mediumtext("reviewerComment"),
  reviewedByUserId: int("reviewedByUserId"),
  reviewedAt: timestamp("reviewedAt"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("project_completion_user_project").on(table.userId, table.projectId),
]);
export type ProjectCompletion = typeof projectCompletions.$inferSelect;
export type InsertProjectCompletion = typeof projectCompletions.$inferInsert;

/**
 * Completion records for external CTFs and practice labs from the curated
 * CTF hub: one row per learner-challenge, granting persistent XP when the
 * student reports having finished the challenge on the external platform.
 */
export const ctfCompletions = mysqlTable("ctfCompletions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  ctfId: varchar("ctfId", { length: 80 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("ctf_completion_user_ctf").on(table.userId, table.ctfId),
]);
export type CtfCompletion = typeof ctfCompletions.$inferSelect;
export type InsertCtfCompletion = typeof ctfCompletions.$inferInsert;

/**
 * Per-student listening progress and completion state for the CyberDimension
 * Audio Lab series (micro-learning episodes grouped by theme).
 */
export const audioLabProgress = mysqlTable("audioLabProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  positionSeconds: int("positionSeconds").notNull().default(0),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("audiolab_progress_user_episode").on(table.userId, table.episodeId),
]);
export type AudioLabProgress = typeof audioLabProgress.$inferSelect;
export type InsertAudioLabProgress = typeof audioLabProgress.$inferInsert;

/**
 * CyberDimension Podcast episodes (Audio Lab) favorited by learners.
 */
export const audioLabFavorites = mysqlTable("audioLabFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("audiolab_favorite_user_episode").on(table.userId, table.episodeId),
]);
export type AudioLabFavorite = typeof audioLabFavorites.$inferSelect;
export type InsertAudioLabFavorite = typeof audioLabFavorites.$inferInsert;

/**
 * Immutable review-quiz attempts submitted at the end of each Audio Lab episode.
 */
export const audioLabQuizAttempts = mysqlTable("audioLabQuizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("audiolab_quiz_user_episode").on(table.userId, table.episodeId),
]);
export type AudioLabQuizAttempt = typeof audioLabQuizAttempts.$inferSelect;
export type InsertAudioLabQuizAttempt = typeof audioLabQuizAttempts.$inferInsert;
