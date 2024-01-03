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
    <div className={cn('flex flex-row gap-4', role === 'user' && 'flex-row-reverse')}>
      <div className={cn('mb-auto mt-2 flex flex-col items-center gap-2')}>
        {role === 'system' ? <FaceIcon /> : <PersonIcon />}
        <span className='text-sm font-bold'>{role === 'system' ? 'Model' : 'You'}</span>
      </div>
      <Card className='flex w-full bg-card text-card-foreground'>
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
