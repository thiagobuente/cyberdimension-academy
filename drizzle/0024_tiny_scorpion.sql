CREATE TABLE `dailyStreakRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dayKey` varchar(10) NOT NULL,
	`streakLength` int NOT NULL,
	`awardedXp` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyStreakRewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_streak_reward_user_day` UNIQUE(`userId`,`dayKey`)
);
--> statement-breakpoint
CREATE TABLE `dailyStudyStreaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dayKey` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyStudyStreaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_study_streak_user_day` UNIQUE(`userId`,`dayKey`)
);
--> statement-breakpoint
CREATE TABLE `domainMasteryBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainId` int NOT NULL,
	`bestScorePct` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domainMasteryBadges_id` PRIMARY KEY(`id`),
	CONSTRAINT `domain_mastery_badge_user_domain` UNIQUE(`userId`,`domainId`)
);
--> statement-breakpoint
CREATE TABLE `podcastEpisodeFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `podcastEpisodeFavorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `podcast_episode_favorite_user_episode` UNIQUE(`userId`,`episodeId`)
);
