import { eq, sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';
import { formatLoggerMessage, getLogger } from '@/lib/log';

import type { IAPIChatRoomDeleteParams } from './types';

const PATH = 'api/chat/room/delete';

export async function POST(req: Request) {
  const logger = getLogger(req);

  const params: IAPIChatRoomDeleteParams = await req.json();

  try {
    const db = await PgInstance.getInstance();
    await db.transaction(async (tx) => {
      await tx.delete(RoomTable).where(eq(RoomTable.id, sql`${params.roomId}::uuid`));
      await tx.execute(sql`
      UPDATE embeddings
      SET metadata = jsonb_set(
        metadata, 
        '{roomKeys}', 
        COALESCE(metadata->'roomKeys', '{}'::jsonb) - '${sql.raw(params.roomId)}'
      )
      WHERE metadata @> ${{ roomKeys: { [params.roomId]: true } }}::jsonb;`);
    });
    return new Response('OK', { status: 200 });
  } catch (error) {
    const e = error as Error;
    logger.error(
      { req, params, error: { code: 500, message: e.message } },
      formatLoggerMessage(PATH, 'An error occurred.')
    );
    return new Response('BAD', { status: 500 });
  }
}
