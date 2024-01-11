import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import PgInstance from '@/lib/db/dbInstance';
import { RoomTable } from '@/lib/db/schema';
import { formatLoggerMessage, getLogger } from '@/lib/log';

import type { IAPIChatRoomGetDetailsParams, TAPIChatRoomGetDetailsResult } from './types';

const PATH = 'api/chat/room/get/details';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);
  const params: IAPIChatRoomGetDetailsParams = await req.json();
  if (!params || !params.roomId) {
    const errorMessage = 'Invalid parameters';
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
      formatLoggerMessage(PATH, errorMessage, 'validateParams')
    );

    return new NextResponse(errorMessage, { status: errorCode });
  }
  try {
    const db = await PgInstance.getInstance();

    const result = await db
      .select()
      .from(RoomTable)
      .where(eq(RoomTable.id, sql`${params.roomId}::uuid`));

    if (!result || !Array.isArray(result) || !result.length) {
      const errorMessage = 'Error retrieving result';
      const errorCode = 500;
      logger.error(
        {
          req,
          params,
          error: {
            code: errorCode,
            message: errorMessage,
            result,
          },
        },
        formatLoggerMessage(PATH, errorMessage, 'postResult')
      );

      return new NextResponse(errorMessage, { status: errorCode });
    }
    const out: TAPIChatRoomGetDetailsResult = result[0];
    return new NextResponse(JSON.stringify(out), { status: 200 });
  } catch (error) {
    const err = error as Error;
    logger.error(
      {
        req,
        error: {
          code: 500,
          message: err.message,
        },
      },
      formatLoggerMessage(PATH, 'An error occurred in fulfilling the request.', 'tryCatch')
    );
  }
}
