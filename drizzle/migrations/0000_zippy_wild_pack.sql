CREATE TABLE `budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`catId` integer NOT NULL,
	`monthId` integer NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`catId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`monthId`) REFERENCES `months`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`note` text,
	`createdAt` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `months` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`yearId` integer NOT NULL,
	`name` text NOT NULL,
	`note` text,
	FOREIGN KEY (`yearId`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shareGroups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`defaultValue` integer NOT NULL,
	`note` text,
	`createdAt` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthId` integer NOT NULL,
	`catId` integer NOT NULL,
	`name` text NOT NULL,
	`note` text,
	`amount` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`monthId`) REFERENCES `months`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`catId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`pass` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `years` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`note` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `years_name_unique` ON `years` (`name`);