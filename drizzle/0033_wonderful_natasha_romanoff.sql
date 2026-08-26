CREATE TABLE `lessonBookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`excerpt` mediumtext NOT NULL,
	`context` varchar(280),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lessonBookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessonNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`content` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessonNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lesson_bookmarks_user_idx` ON `lessonBookmarks` (`userId`);--> statement-breakpoint
CREATE INDEX `lesson_notes_user_idx` ON `lessonNotes` (`userId`);--> statement-breakpoint
CREATE INDEX `lesson_notes_user_lesson_idx` ON `lessonNotes` (`userId`,`lessonId`);