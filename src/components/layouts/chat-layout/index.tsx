import { cn } from '@/lib/utils';

import { NavBar } from './NavBar';
import { SideNav } from './SideNav';
import { ChatInput } from './ChatInput';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <main className={cn('relative flex h-full flex-col bg-primary-foreground text-primary')}>
      <NavBar />
      <SideNav />
      <div className='max-h-[calc(100vh-92px)] overflow-y-auto overscroll-none bg-secondary px-4 sm:ml-40'>
        <div id='Top Colored Padding' className='h-[62px] w-full bg-primary-foreground' />
        {children}
      </div>
      <ChatInput />
    </main>
  );
};

export default ChatLayout;
