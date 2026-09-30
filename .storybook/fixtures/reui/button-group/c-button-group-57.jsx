// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const modes = [
  {
    id: 'assist',
    label: 'Assist',
    icon: (
      <RegistryIcon
        lucide='MessageSquareIcon'
        className='size-3.5 opacity-60'
        aria-hidden='true'
      />
    )
  },
  {
    id: 'review',
    label: 'Review',
    icon: (
      <RegistryIcon
        lucide='ShieldCheckIcon'
        className='size-3.5 opacity-60'
        aria-hidden='true'
      />
    )
  },
  {
    id: 'auto',
    label: 'Auto',
    icon: (
      <RegistryIcon
        lucide='ZapIcon'
        className='size-3.5 opacity-60'
        aria-hidden='true'
      />
    )
  }
];
const limits = ['2k credits', '10k credits', 'Unlimited'];
export function Pattern() {
  const [active, setActive] = useState('review');
  const [limit, setLimit] = useState(limits[1]);
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant='outline'
          size='sm'
          className={cn('shrink-0 whitespace-nowrap', active === mode.id && 'bg-ui-muted')}
          onClick={() => setActive(mode.id)}
        >
          {mode.icon}
          {mode.label}
        </Button>
      ))}
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='shrink-0 gap-1.5 whitespace-nowrap text-xs'
            aria-label='Select credit cap'
          >
            {limit}
            <RegistryIcon
              lucide='ChevronDownIcon'
              className='size-3 opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuGroup>
            {limits.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
