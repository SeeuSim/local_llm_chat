import PgInstance from '@/lib/db/dbInstance';
import { IAPIChatMessagesCreateParams } from './types';
import { MessagesTable } from '@/lib/db/schema';

export async function POST(req: Request) {
  const params: IAPIChatMessagesCreateParams = await req.json();
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
    const messages = await db.insert(MessagesTable).values(params.messages).returning();
    return new Response(
      JSON.stringify({ message: 'Insert successful', ids: messages.map((message) => message.id) }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
