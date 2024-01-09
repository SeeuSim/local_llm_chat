'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { ChatInput } from './ChatInput';
import { NavBar } from './NavBar';
import { SideNav } from './SideNav';
import { useState } from 'react';
import { ChatRoomMessagesProvider } from '@/components/common/chat/providers';
import type { TMessage } from '@/lib/contexts/chatRoomMessagesContext';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  const [messages, setMessages] = useState<Array<TMessage>>([]);
  const [streamed, setStreamed] = useState('');

  const appendMessage = (newMessage: TMessage) =>
    setMessages((prevMessages) => [...prevMessages, newMessage]);

  return (
    <ChatRoomMessagesProvider {...{ messages, appendMessage, setMessages, streamed, setStreamed }}>
      <div className={cn('relative flex min-h-screen flex-col bg-background text-primary')}>
        <NavBar />
        <SideNav />
        <main className='flex-1'>
          <ScrollArea
            id='main-container'
            className={cn(
              'translate-y-[-62px] overflow-y-auto overscroll-none bg-background scrollbar-thin scrollbar-track-inherit scrollbar-thumb-border sm:ml-40 md:ml-48',
              `h-[calc(100vh-180px)]`
            )}
          >
            <div
              id='main-container-top-padding'
              className='h-[62px] w-full bg-primary-foreground'
            />
            <div id='main-container-messages' className='p-4'>
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
