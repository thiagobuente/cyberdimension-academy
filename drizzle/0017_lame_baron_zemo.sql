CREATE TABLE `externalContentSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseSlug` varchar(120),
	`category` varchar(40) NOT NULL,
	`title` varchar(255) NOT NULL,
	`source` varchar(255) NOT NULL,
	`license` varchar(255) NOT NULL,
	`usage` text NOT NULL,
	`href` varchar(1000) NOT NULL,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `externalContentSources_id` PRIMARY KEY(`id`)
);
