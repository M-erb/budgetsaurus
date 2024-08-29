ALTER TABLE `user` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `years_name_unique` ON `years` (`name`);