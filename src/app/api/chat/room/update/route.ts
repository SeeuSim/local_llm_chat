import { eq, sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';
import { formatLoggerMessage, getLogger } from '@/lib/log';
import { TAPIChatRoomUpdateParams } from './types';

const PATH = 'api/chat/room/update';

export async function POST(req: Request) {
  const logger = getLogger(req);
  const params: Partial<TAPIChatRoomUpdateParams> = await req.json();

  if (
    (!params.id && !params.summary) ||
    params.truncateIndexes === undefined ||
    params.truncateIndexes === null ||
    !Array.isArray(params.truncateIndexes)
  ) {
    const errorMessage = 'Invalid Parameters';
    const errorCode = 400;

    logger.error(
      {
        req,
        params,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      },
      formatLoggerMessage(PATH, 'Invalid parameters', 'validateParams')
    );

    return new Response(errorMessage, { status: errorCode });
  }
  try {
    const db = await PgInstance.getInstance();

    const result = await db
      .update(RoomTable)
      .set({
        ...(params.id && params.summary
          ? { id: params.id, summary: params.summary }
          : { truncateIndexes: params.truncateIndexes }),
      })
      .where(eq(RoomTable.id, sql`${params.id}::uuid`))
      .returning();

    if (result.length > 0 && result[0].summary) {
      return new Response('OK', { status: 200 });
    }
    logger.error(
      {
        req,
        params,
        result: {
          res: result,
        },
      },
      formatLoggerMessage(PATH, 'An error occurred', 'postUpdate')
    );
    return new Response(JSON.stringify(result), { status: 500 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const code = 500;
    logger.error(
      { req, params, error: { code, message: errorMessage } },
      formatLoggerMessage(PATH, errorMessage, 'tryCatch')
    );
    return new Response(errorMessage, { status: code });
  }
}
