CREATE TABLE `quizStreakRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`attemptType` varchar(24) NOT NULL,
	`attemptId` int NOT NULL,
	`streakLength` int NOT NULL,
	`awardedXp` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizStreakRewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_streak_reward_attempt` UNIQUE(`userId`,`attemptType`,`attemptId`)
);
