CREATE TABLE `podcastProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` varchar(100) NOT NULL,
	`positionSeconds` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `podcastProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `podcast_progress_user_episode` UNIQUE(`userId`,`episodeId`)
);
