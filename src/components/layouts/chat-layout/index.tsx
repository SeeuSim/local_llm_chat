import { cn } from '@/lib/utils';

import { ChatInput } from './ChatInput';
import { NavBar } from './NavBar';
import { SideNav } from './SideNav';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <main className={cn('relative flex h-full flex-col bg-primary-foreground text-primary')}>
      <NavBar />
      <SideNav />
      <div
        id='main-container'
        className='h-[calc(100vh-92px)] overflow-y-auto overscroll-none bg-secondary sm:ml-40'
      >
        <div id='main-container-top-padding' className='h-[62px] w-full bg-primary-foreground' />
        <div className='p-4'>{children}</div>
      </div>
      <ChatInput />
    </main>
  );
};

export default ChatLayout;
