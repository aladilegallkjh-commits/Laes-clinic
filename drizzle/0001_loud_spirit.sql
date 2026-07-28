CREATE TABLE `beforeAfterGallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`procedureId` int NOT NULL,
	`beforeImage` varchar(500) NOT NULL,
	`afterImage` varchar(500) NOT NULL,
	`title` varchar(255),
	`description` text,
	`clientName` varchar(255),
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beforeAfterGallery_id` PRIMARY KEY(`id`)
);
