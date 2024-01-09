import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

export const MarkdownComponent = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]} className={cn('', className)}>
      {children}
    </Markdown>
  );
};
