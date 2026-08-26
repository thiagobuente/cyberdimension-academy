ALTER TABLE `projectCompletions` ADD `status` varchar(24) DEFAULT 'submitted' NOT NULL;--> statement-breakpoint
ALTER TABLE `projectCompletions` ADD `rubric` json;--> statement-breakpoint
ALTER TABLE `projectCompletions` ADD `reviewerComment` mediumtext;--> statement-breakpoint
ALTER TABLE `projectCompletions` ADD `reviewedByUserId` int;--> statement-breakpoint
ALTER TABLE `projectCompletions` ADD `reviewedAt` timestamp;