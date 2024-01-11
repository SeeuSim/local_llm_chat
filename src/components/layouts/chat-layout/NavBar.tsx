'use client';

import { forwardRef, useContext } from 'react';

import { chatRoomContext } from '@/lib/contexts/chatRoomContext';
import { cn } from '@/lib/utils';

import DarkModeToggle from './DarkModeToggle';
import { Logo } from './Logo';
import { MobileSideNav } from './MobileSideNav';

export const NavBar = forwardRef<HTMLDivElement>((props, ref) => {
  const { documents } = useContext(chatRoomContext);

  return (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-50 ml-auto flex w-screen border-b border-b-border backdrop-blur-lg sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]'
      )}
    >
      <div className='inline-flex w-full items-center justify-between p-3'>
        <div className='inline-flex items-center gap-4 sm:hidden'>
          <MobileSideNav />
          <Logo />
        </div>
        <div className='mx-auto flex flex-row gap-x-2'>
          {documents?.slice(0, 3).map((document, index) => (
            <div
              key={document}
              className={cn(
                'max-w-[200px] flex-shrink-0 truncate rounded-md border border-border bg-background px-2 py-1 text-xs',
                index === 0 && 'hidden sm:flex',
                index === 1 && 'hidden md:flex',
                index === 2 && 'hidden lg:flex'
              )}
            >
              <span>{document}</span>
            </div>
          ))}
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
});
