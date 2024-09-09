CREATE TABLE `incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monthId` integer NOT NULL,
	`name` text NOT NULL,
	`note` text,
	`planned` integer NOT NULL,
	`amount` integer NOT NULL,
	`date` integer DEFAULT (unixepoch()),
	`createdAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`monthId`) REFERENCES `months`(`id`) ON UPDATE no action ON DELETE no action
);
