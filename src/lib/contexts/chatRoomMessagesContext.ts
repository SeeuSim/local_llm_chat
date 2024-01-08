import { InferSelectModel } from 'drizzle-orm';
import React from 'react';
import { MessagesTable } from '../db/schema';

export type TMessage = Pick<InferSelectModel<typeof MessagesTable>, 'id' | 'content' | 'persona'>;

export interface IChatRoomMessagesContext {
  messages?: TMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<TMessage[]>>;
  appendMessage?: (newMessage: TMessage) => void;
}

export const chatRoomMessagesContext = React.createContext<IChatRoomMessagesContext>({});
