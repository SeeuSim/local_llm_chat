import { StringOutputParser } from '@langchain/core/output_parsers';

import OllamaSingleton from '@/lib/models/chat/chatOllama';
import { iteratorToStream } from '@/lib/utils';
import {
  PROMPT_REGEXES,
  PROMPT_SUMMARISATION_TEMPLATES,
  SUPPORTED_MODELS,
  type IAPISummariseInput,
  type TSupportedModel,
} from './utils';

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<IAPISummariseInput>;

  let modelName: TSupportedModel = 'mistral';
  if (body.model && SUPPORTED_MODELS.includes(body.model as TSupportedModel)) {
    modelName = body.model as TSupportedModel;
  }

  const conversation: Array<string> = [];
  if (body.userMessage) {
    conversation.push(`User: ${body.userMessage.replaceAll(PROMPT_REGEXES[modelName], '')}\r\n`);
  }
  if (body.systemMessage) {
    conversation.push(
      `Assistant: ${body.systemMessage.replaceAll(PROMPT_REGEXES[modelName], '')}\r\n`
    );
  }

  const SummarisationTemplate = PROMPT_SUMMARISATION_TEMPLATES[modelName](conversation);

  const model = await OllamaSingleton.getInstance();

  const stream = model.pipe(new StringOutputParser()).stream(SummarisationTemplate);

  return new Response(await iteratorToStream(stream));
}
