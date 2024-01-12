import { sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { formatLoggerMessage, getLogger } from '@/lib/log';

import { IAPIDocumentsDeleteParams } from './types';

const PATH = 'api/documents/delete';

export async function POST(req: Request) {
  const logger = getLogger(req);

  const params: IAPIDocumentsDeleteParams = await req.json();

  try {
    const db = await PgInstance.getInstance();
    const result = await db.execute(sql`
    DELETE FROM embeddings
    WHERE metadata @> ${{ title: params.documentTitle }}::jsonb
    `);
    if (!result || !result.rowCount) {
      logger.error(
        {
          req,
          params,
          error: { code: 500, message: `Expected delete, but this result was received: ${result}` },
        },
        formatLoggerMessage(PATH, 'An error occurred.')
      );
      return new Response('An error occurred', { status: 500 });
    }
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
