import PgInstance from '@/lib/db/dbInstance';

import type { IAPIDocumentsLinkParams } from './types';
import { sql } from 'drizzle-orm';

export async function POST(req: Request) {
  const params: IAPIDocumentsLinkParams = await req.json();

  if (
    !params.roomId ||
    params.isLinkUnlink === undefined ||
    !params.documentTitles ||
    !Array.isArray(params.documentTitles)
  ) {
    return new Response('Bad request', { status: 400 });
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
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('BAD', { status: 500 });
  }
}
