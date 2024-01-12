import { InferSelectModel } from 'drizzle-orm';
import React, { MutableRefObject } from 'react';

import type { TChatMessage } from '@/app/api/chat/invoke/types';
import type { TAPIChatRoomGetDetailsResult } from '@/app/api/chat/room/get/details/types';
import { MessagesTable } from '@/lib/db/schema';
import { UseMutateFunction } from '@tanstack/react-query';
import { TAPIChatRoomUpdateParams } from '@/app/api/chat/room/update/types';

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
  systemMessageIndex: number;
};

export interface IChatRoomContext {
  // Room State
  details?: TAPIChatRoomGetDetailsResult;
  updateRoom?: UseMutateFunction<Response, Error, TAPIChatRoomUpdateParams>;
  documents?: TDocument[];
  setDocuments?: React.Dispatch<React.SetStateAction<TDocument[]>>;
  messages?: TMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<TMessage[]>>;
  knowledgeBase?: Record<string, boolean>;
  setKnowledgeBase?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  // Dynamic Streaming
  streamed: string;
  setStreamed?: React.Dispatch<React.SetStateAction<string>>;
  invokeController?: MutableRefObject<AbortController>;
  invokeParams?: TChatInvokeParams;
  setInvokeParams?: React.Dispatch<React.SetStateAction<TChatInvokeParams | undefined>>;
}

export const chatRoomContext = React.createContext<IChatRoomContext>({
  streamed: '',
});
