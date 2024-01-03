import { LaptopIcon, MobileIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

export const DARK_MODE_OPTIONS = [
  { label: 'dark', icon: <MoonIcon /> },

  { label: 'light', icon: <SunIcon /> },

  {
    label: 'system',
    icon: (
      <>
        <MobileIcon className='flex sm:hidden' />
        <LaptopIcon className='hidden sm:flex' />
      </>
    ),
  },
];
