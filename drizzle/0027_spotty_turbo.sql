CREATE TABLE `careerQuizResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topArea` varchar(64) NOT NULL,
	`topScore` int NOT NULL,
	`runnerUpArea` varchar(64),
	`runnerUpScore` int,
	`scoresJson` json,
	`awardedXp` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `careerQuizResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` varchar(80) NOT NULL,
	`summary` mediumtext,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectCompletions_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_completion_user_project` UNIQUE(`userId`,`projectId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `portfolioPublicToken` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `portfolioPublicEnabled` boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX `career_quiz_user_idx` ON `careerQuizResults` (`userId`);