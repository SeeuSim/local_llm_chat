import { cn } from '@/lib/utils';
import DarkModeToggle from './DarkModeToggle';

import { MobileSideNav } from './MobileSideNav';
import { Logo } from './Logo';

export const NavBar = () => {
  return (
    <nav
      className={cn(
        'fixed right-0 top-0 flex w-screen border-b border-b-border backdrop-blur-lg sm:w-[calc(100vw-160px)]'
      )}
    >
      <div className='inline-flex w-full items-center justify-between p-3'>
        <div className='inline-flex items-center gap-4 sm:hidden'>
          <MobileSideNav />
          <Logo />
        </div>
        <DarkModeToggle />
      </div>
    </nav>
  );
};
