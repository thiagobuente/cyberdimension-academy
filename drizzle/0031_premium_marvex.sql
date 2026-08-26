CREATE TABLE `audioLabProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` varchar(100) NOT NULL,
	`positionSeconds` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audioLabProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `audiolab_progress_user_episode` UNIQUE(`userId`,`episodeId`)
);
--> statement-breakpoint
CREATE TABLE `audioLabQuizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` varchar(100) NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`answers` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audioLabQuizAttempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `audiolab_quiz_user_episode` UNIQUE(`userId`,`episodeId`)
);
