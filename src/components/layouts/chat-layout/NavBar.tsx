import { cn } from '@/lib/utils';
import DarkModeToggle from './DarkModeToggle';

import { MobileSideNav } from './MobileSideNav';
import { Logo } from './Logo';

export const NavBar = () => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 ml-auto flex w-screen border-b border-b-border backdrop-blur-lg sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]'
      )}
    >
      <div className='inline-flex w-full items-center justify-between p-3'>
        <div className='inline-flex items-center gap-4 sm:hidden'>
          <MobileSideNav />
          <Logo />
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
};
