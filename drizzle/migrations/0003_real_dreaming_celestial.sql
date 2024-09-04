CREATE TABLE `shareTransactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shareGroupId` integer NOT NULL,
	`tranId` integer NOT NULL,
	`note` text,
	`amount` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`shareGroupId`) REFERENCES `shareGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tranId`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `shareGroups` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `shareGroups` DROP COLUMN `defaultValue`;