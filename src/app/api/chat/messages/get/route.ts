import { eq } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { MessagesTable } from '@/lib/db/schema';

import type { IAPIChatMessagesGetOutput, IAPIChatMessagesGetParams } from './types';

export async function POST(req: Request) {
  const params: Partial<IAPIChatMessagesGetParams> = await req.json();

  if (!params || !params.roomId) {
    return new Response(
      JSON.stringify({
        message: 'Invalid payload, or missing parameters',
      }),
      { status: 400 }
    );
  }
  try {
    const db = await PgInstance.getInstance();
    const messages = await db
      .select()
      .from(MessagesTable)
      .where(eq(MessagesTable.roomId, params.roomId));
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'An unexpected error occurred',
          },
          result: messages,
        }),
        { status: 500 }
      );
    }
    const output: IAPIChatMessagesGetOutput = { messages };
    return new Response(JSON.stringify(output), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
