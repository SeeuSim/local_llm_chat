import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';
import { IAPIChatRoomGetOutput } from './types';
import { desc } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const db = await PgInstance.getInstance();
    const rooms = await db
      .select({
        id: RoomTable.id,
        summary: RoomTable.summary,
        modifiedTime: RoomTable.modifiedTime,
      })
      .from(RoomTable)
      .orderBy(desc(RoomTable.modifiedTime));
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
    const output: IAPIChatRoomGetOutput = { rooms };
    return new Response(JSON.stringify(output), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      { status: 500 }
    );
  }
}
