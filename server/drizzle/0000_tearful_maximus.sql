CREATE TABLE `images` (
	`id` integer PRIMARY KEY NOT NULL,
	`review_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt_text` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`theater_id` integer NOT NULL,
	`screen_id` integer NOT NULL,
	`seat_row` text NOT NULL,
	`seat_number` integer NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`view_rating` integer NOT NULL,
	`comfort_rating` integer NOT NULL,
	`sound_rating` integer NOT NULL,
	`overall_rating` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`theater_id`) REFERENCES `theatres`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`screen_id`) REFERENCES `screens`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `screens` (
	`id` integer PRIMARY KEY NOT NULL,
	`theater_id` integer NOT NULL,
	`name` text NOT NULL,
	`screen_type` text DEFAULT 'Laser' NOT NULL,
	FOREIGN KEY (`theater_id`) REFERENCES `theatres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `theatres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`avatar_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);