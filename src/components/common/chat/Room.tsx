'use client';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';

import type {
  IAPIChatMessagesGetOutput,
  IAPIChatMessagesGetParams,
} from '@/app/api/chat/messages/get/types';
import type { IAPIDocumentsGetResults } from '@/app/api/documents/get/types';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

import { chatRoomContext } from '@/lib/contexts/chatRoomContext';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { cn } from '@/lib/utils';

import { ChatMessage } from './ChatMessage';
import { IAPIDocumentsDeleteParams } from '@/app/api/documents/delete/types';

const Room = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { roomId } = useContext(searchParamsRoomIdContext);
  const streamedRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const {
    knowledgeBase,
    setKnowledgeBase,
    documents,
    setDocuments,
    messages,
    setMessages,
    streamed,
    invokeParams,
    setInvokeParams,
    details: roomDetails,
  } = useContext(chatRoomContext);
  const { toast } = useToast();

  const handleReInvoke = (messageIndex: number, systemMessageId: string) => {
    if (!messages || messages.length === 0) {
      return;
    }
    let index = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
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
        systemMessageIndex: messageIndex,
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
    enabled: roomId.length > 0,
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
    enabled: roomId.length > 0,
  });

  const { data: _knowledgeBaseDocuments } = useQuery<IAPIDocumentsGetResults>({
    queryKey: ['app', 'documents'],
    queryFn: async ({ signal }) => {
      return await fetch(`/api/documents/get`, {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((res: IAPIDocumentsGetResults) => {
          setKnowledgeBase &&
            setKnowledgeBase(
              Object.fromEntries(res.documents.map((document) => [document, false]))
            );

          return res;
        });
    },
    enabled: roomId === '',
  });

  const { mutate: deleteDocument, isPending: isDeletePending } = useMutation({
    mutationKey: ['documents', 'delete'],
    mutationFn: async (params: { title: string }) => {
      const payload: IAPIDocumentsDeleteParams = {
        documentTitle: params.title,
      };
      return await fetch('/api/documents/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (response, _vars, _context) => {
      if (response.ok) {
        queryClient.refetchQueries({ queryKey: ['app', 'documents'] });
      }
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
    streamedRef?.current?.scrollIntoView();
  }, [streamedRef, streamed]);

  useEffect(() => {
    lastRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lastRef, messages]);

  return messages !== undefined && messages.length > 0 ? (
    <>
      {messages
        .slice(
          0,
          invokeParams?.systemMessageIndex !== undefined
            ? invokeParams.systemMessageIndex
            : messages.length
        )
        .map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.persona ? (message.persona as 'system' | 'user') : 'user'}
            content={message.content ?? 'EMPTY'}
            isLast={streamed.length === 0 && index === messages.length - 1}
            isAborted={message.isAborted ?? false}
            reInvoke={(index: number) => handleReInvoke(index, message.id as string)}
            index={index}
            isTruncated={roomDetails?.truncateIndexes?.includes(index + 1)}
          />
        ))}
      {streamed.length > 0 && (
        <>
          <ChatMessage
            role='system'
            content={streamed}
            isStreaming
            isLast
            index={-1}
            ref={
              invokeParams &&
              invokeParams.systemMessageIndex &&
              invokeParams?.systemMessageIndex !== messages.length - 1
                ? streamedRef
                : null
            }
          />
          <div
            className='h-0 w-full'
            ref={
              invokeParams?.systemMessageIndex === messages.length - 1 || !invokeParams
                ? streamedRef
                : null
            }
          />
        </>
      )}
      {streamed.length > 0 &&
        invokeParams?.systemMessageIndex !== undefined &&
        messages.slice(invokeParams.systemMessageIndex + 1).map((message, index) => {
          const actualIndex = index + invokeParams.systemMessageIndex + 1;
          return (
            <ChatMessage
              key={message.id}
              role={message.persona ? (message.persona as 'system' | 'user') : 'user'}
              content={message.content ?? 'EMPTY'}
              isLast={streamed.length === 0 && index === messages.length - 1}
              isAborted={message.isAborted ?? false}
              index={actualIndex}
              reInvoke={(index: number) => handleReInvoke(index, message.id as string)}
              isTruncated={roomDetails?.truncateIndexes?.includes(actualIndex + 1)}
            />
          );
        })}
      <div className='h-0 w-0' ref={lastRef} />
    </>
  ) : roomId.length === 0 ? (
    // Empty Room
    // TODO: Add hero
    <div className='flex min-w-[60vw] flex-col gap-2 p-4 xl:translate-x-[-5vw]'>
      <span className='text-4xl font-bold'>What can I do for you today?</span>
      <hr />
      <div className='mt-2 flex w-full flex-col gap-4 lg:flex-row'>
        <Card className='flex flex-1 flex-col gap-y-2 bg-secondary p-4 shadow-sm'>
          <CardTitle className='text-2xl'>Talk to an uploaded file</CardTitle>
          <CardDescription className='text-base'>
            Here are your uploaded files. Select any one, send a message and start talking.
          </CardDescription>
          <div className='flex flex-wrap gap-2'>
            {knowledgeBase &&
              Object.entries(knowledgeBase).map(([title, isSelected]) => (
                <TooltipProvider key={title}>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'group flex flex-row items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 hover:cursor-pointer hover:bg-border dark:border-none',
                          isSelected &&
                            'bg-secondary-foreground text-secondary hover:bg-secondary-foreground/80 hover:text-secondary',
                          isDeletePending && 'cursor-not-allowed'
                        )}
                        onClick={() => {
                          setKnowledgeBase &&
                            !isDeletePending &&
                            setKnowledgeBase((prev) => ({ ...prev, [title]: !prev[title] }));
                        }}
                      >
                        <span className='line-clamp-1 flex-1 text-sm xl:text-base'>{title}</span>
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                disabled={isDeletePending}
                                onClick={() => deleteDocument({ title })}
                                className='hidden h-min w-min bg-transparent p-0 shadow-none group-hover:flex hover:bg-transparent hover:text-red-600'
                              >
                                <TrashIcon className='h-5 w-5 text-red-500 hover:scale-110' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Remove this document from the knowledge base.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </Card>
        <Card className='flex flex-1 flex-col gap-y-2 bg-secondary p-4 shadow-sm'>
          <CardTitle className='text-2xl'>Send a Message</CardTitle>
          <CardDescription className='text-base'>
            I can be your personal assistant. Here's a few things I can do:
            <br />
            <br />
            - Generate Suggestions
            <br />- Analyse text from your <b className='text-primary'>PDF upload</b>
            <br />
            - Write boilerplate code, and much more.
            <br />
            <br />
            Send a message to find out!
          </CardDescription>
        </Card>
      </div>
    </div>
  ) : (
    !messages?.length &&
    (isFetching || isPending) && (
      <>
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </>
    )
  );
};

export default Room;
