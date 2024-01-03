'use client';

import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

export const FileDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [files, setFiles] = useState<Array<File>>([]);

  const isSubmitDisabled = useMemo(() => {
    return files === null || files.length === 0;
  }, [files]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: 'secondary' }), 'inline-flex items-center gap-2')}
      >
        <span className='sr-only'>Upload a document</span>
        <UploadIcon className='shrink-0 grow-0' />
      </PopoverTrigger>
      <PopoverContent className='flex w-96 flex-col gap-2'>
        <div className='flex flex-col'>
          <h1 className='font-semibold'>Upload file(s) to vector store</h1>
          <hr className='border border-border' />
        </div>
        <Input
          type='file'
          multiple
          accept='application/pdf'
          onChange={(event) => {
            if (event.target.files !== null) {
              const newFiles: Array<File> = [];
              for (let i = 0; i < event.target.files.length; i++) {
                const newFile = event.target.files.item(i);
                if (newFile === null || newFile === undefined) {
                  continue;
                }
                newFiles.push(newFile);
              }
              setFiles([...files, ...newFiles]);
            }
          }}
          className={cn(
            'w-[calc(26*4px)] bg-border pl-0.5 pt-1.5 text-sm',
            'file:rounded-md file:bg-neutral-300 file:font-medium file:text-primary-foreground',
            'file:mb-3 file:ml-0.5 file:mr-4 file:placeholder:text-primary',
            'file:hover:cursor-pointer file:hover:bg-neutral-200'
          )}
        />
        <div className='flex flex-wrap gap-2'>
          {files.map((v, index) => {
            return (
              v !== null && (
                <div
                  key={v.name}
                  className={cn(
                    'inline-flex w-min items-center gap-2 truncate rounded-full bg-secondary-foreground px-2 py-1 text-xs text-secondary',
                    index % 2 === 0 ? 'max-w-[66%]' : 'max-w-[33%]'
                  )}
                >
                  <span className={cn('flex-1 truncate')}>{v.name}</span>
                  <Button
                    disabled={isSubmitDisabled}
                    onClick={() => {
                      const v = [...files];
                      v.splice(index, 1);
                      setFiles(v);
                    }}
                    className='h-min w-min self-center border-0 bg-transparent p-0 text-secondary shadow-none duration-300 ease-in-out hover:scale-125 hover:cursor-pointer hover:bg-transparent hover:text-red-500 disabled:cursor-not-allowed'
                  >
                    <Cross2Icon />
                  </Button>
                </div>
              )
            );
          })}
        </div>
        <div className='mt-4 inline-flex justify-between'>
          <Button
            variant='secondary'
            onClick={() => {
              setFiles([]);
              setIsOpen(false);
            }}
            className='w-min whitespace-nowrap'
          >
            <span>Cancel</span>
          </Button>
          <Button
            disabled={isSubmitDisabled}
            onClick={() => {}}
            className='inline-flex w-min items-center gap-2 whitespace-nowrap disabled:cursor-not-allowed'
          >
            <span>Upload Document{files.length > 1 && 's'}</span>
            <UploadIcon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
