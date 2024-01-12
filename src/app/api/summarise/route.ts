import { StringOutputParser } from 'langchain/schema/output_parser';

import { formatLoggerMessage, getLogger } from '@/lib/log';
import ChatOllamaSingleton from '@/lib/models/chat/chatOllama';
import {
  PROMPT_REGEXES,
  PROMPT_SUMMARISATION_TEMPLATES,
  SUPPORTED_MODELS,
  type IAPISummariseInput,
  type TSupportedModel,
} from './utils';

const PATH = 'api/summarise';

export async function POST(req: Request) {
  const logger = getLogger(req);
  const body = (await req.json()) as Partial<IAPISummariseInput>;

  let modelName: TSupportedModel = 'mistral';
  if (body.model && SUPPORTED_MODELS.includes(body.model as TSupportedModel)) {
    modelName = body.model as TSupportedModel;
  }

  if (!body.userMessage && !body.systemMessage) {
    return new Response(JSON.stringify({}), { status: 401 });
  }

  const conversation: Array<string> = [];
  if (body.userMessage) {
    conversation.push(`User: ${body.userMessage.replaceAll(PROMPT_REGEXES[modelName], '')}\r\n`);
  }
  if (body.systemMessage) {
    conversation.push(
      `System: ${body.systemMessage.replaceAll(PROMPT_REGEXES[modelName], '')}\r\n`
    );
  }

  const SummarisationTemplate = PROMPT_SUMMARISATION_TEMPLATES[modelName](conversation);

  logger.info({ req, params: body }, formatLoggerMessage(PATH, 'Invoking summarisation'));

  const model = await ChatOllamaSingleton.getInstance();
  model.ParsedCallOptions = {
    ...(model.ParsedCallOptions ?? {}),
    signal: req.signal,
  };
  const stream = await model.pipe(new StringOutputParser()).stream(SummarisationTemplate);

  return new Response(stream);
}
