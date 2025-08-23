CREATE TABLE `content_pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`meta_description` text,
	`is_published` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `content_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`section_key` text NOT NULL,
	`section_type` text NOT NULL,
	`title` text,
	`content` text,
	`image_url` text,
	`sort_order` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DROP INDEX IF EXISTS `admin_users_username_unique`;--> statement-breakpoint
ALTER TABLE admin_users ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE admin_users ADD `role` text DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE admin_users ADD `is_active` integer DEFAULT true;--> statement-breakpoint
CREATE UNIQUE INDEX `content_pages_slug_unique` ON `content_pages` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
ALTER TABLE `admin_users` DROP COLUMN `username`;