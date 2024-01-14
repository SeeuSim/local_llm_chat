import { RunnableSequence } from 'langchain/schema/runnable';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { PromptTemplate } from 'langchain/prompts';
import type { Document } from 'langchain/document';

import ChatOllamaSingleton from '@/lib/models/chat/chatOllama';
import VectorStore from '@/lib/models/vectorStore';
import {
  baseTemplate,
  baseChatHistoryTemplate,
  chatHistoryReflectTemplate,
  baseDocumentQATemplate,
  chatDocumentQATemplate,
} from './templates';
import type { TChatMessage } from './types';

const formatDocsAsString = (docs: Document[]) => {
  return docs
    .map((document, index) => `<doc id='${index}'>${document.pageContent}</doc>`)
    .join('\r\n');
};

export const BaseQuestionHandler = async (question: string, signal: AbortSignal) => {
  const prompt = PromptTemplate.fromTemplate(baseTemplate);

  const ollama = await ChatOllamaSingleton.getInstance();
  if (signal) {
    ollama.ParsedCallOptions = { ...(ollama.ParsedCallOptions ?? {}), signal };
  }

  const chain = prompt.pipe(ollama).pipe(new StringOutputParser());
  return chain.stream({ question });
};

const formatChatHistory: (messages: Array<TChatMessage>) => string = (messages) => {
  if (messages.length === 0) {
    return '';
  }
  if (messages.length === 1) {
    const message = messages[0];
    if (message.persona === 'user') {
      return `
        <S>
          [INST]
          ${message.content}
          [/INST]
        </s>`.trim();
    }
    return `
    <s>
      ${message.content}
    </s>`.trim();
  }
  const [firstMessage, secondMessage, ...otherMessages] = messages;

  if (firstMessage.persona === 'user' && secondMessage.persona === 'system') {
    // Regular pair
    return (
      `<s>
      [INST]
      ${firstMessage.content}
      [/INST]
      ${secondMessage.content}
      </s>`.trim() +
      '\r\n' +
      formatChatHistory(otherMessages)
    );
  }
  return (
    formatChatHistory([firstMessage]) +
    '\r\n' +
    formatChatHistory([secondMessage, ...otherMessages])
  );
};

export const ChatHistoryHandler = async (
  question: string,
  chatHistory: Array<TChatMessage>,
  signal: AbortSignal
) => {
  if (chatHistory.length === 0) {
    return BaseQuestionHandler(question, signal);
  }

  const prompt = PromptTemplate.fromTemplate(baseChatHistoryTemplate);

  const model = await ChatOllamaSingleton.getInstance();
  if (signal) {
    model.ParsedCallOptions = { ...(model.ParsedCallOptions ?? {}), signal };
  }

  const chain = RunnableSequence.from([
    {
      question: (input) => input.question,
      history: RunnableSequence.from([(input) => input.chat_history, formatChatHistory]),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return chain.stream({ question, chat_history: chatHistory });
};

export const BaseDocumentHandler = async (
  question: string,
  roomId: string,
  signal: AbortSignal
) => {
  const vectorstore = await VectorStore.getInstance();
  const retriever = vectorstore.asRetriever({ filter: { roomKeys: { [roomId]: true } } });
  const retrievalChain = RunnableSequence.from([
    (input) => input.question,
    retriever,
    formatDocsAsString,
  ]);

  const model = await ChatOllamaSingleton.getInstance();
  if (signal) {
    model.ParsedCallOptions = { ...(model.ParsedCallOptions ?? {}), signal };
  }

  const fullChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      context: RunnableSequence.from([(input) => ({ question: input.question }), retrievalChain]),
    },
    RunnableSequence.from([
      PromptTemplate.fromTemplate(baseDocumentQATemplate),
      model,
      new StringOutputParser(),
    ]),
  ]);

  return fullChain.stream({ question });
};

export const ChatDocumentHandler = async (
  question: string,
  chatHistory: Array<TChatMessage>,
  roomId: string,
  signal: AbortSignal
) => {
  const vectorstore = await VectorStore.getInstance();
  const retriever = vectorstore.asRetriever({ filter: { roomKeys: { [roomId]: true } } });

  const model = await ChatOllamaSingleton.getInstance();
  if (signal) {
    model.ParsedCallOptions = { ...(model.ParsedCallOptions ?? {}), signal };
  }

  const retrievalChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(chatHistoryReflectTemplate),
    model,
    new StringOutputParser(),
    retriever,
    formatDocsAsString,
  ]);

  const fullChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      history: RunnableSequence.from([(input) => input.chat_history, formatChatHistory]),
      context: RunnableSequence.from([
        (input) => {
          return {
            question: input.question,
            chat_history: input.chat_history
              .map(
                (message: TChatMessage) => `${message.persona?.toUpperCase()}: ${message.content}`
              )
              .join('\n'),
          };
        },
        retrievalChain,
      ]),
    },
    RunnableSequence.from([
      PromptTemplate.fromTemplate(chatDocumentQATemplate),
      model,
      new StringOutputParser(),
    ]),
  ]);

  return fullChain.stream({ question, chat_history: chatHistory });
};
