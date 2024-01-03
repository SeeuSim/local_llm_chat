import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HamburgerMenuIcon, PinLeftIcon } from '@radix-ui/react-icons';
import { SideNavContent } from './SideNavContent';

export const MobileSideNav = () => {
  return (
    <Sheet>
      <SheetTrigger className='flex rounded-md p-1 hover:bg-secondary sm:hidden'>
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side='left' className='flex max-w-[160px] flex-col px-3'>
        <div className='relative z-50 flex translate-y-[-6px] bg-inherit'>
          <SheetClose className='absolute left-0 top-0.5 mr-auto rounded-md p-1 hover:bg-secondary'>
            <PinLeftIcon />
          </SheetClose>
          <h1 className='ml-auto text-xl font-bold'>LocaLLM</h1>
        </div>
        <hr className='border border-border' />
        <SideNavContent />
      </SheetContent>
    </Sheet>
  );
};
