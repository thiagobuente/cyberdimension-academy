CREATE TABLE `podcastListenerBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeCode` varchar(80) NOT NULL,
	`awardedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `podcastListenerBadges_id` PRIMARY KEY(`id`),
	CONSTRAINT `podcast_listener_badge_user_code` UNIQUE(`userId`,`badgeCode`)
);
