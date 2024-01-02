'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDarkMode } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const DarkModeToggle = () => {
  const { darkModePreference, setDarkModePreference } = useDarkMode();

  return (
    <Select value={darkModePreference ?? 'dark'} onValueChange={setDarkModePreference}>
      <SelectTrigger
        className={cn(
          'w-32 whitespace-nowrap rounded border border-border px-2 py-1',
          'shadow-none hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
        )}
      >
        <div className='inline-flex items-center gap-2'>
          <SunIcon className='flex h-4 w-4 dark:hidden' />
          <MoonIcon className='hidden h-4 w-4 dark:flex' />
          <SelectValue className='' />
        </div>
      </SelectTrigger>
      <SelectContent
        className={cn(
          'flex flex-col gap-1 rounded border border-border bg-primary-foreground',
          'shadow-none'
        )}
      >
        {['dark', 'light', 'system'].map((value, _index) => (
          <SelectItem
            value={value}
            key={value}
            className={cn(
              'flex flex-1 rounded bg-primary-foreground focus-visible:cursor-pointer',
              'focus-visible:bg-neutral-200/70 dark:focus-visible:bg-neutral-700'
            )}
          >
            <span>{value}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DarkModeToggle;
