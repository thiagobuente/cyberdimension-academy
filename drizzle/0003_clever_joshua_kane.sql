CREATE TABLE `courseLabRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`labIndex` int NOT NULL,
	`command` varchar(500) NOT NULL,
	`success` boolean NOT NULL DEFAULT false,
	`output` mediumtext NOT NULL,
	`verifiedAt` timestamp,
	`ranAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseLabRuns_id` PRIMARY KEY(`id`)
);
