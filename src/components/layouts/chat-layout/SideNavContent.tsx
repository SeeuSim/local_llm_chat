'use client';

import { Pencil2Icon } from '@radix-ui/react-icons';

import { RoomLink } from '@/components/common/room/RoomLink';
import { getRooms } from '@/components/common/room/temp-utils';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const SideNavContent = () => {
  return (
    <div className='flex h-full flex-1 flex-col gap-2'>
      <Link
        href={'/'}
        className={cn(
          buttonVariants({ variant: 'default' }),
          'inline-flex items-center justify-between text-primary',
          'bg-neutral-200 hover:bg-neutral-300',
          'dark:bg-neutral-700 dark:hover:bg-neutral-600'
        )}
      >
        <span>New&nbsp;chat</span>
        <Pencil2Icon />
      </Link>
      <ScrollArea className='flex h-[calc(100vh-160px)] w-full border-y border-border/40'>
        <div className='mt-2 flex flex-col gap-2'>
          {getRooms().map((obj, index) => (
            <RoomLink key={index} {...obj} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
