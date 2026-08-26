CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainId` int NOT NULL,
	`identifier` varchar(50) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_identifier_unique` UNIQUE(`identifier`)
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`code` varchar(20) NOT NULL,
	`description` text,
	`percentage` int NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`icon` varchar(50) DEFAULT 'shield',
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domains_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`domainId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` mediumtext NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`duration` int DEFAULT 0,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainId` int NOT NULL,
	`lessonId` int,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`domainId` int NOT NULL,
	`question` mediumtext NOT NULL,
	`options` json NOT NULL,
	`correctAnswer` int NOT NULL,
	`explanation` mediumtext,
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainId` int NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`answers` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
