import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { ChatInput } from './ChatInput';
import { NavBar } from './NavBar';
import { SideNav } from './SideNav';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={cn('relative flex min-h-screen flex-col bg-background text-primary')}>
      <NavBar />
      <main className='flex-1'>
        <SideNav />
        <ScrollArea
          id='main-container'
          className='h-[calc(100vh-92px)] translate-y-[-62px] overflow-y-auto overscroll-none bg-secondary scrollbar-thin scrollbar-track-inherit scrollbar-thumb-border sm:ml-40 md:ml-48'
        >
          <div id='main-container-top-padding' className='h-[62px] w-full bg-primary-foreground' />
          <div className='p-4'>{children}</div>
        </ScrollArea>
        <ChatInput />
      </main>
    </div>
  );
};

export default ChatLayout;
