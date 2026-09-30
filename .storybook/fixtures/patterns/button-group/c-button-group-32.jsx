'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [view, setView] = useState('list');
  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label='Sort'>
            <RegistryIcon lucide='ListFilterIcon' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='min-w-40'>
          <DropdownMenuItem>Newest</DropdownMenuItem>
          <DropdownMenuItem>Oldest</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Recently Updated</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroup>
        <Button
          variant='outline'
          size='icon'
          className={cn(view === 'grid' && 'bg-ui-muted')}
          onClick={() => setView('grid')}
          aria-label='Grid view'
        >
          <RegistryIcon lucide='LayoutGridIcon' aria-hidden='true' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className={cn(view === 'list' && 'bg-ui-muted')}
          onClick={() => setView('list')}
          aria-label='List view'
        >
          <RegistryIcon lucide='ListIcon' aria-hidden='true' />
        </Button>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Add New...
            <RegistryIcon
              lucide='ChevronDownIcon'
              aria-hidden='true'
              className='opacity-60'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-40'>
          <DropdownMenuItem>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            Domain
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
