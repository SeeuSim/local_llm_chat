'use client';

import type { RefObject } from 'react';

import { cn } from '@/lib/utils';

import { Logo } from './Logo';
import { SideNavContent } from './SideNavContent';

export const SideNav = ({ ref }: { ref?: RefObject<HTMLDivElement> }) => {
  return (
    <aside
      ref={ref}
      className={cn(
        'fixed bottom-0 left-0 z-50 flex h-full w-40 -translate-x-40 border-r border-border bg-primary-foreground transition-transform sm:translate-x-0 md:w-48'
      )}
    >
      <div className='relative flex h-full w-full flex-col gap-4 p-4'>
        <Logo />
        <hr className='flex border border-border' />
        <SideNavContent />
      </div>
    </aside>
  );
};
