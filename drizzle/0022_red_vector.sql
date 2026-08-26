CREATE TABLE `flashcardSrsAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`termId` varchar(80) NOT NULL,
	`stage` int NOT NULL DEFAULT 0,
	`nextReviewAt` timestamp NOT NULL,
	`reviewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flashcardSrsAttempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `flashcard_srs_user_term` UNIQUE(`userId`,`termId`)
);
