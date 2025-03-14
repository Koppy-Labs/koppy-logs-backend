CREATE TABLE `categories` (
	`id` text PRIMARY KEY DEFAULT 'dbhco0qe80bvkena5iwzqst0' NOT NULL,
	`server_id` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT '"2025-03-14T18:18:11.208Z"' NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` text PRIMARY KEY DEFAULT 'u1ilh6ibopbn8x7u7gh0blv6' NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`server_id` text NOT NULL,
	`message` text NOT NULL,
	`createdAt` integer DEFAULT '"2025-03-14T18:18:11.207Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` text PRIMARY KEY DEFAULT 'nijayaw54lhf1idoglvw4yzi' NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	`image_url` text NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`createdAt` integer DEFAULT '"2025-03-14T18:18:11.207Z"' NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT 'c5aplcycpyt1ywtsh9a8a0wu' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`avatar_url` text NOT NULL,
	`createdAt` integer DEFAULT '"2025-03-14T18:18:11.208Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);