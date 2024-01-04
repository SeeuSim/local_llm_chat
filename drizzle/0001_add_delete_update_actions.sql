ALTER TABLE "messages" DROP CONSTRAINT "messages_room_id_room_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
