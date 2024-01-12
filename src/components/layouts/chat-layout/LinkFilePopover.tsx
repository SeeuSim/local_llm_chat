'use client';
import { Link1Icon } from '@radix-ui/react-icons';
import { UseMutateFunction, useQuery } from '@tanstack/react-query';
import { ElementRef, forwardRef, useContext, useEffect, useState } from 'react';

import type { IAPIDocumentsGetResults } from '@/app/api/documents/get/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { chatRoomContext } from '@/lib/contexts/chatRoomContext';

interface ILinkFilePopoverProps {
  documents?: Array<string>;
  isLinking: boolean;
  linkDocument?: UseMutateFunction<
    Response,
    Error,
    {
      isLinkUnlink: boolean;
      documents: string[];
    }
  >;
}

export const LinkFilePopover = forwardRef<ElementRef<'button'>, ILinkFilePopoverProps>(
  ({ documents, linkDocument, isLinking }, ref) => {
    const { knowledgeBase, setKnowledgeBase } = useContext(chatRoomContext);
    const [isOpen, setIsOpen] = useState(false);
    const { data: knowledgeBaseDocuments } = useQuery<IAPIDocumentsGetResults>({
      queryKey: ['app', 'documents'],
      queryFn: async ({ signal }) => {
        return await fetch(`/api/documents/get`, {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }).then((res) => res.json());
      },
      enabled: isOpen,
    });

    useEffect(() => {
      setKnowledgeBase &&
        setKnowledgeBase(
          (documents ?? []).reduce((acc: Record<string, boolean>, curr) => {
            acc[curr] = true;
            return acc;
          }, {})
        );
    }, [documents]);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger
                ref={ref}
                className='flex flex-row items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:cursor-pointer hover:bg-secondary sm:py-0.5'
              >
                {documents?.length === 0 && <span className='text-xs'>Link Documents to Chat</span>}
                <Link1Icon />
                {documents && documents.length > 3 && (
                  <span className='hidden text-xs font-medium lg:flex'>{documents.length - 3}</span>
                )}
                {documents && documents.length > 2 && (
                  <span className='hidden text-xs font-medium md:flex lg:hidden'>
                    {documents.length - 2}
                  </span>
                )}
                {documents && documents.length > 1 && (
                  <span className='hidden text-xs font-medium sm:flex md:hidden'>
                    {documents.length - 1}
                  </span>
                )}
                {documents && documents.length > 0 && (
                  <span className='flex text-xs font-medium sm:hidden'>{documents.length - 0}</span>
                )}
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent className='translate-y-1 rounded-md border border-border bg-secondary-foreground p-1 text-xs text-secondary shadow-sm'>
              <span>Link knowledge base documents to chat</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className='flex w-96 translate-y-1 flex-col gap-2 overflow-auto scrollbar-thin'>
          <span className='text-sm font-semibold'>Link Files to this Chat</span>
          <hr />
          <div className='flex flex-wrap gap-2'>
            {knowledgeBaseDocuments?.documents.map((document) => (
              <div
                key={document}
                className={cn(
                  'rounded-full bg-muted px-3 py-1.5 text-xs hover:cursor-pointer',
                  knowledgeBase?.[document] && 'bg-primary text-primary-foreground'
                )}
                onClick={() => {
                  setKnowledgeBase &&
                    setKnowledgeBase((prev) => ({ ...prev, [document]: !prev[document] }));
                }}
              >
                <span className='line-clamp-1'>{document}</span>
              </div>
            ))}
          </div>
          <div className='mt-4 flex w-full flex-row items-center justify-between'>
            {/* <Button variant='secondary'>
              <span>Cancel</span>
            </Button> */}
            <Button
              disabled={isLinking}
              className='ml-auto inline-flex h-min w-min items-center gap-2 px-3 py-1.5'
              onClick={() => {
                if (linkDocument) {
                  linkDocument({
                    isLinkUnlink: true,
                    documents: Object.entries(knowledgeBase ?? {})
                      .filter(([_title, linked]) => linked)
                      .map(([title, _linked]) => title),
                  });
                  linkDocument({
                    isLinkUnlink: false,
                    documents: Object.entries(knowledgeBase ?? {})
                      .filter(([_title, linked]) => !linked)
                      .map(([title, _linked]) => title),
                  });
                }
              }}
            >
              <Link1Icon />
              <span>Link documents</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
