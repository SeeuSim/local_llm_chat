'use client';

import { FaceIcon, PersonIcon, ReloadIcon, StopIcon } from '@radix-ui/react-icons';
import { HTMLAttributes, forwardRef, useContext, useState } from 'react';

import { MarkdownComponent } from '@/components/common/markdown/MarkdownComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STREAM_LOADING_FLAG } from '@/components/layouts/chat-layout/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { chatRoomContext } from '@/lib/contexts/chatRoomContext';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { cn } from '@/lib/utils';

interface IChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: 'system' | 'user';
  content: string;
  index: number;
  isStreaming?: boolean;
  isLast?: boolean;
  isAborted?: boolean;
  reInvoke?: () => void;
  isTruncated?: boolean;
}

export const ChatMessage = forwardRef<HTMLDivElement, IChatMessageProps>(
  (
    {
      role,
      content,
      isStreaming,
      isLast,
      isAborted,
      index,
      isTruncated,
      reInvoke,
    }: IChatMessageProps,
    ref
  ) => {
    const { roomId } = useContext(searchParamsRoomIdContext);
    const {
      invokeController,
      streamed,
      details: roomDetails,
      updateRoom,
    } = useContext(chatRoomContext);
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
        {content === STREAM_LOADING_FLAG ? (
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
                    'prose-a:text-blue-500 prose-code:text-secondary-foreground prose-pre:ml-2 prose-pre:bg-transparent prose-pre:p-0',
                    'prose-strong:text-primary',
                    role === 'system' && 'text-muted-foreground'
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
            {!isStreaming && (
              <div className='group relative mt-4 hidden w-[calc(100%+32px)] xl:flex'>
                <div className='absolute right-[calc(-120px-24px)] top-[-16px]'>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          onClick={() => {
                            if (updateRoom) {
                              const updatedIndexes = new Set(roomDetails?.truncateIndexes ?? []);
                              if (!isTruncated) {
                                updatedIndexes.add(index);
                              } else if (isTruncated && index > 0) {
                                updatedIndexes.delete(index);
                              }
                              updateRoom({
                                truncateIndexes: Array.from(updatedIndexes).sort(),
                              });
                            }
                          }}
                          className='h-8 py-1 text-muted-foreground/40 dark:text-secondary dark:hover:text-secondary-foreground'
                        >
                          <span className='text-sm font-medium'>Add Breakpoint</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className='translate-x-[-16px] border border-border bg-background text-foreground'>
                        Disregard all chat history before this point
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <hr
                  className={cn(
                    'w-full border border-muted-foreground/10 group-hover:border-red-500 dark:border-secondary/40',
                    isTruncated && 'border-red-500'
                  )}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
