import DarkModeToggle from './DarkModeToggle';
import { cn } from '@/lib/utils';

export const NavBar = () => {
  return (
    <nav className={cn('fixed top-0 flex w-full border-b border-b-border backdrop-blur-lg')}>
      <div className='inline-flex w-full items-center justify-between p-3'>
        <h1 className='text-xl font-bold'>LocaLLM</h1>
        <DarkModeToggle />
      </div>
    </nav>
  );
};
