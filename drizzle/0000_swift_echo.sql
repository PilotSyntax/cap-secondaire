CREATE TABLE `activity_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`family_id` text NOT NULL,
	`event_type` text NOT NULL,
	`subject` text,
	`skill` text,
	`score` integer,
	`duration_seconds` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `family_states` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL
);
