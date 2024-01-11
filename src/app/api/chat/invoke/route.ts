import { NextResponse } from 'next/server';
import type { IterableReadableStream } from '@langchain/core/utils/stream';

import { formatLoggerMessage, getLogger } from '@/lib/log';

import type { IAPIChatInvokeParams } from './types';
import {
  BaseDocumentHandler,
  BaseQuestionHandler,
  ChatDocumentHandler,
  ChatHistoryHandler,
} from './handlers';

const PATH = 'api/chat/invoke';

export async function POST(req: NextRe.quest) {
  const logger = getLogger(req);
  const params: IAPIChatInvokeParams = await req.json();

  if (!params.message || !params.roomId) {
    const errorMessage = 'Invalid parameters';
    logger.error({ req, params }, formatLoggerMessage(PATH, errorMessage, 'validateParams'));
    return new NextResponse(errorMessage, { status: 400 });
  }
  try {
    let stream: IterableReadableStream<string> | null = null;
    if (params.message && !params.hasDocuments && !params.history) {
      // Start Chat, no documents
      stream = await BaseQuestionHandler(params.message, req.signal);
    } else if (params.message && !params.hasDocuments && params.history) {
      // Chat History, no documents
      stream = await ChatHistoryHandler(params.message, params.history, req.signal);
    } else if (params.message && params.hasDocuments && !params.history) {
      // Start Chat, with documents
      stream = await BaseDocumentHandler(params.message, params.roomId, req.signal);
    } else if (params.message && params.hasDocuments && params.history) {
      // Chat History, with documents
      stream = await ChatDocumentHandler(params.message, params.history, params.roomId, req.signal);
    }
    if (stream !== null) {
      logger.info(
        { req, params },
        formatLoggerMessage(PATH, 'Streaming invoked', 'returnResponse')
      );
      return new NextResponse(stream);
    }
    const errorMessage = 'Invalid combination of parameters';
    logger.error({ req, params }, formatLoggerMessage(PATH, errorMessage));
    return new NextResponse(errorMessage, { status: 400 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const code = 500;
    logger.error(
      { req, params, error: { code, message: errorMessage } },
      formatLoggerMessage(PATH, errorMessage, 'tryCatch')
    );
    return new NextResponse(errorMessage, { status: code });
  }
}
