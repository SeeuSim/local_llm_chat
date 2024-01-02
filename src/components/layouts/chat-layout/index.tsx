import { cn } from '@/lib/utils';
import { NavBar } from './NavBar';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
	return (
		<main className={cn('flex h-screen flex-col bg-primary-foreground text-primary')}>
			<NavBar />
			<div className='p-4'>{children}</div>
		</main>
	);
};

export default ChatLayout;
