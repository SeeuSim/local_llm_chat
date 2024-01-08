'use client';

import { useMutation } from '@tanstack/react-query';
import {
  forwardRef,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEventHandler,
} from 'react';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/drop-zone';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import type { IAPIChatRoomCreateResponse } from '@/app/api/chat/room/create/types';

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
}

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ className, height }, ref) => {
    const { roomId } = useContext(roomIDContext);
    const { toast } = useToast();

    const controller = new AbortController();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [files, setFiles] = useState<Array<File>>([]);

    const keyEventHandler: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
      // Handle submit on enter
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const {
      isError,
      isPending,
      isSuccess,
      mutate: submitMessage,
    } = useMutation({
      mutationKey: ['chat/file-upload', files],
      mutationFn: async (roomId: string) => {
        if (files.length === 0) {
          return;
        }

        const payload = new FormData();
        files.forEach((file) => payload.append('files', file));

        payload.append('roomId', `0`);

        // payload.append('roomId', 'roomId');
        return fetch('/api/embed/documents', {
          method: 'POST',
          body: payload,
          signal: controller.signal,
        });
      },
      onSuccess: () => {},
      onError(error, _variables, _context) {
        toast({
          title: 'Oh no! An error occurred',
          description: error.message,
          variant: 'destructive',
          duration: 2000,
        });
      },
    });

    const { mutate: createRoom } = useMutation<Partial<IAPIChatRoomCreateResponse>>({
      mutationKey: ['room/create'],
      mutationFn: async () => {
        return fetch('api/chat/room/create', { method: 'POST' }).then((res) => res.json());
      },
      async onSuccess(data, _variables, _context) {
        if (!data.id) {
          toast({
            title: 'Oh no, an error occurred while creating a room',
            description: data.error
              ? JSON.stringify(data.error)
              : data.rooms
                ? JSON.stringify(data.rooms)
                : data.message ?? '',
            variant: 'destructive',
            duration: 2000,
          });
          return;
        }
        submitMessage(data.id);
      },
    });

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-0 right-0 inline-flex w-full items-center gap-4 border-t border-border bg-primary-foreground p-4',
          'sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]',
          className
        )}
      >
        {/* <FileDialog /> */}
        <div className='flex flex-1 flex-col gap-2'>
          <Dropzone {...{ blockInteraction: isPending, files, setFiles, fileExtension: 'pdf' }} />
          <Textarea ref={textAreaRef} className='bg-secondary' onKeyDown={keyEventHandler} />
        </div>
        <Button
          className=''
          onClick={() => {
            if (roomId === '') {
              createRoom();
            }
          }}
        >
          <span>Send</span>
        </Button>
      </div>
    );
  }
);
