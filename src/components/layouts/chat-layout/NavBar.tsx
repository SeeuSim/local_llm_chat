'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useContext } from 'react';

import type { IAPIDocumentsLinkParams } from '@/app/api/documents/link/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { chatRoomContext } from '@/lib/contexts/chatRoomContext';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { cn } from '@/lib/utils';

import DarkModeToggle from './DarkModeToggle';
import { LinkFilePopover } from './LinkFilePopover';
import { Logo } from './Logo';
import { MobileSideNav } from './MobileSideNav';

export const NavBar = forwardRef<HTMLDivElement>((_props, ref) => {
  const queryClient = useQueryClient();
  const { roomId } = useContext(searchParamsRoomIdContext);
  const { documents } = useContext(chatRoomContext);

  const { mutate: linkUnlinkDocuments, isPending } = useMutation({
    mutationFn: async (params: { isLinkUnlink: boolean; documents: string[] }) => {
      const payload: IAPIDocumentsLinkParams = {
        roomId,
        isLinkUnlink: params.isLinkUnlink,
        documentTitles: params.documents,
      };
      return fetch('/api/documents/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['chat', 'documents', 'get', roomId] });
    },
  });

  return (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-50 ml-auto flex w-screen border-b border-b-border backdrop-blur-lg sm:w-[calc(100vw-160px)] md:w-[calc(100vw-192px)]'
      )}
    >
      <div className='inline-flex w-full items-center justify-between p-3'>
        <div className='inline-flex items-center gap-4 sm:hidden'>
          <MobileSideNav />
          <Logo />
        </div>
        <div
          className={cn(
            'mx-auto flex flex-row gap-x-2 md:gap-x-1 lg:gap-x-2',
            roomId.length === 0 && 'hidden'
          )}
        >
          {documents?.slice(0, 3).map((document, index) => (
            <div
              key={document}
              className={cn(
                'flex max-w-[200px] flex-shrink-0 flex-row gap-1 truncate rounded-md border border-border bg-background px-2 py-1 text-xs',
                index === 0 && 'hidden sm:flex',
                index === 1 && 'hidden md:flex',
                index === 2 && 'hidden lg:flex'
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className='flex-1 truncate'>{document}</span>
                  </TooltipTrigger>
                  <TooltipContent className='border border-border bg-secondary-foreground p-1 text-xs text-secondary shadow-sm'>
                    {document}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isPending}
                      onClick={() => {
                        linkUnlinkDocuments({
                          isLinkUnlink: false,
                          documents: [document],
                        });
                      }}
                      className='m-0 h-min bg-transparent p-0 text-primary hover:bg-transparent hover:text-primary'
                    >
                      <Cross1Icon className='hover:scale-110 hover:text-red-500' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='border border-border bg-secondary-foreground p-1 text-xs text-secondary shadow-sm'>
                    <span>Unlink document from this chat</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <LinkFilePopover
            isLinking={isPending}
            documents={documents}
            linkDocument={linkUnlinkDocuments}
          />
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
});
