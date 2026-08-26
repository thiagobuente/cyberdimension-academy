CREATE TABLE `courseFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseFavorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_favorite_user_course` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `courseVideoProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`moduleIndex` int NOT NULL,
	`chapterIndex` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseVideoProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_video_progress_user_course_module` UNIQUE(`userId`,`courseSlug`,`moduleIndex`)
);
