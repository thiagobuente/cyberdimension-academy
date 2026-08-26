CREATE TABLE `specialtySimulationAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`simulationSlug` varchar(80) NOT NULL,
	`totalQuestions` int NOT NULL,
	`durationSeconds` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`submittedAt` timestamp,
	`answers` json,
	`score` int,
	`passed` boolean NOT NULL DEFAULT false,
	`timedOut` boolean NOT NULL DEFAULT false,
	CONSTRAINT `specialtySimulationAttempts_id` PRIMARY KEY(`id`)
);
