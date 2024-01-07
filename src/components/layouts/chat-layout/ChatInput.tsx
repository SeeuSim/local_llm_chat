'use client';

import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEventHandler,
} from 'react';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/drop-zone';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
}

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ className, height }, ref) => {
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
      mutate: onSubmit,
    } = useMutation({
      mutationKey: ['chat/file-upload', files],
      mutationFn: async () => {
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
      onError(error, variables, _context) {},
    });

    return (
      <div
        ref={ref}
        className='fixed bottom-0 right-0 inline-flex w-full items-center gap-4 border-t border-border bg-primary-foreground p-4 sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]'
      >
        {/* <FileDialog /> */}
        <div className='flex flex-1 flex-col gap-2'>
          <Dropzone {...{ blockInteraction: isPending, files, setFiles, fileExtension: 'pdf' }} />
          <Textarea
            ref={textAreaRef}
            className='bg-secondary'
            onKeyDown={keyEventHandler}
           />
        </div>
        <Button className=''>
          <span>Send {height}</span>
        </Button>
      </div>
    );
  }
);
