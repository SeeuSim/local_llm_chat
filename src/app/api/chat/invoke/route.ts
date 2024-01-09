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

export async function POST(req: Request) {
  const logger = getLogger(req);
  const params: IAPIChatInvokeParams = await req.json();

  if (!params.message || !params.roomId) {
    const errorMessage = 'Invalid parameters';
    logger.error({ req, params }, formatLoggerMessage(PATH, errorMessage, 'validateParams'));
    return new Response(errorMessage, { status: 400 });
  }
  try {
    let stream: IterableReadableStream<string> | null = null;
    if (params.message && !params.hasDocuments && !params.history) {
      stream = await BaseQuestionHandler(params.message);
    } else if (params.message && !params.hasDocuments && params.history) {
      stream = await ChatHistoryHandler(params.message, params.history);
    } else if (params.message && params.hasDocuments && !params.history) {
      stream = await BaseDocumentHandler(params.message, params.roomId);
    } else if (params.message && params.hasDocuments && params.history) {
      stream = await ChatDocumentHandler(params.message, params.history, params.roomId);
    }
    if (stream !== null) {
      logger.info(
        { req, params },
        formatLoggerMessage(PATH, 'Streaming invoked', 'returnResponse')
      );
      const out = new Response(stream);
      return out;
    }
    const errorMessage = 'Invalid combination of parameters';
    logger.error({ req, params }, formatLoggerMessage(PATH, errorMessage));
    return new Response(errorMessage, { status: 400 });
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
