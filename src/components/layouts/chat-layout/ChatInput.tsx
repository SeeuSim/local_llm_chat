'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const ChatInput = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className='fixed bottom-0 right-0 inline-flex w-full items-center gap-4 border-t border-border bg-primary-foreground p-4 sm:w-[calc(100vw-160px)]'>
      <Textarea ref={textAreaRef} className='bg-secondary' />
      <Button className='mb-auto'>
        <span>Send</span>
      </Button>
    </div>
  );
};
