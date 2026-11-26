CREATE TABLE `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`school` text NOT NULL,
	`student_id` text NOT NULL,
	`year` text NOT NULL,
	`email` text NOT NULL,
	`nickname` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `registrations_school_student` ON `registrations` (`school`,`student_id`);