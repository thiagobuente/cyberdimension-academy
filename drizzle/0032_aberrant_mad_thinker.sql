CREATE TABLE `audioLabFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audioLabFavorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `audiolab_favorite_user_episode` UNIQUE(`userId`,`episodeId`)
);
