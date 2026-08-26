CREATE TABLE `portfolioItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`labIndex` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` mediumtext,
	`fileUrl` varchar(1000) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`mimeType` varchar(120) NOT NULL DEFAULT 'image/png',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolioItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `portfolio_user_idx` ON `portfolioItems` (`userId`);--> statement-breakpoint
CREATE INDEX `portfolio_user_course_lab_idx` ON `portfolioItems` (`userId`,`courseSlug`,`labIndex`);