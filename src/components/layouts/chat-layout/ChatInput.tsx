'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/drop-zone';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useChatInputHooks } from './chat-input/hooks';

type ChatInputProps = HTMLAttributes<HTMLDivElement>;

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(({ className }, ref) => {
  const {
    isInputsDisabled,
    files,
    setFiles,
    loadingStage,
    textAreaRef,
    handleTextAreaEnterKey,
    onSubmit,
  } = useChatInputHooks();

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
        <div className='flex flex-row items-center gap-4'>
          <Dropzone
            className='flex h-min flex-1'
            {...{
              blockInteraction: isInputsDisabled,
              files,
              setFiles,
              fileExtension: 'pdf',
            }}
          />
          {loadingStage && <div>{loadingStage}</div>}
        </div>
        <Textarea
          ref={textAreaRef}
          className='flex flex-1 bg-secondary'
          onKeyDown={handleTextAreaEnterKey}
          disabled={isInputsDisabled}
        />
      </div>
      <Button className='' onClick={onSubmit} disabled={isInputsDisabled}>
        <span>Send</span>
      </Button>
    </div>
  );
});
