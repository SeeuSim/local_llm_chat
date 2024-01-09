CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdTime" timestamp DEFAULT now(),
	"content" text,
	"metadata" jsonb,
	"embedding" vector(768),
	CONSTRAINT "embeddings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid DEFAULT gen_random_uuid(),
	"room_id" uuid,
	"time_stamp" timestamp DEFAULT now(),
	"persona" text,
	"content" text,
  "document_titles" text[] DEFAULT array[]::text[] ,
	CONSTRAINT "messages_room_id_id_pk" PRIMARY KEY("room_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdTime" timestamp DEFAULT now(),
	"modifiedTime" timestamp DEFAULT now(),
	"summary" text,
	CONSTRAINT "room_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_index" ON "messages" ("time_stamp");--> statement-breakpoint

CREATE UNIQUE INDEX embeddings_meta_unique ON "embeddings" (("metadata"->>'title'),("metadata"->>'splitNumber'));--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "modifiedIndex" ON "room" ("modifiedTime");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
