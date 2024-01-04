'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { FileDialog } from './FileDialog';

export const ChatInput = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className='fixed bottom-0 right-0 inline-flex w-full items-center gap-4 border-t border-border bg-primary-foreground p-4 sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]'>
      <FileDialog />
      <Textarea ref={textAreaRef} className='bg-secondary' />
      <Button className='mb-auto'>
        <span>Send</span>
      </Button>
    </div>
  );
};
