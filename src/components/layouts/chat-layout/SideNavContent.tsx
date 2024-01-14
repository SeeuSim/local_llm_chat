'use client';

import { Pencil2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import type { IAPIChatRoomGetOutput } from '@/app/api/chat/room/get/types';

import { RoomLink } from '@/components/common/room/RoomLink';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

export const SideNavContent = () => {
  const {
    data: roomData,
    isLoading,
    isPending,
    refetch,
  } = useQuery<IAPIChatRoomGetOutput, Error>({
    queryKey: ['chat', 'rooms', 'get'],
    queryFn: async ({ signal }) => {
      return fetch('/api/chat/room/get', {
        method: 'POST',
        signal,
      }).then((res) => res.json());
    },
  });

  return (
    <div className='flex h-full flex-1 flex-col gap-2'>
      <Link
        href={'/'}
        onClick={() => {
          refetch();
        }}
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
          {roomData?.rooms
            ? roomData.rooms.map((room) => (
                <RoomLink
                  key={room.id}
                  id={room.id as string}
                  summary={room.summary ?? ''}
                  lastModified={room.modifiedTime ?? undefined}
                />
              ))
            : (isLoading || isPending) && (
                <div className='mx-auto flex flex-col gap-2'>
                  <Skeleton className='h-8 w-40' />
                  <Skeleton className='h-8 w-40' />
                  <Skeleton className='h-8 w-40' />
                </div>
              )}
        </div>
      </ScrollArea>
    </div>
  );
};
