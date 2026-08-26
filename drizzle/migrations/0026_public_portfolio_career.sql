ALTER TABLE `users` ADD `portfolioPublicToken` varchar(64);
ALTER TABLE `users` ADD UNIQUE KEY `users_portfolio_token_unique` (`portfolioPublicToken`);
ALTER TABLE `users` ADD `portfolioPublicEnabled` boolean DEFAULT false;
CREATE TABLE IF NOT EXISTS `careerQuizResults` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `topArea` varchar(64) NOT NULL,
  `topScore` int NOT NULL,
  `runnerUpArea` varchar(64),
  `runnerUpScore` int,
  `scoresJson` json,
  `completedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `career_quiz_user_unique` UNIQUE KEY(`userId`),
  CONSTRAINT `career_quiz_result_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
