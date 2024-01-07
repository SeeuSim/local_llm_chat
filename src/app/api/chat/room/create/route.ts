import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';

const _path = 'api/chat/room/create';

export async function POST(_req: Request) {
  try {
    const db = await PgInstance.getInstance();
    const rooms = await db.insert(RoomTable).values({}).returning();
    if (rooms && rooms.length > 0) {
      const room = rooms[0];
      return new Response(
        JSON.stringify({
          id: room.id,
        }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: 'An unexpected error occurred.', result: rooms }),
      { status: 500 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
