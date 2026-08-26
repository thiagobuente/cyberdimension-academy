CREATE TABLE `englishInterviewAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` varchar(80) NOT NULL,
	`answerText` text NOT NULL,
	`keywordsFound` json NOT NULL,
	`score` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `englishInterviewAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `englishVocabularyFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`termId` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `englishVocabularyFavorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `english_vocab_favorite_user_term` UNIQUE(`userId`,`termId`)
);
