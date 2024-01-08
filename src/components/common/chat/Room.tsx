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

const Room = () => {
  const { roomId } = useContext(roomIDContext);
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

  return initialMessages !== undefined &&
    initialMessages.messages &&
    initialMessages.messages.length !== 0 ? (
    <>
      {initialMessages.messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          role={message.persona !== null ? (message.persona as 'system' | 'user') : 'user'}
          content={message.content ?? ''}
        />
      ))}
    </>
  ) : initialMessages !== undefined ? (
    <>
      <span>No messages here. Send one!</span>
    </>
  ) : (
    initialMessages === undefined &&
    isFetching && (
      <>
        <span>Loading...</span>
      </>
    )
  );
};

export default Room;
