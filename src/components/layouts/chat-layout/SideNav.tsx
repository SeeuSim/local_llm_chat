'use client';

import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export const SideNav = () => {
  return (
    <aside
      className={cn(
        'fixed bottom-0 left-0 h-full w-40 -translate-x-40 border-r border-border bg-primary-foreground transition-transform sm:translate-x-0'
      )}
    >
      <div className='relative flex flex-col gap-4 p-4'>
        <Logo />
        <hr className='border border-border' />
      </div>
    </aside>
  );
};
