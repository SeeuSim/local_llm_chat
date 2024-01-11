import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import PgInstance from '@/lib/db/dbInstance';
import { MessagesTable, RoomTable } from '@/lib/db/schema';

import { IAPIChatMessagesCreateParams } from './types';

export async function POST(req: NextRequest) {
  const params: IAPIChatMessagesCreateParams = await req.json();
  if (!params || !params.messages || !Array.isArray(params.messages)) {
    return new NextResponse(
      JSON.stringify({
        message: 'Invalid payload, or missing parameters',
      }),
      { status: 400 }
    );
  }

  const ids = Array.from(new Set(params.messages.map((message) => message.roomId as string)));

  try {
    const db = await PgInstance.getInstance();
    await db.transaction(async (tx) => {
      await Promise.all([
        tx.insert(MessagesTable).values(params.messages).returning(),
        // Update the room for each unique room
        ...ids.map((id) =>
          tx
            .update(RoomTable)
            .set({ modifiedTime: new Date() })
            .where(eq(RoomTable.id, sql`${id}::uuid`))
        ),
      ]);
    });
    return new NextResponse('Inserts successful', { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
