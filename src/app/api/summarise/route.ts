import OllamaSingleton from '@/lib/models/chat/chatOllama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { IterableReadableStream } from '@langchain/core/utils/stream';

function iteratorToStream<T>(iterator: IterableReadableStream<T>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function POST(req: Request) {
  const user = 'Hi! What can you do?';
  const system = `Hello! As a text-based artificial intelligence, I don't have the ability to
  physically perform tasks or interact with the world around me like a human or an animal does.
  However, I can process and generate text based on the information and instructions provided
  to me. I can answer questions, generate creative stories or poems, help brainstorm ideas,
  provide explanations or definitions, translate text between languages, and much more! Let me
  know how I can assist you today.`;

  const template = `
  <s>
  [INST]
  You are an expert conversation summariser. Generate an accurate, short, < 8 word sumamry
  about what assistance the 'User' persona is seeking from the 'Assistant'.
  
  CONVERSATION:
  User: ${user.replaceAll(/\[(\/)?INST\]/g, '')}
  Assistant: ${system.replaceAll(/\[(\/)?INST\]/g, '')}
  END CONVERSATION

  You may format the response in this format:
  {action} {on/about/for (or other quantifiers)} {action} {quantifier} { subject}
  i.e. Getting help for coding task in Bash

  Return only ONE summary, making sure it is 8 words or less, and nothing else.
  Exclude all references to any assistant, AI or system. Do not elaborate.
  Returning anything else or anything longer than 8 words will make you less 
  useful as a conversation summariser.
  [/INST]
  </s>
  `;

  const model = await OllamaSingleton.getInstance();

  const stream = await model.pipe(new StringOutputParser()).stream(template);

  return new Response(iteratorToStream(stream));
}
