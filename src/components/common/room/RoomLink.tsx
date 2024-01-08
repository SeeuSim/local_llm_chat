'use client';

import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useContext } from 'react';

interface IRoomLinkProps {
  id: string;
  summary: string;
  // TBC
  lastModified?: any;
}

export const RoomLink = ({ id, summary }: IRoomLinkProps) => {
  const { roomId } = useContext(roomIDContext);

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        buttonVariants({ variant: 'link' }),
        'inline-flex w-full justify-between rounded-md px-2 py-1.5 hover:no-underline',
        'hover:cursor-pointer hover:bg-secondary',
        roomId === id && 'bg-primary text-primary-foreground hover:bg-secondary-foreground'
      )}
    >
      <span className='flex flex-col text-sm font-normal'>{summary}</span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='flex flex-col'>
          <DropdownMenuItem
            className={cn(
              'inline-flex items-center gap-3 text-sm',
              'hover:cursor-pointer focus-visible:cursor-pointer'
            )}
          >
            <Pencil1Icon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              'inline-flex items-center gap-3 text-sm text-destructive',
              'focus:cursor-pointer focus:bg-destructive-foreground focus:text-destructive'
            )}
          >
            <TrashIcon />
            <span>Delete Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
};
