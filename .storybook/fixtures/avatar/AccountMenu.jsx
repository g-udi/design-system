import { useState } from 'react';
import { Avatar } from '../../../src/components/core/Avatar/index.js';
import { default as Button } from '../../../src/components/core/Button/index.js';
import { default as DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../../src/components/core/DropdownMenu/index.js';

export function AccountMenu() {
  const [selection, setSelection] = useState('No account action selected.');
  return (
    <div className='grid max-w-full justify-items-start gap-4'>
      <DropdownMenu trigger={
        <Button variant='outline' tone='neutral' className='max-w-full gap-3 px-3' aria-label='Account menu for Maya Chen'>
          <Avatar name='Maya Chen' src='https://randomuser.me/api/portraits/women/44.jpg' shape='circle' tone='teal' alt='' />
          <span className='min-w-0 text-left'><span className='block truncate'>Maya Chen</span><span className='block text-xs font-normal text-ui-muted-foreground'>Personal workspace</span></span>
        </Button>
      }>
        <DropdownMenuLabel>Maya Chen</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setSelection('Profile selected for Maya Chen.')}>View profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelection('Workspace settings selected.')}>Workspace settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setSelection('Switched to the editorial workspace.')}>Switch workspace</DropdownMenuItem>
      </DropdownMenu>
      <p role='status' className='text-sm text-ui-muted-foreground'>{selection}</p>
    </div>
  );
}
