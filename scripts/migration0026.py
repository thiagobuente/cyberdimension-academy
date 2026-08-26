#!/usr/bin/env python3
"""Gera a migração 0026: portfólio público (token em users) e resultados do teste vocacional."""
import json
import os
import time

MIGRATION = """-- 0026: portfólio público + resultados do teste vocacional
ALTER TABLE `users` ADD `portfolioPublicToken` varchar(64) UNIQUE;
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
"""

base = "/home/ubuntu/cyberdimension-academy/drizzle"
journal = os.path.join(base, "meta", "_journal.json")
with open(journal) as f:
    data = json.load(f)

idx = len(data["entries"])
version = idx + 1
tag = f"{idx:04d}_public_portfolio_career"
entry = {"idx": idx, "version": "5", "when": int(time.time() * 1000), "tag": tag, "breakpoints": True}
data["entries"].append(entry)
with open(journal, "w") as f:
    json.dump(data, f, indent=1)

sql_path = os.path.join(base, "migrations", f"{tag}.sql")
with open(sql_path, "w") as f:
    f.write(MIGRATION)
print("Migração", tag, "escrita em", sql_path)
