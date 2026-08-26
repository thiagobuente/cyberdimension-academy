CREATE TABLE `courseAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`badgeCode` varchar(80) NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseAchievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_achievement_user_course_badge` UNIQUE(`userId`,`courseSlug`,`badgeCode`)
);
--> statement-breakpoint
CREATE TABLE `courseAssessmentAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`answers` json NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseAssessmentAttempts_id` PRIMARY KEY(`id`)
);
