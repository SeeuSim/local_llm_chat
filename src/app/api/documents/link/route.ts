import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { formatLoggerMessage, getLogger } from '@/lib/log';

import type { IAPIDocumentsLinkParams } from './types';

const PATH = 'api/documents/link';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);
  const params: IAPIDocumentsLinkParams = await req.json();

  if (
    !params.roomId ||
    params.isLinkUnlink === undefined ||
    !params.documentTitles ||
    !Array.isArray(params.documentTitles)
  ) {
    logger.error({ req, params }, formatLoggerMessage(PATH, 'Invalid parameters'));
    return new NextResponse('Bad request', { status: 400 });
  }

  try {
    const db = await PgInstance.getInstance();

    if (params.isLinkUnlink) {
      await db.transaction(async (tx) => {
        await Promise.all(
          params.documentTitles.map((title) =>
            tx.execute(sql`
            UPDATE embeddings
            SET metadata = jsonb_set(
                metadata, 
                '{roomKeys}', 
                COALESCE(metadata->'roomKeys', '{}'::jsonb) || ${{ [params.roomId]: true }}::jsonb
            )
            WHERE metadata @> ${{ title }}::jsonb;
            `)
          )
        );
      });
    } else {
      await db.transaction(async (tx) => {
        await Promise.all(
          params.documentTitles.map((title) =>
            tx.execute(sql`
            UPDATE embeddings
            SET metadata = jsonb_set(
              metadata, 
              '{roomKeys}', 
              COALESCE(metadata->'roomKeys', '{}'::jsonb) - '${sql.raw(params.roomId)}'
            )
            WHERE metadata @> ${{ title }}::jsonb;`)
          )
        );
      });
    }
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    logger.error(
      { req, params, error: { code: 500, message: (error as Error).message } },
      formatLoggerMessage(PATH, 'An error occurred.')
    );
    return new NextResponse('BAD', { status: 500 });
  }
}
