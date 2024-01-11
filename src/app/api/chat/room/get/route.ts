import { desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';

import { IAPIChatRoomGetOutput } from './types';

export async function POST(req: NextRequest) {
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
      return new NextResponse(
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
    return new NextResponse(JSON.stringify(output), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error,
      }),
      { status: 500 }
    );
  }
}
