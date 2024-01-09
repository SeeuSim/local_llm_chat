'use client';

import { FaceIcon, PersonIcon, ReloadIcon, StopIcon } from '@radix-ui/react-icons';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { forwardRef, HTMLAttributes } from 'react';
import { MarkdownComponent } from '../markdown/MarkdownComponent';
import { Button } from '@/components/ui/button';

interface IChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: 'system' | 'user';
  content: string;
  isStreaming?: boolean;
  isLast?: boolean;
}

export const ChatMessage = forwardRef<HTMLDivElement, IChatMessageProps>(
  ({ role, content, isStreaming, isLast }: IChatMessageProps, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col')}>
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
              <CardContent className='flex flex-col gap-2 px-3 py-2'>
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
                  <Button className='h-min rounded-md bg-transparent p-2 text-red-500 shadow-none hover:bg-destructive hover:text-destructive-foreground'>
                    <StopIcon className='hover:fill-current' />
                  </Button>
                )}
                <Button
                  disabled={isStreaming}
                  className='h-min rounded-md bg-transparent p-2 text-primary shadow-none hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed'
                >
                  <ReloadIcon />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
