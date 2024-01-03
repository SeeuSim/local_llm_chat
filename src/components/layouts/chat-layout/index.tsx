import { cn } from '@/lib/utils';

import { NavBar } from './NavBar';
import { SideNav } from './SideNav';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <main className={cn('relative flex h-full flex-col bg-primary-foreground text-primary')}>
      <NavBar />
      <SideNav />
      <div className='mt-[62px] flex max-h-[calc(100vh-62px)] flex-row overflow-y-auto overscroll-none bg-secondary px-4 pt-2 sm:ml-40'>
        {children}
      </div>
    </main>
  );
};

export default ChatLayout;
