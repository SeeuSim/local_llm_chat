'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useEffect, useRef, useState } from 'react';

import { ChatRoomMessagesProvider } from '@/components/common/chat/providers';
import {
  type TChatInvokeParams,
  type TDocument,
  type TMessage,
} from '@/lib/contexts/chatRoomMessagesContext';

import { ChatInput } from './ChatInput';
import { NavBar } from './NavBar';
import { SideNav } from './SideNav';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  const invokeController = useRef(new AbortController());
  const [documents, setDocuments] = useState<Array<TDocument>>([]);
  const [messages, setMessages] = useState<Array<TMessage>>([]);
  const [streamed, setStreamed] = useState('');
  const [invokeParams, setInvokeParams] = useState<TChatInvokeParams | undefined>(undefined);

  const container = useRef<HTMLDivElement>(null);

  const Scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } = container.current as HTMLDivElement;
    if (scrollHeight <= scrollTop + offsetHeight + 200) {
      container.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    Scroll();
  }, [messages, streamed]);

  return (
    <ChatRoomMessagesProvider
      {...{
        documents,
        setDocuments,
        messages,
        setMessages,
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
            messageId='main-container'
            className={cn(
              'translate-y-[-62px] overflow-y-auto overscroll-none bg-background scrollbar-thin scrollbar-track-inherit scrollbar-thumb-border sm:ml-40 md:ml-48',
              `h-[calc(100vh-180px)]`
            )}
          >
            <div
              messageId='main-container-top-padding'
              className='h-[62px] w-full bg-primary-foreground'
            />
            <div messageId='main-container-messages' className='p-4'>
              <div ref={container} className='mr-4 flex max-w-screen-md flex-col gap-4 lg:mx-auto'>
                {children}
              </div>
            </div>
          </ScrollArea>
          <ChatInput />
        </main>
      </div>
    </ChatRoomMessagesProvider>
  );
};

export default ChatLayout;
