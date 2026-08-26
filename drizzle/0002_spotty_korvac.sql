CREATE TABLE `courseAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`score` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	CONSTRAINT `courseAssessments_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_assessment_user_course` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `courseCertificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`courseTitle` varchar(255) NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`identifier` varchar(80) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseCertificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `courseCertificates_identifier_unique` UNIQUE(`identifier`),
	CONSTRAINT `course_certificate_user_course` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `courseLabProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`labIndex` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	CONSTRAINT `courseLabProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_lab_progress_user_course_lab` UNIQUE(`userId`,`courseSlug`,`labIndex`)
);
--> statement-breakpoint
CREATE TABLE `courseModuleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`moduleIndex` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	CONSTRAINT `courseModuleProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_module_progress_user_course_module` UNIQUE(`userId`,`courseSlug`,`moduleIndex`)
);
