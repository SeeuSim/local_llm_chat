'use client';

import { Pencil2Icon } from '@radix-ui/react-icons';

import { RoomLink } from '@/components/common/room/RoomLink';
import { generateObjectsArray } from '@/components/common/room/temp-utils';
import { Button } from '@/components/ui/button';
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
      <div className='flex flex-1 text-clip rounded-r-md'>
        <div className='flex max-h-[calc(100vh-160px)] w-full overflow-y-auto scrollbar-thin scrollbar-track-inherit dark:scrollbar-thumb-neutral-700'>
          <div className='flex w-full flex-col gap-2'>
            {generateObjectsArray()
              // .sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime())
              .map((obj, index) => (
                <RoomLink key={index} {...obj} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
