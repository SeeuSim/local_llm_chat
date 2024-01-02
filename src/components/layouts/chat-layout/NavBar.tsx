import DarkModeToggle from './DarkModeToggle';
import { cn } from '@/lib/utils';

export const NavBar = () => {
	return (
		<nav className={cn('flex w-full border-b border-b-border')}>
			<div className='inline-flex w-full items-center justify-between p-3'>
				<h1 className='text-xl font-semibold'>LocaLLM</h1>
				<DarkModeToggle />
			</div>
		</nav>
	);
};
