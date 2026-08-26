CREATE TABLE `weeklyChallengeRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekKey` varchar(16) NOT NULL,
	`challengeKey` varchar(80) NOT NULL,
	`awardedXp` int NOT NULL,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weeklyChallengeRewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `weekly_challenge_reward_user_week` UNIQUE(`userId`,`weekKey`)
);
