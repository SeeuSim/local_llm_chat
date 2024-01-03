import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface IRoomLinkProps {
  id: string;
  summary: string;
  // TBC
  lastModified?: any;
}

export const RoomLink = ({ summary }: IRoomLinkProps) => {
  return (
    <Button
      variant='link'
      className={cn(
        'inline-flex justify-between rounded-md px-2 py-1.5 hover:no-underline',
        'hover:bg-secondary'
      )}
    >
      <span className='text-sm font-normal'>{summary}</span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil1Icon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TrashIcon />
            <span>Delete Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Button>
  );
};
