// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  {
    id: 'Routes',
    label: 'Routes',
    icon: (
      <RegistryIcon
        lucide='RouteIcon'
        aria-hidden='true'
        className='size-3.5 opacity-60'
      />
    )
  },
  {
    id: 'Paths',
    label: 'Paths',
    icon: (
      <RegistryIcon
        lucide='WaypointsIcon'
        aria-hidden='true'
        className='size-3.5 opacity-60'
      />
    )
  },
  {
    id: 'Bot Name',
    label: 'Bot Name',
    icon: (
      <RegistryIcon
        lucide='BotIcon'
        aria-hidden='true'
        className='size-3.5 opacity-60'
      />
    )
  }
];
export function Pattern() {
  const [active, setActive] = useState('Paths');
  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item.id}
          variant='outline'
          className={cn('max-sm:px-2.5', active === item.id && 'bg-ui-muted')}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='Show options' variant='outline' size='icon'>
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-40'>
          <DropdownMenuItem>Filter by Group</DropdownMenuItem>
          <DropdownMenuItem>Sort by Name</DropdownMenuItem>
          <DropdownMenuItem>Export Data</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
