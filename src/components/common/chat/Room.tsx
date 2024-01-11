'use client';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useRef } from 'react';

import type {
  IAPIChatMessagesGetOutput,
  IAPIChatMessagesGetParams,
} from '@/app/api/chat/messages/get/types';
import type { IAPIDocumentsGetResults } from '@/app/api/documents/get/types';

import { useToast } from '@/components/ui/use-toast';

import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { chatRoomContext } from '@/lib/contexts/chatRoomContext';

import { ChatMessage } from './ChatMessage';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const Room = () => {
  const searchParams = useSearchParams();
  const { roomId } = useContext(searchParamsRoomIdContext);
  const ref = useRef<HTMLDivElement>(null);
  const {
    documents,
    setDocuments,
    messages,
    setMessages,
    streamed,
    setInvokeParams,
    details: roomDetails,
  } = useContext(chatRoomContext);
  const { toast } = useToast();

  const handleReInvoke = (systemMessageId: string) => {
    if (!messages || messages.length === 0) {
      return;
    }
    let index = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].persona === 'user') {
        index = i;
        break;
      }
    }
    if (index < 0) {
      return;
    }

    const lastUserMessage = messages[index];
    const truncatedIndex =
      roomDetails?.truncateIndexes &&
      Array.isArray(roomDetails.truncateIndexes) &&
      roomDetails.truncateIndexes.length > 0
        ? roomDetails.truncateIndexes[roomDetails.truncateIndexes.length - 1]
        : 0;

    const previousMessages = index > 0 ? messages.slice(truncatedIndex, index) : [];
    if (setInvokeParams) {
      setInvokeParams({
        message: lastUserMessage.content as string,
        previousMessages,
        hasDocuments: documents !== undefined && documents.length > 0,
        systemMessageId,
      });
    }
  };

  const {
    data: messagePayload,
    isFetching,
    isPending,
    error,
  } = useQuery<IAPIChatMessagesGetOutput, Error>({
    queryKey: ['chat', 'messages', 'get', roomId, searchParams.get('initial')],
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
    refetchInterval: (_query) => {
      if (
        searchParams.get('initial') &&
        messages &&
        Array.isArray(messages) &&
        messages.length < 2
      ) {
        return 1000;
      }
    },
  });

  const { data: roomDocuments } = useQuery<IAPIDocumentsGetResults>({
    queryKey: ['chat', 'documents', 'get', roomId],
    queryFn: async ({ signal }) => {
      const payload = { roomId };
      return await fetch('/api/documents/get', {
        signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    },
  });

  useEffect(() => {
    if (setDocuments && roomDocuments !== undefined && Array.isArray(roomDocuments.documents)) {
      setDocuments(roomDocuments.documents);
    }
  }, [setDocuments, roomDocuments]);

  useEffect(() => {
    if (setMessages !== undefined && messagePayload && messagePayload.messages !== undefined) {
      setMessages([...messagePayload.messages]);
    }
  }, [setMessages, messagePayload]);

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

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [messages, streamed]);

  return messages !== undefined && messages.length > 0 ? (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          role={message.persona ? (message.persona as 'system' | 'user') : 'user'}
          content={message.content ?? 'EMPTY'}
          isLast={streamed.length === 0 && index === messages.length - 1}
          isAborted={message.isAborted ?? false}
          reInvoke={() => handleReInvoke(message.id as string)}
          index={index}
        />
      ))}
      {streamed.length > 0 && (
        <ChatMessage role='system' content={streamed} isStreaming isLast index={-1} />
      )}
      <div className='h-0 w-full' ref={ref} />
    </>
  ) : roomId.length > 0 !== (isFetching || isPending) && messages?.length === 0 ? (
    // Empty Room
    // TODO: Add hero
    <span>No messages here. Send some!</span>
  ) : (
    !messages?.length &&
    (isFetching || isPending) && (
      <>
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </>
    )
  );
};

export default Room;
