CREATE TABLE `ctfCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ctfId` varchar(80) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ctfCompletions_id` PRIMARY KEY(`id`),
	CONSTRAINT `ctf_completion_user_ctf` UNIQUE(`userId`,`ctfId`)
);
