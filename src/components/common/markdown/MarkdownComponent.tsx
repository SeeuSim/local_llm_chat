/* eslint react/no-children-prop: 0 */

import 'katex/dist/katex.min.css';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CopyIcon } from '@radix-ui/react-icons';

export const MarkdownComponent = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const { toast } = useToast();
  return (
    <Markdown
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[remarkMath, remarkGfm]}
      className={cn('', className)}
      components={{
        code({ children, className, node, ...rest }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <div className='flex flex-col'>
              <div className='inline-flex translate-y-[10px] items-center justify-between rounded-t-sm bg-gray-700 p-1 text-sm'>
                <span className='px-2'>{match[1]}</span>
                <Button
                  variant='ghost'
                  className='flex h-6 flex-row gap-2 font-sans'
                  onClick={() => {
                    navigator.clipboard.writeText(String(children));
                    toast({ title: 'Code copied!' });
                  }}
                >
                  <span>Copy</span>
                  <CopyIcon />
                </Button>
              </div>
              <SyntaxHighlighter
                {...rest}
                ref={null}
                PreTag='div'
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                className='rounded-t-none'
                style={oneDark}
              />
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
};
