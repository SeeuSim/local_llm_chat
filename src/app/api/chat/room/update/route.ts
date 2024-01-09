import { formatLoggerMessage, getLogger } from '@/lib/log';
import PgInstance from '@/lib/db/dbInstance';
import { IAPIChatRoomUpdateParams } from './types';
import { RoomTable } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

const PATH = 'api/chat/room/update';

export async function POST(req: Request) {
  const logger = getLogger(req);
  const params: Partial<IAPIChatRoomUpdateParams> = await req.json();

  if (!params.roomId || !params.summary) {
    return new Response();
  }
  try {
    const db = await PgInstance.getInstance();

    const result = await db
      .update(RoomTable)
      .set({ summary: params.summary, modifiedTime: new Date() })
      .where(eq(RoomTable.id, sql`${params.roomId}::uuid`))
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
