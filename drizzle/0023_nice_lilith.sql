CREATE TABLE `freeVideoCourseProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`watched` int NOT NULL DEFAULT 0,
	`xpGranted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `freeVideoCourseProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `free_video_progress_user_slug` UNIQUE(`userId`,`courseSlug`)
);
