'use client';

import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import Link from 'next/link';

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
          <DropdownMenuItem className='inline-flex items-center gap-3 text-sm focus-visible:cursor-pointer'>
            <Pencil1Icon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='inline-flex items-center gap-3 text-sm text-destructive focus-visible:cursor-pointer focus-visible:bg-destructive-foreground focus-visible:text-destructive'>
            <TrashIcon />
            <span>Delete Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
};
