'use client';

import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import { TAPIChatRoomUpdateParams } from '@/app/api/chat/room/update/types';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatRoomContext } from '@/lib/contexts/chatRoomContext';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAPIChatRoomDeleteParams } from '@/app/api/chat/room/delete/types';
import { useRouter } from 'next/navigation';

interface IRoomLinkProps {
  id: string;
  summary: string;
  // TBC
  lastModified?: Date;
}

export const RoomLink = ({
  id: actualRoomId,
  summary,
  lastModified: _modifiedTime,
}: IRoomLinkProps) => {
  const router = useRouter();
  const { roomId } = useContext(searchParamsRoomIdContext);
  const queryClient = useQueryClient();
  const { messages } = useContext(chatRoomContext);

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

      const params: TAPIChatRoomUpdateParams = {
        id: roomId,
        summary: acc,
      };

      const updateSummary = await fetch('/api/chat/room/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!updateSummary.ok) {
        // TODO: Handle
        return;
      }
    }
  };

  useEffect(() => {
    if (roomId === actualRoomId && messages && messages.length && !summary) {
      if (messages.length < 2) {
        return;
      }
      const [first, second] = messages.slice(0, 2);
      if (first.persona === 'user' && second.persona === 'system') {
        invoke(first.content as string, second.content as string);
      }
    }
  }, [messages, roomId, summary]);

  const { mutate: deleteRoom, isPending: isDeletePending } = useMutation({
    mutationKey: ['room', 'delete', roomId],
    mutationFn: async ({ roomToDeleteId }: { roomToDeleteId: string }) => {
      const payload: IAPIChatRoomDeleteParams = {
        roomId: roomToDeleteId,
      };
      return await fetch('/api/chat/room/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
    onSuccess(response, _variables, _context) {
      if (response.ok) {
        queryClient
          .refetchQueries({
            queryKey: ['chat', 'rooms', 'get'],
          })
          .then((_res) => router.push('/'));
      }
    },
  });

  return (
    <Link
      href={`/chat/${actualRoomId}`}
      onClick={() => {
        queryClient.refetchQueries({ queryKey: ['chat', 'rooms', 'get'] });
      }}
      className={cn(
        buttonVariants({ variant: 'link' }),
        'group w-full rounded-md px-2 py-1.5 hover:no-underline',
        'hover:cursor-pointer hover:bg-secondary',
        roomId === actualRoomId &&
          'bg-primary text-primary-foreground hover:bg-secondary-foreground'
      )}
    >
      <div className='flex w-28 flex-row gap-0.5 whitespace-nowrap md:w-36'>
        <span className='flex-1 overflow-hidden text-xs font-normal'>{streamedSummary}</span>
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isDeletePending} className='flex'>
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex flex-col'>
            <DropdownMenuItem
              disabled
              className={cn(
                'inline-flex items-center gap-3 text-sm',
                'hover:cursor-pointer focus-visible:cursor-pointer'
              )}
            >
              <Pencil1Icon />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteRoom({ roomToDeleteId: actualRoomId });
              }}
              className={cn(
                'inline-flex items-center gap-3 text-sm text-red-500',
                'focus:cursor-pointer focus:bg-red-500/20 focus:text-red-500'
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
