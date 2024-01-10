'use client';

import { FaceIcon, PersonIcon, ReloadIcon, StopIcon } from '@radix-ui/react-icons';
import { HTMLAttributes, forwardRef, useContext, useState } from 'react';

import { MarkdownComponent } from '@/components/common/markdown/MarkdownComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { chatRoomMessagesContext } from '@/lib/contexts/chatRoomMessagesContext';
import { cn } from '@/lib/utils';

interface IChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: 'system' | 'user';
  content: string;
  isStreaming?: boolean;
  isLast?: boolean;
  isAborted?: boolean;
  reInvoke?: () => void;
}

export const ChatMessage = forwardRef<HTMLDivElement, IChatMessageProps>(
  ({ role, content, isStreaming, isLast, isAborted, reInvoke }: IChatMessageProps, ref) => {
    const { invokeController, streamed } = useContext(chatRoomMessagesContext);
    const [onReinvokeHide, setOnReinvokeHide] = useState(false);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col', onReinvokeHide && streamed.length > 0 && 'hidden')}
      >
        <div className={cn('mb-1 flex flex-row items-center gap-2')}>
          <div
            className={cn(
              'rounded-md border border-border/70 bg-primary p-2 text-primary-foreground',
              role === 'system' && 'border-border/40 bg-muted text-muted-foreground'
            )}
          >
            {role === 'system' ? <FaceIcon /> : <PersonIcon />}
          </div>
          <span className='text-sm font-bold'>{role === 'system' ? 'Model' : 'You'}</span>
        </div>
        {content === '<PENDING>' ? (
          <Skeleton className='ml-5 flex h-20 w-full rounded-md border-border/40' />
        ) : (
          <>
            <Card
              className={cn(
                'relative ml-5 flex w-full border-border/70 bg-primary',
                role === 'system' && 'border-border/40 bg-muted'
              )}
            >
              <CardContent className='relative flex w-full flex-col gap-2 px-3 py-2'>
                {isAborted && (
                  <div className='absolute right-2 top-2 ml-auto rounded-full bg-muted-foreground px-2 py-1 text-xs text-muted'>
                    Interrupted
                  </div>
                )}
                <MarkdownComponent
                  className={cn(
                    'prose prose-neutral text-sm text-primary-foreground',
                    'prose-a:text-blue-500 prose-code:text-secondary-foreground prose-pre:bg-muted-foreground',
                    role === 'system' &&
                      'text-muted-foreground prose-pre:bg-secondary-foreground prose-pre:text-secondary'
                  )}
                >
                  {content}
                </MarkdownComponent>
              </CardContent>
            </Card>
            {role === 'system' && isLast && (
              <div className='ml-auto mt-2 inline-flex items-center gap-2 py-1'>
                {isStreaming && (
                  <Button
                    onClick={() => {
                      if (invokeController && invokeController.current) {
                        try {
                          if (!invokeController.current.signal.aborted) {
                            invokeController.current.abort();
                          }
                        } catch (error) {
                          if ((error as Error).name === 'AbortError') {
                            return;
                          }
                        }
                      }
                    }}
                    className='h-min rounded-md bg-transparent p-2 text-red-500 shadow-none hover:bg-destructive hover:text-destructive-foreground'
                  >
                    <StopIcon className='hover:fill-current' />
                  </Button>
                )}
                {isAborted && (
                  <Button
                    disabled={isStreaming}
                    onClick={() => {
                      reInvoke && reInvoke();
                      setOnReinvokeHide(true);
                    }}
                    className='h-min rounded-md bg-transparent p-2 text-primary shadow-none hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed'
                  >
                    <ReloadIcon />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
