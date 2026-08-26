CREATE TABLE `courseVideoNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`moduleIndex` int NOT NULL,
	`chapterIndex` int NOT NULL,
	`content` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseVideoNotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_video_note_user_chapter` UNIQUE(`userId`,`courseSlug`,`moduleIndex`,`chapterIndex`)
);
