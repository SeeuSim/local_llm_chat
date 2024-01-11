import { asc, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import PgInstance from '@/lib/db/dbInstance';
import { MessagesTable } from '@/lib/db/schema';
import { formatLoggerMessage, getLogger } from '@/lib/log';

import type { IAPIChatMessagesGetOutput, IAPIChatMessagesGetParams } from './types';

const PATH = 'api/chat/messages/get';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);
  const params: Partial<IAPIChatMessagesGetParams> = await req.json();

  if (!params || !params.roomId) {
    logger.error({ req, params }, formatLoggerMessage(PATH, 'Invalid parameters'));
    return new NextResponse(
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
      .where(eq(MessagesTable.roomId, sql`${params.roomId}::uuid`))
      .orderBy(asc(MessagesTable.timeStamp));
    if (!messages || !Array.isArray(messages)) {
      logger.error({ req, params }, formatLoggerMessage(PATH, 'Malformed response', 'postQuery'));
      return new NextResponse(
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
    return new NextResponse(JSON.stringify(output), { status: 200 });
  } catch (error) {
    logger.error(
      { req, params, error: { code: 500, message: (error as any).message } },
      formatLoggerMessage(PATH, 'Internal Server Error', 'tryCatch')
    );
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
