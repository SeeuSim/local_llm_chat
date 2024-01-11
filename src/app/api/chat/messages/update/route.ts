import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import PgInstance from '@/lib/db/dbInstance';
import { MessagesTable } from '@/lib/db/schema';

import { IAPIChatMessagesUpdateParams } from './types';

export async function POST(req: NextRequest) {
  const params: IAPIChatMessagesUpdateParams = await req.json();
  if (!params || !params.messages || !Array.isArray(params.messages)) {
    return new NextResponse(
      JSON.stringify({
        message: 'Invalid payload, or missing parameters',
      }),
      { status: 400 }
    );
  }

  try {
    const db = await PgInstance.getInstance();
    await db.transaction(async (tx) => {
      await Promise.all(
        params.messages.map((message) =>
          tx
            .update(MessagesTable)
            .set({ content: message.content, isAborted: message.isAborted ?? false })
            .where(eq(MessagesTable.id, sql`${message.id}::uuid`))
        )
      );
    });
    return new NextResponse('Update Successful', { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
