'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useRef, useState } from 'react';

interface DropzoneProps {
  files: Array<File>;
  setFiles: React.Dispatch<React.SetStateAction<Array<File>>>;
  className?: string;
  fileExtension?: string;
  blockInteraction: boolean;
}

export function Dropzone({
  files,
  setFiles,
  className,
  fileExtension,
  blockInteraction,
}: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const uploadedFile = files.item(i);
      if (uploadedFile === null) {
        return;
      }
      // Check file extension
      if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
        setError(`Invalid file type. Expected: .${fileExtension}`);
        return;
      }
      // Display file information
      setFiles((prev) => [...prev, uploadedFile]);
      setError(null); // Reset error state
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Card
        className={cn(
          'border border-dashed bg-muted shadow-none hover:border-muted-foreground/50',
          className
        )}
      >
        <CardContent
          className='mx-auto flex flex-col items-center justify-center gap-2 pb-0 pt-3 text-xs'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className='flex items-center justify-center gap-2 text-muted-foreground'>
            <span className='font-medium'>Drag Files here to Upload or</span>
            <Button
              disabled={blockInteraction}
              variant='default'
              size='sm'
              className='flex h-6 gap-2 px-1 text-xs disabled:focus-visible:cursor-not-allowed'
              onClick={handleButtonClick}
            >
              Click Here
            </Button>
            <Button
              disabled={blockInteraction || files.length === 0}
              variant={'destructive'}
              size='sm'
              className='ml-4 flex h-6 gap-2 px-1 text-xs disabled:focus-visible:cursor-not-allowed'
              onClick={() => setFiles([])}
            >
              Clear all files
            </Button>
            <input
              disabled={blockInteraction}
              ref={fileInputRef}
              type='file'
              onChange={handleFileInputChange}
              className='hidden'
              multiple
              // Set accepted file type
              accept={`.${fileExtension}`}
            />
          </div>
          <div className='flex max-w-[calc(100vw-72px)] flex-1 flex-row gap-2 overflow-y-auto pb-2 scrollbar-thin scrollbar-track-inherit scrollbar-thumb-muted-foreground sm:max-w-[calc(100vw-320px)] md:max-w-[calc(100vw-192px-160px)]'>
            {files.map((file, index) => (
              <div
                key={file.name}
                className={cn(
                  'inline-flex w-min flex-shrink-0 items-center gap-2 truncate rounded-full bg-secondary-foreground px-2 py-1 text-xs text-secondary',
                  'max-w-[200px]',
                  blockInteraction && 'bg-muted text-muted-foreground'
                )}
              >
                <span className={cn('flex-1 truncate')}>{file.name}</span>
                <Button
                  disabled={blockInteraction}
                  onClick={() => {
                    const v = [...files];
                    v.splice(index, 1);
                    setFiles(v);
                  }}
                  className={cn(
                    'h-min w-min self-center border-0 bg-transparent p-0 text-secondary shadow-none duration-300 ease-in-out hover:scale-125 hover:cursor-pointer hover:bg-transparent hover:text-red-500 disabled:cursor-not-allowed',
                    'disabled:text-muted-foreground'
                  )}
                >
                  <Cross2Icon />
                </Button>
              </div>
            ))}
          </div>
          {error && <span className='font-medium text-red-500'>{error}</span>}
        </CardContent>
      </Card>
    </>
  );
}
