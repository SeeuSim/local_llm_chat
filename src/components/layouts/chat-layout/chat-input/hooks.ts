import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useMemo, useRef, useState, type KeyboardEventHandler } from 'react';

import { RESET_STREAM, STREAM_LOADING_FLAG } from '@/components/layouts/chat-layout/constants';
import { useToast } from '@/components/ui/use-toast';

import type { TChatMessage } from '@/app/api/chat/invoke/types';
import type { IAPIChatMessagesCreateParams } from '@/app/api/chat/messages/create/types';
import { IAPIChatMessagesUpdateParams } from '@/app/api/chat/messages/update/types';
import type { IAPIChatRoomCreateResponse } from '@/app/api/chat/room/create/types';

import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import { chatRoomMessagesContext } from '@/lib/contexts/chatRoomMessagesContext';

export const useChatInputHooks = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();
  const { roomId } = useContext(roomIDContext);
  const { invokeController, messages, streamed, setStreamed, invokeParams, setInvokeParams } =
    useContext(chatRoomMessagesContext);

  const { toast } = useToast();

  const controller = new AbortController();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<Array<File>>([]);

  const setStreaming = (val: string, options?: { append: boolean }) => {
    if (!setStreamed) {
      return;
    }
    if (options?.append) {
      setStreamed((prev) => prev + val);
    } else {
      setStreamed(val);
    }
  };

  const upsertSystemMessage = async (
    message: string,
    isAborted: boolean = false,
    messageId?: string
  ) => {
    const route = !messageId ? '/api/chat/messages/create' : '/api/chat/messages/update';
    const payload = !messageId
      ? ({
          messages: [
            {
              roomId,
              persona: 'system',
              content: message,
              isAborted,
            },
          ],
        } satisfies IAPIChatMessagesCreateParams)
      : ({
          messages: [
            {
              id: messageId,
              roomId,
              content: message,
              isAborted,
            },
          ],
        } satisfies IAPIChatMessagesUpdateParams);

    const upsertResponse = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (upsertResponse.ok) {
      queryClient
        .refetchQueries({ queryKey: ['chat', 'messages', 'get', roomId] })
        .then((_res) => setStreaming(RESET_STREAM))
        .then((_res) => {
          if (textAreaRef.current) {
            textAreaRef.current.focus();
          }
          if (invokeController) {
            invokeController.current = new AbortController();
          }
        });
      if (searchParams.get('initial')) {
        push(`/chat/${roomId}`);
      }
      // Re-invocation
      if (messageId && setInvokeParams) {
        setInvokeParams(undefined);
      }
    }
  };

  // Chat Invocation
  const invoke = async (
    message: string,
    hasDocuments: boolean,
    previousMessages: TChatMessage[],
    systemMessageId?: string
  ) => {
    resetTextField();
    setStreaming(STREAM_LOADING_FLAG);
    const signal = invokeController?.current?.signal
      ? { signal: invokeController.current.signal }
      : {};
    const stream = await fetch('/api/chat/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...signal,
      body: JSON.stringify({
        message,
        history: previousMessages,
        hasDocuments,
        roomId,
      }),
    });

    const reader = stream?.body?.getReader();
    let [isStreamFinished, isAborted] = [false, false];
    if (invokeController?.current && reader) {
      invokeController.current = new AbortController();
      invokeController.current.signal.addEventListener(
        'abort',
        () => {
          reader.cancel();
          isStreamFinished = true;
          isAborted = true;
          if (invokeController) {
            invokeController.current = new AbortController();
          }
        },
        { signal: invokeController.current.signal }
      );
    }

    let accum = '';
    setStreaming(accum);
    do {
      if (!reader) {
        break;
      }
      const { done, value } = await reader.read();
      if (done || invokeController?.current.signal.aborted) {
        isStreamFinished = true;
        if (invokeController?.current.signal.aborted) {
          isAborted = true;
        }
        break;
      }
      const chunk = new TextDecoder().decode(value);
      accum += chunk;
      setStreaming(chunk, { append: true });
    } while (!isStreamFinished);
    await upsertSystemMessage(accum, isAborted, systemMessageId);
  };

  // Event handler for Text Area
  const handleTextAreaEnterKey: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    // Handle submit on enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      onSubmit();
    }
  };

  //==========================================
  // PROGRAMMATIC MUTATIONS
  //==========================================

  // User Payload Submission Hook
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
        toast({ title: 'Uploading files...' });
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
        toast({ title: 'Files uploaded! Submitting to model...' });
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
        // To change messages for when user discards history
        invoke(textAreaRef.current?.value as string, files.length > 0, messages ?? []);
      }
    },
  });

  // Room Creation hook
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

  // For clearing the text fields
  const resetTextField = () => {
    if (!textAreaRef.current) {
      return;
    }
    textAreaRef.current.value = '';
  };

  // For handling the textarea submit
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

  //==============================================
  // EFFECTS
  //==============================================

  // For invoking on room creation
  useEffect(() => {
    if (searchParams.get('initial') === 'true' && messages?.length === 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.persona !== 'system') {
        // No history needed
        invoke(lastMessage.content as string, lastMessage.documentTitles?.length !== 0, []);
      }
    }
  }, [searchParams.get('initial'), messages]);

  // For re-invocation
  useEffect(() => {
    if (invokeParams !== undefined) {
      const { message, hasDocuments, previousMessages, systemMessageId } = invokeParams;
      invoke(message, hasDocuments, previousMessages, systemMessageId);
    }
  }, [invokeParams]);

  // For blocking input on streaming/submissions
  const isInputsDisabled = useMemo(() => {
    return streamed.length > 0 || isSubmitPayloadPending || isCreateRoomPending;
  }, [streamed, isCreateRoomPending, isSubmitPayloadPending]);

  return {
    isInputsDisabled,
    files,
    setFiles,
    textAreaRef,
    handleTextAreaEnterKey,
    onSubmit,
  };
};