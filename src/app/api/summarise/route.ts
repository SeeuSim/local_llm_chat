import ChatOllamaSingleton from '@/lib/models/chat/chatOllama';
import { getStreamingUtils } from '@/lib/streaming';
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

  if (!body.userMessage && !body.systemMessage) {
    return new Response(JSON.stringify({}), { status: 401 });
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

  const { stream, callbacks } = getStreamingUtils();
  const model = await ChatOllamaSingleton.getInstance();
  model.callbacks = callbacks;
  model.invoke(SummarisationTemplate);

  return new Response(stream);
}
