'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FaceIcon, PersonIcon } from '@radix-ui/react-icons';

interface IChatMessageProps {
  role: 'system' | 'user';
  content: string;
}

export const ChatMessage = ({ role, content }: IChatMessageProps) => {
  return (
    <div className={cn('flex flex-col')}>
      <div className={cn('mb-1 flex flex-row items-center gap-2')}>
        <div
          className={cn(
            'rounded-md border border-border bg-primary-foreground p-2 text-primary',
            role === 'system' && 'bg-secondary text-secondary-foreground'
          )}
        >
          {role === 'system' ? <FaceIcon /> : <PersonIcon />}
        </div>
        <span className='text-sm font-bold'>{role === 'system' ? 'Model' : 'You'}</span>
      </div>
      <Card
        className={cn(
          'ml-5 flex w-full bg-card text-card-foreground',
          role === 'system' && 'bg-neutral-200 dark:bg-neutral-700'
        )}
      >
        <CardContent className='flex flex-col gap-2 px-3 py-2'>
          <span className={cn('prose prose-neutral text-sm')}>
            {role === 'user'
              ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mollis vulputate ipsum ut aliquam. Quisque blandit purus nec ipsum laoreet aliquet eu ac magna. Vivamus bibendum dictum ligula at dignissim.'
              : 'Maecenas eget libero et enim laoreet congue eu sed mi. Pellentesque faucibus vel diam id egestas. Integer feugiat vitae odio vel facilisis. Aenean metus justo, varius at tincidunt nec, pharetra dignissim ipsum. Pellentesque nec libero viverra arcu semper laoreet vitae eu est. Suspendisse potenti. Ut enim orci, consectetur iaculis condimentum at, sollicitudin sed nisl. Vivamus congue urna vitae ipsum cursus sodales eget at ipsum. Aliquam dictum velit eu nulla eleifend iaculis.'}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};
