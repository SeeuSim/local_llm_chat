CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"metadata" jsonb,
	"embedding" vector(768),
	CONSTRAINT "embeddings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"room_id" serial NOT NULL,
	"time_stamp" timestamp,
	"persona" text,
	"content" text,
	CONSTRAINT "messages_room_id_time_stamp_pk" PRIMARY KEY("room_id","time_stamp")
) PARTITION BY HASH ("room_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"summary" text,
	CONSTRAINT "room_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_index" ON "messages" ("time_stamp");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
