CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`note` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `months` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`yearId` integer,
	`name` text NOT NULL,
	`note` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`yearId`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shareGroups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`defaultValue` integer NOT NULL,
	`note` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthId` integer,
	`catId` integer,
	`name` text NOT NULL,
	`note` text,
	`amount` integer NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`monthId`) REFERENCES `months`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`catId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`pass` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `years` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`note` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
