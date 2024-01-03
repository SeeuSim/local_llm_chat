import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return <h1 className={cn('text-xl font-bold', className)}>LocaLLM</h1>;
};
