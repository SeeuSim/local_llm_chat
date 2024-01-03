'use client';

import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { SideNavContent } from './SideNavContent';

export const SideNav = () => {
  return (
    <aside
      className={cn(
        'fixed bottom-0 left-0 flex h-full w-40 -translate-x-40 border-r border-border bg-primary-foreground transition-transform sm:translate-x-0'
      )}
    >
      <div className='relative flex h-full flex-col gap-4 p-4'>
        <Logo />
        <hr className='flex border border-border' />
        <SideNavContent />
      </div>
    </aside>
  );
};
