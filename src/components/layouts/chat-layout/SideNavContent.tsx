import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pencil2Icon } from '@radix-ui/react-icons';

export const SideNavContent = () => {
  return (
    <div className='flex flex-col'>
      <Button
        variant='default'
        className={cn(
          'inline-flex items-center justify-between text-primary',
          'bg-neutral-200 hover:bg-neutral-300',
          'dark:bg-neutral-700 dark:hover:bg-neutral-600'
        )}
      >
        <span>New&nbsp;chat</span>
        <Pencil2Icon />
      </Button>
    </div>
  );
};
