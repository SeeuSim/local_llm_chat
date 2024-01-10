import PgInstance from '@/lib/db/dbInstance';
import { IAPIChatMessagesUpdateParams } from './types';
import { MessagesTable } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  const params: IAPIChatMessagesUpdateParams = await req.json();
  if (!params || !params.messages || !Array.isArray(params.messages)) {
    return new Response(
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
    return new Response('Update Successful', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
