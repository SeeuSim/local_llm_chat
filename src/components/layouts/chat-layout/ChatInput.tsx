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
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/drop-zone';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
}

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ className, height }, ref) => {
    const { roomId } = useContext(roomIDContext);

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
        toast('Oh no, an error occurred', {
          duration: 2000,
          description: error.message,
          descriptionClassName: 'bg-destructive text-destructive-foreground',
        });
      },
    });

    const { mutate: createRoom } = useMutation({
      mutationKey: ['room/create'],
      mutationFn: async () => {
        return fetch('api/chat/room/create', { method: 'POST' });
      },
      async onSuccess(data, _variables, _context) {
        const response = (await data.json()) as { id: string };

        toast('Room has been created', {
          description: response.id,
          duration: 2000,
        });
        submitMessage(response.id);
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
