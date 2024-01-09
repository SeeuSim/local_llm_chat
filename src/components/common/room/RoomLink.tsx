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
import { useContext, useEffect, useState } from 'react';
import { chatRoomMessagesContext } from '@/lib/contexts/chatRoomMessagesContext';
import { useSearchParams } from 'next/navigation';

interface IRoomLinkProps {
  id: string;
  summary: string;
  // TBC
  lastModified?: any;
}

export const RoomLink = ({ id, summary }: IRoomLinkProps) => {
  const searchParams = useSearchParams();
  const { roomId } = useContext(roomIDContext);
  const { messages } = useContext(chatRoomMessagesContext);

  const [streamedSummary, setStreamedSummary] = useState(summary);

  const invoke = async (userMessage: string, systemMessage: string) => {
    const payload = {
      userMessage,
      systemMessage,
    };

    const stream = await fetch('/api/summarise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (stream.ok) {
      const reader = stream.body?.getReader();
      if (!reader) {
        // TODO: Handle
        return;
      }
      let acc = '';
      let isStreamFinished = false;
      do {
        const { done, value } = await reader.read();
        if (done) {
          isStreamFinished = done;
          break;
        }
        const val = new TextDecoder().decode(value);
        acc += val;
        setStreamedSummary((prev) => prev + val);
      } while (!isStreamFinished);

      const updateSummary = await fetch('/api/chat/room/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, summary: acc }),
      });
      if (!updateSummary.ok) {
        // TODO: Handle
        return;
      }
    }
  };

  useEffect(() => {
    if (roomId === id && messages && messages.length === 2 && !summary) {
      const [first, second] = messages;
      if (first.persona === 'user' && second.persona === 'system') {
        invoke(first.content as string, second.content as string);
      }
    }
  }, [messages, roomId, summary]);

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        buttonVariants({ variant: 'link' }),
        'group w-full rounded-md px-2 py-1.5 hover:no-underline',
        'hover:cursor-pointer hover:bg-secondary',
        roomId === id && 'bg-primary text-primary-foreground hover:bg-secondary-foreground'
      )}
    >
      <div className='flex w-36 flex-row gap-0.5 whitespace-nowrap'>
        <span className='flex-1 overflow-hidden text-xs font-normal'>{streamedSummary}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex'>
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
      </div>
    </Link>
  );
};
