'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useRef, useState } from 'react';

import type {
  IAPIChatRoomGetDetailsParams,
  TAPIChatRoomGetDetailsResult,
} from '@/app/api/chat/room/get/details/types';
import { ChatRoomMessagesProvider } from '@/components/common/chat/providers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import {
  type TChatInvokeParams,
  type TDocument,
  type TMessage,
} from '@/lib/contexts/chatRoomContext';
import { cn } from '@/lib/utils';

import { ChatInput } from './ChatInput';
import { NavBar } from './NavBar';
import { SideNav } from './SideNav';
import { TAPIChatRoomUpdateParams } from '@/app/api/chat/room/update/types';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { roomId } = useContext(searchParamsRoomIdContext);
  const invokeController = useRef(new AbortController());
  const [knowledgeBase, setKnowledgeBase] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<Array<TDocument>>([]);
  const [messages, setMessages] = useState<Array<TMessage>>([]);
  const [streamed, setStreamed] = useState('');
  const [invokeParams, setInvokeParams] = useState<TChatInvokeParams | undefined>(undefined);

  const { data: roomDetails } = useQuery<TAPIChatRoomGetDetailsResult>({
    queryKey: ['chat', 'room', 'get', 'details', roomId],
    queryFn: async ({ signal }) => {
      const payload: IAPIChatRoomGetDetailsParams = {
        roomId,
      };
      return await fetch('/api/chat/room/get/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    },
    enabled: roomId.length > 0,
  });

  const { mutate: updateRoom } = useMutation<Response, Error, TAPIChatRoomUpdateParams>({
    mutationKey: ['room', 'update', 'details', roomId],
    mutationFn: async (params: TAPIChatRoomUpdateParams) => {
      return await fetch('/api/chat/room/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['chat', 'room', 'get', 'details', roomId] });
    },
  });

  return (
    <ChatRoomMessagesProvider
      {...{
        // Room Meta
        documents,
        setDocuments,
        knowledgeBase,
        setKnowledgeBase,
        messages,
        setMessages,
        details: roomDetails,
        updateRoom,
        // Streaming
        streamed,
        setStreamed,
        invokeController,
        invokeParams,
        setInvokeParams,
      }}
    >
      <div className={cn('relative flex min-h-screen flex-col bg-background text-primary')}>
        <NavBar />
        <SideNav />
        <main className='flex-1'>
          <ScrollArea
            // id='main-container'
            className={cn(
              'translate-y-[-62px] overflow-y-auto overscroll-none bg-background scrollbar-thin scrollbar-track-inherit scrollbar-thumb-border sm:ml-40 md:ml-48',
              `h-[calc(100vh-180px)]`
            )}
          >
            <div
              // id='main-container-top-padding'
              className='h-[62px] w-full bg-primary-foreground'
            />
            <div
              // id='main-container-messages'
              className='p-4'
            >
              <div className='mr-4 flex max-w-screen-md flex-col gap-4 lg:mx-auto'>{children}</div>
            </div>
          </ScrollArea>
          <ChatInput />
        </main>
      </div>
    </ChatRoomMessagesProvider>
  );
};

export default ChatLayout;
