import { InferSelectModel } from 'drizzle-orm';
import React, { MutableRefObject } from 'react';

import type { TChatMessage } from '@/app/api/chat/invoke/types';
import { MessagesTable } from '@/lib/db/schema';

export type TDocument = string;

export type TMessage = Pick<
  InferSelectModel<typeof MessagesTable>,
  'id' | 'content' | 'persona' | 'isAborted' | 'timeStamp' | 'documentTitles'
>;

export type TChatInvokeParams = {
  message: string;
  hasDocuments: boolean;
  previousMessages: TChatMessage[];
  systemMessageId: string;
};

export interface IChatRoomMessagesContext {
  // Room State
  documents?: TDocument[];
  setDocuments?: React.Dispatch<React.SetStateAction<TDocument[]>>;
  messages?: TMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<TMessage[]>>;

  // Dynamic Streaming
  streamed: string;
  setStreamed?: React.Dispatch<React.SetStateAction<string>>;
  invokeController?: MutableRefObject<AbortController>;
  invokeParams?: TChatInvokeParams;
  setInvokeParams?: React.Dispatch<React.SetStateAction<TChatInvokeParams | undefined>>;
}

export const chatRoomMessagesContext = React.createContext<IChatRoomMessagesContext>({
  streamed: '',
});
