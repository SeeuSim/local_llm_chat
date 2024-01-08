import type { IAPIChatInvokeParams } from './types';
import {
  BaseDocumentHandler,
  BaseQuestionHandler,
  ChatDocumentHandler,
  ChatHistoryHandler,
} from './handlers';

export async function POST(req: Request) {
  const params: IAPIChatInvokeParams = await req.json();
  if (params.message && !params.documents && !params.history) {
    const stream = await BaseQuestionHandler(params.message);
    return new Response(stream);
  } else if (params.message && !params.documents && params.history) {
    const stream = await ChatHistoryHandler(params.message, params.history);
    return new Response(stream);
  } else if (params.message && params.documents && params.roomId && !params.history) {
    const stream = await BaseDocumentHandler(params.message, params.roomId);
    return new Response(stream);
  } else if (params.message && params.documents && params.roomId && params.history) {
    const stream = await ChatDocumentHandler(params.message, params.history, params.roomId);
    return new Response(stream);
  }
}
