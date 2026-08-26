CREATE TABLE `standaloneLessonAssessmentAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonSlug` varchar(120) NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`answers` json NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standaloneLessonAssessmentAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standaloneLessonProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonSlug` varchar(120) NOT NULL,
	`sectionId` varchar(120) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standaloneLessonProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `standalone_lesson_progress_user_section` UNIQUE(`userId`,`lessonSlug`,`sectionId`)
);
