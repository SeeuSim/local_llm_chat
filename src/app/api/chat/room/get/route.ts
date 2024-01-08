import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const db = await PgInstance.getInstance();
    const rooms = await db
      .select({
        id: RoomTable.id,
        summary: RoomTable.summary,
        modifiedTime: RoomTable.modifiedTime,
      })
      .from(RoomTable);
    if (!rooms || !Array.isArray(rooms)) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'An unexpected error occurred',
          },
          result: rooms,
        }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({
        rooms,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      { status: 500 }
    );
  }
}
