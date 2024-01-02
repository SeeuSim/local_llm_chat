import { cn } from '@/lib/utils';

import { NavBar } from './NavBar';
import SideNav from './SideNav';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <main className={cn('relative flex h-full flex-col bg-primary-foreground text-primary')}>
      <NavBar />
      <SideNav />
      <div className='ml-48 mt-[60px] flex max-h-[calc(100vh-60px)] flex-row overflow-y-auto overscroll-none bg-secondary p-4'>
        {children}
      </div>
    </main>
  );
};

export default ChatLayout;
