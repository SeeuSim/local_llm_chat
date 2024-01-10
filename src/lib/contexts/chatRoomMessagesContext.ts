import { InferSelectModel } from 'drizzle-orm';
import React, { MutableRefObject } from 'react';

import type { TChatMessage } from '@/app/api/chat/invoke/types';
import { MessagesTable } from '@/lib/db/schema';

export type TMessage = Pick<
  InferSelectModel<typeof MessagesTable>,
  'id' | 'content' | 'persona' | 'isAborted' | 'timeStamp'
>;

export type TChatInvokeParams = {
  message: string;
  hasDocuments: boolean;
  previousMessages: TChatMessage[];
  systemMessageId: string;
};

export interface IChatRoomMessagesContext {
  messages?: TMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<TMessage[]>>;
  appendMessage?: (newMessage: TMessage) => void;
  streamed: string;
  setStreamed?: React.Dispatch<React.SetStateAction<string>>;
  invokeController?: MutableRefObject<AbortController>;
  invokeParams?: TChatInvokeParams;
  setInvokeParams?: React.Dispatch<React.SetStateAction<TChatInvokeParams | undefined>>;
}

export const chatRoomMessagesContext = React.createContext<IChatRoomMessagesContext>({
  streamed: '',
});
