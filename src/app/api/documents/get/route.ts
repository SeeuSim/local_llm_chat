import { sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { EmbeddingsTable } from '@/lib/db/schema';
import { formatLoggerMessage, getLogger } from '@/lib/log';
import type { TChunkMetadata } from '@/lib/models/embeddings/utils';
import type { IAPIDocumentsGetParams, IAPIDocumentsGetResults } from './types';

const PATH = 'api/documents/get';

export async function POST(req: Request) {
  const logger = getLogger(req);
  const params: IAPIDocumentsGetParams = await req.json();

  if (!params || !params.roomId) {
    return new Response(JSON.stringify({}), { status: 400 });
  }

  const column = EmbeddingsTable.metadata;

  const filterParams: Pick<TChunkMetadata, 'roomKeys' | 'splitNumber'> = {
    roomKeys: {
      [params.roomId as string]: true,
    },
    splitNumber: 1,
  };

  try {
    const db = await PgInstance.getInstance();
    const documentsResponse = await db
      .select({ metadata: column })
      .from(EmbeddingsTable)
      // TODO: Create a GIN index on the JSONB column to provide
      // better raw `WHERE ->>` performance instead of `jsonb @>` scan
      .where(sql`metadata @> ${filterParams}::jsonb`);

    if (!documentsResponse || !Array.isArray(documentsResponse)) {
      logger.error(
        { req, params, result: { documentsResponse } },
        formatLoggerMessage(PATH, 'Malformed response', 'postQuery')
      );
      return new Response(
        JSON.stringify({
          error: {
            message: 'An unexpected error occurred',
          },
          result: documentsResponse,
        }),
        { status: 500 }
      );
    }

    const uniqueTitles: string[] = documentsResponse
      .map((document) => document.metadata?.title)
      .filter((v) => v) as string[];

    const output: IAPIDocumentsGetResults = { documents: uniqueTitles };
    return new Response(JSON.stringify(output), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
