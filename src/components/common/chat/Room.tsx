'use client';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

import type {
  IAPIChatMessagesGetOutput,
  IAPIChatMessagesGetParams,
} from '@/app/api/chat/messages/get/types';
import { useToast } from '@/components/ui/use-toast';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';

import { ChatMessage } from './ChatMessage';
import { chatRoomMessagesContext } from '@/lib/contexts/chatRoomMessagesContext';

const Room = () => {
  const { roomId } = useContext(roomIDContext);
  const { messages, setMessages } = useContext(chatRoomMessagesContext);
  const { toast } = useToast();

  const {
    data: initialMessages,
    isFetching,
    error,
  } = useQuery<IAPIChatMessagesGetOutput, Error>({
    queryKey: ['chat', 'messages', 'get', roomId],
    queryFn: async ({ signal }) => {
      const payload: IAPIChatMessagesGetParams = {
        roomId,
      };
      return fetch('/api/chat/messages/get', {
        signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    },
    enabled: roomId !== undefined && roomId.length > 0,
  });

  useEffect(() => {
    if (setMessages !== undefined && initialMessages && initialMessages.messages !== undefined) {
      setMessages((prevMessages) => [...initialMessages.messages, ...prevMessages]);
    }
  }, [setMessages, initialMessages]);

  useEffect(() => {
    if (error !== null) {
      toast({
        variant: 'destructive',
        duration: 2000,
        title:
          'Oh no! An error occurred while fetching the messages for this room. ' +
          'Please refresh the page, or try again later.',
        description: error.message,
      });
    }
  }, [error]);

  return messages !== undefined && messages.length > 0 ? (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          role={message.persona ? (message.persona as 'system' | 'user') : 'user'}
          content={message.content ?? ''}
        />
      ))}
    </>
  ) : messages !== undefined && messages.length === 0 ? (
    <>
      <span>No messages here. Send some!</span>
    </>
  ) : (
    messages === undefined &&
    isFetching && (
      <>
        <span>Loading...</span>
      </>
    )
  );
};

export default Room;
