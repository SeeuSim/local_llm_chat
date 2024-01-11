import { NextResponse } from 'next/server';

import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';

import type { IAPIChatRoomCreateResponse } from './types';

export async function POST(_req: Request) {
  try {
    const db = await PgInstance.getInstance();
    const rooms = await db.insert(RoomTable).values({}).returning();
    if (rooms && rooms.length > 0) {
      const room = rooms[0];

      const output: IAPIChatRoomCreateResponse = {
        id: room.id,
      };

      return new NextResponse(JSON.stringify(output), { status: 200 });
    }
    return new NextResponse(
      JSON.stringify({
        message: 'An error occurred',
        rooms,
      }),
      { status: 500 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error,
      }),
      { status: 500 }
    );
  }
}
