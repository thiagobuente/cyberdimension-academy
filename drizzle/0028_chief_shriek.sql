ALTER TABLE `certificates` ADD CONSTRAINT `certificates_user_domain` UNIQUE(`userId`,`domainId`);--> statement-breakpoint
ALTER TABLE `courseVideoQuizAttempts` ADD CONSTRAINT `course_video_quiz_user_module` UNIQUE(`userId`,`courseSlug`,`moduleIndex`);--> statement-breakpoint
ALTER TABLE `podcastQuizAttempts` ADD CONSTRAINT `podcast_quiz_user_episode` UNIQUE(`userId`,`episodeId`);--> statement-breakpoint
ALTER TABLE `progress` ADD CONSTRAINT `progress_user_domain_lesson` UNIQUE(`userId`,`domainId`,`lessonId`);--> statement-breakpoint
CREATE INDEX `quiz_attempts_user_domain` ON `quizAttempts` (`userId`,`domainId`);