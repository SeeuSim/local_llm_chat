import PgInstance from '@/lib/db/dbInstance';
import { EmbeddingsTable } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { TAPIDocumentsGetParams } from './types';
import { formatLoggerMessage, getLogger } from '@/lib/log';

const PATH = 'api/documents/get';

export async function GET(req: Request) {
  const logger = getLogger(req);
  const params: TAPIDocumentsGetParams = await req.json();

  if (!params || !params.roomId) {
    return new Response(JSON.stringify({}), { status: 400 });
  }

  try {
    const db = await PgInstance.getInstance();
    const documentsResponse = await db
      .select({ metadata: EmbeddingsTable.metadata })
      .from(EmbeddingsTable)
      .where(sql`${EmbeddingsTable.metadata.name}::jsonb @> ${{ roomId: params.roomId }}`);

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
    const uniqueTitles: string[] = Array.from(
      new Set(
        documentsResponse.map((document) => document.metadata?.title).filter((v) => v) as string[]
      )
    );

    const output = { documents: uniqueTitles };
    return new Response(JSON.stringify(output), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
