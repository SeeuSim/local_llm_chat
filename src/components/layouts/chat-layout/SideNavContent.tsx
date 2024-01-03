'use client';

import { Pencil2Icon } from '@radix-ui/react-icons';

import { RoomLink } from '@/components/common/room/RoomLink';
import { getRooms } from '@/components/common/room/temp-utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const SideNavContent = () => {
  return (
    <div className='flex h-full flex-1 flex-col gap-2'>
      <Button
        variant='default'
        className={cn(
          'inline-flex items-center justify-between text-primary',
          'bg-neutral-200 hover:bg-neutral-300',
          'dark:bg-neutral-700 dark:hover:bg-neutral-600'
        )}
      >
        <span>New&nbsp;chat</span>
        <Pencil2Icon />
      </Button>
      <ScrollArea className='flex h-[calc(100vh-160px)] w-full rounded-md border-y border-border/40'>
        <div className='flex flex-col gap-2'>
          {getRooms()
            // .sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime())
            .map((obj, index) => (
              <RoomLink key={index} {...obj} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
