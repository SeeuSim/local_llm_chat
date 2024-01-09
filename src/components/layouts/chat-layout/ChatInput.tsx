'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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

import { IAPIChatMessagesCreateParams } from '@/app/api/chat/messages/create/types';
import type { IAPIChatRoomCreateResponse } from '@/app/api/chat/room/create/types';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import { useRouter } from 'next/navigation';
import { chatRoomMessagesContext } from '@/lib/contexts/chatRoomMessagesContext';
import { TChatMessage } from '@/app/api/chat/invoke/types';

type ChatInputProps = HTMLAttributes<HTMLDivElement>;

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(({ className }, ref) => {
  const queryClient = useQueryClient();
  const { roomId } = useContext(roomIDContext);
  const { messages, streamed, setStreamed } = useContext(chatRoomMessagesContext);
  const { push } = useRouter();
  const { toast } = useToast();

  const controller = new AbortController();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<Array<File>>([]);

  const setStreaming = (val: string, append: boolean = true) => {
    if (!setStreamed) {
      return;
    }
    if (append) {
      setStreamed((prev) => prev + val);
    } else {
      setStreamed(val);
    }
  };

  const invoke = async (
    message: string,
    hasDocuments: boolean,
    previousMessages: TChatMessage[]
  ) => {
    resetTextField();
    setStreaming('<PENDING>', false);
    const stream = await fetch('/api/chat/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: previousMessages,
        hasDocuments,
        roomId,
      }),
    });

    const reader = stream.body?.getReader();
    let accum = '';
    let isStreamFinished = false;
    setStreaming('', false);
    do {
      if (!reader) {
        break;
      }
      const { done, value } = await reader.read();
      if (done) {
        isStreamFinished = true;
        break;
      }
      const chunk = new TextDecoder().decode(value);
      accum += chunk;
      setStreaming(chunk);
    } while (!isStreamFinished);

    const payload: IAPIChatMessagesCreateParams = {
      messages: [
        {
          roomId,
          persona: 'system',
          content: accum,
        },
      ],
    };

    const systemMessageInserted = await fetch('/api/chat/messages/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (systemMessageInserted.ok) {
      queryClient
        .refetchQueries({ queryKey: ['chat', 'messages', 'get', roomId] })
        .then((_res) => setStreaming('', false))
        .then((_res) => {
          if (textAreaRef.current) {
            textAreaRef.current.focus();
          }
        });
    }
  };

  const keyEventHandler: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    // Handle submit on enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      onSubmit();
    }
  };

  const { isPending: isSubmitPayloadPending, mutate: submitPayload } = useMutation({
    mutationKey: ['chat', 'messages', 'create', roomId],
    mutationFn: async ({
      payloadRoomId,
      message,
      files = [],
    }: {
      payloadRoomId: string;
      message: string;
      files?: File[];
    }) => {
      if (files.length) {
        const body = new FormData();
        body.append('roomId', payloadRoomId);
        files.forEach((file) => body.append('files', file));
        toast({ title: 'Embedding files...' });
        const embedResponse = await fetch('/api/embed/documents', {
          method: 'POST',
          signal: controller.signal,
          body,
        });
        if (!embedResponse.ok) {
          const response = await embedResponse.text();
          throw new Error(response);
        }
      }

      const filesPayload =
        files.length > 0
          ? {
              documentTitles: files.map((file) => file.name),
            }
          : {};

      const payload: IAPIChatMessagesCreateParams = {
        messages: [
          {
            persona: 'user',
            content: message,
            roomId: payloadRoomId,
            ...filesPayload,
          },
        ],
      };
      const messageResponse = await fetch('/api/chat/messages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!messageResponse.ok) {
        const response = await messageResponse.text();
        throw new Error(response);
      }
      return;
    },
    onError: (error, _variables, _context) => {
      toast({
        variant: 'destructive',
        title: 'Oh no! An error occurred',
        description: error.message,
      });
    },
    onSuccess: () => {
      if (roomId) {
        queryClient.refetchQueries({ queryKey: ['chat', 'messages', 'get', roomId] });
        invoke(textAreaRef.current?.value as string, files.length > 0, messages ?? []);
      }
    },
  });

  const { isPending: isCreateRoomPending, mutate: createRoom } = useMutation<
    Partial<IAPIChatRoomCreateResponse>
  >({
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
      if (textAreaRef.current?.value) {
        submitPayload({ payloadRoomId: data.id, message: textAreaRef.current.value, files });
        resetTextField();
        push(`/chat/${data.id}?initial=true`);
      }
    },
  });

  const resetTextField = () => {
    if (!textAreaRef.current) {
      return;
    }
    textAreaRef.current.value = '';
  };

  const onSubmit = () => {
    if (!textAreaRef.current) {
      return;
    }
    if (roomId === '') {
      createRoom();
    } else {
      submitPayload({ payloadRoomId: roomId, message: textAreaRef.current.value, files });
    }
  };

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
        <Dropzone
          {...{
            blockInteraction: isCreateRoomPending || isSubmitPayloadPending,
            files,
            setFiles,
            fileExtension: 'pdf',
          }}
        />
        <Textarea
          ref={textAreaRef}
          className='bg-secondary'
          onKeyDown={keyEventHandler}
          disabled={isCreateRoomPending || isSubmitPayloadPending}
        />
      </div>
      <Button
        className=''
        onClick={onSubmit}
        disabled={isCreateRoomPending || isSubmitPayloadPending}
      >
        <span>Send</span>
      </Button>
    </div>
  );
});
